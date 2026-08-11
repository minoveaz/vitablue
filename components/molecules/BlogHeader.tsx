import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface BlogHeaderProps {
  isEnglish: boolean;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({ isEnglish }) => (
  <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12 sm:pb-16 bg-gradient-to-b from-primary/5 via-background-light to-brand-cyan/10 border-b border-slate-100">
    <div className="mx-auto w-full max-w-6xl text-center space-y-4">
      <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-white/80 backdrop-blur px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary shadow-sm select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
        <span>{isEnglish ? 'VitaBlue Guides Hub' : 'Centro de Guías VitaBlue'}</span>
      </div>
      <h1 className="text-h1 font-display font-black text-text-main max-w-3xl mx-auto leading-tight">
        {isEnglish ? 'Solve your doubts about health insurance and immigration' : 'Resuelve tus dudas sobre seguros de salud y extranjería'}
      </h1>
      <p className="text-body-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
        {isEnglish ? 'Explaining and updated articles so your NIE, TIE or Visa in Spain gets approved on the first try.' : 'Artículos explicativos y actualizados para que aprueben tu NIE, TIE o Visado en España a la primera.'}
      </p>
    </div>
  </section>
);

export default BlogHeader;
