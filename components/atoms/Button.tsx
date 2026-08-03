import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/10 focus:ring-primary/20',
    secondary: 'bg-primary-dark hover:bg-primary text-white focus:ring-primary-dark/20',
    accent: 'bg-accent hover:bg-[#d48900] text-background-dark shadow-md shadow-accent/10 focus:ring-accent/20 font-bold',
    outline: 'border border-primary text-primary hover:bg-primary/5 focus:ring-primary/20',
    ghost: 'text-primary hover:bg-primary/5 focus:ring-primary/20',
  };

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      
      <span>{children}</span>
      
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
