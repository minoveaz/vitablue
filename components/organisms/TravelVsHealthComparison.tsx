import React from 'react';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import SectionIntro from '@/components/molecules/SectionIntro';

export interface TravelVsHealthItem {
  feature: string;
  travel: string;
  health: string;
}

export interface TravelVsHealthComparisonProps {
  eyebrow?: string;
  title: string;
  description: string;
  alertNotice: string;
  items: TravelVsHealthItem[];
  travelLabel?: string;
  healthLabel?: string;
}

export const TravelVsHealthComparison: React.FC<TravelVsHealthComparisonProps> = ({
  eyebrow = 'Diferenciación Crítica',
  title,
  description,
  alertNotice,
  items,
  travelLabel = 'Seguro de Viaje Estándar',
  healthLabel = 'Seguro Médico Homologado (VitaBlue)'
}) => {
  return (
    <section className="w-full bg-slate-50/60 py-16 text-left sm:py-20">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
        />

        {/* Warning Callout Box */}
        <div className="mt-8 mb-10 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-amber-900 shadow-sm">
          <AlertTriangle className="h-6 w-6 shrink-0 text-accent mt-0.5" />
          <p className="text-body-reg font-medium leading-relaxed">
            {alertNotice}
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Travel Insurance Card */}
          <div className="flex flex-col justify-between rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-caption font-bold text-red-700 border border-red-200">
                <XCircle className="h-4 w-4 text-red-700" />
                {travelLabel}
              </div>
              <h3 className="text-h3 font-display font-bold text-text-main mb-6">
                No Válido para Visado
              </h3>
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-reg text-text-secondary">
                    <XCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                    <span>
                      <strong className="text-text-main font-semibold">{item.feature}:</strong> {item.travel}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Health Insurance Card */}
          <div className="flex flex-col justify-between rounded-3xl border-2 border-primary bg-white p-6 shadow-md sm:p-8 relative">
            <div className="absolute -top-3 right-6 rounded-full bg-accent px-4 py-1 text-xs font-extrabold text-primary-dark shadow-sm uppercase tracking-wider">
              100% Exigido por Ley
            </div>
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-cyan/20 px-4 py-1.5 text-caption font-bold text-primary-dark border border-brand-cyan/40">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                {healthLabel}
              </div>
              <h3 className="text-h3 font-display font-bold text-text-main mb-6">
                Aprobación Consular Garantizada
              </h3>
              <ul className="space-y-4">
                {items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-reg text-text-secondary">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <span>
                      <strong className="text-text-main font-semibold">{item.feature}:</strong> {item.health}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelVsHealthComparison;
