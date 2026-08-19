import React from 'react';
import type { MotionAdvisorCardProps } from './types';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export const MotionAdvisorCard: React.FC<MotionAdvisorCardProps> = ({
  name = 'Sofía',
  role = 'Asesora Especialista en Visados',
  badge = 'ASESORA ASIGNADA · EN DIRECTO',
  message = 'Te ayudo a verificar que tu póliza cumple el 100% de los requisitos del consulado sin copagos.',
  avatarUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop',
  whatsAppText = 'Pregúntanos por WhatsApp',
  tokens = {},
  className = '',
  style,
}) => {
  return (
    <div
      className={`relative flex w-full max-w-[380px] flex-col items-center rounded-3xl border border-teal-500/40 bg-[#001219]/95 p-6 text-center shadow-2xl backdrop-blur-xl transition-all ${className}`}
      style={{
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 95, 115, 0.3)',
        backgroundColor: tokens?.surfaceBg ?? 'rgba(0, 18, 25, 0.95)',
        ...style,
      }}
    >
      {/* STATUS BADGE */}
      <div
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-950/70 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#94D2BD] shadow-sm"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
        <span>{badge}</span>
      </div>

      {/* AVATAR WITH PHOTO */}
      <div className="relative mb-2">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-amber-500 bg-[#005F73] text-2xl font-black text-white shadow-xl ring-4 ring-amber-500/25 overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="size-full object-cover" />
          ) : (
            <span>{name.charAt(0)}</span>
          )}
        </div>
        <div className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-[#001219] translate-x-1 translate-y-0.5">
          <ShieldCheck className="size-3.5" />
        </div>
      </div>

      {/* NAME & ROLE */}
      <div className="mt-1.5 space-y-0.5">
        <h3 className="font-display text-xl font-black text-white tracking-tight leading-tight">
          {name}
        </h3>
        <p className="text-xs font-bold text-[#94D2BD]">
          {role}
        </p>
      </div>

      {/* MESSAGE QUOTE */}
      {message && (
        <div className="my-3.5 w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 text-left text-xs leading-relaxed text-slate-100 shadow-inner">
          <p className="italic text-center text-slate-100 font-medium">
            "{message}"
          </p>
        </div>
      )}

      {/* WHATSAPP CTA BUTTON */}
      <div
        style={{ backgroundColor: '#25D366' }}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg shadow-emerald-950/50 hover:opacity-95 transition-transform active:scale-95 cursor-pointer"
      >
        <MessageCircle className="size-4 fill-white" />
        <span>{whatsAppText}</span>
      </div>
    </div>
  );
};
