import React from 'react';

export interface ResourceFilterOption {
  id: string;
  label: string;
}

export interface ResourceFiltersProps {
  options: readonly ResourceFilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  options,
  value,
  onChange,
  label = 'Filtros de recursos',
}) => (
  <div aria-label={label} className="flex flex-wrap gap-1.5">
    {options.map((option) => (
      <button
        key={option.id}
        type="button"
        aria-pressed={value === option.id}
        onClick={() => onChange(option.id)}
        className={`min-h-11 rounded-lg border px-2.5 py-1 text-[10px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
          value === option.id ? 'border-brand-cyan/60 bg-primary/30 text-brand-cyan' : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

