import React from 'react';

interface SectionIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

const SectionIntro: React.FC<SectionIntroProps> = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={`${align === 'center' ? 'mx-auto text-center' : ''} max-w-2xl`}>
    {eyebrow && <p className="text-caption font-black uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
    <h2 className="mt-3 text-h2 font-display font-black text-text-main">{title}</h2>
    {description && <p className="mt-4 text-body-lg leading-relaxed text-text-secondary">{description}</p>}
  </div>
);

export default SectionIntro;
