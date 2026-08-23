import React from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Scissors, LoaderCircle } from 'lucide-react';
import type { RenderJob } from '../../../packages/video-studio/src/engine/renderJobs';

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
    <div className="flex h-12 shrink-0 items-center justify-between border-y border-slate-800 bg-slate-900 px-4 text-white select-none">
      {/* Botones de Control Central */}
      <div className="flex items-center gap-2">
        {onPrevScene && (
          <button
            type="button"
            onClick={onPrevScene}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Escena anterior"
            aria-label="Escena anterior"
          >
            <SkipBack className="size-4" />
          </button>
        )}

        <button
          type="button"
          onClick={onRestart}
          className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Reiniciar (Frame 0)"
          aria-label="Reiniciar al inicio"
        >
          <RotateCcw className="size-4" />
        </button>

        <button
          type="button"
          onClick={onPlayPause}
          className="flex size-9 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark shadow-md transition-transform active:scale-95"
          title={isPlaying ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
          aria-label={isPlaying ? 'Pausar vídeo' : 'Reproducir vídeo'}
        >
          {isPlaying ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current ml-0.5" />}
        </button>

        {onNextScene && (
          <button
            type="button"
            onClick={onNextScene}
            className="flex size-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Siguiente escena"
            aria-label="Siguiente escena"
          >
            <SkipForward className="size-4" />
          </button>
        )}

        {onSplitAtPlayhead && (
          <button
            type="button"
            onClick={onSplitAtPlayhead}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-[11px] font-bold text-accent hover:bg-slate-700 transition-colors"
            title="Dividir escena en cabezal (Cmd+B)"
          >
            <Scissors className="size-3.5" />
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
          <div className="flex items-center gap-2 text-xs text-accent animate-pulse font-semibold">
            <LoaderCircle className="size-3.5 animate-spin" />
            <span>Renderizando {renderJob.progress ?? 0}%</span>
          </div>
        )}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">30 FPS</span>
      </div>
    </div>
  );
};
