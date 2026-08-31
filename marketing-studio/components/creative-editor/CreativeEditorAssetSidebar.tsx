import React, { useMemo } from 'react';
import { Sparkles, Plus, Copy, Trash2, ChevronUp, ChevronDown, Music } from 'lucide-react';
import type { Scene, SceneTemplateId, LayerType } from '../../../packages/video-studio/src/domain/videoProject';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';
import {
  CreativeResourceRegistry,
  createVideoCreativeResourceContext,
  CreativeResourceSlot,
  type CreativeResourceBlockId,
} from '../../../components/creative-resources';

export type CreativeEditorResourceTab =
  | 'storyboard'
  | 'text'
  | 'elements'
  | 'media'
  | 'layers'
  | 'brand'
  | 'backgrounds'
  | 'layout'
  | 'audio';

export interface CreativeEditorAssetSidebarProps {
  scenes: Scene[];
  documentId?: string;
  activeSlideId: string;
  onSelectSlide: (sceneId: string) => void;
  onAddScene: (templateId?: SceneTemplateId) => void;
  onDuplicateScene: (sceneId: string) => void;
  onRemoveScene: (sceneId: string) => void;
  onMoveScene: (sceneId: string, direction: 'up' | 'down') => void;
  onAddLayer: (type: LayerType, assetSrc?: string) => void;
  onAddTextLayer: (text?: string) => void;
  onAddSubtitleLayer: (text?: string) => void;
  onAddComponentLayer: (componentId: string) => void;
  onLoadPreset: (presetScenes: Scene[]) => void;
  selectedLayerId?: string;
  onSelectLayer?: (layerId: string | undefined) => void;
  onUpdateLayerPosition?: (layerId: string, position: { x: number; y: number }) => void;
  /** Kept for callers migrating from the legacy self-contained sidebar. */
  onCollapse?: () => void;
  activeTab?: CreativeEditorResourceTab;
  onActiveTabChange?: (tab: CreativeEditorResourceTab) => void;
}

