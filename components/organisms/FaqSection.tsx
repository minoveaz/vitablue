import React from 'react';
import Accordion from '@/components/molecules/Accordion';

export interface FaqSectionItem {
  question: string;
  answer: React.ReactNode;
}

export interface FaqSectionProps {
  id?: string;
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  items: FaqSectionItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ id, eyebrow, title, items }) => (
  <section id={id} className="w-full bg-slate-50/50 py-16 text-left sm:py-20">
    <div className="mx-auto w-full max-w-4xl px-6 sm:px-8">
      {(eyebrow || title) && (
        <div className="mb-12 space-y-4 text-center">
          {eyebrow && <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>}
          {title && <h2 className="text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h2>}
        </div>
      )}
      <div className="divide-y divide-slate-200/60 rounded-3xl border border-slate-100 bg-white p-4 shadow-inner sm:p-6">
        {items.map((item, index) => (
          <Accordion key={index} title={item.question} defaultOpen={index === 0}>
            {item.answer}
          </Accordion>
        ))}
      </div>
    </div>
  </section>
);

export default FaqSection;
