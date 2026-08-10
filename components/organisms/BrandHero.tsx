import React from 'react';
import Button from '@/components/atoms/Button';

interface BrandHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  children?: React.ReactNode;
}

const BrandHero: React.FC<BrandHeroProps> = ({ eyebrow, title, description, action, children }) => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-slate-900 py-16 text-left text-white lg:py-24">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(148,210,189,0.12),transparent_60%)]" />
    <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 sm:px-8 lg:grid-cols-12">
      <div className={children ? 'lg:col-span-7' : 'lg:col-span-9'}>
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-brand-cyan">{eyebrow}</div>
        <h1 className="mt-6 text-h1 font-display font-black leading-tight tracking-tight">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-slate-200">{description}</p>
        {action && <a href={action.href} className="mt-7 inline-flex"><Button variant="accent" size="lg">{action.label}</Button></a>}
      </div>
      {children && <div className="lg:col-span-5">{children}</div>}
    </div>
  </section>
);

export default BrandHero;
