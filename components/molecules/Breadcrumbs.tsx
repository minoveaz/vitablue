import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items, 
  className = '' 
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`flex items-center flex-wrap gap-1.5 text-xs font-semibold text-text-secondary ${className}`}
    >
      {/* Home icon as baseline link */}
      <Link 
        to="/" 
        className="flex items-center gap-1 text-text-secondary/70 hover:text-primary transition-colors duration-150"
        aria-label="Vitablue - Inicio"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Vitablue</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${index}`}>
            <ChevronRight className="w-3 h-3 text-text-secondary/35 flex-shrink-0" />
            
            {isLast || !item.href ? (
              <span 
                className="text-text-main font-bold truncate max-w-[180px] sm:max-w-xs" 
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="hover:text-primary hover:underline underline-offset-2 transition-colors duration-150 truncate max-w-[120px] sm:max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
