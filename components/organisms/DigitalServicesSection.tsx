import React from 'react';
import { Check } from 'lucide-react';

export interface DigitalServicesSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  benefits: string[];
  visual: React.ReactNode;
}

const DigitalServicesSection: React.FC<DigitalServicesSectionProps> = ({
  eyebrow,
  title,
  description,
  benefits,
  visual,
}) => (
  <section className="w-full border-y border-slate-100 bg-slate-50 py-16 text-left sm:py-20">
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-6">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
        <h2 className="text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h2>
        <p className="text-body-reg font-medium leading-relaxed text-text-secondary">{description}</p>
        <ul className="grid gap-4 text-sm font-semibold text-text-main sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5">
              <Check className="h-5 w-5 shrink-0 text-primary" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center lg:col-span-6">{visual}</div>
    </div>
  </section>
);

export default DigitalServicesSection;