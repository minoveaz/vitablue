import React, { forwardRef } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface InputSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string;
}

export const InputSelect = forwardRef<HTMLSelectElement, InputSelectProps>(({
  label,
  error,
  options,
  containerClassName = '',
  className = '',
  id,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          id={selectId}
          className={`
            w-full font-sans text-sm font-medium rounded-xl border bg-white px-4 py-3 pr-10 outline-none appearance-none transition-all duration-200 cursor-pointer
            ${hasError 
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
            disabled:bg-slate-50 disabled:text-text-secondary/50 disabled:border-slate-200/60
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-4 pointer-events-none text-text-secondary/60 flex items-center justify-center">
          <svg 
            className="w-4 h-4 stroke-current" 
            viewBox="0 0 24 24" 
            fill="none" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
      
      {hasError && (
        <span className="text-xs font-semibold text-red-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

InputSelect.displayName = 'InputSelect';

export default InputSelect;
