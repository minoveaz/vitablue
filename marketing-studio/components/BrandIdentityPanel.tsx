import React from 'react';
import { Check, Type } from 'lucide-react';
import Logo from '@/components/atoms/Logo';

export interface BrandColorToken {
  name: string;
  value: string;
  className: string;
}

interface BrandIdentityPanelProps {
  colorTokens: BrandColorToken[];
}

const creativeRules = [
  'Usar el logo con espacio de protección generoso.',
  'Priorizar Ocean Blue para acciones y puntos de orientación.',
  'Reservar Amber Gold para llamadas de atención.',
  'Mantener mensajes breves y fáciles de escanear.',
];

const BrandIdentityPanel: React.FC<BrandIdentityPanelProps> = ({ colorTokens }) => (
  <div className="grid gap-8 text-left animate-fadeIn lg:grid-cols-[1.1fr_0.9fr]">
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
        <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-primary">Brand board</p>
        <h3 className="font-display text-2xl font-black">Sistema visual VitaBlue</h3>
      </div>
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">Logotipos disponibles</p>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><Logo iconSize={48} showTagline={false} /></div>
            <div className="rounded-2xl bg-primary-dark p-5"><Logo iconSize={48} showTagline={false} variant="colored-on-dark" /></div>
            <div className="rounded-2xl bg-primary p-5"><Logo iconSize={48} showTagline={false} variant="white" /></div>
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">Paleta oficial</p>
          <div className="grid grid-cols-2 gap-3">
            {colorTokens.map((token) => (
              <div key={token.name} className="overflow-hidden rounded-2xl border border-slate-100">
                <div className={`h-20 ${token.className}`} />
                <div className="p-3">
                  <p className="text-xs font-bold text-slate-700">{token.name}</p>
                  <p className="mt-1 font-mono text-[10px] text-slate-400">{token.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl bg-surface-soft p-4">
            <Type className="mt-0.5 text-primary" size={19} />
            <div>
              <p className="text-sm font-bold">Tipografía</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">Poppins para titulares y navegación. Inter para textos funcionales y lectura.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="rounded-3xl bg-primary-dark p-7 text-white shadow-sm sm:p-9">
      <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-brand-cyan">Dirección creativa</p>
      <h3 className="font-display text-3xl font-black leading-tight">Clara, humana y preparada para avanzar.</h3>
      <p className="mt-4 text-sm leading-relaxed text-slate-300">La identidad combina confianza aseguradora con una energía digital accesible. Cada activo debe sentirse útil antes que decorativo.</p>
      <div className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm">
        {creativeRules.map((rule) => (
          <div key={rule} className="flex gap-3">
            <Check className="shrink-0 text-brand-cyan" size={17} />
            <span className="text-slate-300">{rule}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default BrandIdentityPanel;
