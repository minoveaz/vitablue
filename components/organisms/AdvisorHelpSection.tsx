import React from 'react';
import AdvisorCard from '@/components/molecules/AdvisorCard';

export interface AdvisorHelpSectionProps {
  title: React.ReactNode;
  description: React.ReactNode;
  whatsappUrl: string;
  phoneUrl?: string;
  advisorName?: string;
  advisorRole?: string;
  advisorQuote?: string;
  advisorBadge?: string;
  advisorSchedule?: string;
  advisorResponseTime?: string;
  advisorCallText?: string;
  advisorWhatsAppText?: string;
}

const AdvisorHelpSection: React.FC<AdvisorHelpSectionProps> = ({
  title,
  description,
  whatsappUrl,
  phoneUrl = 'tel:+34694583452',
  advisorName,
  advisorRole,
  advisorQuote,
  advisorBadge,
  advisorSchedule,
  advisorResponseTime,
  advisorCallText,
  advisorWhatsAppText,
}) => (
  <section className="w-full border-t border-slate-100 bg-slate-50 py-16">
    <div className="mx-auto max-w-4xl space-y-8 px-6 text-left sm:px-8">
      <div className="space-y-1">
        <h3 className="text-h2 font-display font-extrabold leading-tight tracking-tight text-text-main">{title}</h3>
        <p className="text-body-reg font-medium text-text-secondary">{description}</p>
      </div>
      <AdvisorCard
        name={advisorName}
        role={advisorRole}
        quote={advisorQuote}
        badgeText={advisorBadge}
        scheduleText={advisorSchedule}
        responseTimeText={advisorResponseTime}
        callText={advisorCallText}
        whatsAppText={advisorWhatsAppText}
        onWhatsAppClick={() => window.open(whatsappUrl, '_blank', 'noopener,noreferrer')}
        onPhoneClick={() => window.open(phoneUrl, '_self')}
      />
    </div>
  </section>
);

export default AdvisorHelpSection;
