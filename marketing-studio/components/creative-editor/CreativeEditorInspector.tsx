import React, { useState } from 'react';
import type {
  AudioLayer,
  ComponentLayer,
  Layer,
  Scene,
  SceneTemplateId,
  SubtitleLayer,
  TextAnimationType,
  TextLayer,
  SubtitleStylePreset,
  TransitionType,
} from '../../../packages/video-studio/src/domain/videoProject';
import type { Keyframe } from '../../../packages/creative-document/src/types';
import { resolveLayerPosition } from '../../../packages/video-studio/src/domain/videoProject';
import {
  StudioInspector,
  type StudioInspectorControl,
  type StudioInspectorLayer,
  type StudioInspectorSection,
} from '../../../components/creative-resources/inspector';

export interface CreativeEditorInspectorProps {
  activeScene: Scene | undefined;
  selectedLayerId?: string;
  onUpdateScene: (sceneId: string, changes: Partial<Scene>) => void;
  onUpdateSceneContent: (sceneId: string, key: string, value: unknown) => void;
  onUpdateLayer: (sceneId: string, layerId: string, changes: Partial<Layer>) => void;
  onRemoveLayer: (sceneId: string, layerId: string) => void;
  warnings: string[];
  onClose?: () => void;
  error?: string;
  onRetryRender?: () => void;
  currentFrame?: number;
  fps?: number;
  onUpdateLayerKeyframes?: (sceneId: string, layerId: string, property: string, keyframes: Keyframe[]) => void;
}

const selectOptions = (values: readonly [string, string][]) => values.map(([value, label]) => ({ value, label }));
const field = (
  kind: Exclude<StudioInspectorControl['kind'], 'button' | 'info'>,
  label: string,
  value: string | number,
  onChange: (value: string | number) => void,
  options?: readonly { value: string; label: string }[],
  min?: number,
  max?: number,
  step?: number,
): StudioInspectorControl => ({ kind, label, value, onChange, options, min, max, step });

