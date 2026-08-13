import React from 'react';
import type { Layer, Scene } from '../../packages/video-studio/src/domain/videoProject';
import { videoTemplateRegistry } from '../../packages/video-studio/src/engine/templateRegistry';

interface VideoTimelineProps {
  scenes: Scene[];
  currentFrame: number;
  fps: number;
  onSeek: (frame: number) => void;
  onSelectScene: (sceneId: string, startFrame: number) => void;
  onResizeScene: (sceneId: string, durationInFrames: number) => void;
  selectedLayerId?: string;
  onSelectLayer: (layerId: string) => void;
  onToggleLayer: (layerId: string, property: 'visible' | 'locked') => void;
  onRemoveLayer: (layerId: string) => void;
  onAddTextLayer: () => void;
  onAddLayer: (type: 'image' | 'video' | 'audio') => void;
}

export const VideoTimeline: React.FC<VideoTimelineProps> = ({
  scenes,
  currentFrame,
  fps,
  onSeek,
  onSelectScene,
  onResizeScene,
  selectedLayerId,
  onSelectLayer,
  onToggleLayer,
  onRemoveLayer,
  onAddTextLayer,
  onAddLayer,
}) => {
  const totalFrames = scenes.reduce((total, scene) => total + scene.durationInFrames, 0);
  let startFrame = 0;
  const activeScene = scenes.find((scene) => {
    const sceneEnd = startFrame + scene.durationInFrames;
    const isActive = currentFrame >= startFrame && currentFrame < sceneEnd;
    startFrame = sceneEnd;
    return isActive;
  });
  const layerLabel = (layer: Layer): string => ({
    text: 'Texto',
    image: 'Imagen',
    video: 'Vídeo',
    audio: 'Audio',
    shape: 'Forma',
    component: 'Componente',
  }[layer.type]);
  const layerStart = (layer: Layer): number => layer.timing?.startFrame ?? 0;
  const layerDuration = (layer: Layer, scene: Scene): number => layer.timing?.durationInFrames ?? scene.durationInFrames;
  const hasMissingSource = (layer: Layer): boolean => (
    (layer.type === 'image' || layer.type === 'video') && !layer.asset.src
  ) || (layer.type === 'audio' && !layer.src);

  return (
    <div className="w-full max-w-[760px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">Timeline</span>
        <span className="font-mono text-[10px] font-bold text-slate-400">{(currentFrame / fps).toFixed(1)}s / {(totalFrames / fps).toFixed(1)}s</span>
      </div>
      <div
        className="relative flex h-16 w-full gap-1 overflow-hidden rounded-xl bg-slate-100 p-1"
        onClick={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const frame = Math.round(((event.clientX - bounds.left) / bounds.width) * totalFrames);
          onSeek(Math.max(0, Math.min(totalFrames - 1, frame)));
        }}
      >
        {scenes.map((scene, index) => {
          const sceneStart = startFrame;
          startFrame += scene.durationInFrames;
          const isActive = currentFrame >= sceneStart && currentFrame < sceneStart + scene.durationInFrames;
          const width = totalFrames > 0 ? `${(scene.durationInFrames / totalFrames) * 100}%` : '0%';

          return (
            <div
              key={scene.id}
              className={`relative flex min-w-0 flex-col justify-between overflow-hidden rounded-lg border px-2 py-1.5 text-left transition-colors ${
                isActive ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-white text-slate-500 hover:border-primary/30'
              }`}
              style={{ width }}
              title={`${videoTemplateRegistry[scene.templateId].label} · ${(scene.durationInFrames / fps).toFixed(1)}s`}
            >
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectScene(scene.id, sceneStart);
                }}
                className="flex min-w-0 flex-1 flex-col justify-between text-left"
              >
                <span className="truncate text-[10px] font-black">{index + 1}. {videoTemplateRegistry[scene.templateId].label}</span>
                <span className="font-mono text-[9px] opacity-70">{(scene.durationInFrames / fps).toFixed(1)}s</span>
              </button>
              <input
                type="range"
                aria-label={`Duración de escena ${index + 1}`}
                min={30}
                max={1800}
                step={30}
                value={scene.durationInFrames}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => onResizeScene(scene.id, Number(event.target.value))}
                className="absolute -bottom-1 left-1 right-1 h-1 cursor-ew-resize accent-primary"
              />
            </div>
          );
        })}
        {totalFrames > 0 && (
          <div
            className="pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 bg-red-500 shadow-sm"
            style={{ left: `${Math.min(100, Math.max(0, (currentFrame / totalFrames) * 100))}%` }}
          />
        )}
      </div>
      {activeScene && (
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-500">
            <span>Pistas de escena</span>
            <div className="flex gap-2">
              <button type="button" onClick={onAddTextLayer} className="text-primary hover:underline">+ Texto</button>
              <button type="button" onClick={() => onAddLayer('image')} className="text-primary hover:underline">+ Imagen</button>
              <button type="button" onClick={() => onAddLayer('video')} className="text-primary hover:underline">+ Vídeo</button>
              <button type="button" onClick={() => onAddLayer('audio')} className="text-primary hover:underline">+ Audio</button>
            </div>
          </div>
          {activeScene.layers.length === 0 ? (
            <p className="text-[10px] text-slate-400">Esta escena aún no tiene clips temporales.</p>
          ) : activeScene.layers.map((layer) => {
            const duration = layerDuration(layer, activeScene);
            return (
              <div key={layer.id} className={`flex h-7 items-center gap-2 rounded-md px-2 text-[10px] ${selectedLayerId === layer.id ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-slate-50'}`}>
                <button type="button" onClick={() => onSelectLayer(layer.id)} className="w-20 shrink-0 text-left font-bold text-slate-500">{layerLabel(layer)}</button>
                <div className="relative h-3 flex-1 rounded bg-slate-200">
                  <span
                    className="absolute inset-y-0 rounded bg-primary/70"
                    style={{
                      left: `${(layerStart(layer) / activeScene.durationInFrames) * 100}%`,
                      width: `${(duration / activeScene.durationInFrames) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-16 text-right font-mono text-slate-400">{(duration / fps).toFixed(1)}s</span>
                {hasMissingSource(layer) && <span className="font-bold text-amber-600" title="Falta la fuente del recurso">Sin fuente</span>}
                <button type="button" onClick={() => onToggleLayer(layer.id, 'visible')} className="text-slate-400" aria-label="Alternar visibilidad">{layer.visible === false ? 'Oculto' : 'Visible'}</button>
                <button type="button" onClick={() => onRemoveLayer(layer.id)} className="text-red-400" aria-label="Eliminar capa">×</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
