"use client";

import { useState } from "react";
import cafesData from "../data/cafes_processed.json";
import { Cafe } from '@/types';
import Header from '@/components/Header';
import CafeCard from '@/components/CafeCard';
import FilterBar from '@/components/FilterBar';
import SearchBar from '@/components/SearchBar';
import CoffeeArticles from '@/components/CoffeeArticles';
import FeaturedCafe from '@/components/FeaturedCafe';

export default function Home() {
    const [filter, setFilter] = useState<'all' | 'Nugas' | 'Kerja' | 'Nongkrong'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const allCafes = cafesData as Cafe[];

    // Logika Filtering
    const filteredCafes = allCafes.filter((cafe) => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'Nugas' ? cafe.nugas_score >= 40 :
                    filter === 'Kerja' ? cafe.kerja_score >= 40 :
                        filter === 'Nongkrong' ? cafe.nongkrong_score >= 40 : true;

        const matchesSearch = cafe.shop_name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Tentukan Featured Cafe (Hanya tampil jika tidak ada filter/search aktif)
    const showFeatured = filter === 'all' && searchQuery === '';

    // Cari cafe dengan wifi score tertinggi untuk jadi Featured
    const featuredCafe = allCafes.reduce((prev, current) =>
        (prev.nugas_score > current.nugas_score) ? prev : current
        , allCafes[0]);

    // List cafe yang akan ditampilkan di grid (exclude featured cafe jika sedang mode default)
    const displayCafes = showFeatured
        ? filteredCafes.filter(c => c.shop_id !== featuredCafe.shop_id)
        : filteredCafes;

    return (
        <main className="min-h-screen px-4 md:px-12 pb-20 bg-coffee-light">
            <div className="max-w-7xl mx-auto">
                <Header />

                {/* Featured Section */}
                {showFeatured && featuredCafe && (
                    <FeaturedCafe cafe={featuredCafe} />
                )}

                {/* Tools Section */}
                <div className="mb-12 sticky top-0 z-20 bg-coffee-light/95 backdrop-blur-sm py-4 -mx-4 px-4 md:mx-0 md:px-0 transition-all">
                    <SearchBar value={searchQuery} onChange={setSearchQuery} />
                    <FilterBar activeFilter={filter} onFilterChange={setFilter} />
                </div>

                {/* Grid List */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {displayCafes.map((cafe) => (
                        <CafeCard key={cafe.shop_id} cafe={cafe} />
                    ))}

                    {displayCafes.length === 0 && (
                        <div className="text-center py-20 text-gray-400 font-light tracking-wide col-span-full">
                            NO WORKSPACES FOUND
                        </div>
                    )}
                </div>

                {/* Artikel Section */}
                <CoffeeArticles />
            </div>
        </main>
    );
}
