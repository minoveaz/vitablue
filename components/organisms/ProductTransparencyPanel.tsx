import React from 'react';
import ProductTransparencySection from './ProductTransparencySection';

interface ProductTransparencyPanelProps {
  eyebrow: string;
  title: string;
  description: string;
  inclusions: string[];
  exclusions: string[];
  surface?: 'white' | 'band';
}

const ProductTransparencyPanel: React.FC<ProductTransparencyPanelProps> = ({
  eyebrow,
  title,
  description,
  inclusions,
  exclusions,
  surface = 'white',
}) => (
  <section className={surface === 'band' ? 'w-full border-y border-slate-100 bg-slate-50/50 py-16 text-left sm:py-20' : 'w-full bg-white py-16 text-left sm:py-20'}>
    <div className="mx-auto w-full max-w-5xl px-6 sm:px-8">
      <div className="mb-12 space-y-4 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{eyebrow}</span>
        <h2 className="text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h2>
        <p className="text-body-reg mx-auto max-w-2xl font-medium leading-relaxed text-text-secondary">{description}</p>
      </div>
      <ProductTransparencySection inclusions={inclusions} exclusions={exclusions} />
    </div>
  </section>
);

export default ProductTransparencyPanel;
