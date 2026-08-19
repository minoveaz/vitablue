import React from 'react';
import { Shield } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';
import { BlockPropsHandler } from './AdvisorBlocks';

export const TrustShieldIconBlock: React.FC = () => (
  <div className="flex size-14 items-center justify-center rounded-2xl border border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-inner">
    <Shield className="size-7" />
  </div>
);

export const TrustBadgeTitleBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <InlineEditableText
    text={String(props.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO')}
    onSave={(newVal) => onUpdateProps?.(layerId, { title: newVal })}
    className="font-display text-lg font-black text-white tracking-tight leading-snug text-center w-full block"
    as="h3"
  />
);

export const TrustBadgeSubtitleBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <InlineEditableText
    text={String(props.subtitle ?? 'Sin Copagos · Cobertura Completa · Repatriación Incluida')}
    onSave={(newVal) => onUpdateProps?.(layerId, { subtitle: newVal })}
    className="text-xs font-semibold text-[#94D2BD] leading-relaxed text-center w-full block"
    as="p"
  />
);
