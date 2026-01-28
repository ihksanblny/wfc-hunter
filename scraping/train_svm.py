import pandas as pd
import re
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVC
from sklearn.metrics import classification_report, accuracy_score
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory # <--- Tambahan

# Inisialisasi Stemmer Sastrawi
factory = StemmerFactory()
stemmer = factory.create_stemmer()

# --- KONFIGURASI ---
INPUT_FILE = "reviews_label.csv"
NEW_DATA_FILE = "reviews_new_label.csv"
MODEL_FILE = "svm_model.pkl"
VECTORIZER_FILE = "tfidf_vectorizer.pkl"

# Stopwords (Disesuaikan untuk kata dasar)
STOPWORDS = set([
    "dan", "di", "ke", "dari", "yang", "ini", "itu", "untuk", "pada", "adalah",
    "sebagai", "dengan", "karena", "bisa", "ada", "saya", "aku", "kamu", "dia",
    "mereka", "kita", "tp", "yg", "ga", "gak", "nggak", "kalo", "kl", "dr", "sm",
    "sama", "sudah", "telah", "akan", "sedang", "juga", "saja", "lagi", "bgt", "banget",
    "aja", "udah", "dah", "nih", "tuh", "kok", "sih", "ya", "oke", "ok", "si"
])

def clean_text(text):
    if not isinstance(text, str): return ""
    # 1. Lowercase & Hapus Karakter Spesial
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 2. Stemming (Mengubah ke kata dasar)
    # Catatan: Proses ini agak lambat, tapi hasilnya lebih akurat
    text = stemmer.stem(text)
    
    # 3. Hapus Stopwords
    words = text.split()
    words = [w for w in words if w not in STOPWORDS]
    return " ".join(words)

# ... (sisanya sama seperti sebelumnya)

def main():
    # --- PROSES PENGGABUNGAN DATA ---
    if os.path.exists(NEW_DATA_FILE):
        print(f"🔄 Menemukan data baru di {NEW_DATA_FILE}. Menggabungkan...")
        try:
            df_old = pd.read_csv(INPUT_FILE, sep=None, engine='python')
            df_new = pd.read_csv(NEW_DATA_FILE, sep=None, engine='python')
            
            # Gabung dan hapus duplikat berdasarkan teks review
            df_combined = pd.concat([df_old, df_new], ignore_index=True)
            df_combined = df_combined.drop_duplicates(subset=['review_text'])
            
            # Simpan kembali ke file utama
            df_combined.to_csv(INPUT_FILE, index=False)
            print(f"✅ Data berhasil digabung. Total data sekarang: {len(df_combined)} baris.")
        except Exception as e:
            print(f"⚠️ Gagal menggabungkan data: {e}")
    
    # --- PROSES TRAINING ---
    print(f"📂 Membaca data dari {INPUT_FILE}...")
    try:
        df = pd.read_csv(INPUT_FILE, sep=None, engine='python')
    except Exception as e:
        print(f"❌ Gagal baca file: {e}")
        return

    label_col = None
    for col in df.columns:
        if 'label' in col.lower():
            label_col = col
            break
    
    if not label_col:
        print("❌ Kolom 'Label' tidak ditemukan!")
        return

    df = df.dropna(subset=[label_col])
    df = df[df[label_col].astype(str).str.strip() != ""]
    
    print(f"✅ Data siap training: {len(df)} baris.")

    print("⚙️ Sedang memproses teks...")
    df['clean_text'] = df['review_text'].apply(clean_text)
    
    # Tuning TF-IDF
    vectorizer = TfidfVectorizer(
        max_features=1000, 
        ngram_range=(1, 2), 
        min_df=2, 
        max_df=0.8,
        sublinear_tf=True
    )
    X = vectorizer.fit_transform(df['clean_text'])
    y = df[label_col]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("🚀 Mencari settingan AI terbaik (GridSearch)...")
    param_grid = {
        'C': [0.1, 1, 10, 100],
        'kernel': ['linear']
    }
    grid = GridSearchCV(SVC(kernel='linear', probability=True, class_weight='balanced'), param_grid, refit=True, cv=5, verbose=0)
    grid.fit(X_train, y_train)
    
    svm = grid.best_estimator_
    print(f"✅ Settingan terbaik ditemukan: C={grid.best_params_['C']}")

    print("\n📊 Hasil Akurasi Terbaru:")
    y_pred = svm.predict(X_test)
    print(classification_report(y_test, y_pred))
    print(f"🎯 Akurasi Keseluruhan: {accuracy_score(y_test, y_pred) * 100:.2f}%")

    with open(MODEL_FILE, 'wb') as f: pickle.dump(svm, f)
    with open(VECTORIZER_FILE, 'wb') as f: pickle.dump(vectorizer, f)
    print(f"\n✅ Model berhasil diperbarui: {MODEL_FILE}")

if __name__ == "__main__":
    main()