const layerSections = (
  scene: Scene,
  layer: Layer,
  update: (patch: Record<string, unknown>) => void,
): StudioInspectorSection[] => {
  const sections: StudioInspectorSection[] = [];
  if (layer.type === 'text') {
    const text = layer as TextLayer;
    sections.push({
      id: 'text',
      title: 'Texto y animación',
      controls: [
        field('textarea', 'Texto', text.text, (value) => update({ text: String(value) })),
        field('select', 'Animación de entrada', text.animation ?? 'none', (value) => update({ animation: value as TextAnimationType }), selectOptions([
          ['none', 'Ninguna'], ['pop', 'Pop (Rebote elástico)'], ['slide-up', 'Slide up'], ['fade', 'Fade in'], ['typewriter', 'Typewriter'],
        ])),
        field('range', `Tamaño de fuente: ${text.fontSize ?? 40}px`, text.fontSize ?? 40, (value) => update({ fontSize: Number(value) }), undefined, 24, 96, 1),
        field('color', 'Color del texto', text.color ?? '#FFFFFF', (value) => update({ color: String(value) })),
        field('text', 'Familia tipográfica', String((text as TextLayer & { fontFamily?: string }).fontFamily ?? 'Poppins, sans-serif'), (value) => update({ fontFamily: String(value) })),
        field('select', 'Peso tipográfico', String((text as TextLayer & { fontWeight?: string }).fontWeight ?? '700'), (value) => update({ fontWeight: String(value) }), selectOptions([
          ['400', 'Regular'], ['500', 'Medium'], ['600', 'Semibold'], ['700', 'Bold'], ['800', 'Extra bold'],
        ])),
      ],
    });
  }
  if (layer.type === 'subtitle') {
    const subtitle = layer as SubtitleLayer;
    sections.push({
      id: 'subtitle',
      title: 'Subtítulo',
      controls: [
        field('textarea', 'Texto del subtítulo', subtitle.text, (value) => update({ text: String(value) }), undefined),
        field('select', 'Animación de entrada', subtitle.animation ?? 'pop', (value) => update({ animation: value as TextAnimationType }), selectOptions([
          ['pop', 'Pop (Rebote viral)'], ['slide-up', 'Slide up'], ['fade', 'Fade in'], ['none', 'Ninguna'],
        ])),
        field('select', 'Estilo de subtítulo', subtitle.stylePreset ?? 'viral-yellow', (value) => update({ stylePreset: value as SubtitleStylePreset }), selectOptions([
          ['viral-yellow', 'Amarillo Viral TikTok (Recomendado)'], ['clean-white', 'Blanco limpio con sombra'], ['classic-box', 'Caja azul oscuro VitaBlue'],
        ])),
      ],
    });
  }
  if (layer.type === 'component') {
    const component = layer as ComponentLayer;
    const props = component.props;
    const controls: StudioInspectorControl[] = [
      { kind: 'info', label: 'component', value: <span>Props: <strong>{component.componentId}</strong> · MotionKit</span> },
    ];
    const add = (key: string, label: string, fallback = '') => controls.push(field('text', label, String(props[key] ?? fallback), (value) => {
      const nextProps = { ...props, [key]: String(value) };
      if (key === 'whatsAppText') nextProps.cta = String(value);
      update({ props: nextProps });
    }));
    if (component.componentId === 'MotionAdvisorCard' || component.componentId === 'AdvisorCard') {
      add('name', 'Nombre asesor', 'Sofía'); add('role', 'Cargo / especialidad', 'Asesora Especialista');
      add('message', 'Mensaje / cita'); add('whatsAppText', 'Texto botón WhatsApp', 'Pregúntanos por WhatsApp');
    } else if (component.componentId === 'MotionTrustBadge') {
      add('title', 'Título', 'PÓLIZA 100% VÁLIDA PARA VISADO'); add('subtitle', 'Subtítulo'); add('highlight', 'Insignia / highlight', 'GARANTÍA CONSULAR');
    } else if (component.componentId === 'MotionProviderGrid') {
      add('title', 'Título principal', 'COMPAÑÍAS LÍDERES AUTORIZADAS'); add('subtitle', 'Subtítulo');
    } else if (component.componentId === 'MotionComparisonCard') {
      add('title', 'Título', '¿SEGURO DE VIAJE O SEGURO DE VISADO?'); add('wrongOptionTitle', 'Opción incorrecta', 'Seguro de Viaje Común'); add('correctOptionTitle', 'Opción correcta', 'Seguro VitaBlue Extranjería');
    }
    sections.push({ id: 'component', title: 'Contenido del componente', controls });
  }
  if (layer.type === 'audio') {
    const audio = layer as AudioLayer;
    sections.push({
      id: 'audio',
      title: 'Audio',
      controls: [
        field('range', `Volumen: ${Math.round((audio.volume ?? 1) * 100)}%`, audio.volume ?? 1, (value) => update({ volume: Number(value) }), undefined, 0, 1, 0.05),
        field('number', 'Entrada (frames)', audio.fadeInDuration ?? 15, (value) => update({ fadeInDuration: Number(value) })),
        field('number', 'Salida (frames)', audio.fadeOutDuration ?? 15, (value) => update({ fadeOutDuration: Number(value) })),
      ],
    });
  }
  const timing = layer.timing ?? { startFrame: 0, durationInFrames: scene.durationInFrames };
  const asset = 'asset' in layer ? layer.asset : undefined;
  sections.push({
    id: 'timing',
    title: 'Tiempo y medios',
    controls: [
      field('number', 'Frame de inicio', timing.startFrame, (value) => update({ timing: { ...timing, startFrame: Number(value) } })),
      field('number', 'Duración (frames)', timing.durationInFrames, (value) => update({ timing: { ...timing, durationInFrames: Number(value) } })),
      ...(asset ? [field('text', 'URL del medio', asset.src ?? '', (value) => update({ asset: { ...asset, src: String(value) } }))] : []),
      ...(layer.type === 'video' ? [field('text', 'Texto alternativo', String((layer as Layer & { alt?: string }).alt ?? ''), (value) => update({ alt: String(value) }))] : []),
    ],
  });
  const visual = layer as Layer & {
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    shadowPreset?: string;
    color?: string;
  };
  if (layer.type !== 'audio') sections.push({
    id: 'appearance',
    title: 'Colores, bordes y sombra',
    controls: [
      field('color', 'Color principal', visual.color ?? '#005F73', (value) => update({ color: String(value) })),
      field('range', `Grosor de borde: ${visual.borderWidth ?? 0}px`, visual.borderWidth ?? 0, (value) => update({ borderWidth: Number(value) }), undefined, 0, 16, 1),
      field('range', `Radio de esquinas: ${visual.borderRadius ?? 0}px`, visual.borderRadius ?? 0, (value) => update({ borderRadius: Number(value) }), undefined, 0, 9999, 1),
      field('select', 'Sombra', visual.shadowPreset ?? 'none', (value) => update({ shadowPreset: String(value) }), selectOptions([
        ['none', 'Ninguna'], ['soft', 'Suave'], ['deep', 'Profunda'], ['glow_teal', 'Glow Teal'], ['glow_gold', 'Glow Gold'],
      ])),
    ],
  });
  return sections;
};

