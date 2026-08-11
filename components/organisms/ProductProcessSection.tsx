import React from 'react';
import ProcessSteps, { ProcessStepsProps } from '@/components/molecules/ProcessSteps';
import SectionIntro from '@/components/molecules/SectionIntro';

export interface ProductProcessSectionProps {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  steps: ProcessStepsProps['steps'];
  className?: string;
}

const ProductProcessSection: React.FC<ProductProcessSectionProps> = ({ eyebrow, title, description, steps, className = '' }) => (
  <section className={`py-16 sm:py-20 max-w-6xl mx-auto px-6 sm:px-8 text-left border-t border-slate-100 ${className}`}>
    <SectionIntro eyebrow={eyebrow} title={title} description={description} align="center" />
    <ProcessSteps steps={steps} />
  </section>
);

export default ProductProcessSection;