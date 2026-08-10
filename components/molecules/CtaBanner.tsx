import React from 'react';
import Button from '@/components/atoms/Button';

interface CtaBannerProps {
  title: string;
  description?: string;
  action: { label: string; href: string };
}

const CtaBanner: React.FC<CtaBannerProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-brand-cyan/20 bg-gradient-to-r from-brand-cyan/10 to-primary/5 p-8 sm:flex-row sm:items-center sm:p-10">
    <div className="max-w-2xl">
      <h2 className="text-h2 font-display font-black text-text-main">{title}</h2>
      {description && <p className="mt-3 text-body-reg leading-relaxed text-text-secondary">{description}</p>}
    </div>
    <a href={action.href} className="inline-flex shrink-0"><Button variant="accent" size="lg">{action.label}</Button></a>
  </div>
);

export default CtaBanner;
