import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Scissors } from 'lucide-react';
import type { RenderJob } from '../../../packages/video-studio/src/engine/renderJobs';
import { LiveStatus } from '../../../components/backoffice-shell/primitives';

export interface TransportControlsProps {
  isPlaying: boolean;
  currentFrame: number;
  totalFrames: number;
  fps?: number;
  onPlayPause: () => void;
  onRestart: () => void;
  onPrevScene?: () => void;
  onNextScene?: () => void;
  onSplitAtPlayhead?: () => void;
  renderJob?: RenderJob | null;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  currentFrame,
  totalFrames,
  fps = 30,
  onPlayPause,
  onRestart,
  onPrevScene,
  onNextScene,
  onSplitAtPlayhead,
  renderJob,
}) => {
  const currentSeconds = (currentFrame / fps).toFixed(2);
  const totalSeconds = (totalFrames / fps).toFixed(2);

  const formatTime = (secsStr: string) => {
    const totalSec = parseFloat(secsStr);
    const m = Math.floor(totalSec / 60);
    const s = Math.floor(totalSec % 60);
    const cs = Math.floor((totalSec - Math.floor(totalSec)) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  return (
    <div role="toolbar" aria-label="Controles de reproducción" className="flex min-h-14 max-w-full shrink-0 flex-wrap items-center justify-between gap-2 overflow-x-auto border-y border-slate-800 bg-slate-900 px-4 py-1 text-white select-none">
      {/* Botones de Control Central */}
      <div className="flex items-center gap-2">
        {onPrevScene && (
          <button
            type="button"
            onClick={onPrevScene}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Escena anterior"
            aria-label="Escena anterior"
          >
            <SkipBack className="size-4" aria-hidden="true" />
          </button>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          title="Reiniciar (Frame 0)"
          aria-label="Reiniciar al inicio"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark shadow-md transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
          title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
        >
          {isPlaying ? <Pause className="size-4 fill-current" aria-hidden="true" /> : <Play className="size-4 fill-current ml-0.5" aria-hidden="true" />}
        </button>

        {onNextScene && (
          <button
            type="button"
            onClick={onNextScene}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Siguiente escena"
            aria-label="Siguiente escena"
          >
            <SkipForward className="size-4" aria-hidden="true" />
          </button>
        )}

        {onSplitAtPlayhead && (
          <button
            type="button"
            onClick={onSplitAtPlayhead}
            aria-label="Dividir escena en el cabezal"
            className="ml-2 flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-bold text-accent hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
            title="Dividir escena en cabezal (Cmd+B)"
          >
            <Scissors className="size-3.5" aria-hidden="true" />
            <span>Dividir</span>
          </button>
        )}
      </div>

      {/* Timecode Digital & Contador de Frames */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-brand-cyan bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
          <span>{formatTime(currentSeconds)}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{formatTime(totalSeconds)}</span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px] text-slate-500">
          Frame {currentFrame} / {totalFrames} ({fps} fps)
        </span>
      </div>

      {/* Estado de Render Worker */}
      <div className="flex items-center gap-3">
        {renderJob && renderJob.status === 'rendering' && (
          <LiveStatus status="rendering" message={`Renderizando ${renderJob.progress ?? 0}%`} className="min-h-11 text-xs" />
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">30 FPS</span>
      </div>
    </div>
  );
};
