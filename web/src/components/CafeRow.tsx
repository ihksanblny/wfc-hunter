import Link from "next/link";
import { Cafe } from "../types";
import { getCafeImage } from "../data/cafeImages";

export default function CafeRow({ cafe }: { cafe: Cafe }) {
    const imageUrl = getCafeImage(cafe.shop_name);

    return (
        <Link href={`/cafe/${cafe.shop_id}`} className="block group">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-coffee-accent/50 transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row min-h-[16rem]">

                {/* Image Section - Left Side (Desktop) / Top (Mobile) */}
                <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden shrink-0">
                    <img
                        src={imageUrl}
                        alt={cafe.shop_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>

                    {/* Floating Rating Badge */}
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="font-bold text-gray-900 text-xs">{cafe.rating_avg}</span>
                    </div>
                </div>

                {/* Content Section - Right Side */}
                <div className="p-6 md:p-8 flex flex-col justify-between w-full relative">

                    {/* Top Info */}
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-coffee-accent mb-2 block">
                                {cafe.best_for?.[0] || "COFFEE SHOP"}
                            </span>
                        </div>

                        <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-coffee-dark transition-colors">
                            {cafe.shop_name}
                        </h2>

                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light mb-6">
                            {cafe.summary}
                        </p>
                    </div>

                    {/* Stats / Scores Visualization */}
                    <div className="grid grid-cols-3 gap-4 border-t border-gray-50 pt-4">
                        <StatBar label="Nugas" score={cafe.nugas_score} />
                        <StatBar label="Kerja" score={cafe.kerja_score} />
                        <StatBar label="Nongkrong" score={cafe.nongkrong_score} />
                    </div>

                    {/* Arrow Icon (Decorative) */}
                    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300 text-coffee-accent">
                        →
                    </div>
                </div>
            </div>
        </Link>
    );
}

function StatBar({ label, score }: { label: string, score: number }) {
    // Warna bar berubah tergantung skor
    const barColor = score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-gray-300';

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between items-end">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</span>
                <span className="text-[10px] font-bold text-gray-700">{score}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
        </div>
    );
}
