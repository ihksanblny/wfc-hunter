import pandas as pd
import pickle
import re
import numpy as np

# --- KONFIGURASI ---
DATA_FILE = "reviews_label.csv"
MODEL_FILE = "svm_model.pkl"
VECTORIZER_FILE = "tfidf_vectorizer.pkl"

def clean_text(text):
    if not isinstance(text, str): return ""
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    return text.strip()

def main():
    print("⏳ Loading Model & Data...")
    
    with open(MODEL_FILE, 'rb') as f: svm = pickle.load(f)
    with open(VECTORIZER_FILE, 'rb') as f: vectorizer = pickle.load(f)
    
    df = pd.read_csv(DATA_FILE, sep=None, engine='python')
    
    # Hitung Rata-Rata Rating per Kafe dulu biar valid
    avg_ratings = df.groupby('shop_name')['rating'].mean().to_dict()
    
    print("🤖 AI sedang menganalisa seluruh kafe...")
    
    df['clean_text'] = df['review_text'].apply(clean_text)
    tfidf_matrix = vectorizer.transform(df['clean_text'])
    
    # Prediksi Label
    df['prediksi_label'] = svm.predict(tfidf_matrix)
    
    # Ambil Decision Function (Skor Mentah)
    # Ini akan mengembalikan skor untuk setiap kelas [Skor_Kerja, Skor_Nongkrong, Skor_Nugas]
    decision_scores = svm.decision_function(tfidf_matrix)
    
    print("\n✅ Analisa Selesai!")
    print("="*60)
    
    while True:
        print("\n🔍 Mau cari tempat apa? (Ketik: Nugas / Kerja / Nongkrong)")
        print("   (Ketik 'exit' untuk keluar)")
        user_request = input("👉 Jawaban kamu: ").strip()
        
        if user_request.lower() == 'exit': break
            
        target_label = user_request.capitalize()
        
        if target_label not in svm.classes_:
            print(f"⚠️ Maaf, kategori tidak dikenal. Pilih: {svm.classes_}")
            continue

        # Cari index kolom untuk label yang diminta user
        label_idx = list(svm.classes_).index(target_label)
        
        # Ambil skor spesifik untuk label tersebut
        # Jika skor > 0 artinya SESUAI (menurut SVM)
        # Jika skor < 0 artinya TIDAK SESUAI
        scores = decision_scores[:, label_idx]
        
        # Buat DataFrame hasil analisa
        result_df = df.copy()
        result_df['decision_score'] = scores
        result_df['avg_rating'] = result_df['shop_name'].map(avg_ratings)
        
        # Tentukan Label SESUAI / TIDAK SESUAI
        # Kita pakai threshold 0 (standar SVM). >0 berarti masuk kelas itu.
        result_df['status'] = result_df['decision_score'].apply(lambda x: "SESUAI" if x > 0 else "TIDAK SESUAI")
        
        # Filter & Sorting
        # Kita tampilkan semua dulu biar kelihatan bedanya (sesuai request gambar kamu)
        # Urutkan dari skor tertinggi
        result_df = result_df.sort_values(by='decision_score', ascending=False)
        
        print(f"\n🔴 HASIL DECISION-BASED (Kategori: {target_label.upper()})")
        print("-" * 85)
        print(f"{'COFFEESHOP':<30} | {'LABEL':<12} | {'DECISION SCORE':<15} | {'RATING AVG':<10}")
        print("-" * 85)
        
        shown_cafes = set()
        count = 0
        
        for _, row in result_df.iterrows():
            nama = row['shop_name']
            if nama in shown_cafes: continue
            
            # Format skor ada tanda + atau -
            score_fmt = f"{row['decision_score']:+.2f}"
            
            print(f"{nama[:28]:<30} | {row['status']:<12} | {score_fmt:<15} | {row['avg_rating']:.1f}")
            
            shown_cafes.add(nama)
            count += 1
            if count >= 10: break # Tampilkan 10 teratas saja
            
        print("-" * 85)
        print("📌 Catatan: Hanya yang berlabel 'SESUAI' yang akan direkomendasikan ke user.")

if __name__ == "__main__":
    main()