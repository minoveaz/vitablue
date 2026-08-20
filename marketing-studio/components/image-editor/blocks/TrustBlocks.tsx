import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';
import { BlockPropsHandler } from './AdvisorBlocks';

export const TrustShieldIconBlock: React.FC = () => (
  <div className="flex size-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-inner">
    <Shield className="size-7" />
  </div>
);

export const TrustHighlightPillBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center">
    <span className="inline-block rounded-full bg-amber-500/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-amber-300">
      <InlineEditableText
        text={String(props.highlight ?? 'GARANTÍA CONSULAR')}
        onSave={(newVal) => onUpdateProps?.(layerId, { highlight: newVal })}
        as="span"
      />
    </span>
  </div>
);

export const TrustBadgeTitleBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center w-full h-full">
    <InlineEditableText
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
      text={String(props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida')}
      onSave={(newVal) => onUpdateProps?.(layerId, { subtitle: newVal })}
      className="text-xs font-semibold text-[#94D2BD] leading-relaxed text-center w-full block"
      as="p"
    />
  </div>
);

export const TrustVerifiedPillBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center">
    <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
      <CheckCircle2 className="size-4" />
      <InlineEditableText
        text={String(props.verifiedLabel ?? 'VERIFICADO PARA EXTRANJERÍA')}
        onSave={(newVal) => onUpdateProps?.(layerId, { verifiedLabel: newVal })}
        as="span"
      />
    </div>
  </div>
);
