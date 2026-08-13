import React from 'react';
import { Search, X } from 'lucide-react';

export interface BlogCategoryOption { value: string; label: string; }
interface BlogFilterBarProps { query: string; categories: BlogCategoryOption[]; selectedCategory: string; isEnglish: boolean; onQueryChange: (value: string) => void; onCategoryChange: (value: string) => void; }

const BlogFilterBar: React.FC<BlogFilterBarProps> = ({ query, categories, selectedCategory, isEnglish, onQueryChange, onCategoryChange }) => (
  <div className="space-y-8">
    <div className="max-w-md mx-auto relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors"><Search className="w-5 h-5" /></div>
      <input type="text" placeholder={isEnglish ? 'Search guides (e.g. visa, copay)...' : 'Buscar guías (ej: visado, copago)...'} value={query} onChange={(event) => onQueryChange(event.target.value)} className="w-full h-12 pl-12 pr-10 rounded-2xl bg-white border border-slate-200/80 shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm font-semibold text-text-main placeholder-slate-400/80 outline-none" />
      {query && <button type="button" onClick={() => onQueryChange('')} className="absolute inset-y-0 right-3 flex items-center px-1.5 text-slate-400 hover:text-text-main transition-colors cursor-pointer bg-transparent border-0" title={isEnglish ? 'Clear search' : 'Limpiar búsqueda'} aria-label={isEnglish ? 'Clear search' : 'Limpiar búsqueda'}><X className="w-4 h-4" /></button>}
    </div>
    <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-150 pb-6">
      {categories.map((category) => <button type="button" key={category.value} onClick={() => onCategoryChange(category.value)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${selectedCategory === category.value ? 'bg-primary text-white shadow-md shadow-primary/10' : 'bg-white hover:bg-slate-50 text-text-secondary border border-slate-200/80'}`}>{category.label}</button>)}
    </div>
  </div>
);
export default BlogFilterBar;
