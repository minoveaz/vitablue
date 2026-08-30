import React from 'react';
import { ChevronLeft, ChevronRight, Hand, Maximize2, Minus, MousePointer, PenLine, Plus } from 'lucide-react';
import type { CarouselGeometry } from '../../types/imageStudio';

interface ImageStageToolbarProps {
  zoom: number;
  onSetZoom: (zoom: number) => void;
  setToolMode: (mode: 'select' | 'hand') => void;
  rapidDrawMode: 'line' | 'curve' | 'polyline' | null;
  onSetRapidDrawMode: (mode: 'line' | 'curve' | 'polyline' | null) => void;
  effectiveHandMode: boolean;
  handleResetFit: () => void;
  isCarousel: boolean;
  activeSlideIndex: number;
  carouselGeometry: CarouselGeometry;
  onSetCurrentSlide?: (slide: number) => void;
}

export const ImageStageToolbar: React.FC<ImageStageToolbarProps> = ({ zoom, onSetZoom, setToolMode, rapidDrawMode, onSetRapidDrawMode, effectiveHandMode, handleResetFit, isCarousel, activeSlideIndex, carouselGeometry, onSetCurrentSlide }) => (
  <>
      {/* BOTTOM CONTROLS BAR: TOOL SWITCH & ZOOM & SAFE ZONES (CENTERED) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center justify-center gap-2 sm:gap-2.5 rounded-2xl border border-slate-800/90 bg-[#001219]/90 p-1.5 shadow-2xl backdrop-blur-xl z-40 text-white text-xs animate-fadeIn">
        {/* SELECTOR DE MODO DE HERRAMIENTA (SELECCIÓN / MANO) */}
        <div className="flex items-center rounded-xl bg-slate-950/80 p-0.5 border border-slate-800/80">
          <button
            type="button"
            onClick={() => setToolMode('select')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              !effectiveHandMode
                ? 'bg-primary/25 text-brand-cyan shadow-xs border border-brand-cyan/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
            title="Herramienta Selección (V)"
          >
            <MousePointer className="size-3.5" />
            <span className="hidden sm:inline">Selección</span>
            <kbd className="text-[9px] font-mono opacity-60">V</kbd>
          </button>

          <button
            type="button"
            onClick={() => setToolMode('hand')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              effectiveHandMode
                ? 'bg-primary/25 text-brand-cyan shadow-xs border border-brand-cyan/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
            }`}
            title="Herramienta Mano / Pan (H o mantener barra Espaciadora)"
          >
            <Hand className="size-3.5" />
            <span className="hidden sm:inline">Mano</span>
            <kbd className="text-[9px] font-mono opacity-60">H</kbd>
          </button>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center rounded-xl bg-slate-950/80 p-0.5 border border-slate-800/80">
          {([
            ['line', 'Línea'],
            ['curve', 'Curva'],
            ['polyline', 'Multi'],
          ] as const).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              onClick={() => onSetRapidDrawMode(rapidDrawMode === mode ? null : mode)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                rapidDrawMode === mode
                  ? 'bg-accent/25 text-amber-200 shadow-xs border border-accent/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
              }`}
              title={`Dibujar ${label.toLowerCase()} directamente en el lienzo`}
            >
              {mode === 'line' && <PenLine className="size-3" />}
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-800" />

        {/* CONTROLES DE ZOOM */}
        <div className="flex items-center gap-1 px-0.5 sm:px-1">
          <button
            type="button"
            onClick={() => onSetZoom(Math.max(0.25, zoom - 0.1))}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reducir zoom"
          >
            <Minus className="size-3.5" />
          </button>

          <input
            type="range"
            min={0.25}
            max={1.5}
            step={0.05}
            value={zoom}
            onChange={(e) => onSetZoom(parseFloat(e.target.value))}
            className="w-16 sm:w-20 accent-primary cursor-pointer"
          />

          <button
            type="button"
            onClick={() => onSetZoom(Math.min(1.5, zoom + 0.1))}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Aumentar zoom"
          >
            <Plus className="size-3.5" />
          </button>

          <span className="font-mono text-[11px] text-brand-cyan min-w-[36px] text-center font-bold">
            {Math.round(zoom * 100)}%
          </span>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <button
          type="button"
          onClick={handleResetFit}
          className="flex items-center gap-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-200 hover:text-white transition-colors shadow-xs"
          title="Centrar y ajustar al lienzo"
        >
          <Maximize2 className="size-3 text-brand-cyan" />
          <span>Ajustar</span>
        </button>

        {isCarousel && (
          <>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSetCurrentSlide?.(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                title="Slide anterior"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="min-w-16 text-center font-mono text-[10px] font-bold text-brand-cyan">
                {activeSlideIndex + 1} / {carouselGeometry.slideCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  onSetCurrentSlide?.(
                    Math.min(carouselGeometry.slideCount - 1, activeSlideIndex + 1)
                  )
                }
                disabled={activeSlideIndex === carouselGeometry.slideCount - 1}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30"
                title="Slide siguiente"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </>
        )}

      </div>
  </>
);
