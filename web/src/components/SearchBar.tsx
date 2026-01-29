interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-xl mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="block w-full pl-8 pr-4 py-3 border-b border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-0 text-sm transition-colors font-light tracking-wide"
                placeholder="Cari nama cafe..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
