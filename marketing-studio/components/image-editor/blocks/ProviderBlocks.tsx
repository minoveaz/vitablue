import React from 'react';
import { Building2, Check } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';
import { BlockPropsHandler } from './AdvisorBlocks';

export const ProviderGridHeaderBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex flex-col items-center justify-center text-center w-full h-full">
    <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-teal-900/40 text-teal-400">
      <Building2 className="size-5" />
    </div>
    <InlineEditableText
      text={String(props.title ?? 'COMPAÑÍAS LÍDERES AUTORIZADAS')}
      onSave={(newVal) => onUpdateProps?.(layerId, { title: newVal })}
      className="font-display text-base font-black text-white tracking-tight block w-full text-center"
      as="h3"
    />
    <InlineEditableText
      text={String(props.subtitle ?? 'Aceptadas oficialmente por Extranjería y Consulados')}
      onSave={(newVal) => onUpdateProps?.(layerId, { subtitle: newVal })}
      className="mt-1 text-xs text-[#94D2BD] block w-full text-center"
      as="p"
    />
  </div>
);

export const ProviderBadgeBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div
    className={`flex w-full h-full flex-col items-center justify-center rounded-2xl border p-3.5 transition-all ${
      props.color === '#EE9B00' || props.highlight
        ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-md'
        : 'border-white/10 bg-white/5 text-white'
    }`}
  >
    <InlineEditableText
      text={String(props.name ?? 'ASEGURADORA')}
      onSave={(newVal) => onUpdateProps?.(layerId, { name: newVal })}
      className="font-display text-sm font-black tracking-wider uppercase"
      as="strong"
    />
    {Boolean(props.badge) && (
      <span
        className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold ${
          props.color === '#EE9B00' || Boolean(props.highlight)
            ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30'
            : 'bg-white/10 text-teal-300'
        }`}
      >
        <Check className="size-2.5" />
        <InlineEditableText
          text={String(props.badge)}
          onSave={(newVal) => onUpdateProps?.(layerId, { badge: newVal })}
        />
      </span>
    )}
  </div>
);
