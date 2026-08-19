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
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg select-none z-40 animate-fadeIn text-xs">
      <span className="text-[11px] font-bold text-slate-700 px-2 border-r border-slate-100 max-w-[120px] truncate">
        {layer.title}
      </span>

      {/* SCALE ZOOM */}
      <button
        type="button"
        onClick={() => onScaleChange(layer.id, (layer.scale ?? 1) - 0.1)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="Reducir tamaño"
      >
        <ZoomOut className="size-3.5" />
      </button>
      <span className="text-[10px] font-mono font-bold text-slate-500 w-8 text-center">
        {Math.round((layer.scale ?? 1) * 100)}%
      </span>
      <button
        type="button"
        onClick={() => onScaleChange(layer.id, (layer.scale ?? 1) + 0.1)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="Aumentar tamaño"
      >
        <ZoomIn className="size-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-100 mx-0.5" />

      {/* CENTRAR */}
      <button
        type="button"
        onClick={() => onCenter(layer.id)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="Centrar en el lienzo"
      >
        <AlignCenter className="size-3.5" />
      </button>

      {/* DUPLICAR */}
      <button
        type="button"
        onClick={() => onDuplicate(layer.id)}
        className="flex size-7 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="Duplicar elemento (Cmd+D)"
      >
        <Copy className="size-3.5" />
      </button>

      <div className="h-4 w-px bg-slate-100 mx-0.5" />

      {/* ELIMINAR */}
      <button
        type="button"
        onClick={() => onRemove(layer.id)}
        className="flex size-7 items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
        title="Eliminar elemento"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
};
