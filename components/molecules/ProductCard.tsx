import React from 'react';
import { Check, X, Star, ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { WhatsAppIcon } from '../atoms/WhatsAppIcon';

interface ProductCardProps {
  name: string;
  providerName: string;
  providerLogo: string;
  whyItFits: string;
  price: string;
  pricePeriod: string;
  ctaText: string;
  ctaHref: string;
  onCtaClick?: () => void;
  onWhatsAppClick?: () => void;
  inclusions: string[];
  exclusions: string[];
  highlights?: string[];
  isRecommended?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  name,
  providerName,
  providerLogo,
  whyItFits,
  price,
  pricePeriod,
  ctaText,
  ctaHref,
  onCtaClick,
  onWhatsAppClick,
  inclusions,
  exclusions,
  highlights,
  isRecommended = false,
}) => {
  return (
    <div className={`relative flex flex-col lg:flex-row overflow-hidden rounded-[2rem] border transition-all duration-300 ${
      isRecommended 
        ? 'border-primary/40 shadow-xl shadow-primary/5 bg-gradient-to-br from-white via-white to-primary/5' 
        : 'border-slate-200/70 bg-white shadow-md shadow-slate-900/[0.02] hover:border-primary/20 hover:shadow-lg'
    }`}>
      {/* Recommended Tag */}
      {isRecommended && (
        <div className="absolute top-0 right-0 rounded-bl-2xl bg-accent px-5 py-2 text-[10px] font-black uppercase tracking-wider text-text-main flex items-center gap-1.5 z-10 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-current animate-pulse" /> Nuestra Recomendación
        </div>
      )}
      
      {/* Left Column: Product Details & Coverages */}
      <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10 gap-6 border-b lg:border-b-0 lg:border-r border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{providerName}</span>
            <h3 className="text-h3 font-display font-extrabold text-text-main leading-tight tracking-tight">{name}</h3>
          </div>
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-slate-50/50 p-2.5 border border-slate-100 flex items-center justify-center shadow-inner">
            <img src={providerLogo} alt={providerName} className="h-full w-full object-contain filter" />
          </div>
        </div>

        {/* Why it fits bubble (Premium Glassmorphism Look) */}
        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-primary/[0.03] border border-primary/10 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">
            ¿Por qué se adapta a ti?
          </span>
          <p className="text-body-reg text-text-main font-medium leading-relaxed italic">
            "{whyItFits}"
          </p>
        </div>

        {/* Bullet Highlights */}
        {highlights && highlights.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {highlights.map((h, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3.5 py-1 rounded-full bg-slate-100 text-[10px] font-bold text-text-secondary uppercase tracking-wider">
                <Check className="w-3 h-3 text-primary stroke-[3]" /> {h}
              </span>
            ))}
          </div>
        )}

        {/* Inclusions and Exclusions Grid (Visual Transparency) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
          {/* Inclusions (Mint green accents) */}
          <div className="space-y-3 bg-brand-cyan/5 p-4 rounded-2xl border border-brand-cyan/10">
            <span className="text-caption font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary stroke-[3]" /> Lo que SÍ incluye
            </span>
            <ul className="space-y-2">
              {inclusions.slice(0, 4).map((inc, idx) => (
                <li key={idx} className="flex gap-2 text-caption text-text-secondary leading-relaxed font-semibold">
                  <div className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          {/* Exclusions (Rose/red accents) */}
          <div className="space-y-3 bg-red-500/[0.03] p-4 rounded-2xl border border-red-500/10">
            <span className="text-caption font-black text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <X className="w-4 h-4 text-red-500 stroke-[3]" /> Lo que NO cubre
            </span>
            <ul className="space-y-2">
              {exclusions.slice(0, 3).map((exc, idx) => (
                <li key={idx} className="flex gap-2 text-caption text-text-secondary leading-relaxed font-semibold">
                  <div className="mt-1.5 size-1.5 rounded-full bg-red-400/80 shrink-0" />
                  {exc}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column: Pricing & Action Buttons */}
      <div className={`w-full lg:w-[280px] flex flex-col p-6 sm:p-8 lg:p-10 justify-center items-center text-center gap-6 ${
        isRecommended ? 'bg-primary/[0.02]' : 'bg-slate-50/30'
      }`}>
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Inversión en salud</p>
          <div className="flex items-baseline justify-center gap-0.5">
            <span className="text-5xl font-display font-black text-text-main tracking-tight">{price}</span>
            <span className="text-body-reg font-bold text-text-secondary">/{pricePeriod}</span>
          </div>
          <p className="text-[10px] text-text-secondary/70 font-semibold tracking-wide">Precio final garantizado</p>
        </div>
        
        <div className="w-full flex flex-col gap-3">
          {/* Main button to contract online */}
          <a href={ctaHref} onClick={onCtaClick} className="w-full">
            <Button 
              className="w-full h-12 shadow-sm rounded-xl text-sm font-bold"
              variant={isRecommended ? 'primary' : 'outline'}
              rightIcon={<ArrowRight size={18} />}
            >
              {ctaText}
            </Button>
          </a>

          {/* WhatsApp human support button with official WhatsApp SVG logo */}
          <button 
            onClick={onWhatsAppClick}
            className="w-full flex h-12 items-center justify-center gap-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-white text-sm font-bold shadow-md shadow-whatsapp/20 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20"
          >
            <WhatsAppIcon size={20} />
            Hablar con Asesor
          </button>
        </div>

        <p className="text-[9px] font-bold text-text-secondary uppercase tracking-widest leading-none mt-1">
          Contratación 100% segura
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
