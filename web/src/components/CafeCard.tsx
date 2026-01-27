import Link from "next/link";
import { Cafe } from "../types";

export default function CafeCard({ cafe }: { cafe: Cafe }) {
    return (
        <Link href={`/cafe/${cafe.shop_id}`} className="block">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">{cafe.shop_name}</h2>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                        Wifi: {cafe.wifi_score}/10
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {cafe.summary}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {cafe.best_for?.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
