import React, { useRef } from 'react';
import type { Scene } from '../../packages/video-studio/src/domain/videoProject';
import { videoTemplateRegistry } from '../../packages/video-studio/src/engine/templateRegistry';
import { Type, MessageSquare, ShieldCheck, Image, Music, Eye, EyeOff } from 'lucide-react';

export interface VideoTimelineProps {
  scenes: Scene[];
  currentFrame: number;
  fps: number;
  onSeek: (frame: number) => void;
  onSelectScene: (sceneId: string, startFrame: number) => void;
  onResizeScene?: (sceneId: string, durationInFrames: number) => void;
  selectedLayerId?: string;
  onSelectLayer: (layerId: string) => void;
  onToggleLayer: (layerId: string, property: 'visible' | 'locked') => void;
  onRemoveLayer?: (layerId: string) => void;
  onContextMenu?: (e: React.MouseEvent, target: { type: 'scene'; sceneId: string } | { type: 'layer'; sceneId: string; layerId: string }) => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  scenes,
  currentFrame,
  fps = 30,
  onSeek,
  onSelectScene,
  selectedLayerId,
  onSelectLayer,
  onToggleLayer,
  onContextMenu,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalFrames = scenes.reduce((total, scene) => total + scene.durationInFrames, 0);
  const totalSeconds = totalFrames / fps;

  const playheadPercent = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    const targetPercent = Math.max(0, Math.min(1, clickX / bounds.width));
    const targetFrame = Math.round(targetPercent * totalFrames);
    onSeek(targetFrame);
  };

  return (
    <div className="flex h-56 shrink-0 flex-col border-t border-slate-800 bg-slate-950 text-white select-none">
      {/* TIMELINE TIME RULER */}
      <div
        className="relative h-6 shrink-0 border-b border-slate-800/80 bg-slate-900/60 px-4 flex items-center cursor-pointer"
        onClick={handleTimelineClick}
      >
        <div className="relative w-full h-full flex items-center">
          {Array.from({ length: Math.ceil(totalSeconds) + 1 }).map((_, sec) => {
            const leftPercent = totalSeconds > 0 ? (sec / totalSeconds) * 100 : 0;
            return (
              <div
                key={sec}
                style={{ left: `${leftPercent}%` }}
                className="absolute flex flex-col items-center -translate-x-1/2"
              >
                <span className="font-mono text-[9px] font-bold text-slate-400">{sec}s</span>
                <div className="h-1.5 w-px bg-slate-700 mt-0.5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* TRACKS CONTAINER WITH SCRUBBING & PLAYHEAD */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-x-hidden overflow-y-auto p-3 space-y-2 cursor-pointer"
        onClick={handleTimelineClick}
      >
        {/* PLAYHEAD (AGUJA ROJA) */}
        <div
          style={{ left: `${playheadPercent}%` }}
          className="pointer-events-none absolute inset-y-0 z-30 w-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] -translate-x-1/2"
        >
          <div className="size-2.5 rounded-full bg-red-500 shadow-md -translate-x-1/2 -translate-y-1" />
        </div>

        {/* PISTA 1: ESCENAS PRINCIPALES */}
        <div className="relative flex h-14 w-full gap-1.5 rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          {scenes.map((scene, index) => {
            const sceneStart = scenes
              .slice(0, index)
              .reduce((total, prev) => total + prev.durationInFrames, 0);
            const isActive = currentFrame >= sceneStart && currentFrame < sceneStart + scene.durationInFrames;
            const width = totalFrames > 0 ? `${(scene.durationInFrames / totalFrames) * 100}%` : '0%';

            return (
              <div
                key={scene.id}
                style={{ width }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onContextMenu?.(e, { type: 'scene', sceneId: scene.id });
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectScene(scene.id, sceneStart);
                }}
                className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-lg border p-2 text-left transition-all ${
                  isActive
                    ? 'border-primary bg-primary/20 text-white shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between min-w-0">
                  <span className="truncate text-[10px] font-bold">
                    {index + 1}. {videoTemplateRegistry[scene.templateId]?.label ?? scene.templateId}
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 shrink-0">
                    {(scene.durationInFrames / fps).toFixed(1)}s
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-slate-500">
                  <span>{scene.layers.length} capas</span>
                  {scene.transition?.type !== 'none' && (
                    <span className="rounded bg-slate-800 px-1 text-[8px] text-brand-cyan">
                      {scene.transition?.type}
                    </span>
                  )}
                </div>

                {/* Tirador de Resize a la derecha */}
                <div
                  className="absolute right-0 inset-y-0 w-2 cursor-ew-resize hover:bg-primary/40 transition-colors"
                  title="Estirar o acortar duración de escena"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            );
          })}
        </div>

        {/* PISTA 2: CAPAS DE TEXTO Y OVERLAYS DE LA ESCENA ACTIVA */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 shrink-0 w-16">Capas:</span>
          {scenes.flatMap((s) => s.layers.map((l) => ({ ...l, sceneId: s.id }))).map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            return (
              <div
                key={layer.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onContextMenu?.(e, { type: 'layer', sceneId: layer.sceneId, layerId: layer.id });
                }}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1 text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent/20 text-white shadow-xs ring-1 ring-accent'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {layer.type === 'text' ? (
                  <Type className="size-3 text-brand-cyan shrink-0" />
                ) : layer.type === 'subtitle' ? (
                  <MessageSquare className="size-3 text-accent shrink-0" />
                ) : layer.type === 'component' ? (
                  <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
                ) : layer.type === 'audio' ? (
                  <Music className="size-3 text-purple-400 shrink-0" />
                ) : (
                  <Image className="size-3 text-slate-400 shrink-0" />
                )}
                <span className="truncate max-w-[120px] font-semibold text-[11px]">
                  {layer.type === 'text'
                    ? (layer as any).text
                    : layer.type === 'subtitle'
                      ? (layer as any).text
                      : layer.type === 'component'
                        ? (layer as any).componentId
                        : layer.type}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLayer(layer.id, 'visible');
                  }}
                  className="text-slate-500 hover:text-white"
                >
                  {layer.visible === false ? <EyeOff className="size-3 text-amber-400" /> : <Eye className="size-3" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
