import React from 'react';
import { ChevronLeft, ChevronRight, PenLine } from 'lucide-react';
import type { CarouselGeometry } from '../../types/imageStudio';
import {
  StudioStageToolbar,
  StudioStageToolbarControls,
} from '../../../components/backoffice-shell/primitives';

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

export const ImageStageToolbar: React.FC<ImageStageToolbarProps> = ({
  zoom,
  onSetZoom,
  setToolMode,
  rapidDrawMode,
  onSetRapidDrawMode,
  effectiveHandMode,
  handleResetFit,
  isCarousel,
  activeSlideIndex,
  carouselGeometry,
  onSetCurrentSlide,
}) => (
  <StudioStageToolbar data-visual-contract="image-studio-stage-toolbar" className="animate-fadeIn">
    <StudioStageToolbarControls
      isHandToolActive={effectiveHandMode}
      onHandToolChange={(active) => setToolMode(active ? 'hand' : 'select')}
      zoom={zoom}
      minZoom={0.25}
      maxZoom={1.5}
      zoomStep={0.1}
      onZoomChange={onSetZoom}
      isFit={false}
      onFit={handleResetFit}
      beforeZoom={
        <>
          <div className="h-4 w-px bg-slate-800" role="separator" />
          <div className="flex items-center rounded-xl border border-slate-800/80 bg-slate-950/80 p-0.5">
            {([
              ['line', 'Línea'],
              ['curve', 'Curva'],
              ['polyline', 'Multi'],
            ] as const).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => onSetRapidDrawMode(rapidDrawMode === mode ? null : mode)}
                aria-pressed={rapidDrawMode === mode}
                aria-label={`Dibujar ${label.toLowerCase()}`}
                className={`flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                  rapidDrawMode === mode
                    ? 'border-accent/40 bg-accent/25 text-amber-200 shadow-xs'
                    : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
                title={`Dibujar ${label.toLowerCase()} directamente en el lienzo`}
              >
                {mode === 'line' && <PenLine className="size-3" aria-hidden="true" />}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </>
      }
      afterFit={
        isCarousel ? (
          <>
            <div className="h-4 w-px bg-slate-800" role="separator" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSetCurrentSlide?.(Math.max(0, activeSlideIndex - 1))}
                disabled={activeSlideIndex === 0}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                aria-label="Slide anterior"
                title="Slide anterior"
              >
                <ChevronLeft className="size-3.5" aria-hidden="true" />
              </button>
              <span className="min-w-16 text-center font-mono text-[10px] font-bold text-brand-cyan">
                {activeSlideIndex + 1} / {carouselGeometry.slideCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  onSetCurrentSlide?.(
                    Math.min(carouselGeometry.slideCount - 1, activeSlideIndex + 1),
                  )
                }
                disabled={activeSlideIndex === carouselGeometry.slideCount - 1}
                className="flex min-h-11 min-w-11 items-center justify-center rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                aria-label="Slide siguiente"
                title="Slide siguiente"
              >
                <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </>
        ) : undefined
      }
    />
  </StudioStageToolbar>
);
