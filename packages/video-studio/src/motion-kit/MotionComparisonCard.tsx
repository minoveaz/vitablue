import React from 'react';
import type { MotionComparisonCardProps } from './types';
import { X, Check } from 'lucide-react';

export const MotionComparisonCard: React.FC<MotionComparisonCardProps> = ({
  title = '¿SEGURO DE VIAJE O SEGURO DE VISADO?',
  wrongOptionTitle = 'Seguro de Viaje Común',
  wrongOptionDesc = 'Denegación de visado: no cumple requisitos consulares ni incluye red médica completa.',
  correctOptionTitle = 'Seguro VitaBlue Extranjería',
  correctOptionDesc = 'Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.',
  tokens = {},
  className = '',
  style,
}) => {
  return (
    <div
      className={`relative flex w-full max-w-[420px] h-full flex-col items-center justify-between rounded-3xl border border-teal-500/30 bg-[#001219]/90 p-5 text-center shadow-2xl backdrop-blur-xl transition-all ${className}`}
      style={{
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 95, 115, 0.2)',
        backgroundColor: tokens?.surfaceBg,
        ...style,
      }}
    >
      <h3 className="font-display text-sm font-black text-white tracking-tight mb-4 uppercase">
        {title}
      </h3>

      <div className="flex flex-col gap-3 w-full text-left">
        {/* WRONG OPTION */}
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/30 p-3.5">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
            <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black">
              <X className="size-3" />
            </span>
            <span>{wrongOptionTitle}</span>
          </div>
          <p className="text-[11px] text-rose-200/80 leading-relaxed pl-6">
            {wrongOptionDesc}
          </p>
        </div>

        {/* CORRECT OPTION */}
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-3.5 shadow-md">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
              <Check className="size-3" />
            </span>
            <span>{correctOptionTitle}</span>
          </div>
          <p className="text-[11px] text-emerald-100 font-medium leading-relaxed pl-6">
            {correctOptionDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
