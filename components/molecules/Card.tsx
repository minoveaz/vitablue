import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = true,
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white border border-slate-200/50 rounded-2xl md:rounded-3xl overflow-hidden';
  
  const hoverClasses = hoverEffect 
    ? 'hover:translate-y-[-4px] hover:shadow-xl hover:shadow-slate-900/5 hover:border-slate-200 transition-all duration-300 ease-out' 
    : 'shadow-sm shadow-slate-900/5';

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-8',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
