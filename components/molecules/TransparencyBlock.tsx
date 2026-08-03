import React from 'react';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface TransparencyBlockProps {
  title?: string;
  description?: string;
  inclusions: string[];
  exclusions: string[];
}

export const TransparencyBlock: React.FC<TransparencyBlockProps> = ({
  title,
  description,
  inclusions,
  exclusions,
}) => {
  return (
    <div className="w-full flex flex-col gap-5">
      {(title || description) && (
        <div className="flex flex-col gap-1 text-left">
          {title && <h3 className="text-h3 font-display font-extrabold text-text-main">{title}</h3>}
          {description && <p className="text-body-reg text-text-secondary font-medium">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm">
        {/* Inclusions */}
        <div className="bg-white p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
            <span className="font-display font-bold text-lg text-text-main">Lo que SÍ incluye</span>
          </div>
          <ul className="flex flex-col gap-3">
            {inclusions.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-body-reg text-text-secondary font-semibold leading-relaxed">
                <div className="mt-2.5 size-1.5 rounded-full bg-brand-cyan shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="bg-slate-50/60 p-6 sm:p-8 flex flex-col gap-5">
          <div className="flex items-center gap-2 text-red-500">
            <XCircle className="w-5 h-5" />
            <span className="font-display font-bold text-lg text-text-main">Lo que NO cubre</span>
          </div>
          <ul className="flex flex-col gap-3">
            {exclusions.map((item, index) => (
              <li key={index} className="flex gap-2.5 text-body-reg text-text-secondary font-semibold leading-relaxed">
                <div className="mt-2.5 size-1.5 rounded-full bg-red-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Transparency Note */}
      <div className="flex gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <p className="text-caption text-text-secondary font-medium leading-relaxed">
          Esta comparación busca la máxima transparencia. Mostramos las exclusiones con la misma jerarquía visual que las coberturas para que tomes una decisión informada antes de contratar.
        </p>
      </div>
    </div>
  );
};

export default TransparencyBlock;
