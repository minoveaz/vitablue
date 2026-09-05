import React from 'react';
import { Search, X, Sparkles, GraduationCap, FileCheck2, HeartPulse } from 'lucide-react';

export interface BlogCategoryOption {
  value: string;
  label: string;
  count?: number;
}

interface BlogFilterBarProps {
  query: string;
  categories: BlogCategoryOption[];
  selectedCategory: string;
  isEnglish: boolean;
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const getCategoryIcon = (value: string) => {
  switch (value) {
    case 'visados':
      return <GraduationCap className="w-4 h-4 shrink-0" />;
    case 'tramites':
      return <FileCheck2 className="w-4 h-4 shrink-0" />;
    case 'salud':
      return <HeartPulse className="w-4 h-4 shrink-0" />;
    case 'all':
    default:
      return <Sparkles className="w-4 h-4 shrink-0" />;
  }
};

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
  query,
  categories,
  selectedCategory,
  isEnglish,
  onQueryChange,
  onCategoryChange,
}) => (
  <div className="space-y-6">
    {/* Search bar */}
    <div className="max-w-md mx-auto relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        placeholder={isEnglish ? 'Search guides (e.g. visa, copay, Asisa)...' : 'Buscar guías (ej: visado, copago, Asisa)...'}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        className="w-full h-12 pl-12 pr-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm font-semibold text-text-main placeholder-slate-400/80 outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange('')}
          className="absolute inset-y-0 right-3 flex items-center px-1.5 text-slate-400 hover:text-text-main transition-colors cursor-pointer bg-transparent border-0"
          title={isEnglish ? 'Clear search' : 'Limpiar búsqueda'}
          aria-label={isEnglish ? 'Clear search' : 'Limpiar búsqueda'}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>

    {/* Topic Pills */}
    <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 sm:pb-0 px-2 no-scrollbar">
      {categories.map((category) => {
        const isSelected = selectedCategory === category.value;
        return (
          <button
            type="button"
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
              isSelected
                ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                : 'bg-white hover:bg-slate-50 text-text-secondary border border-slate-200/80 hover:border-slate-300'
            }`}
          >
            {getCategoryIcon(category.value)}
            <span>{category.label}</span>
            {typeof category.count === 'number' && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black leading-none ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {category.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

export default BlogFilterBar;
