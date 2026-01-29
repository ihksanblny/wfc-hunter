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
import Link from "next/link";

export default function Home() {
    const [filter, setFilter] = useState<'all' | 'Nugas' | 'Kerja' | 'Nongkrong'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const allCafes = cafesData as Cafe[];

    // Logika Filtering
    const filteredCafes = allCafes.filter((cafe) => {
        // Pastikan skor dibaca sebagai angka
        const nugas = Number(cafe.nugas_score || 0);
        const kerja = Number(cafe.kerja_score || 0);
        const nongkrong = Number(cafe.nongkrong_score || 0);

        const matchesFilter =
            filter === 'all' ? true :
                filter === 'Nugas' ? nugas >= 30 :
                    filter === 'Kerja' ? kerja >= 30 :
                        filter === 'Nongkrong' ? nongkrong >= 30 : true;

        const matchesSearch = cafe.shop_name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Logika Sorting: Urutkan berdasarkan skor tertinggi sesuai filter aktif
    const sortedCafes = [...filteredCafes].sort((a, b) => {
        if (filter === 'Nugas') return (b.nugas_score || 0) - (a.nugas_score || 0);
        if (filter === 'Kerja') return (b.kerja_score || 0) - (a.kerja_score || 0);
        if (filter === 'Nongkrong') return (b.nongkrong_score || 0) - (a.nongkrong_score || 0);
        return 0;
    });

    // Tentukan Featured Cafe (Hanya tampil jika tidak ada filter/search aktif)
    const showFeatured = filter === 'all' && searchQuery === '';

    // Cari cafe dengan wifi score tertinggi untuk jadi Featured
    const featuredCafe = allCafes.reduce((prev, current) =>
        (prev.nugas_score > current.nugas_score) ? prev : current
        , allCafes[0]);

    // List cafe yang akan ditampilkan di grid (exclude featured cafe jika sedang mode default)
    const displayCafes = showFeatured
        ? sortedCafes.filter(c => c.shop_id !== featuredCafe.shop_id)
        : sortedCafes;

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

                    {/* Filter Description */}
                    <p className="text-center text-xs text-gray-500 mt-2 font-medium">
                        {filter === 'all' && "Menampilkan seluruh koleksi workspace & cafe di Malang"}
                        {filter === 'Nugas' && "Menampilkan tempat dengan 30%+ review positif soal nugas & belajar"}
                        {filter === 'Kerja' && "Menampilkan tempat dengan 30%+ review positif soal WFC & produktivitas"}
                        {filter === 'Nongkrong' && "Menampilkan tempat dengan 30%+ review positif soal suasana & nongkrong"}
                    </p>
                </div>



                {/* Grid List (Kembali ke Grid Layout) */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {displayCafes.map((cafe, index) => (
                        <CafeCard
                            key={cafe.shop_id}
                            cafe={cafe}
                            rank={filter !== 'all' ? index + 1 : undefined}
                            filterMode={filter}
                        />
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
