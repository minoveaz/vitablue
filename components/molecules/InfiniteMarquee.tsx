import React from 'react';
import { Shield } from 'lucide-react';

interface InfiniteMarqueeProps {
  brands?: string[];
  className?: string;
}

export const InfiniteMarquee: React.FC<InfiniteMarqueeProps> = ({
  brands = ['Sanitas', 'Adeslas', 'DKV', 'Asisa', 'Mapfre', 'AXA', 'Allianz', 'Generali'],
  className = ''
}) => {
  // Triple the list to ensure there is enough horizontal content for a seamless loop
  const displayBrands = [...brands, ...brands, ...brands];

  return (
    <div className={`w-full overflow-hidden bg-white py-8 border-y border-slate-100 relative ${className}`}>
      {/* Soft gradient overlays on the sides for a premium fading effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      
      {/* Scrolling Content container */}
      <div className="flex animate-marqueeScroll whitespace-nowrap gap-16 sm:gap-24 w-fit">
        {displayBrands.map((brand, i) => {
          let logoSrc = '';
          if (brand === 'Sanitas') logoSrc = '/images/logo-sanitas.svg';
          else if (brand === 'Adeslas') logoSrc = '/images/logo-adeslas.svg';
          else if (brand === 'DKV') logoSrc = '/images/logo-dkv.png';
          else if (brand === 'Asisa') logoSrc = '/images/logo-asisa.png';
          else if (brand === 'AXA') logoSrc = '/images/logo-axa.png';
          else if (brand === 'Allianz') logoSrc = '/images/logo-allianz.png';
          else if (brand === 'Generali') logoSrc = '/images/logo-generali.png';
          else if (brand === 'Mapfre') logoSrc = '/images/logo-mapfre.png';

          if (logoSrc) {
            return (
              <div key={i} className="flex items-center justify-center cursor-default select-none shrink-0 h-8 sm:h-10">
                <img 
                  src={logoSrc} 
                  alt={brand} 
                  className="h-6 sm:h-8 w-auto max-w-[120px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200 shrink-0" 
                />
              </div>
            );
          }

          return (
            <div 
              key={i} 
              className="text-lg sm:text-2xl font-display font-extrabold text-slate-500 hover:text-primary transition-colors duration-200 flex items-center gap-2.5 sm:gap-3 cursor-default select-none shrink-0"
            >
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 shrink-0" /> 
              <span>{brand}</span>
            </div>
          );
        })}
      </div>

      {/* Inject Keyframe animation style dynamically */}
      <style>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marqueeScroll {
          animation: marqueeScroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default InfiniteMarquee;