const sceneSections = (scene: Scene, onUpdateScene: CreativeEditorInspectorProps['onUpdateScene'], onUpdateSceneContent: CreativeEditorInspectorProps['onUpdateSceneContent']): StudioInspectorSection[] => {
  const content = scene.content;
  const updateContent = (key: string, value: unknown) => onUpdateSceneContent(scene.id, key, value);
  const controls: StudioInspectorControl[] = [
    field('select', 'Plantilla de escena', scene.templateId, (value) => onUpdateScene(scene.id, { templateId: value as SceneTemplateId }), selectOptions([
      ['text_hook', 'Hook inicial (Titular)'], ['requirements_list', 'Lista de requisitos (Checklist)'], ['advisor_cta', 'CTA Asesoría (WhatsApp)'], ['provider_logos', 'Logos aseguradoras'],
    ])),
    field('range', `Duración: ${(scene.durationInFrames / 30).toFixed(1)}s (${scene.durationInFrames} frames)`, scene.durationInFrames, (value) => onUpdateScene(scene.id, { durationInFrames: Number(value) }), undefined, 30, 300, 15),
    field('select', 'Transición de entrada', scene.transition?.type ?? 'none', (value) => onUpdateScene(scene.id, { transition: { type: value as TransitionType, durationInFrames: scene.transition?.durationInFrames ?? 15 } }), selectOptions([
      ['none', 'Ninguna (Corte directo)'], ['fade', 'Disolver (Fade)'], ['slide', 'Deslizar (Slide)'], ['zoom', 'Zoom (Zoom in)'], ['wipe', 'Barrido (Wipe)'],
    ])),
  ];
  if (scene.templateId === 'text_hook') {
    controls.push(field('textarea', 'Titular principal', String(content.text ?? ''), (value) => updateContent('text', String(value))));
    controls.push(field('text', 'Texto de badge', String(content.badge ?? 'VISA READY'), (value) => updateContent('badge', String(value))));
  }
  if (scene.templateId === 'requirements_list') {
    controls.push(field('text', 'Título de la lista', String(content.title ?? 'Requisitos Visado'), (value) => updateContent('title', String(value))));
    controls.push(field('textarea', 'Requisitos (uno por línea)', Array.isArray(content.items) ? content.items.join('\n') : '', (value) => updateContent('items', String(value).split('\n').filter(Boolean))));
  }
  if (scene.templateId === 'advisor_cta') {
    controls.push(field('text', 'Nombre asesor', String(content.advisorName ?? ''), (value) => updateContent('advisorName', String(value))));
    controls.push(field('text', 'Cargo / especialidad', String(content.role ?? ''), (value) => updateContent('role', String(value))));
    controls.push(field('text', 'Llamada a la acción (botón)', String(content.cta ?? 'Pregúntanos por WhatsApp'), (value) => updateContent('cta', String(value))));
  }
  return [{ id: 'scene', title: 'Escena activa', controls }];
};

const KEYFRAME_PROPERTIES = ['opacity', 'position.x', 'position.y', 'rotation', 'scale.x', 'scale.y'] as const;

type LayerWithKeyframes = Layer & { keyframes?: Record<string, Keyframe[]> };

const defaultKeyframeValue = (property: string): string | number =>
  property === 'opacity' ? 1 : property.startsWith('position.') ? 50 : 0;

const parseKeyframeValue = (value: string, current: Keyframe['value']): Keyframe['value'] => {
  if (typeof current === 'number') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : current;
  }
  if (typeof current === 'boolean') return value === 'true';
  return value;
};

