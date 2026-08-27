import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';
import { BlockPropsHandler } from './AdvisorBlocks';

export const TrustShieldIconBlock: React.FC = () => (
  <div className="flex w-full h-full items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-inner p-2">
    <Shield className="size-full max-h-full max-w-full" />
  </div>
);

export const TrustHighlightPillBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => {
  const text = String(props.highlight ?? props.verifiedLabel ?? props.text ?? props.title ?? 'GARANTÍA CONSULAR');
  const bg = String(props.primaryColor ?? props.backgroundColor ?? 'rgba(238, 155, 0, 0.2)');
  const textColor = String(props.textColor ?? props.color ?? '#FCD34D');

  return (
    <div className="flex w-full h-full items-center justify-center">
      <span
        className="flex w-full h-full min-h-[32px] items-center justify-center rounded-full border border-amber-500/40 px-4 py-1.5 text-xs font-black uppercase tracking-widest shadow-md select-none transition-all"
        style={{ backgroundColor: bg, color: textColor }}
      >
        <InlineEditableText
          layerId={layerId}
          text={text}
          onSave={(newVal) => onUpdateProps?.(layerId, { highlight: newVal, text: newVal, verifiedLabel: newVal })}
          as="span"
        />
      </span>
    </div>
  );
};

export const TrustBadgeTitleBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center w-full h-full">
    <InlineEditableText
      layerId={layerId}
      text={String(props.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO')}
      onSave={(newVal) => onUpdateProps?.(layerId, { title: newVal })}
      className="font-display text-lg font-black text-white tracking-tight leading-snug text-center w-full block"
      as="h3"
    />
  </div>
);

export const TrustBadgeSubtitleBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center w-full h-full">
    <InlineEditableText
      layerId={layerId}
      text={String(props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida')}
      onSave={(newVal) => onUpdateProps?.(layerId, { subtitle: newVal })}
      className="text-xs font-semibold text-[#94D2BD] leading-relaxed text-center w-full block"
      as="p"
    />
  </div>
);

export const TrustVerifiedPillBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => {
  const text = String(props.verifiedLabel ?? props.highlight ?? props.text ?? props.title ?? 'VERIFICADO PARA EXTRANJERÍA');
  const bg = String(props.primaryColor ?? props.backgroundColor ?? 'rgba(6, 78, 59, 0.6)');
  const textColor = String(props.textColor ?? props.color ?? '#34D399');

  return (
    <div className="flex w-full h-full items-center justify-center">
      <div
        className="flex w-full h-full min-h-[36px] items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 px-4 py-2 text-xs font-bold shadow-md select-none transition-all"
        style={{ backgroundColor: bg, color: textColor }}
      >
        <CheckCircle2 className="size-4 shrink-0" />
        <InlineEditableText
          layerId={layerId}
          text={text}
          onSave={(newVal) => onUpdateProps?.(layerId, { verifiedLabel: newVal, text: newVal, highlight: newVal })}
          as="span"
        />
      </div>
    </div>
  );
};
