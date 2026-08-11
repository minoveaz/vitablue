import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SectionIntro from '@/components/molecules/SectionIntro';

export interface ProductRequirementsSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  items: Array<{ label: React.ReactNode; icon?: React.ReactNode }>;
  className?: string;
}

const ProductRequirementsSection: React.FC<ProductRequirementsSectionProps> = ({ eyebrow, title, description, items, className = '' }) => (
  <section className={`py-16 sm:py-20 max-w-5xl mx-auto px-6 sm:px-8 text-left ${className}`}>
    <SectionIntro eyebrow={eyebrow} title={title} description={description} align="center" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-3 text-sm font-bold text-text-main leading-relaxed">
          {item.icon ?? <ShieldCheck className="w-5 h-5 text-brand-cyan shrink-0 mt-0.5" />}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default ProductRequirementsSection;