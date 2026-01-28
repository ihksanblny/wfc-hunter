import time
import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Baca URL dari file urls.txt
try:
    with open("urls.txt", "r") as f:
        URLS = [line.strip() for line in f if line.strip()]
except FileNotFoundError:
    print("❌ File urls.txt tidak ditemukan! Buat file urls.txt dan isi dengan link Google Maps.")
    exit()

OUTPUT_FILE = "reviews_new.csv"

options = webdriver.ChromeOptions()
options.add_argument("--user-data-dir=C:/chrome-selenium-clean")
options.add_argument("--start-maximized")
# Hapus user-agent mobile agar tampilan desktop normal
# options.add_argument("user-agent=...") 

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, 25)

for i, URL in enumerate(URLS):
    print(f"\n🚀 [{i+1}/{len(URLS)}] Memproses URL: {URL}")
    
    try:
        print(f"🌐 Membuka URL...")
        driver.get(URL)
        time.sleep(3)
        
        # ================= WAIT FOR PLACE DETAILS =================
        try:
            # Tunggu sampai nama tempat muncul (h1)
            print("⏳ Menunggu detail tempat dimuat...")
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
            print("✅ Detail tempat dimuat")
        except:
            print("⚠️ Judul tempat tidak muncul, mungkin perlu login atau terdeteksi bot.")
        time.sleep(3)
        
        # ================= CLOSE "OPEN APP" MODAL =================
        try:
            # Coba cari elemen dengan text "Tetap gunakan web" (bisa button, div, atau span)
            tetap_web_btn = wait.until(
                EC.element_to_be_clickable(
                    (By.XPATH, '//*[contains(text(), "Tetap gunakan web")]')
                )
            )
            tetap_web_btn.click()
            print("✅ Modal 'Tetap gunakan web' ditutup")
            time.sleep(2)
        except Exception as e:
            print(f"ℹ️ Modal tidak muncul atau gagal ditutup: {e}")
        
        # ================= OPEN REVIEW TAB =================
        try:
            print("⏳ Menunggu tab Ulasan...")
            time.sleep(3)
            
            # Cek apakah kita ada di mode "Overlay Card"
            try:
                title_el = driver.find_element(By.TAG_NAME, "h1")
                if title_el.is_displayed():
                    print(f"ℹ️ Ditemukan Judul: {title_el.text}")
                    # Cek apakah tombol Ulasan sudah ada?
                    reviews_tab_visible = False
                    try:
                        driver.find_element(By.XPATH, '//button[contains(text(), "Ulasan")]')
                        reviews_tab_visible = True
                    except:
                        pass
                    
                    if not reviews_tab_visible:
                        print("   ⚠️ Tombol Ulasan belum terlihat, mencoba klik Judul untuk membuka detail penuh...")
                        title_el.click()
                        time.sleep(3)
            except:
                pass
        
            # Cari tombol Ulasan
            xpath_candidates = [
                '//button[contains(text(), "Ulasan")]',
                '//button[contains(text(), "Reviews")]', 
                '//div[contains(text(), "Ulasan")]',
                '//div[contains(text(), "Reviews")]',
                '//span[contains(text(), "Ulasan")]',
                '//*[@aria-label="Ulasan"]',
                '//button[contains(@aria-label, "Ulasan")]'
            ]
            
            found = False
            for xpath in xpath_candidates:
                try:
                    elements = driver.find_elements(By.XPATH, xpath)
                    # print(f"   🔎 Mencoba xpath: {xpath} | Ditemukan: {len(elements)}")
                    
                    for el in elements:
                        if el.is_displayed() and el.is_enabled():
                            try:
                                driver.execute_script("arguments[0].click();", el)
                                print("   ✅ Berhasil klik elemen Ulasan via JavaScript")
                                found = True
                                break
                            except:
                                el.click()
                                print("   ✅ Berhasil klik elemen Ulasan via Click biasa")
                                found = True
                                break
                    if found: break
                except:
                    continue
                    
            if not found:
                print("⚠️ Tidak dapat menemukan tombol Ulasan, skip URL ini.")
                continue # Skip ke URL berikutnya
        
        except Exception as e:
            print(f"❌ Gagal membuka tab Ulasan: {e}")
            continue # Skip ke URL berikutnya
        
        time.sleep(3)
        
        # ================= GET SHOP DETAILS =================
        shop_name = ""
        shop_id = ""
        try:
            print("🏠 Mengambil detail shop...")
            
            # Strategi 1: Coba ambil dari Title Browser (Paling Akurat biasanya)
            # Format biasanya: "Nama Toko - Google Maps"
            page_title = driver.title
            if " - Google Maps" in page_title:
                shop_name = page_title.replace(" - Google Maps", "").strip()
            
            # Strategi 2: Jika Title masih "Google Maps" atau kosong (misal belum load), cari di elemen H1
            if not shop_name or shop_name == "Google Maps":
                candidates = driver.find_elements(By.TAG_NAME, "h1")
                for h in candidates:
                    txt = h.text.strip()
                    if txt and txt.lower() != "hasil" and txt.lower() != "google maps":
                        shop_name = txt
                        break
            
            # Strategi 3: Cari elemen heading spesifik di overlay (biasanya class DUwDvf atau fontHeadlineLarge)
            if not shop_name:
                try:
                    overlay_title = driver.find_element(By.XPATH, '//div[contains(@class, "DUwDvf")]')
                    if overlay_title.text.strip():
                        shop_name = overlay_title.text.strip()
                except:
                    pass
        
            print(f"🏠 Shop Name Found: {shop_name}")
            
            # Extract shop_id from URL (CID/Place ID)
            import re
            match = re.search(r'(0x[0-9a-f]+:0x[0-9a-f]+)', driver.current_url)
            if match:
                shop_id = match.group(1)
            else:
                shop_id = str(hash(shop_name))
            print(f"🆔 Shop ID: {shop_id}")
        
            # Extract Lat/Long from URL
            # Format URL biasanya: .../@-7.9674742,112.612362,17z...
            lat, long = "", ""
            coords_match = re.search(r'@([-0-9.]+),([-0-9.]+)', driver.current_url)
            if coords_match:
                lat = coords_match.group(1)
                long = coords_match.group(2)
                print(f"📍 Koordinat: {lat}, {long}")
            else:
                print("⚠️ Koordinat tidak ditemukan di URL")
        
        except Exception as e:
            print(f"⚠️ Gagal mengambil detail shop: {e}")
        
        # ================= SCROLL PAGE =================
        print("📜 Mulai scroll...")
        try:
            # Cari container yang bisa discroll. 
            scrollable_div = None
            try:
                first_review = driver.find_element(By.XPATH, '//div[contains(@class,"jftiEf")]')
                scrollable_div = first_review.find_element(By.XPATH, './../..') 
            except:
                pass
        
            if scrollable_div:
                print("   ✅ Container scroll ditemukan, melakukan scroll...")
                # Loop scroll secukupnya saja
                # Kita butuh sekitar 30 review. 1x scroll biasanya load 10-20 review.
                # Jadi 5x scroll sudah lebih dari cukup.
                MAX_SCROLL = 10 
                for _ in range(MAX_SCROLL): 
                    driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", scrollable_div)
                    time.sleep(2) 
                    
                    # Cek jumlah review yang sudah terload
                    loaded_reviews = driver.find_elements(By.XPATH, '//div[contains(@class,"jftiEf")]')
                    if len(loaded_reviews) >= 60:
                        print(f"   🛑 Sudah terload {len(loaded_reviews)} review (Target 30), stop scrolling.")
                        break
            else:
                print("   ⚠️ Container scroll tidak spesifik, scroll body...")
                body = driver.find_element(By.TAG_NAME, "body")
                for _ in range(5): # Kurangi juga scroll body
                    body.send_keys(Keys.PAGE_DOWN)
                    time.sleep(1)
        
        except Exception as e:
            print(f"ℹ️ Error saat scrolling: {e}")
        
        # ================= COLLECT REVIEWS =================
        reviews = driver.find_elements(By.XPATH, '//div[contains(@class,"jftiEf")]')
        print(f"✅ Review ditemukan: {len(reviews)}")
        
        data = []
        
        for i, r in enumerate(reviews):
            try:
                # 1. Reviewer Name
                review_name = ""
                try:
                    review_name = r.find_element(By.XPATH, './/div[contains(@class, "d4r55")]').text
                except:
                    pass
        
                # 2. Rating
                rating = ""
                try:
                    # Cari elemen bintang, biasanya punya role="img" dan aria-label="5 bintang" atau "5 stars"
                    star_el = r.find_element(By.XPATH, './/span[@role="img"]')
                    aria_label = star_el.get_attribute("aria-label")
                    # Ambil angka pertama dari string (misal "5 bintang" -> 5)
                    if aria_label:
                        rating = re.search(r'\d+', aria_label).group()
                except:
                    pass
        
                # 3. Review Date
                review_date = ""
                try:
                    # Biasanya ada di span dengan class rsqaWe atau xRkfab
                    review_date = r.find_element(By.XPATH, './/span[contains(@class, "rsqaWe")]').text
                except:
                    pass
        
                # 4. Review Text (Existing Logic)
                try:
                    more_btn = r.find_element(By.XPATH, './/button[contains(text(), "Lainnya") or contains(text(), "More")]')
                    driver.execute_script("arguments[0].click();", more_btn)
                    time.sleep(0.1)
                except:
                    pass
        
                text = ""
                candidates = [
                    './/span[@class, "wiI7pd"]',
                    './/div[@class="MyEned"]//span',
                    './/span[contains(@class, "wiI7pd")]'
                ]
                
                for sel in candidates:
                    try:
                        el = r.find_element(By.XPATH, sel)
                        if el.text.strip():
                            text = el.text
                            break
                    except:
                        continue
                
                # Clean text
                review_text = text.replace("\n", " ").strip()
        
                # Hanya simpan jika ada text (sesuai request user: skip kalau cuma rating)
                if not review_text:
                    # print(f"   ⏩ Skip review ke-{i} karena tidak ada teks (cuma rating).")
                    continue
                
                row = {
                    "shop_id": shop_id,
                    "shop_name": shop_name,
                    "review_text": review_text,
                    "rating": rating,
                    "source": "google_places_api", 
                    "review_name": review_name,
                    "review_date": review_date,
                    "latitude": lat,
                    "longitude": long
                }
                
                data.append(row)
        
                if len(data) == 1:
                    print(f"   ℹ️ Contoh data pertama: {row}")
        
            except Exception as e:
                print(f"Error extracting review {i}: {e}")
        
            # Stop jika sudah dapat 30 data valid
            if len(data) >= 30:
                print("   🛑 Sudah mencapai target 30 review valid. Stop processing.")
                break
        
        # ================= SAVE =================
        fieldnames = ["shop_id", "shop_name", "review_text", "rating", "source", "review_name", "review_date", "latitude", "longitude"]
        
        import os
        file_exists = os.path.isfile(OUTPUT_FILE)
        
        # Gunakan mode 'a' (append) untuk menambah data, bukan menimpa
        with open(OUTPUT_FILE, "a", newline="", encoding="utf-8-sig") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            
            # Tulis header hanya jika file belum ada
            if not file_exists:
                writer.writeheader()
                
            writer.writerows(data)
        
        print(f"📁 Data tersimpan ke {OUTPUT_FILE} (Mode: Append) | Total Batch Ini: {len(data)} review")

    except Exception as e:
        print(f"❌ Error memproses URL {URL}: {e}")

driver.quit()
