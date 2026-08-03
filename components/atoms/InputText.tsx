import React, { forwardRef } from 'react';

export interface InputTextProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-bold uppercase tracking-wider text-text-secondary select-none"
        >
          {label}
        </label>
      )}
      
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3.5 text-text-secondary/70 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`
            w-full font-sans text-sm font-medium rounded-xl border bg-white px-4 py-3 outline-none transition-all duration-200
            ${leftIcon ? 'pl-11' : ''} 
            ${rightIcon ? 'pr-11' : ''}
            ${hasError 
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100' 
              : 'border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10'
            }
            placeholder:text-text-secondary/40 placeholder:font-normal
            disabled:bg-slate-50 disabled:text-text-secondary/50 disabled:border-slate-200/60
            ${className}
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3.5 text-text-secondary/70 pointer-events-none flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {hasError && (
        <span className="text-xs font-semibold text-red-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

InputText.displayName = 'InputText';

export default InputText;
