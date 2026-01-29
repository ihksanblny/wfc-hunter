export default function Header() {
    return (
        <header className="bg-coffee-dark text-coffee-light py-12 md:py-16 px-6 rounded-b-[2rem] md:rounded-b-[3rem] mb-8 md:mb-12 relative overflow-hidden shadow-2xl mx-[-1rem] md:mx-[-3rem] lg:mx-[calc(-50vw+50%)]">
            {/* Pattern Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="pattern-circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#pattern-circles)" />
                </svg>
            </div>

            <div className="relative z-10 text-center max-w-2xl mx-auto">
                <p className="text-coffee-accent text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
                    Malang Workspace Directory
                </p>
                <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
                    Temukan Spot <span className="text-coffee-accent italic">WFC</span> Favoritmu
                </h1>
                <p className="text-gray-300 text-sm md:text-base font-light max-w-lg mx-auto leading-relaxed">
                    Kumpulan cafe terbaik di Malang yang dikurasi oleh AI untuk produktivitas maksimal. Wifi kencang, colokan banyak, dan kopi enak.
                </p>
            </div>
        </header>
    );
}
