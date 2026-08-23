import React from 'react';
import type { MotionTrustBadgeProps } from './types';
import { Shield, CheckCircle2 } from 'lucide-react';

export const MotionTrustBadge: React.FC<MotionTrustBadgeProps> = ({
  title = 'PÓLIZA 100% VÁLIDA PARA VISADO',
  subtitle = 'Sin Copagos · Cobertura Completa · Repatriación Incluida',
  highlight = 'GARANTÍA CONSULAR',
  verifiedLabel = 'VERIFICADO PARA EXTRANJERÍA',
  tokens = {},
  className = '',
  style,
}) => {
  return (
    <div
      className={`relative flex w-full max-w-[420px] h-full flex-col items-center justify-between rounded-3xl border border-amber-500/40 bg-[#001219]/90 p-6 text-center shadow-2xl backdrop-blur-xl transition-all ${className}`}
      style={{
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(238, 155, 0, 0.15)',
        backgroundColor: tokens?.surfaceBg,
        ...style,
      }}
    >
      {/* SHIELD ICON */}
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-inner">
        <Shield className="size-7" />
      </div>

      {/* HIGHLIGHT PILL */}
      <span className="mb-3 inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-300">
        {highlight}
      </span>

      {/* TITLE */}
      <h3 className="font-display text-lg font-black text-white tracking-tight leading-snug">
        {title}
      </h3>

      {/* SUBTITLE */}
      <p className="mt-2 text-xs font-semibold text-[#94D2BD] leading-relaxed">
        {subtitle}
      </p>

      {/* VERIFIED PILL */}
      <div className="mt-5 flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
        <CheckCircle2 className="size-4" />
        <span>{verifiedLabel}</span>
      </div>
    </div>
  );
};
