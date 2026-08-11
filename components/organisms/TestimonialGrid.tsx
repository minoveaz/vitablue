import React from 'react';
import TestimonialCard from '@/components/molecules/TestimonialCard';

export interface TestimonialGridItem {
  author: string;
  meta: string;
  comment: string;
  stars?: number;
  avatarUrl?: string;
}

export interface TestimonialGridProps {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: TestimonialGridItem[];
}

const TestimonialGrid: React.FC<TestimonialGridProps> = ({ eyebrow, title, description, items }) => (
  <section className="w-full bg-slate-50/50 py-16 text-left sm:py-20">
    <div className="mx-auto max-w-6xl space-y-12 px-6 sm:px-8">
      {(eyebrow || title || description) && (
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          {eyebrow && <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>}
          {title && <h2 className="text-h2 font-display font-black text-text-main">{title}</h2>}
          {description && <p className="text-body-reg font-medium leading-relaxed text-text-secondary">{description}</p>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-3">
        {items.map((item) => <TestimonialCard key={item.author} {...item} />)}
      </div>
    </div>
  </section>
);

export default TestimonialGrid;
