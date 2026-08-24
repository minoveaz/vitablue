import React from 'react';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';
import { buildAttributedWhatsAppUrl } from '@/utils/analytics';

export const FloatingWhatsApp: React.FC = () => {
  const handleClick = () => {
    const url = buildAttributedWhatsAppUrl(
      '34694583452',
      'Hola! Vengo de la web de VitaBlue. Necesito asesoramiento sobre seguros de salud.',
      'WIDGET-FLOAT'
    );
    window.open(url, '_blank');
  };


  return (
    <div className="whatsapp-float-widget fixed bottom-6 right-6 z-[190] flex items-center gap-3 group">
      
      {/* Tooltip text bubble - slides out and fades in on group hover */}
      <div 
        onClick={handleClick}
        className="hidden md:flex bg-white text-text-main text-xs font-bold px-4 py-3 rounded-2xl border border-slate-200/60 shadow-xl shadow-black/5 opacity-0 translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 group-hover:pointer-events-auto transition-all duration-300 ease-out cursor-pointer select-none items-center gap-1.5"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        ¿Dudas? Chat en vivo
      </div>

      {/* Floating Action Button */}
      <button
        onClick={handleClick}
        className="size-[60px] rounded-full bg-whatsapp text-white flex items-center justify-center shadow-lg shadow-whatsapp/30 hover:scale-110 hover:shadow-xl hover:shadow-whatsapp/40 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20 active:scale-[0.95]"
        aria-label="Contactar por WhatsApp"
      >
        <WhatsAppIcon size={28} />
      </button>

    </div>
  );
};

export default FloatingWhatsApp;
