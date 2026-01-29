import pandas as pd
import pickle
import json
import re
import os

# --- KONFIGURASI ---
MODEL_FILE = "svm_model.pkl"
VECTORIZER_FILE = "tfidf_vectorizer.pkl"
OUTPUT_JSON = "../web/src/data/cafes_processed.json"

# --- MANUAL FIXES UNTUK KOORDINAT YANG SALAH DI CSV ---
COORDINATE_FIXES = {
    "Ada Apa Dengan Kopi (AADK) Bandung Malang - Coffee & Eatery": ("-7.9614", "112.6213"),
    "Roketto Coffee & Co": ("-7.9424", "112.6205"),
    "RILO Coffee and Space": ("-7.9481", "112.6174"),
    "JOKOPI - Malang": ("-7.9426", "112.6216"),
    "KAF Cafe": ("-7.9504", "112.6138"),
    "nowhere coffee": ("-7.9472", "112.6165"),
    "Toko Kopi TUKU - Malang": ("-7.9658", "112.6275"),
    "Muraco Headquarter": ("-7.9435", "112.6198"),
    "Ki.Rei Coffee and Eatery": ("-7.9311", "112.6220"),
    "Nakoa": ("-7.9362", "112.6222")
}

def clean_text(text):
    """Pembersihan untuk input AI (Sangat agresif)"""
    if not isinstance(text, str): return ""
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    return text.strip()

def clean_display_review(text):
    """Pembersihan untuk tampilan di Web"""
    if not isinstance(text, str): return ""
    text = re.sub(r'\(Ulasan ini ditulis pasca Terjemahan dari bahasa .*?\)', '', text)
    text = re.sub(r'\(Diterjemahkan oleh Google\)', '', text)
    text = re.sub(r'::: Hello, I\'m Just a Sweet Reviewer .*? TBH >', '', text)
    text = re.sub(r'^[^\w\s]+', '', text)
    text = "".join(c for c in text if c.isprintable())
    return text.strip()

def clean_coordinate(coord, is_lat=True):
    """Memperbaiki format koordinat yang salah (banyak titik)"""
    if not coord or str(coord).lower() == 'nan' or coord == 0:
        return "0"
    
    # Hapus semua titik
    s = str(coord).replace('.', '')
    
    if not s or s == '-': return "0"
    
    # Logika untuk Malang: 
    # Lat: -7.xxxx (1 digit di depan titik)
    # Lng: 112.xxxx (3 digit di depan titik)
    if is_lat:
        if s.startswith('-'):
            return s[:2] + "." + s[2:]
        else:
            return s[:1] + "." + s[1:]
    else:
        return s[:3] + "." + s[3:]

def read_csv_safely(file_path):
    """Membaca CSV dengan deteksi separator yang lebih kuat dan mencegah pergeseran kolom"""
    if not os.path.exists(file_path):
        return None
    
    print(f"📂 Membaca {file_path}...")
    # Coba deteksi separator secara manual dari baris pertama
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        first_line = f.readline()
        sep = ';' if ';' in first_line else ','
    
    # Baca dengan index_col=False untuk mencegah pergeseran
    df = pd.read_csv(file_path, sep=sep, engine='python', encoding='utf-8-sig', index_col=False)
    
    # Hapus kolom 'Unnamed' yang biasanya muncul karena trailing separator (;)
    df = df.loc[:, ~df.columns.str.contains('^Unnamed')]
    
    return df

