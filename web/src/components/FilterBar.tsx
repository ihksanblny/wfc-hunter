type Filtertype = 'all' | 'wifi' | 'quiet' | 'socket';

interface FilterBarProps {
    activeFilter: Filtertype;
    onFilterChange: (filter: Filtertype) => void;
}

export default function FilterBar({ activeFilter, onFilterChange}: FilterBarProps) {
    const filters: { id: Filtertype; label: string }[] = [
        { id: 'all', label: 'Semua' },
        { id: 'wifi', label: 'Wifi Kencang 🚀' },
        { id: 'quiet', label: 'Hening 🤫' },
        { id: 'socket', label: 'Banyak Colokan 🔌' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
            {filters.map((f) => (
                <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`
                    px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${activeFilter === f.id 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
                `}
                >
                {f.label}
                </button>
            ))}
        </div>
    );
}