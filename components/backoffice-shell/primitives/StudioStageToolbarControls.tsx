import React from 'react';
import { Hand, Maximize2, Minus, MousePointer, Plus, RotateCcw } from 'lucide-react';

export interface StudioStageToolbarControlsProps {
  isHandToolActive: boolean;
  onHandToolChange: (active: boolean) => void;
  zoom: number;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  zoomButtonStep?: number;
  onZoomChange: (zoom: number) => void;
  formatZoom?: (zoom: number) => string;
  isFit?: boolean;
  onFit: () => void;
  onResetPan?: () => void;
  beforeZoom?: React.ReactNode;
  afterFit?: React.ReactNode;
}

const iconButtonClass =
  'flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80';

const toolButtonClass = (active: boolean) =>
  `flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
    active
      ? 'border border-brand-cyan/30 bg-primary/25 text-brand-cyan shadow-xs'
      : 'border border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
  }`;

export const StudioStageToolbarControls: React.FC<StudioStageToolbarControlsProps> = ({
  isHandToolActive,
  onHandToolChange,
  zoom,
  minZoom,
  maxZoom,
  zoomStep,
  zoomButtonStep = zoomStep,
  onZoomChange,
  formatZoom = (value) => `${Math.round(value * 100)}%`,
  isFit = false,
  onFit,
  onResetPan,
  beforeZoom,
  afterFit,
}) => (
  <>
    <div className="flex items-center rounded-xl border border-slate-800/80 bg-slate-950/80 p-0.5">
      <button
        type="button"
        onClick={() => onHandToolChange(false)}
        aria-pressed={!isHandToolActive}
        aria-label="Herramienta selección"
        className={toolButtonClass(!isHandToolActive)}
        title="Herramienta Selección (V)"
      >
        <MousePointer className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Selección</span>
        <kbd className="text-[9px] font-mono opacity-60">V</kbd>
      </button>
      <button
        type="button"
        onClick={() => onHandToolChange(true)}
        aria-pressed={isHandToolActive}
        aria-label="Herramienta mano"
        className={toolButtonClass(isHandToolActive)}
        title="Herramienta mano / pan (H)"
      >
        <Hand className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Mano</span>
        <kbd className="text-[9px] font-mono opacity-60">H</kbd>
      </button>
    </div>
    <div className="h-4 w-px bg-slate-800" role="separator" />
    {onResetPan && (
      <button type="button" onClick={onResetPan} aria-label="Centrar lienzo" className={iconButtonClass} title="Centrar lienzo">
        <RotateCcw className="size-3.5" aria-hidden="true" />
      </button>
    )}
    {beforeZoom}
    <div className="flex items-center gap-1 px-0.5 sm:px-1">
      <button
        type="button"
        onClick={() => onZoomChange(Math.max(minZoom, zoom - zoomButtonStep))}
        aria-label="Reducir zoom"
        className={iconButtonClass}
        title="Alejar (Zoom out)"
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <input
        type="range"
        min={minZoom}
        max={maxZoom}
        step={zoomStep}
        value={zoom}
        aria-label="Nivel de zoom del lienzo"
        onChange={(event) => onZoomChange(Number(event.target.value))}
        className="h-1 w-16 cursor-pointer rounded-lg bg-slate-700 accent-primary sm:w-20"
        title={`Zoom: ${formatZoom(zoom)}`}
      />
      <button
        type="button"
        onClick={() => onZoomChange(Math.min(maxZoom, zoom + zoomButtonStep))}
        aria-label="Aumentar zoom"
        className={iconButtonClass}
        title="Acercar (Zoom in)"
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="min-w-[36px] text-center font-mono text-[11px] font-bold text-brand-cyan">
        {isFit ? 'Ajustar' : formatZoom(zoom)}
      </span>
    </div>
    <div className="h-4 w-px bg-slate-800" role="separator" />
    <button
      type="button"
      onClick={onFit}
      aria-label="Ajustar al lienzo"
      className={`flex min-h-11 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
        isFit
          ? 'border-brand-cyan/30 bg-primary/30 text-brand-cyan'
          : 'border-transparent bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
      }`}
      title="Ajustar al tamaño de pantalla"
    >
      <Maximize2 className="size-3" aria-hidden="true" />
      <span>Ajustar</span>
    </button>
    {afterFit}
  </>
);
