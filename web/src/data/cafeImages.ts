export const CAFE_IMAGES: Record<string, string> = {
    "Roketto Coffee & Co": "https://disporapar.malangkota.go.id/wp-content/uploads/sites/114/2020/08/Roketto.png",
    "Niwa Garden": "https://kontenhakim.blog/wp-content/uploads/2025/09/WhatsApp-Image-2025-09-14-at-22.53.10-1024x768.jpeg",
    "Ada Apa Dengan Kopi (AADK) Bandung Malang - Coffee & Eatery": "https://salsawisata.com/wp-content/uploads/2023/11/menu-cafe-aadk-malang.webp",
    "Tomoro Coffee - Suhat": "https://assets.pikiran-rakyat.com/crop/0x0:0x0/x/photo/2024/03/21/3851132882.jpg",
    "Koji space coffee": "https://siarindomedia.com/wp-content/uploads/2025/05/84-KOJI-SPACE.jpg",
    "CW Coffee & Eatery - Tlogomas": "https://suaradata.com/sd_uploads/2025/11/IMG_6804.jpeg",
    "Hindia Koffie En Eaten": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjeANZUnR60Kc_BuZ1tLsdw13Sa6SnXygAY4ehCiychmL2K8OEF_a8_s_mwA4bNsZIB74Kptm6Y1z80QZl24KdBqIs0MgbeAIHiS95upKfSQBYqW8EO90S64g0tttV2SZCa6cXW58JJXwswB3yg41gtataY9k5wcrqgqiiK9N0cEpjXnBmML8q0Gg-Ttg/w1200-h630-p-k-no-nu/WhatsApp%20Image%202022-03-22%20at%2014.16.35.jpeg",
    "Janimani": "https://pbs.twimg.com/media/FFXaB9KVEAAtoG1.jpg",
    "Nakoa": "https://malangraya.blok-a.com/wp-content/uploads/sites/5/2024/09/nakoa-cafe-malang.jpg",
    "JOKOPI - Malang": "https://www.goersapp.com/blog/wp-content/uploads/2025/07/8.-Jokopi-Malang.webp",
    "Muraco Headquarter": "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/81/2025/03/13/2024-06-27-1224543062.jpg",
    "Fore Coffee - Jl. Soekarno Hatta, Malang": "https://i.pinimg.com/736x/4f/fd/2c/4ffd2cb97f2c3e111cba5ef2b8cc684d.jpg",
    "Brewok" : "https://cdn.sanity.io/images/huu4r2s1/production/a01e9305d683b506e848bc5aa5d49e281de8b9cb-1242x854.jpg",
    "Labore coffee eatery": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/d7/43/b7/20181225-102744-largejpg.jpg?w=700&h=400&s=1",
    "Tenthirty coffee and eatery": "https://cdn.timesmedia.co.id/images/2020/07/31/Tenthirty-Coffee-3.jpg",
    "Labuh Ruang": "https://coffeeradar.io/wp-content/uploads/2023/06/Labuh-Ruang-photo.jpg",
    
};

export const DEFAULT_IMAGES = [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
];

export function getCafeImage(shopName: string): string {
    // Cek apakah ada gambar spesifik
    if (CAFE_IMAGES[shopName]) {
        return CAFE_IMAGES[shopName];
    }

    // Jika tidak ada, pakai gambar random yang konsisten berdasarkan panjang nama
    const index = shopName.length % DEFAULT_IMAGES.length;
    return DEFAULT_IMAGES[index];
}