export const CreativeEditorAssetSidebar: React.FC<CreativeEditorAssetSidebarProps> = ({
  scenes,
  documentId = 'video-studio',
  activeSlideId,
  onSelectSlide,
  onAddScene,
  onDuplicateScene,
  onRemoveScene,
  onMoveScene,
  onAddLayer,
  onAddTextLayer,
  onAddSubtitleLayer,
  onAddComponentLayer,
  onLoadPreset,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayerPosition,
  activeTab: controlledActiveTab,
}) => {
  const activeTab = controlledActiveTab ?? 'storyboard';

  const commonResourceId: CreativeResourceBlockId | null =
    activeTab === 'text' || activeTab === 'elements' || activeTab === 'media' ||
      activeTab === 'layers' || activeTab === 'brand' || activeTab === 'backgrounds' ||
      activeTab === 'layout' ? activeTab : null;
  const resourceContext = useMemo(() => createVideoCreativeResourceContext({
    documentId,
    activeSceneId: activeSlideId,
    selectedLayerIds: selectedLayerId ? [selectedLayerId] : [],
    scenes,
    capabilities: [
      'scene-content-slot',
      ...(commonResourceId === 'text' || commonResourceId === 'elements' || commonResourceId === 'media' || commonResourceId === 'brand' ? ['insert'] : []),
      ...(commonResourceId === 'layout' && Boolean(selectedLayerId && onUpdateLayerPosition) ? ['layout-update'] : []),
      ...(onSelectLayer ? ['select'] : []),
    ],
    actions: {
    upload: async (file: File) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) throw new Error('Selecciona una imagen o vídeo válido.');
      const src = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer el archivo.'));
        reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
        reader.readAsDataURL(file);
      });
      onAddLayer(file.type.startsWith('video/') ? 'video' : 'image', src);
    },
    insert: ({ kind, value }) => {
      if (kind === 'text' && typeof value === 'object' && value !== null) {
        const preset = value as { defaultText?: unknown; value?: unknown; tag?: string; role?: string };
        const text = String(preset.defaultText ?? preset.value ?? 'Nuevo titular');
        if (preset.tag === 'h2' || preset.role === 'h2') onAddSubtitleLayer(text);
        else onAddTextLayer(text);
      } else if (kind === 'text') onAddTextLayer(String(value ?? 'Nuevo titular'));
        if (kind === 'element') {
          onAddLayer('shape');
        }
        if (kind === 'media' && (value === 'image' || value === 'video' || value === 'audio')) onAddLayer(value);
        if (kind === 'brand') {
          const brand = value && typeof value === 'object' ? value as { blockType?: string } : undefined;
          onAddComponentLayer(brand?.blockType ?? String(value ?? 'brand'));
        }
      },
      update: ({ layerId, value }) => {
        if (layerId && typeof value === 'object' && value !== null && 'x' in value && 'y' in value) {
          onUpdateLayerPosition?.(layerId, { x: Number(value.x), y: Number(value.y) });
        }
        if (layerId && typeof value === 'object' && value !== null && 'action' in value) {
          const action = value as { action?: string; value?: string };
          if (action.action === 'align' && action.value === 'center') onUpdateLayerPosition?.(layerId, { x: 50, y: 50 });
        }
      },
      select: onSelectLayer,
    },
    media: commonResourceId === 'media' ? {
      upload: async (file: File) => {
        const signedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => typeof reader.result === 'string'
            ? resolve(reader.result)
            : reject(new Error('No se pudo leer el archivo.'));
          reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
          reader.readAsDataURL(file);
        });
        return {
          id: `video-upload-${Date.now()}`,
          name: file.name,
          signedUrl,
          storagePath: file.name,
          kind: file.type.startsWith('video/') ? 'video' : 'image',
        };
      },
      insert: (source, options) => {
        onAddLayer(options?.kind === 'video' ? 'video' : 'image', source);
      },
      accept: 'image/png,image/jpeg,image/webp,image/svg+xml,video/*',
      validateFile: (file) => file.type.startsWith('image/') || file.type.startsWith('video/')
        ? undefined
        : 'Por favor selecciona un archivo de imagen o vídeo válido.',
    } : undefined,
  }), [activeSlideId, commonResourceId, documentId, onAddComponentLayer, onAddLayer, onAddSubtitleLayer, onAddTextLayer, onSelectLayer, onUpdateLayerPosition, scenes, selectedLayerId]);

  return (
    <div className="min-w-0 select-none" data-visual-contract="shared-studio-resource-content">
      {commonResourceId && CreativeResourceRegistry.resolve(commonResourceId, 'video') && (
        <CreativeResourceSlot
          id={commonResourceId}
          domain="video"
          context={resourceContext}
        />
      )}

      {/* PESTAÑA 1: STORYBOARD & ESCENAS */}
      {activeTab === 'storyboard' && (
        <div id="creative-storyboard-panel" role="tabpanel" aria-label="Escenas" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Storyboard ({scenes.length})</span>
            <button
              type="button"
              onClick={() => onAddScene('text_hook')}
              className="flex items-center gap-1 text-xs font-bold text-brand-cyan hover:text-white transition-colors"
            >
              <Plus className="size-3.5" />
              <span>Nueva escena</span>
            </button>
          </div>

          <div className="space-y-2">
            {scenes.map((scene, index) => {
              const isActive = scene.id === activeSlideId;
              const durationSec = (scene.durationInFrames / 30).toFixed(1);

              return (
                <div
                  key={scene.id}
                  role="group"
                  tabIndex={0}
                  aria-label={`Seleccionar escena ${index + 1}`}
                  onClick={() => onSelectSlide(scene.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      onSelectSlide(scene.id);
                    }
                  }}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
                    isActive
                      ? 'border-primary bg-primary/20 shadow-xs ring-1 ring-primary/50 text-white'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 font-mono text-[11px] font-bold text-slate-300">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-100">
                        {scene.templateId === 'text_hook'
                          ? 'Hook inicial'
                          : scene.templateId === 'requirements_list'
                            ? 'Requisitos Visado'
                            : scene.templateId === 'advisor_cta'
                              ? 'Llamada al Asesor'
                              : 'Logos Aseguradoras'}
                      </p>
                      <span className="text-[10px] text-slate-400">{durationSec}s · {scene.layers.length} capas</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onMoveScene(scene.id, 'up'); }}
                      disabled={index === 0}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                      title="Subir escena"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onMoveScene(scene.id, 'down'); }}
                      disabled={index === scenes.length - 1}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                      title="Bajar escena"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDuplicateScene(scene.id); }}
                      className="flex min-h-11 min-w-11 items-center justify-center rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                      title="Duplicar"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    {scenes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemoveScene(scene.id); }}
                        className="flex min-h-11 min-w-11 items-center justify-center rounded p-1 text-red-200 hover:bg-red-500/20 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
                        title="Eliminar"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Plantillas y Presets</span>
            <button
              type="button"
              onClick={() => onLoadPreset(defaultVisaRejectionProject.scenes)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-left text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:border-primary hover:text-white transition-colors"
            >
              <span>Reel Rechazo de Visado</span>
              <Sparkles className="size-3.5 text-accent" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'audio' && (
        <div id="creative-audio-panel" role="tabpanel" aria-label="Audio" className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Audio de la escena</span>
          <button
            type="button"
            onClick={() => onAddLayer('audio')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-primary hover:bg-primary/10 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-800 text-purple-400">
              <Music className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-100">Pista de Audio</strong>
              <span className="text-[10px] text-slate-400">Música de fondo o voz en off</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
