import React, { forwardRef } from 'react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  error?: string;
  containerClassName?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  containerClassName = '',
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      <label 
        htmlFor={checkboxId} 
        className="inline-flex items-start gap-3 cursor-pointer select-none group text-sm font-medium text-text-secondary leading-relaxed"
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`peer sr-only ${className}`}
            {...props}
          />
          <div className={`
            size-5 rounded-lg border bg-white flex items-center justify-center transition-all duration-200
            ${hasError 
              ? 'border-red-400 group-hover:border-red-500 peer-focus:ring-red-100' 
              : 'border-slate-300 group-hover:border-slate-400 peer-focus:ring-primary/10'
            }
            peer-checked:bg-primary peer-checked:border-primary peer-checked:text-white
            peer-focus:outline-none peer-focus:ring-4
          `}>
            <svg 
              className="w-3 h-3 opacity-0 peer-checked:opacity-100 transition-opacity duration-150 stroke-current" 
              viewBox="0 0 12 12" 
              fill="none" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 5 8.5 9.5 3.5" />
            </svg>
          </div>
        </div>
        
        {label && (
          <span className="text-text-secondary/95 group-hover:text-text-main transition-colors duration-150">
            {label}
          </span>
        )}
      </label>
      
      {hasError && (
        <span className="text-xs font-semibold text-red-500 ml-8">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
