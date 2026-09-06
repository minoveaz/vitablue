import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '@/components/atoms/Button';

interface BlogConsularValidatorCalloutProps {
  isEnglish?: boolean;
  variant?: 'inline' | 'sidebar';
}

export const BlogConsularValidatorCallout: React.FC<BlogConsularValidatorCalloutProps> = ({
  isEnglish = false,
  variant = 'inline',
}) => {
  const title = isEnglish
    ? 'Is your health insurance 100% compliant with Extranjería?'
    : '¿Tu seguro médico cumple al 100% los requisitos de Extranjería?';

  const description = isEnglish
    ? 'Avoid visa rejections at the consulate. Audit your policy in 30 seconds with our free consular diagnostic tool.'
    : 'Evita inadmisiones o requerimientos en el consulado. Audita tu póliza en 30 segundos con nuestro validador oficial gratuito.';

  const ctaText = isEnglish ? 'Audit My Policy Free' : 'Validar mi seguro gratis';

  const checks = isEnglish
    ? ['0€ Copays', 'No Waiting Periods', 'DGSFP-Authorized', 'Repatriation Included']
    : ['0€ Copagos', 'Sin Carencias', 'Aseguradora DGSFP', 'Repatriación Incluida'];

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-primary/10 via-brand-cyan/10 to-white rounded-[32px] border border-primary/20 p-6 space-y-4 text-left shadow-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-0.5 text-[9px] font-black text-primary uppercase tracking-wider shadow-xs border border-primary/15">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            {isEnglish ? 'Consular Validator' : 'Validador Consular'}
          </span>
        </div>
        <h4 className="text-sm font-display font-black text-text-main leading-snug">
          {title}
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-1.5 py-1">
          {checks.map((check, idx) => (
            <div key={idx} className="flex items-center gap-1 text-[11px] font-bold text-text-main">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{check}</span>
            </div>
          ))}
        </div>
        <Link to="/validador-visado/" className="w-full block pt-1">
          <Button
            className="w-full h-10 rounded-xl font-bold text-xs"
            variant="accent"
            size="sm"
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-brand-cyan/10 to-white border border-primary/20 shadow-sm space-y-5 text-left">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-caption font-black text-primary uppercase tracking-wider shadow-xs border border-primary/15">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          {isEnglish ? 'Official Lead Magnet' : 'Auditoría Oficial Gratuita'}
        </span>
        <span className="text-caption font-bold text-text-secondary flex items-center gap-1">
          ✓ {isEnglish ? '100% Free & Immediate' : 'Diagnóstico Inmediato en 30s'}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-h3 font-display font-black text-text-main leading-snug">
          {title}
        </h3>
        <p className="text-body-reg text-text-secondary leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-1">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 p-2 rounded-xl bg-white/80 border border-slate-200/60 text-caption font-bold text-text-main shadow-xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="truncate">{check}</span>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Link to="/validador-visado/" className="inline-block">
          <Button
            variant="accent"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-md shadow-accent/20 font-bold"
          >
            {ctaText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogConsularValidatorCallout;
