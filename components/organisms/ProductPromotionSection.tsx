import React from 'react';

export interface ProductPromotionSectionProps {
  badges: React.ReactNode[];
  title: React.ReactNode;
  description: React.ReactNode;
  className?: string;
}

const ProductPromotionSection: React.FC<ProductPromotionSectionProps> = ({
  badges,
  title,
  description,
  className = ''
}) => {
  return (
    <section className={`py-12 bg-white border-y border-slate-100 ${className}`}>
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-10 text-white text-left relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(148,210,189,0.12),transparent_50%)] pointer-events-none" />
          <div className="flex flex-wrap gap-2.5 mb-4">
            {badges.map((badge, index) => (
              <React.Fragment key={index}>{badge}</React.Fragment>
            ))}
          </div>
          <h3 className="text-h2 font-display font-black leading-tight tracking-tight mb-2">{title}</h3>
          <p className="text-sm text-slate-200 font-medium leading-relaxed max-w-2xl">{description}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductPromotionSection;