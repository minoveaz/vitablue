import React from 'react';
import { MessageSquare, ShieldCheck } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';

export interface BlockPropsHandler {
  layerId: string;
  props: Record<string, unknown>;
  onUpdateProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const HookAlertBadgeBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/40 bg-teal-950/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#94D2BD] shadow-lg backdrop-blur-md">
    <span className="relative flex size-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
    <InlineEditableText
      text={String(props.badge ?? 'ASESORA ASIGNADA · EN DIRECTO')}
      onSave={(newVal) => onUpdateProps?.(layerId, { badge: newVal })}
    />
  </div>
);

export const AdvisorAvatarBadgeBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex flex-col items-center text-center w-full">
    <div className="relative mb-2">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-amber-500 bg-[#005F73] text-2xl font-black text-white shadow-xl ring-4 ring-amber-500/25 overflow-hidden">
        {props.avatarUrl ? (
          <img src={String(props.avatarUrl)} alt={String(props.name ?? 'Asesor')} className="size-full object-cover" />
        ) : (
          <span>{String(props.name ?? 'A').charAt(0)}</span>
        )}
      </div>
      <div className="absolute bottom-0 right-0 flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 ring-[#001219] translate-x-1 translate-y-0.5">
        <ShieldCheck className="size-3.5" />
      </div>
    </div>
    <div className="mt-1.5 space-y-0.5">
      <InlineEditableText
        text={String(props.name ?? 'Sofía')}
        onSave={(newVal) => onUpdateProps?.(layerId, { name: newVal })}
        className="font-display text-xl font-black text-white tracking-tight leading-tight block"
        as="h3"
      />
      <InlineEditableText
        text={String(props.role ?? 'Asesora Especialista en Visados')}
        onSave={(newVal) => onUpdateProps?.(layerId, { role: newVal })}
        className="text-xs font-bold text-[#94D2BD] block"
        as="p"
      />
    </div>
  </div>
);

export const AdvisorQuoteBoxBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="w-full rounded-2xl border border-teal-500/20 bg-slate-950/70 p-4 text-center shadow-inner backdrop-blur-md">
    <p className="text-xs font-medium italic text-slate-200 leading-relaxed">
      "
      <InlineEditableText
        text={String(props.message ?? 'Te acompañamos en todo el proceso')}
        onSave={(newVal) => onUpdateProps?.(layerId, { message: newVal })}
        as="span"
      />
      "
    </p>
  </div>
);

export const WhatsAppCtaButtonBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div
    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.5)] select-none"
  >
    <MessageSquare className="size-4 fill-white shrink-0 pointer-events-none" />
    <InlineEditableText
      text={String(props.whatsAppText ?? 'Pregúntanos por WhatsApp')}
      onSave={(newVal) => onUpdateProps?.(layerId, { whatsAppText: newVal })}
    />
  </div>
);
