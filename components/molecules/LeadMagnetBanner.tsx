import React from 'react';
import { Download, ShieldCheck, FileCheck } from 'lucide-react';
import { trackConversion } from '@/utils/analytics';

interface LeadMagnetBannerProps {
  isEnglish?: boolean;
  variant?: 'inline' | 'sidebar' | 'footer';
  className?: string;
  sourceContext?: string;
}

export const LeadMagnetBanner: React.FC<LeadMagnetBannerProps> = ({
  isEnglish = false,
  variant = 'inline',
  className = '',
  sourceContext = 'blog-post',
}) => {
  const pdfUrl = isEnglish
    ? '/downloads/spain-student-visa-health-insurance-checklist.pdf'
    : '/downloads/checklist-visado-estudiante-espana.pdf';
  const pdfFilename = isEnglish
    ? 'spain-student-visa-health-insurance-checklist.pdf'
    : 'checklist-visado-estudiante-espana.pdf';

  const handleDownloadClick = () => {
    trackConversion('lead_magnet_download', {
      contact_method: 'download',
      category: 'lead_magnet',
      profile: 'student',
      source_page: typeof window !== 'undefined' ? window.location.pathname : '',
      campaign_tag: `lead_magnet_pdf_${sourceContext}`,
    });
  };

  if (variant === 'sidebar') {
    return (
      <div
        className={`bg-white rounded-2xl border-2 border-primary/20 shadow-sm p-5 space-y-4 text-left ${className}`}
        data-testid="lead-magnet-sidebar"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-cyan/20 text-primary text-xs font-bold uppercase tracking-wider">
          <FileCheck className="w-3.5 h-3.5 text-primary" />
          <span>{isEnglish ? 'Free PDF Checklist' : 'Checklist PDF Gratis'}</span>
        </div>

        <div>
          <h3 className="text-h3 text-text-main font-bold leading-snug">
            {isEnglish
              ? 'Official Student Visa Medical Requirements (PDF)'
              : 'Checklist Oficial: Requisitos Médicos para Visado (PDF)'}
          </h3>
          <p className="text-body-reg text-text-secondary text-xs mt-1.5 leading-relaxed">
            {isEnglish
              ? 'Download the 5 essential criteria required by Spanish Consulates to avoid delays or refusal.'
              : 'Descarga los 5 puntos indispensables que exige Extranjería para evitar requerimientos.'}
          </p>
        </div>

        <div className="pt-1">
          <a
            href={pdfUrl}
            download={pdfFilename}
            onClick={handleDownloadClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent text-primary-dark font-extrabold text-xs shadow-sm hover:brightness-105 transition-all text-center"
          >
            <Download className="w-4 h-4" />
            {isEnglish ? 'Download Free PDF' : 'Descargar PDF Gratis'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`my-8 bg-gradient-to-br from-white via-surface-soft to-surface-subtle rounded-2xl sm:rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-sm text-left ${className}`}
      data-testid="lead-magnet-banner"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-primary text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span>{isEnglish ? 'Official Consular Resource • 2026/2027' : 'Recurso Consular Oficial • 2026/2027'}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-display font-extrabold text-text-main leading-tight">
            {isEnglish
              ? 'Definitive Checklist: Health Insurance for Spain Student Visa'
              : 'Checklist Definitiva: Requisitos Médicos Oficiales para Visado de Estudiante'}
          </h3>

          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            {isEnglish
              ? 'Review the 5 non-negotiable points of Spanish Immigration Law (zero copays, zero waiting periods, 100% full coverage, and repatriation) and the 3 most common refusal mistakes.'
              : 'Verifica los 5 puntos no negociables del Reglamento de Extranjería (sin copagos, sin carencias, 100% cobertura y repatriación) y los 3 errores más comunes que causan denegación.'}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] font-semibold text-slate-500 pt-0.5">
            <span className="flex items-center gap-1 text-primary">
              ✓ {isEnglish ? '2 Pages A4 Ready to Print' : '2 Páginas A4 Imprimibles'}
            </span>
            <span className="flex items-center gap-1 text-primary">
              ✓ {isEnglish ? '100% Free' : '100% Gratuito'}
            </span>
            <span className="flex items-center gap-1 text-primary">
              ✓ {isEnglish ? 'Money-back Guarantee Included' : 'Garantía por Denegación'}
            </span>
          </div>
        </div>

        <div className="w-full md:w-auto shrink-0">
          <a
            href={pdfUrl}
            download={pdfFilename}
            onClick={handleDownloadClick}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:brightness-105 text-primary-dark font-extrabold text-xs sm:text-sm shadow-md transition-all text-center"
          >
            <Download className="w-4 h-4" />
            <span>{isEnglish ? 'Download Checklist (PDF)' : 'Descargar Checklist (PDF)'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LeadMagnetBanner;
