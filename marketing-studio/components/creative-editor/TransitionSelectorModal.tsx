import React from 'react';
import { X, Zap, MoveRight, Eye, ZoomIn, Sparkles } from 'lucide-react';
import type { TransitionType, TransitionConfig } from '../../../packages/video-studio/src/domain/videoProject';

export interface TransitionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sceneId: string;
  currentTransition?: TransitionConfig;
  onSelectTransition: (sceneId: string, transition: TransitionConfig) => void;
  position?: { x: number; y: number } | null;
}

const transitionOptions: Array<{ type: TransitionType; label: string; description: string; icon: React.ComponentType<{ className?: string }> }> = [
  { type: 'none', label: 'Corte Directo', description: 'Cambio instantáneo sin efecto', icon: X },
  { type: 'fade', label: 'Disolver (Fade)', description: 'Fundido cruzado suave', icon: Eye },
  { type: 'slide', label: 'Deslizar (Slide)', description: 'Desplazamiento horizontal', icon: MoveRight },
  { type: 'zoom', label: 'Zoom (Zoom In)', description: 'Escala rápida y dinámica', icon: ZoomIn },
  { type: 'wipe', label: 'Barrido (Wipe)', description: 'Máscara progresiva de izquierda a derecha', icon: Sparkles },
];

export const TransitionSelectorModal: React.FC<TransitionSelectorModalProps> = ({
  isOpen,
  onClose,
  sceneId,
  currentTransition,
  onSelectTransition,
  position: _position,
}) => {
  if (!isOpen) return null;

  const activeType = currentTransition?.type ?? 'none';
  const duration = currentTransition?.durationInFrames ?? 15;

  const handleSelect = (type: TransitionType) => {
    onSelectTransition(sceneId, { type, durationInFrames: duration });
    onClose();
  };

  const handleDurationChange = (newDur: number) => {
    onSelectTransition(sceneId, { type: activeType, durationInFrames: newDur });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md text-white animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-accent/20 text-accent">
              <Zap className="size-3.5" />
            </div>
            <span className="text-xs font-bold text-slate-100">Transición de Entrada</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* LISTA DE OPCIONES DE TRANSICIÓN */}
        <div className="space-y-1.5 mb-4">
          {transitionOptions.map((opt) => {
            const isSelected = activeType === opt.type;
            const Icon = opt.icon;

            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelect(opt.type)}
                className={`flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                  isSelected
                    ? 'border-accent bg-accent/15 text-white ring-1 ring-accent/50'
                    : 'border-slate-800 bg-slate-950/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex size-7 items-center justify-center rounded-lg ${
                      isSelected ? 'bg-accent text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <strong className="block text-xs font-bold">{opt.label}</strong>
                    <span className="text-[10px] text-slate-400">{opt.description}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CONTROL DE DURACIÓN */}
        {activeType !== 'none' && (
          <div className="pt-3 border-t border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duración del Efecto</span>
              <span className="font-mono text-xs font-bold text-accent">{(duration / 30).toFixed(2)}s ({duration} frames)</span>
            </div>
            <input
              type="range"
              min={6}
              max={30}
              step={3}
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        )}
      </div>
    </div>
  );
};
