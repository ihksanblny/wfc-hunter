export default function CoffeeArticles() {
    const articles = [
        {
            title: "Productivity Hack: The 90-Minute Rule",
            excerpt: "Kenapa kerja di cafe bisa lebih fokus? Simak teknik 'Deep Work' 90 menit yang bisa kamu terapkan sambil menikmati secangkir latte favoritmu agar pekerjaan cepat selesai tanpa burnout.",
            image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
            tag: "TIPS WFC"
        },
        {
            title: "Manual Brew vs Espresso Based: Mana Teman Kerjamu?",
            excerpt: "Bingung pilih V60 atau Cappuccino? Ketahui karakter kafein keduanya agar energimu tetap stabil.",
            image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
            tag: "COFFEE KNOWLEDGE"
        },
        {
            title: "Etika WFC: Jangan Jadi Pelanggan yang Dibenci Barista",
            excerpt: "Simak panduan etika bekerja di coffee shop agar barista senang dan kamu tetap nyaman berlama-lama.",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            tag: "LIFESTYLE"
        }
    ];

    const mainArticle = articles[0];
    const sideArticles = articles.slice(1);

    return (
        <section className="py-24 border-t-2 border-coffee-dark mt-20">
            <div className="flex items-end justify-between mb-12">
                <h2 className="font-serif text-5xl md:text-6xl font-bold text-coffee-dark leading-none">
                    The <span className="italic text-coffee-accent">Journal</span>
                </h2>
                <span className="hidden md:block text-xs font-bold tracking-[0.3em] uppercase text-gray-400">
                    READ MORE STORIES
                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
                {/* Main Article (Left) */}
                <div className="lg:w-2/3 group cursor-pointer">
                    <div className="overflow-hidden rounded-sm mb-6 relative">
                        <img
                            src={mainArticle.image}
                            alt={mainArticle.title}
                            className="w-full h-[400px] md:h-[500px] object-cover transition duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute top-6 left-6 bg-coffee-dark text-white px-4 py-2 text-xs font-bold tracking-widest uppercase">
                            Featured
                        </div>
                    </div>
                    <span className="text-coffee-accent font-bold tracking-widest text-xs uppercase mb-3 block">{mainArticle.tag}</span>
                    <h3 className="font-serif text-3xl md:text-5xl font-bold text-coffee-dark mb-4 leading-tight group-hover:underline decoration-2 underline-offset-8 decoration-coffee-accent">
                        {mainArticle.title}
                    </h3>
                    <p className="text-gray-600 text-lg font-light leading-relaxed max-w-2xl">
                        {mainArticle.excerpt}
                    </p>
                </div>

                {/* Side Articles (Right) */}
                <div className="lg:w-1/3 flex flex-col gap-10 lg:border-l lg:border-gray-200 lg:pl-12">
                    {sideArticles.map((article, idx) => (
                        <div key={idx} className="group cursor-pointer flex flex-col gap-3">
                            <div className="overflow-hidden h-40 w-full mb-2 rounded-sm lg:hidden">
                                <img src={article.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            </div>
                            <span className="text-coffee-accent font-bold tracking-widest text-[10px] uppercase block">{article.tag}</span>
                            <h4 className="font-serif text-2xl font-bold text-coffee-dark leading-snug group-hover:text-coffee-accent transition-colors">
                                {article.title}
                            </h4>
                            <p className="text-gray-500 text-sm font-light line-clamp-3 leading-relaxed">
                                {article.excerpt}
                            </p>
                            <div className="w-12 h-0.5 bg-gray-200 mt-4 group-hover:w-full group-hover:bg-coffee-dark transition-all duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
