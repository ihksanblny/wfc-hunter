import Link from "next/link";
import { Cafe } from "../types";
import { getCafeImage } from "../data/cafeImages";

export default function CafeCard({ cafe }: { cafe: Cafe }) {
    const imageUrl = getCafeImage(cafe.shop_name);

    return (
        <Link href={`/cafe/${cafe.shop_id}`} className="block group h-full">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-coffee-accent/30 transition-all duration-500 h-full flex flex-col relative">

                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={cafe.shop_name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>

                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 border border-gray-100">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="font-bold text-gray-900 text-sm">{cafe.rating_avg}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider border-l border-gray-200 pl-1.5 ml-0.5">RATING</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow relative">
                    {/* Kategori Utama (Tag pertama) */}
                    <div className="mb-3">
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-coffee-accent">
                            {cafe.best_for?.[0] || "COFFEE SHOP"}
                        </span>
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-coffee-dark transition-colors">
                        {cafe.shop_name}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 font-light">
                        {cafe.summary}
                    </p>

                    {/* Footer Card */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex gap-2">
                            {cafe.best_for?.slice(1, 3).map((tag) => (
                                <span key={tag} className="text-[10px] uppercase tracking-wide font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <span className="text-coffee-accent text-xs font-bold group-hover:translate-x-1 transition-transform">
                            View Details →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
