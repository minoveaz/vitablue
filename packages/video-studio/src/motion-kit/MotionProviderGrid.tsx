import React from 'react';
import type { MotionProviderGridProps } from './types';
import { Building2, Check } from 'lucide-react';

export const MotionProviderGrid: React.FC<MotionProviderGridProps> = ({
  title = 'COMPAÑÍAS LÍDERES AUTORIZADAS',
  subtitle = 'Aceptadas oficialmente por Extranjería y Consulados',
  providers = [
    { name: 'SANITAS', tag: 'Sin Copagos', highlight: true },
    { name: 'ADESLAS', tag: 'Visa Ready' },
    { name: 'ASISA', tag: '100% Válido' },
    { name: 'DKV', tag: 'Repatriación' },
  ],
  tokens = {},
  className = '',
  style,
}) => {
  return (
    <div
      className={`relative flex w-full max-w-[420px] flex-col items-center rounded-3xl border border-teal-500/30 bg-[#001219]/90 p-6 text-center shadow-2xl backdrop-blur-xl transition-all ${className}`}
      style={{
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 95, 115, 0.2)',
        backgroundColor: tokens?.surfaceBg,
        ...style,
      }}
    >
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-teal-900/40 text-teal-400">
        <Building2 className="size-5" />
      </div>

      <h3 className="font-display text-base font-black text-white tracking-tight">
        {title}
      </h3>
      <p className="mt-1 text-xs text-[#94D2BD] mb-4">
        {subtitle}
      </p>

      {/* 2X2 GRID */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {providers.map((p, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center rounded-2xl border p-3.5 transition-all ${
              p.highlight
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-white/10 bg-white/5 text-white'
            }`}
          >
            <strong className="font-display text-sm font-black tracking-wider">{p.name}</strong>
            {p.tag && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-[9px] font-bold text-teal-300">
                <Check className="size-2.5" />
                <span>{p.tag}</span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
