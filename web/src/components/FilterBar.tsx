type FilterType = 'all' | 'Nugas' | 'Kerja' | 'Nongkrong';

interface FilterBarProps {
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
    const filters: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'Semua' },
        { id: 'Nugas', label: 'Cocok Nugas' },
        { id: 'Kerja', label: 'Cocok Kerja' },
        { id: 'Nongkrong', label: 'Tempat Nongkrong' },
    ];

    return (
        <div className="w-full overflow-x-auto no-scrollbar touch-pan-x">
            <div className="flex justify-start md:justify-center gap-3 md:gap-4 mb-6 py-2 min-w-max md:min-w-0 px-1">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => onFilterChange(f.id)}
                        className={`
                            px-5 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap border shrink-0
                            ${activeFilter === f.id
                                ? 'bg-coffee-dark text-white border-coffee-dark shadow-md transform scale-105'
                                : 'bg-transparent text-gray-500 border-gray-300 hover:border-coffee-dark hover:text-coffee-dark'}
                        `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    );
}