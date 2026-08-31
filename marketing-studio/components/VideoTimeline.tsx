import React, { useRef, useState } from 'react';
import type { Scene, TransitionConfig } from '../../packages/video-studio/src/domain/videoProject';
import { videoTemplateRegistry } from '../../packages/video-studio/src/engine/templateRegistry';
import { Type, MessageSquare, ShieldCheck, Image, Music, Eye, EyeOff, Zap } from 'lucide-react';
import { TransitionSelectorModal } from './creative-editor/TransitionSelectorModal';
import { getResizedSceneDuration } from '../utils/videoTimeline';
import type { Keyframe } from '../../packages/creative-document/src/types';

export interface VideoTimelineProps {
  scenes: Scene[];
  currentFrame: number;
  fps: number;
  onSeek: (frame: number) => void;
  onSelectScene: (sceneId: string, startFrame: number) => void;
  onResizeScene?: (sceneId: string, durationInFrames: number) => void;
  onUpdateSceneTransition?: (sceneId: string, transition: TransitionConfig) => void;
  selectedLayerId?: string;
  onSelectLayer: (layerId: string) => void;
  onToggleLayer: (layerId: string, property: 'visible' | 'locked') => void;
  onRemoveLayer?: (layerId: string) => void;
  selectedLayerKeyframes?: Record<string, Keyframe[]>;
  onContextMenu?: (e: React.MouseEvent, target: { type: 'scene'; sceneId: string } | { type: 'layer'; sceneId: string; layerId: string }) => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  scenes,
  currentFrame,
  fps = 30,
  onSeek,
  onSelectScene,
  onResizeScene: _onResizeScene,
  onUpdateSceneTransition,
  selectedLayerId,
  onSelectLayer,
  onToggleLayer,
  onContextMenu,
  selectedLayerKeyframes = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalFrames = scenes.reduce((total, scene) => total + scene.durationInFrames, 0);
  const totalSeconds = totalFrames / fps;

  const [activeTransitionSceneId, setActiveTransitionSceneId] = useState<string | null>(null);

  const playheadPercent = totalFrames > 0 ? (currentFrame / totalFrames) * 100 : 0;

