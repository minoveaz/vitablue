import React from 'react';
import {
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  AlignCenter,
} from 'lucide-react';
import { ImageLayer } from '../../types/imageStudio';

interface ImageQuickToolbarProps {
  layer: ImageLayer;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
  onScaleChange: (id: string, scale: number) => void;
  onCenter: (id: string) => void;
}

export const ImageQuickToolbar: React.FC<ImageQuickToolbarProps> = ({
  layer,
  onDuplicate,
  onRemove,
  onScaleChange,
  onCenter,
}) => {
  return (
    <div className="flex items-center gap-1 rounded-2xl border border-slate-800 bg-slate-950/90 p-1.5 shadow-2xl backdrop-blur-md select-none z-40 animate-fadeIn text-xs text-white">
      <span className="text-[11px] font-bold text-slate-200 px-2 border-r border-slate-800 max-w-[140px] truncate">
        {layer.title}
      </span>

      {/* SCALE ZOOM */}
      <button
        type="button"
        onClick={() => onScaleChange(layer.id, (layer.scale ?? 1) - 0.1)}
        className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Reducir tamaño"
      >
        <ZoomOut className="size-3" />
      </button>
      <span className="text-[10px] font-mono font-bold text-brand-cyan w-8 text-center">
        {Math.round((layer.scale ?? 1) * 100)}%
      </span>
      <button
        type="button"
        onClick={() => onScaleChange(layer.id, (layer.scale ?? 1) + 0.1)}
        className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Aumentar tamaño"
      >
        <ZoomIn className="size-3" />
      </button>

      <div className="h-4 w-px bg-slate-800 mx-0.5" />

      {/* CENTRAR */}
      <button
        type="button"
        onClick={() => onCenter(layer.id)}
        className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Centrar en el lienzo"
      >
        <AlignCenter className="size-3.5" />
      </button>

      {/* DUPLICAR */}
      <button
        type="button"
        onClick={() => onDuplicate(layer.id)}
        className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        title="Duplicar elemento (Cmd+D)"
      >
        <Copy className="size-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-800 mx-0.5" />

      {/* ELIMINAR */}
      <button
        type="button"
        onClick={() => onRemove(layer.id)}
        className="flex size-6 items-center justify-center rounded text-rose-400 hover:bg-rose-950 transition-colors"
        title="Eliminar elemento"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};
