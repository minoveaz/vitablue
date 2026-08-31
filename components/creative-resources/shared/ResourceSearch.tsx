import React from 'react';
import { Search, X } from 'lucide-react';

export interface ResourceSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const ResourceSearch: React.FC<ResourceSearchProps> = ({
  value,
  onChange,
  placeholder = 'Buscar recursos',
  label = 'Buscar recursos',
}) => (
  <label className="relative block">
    <span className="sr-only">{label}</span>
    <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-8 pr-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/60"
    />
    {value && (
      <button
        type="button"
        aria-label="Limpiar búsqueda"
        onClick={() => onChange('')}
        className="absolute right-1 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    )}
  </label>
);

