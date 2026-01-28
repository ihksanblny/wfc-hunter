const fs = require('fs');
const csv = require('csv-parser');

const CSV_FILE = '../scraping/reviews.csv';
const JSON_FILE = '../web/src/data/cafes_processed.json';

async function main() {
    console.log("🔄 Membaca data...");

    // 1. Baca data JSON yang sudah ada (yang ada skor AI-nya)
    const cafesData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    const cafeMap = {};
    cafesData.forEach(c => {
        cafeMap[c.shop_id] = { ...c, reviews_list: [] };
    });

    // 2. Baca CSV dan ambil reviewnya
    fs.createReadStream(CSV_FILE)
        .pipe(csv({
            mapHeaders: ({ header }) => header.trim().replace(/^\ufeff/, '')
        }))
        .on('data', (row) => {
            const id = row.shop_id;
            if (cafeMap[id] && row.review_text) {
                // Bersihkan review dari karakter aneh
                const cleanReview = row.review_text.replace(/\s+/g, ' ').trim();
                if (cleanReview.length > 20) { // Hanya ambil review yang cukup panjang
                    cafeMap[id].reviews_list.push({
                        user: row.user_name || "Pengunjung",
                        text: cleanReview,
                        rating: row.rating || 5,
                        date: row.review_date || "Baru saja"
                    });
                }
            }
        })
        .on('end', () => {
            // 3. Filter dan Simpan
            const finalData = Object.values(cafeMap).map(cafe => {
                // Ambil 6 review terpanjang (biasanya paling niat nulisnya)
                const topReviews = cafe.reviews_list
                    .sort((a, b) => b.text.length - a.text.length)
                    .slice(0, 6);

                return {
                    ...cafe,
                    reviews_list: topReviews
                };
            });

            fs.writeFileSync(JSON_FILE, JSON.stringify(finalData, null, 2));
            console.log(`✅ Berhasil menyuntikkan review ke ${finalData.length} cafe!`);
        });
}

main();
