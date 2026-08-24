import React from 'react';

export interface ProductPromotionSectionProps {
  badges: React.ReactNode[];
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const ProductPromotionSection: React.FC<ProductPromotionSectionProps> = ({
  badges,
  title,
  description,
  children,
  className = ''
}) => {
  return (
    <section className={`py-8 sm:py-12 bg-white border-y border-slate-100 ${className}`}>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-5 sm:p-8 md:p-10 text-white text-left relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(148,210,189,0.12),transparent_50%)] pointer-events-none" />
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
            {badges.map((badge, index) => (
              <React.Fragment key={index}>{badge}</React.Fragment>
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl md:text-h2 font-display font-black leading-tight tracking-tight mb-2 sm:mb-3">{title}</h3>
          {description && <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl mb-4 sm:mb-6">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  );
};

export default ProductPromotionSection;