const KeyframeAuthoring: React.FC<{
  layer: LayerWithKeyframes;
  currentFrame: number;
  fps: number;
  onChange: (property: string, keyframes: Keyframe[]) => void;
}> = ({ layer, currentFrame, fps, onChange }) => {
  const keyframes = layer.keyframes ?? {};
  const properties = Array.from(new Set([...KEYFRAME_PROPERTIES, ...Object.keys(keyframes)]));
  const [property, setProperty] = useState(properties[0] ?? KEYFRAME_PROPERTIES[0]);
  const frames = keyframes[property] ?? [];
  const timeAtPlayhead = Math.max(0, Math.round((currentFrame * 1000) / fps));

  const addKeyframe = () => {
    const existing = frames.find((frame) => frame.timeMs === timeAtPlayhead);
    const next = existing
      ? frames
      : [...frames, { timeMs: timeAtPlayhead, value: defaultKeyframeValue(property), easing: 'linear' }];
    onChange(property, [...next].sort((left, right) => left.timeMs - right.timeMs));
  };

  return (
    <section className="space-y-3 border-t border-slate-800 pt-3" aria-labelledby="inspector-keyframes">
      <div className="flex items-center justify-between gap-2">
        <h3 id="inspector-keyframes" className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Keyframes</h3>
        <span className="font-mono text-[10px] text-slate-500">{timeAtPlayhead} ms</span>
      </div>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Añade un valor en el cabezal actual. La animación se conserva como extensión temporal.
      </p>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        Propiedad animable
        <select
          value={property}
          onChange={(event) => setProperty(event.target.value)}
          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-2 text-xs font-semibold text-slate-200 focus:border-brand-cyan focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
        >
          {properties.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <button
        type="button"
        onClick={addKeyframe}
        className="min-h-11 w-full rounded-xl border border-primary/40 bg-primary/20 px-2.5 py-2 text-xs font-bold text-brand-cyan transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
      >
        Añadir keyframe en {timeAtPlayhead} ms
      </button>
      {frames.length > 0 ? (
        <div className="space-y-2">
          {frames.map((frame, index) => (
            <div key={`${property}-${frame.timeMs}-${index}`} className="grid grid-cols-[5rem_minmax(0,1fr)_2.5rem] items-end gap-1.5">
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Tiempo
                <input
                  type="number"
                  min={0}
                  value={frame.timeMs}
                  onChange={(event) => {
                    const next = [...frames];
                    next[index] = { ...frame, timeMs: Math.max(0, Number(event.target.value)) };
                    onChange(property, next.sort((left, right) => left.timeMs - right.timeMs));
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-200"
                />
              </label>
              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Valor
                <input
                  type="text"
                  value={String(frame.value)}
                  onChange={(event) => {
                    const next = [...frames];
                    next[index] = { ...frame, value: parseKeyframeValue(event.target.value, frame.value) };
                    onChange(property, next);
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5 text-[11px] text-slate-200"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(property, frames.filter((_, frameIndex) => frameIndex !== index))}
                aria-label={`Eliminar keyframe de ${frame.timeMs} ms`}
                className="flex min-h-11 min-w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:border-rose-500/40 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/80"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-slate-800 p-2 text-[10px] text-slate-500">Todavía no hay keyframes para esta propiedad.</p>
      )}
    </section>
  );
};

export const CreativeEditorInspector: React.FC<CreativeEditorInspectorProps> = (props) => {
  const { activeScene, selectedLayerId, onUpdateLayer, onRemoveLayer, onClose, error, onRetryRender, warnings, currentFrame = 0, fps = 30, onUpdateLayerKeyframes } = props;
  const selectedLayer = activeScene?.layers.find((layer) => layer.id === selectedLayerId);
  const updateLayer = (patch: Record<string, unknown>) => {
    if (activeScene && selectedLayer) onUpdateLayer(activeScene.id, selectedLayer.id, patch as Partial<Layer>);
  };
  const adapterLayer: StudioInspectorLayer | undefined = activeScene && selectedLayer ? {
    id: selectedLayer.id,
    title: selectedLayer.name ?? `${selectedLayer.type} Layer`,
    type: selectedLayer.type,
    visible: selectedLayer.visible,
    locked: selectedLayer.locked,
    position: 'position' in selectedLayer ? resolveLayerPosition(selectedLayer.position) : undefined,
    width: selectedLayer.type === 'audio' ? undefined : ('width' in selectedLayer ? selectedLayer.width ?? 100 : 100),
    height: selectedLayer.type === 'audio' ? undefined : ('height' in selectedLayer ? selectedLayer.height ?? 100 : 100),
    rotation: Number((selectedLayer as Layer & { rotation?: number }).rotation ?? 0),
    opacity: Number((selectedLayer as Layer & { opacity?: number }).opacity ?? 1),
    supportsTransform: selectedLayer.type !== 'audio',
    onUpdate: updateLayer,
    onToggleVisibility: () => updateLayer({ visible: selectedLayer.visible === false }),
    onToggleLock: () => updateLayer({ locked: !selectedLayer.locked }),
    onRemove: () => activeScene && onRemoveLayer(activeScene.id, selectedLayer.id),
  } : undefined;

  return (
    <StudioInspector
      title={adapterLayer ? `Capa: ${selectedLayer?.type.toUpperCase()}` : activeScene ? `Escena: ${activeScene.id}` : 'Inspector'}
      onClose={onClose}
      error={error}
      onRetry={onRetryRender}
      warnings={warnings}
      layer={adapterLayer}
      sections={activeScene && selectedLayer ? layerSections(activeScene, selectedLayer, updateLayer) : activeScene ? sceneSections(activeScene, props.onUpdateScene, props.onUpdateSceneContent) : []}
      emptyStateMessage={!activeScene ? 'Selecciona una escena o capa para editar sus propiedades.' : undefined}
    >
      {activeScene && selectedLayer && onUpdateLayerKeyframes && (
        <KeyframeAuthoring
          layer={selectedLayer as LayerWithKeyframes}
          currentFrame={currentFrame}
          fps={fps}
          onChange={(property, keyframes) => onUpdateLayerKeyframes(activeScene.id, selectedLayer.id, property, keyframes)}
        />
      )}
    </StudioInspector>
  );
};
