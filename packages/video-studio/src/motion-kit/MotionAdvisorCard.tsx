import React from 'react';
import type { MotionAdvisorCardProps } from './types';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export const MotionAdvisorCard: React.FC<MotionAdvisorCardProps> = ({
  name = 'Sofía',
  role = 'Asesora Especialista en Visados',
  badge = 'ASESORA ASIGNADA · EN DIRECTO',
  message = 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
  avatarUrl,
  whatsAppText = 'Pregúntanos por WhatsApp',
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
      {/* STATUS BADGE */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-950/60 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#94D2BD]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span>{badge}</span>
      </div>

      {/* AVATAR */}
      <div className="relative mb-4">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-amber-500 bg-[#005F73] text-2xl font-black text-white shadow-lg ring-4 ring-amber-500/20 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="size-full object-cover" />
          ) : (
            <span>{name.charAt(0)}</span>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-[#001219]">
          <ShieldCheck className="size-3.5" />
        </div>
      </div>

      {/* NAME & ROLE */}
      <h3 className="font-display text-xl font-black text-white tracking-tight leading-tight">
        {name}
      </h3>
      <p className="mt-0.5 text-xs font-bold text-[#94D2BD]">
        {role}
      </p>

      {/* MESSAGE QUOTE */}
      {message && (
        <div className="my-4 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-slate-200 shadow-inner">
          <p className="italic text-center text-slate-200">
            "{message}"
          </p>
        </div>
      )}

      {/* WHATSAPP CTA BUTTON */}
      <div className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/40 hover:bg-[#20bd5a] transition-transform active:scale-95 cursor-pointer">
        <MessageCircle className="size-4 fill-white" />
        <span>{whatsAppText}</span>
      </div>
    </div>
  );
};
