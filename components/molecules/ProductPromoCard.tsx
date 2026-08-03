import React from 'react';
import { Plus, Check, ArrowRight } from 'lucide-react';

interface ProductPromoCardProps {
  provider?: string;
  productName?: string;
  badgeText?: string;
  features?: string[];
  visaLabel?: string;
  onPlusClick?: () => void;
  onCheckClick?: () => void;
  onArrowClick?: () => void;
  className?: string;
}

export const ProductPromoCard: React.FC<ProductPromoCardProps> = ({
  provider = 'Sanitas',
  productName = 'International Students',
  badgeText = '24/7 ASISTENCIA',
  visaLabel = 'Válido para visado',
  features = [
    'Sin copagos • Sin carencias',
    'Repatriación incluida'
  ],
  onPlusClick,
  onCheckClick,
  onArrowClick,
  className = ''
}) => {
  return (
    <div className={`relative flex flex-col items-center pb-8 w-full max-w-[340px] sm:max-w-[360px] ${className}`}>
      
      {/* Outer Glow & Base Card Wrapper */}
      <div className="relative w-full rounded-[2.2rem] bg-gradient-to-br from-primary to-primary-dark p-5 sm:p-7 text-white shadow-2xl shadow-primary/20 overflow-hidden select-none border border-white/10 group active:scale-[0.99] transition-all duration-300">
        
        {/* Two overlapping translucent bubbles at the top-left (replicated from legacy image) */}
        <div className="absolute top-4 left-4 flex -space-x-3.5 opacity-20 pointer-events-none">
          <div className="size-6 sm:size-7 rounded-full bg-white"></div>
          <div className="size-6 sm:size-7 rounded-full bg-white"></div>
        </div>
        
        {/* Decorative ambient light vectors inside the card (floating shapes) */}
        <div className="absolute -top-12 -left-12 size-36 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 right-4 size-24 bg-brand-cyan/10 rounded-full blur-xl"></div>
        
        {/* Two-Column Responsive Layout */}
        <div className="relative z-10 flex justify-between gap-3 min-h-[120px] sm:min-h-[140px]">
          
          {/* Left Column: Text content */}
          <div className="flex flex-col justify-between flex-grow pl-1">
            <div className="flex flex-col mt-4 sm:mt-5">
              <span className="font-display text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
                {provider}
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-brand-cyan opacity-90 mt-0.5">
                {productName}
              </span>
            </div>
            
            <div className="flex flex-col gap-0 mt-2.5 sm:mt-3">
              <span className="text-[7.5px] sm:text-[9px] uppercase font-black tracking-widest text-brand-cyan/85">
                {visaLabel}
              </span>
              <div className="text-[10.5px] sm:text-xs font-bold leading-snug tracking-tight text-white/95 flex flex-col gap-0">
                {features.map((feature, index) => (
                  <span key={index} className="block">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Visual Badges (fixed-width, aligned right) */}
          <div className="flex flex-col justify-between items-end flex-shrink-0 w-20 sm:w-24">
            {/* White floating pill badge */}
            <div className="flex items-center justify-center bg-white text-primary text-[8px] sm:text-[9px] font-black tracking-wider px-2 py-1.5 rounded-full shadow-lg shadow-black/10 w-full text-center">
              {badgeText}
            </div>
            
            {/* Checkmark circle */}
            <div className="size-9 sm:size-11 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/10 border border-slate-50 mt-auto">
              <Check className="w-4 h-4 text-green-500 stroke-[3.5]" />
            </div>
          </div>

        </div>

      </div>

      {/* Floating Action Buttons overlapping the bottom border (aligned vertically) */}
      <div className="absolute bottom-2 flex gap-4 items-center justify-center z-10">
        {/* Button 1: Plus icon with internal circle outline */}
        <button
          onClick={onPlusClick}
          className="size-10 sm:size-11 rounded-full bg-white border border-slate-200/60 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 text-primary flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10"
          aria-label="Añadir cobertura"
        >
          <div className="size-6 sm:size-7 rounded-full border border-primary/25 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        {/* Button 2: Validation Check icon with internal circle outline */}
        <button
          onClick={onCheckClick}
          className="size-11 sm:size-12 rounded-full bg-white border border-slate-200/60 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 text-[#0f766e] flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10"
          aria-label="Verificar seguro"
        >
          <div className="size-7 sm:size-8 rounded-full border border-[#0f766e]/25 flex items-center justify-center bg-[#0f766e]/5">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
        </button>

        {/* Button 3: Arrow icon with internal circle outline */}
        <button
          onClick={onArrowClick}
          className="size-10 sm:size-11 rounded-full bg-white border border-slate-200/60 shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 text-primary flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary/10"
          aria-label="Ver detalles"
        >
          <div className="size-6 sm:size-7 rounded-full border border-primary/25 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>
      </div>

    </div>
  );
};

export default ProductPromoCard;
