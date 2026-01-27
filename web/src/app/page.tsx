"use client";

import { useState } from "react";
import cafesData from "../data/cafes_processed.json";
import { Cafe } from '@/types';
import Header from '@/components/Header';
import CafeCard from '@/components/CafeCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';

export default function Home() {
    const [filter, setFilter] = useState<'all' | 'wifi' | 'quiet' | 'socket'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const allCafes = cafesData as Cafe[];

    // Logika Filtering (Gabungan Filter + Search)
    const filteredCafes = allCafes.filter((cafe) => {
        // 1. Cek Filter Kategori
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'wifi' ? cafe.wifi_score >= 8 :
                    filter === 'quiet' ? cafe.quietness >= 8 :
                        filter === 'socket' ? cafe.socket_availability >= 8 : true;

        // 2. Cek Search Query (Case insensitive)
        const matchesSearch = cafe.shop_name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <main className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-md md:max-w-4xl mx-auto">
                <Header />

                <div className="sticky top-0 z-10 bg-gray-50 pt-2 pb-2">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <FilterBar activeFilter={filter} onFilterChange={setFilter} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {filteredCafes.map((cafe) => (
                        <CafeCard key={cafe.shop_id} cafe={cafe} />
                    ))}

                    {filteredCafes.length === 0 && (
                        <div className="text-center py-10 text-gray-500 col-span-full">
                            Tidak ada cafe yang cocok 😔
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
