import cafesData from '@/data/cafes_processed.json';
import { Cafe } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Fungsi untuk generate static params
export function generateStaticParams() {
    return cafesData.map((cafe) => ({
        id: cafe.shop_id,
    }));
}

export default async function CafeDetail({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15: params harus di-await
    const { id } = await params;
    const decodedId = decodeURIComponent(id);

    const cafe = (cafesData as Cafe[]).find((c) => c.shop_id === decodedId);

    if (!cafe) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Header Gambar / Warna */}
            <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                <Link
                    href="/"
                    className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition"
                >
                    ← Kembali
                </Link>
            </div>

            <div className="max-w-2xl mx-auto px-6 -mt-10 relative z-10">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{cafe.shop_name}</h1>
                    <p className="text-gray-600 text-sm mb-4">{cafe.summary}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {cafe.best_for?.map((tag) => (
                            <span key={tag} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <ScoreItem label="Wifi" score={cafe.wifi_score} icon="📶" />
                        <ScoreItem label="Colokan" score={cafe.socket_availability} icon="🔌" />
                        <ScoreItem label="Ketenangan" score={cafe.quietness} icon="🤫" />
                        <ScoreItem label="Rasa Kopi" score={cafe.coffee_quality} icon="☕" />
                    </div>

                    {/* Action Button */}
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        📍 Buka di Google Maps
                    </a>
                </div>
            </div>
        </main>
    );
}

function ScoreItem({ label, score, icon }: { label: string, score: number, icon: string }) {
    // Warna dinamis bedasarkan skor
    const colorClass = score >= 8 ? 'text-green-600' : score >= 6 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span>{icon}</span>
                <span className="text-sm text-gray-600">{label}</span>
            </div>
            <span className={`font-bold ${colorClass}`}>{score}/10</span>
        </div>
    );
}