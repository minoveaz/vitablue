import React from 'react';
import { ShieldCheck, BadgeCheck } from 'lucide-react';
import SectionIntro from '@/components/molecules/SectionIntro';
import WhatsAppIcon from '@/components/atoms/WhatsAppIcon';

export interface GuaranteeRefundSectionProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  description: string;
  steps: Array<{ title: string; desc: string }>;
  whatsappUrl?: string;
  whatsappLabel?: string;
  className?: string;
}

export const GuaranteeRefundSection: React.FC<GuaranteeRefundSectionProps> = ({
  eyebrow = 'Garantía Antirriesgo',
  title = 'Garantía de Reembolso Total por Denegación de Visado',
  subtitle = 'Sabemos lo estresante que puede ser el proceso de solicitud de visado. Por eso, en VitaBlue cuentas con garantía de cancelación sin riesgo:',
  description = 'Si por cualquier motivo de fuerza mayor el consulado o Extranjería deniega tu solicitud de visado, te reembolsamos el 100% del importe abonado por tu seguro médico. Solo tendrás que enviarnos la copia de la resolución consular oficial.',
  steps = [
    { title: '1. Notificación Oficial', desc: 'Envíanos la carta o resolución de denegación emitida por el consulado.' },
    { title: '2. Verificación Express', desc: 'Validamos el documento con la aseguradora en menos de 24 horas laborables.' },
    { title: '3. Reembolso del 100%', desc: 'Recibes la devolución íntegra en la misma tarjeta o cuenta de pago.' }
  ],
  whatsappUrl = 'https://wa.me/34694583452?text=Hola!%20Vengo%20de%20la%20web%20de%20VitaBlue.%20Tengo%20dudas%20sobre%20la%20garant%C3%ADa%20de%20devoluci%C3%B3n%20por%20denegaci%C3%B3n%20de%20visado.',
  whatsappLabel = 'Consultar Dudas sobre la Garantía por WhatsApp',
  className = ''
}) => {
  return (
    <section className={`w-full bg-slate-50/70 py-16 text-left sm:py-20 border-y border-slate-100 ${className}`}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={subtitle}
          align="center"
        />

        {/* Featured Guarantee Box */}
        <div className="mt-10 rounded-2xl sm:rounded-3xl border-2 border-primary/20 bg-white p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-brand-cyan/20 text-primary shrink-0 border border-brand-cyan/40">
              <ShieldCheck className="h-8 w-8 text-primary stroke-[2.5]" />
            </div>
            
            <div className="space-y-2 flex-grow">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700 border border-emerald-200">
                <BadgeCheck className="h-4 w-4 text-emerald-600" />
                100% Sin Letra Pequeña
              </div>
              <p className="text-body-reg sm:text-body-lg font-semibold leading-relaxed text-text-main">
                {description}
              </p>
            </div>
          </div>

          {/* 3 Step refund process cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
            {steps.map((step, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1">{step.title}</p>
                <p className="text-caption font-medium text-text-secondary">{step.desc}</p>
              </div>
            ))}
          </div>

          {whatsappUrl && (
            <div className="mt-8 text-center pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-whatsapp hover:bg-whatsapp-dark px-8 py-3.5 text-body-reg font-bold text-white shadow-md shadow-whatsapp/20 transition-all hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-whatsapp/20"
              >
                <WhatsAppIcon className="h-5 w-5 fill-white shrink-0" />
                <span>{whatsappLabel}</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuaranteeRefundSection;
