import cafesData from '@/data/cafes_processed.json';
import { Cafe } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCafeImage } from '@/data/cafeImages';

// Fungsi untuk generate static params
export function generateStaticParams() {
    return cafesData.map((cafe) => ({
        id: cafe.shop_id,
    }));
}

export default async function CafeDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const cafe = (cafesData as Cafe[]).find((c) => c.shop_id === decodedId);

    if (!cafe) {
        notFound();
    }

    const imageUrl = getCafeImage(cafe.shop_name);

    return (
        <main className="min-h-screen bg-coffee-light pb-20">
            {/* Hero Image Section */}
            <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={cafe.shop_name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/30 transition flex items-center gap-2 text-sm font-medium border border-white/30 z-20"
                >
                    ← Kembali
                </Link>

                {/* Title on Hero */}
                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight shadow-sm">
                            {cafe.shop_name}
                        </h1>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {cafe.best_for?.map((tag) => (
                                <span key={tag} className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-coffee-dark bg-coffee-accent px-3 py-1 rounded-sm shadow-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
                <div className="bg-white rounded-t-3xl shadow-xl p-8 md:p-12 border-t border-white/50">

                    {/* Summary */}
                    <div className="mb-10">
                        <h3 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Tentang Tempat Ini</h3>
                        <p className="text-gray-600 text-lg leading-relaxed font-light">
                            {cafe.summary}
                        </p>
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        <ScoreCard label="NUGAS" score={cafe.nugas_score} icon="📚" />
                        <ScoreCard label="KERJA" score={cafe.kerja_score} icon="💻" />
                        <ScoreCard label="NONGKRONG" score={cafe.nongkrong_score} icon="🤝" />
                        <ScoreCard label="RATING" score={cafe.rating_avg} icon="⭐" />
                    </div>

                    {/* Action Button */}
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafe.shop_name + " Malang")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block w-full bg-coffee-dark text-white text-center py-4 rounded-xl font-bold tracking-wide hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mb-12"
                    >
                        📍 BUKA DI GOOGLE MAPS
                    </a>

                    {/* Reviews Section */}
                    {cafe.reviews_list && cafe.reviews_list.length > 0 && (
                        <div className="pt-10 border-t border-gray-100">
                            <h3 className="text-xs font-bold tracking-[0.2em] text-gray-400 uppercase mb-8 text-center">
                                Apa Kata Mereka
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {cafe.reviews_list.map((review, idx) => (
                                    <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:border-coffee-accent/30 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-coffee-light flex items-center justify-center text-coffee-dark font-bold text-xs">
                                                    {review.user.charAt(0)}
                                                </div>
                                                <span className="font-bold text-coffee-dark text-sm">{review.user}</span>
                                            </div>
                                            <div className="flex text-yellow-500 text-xs">
                                                {'★'.repeat(5)}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm italic leading-relaxed font-light">
                                            "{review.text}"
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

function ScoreCard({ label, score, icon }: { label: string, score: number, icon: string }) {
    // Warna dinamis bedasarkan skor
    const isRating = label === "RATING";
    const isHigh = isRating ? score >= 4.5 : score >= 70;

    return (
        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${isHigh ? 'bg-coffee-light/30 border-coffee-accent/30' : 'bg-gray-50 border-gray-100'}`}>
            <span className="text-2xl mb-2">{icon}</span>
            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">{label}</span>
            <div className="flex items-baseline gap-0.5">
                <span className={`text-2xl font-serif font-bold ${isHigh ? 'text-coffee-dark' : 'text-gray-600'}`}>{score}</span>
                <span className="text-xs text-gray-400 font-medium">{isRating ? '/5' : '%'}</span>
            </div>
        </div>
    );
}