def main():
    print("⏳ Memuat Model & Data...")
    with open(MODEL_FILE, 'rb') as f: svm = pickle.load(f)
    with open(VECTORIZER_FILE, 'rb') as f: vectorizer = pickle.load(f)
    
    # --- PROSES GABUNG MULTIPLE CSV ---
    files_to_read = ["reviews_label.csv", "reviews_new_label.csv"]
    all_dfs = []
    
    for file in files_to_read:
        df_temp = read_csv_safely(file)
        if df_temp is not None:
            all_dfs.append(df_temp)
    
    if not all_dfs:
        print("❌ Tidak ada data CSV yang valid!")
        return
        
    # Gabungkan semua
    df = pd.concat(all_dfs, ignore_index=True)
    
    # Pastikan kolom yang dibutuhkan ada
    required_cols = ['shop_id', 'shop_name', 'review_text', 'rating']
    for col in required_cols:
        if col not in df.columns:
            print(f"❌ Error: Kolom '{col}' tidak ditemukan di CSV!")
            return

    # Hapus duplikat berdasarkan teks review
    df = df.drop_duplicates(subset=['review_text'])
    
    # --- MEMBERSIHKAN DATA DARI NaN ---
    df['review_name'] = df['review_name'].fillna("Anonim")
    df['review_text'] = df['review_text'].fillna("")
    df['rating'] = pd.to_numeric(df['rating'], errors='coerce').fillna(0)
    df['review_date'] = df['review_date'].fillna("-")
    df['latitude'] = df['latitude'].fillna(0)
    df['longitude'] = df['longitude'].fillna(0)
    
    print(f"✅ Total data unik yang akan dianalisa: {len(df)} baris.")
    
    # --- LANJUT PROSES AI ---
    print("🤖 AI sedang menganalisa seluruh review...")
    df['clean_text'] = df['review_text'].apply(clean_text)
    tfidf_matrix = vectorizer.transform(df['clean_text'])
    df['prediksi'] = svm.predict(tfidf_matrix)
    
    # 2. Grouping per Kafe
    cafes = []
    grouped = df.groupby('shop_id')
    
    for shop_id, group in grouped:
        # Ambil nama toko yang paling sering muncul (untuk jaga-jaga jika ada typo)
        shop_name = group['shop_name'].mode()[0] if not group['shop_name'].empty else "Unknown Cafe"
        
        # Hitung persentase label (Skala 0-100)
        counts = group['prediksi'].value_counts(normalize=True) * 100
        nugas_score = round(counts.get('Nugas', 0), 1)
        kerja_score = round(counts.get('Kerja', 0), 1)
        nongkrong_score = round(counts.get('Nongkrong', 0), 1)
        
        # Tentukan "Best For" (Ambil yang skornya > 40%)
        best_for = []
        if nugas_score > 40: best_for.append("Nugas")
        if kerja_score > 40: best_for.append("Kerja")
        if nongkrong_score > 40: best_for.append("Nongkrong")
        
        reviews_list = []
        for _, row in group.head(3).iterrows():
            display_text = clean_display_review(row['review_text'])
            if not display_text: display_text = str(row['review_text'])[:100] + "..."

            reviews_list.append({
                "user": str(row['review_name']),
                "text": display_text,
                "rating": float(row['rating']),
                "date": str(row['review_date'])
            })
            
        # Cek apakah ada manual fix untuk koordinat
        if shop_name in COORDINATE_FIXES:
            lat, lng = COORDINATE_FIXES[shop_name]
        else:
            valid_lats = group[group['latitude'] != 0]['latitude']
            valid_lngs = group[group['longitude'] != 0]['longitude']
            lat_raw = valid_lats.iloc[0] if not valid_lats.empty else 0
            lng_raw = valid_lngs.iloc[0] if not valid_lngs.empty else 0
            
            lat = clean_coordinate(lat_raw, is_lat=True)
            lng = clean_coordinate(lng_raw, is_lat=False)
            
        cafes.append({
            "shop_id": str(shop_id),
            "shop_name": str(shop_name),
            "nugas_score": nugas_score,
            "kerja_score": kerja_score,
            "nongkrong_score": nongkrong_score,
            "rating_avg": round(group['rating'].mean(), 1),
            "summary": f"Kafe ini dianalisa oleh AI cocok untuk {', '.join(best_for)}." if best_for else "Kafe ini sedang dianalisa lebih lanjut.",
            "best_for": best_for,
            "latitude": lat,
            "longitude": lng,
            "reviews_list": reviews_list
        })
    
    # Simpan ke JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(cafes, f, indent=2, ensure_ascii=False)
        
    print(f"✅ Berhasil! Data web diperbarui di: {OUTPUT_JSON}")

if __name__ == "__main__":
    main()