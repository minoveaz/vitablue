import React from 'react';
import { Check, X } from 'lucide-react';
import { InlineEditableText } from '../InlineEditableText';
import { BlockPropsHandler } from './AdvisorBlocks';

export const ComparisonHeaderBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex items-center justify-center w-full h-full">
    <InlineEditableText
      text={String(props.title ?? '¿SEGURO DE VIAJE O SEGURO DE VISADO?')}
      onSave={(newVal) => onUpdateProps?.(layerId, { title: newVal })}
      className="font-display text-sm font-black text-white tracking-tight uppercase text-center w-full block"
      as="h3"
    />
  </div>
);

export const ComparisonWrongBoxBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex flex-col justify-center rounded-2xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-left w-full h-full">
    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
      <span className="flex size-4 items-center justify-center rounded-full bg-rose-500 text-white text-[9px] font-black">
        <X className="size-3" />
      </span>
      <InlineEditableText
        text={String(props.wrongOptionTitle ?? 'Seguro de Viaje Común')}
        onSave={(newVal) => onUpdateProps?.(layerId, { wrongOptionTitle: newVal })}
        as="span"
      />
    </div>
    <div className="pl-6">
      <InlineEditableText
        text={String(props.wrongOptionDesc ?? 'No válido para extranjeros')}
        onSave={(newVal) => onUpdateProps?.(layerId, { wrongOptionDesc: newVal })}
        className="text-[11px] text-rose-200/80 leading-relaxed block"
        as="p"
      />
    </div>
  </div>
);

export const ComparisonCorrectBoxBlock: React.FC<BlockPropsHandler> = ({ layerId, props, onUpdateProps }) => (
  <div className="flex flex-col justify-center rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-3.5 shadow-md text-left w-full h-full">
    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-black">
        <Check className="size-3" />
      </span>
      <InlineEditableText
        text={String(props.correctOptionTitle ?? 'Seguro VitaBlue Extranjería')}
        onSave={(newVal) => onUpdateProps?.(layerId, { correctOptionTitle: newVal })}
        as="span"
      />
    </div>
    <div className="pl-6">
      <InlineEditableText
        text={String(props.correctOptionDesc ?? 'Cumple 100% con los requisitos consulares')}
        onSave={(newVal) => onUpdateProps?.(layerId, { correctOptionDesc: newVal })}
        className="text-[11px] text-emerald-100 font-medium leading-relaxed block"
        as="p"
      />
    </div>
  </div>
);
