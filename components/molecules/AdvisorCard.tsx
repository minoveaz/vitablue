import React from 'react';
import { Phone, Clock, Shield } from 'lucide-react';
import { Button } from '../atoms/Button';
import { WhatsAppIcon } from '../atoms/WhatsAppIcon';

interface AdvisorCardProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  onWhatsAppClick?: () => void;
  onPhoneClick?: () => void;
  phoneText?: string;
  whatsAppText?: string;
}

export const AdvisorCard: React.FC<AdvisorCardProps> = ({
  name = 'Lucía Delgado',
  role = 'Asesora Senior de Salud en España',
  avatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
  onWhatsAppClick,
  onPhoneClick,
  phoneText = '+34 900 839 240',
  whatsAppText = 'Escribir por WhatsApp'
}) => {
  return (
    <div className="w-full bg-gradient-to-br from-white via-white to-primary/[0.02] rounded-[2rem] border border-slate-200/80 shadow-md shadow-slate-900/[0.02] overflow-hidden flex flex-col md:flex-row hover:shadow-lg hover:border-primary/20 transition-all duration-300">
      
      {/* Advisor Avatar and Info Column */}
      <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          {/* Double-ring layout for avatar */}
          <div className="size-20 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg relative p-0.5 bg-gradient-to-tr from-primary to-brand-cyan">
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover rounded-full bg-white" />
          </div>
          {/* Active status indicator green dot with pulse effect */}
          <span className="absolute bottom-0.5 right-1 size-4 rounded-full bg-whatsapp border-2 border-white shadow-sm animate-pulse" />
        </div>

        <div className="flex-1 flex flex-col gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] flex items-center justify-center sm:justify-start gap-1">
              <Shield className="w-3.5 h-3.5 text-accent fill-current" /> Asesora Asignada
            </span>
            <h4 className="text-xl font-display font-extrabold text-text-main leading-tight tracking-tight">{name}</h4>
            <p className="text-caption text-text-secondary/80 font-bold uppercase tracking-wider">{role}</p>
          </div>

          <p className="text-body-reg text-text-secondary font-medium leading-relaxed max-w-md">
            "Hola, soy Lucía. Estoy aquí para resolver tus dudas de visado, copagos y carencias. Te guiaré de forma neutral y sin ningún tipo de compromiso."
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-1.5 pt-1 text-[10px] font-bold text-text-secondary/70">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-primary" /> Lunes a Viernes: 9:00 - 19:00 (CET)
            </span>
            <span className="flex items-center gap-1.5 text-whatsapp">
              {/* Inline official WhatsApp icon handset inside a bubble */}
              <WhatsAppIcon size={16} />
              Respuesta en &lt; 15 mins
            </span>
          </div>
        </div>
      </div>

      {/* Advisor CTAs Column */}
      <div className="w-full md:w-[260px] bg-slate-50/30 p-6 sm:p-8 border-t md:border-t-0 md:border-l border-slate-100/80 flex flex-col justify-center gap-4">
        {/* WhatsApp chat button with official WhatsApp logo */}
        <button 
          onClick={onWhatsAppClick}
          className="w-full flex h-12 items-center justify-center gap-2.5 rounded-xl bg-whatsapp hover:bg-whatsapp-dark text-white text-sm font-bold shadow-md shadow-whatsapp/20 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/20"
        >
          <WhatsAppIcon size={20} />
          {whatsAppText}
        </button>

        {/* Free Phone Call button */}
        <a href={`tel:${phoneText.replace(/\s+/g, '')}`} onClick={onPhoneClick} className="w-full">
          <Button 
            className="w-full h-12 rounded-xl text-sm font-bold"
            variant="outline"
            leftIcon={<Phone size={14} />}
          >
            Llamar Gratis
          </Button>
        </a>

        <div className="text-center">
          <span className="text-[9px] font-bold text-text-secondary/70 uppercase tracking-widest leading-none">
            {phoneText}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdvisorCard;
