import React from 'react';
import { Trash2, AlertTriangle, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import { ModuleContextPanel } from '../../../components/backoffice-shell/ModuleContextPanel';
import type { Scene, Layer, SceneTemplateId, TextLayer, SubtitleLayer, ComponentLayer, TransitionType } from '../../../packages/video-studio/src/domain/videoProject';

export interface CreativeEditorInspectorProps {
  activeScene: Scene | undefined;
  selectedLayerId?: string;
  onUpdateScene: (sceneId: string, changes: Partial<Scene>) => void;
  onUpdateSceneContent: (sceneId: string, key: string, value: unknown) => void;
  onUpdateLayer: (sceneId: string, layerId: string, changes: Partial<Layer>) => void;
  onRemoveLayer: (sceneId: string, layerId: string) => void;
  warnings: string[];
  onClose?: () => void;
}

export const CreativeEditorInspector: React.FC<CreativeEditorInspectorProps> = ({
  activeScene,
  selectedLayerId,
  onUpdateScene,
  onUpdateSceneContent,
  onUpdateLayer,
  onRemoveLayer,
  warnings,
  onClose,
}) => {
  if (!activeScene) {
    return (
      <ModuleContextPanel label="Inspector" width="standard" variant="dark" onClose={onClose}>
        <p className="text-xs text-slate-400">Selecciona una escena o capa para editar sus propiedades.</p>
      </ModuleContextPanel>
    );
  }

  const selectedLayer = activeScene.layers.find((l) => l.id === selectedLayerId);

  return (
    <ModuleContextPanel
      label={selectedLayer ? `Capa: ${selectedLayer.type.toUpperCase()}` : `Escena: ${activeScene.id}`}
      width="standard"
      variant="dark"
      onClose={onClose}
    >
      {/* MODO A: INSPECTOR DE CAPA SELECCIONADA */}
      {selectedLayer ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary/20 text-brand-cyan text-xs font-bold uppercase">
                {selectedLayer.type[0]}
              </span>
              <strong className="text-xs text-slate-200 capitalize">{selectedLayer.type} Layer</strong>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onUpdateLayer(activeScene.id, selectedLayer.id, { visible: selectedLayer.visible === false ? true : false })}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={selectedLayer.visible === false ? 'Mostrar capa' : 'Ocultar capa'}
              >
                {selectedLayer.visible === false ? <EyeOff className="size-4 text-amber-400" /> : <Eye className="size-4" />}
              </button>

              <button
                type="button"
                onClick={() => onUpdateLayer(activeScene.id, selectedLayer.id, { locked: !selectedLayer.locked })}
                className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                title={selectedLayer.locked ? 'Desbloquear' : 'Bloquear'}
              >
                {selectedLayer.locked ? <Lock className="size-4 text-brand-cyan" /> : <Unlock className="size-4" />}
              </button>

              <button
                type="button"
                onClick={() => onRemoveLayer(activeScene.id, selectedLayer.id)}
                className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                title="Eliminar capa"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>

          {/* EDITOR ESPECÍFICO DE TEXTO */}
          {selectedLayer.type === 'text' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texto</label>
                <textarea
                  value={(selectedLayer as TextLayer).text}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { text: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Tamaño de Fuente: {(selectedLayer as TextLayer).fontSize ?? 40}px
                </label>
                <input
                  type="range"
                  min={24}
                  max={96}
                  value={(selectedLayer as TextLayer).fontSize ?? 40}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { fontSize: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Color del Texto</label>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#EE9B00', '#94D2BD', '#005F73'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onUpdateLayer(activeScene.id, selectedLayer.id, { color: c })}
                      style={{ backgroundColor: c }}
                      className="size-6 rounded-full border border-slate-700 shadow-xs focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* EDITOR ESPECÍFICO DE SUBTÍTULO */}
          {selectedLayer.type === 'subtitle' && (
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texto del Subtítulo</label>
                <textarea
                  value={(selectedLayer as SubtitleLayer).text}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { text: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Estilo de Subtítulo</label>
                <select
                  value={(selectedLayer as SubtitleLayer).stylePreset ?? 'viral-yellow'}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { stylePreset: e.target.value as any })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-200 focus:border-primary focus:outline-none"
                >
                  <option value="viral-yellow">Amarillo Viral TikTok (Recomendado)</option>
                  <option value="clean-white">Blanco Limpio con Sombra</option>
                  <option value="classic-box">Caja Azul Oscuro VitaBlue</option>
                </select>
              </div>
            </div>
          )}

          {/* EDITOR ESPECÍFICO DE COMPONENTE VITABLUE */}
          {selectedLayer.type === 'component' && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan block">Props del Componente</span>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre Asesor</label>
                <input
                  type="text"
                  value={((selectedLayer as ComponentLayer).props.name as string) ?? ''}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { props: { ...(selectedLayer as ComponentLayer).props, name: e.target.value } })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cargo / Especialidad</label>
                <input
                  type="text"
                  value={((selectedLayer as ComponentLayer).props.role as string) ?? ''}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { props: { ...(selectedLayer as ComponentLayer).props, role: e.target.value } })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texto Botón WhatsApp</label>
                <input
                  type="text"
                  value={((selectedLayer as ComponentLayer).props.cta as string) ?? ''}
                  onChange={(e) => onUpdateLayer(activeScene.id, selectedLayer.id, { props: { ...(selectedLayer as ComponentLayer).props, cta: e.target.value } })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODO B: INSPECTOR DE ESCENA ACTIVA */
        <div className="space-y-5">
          {/* Advertencias de desbordamiento */}
          {warnings.length > 0 && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>Advertencias de escena:</span>
              </div>
              {warnings.map((w, idx) => (
                <p key={idx} className="text-[11px] leading-relaxed text-amber-200">• {w}</p>
              ))}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Plantilla de Escena</label>
            <select
              value={activeScene.templateId}
              onChange={(e) => onUpdateScene(activeScene.id, { templateId: e.target.value as SceneTemplateId })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs font-bold text-slate-100 focus:border-primary focus:outline-none"
            >
              <option value="text_hook">Hook inicial (Titular)</option>
              <option value="requirements_list">Lista de requisitos (Checklist)</option>
              <option value="advisor_cta">CTA Asesoría (WhatsApp)</option>
              <option value="provider_logos">Logos Aseguradoras</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duración de Escena</label>
              <span className="font-mono text-xs font-bold text-brand-cyan">{(activeScene.durationInFrames / 30).toFixed(1)}s ({activeScene.durationInFrames} frames)</span>
            </div>
            <input
              type="range"
              min={30}
              max={300}
              step={15}
              value={activeScene.durationInFrames}
              onChange={(e) => onUpdateScene(activeScene.id, { durationInFrames: Number(e.target.value) })}
              className="w-full accent-primary"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Transición de Salida</label>
            <select
              value={activeScene.transition?.type ?? 'none'}
              onChange={(e) => onUpdateScene(activeScene.id, { transition: { type: e.target.value as TransitionType, durationInFrames: 15 } })}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 focus:border-primary focus:outline-none"
            >
              <option value="none">Ninguna (Corte directo)</option>
              <option value="fade">Disolver (Fade)</option>
              <option value="slide">Deslizar (Slide)</option>
            </select>
          </div>

          {/* CAMPOS ESPECÍFICOS DE LA PLANTILLA */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan block">Contenido de la Escena</span>

            {activeScene.templateId === 'text_hook' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Titular Principal</label>
                  <textarea
                    value={(activeScene.content.text as string) ?? ''}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'text', e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texto de Badge</label>
                  <input
                    type="text"
                    value={(activeScene.content.badge as string) ?? 'VISA READY'}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'badge', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {activeScene.templateId === 'requirements_list' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de la Lista</label>
                  <input
                    type="text"
                    value={(activeScene.content.title as string) ?? 'Requisitos Visado'}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'title', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none mb-2"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Requisitos (uno por línea)</label>
                  <textarea
                    value={Array.isArray(activeScene.content.items) ? (activeScene.content.items as string[]).join('\n') : ''}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'items', e.target.value.split('\n').filter(Boolean))}
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {activeScene.templateId === 'advisor_cta' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre Asesor</label>
                  <input
                    type="text"
                    value={(activeScene.content.advisorName as string) ?? ''}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'advisorName', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cargo / Especialidad</label>
                  <input
                    type="text"
                    value={(activeScene.content.role as string) ?? ''}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'role', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Llamada a la Acción (Botón)</label>
                  <input
                    type="text"
                    value={(activeScene.content.cta as string) ?? 'Pregúntanos por WhatsApp'}
                    onChange={(e) => onUpdateSceneContent(activeScene.id, 'cta', e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-xs text-slate-100 placeholder-slate-500 focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </ModuleContextPanel>
  );
};