  const handleTimelineClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const clickX = event.clientX - bounds.left;
    const targetPercent = Math.max(0, Math.min(1, clickX / bounds.width));
    const targetFrame = Math.round(targetPercent * totalFrames);
    onSeek(targetFrame);
  };

  const activeTransitionScene = scenes.find((s) => s.id === activeTransitionSceneId);
  const keyframeEntries = Object.entries(selectedLayerKeyframes).flatMap(([property, frames]) =>
    frames.map((keyframe) => ({ property, keyframe })),
  );
  const [resizeState, setResizeState] = useState<{
    sceneId: string;
    startX: number;
    startDuration: number;
    framesPerPixel: number;
  } | null>(null);

  const updateSceneDurationFromResize = (event: React.PointerEvent, sceneId: string) => {
    if (!resizeState || resizeState.sceneId !== sceneId || !_onResizeScene) return;
    const nextDuration = getResizedSceneDuration(
      resizeState.startDuration,
      event.clientX - resizeState.startX,
      resizeState.framesPerPixel,
      1,
    );
    _onResizeScene(sceneId, nextDuration);
  };

  return (
    <section aria-label="Timeline de vídeo" className="flex h-56 shrink-0 flex-col border-t border-slate-800 bg-slate-950 text-white select-none">
      {/* TIMELINE TIME RULER */}
      <div
        className="relative h-6 shrink-0 border-b border-slate-800/80 bg-slate-900/60 px-4 flex items-center cursor-pointer"
        onClick={handleTimelineClick}
        role="slider"
        tabIndex={0}
        aria-label="Posición del cabezal"
        aria-valuemin={0}
        aria-valuemax={totalFrames}
        aria-valuenow={currentFrame}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') onSeek(Math.max(0, currentFrame - (event.shiftKey ? fps : 1)));
          if (event.key === 'ArrowRight') onSeek(Math.min(totalFrames, currentFrame + (event.shiftKey ? fps : 1)));
          if (event.key === 'Home') onSeek(0);
          if (event.key === 'End') onSeek(totalFrames);
        }}
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
        className="relative flex-1 overflow-x-auto overflow-y-auto p-3 space-y-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
        onClick={handleTimelineClick}
        role="region"
        aria-label="Pistas del timeline"
        tabIndex={0}
      >
        {/* PLAYHEAD (AGUJA ROJA) */}
        <div
          style={{ left: `${playheadPercent}%` }}
          className="pointer-events-none absolute inset-y-0 z-30 w-px bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] -translate-x-1/2"
        >
          <div className="size-2.5 rounded-full bg-red-500 shadow-md -translate-x-1/2 -translate-y-1" />
        </div>

        {/* PISTA 1: ESCENAS PRINCIPALES CON CONECTORES [⚡] */}
        <div className="relative flex h-14 w-full items-center rounded-xl bg-slate-900/80 p-1 border border-slate-800">
          {scenes.map((scene, index) => {
            const sceneStart = scenes
              .slice(0, index)
              .reduce((total, prev) => total + prev.durationInFrames, 0);
            const isActive = currentFrame >= sceneStart && currentFrame < sceneStart + scene.durationInFrames;
            const width = totalFrames > 0 ? `${(scene.durationInFrames / totalFrames) * 100}%` : '0%';

            return (
              <React.Fragment key={scene.id}>
                {/* BOTÓN CONECTOR DE TRANSICIÓN ENTRE ESCENAS */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTransitionSceneId(scene.id);
                    }}
                    className={`relative z-20 -mx-2.5 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                      scene.transition?.type && scene.transition.type !== 'none'
                        ? 'border-accent bg-accent text-slate-950 scale-110'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                    title={`Transición hacia ${index + 1}: ${scene.transition?.type ?? 'Corte directo'}`}
                  >
                    <Zap className="size-3" aria-hidden="true" />
                  </button>
                )}

                <div
                  style={{ width }}
                  role="group"
                  aria-label={`Escena ${index + 1}`}
                  className="relative h-full min-w-0 shrink-0"
                >
                  <button
                    type="button"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onContextMenu?.(e, { type: 'scene', sceneId: scene.id });
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectScene(scene.id, sceneStart);
                    }}
                    aria-label={`Seleccionar escena ${index + 1}: ${videoTemplateRegistry[scene.templateId]?.label ?? scene.templateId}`}
                    aria-pressed={isActive}
                    className={`group relative flex h-full w-full min-w-0 flex-col justify-between overflow-hidden rounded-lg border p-2 text-left transition-all ${
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
                      {scene.transition?.type && scene.transition.type !== 'none' && (
                        <span className="rounded bg-accent/20 px-1 text-[8px] font-bold text-accent">
                          {scene.transition.type}
                        </span>
                      )}
                    </div>
                  </button>
                  {_onResizeScene && (
                    <span
                      role="slider"
                      tabIndex={0}
                      aria-label={`Redimensionar duración de escena ${index + 1}`}
                      aria-valuemin={1}
                      aria-valuemax={Math.max(1, totalFrames + 600)}
                      aria-valuenow={scene.durationInFrames}
                      className="absolute inset-y-0 right-0 z-10 w-11 cursor-ew-resize rounded-full bg-transparent transition-colors hover:bg-brand-cyan/70 focus-visible:bg-brand-cyan/70 focus-visible:outline-none"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const bounds = containerRef.current?.getBoundingClientRect();
                        if (!bounds) return;
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setResizeState({
                          sceneId: scene.id,
                          startX: event.clientX,
                          startDuration: scene.durationInFrames,
                          framesPerPixel: totalFrames / Math.max(bounds.width, 1),
                        });
                      }}
                      onPointerMove={(event) => updateSceneDurationFromResize(event, scene.id)}
                      onPointerUp={(event) => {
                        event.stopPropagation();
                        setResizeState(null);
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                      }}
                      onPointerCancel={() => setResizeState(null)}
                      onKeyDown={(event) => {
                        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
                        event.preventDefault();
                        const delta = event.key === 'ArrowRight' ? fps : -fps;
                        _onResizeScene(scene.id, Math.max(1, scene.durationInFrames + delta));
                      }}
                    />
                  )}
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* PISTA 2: CAPAS DE TEXTO, OVERLAYS Y AUDIO DE LA ESCENA */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 shrink-0 w-16">Capas:</span>
          {scenes.flatMap((s) => s.layers.map((l) => ({ ...l, sceneId: s.id }))).map((layer) => {
            const isSelected = layer.id === selectedLayerId;
            const isAudio = layer.type === 'audio';

            return (
              <div
                key={layer.id}
                role="group"
                tabIndex={0}
                aria-label={`Seleccionar capa ${layer.type}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectLayer(layer.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onContextMenu?.(e, { type: 'layer', sceneId: layer.sceneId, layerId: layer.id });
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectLayer(layer.id);
                  }
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
                ) : isAudio ? (
                  <Music className="size-3 text-purple-400 shrink-0" />
                ) : (
                  <Image className="size-3 text-slate-400 shrink-0" />
                )}

                {/* VISUALIZACIÓN DE FORMA DE ONDA SI ES AUDIO */}
                {isAudio ? (
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 h-3">
                      {[40, 75, 100, 60, 90, 45, 80, 100, 70, 50].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h}%` }}
                          className="w-0.5 bg-purple-400 rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono">
                      {Math.round(((layer.type === 'audio' ? layer.volume : undefined) ?? 1) * 100)}%
                    </span>
                  </div>
                ) : (
                  <span className="truncate max-w-[120px] font-semibold text-[11px]">
                    {layer.type === 'text'
                      ? layer.text
                      : layer.type === 'subtitle'
                        ? layer.text
                        : layer.type === 'component'
                          ? layer.componentId
                          : layer.type}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLayer(layer.id, 'visible');
                  }}
                  className="ml-1 flex min-h-11 min-w-11 items-center justify-center text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                  aria-label={layer.visible === false ? 'Mostrar capa' : 'Ocultar capa'}
                  aria-pressed={layer.visible !== false}
                >
                  {layer.visible === false ? <EyeOff className="size-3 text-amber-400" /> : <Eye className="size-3" />}
                </button>
              </div>
            );
          })}
        </div>
        {keyframeEntries.length > 0 && (
          <div className="flex items-center gap-2 py-1">
            <span className="w-16 shrink-0 text-[9px] font-bold uppercase tracking-wider text-slate-500">Keyframes:</span>
            <div className="relative h-6 min-w-[12rem] flex-1 rounded bg-slate-900/80">
              {keyframeEntries.map(({ property, keyframe }, index) => {
                const layer = scenes.flatMap((scene) => scene.layers).find((candidate) => candidate.id === selectedLayerId);
                const scene = scenes.find((candidate) => candidate.layers.some((candidateLayer) => candidateLayer.id === selectedLayerId));
                const sceneStart = scene
                  ? scenes.slice(0, scenes.indexOf(scene)).reduce((total, candidate) => total + candidate.durationInFrames, 0)
                  : 0;
                const layerStart = layer?.timing?.startFrame ?? 0;
                const frame = sceneStart + layerStart + Math.round((keyframe.timeMs * fps) / 1000);
                const left = totalFrames > 0 ? `${Math.max(0, Math.min(100, (frame / totalFrames) * 100))}%` : '0%';
                return (
                  <button
                    key={`${property}-${keyframe.timeMs}-${index}`}
                    type="button"
                    style={{ left }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onSeek(Math.max(0, Math.min(totalFrames, frame)));
                    }}
                    title={`${property} · ${keyframe.timeMs} ms`}
                    aria-label={`Ir al keyframe ${property} en ${keyframe.timeMs} ms`}
                    className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm border border-accent bg-accent shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE TRANSICIÓN ENTRE ESCENAS */}
      {activeTransitionScene && (
        <TransitionSelectorModal
          isOpen={Boolean(activeTransitionScene)}
          sceneId={activeTransitionScene.id}
          currentTransition={activeTransitionScene.transition}
          onClose={() => setActiveTransitionSceneId(null)}
          onSelectTransition={(sceneId, transition) => {
            onUpdateSceneTransition?.(sceneId, transition);
          }}
        />
      )}
    </section>
  );
};
