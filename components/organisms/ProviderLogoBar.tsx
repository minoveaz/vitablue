import React from 'react';

export interface ProviderLogoBarProps {
  eyebrow: React.ReactNode;
  providers: Array<{ name: string; logoSrc: string }>;
  className?: string;
}

const ProviderLogoBar: React.FC<ProviderLogoBarProps> = ({ eyebrow, providers, className }) => (
  <section className={`py-10 bg-white border-b border-slate-100${className ? ` ${className}` : ''}`}>
    <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center space-y-4">
      <p className="text-[10px] font-black uppercase tracking-wider text-text-secondary">{eyebrow}</p>
      <div className="flex justify-center items-center gap-12 sm:gap-16">
        {providers.map((provider) => (
          <img
            key={provider.name}
            src={provider.logoSrc}
            alt={provider.name}
            className="h-8 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-200"
          />
        ))}
      </div>
    </div>
  </section>
);

export default ProviderLogoBar;