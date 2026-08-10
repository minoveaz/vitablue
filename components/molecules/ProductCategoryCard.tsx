import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export type ProductCategoryBadgeColor = 'primary' | 'accent' | 'secondary' | 'dark';

interface ProductCategoryCardProps {
  title: string;
  description: string;
  badge: string;
  badgeColor: ProductCategoryBadgeColor;
  href: string;
  illustration: React.ComponentType;
  detailsLabel: string;
}

const borderClasses: Record<ProductCategoryBadgeColor, string> = {
  primary: 'border-primary/15 hover:border-primary/30',
  accent: 'border-accent/20 hover:border-accent/30',
  secondary: 'border-brand-cyan/20 hover:border-brand-cyan/30',
  dark: 'border-surface-border hover:border-primary/20',
};

const badgeClasses: Record<ProductCategoryBadgeColor, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/15 text-text-main',
  secondary: 'bg-brand-cyan/15 text-primary',
  dark: 'bg-surface-subtle text-text-secondary',
};

export const ProductCategoryCard: React.FC<ProductCategoryCardProps> = ({
  title,
  description,
  badge,
  badgeColor,
  href,
  illustration: Illustration,
  detailsLabel,
}) => (
  <Link
    to={href}
    className={`group rounded-3xl border bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${borderClasses[badgeColor]}`}
  >
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-auto aspect-[4/3] flex items-center justify-start text-primary" aria-hidden="true">
            <Illustration />
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${badgeClasses[badgeColor]}`}>
            {badge}
          </span>
        </div>
        <h3 className="text-h3 font-display font-black text-text-main group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-body-reg text-text-secondary leading-relaxed max-w-md">{description}</p>
      </div>
    </div>
    <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
      {detailsLabel}
      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
    </div>
  </Link>
);

export default ProductCategoryCard;
