import React from 'react';

export type TrustCardTone = 'neutral' | 'cyan' | 'accent';

export interface TrustCardItem {
  title: string;
  description: string;
  illustration: React.ComponentType;
  tone: TrustCardTone;
}

interface TrustCardGridProps {
  items: TrustCardItem[];
}

const toneClasses: Record<TrustCardTone, string> = {
  neutral: 'border-surface-border bg-white',
  cyan: 'border-brand-cyan/20 bg-brand-cyan/10',
  accent: 'border-accent/20 bg-accent/10',
};

const TrustCardGrid: React.FC<TrustCardGridProps> = ({ items }) => (
  <div className="grid gap-4 md:grid-cols-3">
    {items.map(({ title, description, illustration: Illustration, tone }) => (
      <article
        key={title}
        className={`group flex min-h-[300px] flex-col rounded-3xl border p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-8 ${toneClasses[tone]}`}
      >
        <div className="mb-4 flex h-16 w-auto aspect-[4/3] items-center justify-start text-primary" aria-hidden="true">
          <Illustration />
        </div>
        <h3 className="text-h3 font-display font-black leading-tight text-text-main">{title}</h3>
        <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">{description}</p>
      </article>
    ))}
  </div>
);

export default TrustCardGrid;
