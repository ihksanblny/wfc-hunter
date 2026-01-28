import Link from "next/link";
import { Cafe } from "../types";
import { getCafeImage } from "../data/cafeImages";

export default function FeaturedCafe({ cafe }: { cafe: Cafe }) {
    const imageUrl = getCafeImage(cafe.shop_name);

    return (
        <div className="mb-16 relative group cursor-pointer">
            <Link href={`/cafe/${cafe.shop_id}`}>
                <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={imageUrl}
                        alt={cafe.shop_name}
                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coffee-dark/90 via-coffee-dark/20 to-transparent opacity-90"></div>

                    <div className="absolute top-6 left-6 md:top-10 md:left-10">
                        <span className="bg-coffee-accent text-coffee-dark px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-sm shadow-lg">
                            Editor's Choice
                        </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-3 leading-tight group-hover:text-coffee-accent transition-colors">
                                    {cafe.shop_name}
                                </h2>
                                <p className="text-gray-200 text-sm md:text-lg font-light max-w-xl line-clamp-2 leading-relaxed">
                                    {cafe.summary}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-xl text-center min-w-[70px] md:min-w-[90px]">
                                    <span className="block text-xl md:text-2xl font-serif font-bold text-white">{cafe.nugas_score}%</span>
                                    <span className="text-[8px] md:text-[10px] text-gray-300 uppercase tracking-wider font-bold">NUGAS</span>
                                </div>
                                <div className="bg-black/30 backdrop-blur-md border border-white/10 p-3 md:p-4 rounded-xl text-center min-w-[70px] md:min-w-[90px]">
                                    <span className="block text-xl md:text-2xl font-serif font-bold text-white">{cafe.kerja_score}%</span>
                                    <span className="text-[8px] md:text-[10px] text-gray-300 uppercase tracking-wider font-bold">KERJA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
