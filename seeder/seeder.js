require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Konfigurasi Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Gunakan model yang stabil
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const INPUT_FILE = '../scraping/reviews.csv';
const OUTPUT_FILE = 'cafes_processed.json';

async function main() {
    console.log("🚀 Memulai proses seeding data...");

    // 1. Baca CSV dan Grouping berdasarkan Shop ID
    const cafes = {};

    fs.createReadStream(INPUT_FILE)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '') // Hapus BOM & spasi
        }))
        .on('data', (row) => {
            const id = row.shop_id;
            if (!id) return;

            if (!cafes[id]) {
                cafes[id] = {
                    shop_id: id,
                    shop_name: row.shop_name,
                    latitude: row.latitude,
                    longitude: row.longitude,
                    reviews: []
                };
            }

            if (row.review_text) {
                cafes[id].reviews.push(row.review_text);
            }
        })
        .on('end', async () => {
            console.log(`✅ Berhasil membaca CSV. Ditemukan ${Object.keys(cafes).length} cafe unik.`);

            const processedData = [];

            // 2. Loop setiap cafe dan minta AI menganalisa
            for (const cafeId in cafes) {
                const cafe = cafes[cafeId];
                console.log(`\n🤖 Menganalisa: ${cafe.shop_name} (${cafe.reviews.length} review)...`);

                const reviewsSample = cafe.reviews.slice(0, 30).join("\n- ");

                const prompt = `
Kamu adalah asisten pencari tempat kerja (WFC).
Analisa daftar review berikut untuk sebuah Coffee Shop.

Output HANYA JSON valid tanpa markdown, dengan format:
{
  "wifi_score": (1-10),
  "socket_availability": (1-10),
  "quietness": (1-10, 1=Berisik, 10=Tenang),
  "coffee_quality": (1-10),
  "summary": "Ringkasan 1 kalimat bahasa Indonesia",
  "best_for": ["Meeting", "Deep Work", "Nongkrong"]
}

Review:
- ${reviewsSample}
`;

                // RETRY LOGIC (Maksimal 3x percobaan)
                let success = false;
                let attempts = 0;

                while (!success && attempts < 3) {
                    attempts++;
                    try {
                        const result = await model.generateContent(prompt);
                        const response = await result.response;
                        let text = response.text();

                        // CLEANING JSON: Cari kurung kurawal terluar
                        const firstBrace = text.indexOf('{');
                        const lastBrace = text.lastIndexOf('}');

                        if (firstBrace !== -1 && lastBrace !== -1) {
                            text = text.substring(firstBrace, lastBrace + 1);
                        } else {
                            throw new Error("Output AI bukan JSON valid");
                        }

                        const aiAnalysis = JSON.parse(text);

                        const finalData = {
                            ...cafe,
                            ...aiAnalysis,
                            reviews_count: cafe.reviews.length,
                            reviews: undefined
                        };

                        processedData.push(finalData);
                        console.log("   ✅ Selesai! Skor Wifi:", aiAnalysis.wifi_score);
                        success = true;

                    } catch (error) {
                        console.error(`   ⚠️ Gagal percobaan ke-${attempts}:`, error.message);
                        if (attempts < 3) {
                            console.log("      ⏳ Menunggu 5 detik sebelum coba lagi...");
                            await new Promise(r => setTimeout(r, 5000));
                        } else {
                            console.error("   ❌ Gagal total untuk cafe ini.");
                        }
                    }
                }

                // Jeda antar cafe biar aman
                await new Promise(r => setTimeout(r, 2000));
            }

            // 3. Simpan ke JSON
            fs.writeFileSync(OUTPUT_FILE, JSON.stringify(processedData, null, 2));
            console.log(`\n🎉 Semua selesai! Data tersimpan di ${OUTPUT_FILE}`);
        });
}

main();