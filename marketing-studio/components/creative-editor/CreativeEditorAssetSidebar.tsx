import React, { useState } from 'react';
import { Layers, Palette, Sparkles, Plus, Copy, Trash2, ChevronUp, ChevronDown, Type, MessageSquare, ShieldCheck, Image, Music, Shield } from 'lucide-react';
import { ModuleContextSidebar } from '../../../components/backoffice-shell/ModuleContextSidebar';
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
  onCollapse?: () => void;
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
  onCollapse,
}) => {
  const [activeTab, setActiveTab] = useState<'storyboard' | 'brand' | 'elements'>('storyboard');

  return (
    <ModuleContextSidebar
      label="Biblioteca Creativa"
      width="standard"
      onCollapse={onCollapse}
    >
      {/* PESTAÑAS PRINCIPALES (BRAND KIT | STORYBOARD | ELEMENTOS) */}
      <div className="flex rounded-xl bg-slate-200/80 p-1 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab('storyboard')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === 'storyboard' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="size-3.5" />
          <span>Escenas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === 'brand' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Shield className="size-3.5 text-accent" />
          <span>Brand Kit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('elements')}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
            activeTab === 'elements' ? 'bg-white text-primary shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="size-3.5" />
          <span>Capas</span>
        </button>
      </div>

      {/* PESTAÑA 1: STORYBOARD & ESCENAS */}
      {activeTab === 'storyboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Storyboard ({scenes.length})</span>
            <button
              type="button"
              onClick={() => onAddScene('text_hook')}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors"
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
                  onClick={() => onSelectSlide(scene.id)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5 shadow-xs ring-1 ring-primary/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-slate-800">
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
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      title="Subir escena"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onMoveScene(scene.id, 'down'); }}
                      disabled={index === scenes.length - 1}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      title="Bajar escena"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDuplicateScene(scene.id); }}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      title="Duplicar"
                    >
                      <Copy className="size-3.5" />
                    </button>
                    {scenes.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemoveScene(scene.id); }}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
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

          <div className="pt-2 border-t border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Plantillas y Presets</span>
            <button
              type="button"
              onClick={() => onLoadPreset(defaultVisaRejectionProject.scenes)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-white hover:border-primary transition-colors"
            >
              <span>Reel Rechazo de Visado</span>
              <Sparkles className="size-3.5 text-accent" />
            </button>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: BRAND KIT VITABLUE */}
      {activeTab === 'brand' && (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Componentes de Marca</span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onAddComponentLayer('AdvisorCard')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-800">Tarjeta Asesor VitaBlue</strong>
                  <span className="text-[10px] text-slate-500">AdvisorCard con WhatsApp directo</span>
                </div>
                <ShieldCheck className="size-4 text-emerald-500" />
              </button>

              <button
                type="button"
                onClick={() => onAddComponentLayer('ProductCard')}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-primary hover:bg-primary/5 transition-all"
              >
                <div>
                  <strong className="block text-xs font-bold text-slate-800">Tarjeta Producto Sanitas</strong>
                  <span className="text-[10px] text-slate-500">ProductCard con coberturas</span>
                </div>
                <Palette className="size-4 text-primary" />
              </button>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Ilustraciones Vectoriales</span>
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
                  className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-2.5 text-center hover:border-primary transition-colors"
                >
                  <Image className="size-4 text-brand-cyan mb-1" />
                  <span className="text-[10px] font-bold text-slate-700">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: CAPAS & ELEMENTOS TRADICIONALES */}
      {activeTab === 'elements' && (
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Añadir Capa a la Escena</span>

          <button
            type="button"
            onClick={() => onAddTextLayer('Nuevo titular')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Type className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-800">Texto / Titular</strong>
              <span className="text-[10px] text-slate-500">Texto libre con tipografía y color</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddSubtitleLayer('Subtítulo estilo TikTok')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-accent hover:bg-accent/5 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <MessageSquare className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-800">Subtítulo Viral</strong>
              <span className="text-[10px] text-slate-500">Subtítulo amarillo con caja negra</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddLayer('shape')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-brand-cyan hover:bg-brand-cyan/10 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-cyan/20 text-primary">
              <Palette className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-800">Forma / Pill Badge</strong>
              <span className="text-[10px] text-slate-500">Caja de resalte o insignia</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onAddLayer('audio')}
            className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <Music className="size-4" />
            </div>
            <div>
              <strong className="block text-xs font-bold text-slate-800">Pista de Audio</strong>
              <span className="text-[10px] text-slate-500">Música de fondo o voz en off</span>
            </div>
          </button>
        </div>
      )}
    </ModuleContextSidebar>
  );
};
