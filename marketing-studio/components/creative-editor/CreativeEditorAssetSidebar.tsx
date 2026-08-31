import React, { useState } from 'react';
import { Layers, Palette, Sparkles, Plus, Copy, Trash2, ChevronUp, ChevronDown, Type, MessageSquare, ShieldCheck, Image, Music, Shield } from 'lucide-react';
import type { Scene, SceneTemplateId, LayerType } from '../../../packages/video-studio/src/domain/videoProject';
import { defaultVisaRejectionProject } from '../../../packages/video-studio/src/domain/defaultProject';

export interface CreativeEditorAssetSidebarProps {
  scenes: Scene[];
  activeSlideId: string;
  onSelectSlide: (sceneId: string) => void;
  onAddScene: (templateId?: SceneTemplateId) => void;
  onDuplicateScene: (sceneId: string) => void;
  onRemoveScene: (sceneId: string) => void;
  onMoveScene: (sceneId: string, direction: 'up' | 'down') => void;
  onAddLayer: (type: LayerType) => void;
  onAddTextLayer: (text?: string) => void;
  onAddSubtitleLayer: (text?: string) => void;
  onAddComponentLayer: (componentId: string) => void;
  onLoadPreset: (presetScenes: Scene[]) => void;
  /** Kept for callers migrating from the legacy self-contained sidebar. */
  onCollapse?: () => void;
  activeTab?: 'storyboard' | 'brand' | 'elements' | 'audio';
  onActiveTabChange?: (tab: 'storyboard' | 'brand' | 'elements' | 'audio') => void;
}

export const CreativeEditorAssetSidebar: React.FC<CreativeEditorAssetSidebarProps> = ({
  scenes,
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
  activeTab: controlledActiveTab,
  onActiveTabChange,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'storyboard' | 'brand' | 'elements' | 'audio'>('storyboard');
  const activeTab = controlledActiveTab ?? internalActiveTab;
  const selectTab = (tab: 'storyboard' | 'brand' | 'elements' | 'audio') => {
    setInternalActiveTab(tab);
    onActiveTabChange?.(tab);
  };

  return (
    <div className="min-w-0 select-none" data-visual-contract="shared-studio-resource-content">
      {/* PESTAÑAS PRINCIPALES (BRAND KIT | STORYBOARD | ELEMENTOS) */}
      <div role="tablist" aria-label="Secciones de biblioteca creativa" className="mb-4 flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'storyboard'}
          aria-controls="creative-storyboard-panel"
          onClick={() => selectTab('storyboard')}
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-1.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            activeTab === 'storyboard' ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan shadow-xs' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Layers className="size-3.5" />
          <span>Escenas</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'brand'}
          aria-controls="creative-brand-panel"
          onClick={() => selectTab('brand')}
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-1.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            activeTab === 'brand' ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan shadow-xs' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Shield className="size-3.5 text-accent" />
          <span>Brand Kit</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'elements'}
          aria-controls="creative-elements-panel"
          onClick={() => selectTab('elements')}
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-1.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            activeTab === 'elements' ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan shadow-xs' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Plus className="size-3.5" />
          <span>Capas</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'audio'}
          aria-controls="creative-audio-panel"
          onClick={() => selectTab('audio')}
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border px-1.5 py-1.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80 ${
            activeTab === 'audio' ? 'border-brand-cyan/50 bg-primary/25 text-brand-cyan shadow-xs' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Music className="size-3.5" />
          <span>Audio</span>
        </button>
      </div>

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

      {/* PESTAÑA 2: BRAND KIT & MOTIONKIT */}
      {activeTab === 'brand' && (
        <div id="creative-brand-panel" role="tabpanel" aria-label="Kit de marca" className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">MotionKit Agnóstico (4)</span>
              <a
                href="/backoffice/marketing-studio/assets"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] font-bold text-brand-cyan hover:underline"
              >
                Asset Studio ↗
              </a>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddComponentLayer('MotionAdvisorCard')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan">Tarjeta Asesor (Vertical)</strong>
                  <span className="text-[10px] text-slate-400">Glassmorphism con WhatsApp directo</span>
                </div>
                <ShieldCheck className="size-4 text-emerald-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAddComponentLayer('MotionTrustBadge')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-accent hover:bg-accent/10 transition-all group"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-100 group-hover:text-accent">Sello de Garantía Consular</strong>
                  <span className="text-[10px] text-slate-400">Certificación 100% válido para visado</span>
                </div>
                <Shield className="size-4 text-accent shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAddComponentLayer('MotionProviderGrid')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all group"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-100 group-hover:text-brand-cyan">Grid de Aseguradoras</strong>
                  <span className="text-[10px] text-slate-400">Sanitas, Adeslas, Asisa y DKV</span>
                </div>
                <Palette className="size-4 text-brand-cyan shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => onAddComponentLayer('MotionComparisonCard')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-primary hover:bg-primary/10 transition-all group"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-100 group-hover:text-primary">Comparativa Visual</strong>
                  <span className="text-[10px] text-slate-400">Seguro de viaje ❌ vs Visado ✅</span>
                </div>
                <Sparkles className="size-4 text-brand-cyan shrink-0" />
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Ilustraciones Vectoriales</span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'health', label: 'Salud' },
                { id: 'pet', label: 'Mascotas' },
                { id: 'travel', label: 'Viajes' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onAddLayer('image')}
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 text-center hover:border-primary hover:text-white transition-colors"
                >
                  <Image className="size-4 text-brand-cyan mb-1" />
                  <span className="text-[10px] font-bold text-slate-300">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CAPAS & ELEMENTOS TRADICIONALES */}
      {activeTab === 'elements' && (
        <div id="creative-elements-panel" role="tabpanel" aria-label="Capas y elementos" className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Añadir Capa a la Escena</span>

          <button
            type="button"
            onClick={() => onAddTextLayer('Nuevo titular')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-primary hover:bg-primary/10 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-brand-cyan">
              <Type className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-100">Texto / Titular</strong>
              <span className="text-[10px] text-slate-400">Texto libre con tipografía y color</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddSubtitleLayer('Subtítulo estilo TikTok')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-accent hover:bg-accent/10 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-100">Subtítulo Viral</strong>
              <span className="text-[10px] text-slate-400">Subtítulo amarillo con caja negra</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddLayer('shape')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-left hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-cyan/20 text-brand-cyan">
              <Palette className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-100">Forma / Pill Badge</strong>
              <span className="text-[10px] text-slate-400">Caja de resalte o insignia</span>
            </div>
          </button>

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
