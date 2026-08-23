import React from 'react';
import { Copy, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Layer, TextLayer, SubtitleLayer } from '../../../packages/video-studio/src/domain/videoProject';

export interface FloatingLayerToolbarProps {
  layer: Layer;
  onUpdateLayer: (changes: Partial<Layer>) => void;
  onDuplicateLayer: () => void;
  onDeleteLayer: () => void;
  onReorderLayer: (direction: 'up' | 'down') => void;
}

export const FloatingLayerToolbar: React.FC<FloatingLayerToolbarProps> = ({
  layer,
  onUpdateLayer,
  onDuplicateLayer,
  onDeleteLayer,
  onReorderLayer,
}) => {
  const isTextLike = layer.type === 'text' || layer.type === 'subtitle';
  const currentFontSize = (layer as TextLayer | SubtitleLayer).fontSize ?? 44;

  const quickColors = ['#ffffff', '#EE9B00', '#94D2BD', '#005F73', '#ef4444'];

  return (
    <div
      className="absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-900/95 px-2 py-1 shadow-2xl backdrop-blur-md text-white select-none animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* TAMAÑO DE TEXTO (+ / -) */}
      {isTextLike && (
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-800">
          <button
            type="button"
            onClick={() => onUpdateLayer({ fontSize: Math.max(20, currentFontSize - 4) } as any)}
            className="flex size-6 items-center justify-center rounded-md text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Reducir fuente"
          >
            A-
          </button>
          <span className="text-[10px] font-mono text-slate-400 px-1">{currentFontSize}</span>
          <button
            type="button"
            onClick={() => onUpdateLayer({ fontSize: Math.min(96, currentFontSize + 4) } as any)}
            className="flex size-6 items-center justify-center rounded-md text-[11px] font-bold text-slate-300 hover:bg-slate-800 hover:text-white"
            title="Aumentar fuente"
          >
            A+
          </button>
        </div>
      )}

      {/* PALETA RÁPIDA DE COLORES */}
      {isTextLike && (
        <div className="flex items-center gap-1 px-1.5 border-r border-slate-800">
          {quickColors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onUpdateLayer({ color } as any)}
              style={{ backgroundColor: color }}
              className="size-4 rounded-full border border-slate-600 hover:scale-110 transition-transform shadow-xs"
              title={`Color: ${color}`}
            />
          ))}
        </div>
      )}

      {/* REORDENAR Z-INDEX */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-800">
        <button
          type="button"
          onClick={() => onReorderLayer('up')}
          className="flex size-6 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          title="Traer al frente"
        >
          <ArrowUp className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={() => onReorderLayer('down')}
          className="flex size-6 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          title="Enviar al fondo"
        >
          <ArrowDown className="size-3.5" />
        </button>
      </div>

      {/* DUPLICAR */}
      <button
        type="button"
        onClick={onDuplicateLayer}
        className="flex size-6 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-brand-cyan"
        title="Duplicar capa"
      >
        <Copy className="size-3.5" />
      </button>

      {/* ELIMINAR */}
      <button
        type="button"
        onClick={onDeleteLayer}
        className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-red-500/20 hover:text-red-400"
        title="Eliminar capa"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};
