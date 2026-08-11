import React from 'react';
import CoverageCard from '@/components/molecules/CoverageCard';

export interface CoverageGridItem {
  title: string;
  description: string;
  illustration: React.ComponentType;
}

export interface CoverageGridProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: CoverageGridItem[];
}

const CoverageGrid: React.FC<CoverageGridProps> = ({ eyebrow, title, description, items }) => (
  <section className="w-full bg-white py-16 text-left sm:py-20">
    {(eyebrow || title || description) && (
      <div className="mx-auto mb-12 max-w-6xl px-6 text-center sm:px-8">
        {eyebrow && <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>}
        {title && <h2 className="mt-4 text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h2>}
        {description && <p className="mx-auto mt-4 max-w-xl text-body-reg font-medium leading-relaxed text-text-secondary">{description}</p>}
      </div>
    )}

    <div className="mx-auto grid max-w-6xl gap-6 px-6 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => <CoverageCard key={item.title} {...item} />)}
    </div>
  </section>
);

export default CoverageGrid;