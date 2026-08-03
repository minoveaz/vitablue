import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'success' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-sans font-bold rounded-full select-none uppercase tracking-wider';

  const variantClasses = {
    primary: 'bg-[#005F73]/10 text-[#005F73]', 
    accent: 'bg-[#EE9B00]/10 text-[#c87f00]',  
    success: 'bg-[#94D2BD]/20 text-[#0f766e]', 
    neutral: 'bg-slate-100 text-slate-600',    
  };

  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-3 py-1',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
