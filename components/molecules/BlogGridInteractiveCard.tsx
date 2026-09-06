import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';

interface BlogGridInteractiveCardProps {
  isEnglish: boolean;
}

export const BlogGridInteractiveCard: React.FC<BlogGridInteractiveCardProps> = ({ isEnglish }) => {
  const badge = isEnglish ? "Free Consular Tool" : "Herramienta Consular Gratuita";
  const title = isEnglish
    ? "Need to verify if your health insurance is 100% valid for your Spain Visa?"
    : "¿Necesitas verificar si tu seguro médico es 100% válido para tu Visado en España?";
  const subtitle = isEnglish
    ? "Check consular compliance in 30 seconds or compare approved expat policies without copays."
    : "Comprueba el cumplimiento consular en 30 segundos o cotiza pólizas aprobadas sin copagos.";

  const points = isEnglish
    ? [
        "100% Validated by Foreign Offices & Consulates",
        "0€ Copays, 0 Waiting Periods, Repatriation included",
        "Instant certificate & Rejection Refund Guarantee",
      ]
    : [
        "100% Válido ante Consulados y Oficinas de Extranjería",
        "0€ Copagos, Sin Carencias y Repatriación incluida",
        "Certificado en 24h y Garantía de Devolución por Denegación",
      ];

  const primaryBtnText = isEnglish ? "Quote Expat Insurance" : "Cotizar seguro en 30s";
  const secondaryBtnText = isEnglish ? "Consular Validator" : "Validador Consular";
  const primaryLink = "/wizard/";
  const secondaryLink = "/validador-visado/";

  return (
    <div className="flex flex-col bg-gradient-to-br from-primary-dark via-primary to-primary-dark text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-primary/30 relative overflow-hidden justify-between group">
      {/* Decorative gradient blur */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-accent/20 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/30 transition-all duration-700" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent font-black text-[10px] uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 fill-accent" />
          {badge}
        </div>

        <h3 className="text-xl sm:text-2xl font-display font-black text-white leading-snug">
          {title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
          {subtitle}
        </p>

        <ul className="space-y-2 pt-2">
          {points.map((pt, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs text-slate-100 font-medium">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan shrink-0" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
        <Link to={primaryLink} className="flex-1">
          <Button
            variant="accent"
            size="md"
            className="w-full justify-center font-bold text-xs shadow-md shadow-accent/20"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {primaryBtnText}
          </Button>
        </Link>
        <Link to={secondaryLink} className="flex-1">
          <Button
            variant="outline"
            size="md"
            className="w-full justify-center font-bold text-xs !text-white !border-white/30 hover:!bg-white/10"
            leftIcon={<ShieldCheck className="w-4 h-4 text-brand-cyan" />}
          >
            {secondaryBtnText}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogGridInteractiveCard;
