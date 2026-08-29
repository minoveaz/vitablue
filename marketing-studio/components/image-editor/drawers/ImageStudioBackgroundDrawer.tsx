import React, { useEffect, useMemo, useState } from 'react';
import { Check, Eye, Layers, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Sparkles, Trash2 } from 'lucide-react';
import type { ImageLayer, ImageProject } from '../../../types/imageStudio';
import type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundCompositionPreset,
  CarouselBackgroundContinuity,
  CarouselBackgroundShapeType,
  CarouselBackgroundTrajectoryPoint,
} from '../../../types/carouselBackgroundComposition';
import { CAROUSEL_BACKGROUND_COLOR_VARIANTS } from '../../../types/carouselBackgroundComposition';
import {
  CAROUSEL_BACKGROUND_PALETTES,
  CAROUSEL_BACKGROUND_PRESETS,
  applyCarouselBackgroundPresetToComposition,
  generateCarouselBackgroundLayers,
  createCarouselBackgroundBezierPath,
  getCarouselBackgroundTrajectoryPoints,
  isCarouselBackgroundLayer,
  resolveCarouselBackgroundComposition,
} from '../../../utils/carouselBackgroundComposition';
import {
  generateCarouselCompositionProposals,
  type CarouselCompositionAccent,
  type CarouselCompositionDominantZone,
  type CarouselCompositionVisualStyle,
} from '../../../utils/carouselCompositionAssistant';
import { getCarouselGeometry } from '../../../utils/imageDesignSystem';
import { ImageLayerBlockRenderer } from '../blocks/BlockRenderer';

export interface ImageStudioBackgroundDrawerProps {
  project: ImageProject;
  onRegenerateBackground: (composition: CarouselBackgroundCompositionInput) => void;
}

const VARIANT_LABELS: Record<CarouselBackgroundColorVariant, string> = {
  white: 'Blanco',
  midnight: 'Midnight',
  ocean: 'Ocean',
  'amber-gold': 'Amber Gold',
  'white-editorial': 'White Editorial',
};

const VARIANT_SWATCHES: Record<CarouselBackgroundColorVariant, string> = {
  white: 'bg-white',
  midnight: 'bg-vb-midnight',
  ocean: 'bg-vb-ocean',
  'amber-gold': 'bg-vb-gold',
  'white-editorial': 'bg-white',
};

const SHAPE_OPTIONS: Array<{ id: CarouselBackgroundShapeType; label: string }> = [
  { id: 'wave', label: 'Onda' },
  { id: 'blob', label: 'Blob' },
  { id: 'organic', label: 'Orgánica' },
  { id: 'curve', label: 'Curva' },
];

const CONTINUITY_OPTIONS: Array<{ id: CarouselBackgroundContinuity; label: string }> = [
  { id: 'local', label: 'Local' },
  { id: 'flow', label: 'Fluida' },
  { id: 'seamless', label: 'Continua' },
];

const ASSISTANT_STYLE_OPTIONS: Array<{ id: CarouselCompositionVisualStyle; label: string }> = [
  { id: 'editorial', label: 'Editorial' },
  { id: 'educational', label: 'Educativo' },
  { id: 'conversion', label: 'Conversión' },
  { id: 'comparison', label: 'Comparativa' },
  { id: 'testimonial', label: 'Testimonial' },
  { id: 'bold', label: 'Atrevido' },
];

const ASSISTANT_ZONE_OPTIONS: Array<{ id: CarouselCompositionDominantZone; label: string }> = [
  { id: 'top', label: 'Parte superior' },
  { id: 'center', label: 'Centro' },
  { id: 'bottom', label: 'Parte inferior' },
  { id: 'balanced', label: 'Equilibrada' },
];

const ASSISTANT_ACCENT_OPTIONS: Array<{ id: CarouselCompositionAccent; label: string; description: string }> = [
  { id: 'soft-shadow', label: 'Sombra suave', description: 'Profundidad discreta' },
  { id: 'teal-glow', label: 'Brillo teal', description: 'Acento VitaBlue' },
  { id: 'gold-glow', label: 'Brillo ámbar', description: 'Acento de conversión' },
  { id: 'focal-point', label: 'Punto focal', description: 'Guía la mirada' },
  { id: 'slide-bridge', label: 'Puente entre slides', description: 'Refuerza continuidad' },
];

const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
const clampPointValue = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const PreviewLayer: React.FC<{
  layer: ImageLayer;
  geometry: ReturnType<typeof getCarouselGeometry>;
  slideIndex: number;
}> = ({ layer, geometry, slideIndex }) => {
  const globalX = (layer.position.x / 100) * geometry.panoramaWidth;
  const localX = globalX - slideIndex * geometry.slideWidth;
  const width = ((layer.width ?? geometry.slideWidth * 0.4) / geometry.slideWidth) * 100;
  const height = ((layer.height ?? geometry.slideHeight * 0.2) / geometry.slideHeight) * 100;

  return (
    <div
      className="absolute"
      style={{
        left: `${(localX / geometry.slideWidth) * 100}%`,
        top: `${layer.position.y}%`,
        width: `${width}%`,
        height: `${height}%`,
        transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${layer.scale ?? 1})`,
        opacity: layer.opacity ?? 1,
        zIndex: layer.zIndex,
      }}
    >
      <ImageLayerBlockRenderer layer={layer} />
    </div>
  );
};

const BackgroundPreview: React.FC<{
  project: ImageProject;
  composition: CarouselBackgroundComposition;
  showContent: boolean;
}> = ({ project, composition, showContent }) => {
  const geometry = useMemo(
    () =>
      getCarouselGeometry(
        project.preset,
        project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount,
        project.carouselConfig?.enabled,
      ),
    [project.carouselConfig?.enabled, project.carouselConfig?.slideCount, project.preset],
  );
  const slideIndex = Math.max(
    0,
    Math.min(geometry.slideCount - 1, project.currentSlide ?? project.carouselConfig?.currentSlideIndex ?? 0),
  );
  const backgroundLayers = useMemo(
    () => generateCarouselBackgroundLayers({ projectId: `${project.id}-preview`, geometry, composition }),
    [composition, geometry, project.id],
  ).filter((layer) => {
    const isPanoramic =
      layer.id.includes('-panorama-wave') ||
      layer.id.includes('-top-semicircle-large');
    return isPanoramic || layer.props.slideIndex === slideIndex;
  });
  const contentLayers = showContent
    ? project.layers.filter(
        (layer) =>
          !isCarouselBackgroundLayer(layer) &&
          (layer.props.slideIndex === undefined || layer.props.slideIndex === slideIndex),
      )
    : [];
  const palette = CAROUSEL_BACKGROUND_PALETTES[composition.colorVariant];
  const previewWidth = 216;
  const previewScale = previewWidth / geometry.slideWidth;

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-xl border border-slate-700 shadow-inner"
      style={{
        width: '100%',
        maxWidth: `${previewWidth}px`,
        aspectRatio: `${geometry.slideWidth} / ${geometry.slideHeight}`,
        background: palette.background,
      }}
      aria-label={showContent ? 'Vista previa con contenido' : 'Vista previa del fondo'}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: `${geometry.slideWidth}px`,
          height: `${geometry.slideHeight}px`,
          transform: `scale(${previewScale})`,
          transformOrigin: 'top left',
        }}
      >
        {backgroundLayers.map((layer) => (
          <PreviewLayer key={layer.id} layer={layer} geometry={geometry} slideIndex={slideIndex} />
        ))}
        {contentLayers.map((layer) => (
          <PreviewLayer key={layer.id} layer={layer} geometry={geometry} slideIndex={slideIndex} />
        ))}
      </div>
    </div>
  );
};

const PresetPreview: React.FC<{ preset: CarouselBackgroundCompositionPreset }> = ({ preset }) => {
  const path = createCarouselBackgroundBezierPath(preset.previewPoints);
  const palette = CAROUSEL_BACKGROUND_PALETTES[preset.recommendedColorVariant];
  return (
    <div
      className="overflow-hidden rounded-lg border border-slate-700/80 p-2"
      style={{ background: palette.background }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 100" className="h-14 w-full">
        <path d={`${path} L 100 100 L 0 100 Z`} fill={palette.primary} opacity="0.9" />
        <path d={path} fill="none" stroke={palette.muted} strokeWidth="2.5" strokeLinecap="round" />
        {preset.id === 'semicirculo-entre-slides' && <circle cx="50" cy="72" r="12" fill={palette.muted} opacity="0.85" />}
        {preset.id === 'cta-final' && <circle cx="82" cy="70" r="10" fill={palette.muted} opacity="0.95" />}
      </svg>
    </div>
  );
};

export const ImageStudioBackgroundDrawer: React.FC<ImageStudioBackgroundDrawerProps> = ({
  project,
  onRegenerateBackground,
}) => {
  const [showContent, setShowContent] = useState(true);
  const [draggedTrajectoryPoint, setDraggedTrajectoryPoint] = useState<number | null>(null);
  const [activeTrajectoryPoint, setActiveTrajectoryPoint] = useState<number | null>(null);
  const composition = resolveCarouselBackgroundComposition(project.carouselBackground);
  const isCarousel = Boolean(project.carouselConfig?.enabled || project.preset.isCarousel);
  const slideCount = project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount ?? 1;
  const [assistantVisualStyle, setAssistantVisualStyle] = useState<CarouselCompositionVisualStyle>('editorial');
  const [assistantDominantZone, setAssistantDominantZone] = useState<CarouselCompositionDominantZone>('balanced');
  const [assistantContinuity, setAssistantContinuity] = useState<CarouselBackgroundContinuity>(composition.continuity);
  const [assistantColorPalette, setAssistantColorPalette] = useState<CarouselBackgroundColorVariant>(composition.colorVariant);
  const [assistantIntensity, setAssistantIntensity] = useState(composition.intensity);
  const [assistantScale, setAssistantScale] = useState(composition.scale);
  const [assistantAccents, setAssistantAccents] = useState<CarouselCompositionAccent[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState<string | null>(null);
  const [assistantStatus, setAssistantStatus] = useState<string | null>(null);

  const assistantProposals = useMemo(
    () =>
      generateCarouselCompositionProposals({
        slideCount,
        visualStyle: assistantVisualStyle,
        dominantZone: assistantDominantZone,
        continuity: assistantContinuity,
        colorPalette: assistantColorPalette,
        intensity: assistantIntensity,
        scale: assistantScale,
        selectedAccents: assistantAccents,
        currentComposition: composition,
      }),
    [
      assistantAccents,
      assistantColorPalette,
      assistantContinuity,
      assistantDominantZone,
      assistantIntensity,
      assistantScale,
      assistantVisualStyle,
      composition,
      slideCount,
    ],
  );

  useEffect(() => {
    if (!assistantProposals.some((proposal) => proposal.id === selectedProposalId)) {
      setSelectedProposalId(assistantProposals[0]?.id ?? null);
    }
  }, [assistantProposals, selectedProposalId]);

  const toggleAssistantAccent = (accent: CarouselCompositionAccent) => {
    setAssistantAccents((current) =>
      current.includes(accent) ? current.filter((item) => item !== accent) : [...current, accent],
    );
  };

  const applyAssistantProposal = () => {
    const proposal = assistantProposals.find((item) => item.id === selectedProposalId) ?? assistantProposals[0];
    if (!proposal) return;
    onRegenerateBackground(proposal.composition);
    setAssistantStatus(`Aplicada: ${proposal.label}. Tus capas editables se conservaron.`);
  };

  const update = (patch: CarouselBackgroundCompositionInput) => {
    onRegenerateBackground(patch);
  };
  const trajectoryPoints = getCarouselBackgroundTrajectoryPoints(composition.trajectory);
  const updateTrajectoryPoints = (points: CarouselBackgroundTrajectoryPoint[]) =>
    update({ trajectory: { points } });
  const updateTrajectoryPoint = (index: number, key: keyof CarouselBackgroundTrajectoryPoint, value: number) => {
    const nextPoints = trajectoryPoints.map((point, pointIndex) =>
      pointIndex === index ? { ...point, [key]: clampPointValue(value) } : point,
    );
    updateTrajectoryPoints(nextPoints);
  };
  const addTrajectoryPoint = () => {
    const last = trajectoryPoints[trajectoryPoints.length - 1];
    const previous = trajectoryPoints[trajectoryPoints.length - 2] ?? { x: 0.5, y: 0.5 };
    const x = Math.min(0.98, Math.max(previous.x + 0.01, (previous.x + last.x) / 2));
    const y = previous.y + (last.y - previous.y) * 0.5;
    updateTrajectoryPoints([...trajectoryPoints.slice(0, -1), { x, y }, last]);
  };
  const resetTrajectory = () => update({ trajectory: { points: undefined } });

  if (!isCarousel) {
    return (
      <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
        <div className="flex items-center gap-2 font-bold text-white">
          <Layers className="size-4 text-brand-cyan" />
          Fondos de carrusel
        </div>
        <p className="text-xs leading-relaxed text-slate-400">
          Activa una plantilla de carrusel para generar fondos continuos sin bloquear tus capas editables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-brand-cyan/30 bg-gradient-to-br from-primary/30 via-slate-950 to-slate-950 p-3" aria-labelledby="composition-assistant-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
              <Sparkles className="size-3.5 text-amber-300" />
              <h2 id="composition-assistant-title">Asistente de composición</h2>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
              Tres direcciones visuales para tus {slideCount} slides. Elige una para verla antes de aplicarla.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-1 text-[9px] font-bold text-brand-cyan">
            Automático
          </span>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Estilo visual</span>
            <select
              value={assistantVisualStyle}
              onChange={(event) => setAssistantVisualStyle(event.target.value as CarouselCompositionVisualStyle)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30"
            >
              {ASSISTANT_STYLE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Zona dominante</span>
            <select
              value={assistantDominantZone}
              onChange={(event) => setAssistantDominantZone(event.target.value as CarouselCompositionDominantZone)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30"
            >
              {ASSISTANT_ZONE_OPTIONS.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
          </label>
        </div>

        <fieldset className="mt-3">
          <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Paleta</legend>
          <div className="grid grid-cols-3 gap-1.5">
            {CAROUSEL_BACKGROUND_COLOR_VARIANTS.map((variant) => (
              <button
                key={variant}
                type="button"
                aria-pressed={assistantColorPalette === variant}
                onClick={() => setAssistantColorPalette(variant)}
                className={`flex min-w-0 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                  assistantColorPalette === variant ? 'border-brand-cyan bg-primary/30 text-white' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                <span className={`size-2.5 rounded-full border border-white/30 ${VARIANT_SWATCHES[variant]}`} />
                <span className="truncate">{VARIANT_LABELS[variant]}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-3">
          <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Continuidad</legend>
          <div className="flex flex-wrap gap-1.5">
            {CONTINUITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={assistantContinuity === option.id}
                onClick={() => setAssistantContinuity(option.id)}
                className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                  assistantContinuity === option.id ? 'border-brand-cyan bg-primary/30 text-brand-cyan' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Intensidad</span><output className="font-mono text-brand-cyan">{formatPercent(assistantIntensity)}</output>
            </span>
            <input type="range" min="0" max="1" step="0.01" value={assistantIntensity} onChange={(event) => setAssistantIntensity(Number(event.target.value))} className="w-full accent-brand-cyan" />
          </label>
          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Escala</span><output className="font-mono text-brand-cyan">{assistantScale.toFixed(2)}×</output>
            </span>
            <input type="range" min="0.25" max="2" step="0.05" value={assistantScale} onChange={(event) => setAssistantScale(Number(event.target.value))} className="w-full accent-brand-cyan" />
          </label>
        </div>

        <fieldset className="mt-3">
          <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Acentos seleccionados</legend>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {ASSISTANT_ACCENT_OPTIONS.map((accent) => {
              const checked = assistantAccents.includes(accent.id);
              return (
                <label key={accent.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-2 transition-colors ${checked ? 'border-amber-300/60 bg-amber-300/10' : 'border-slate-800 bg-slate-900/70 hover:border-slate-600'}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleAssistantAccent(accent.id)} className="size-3.5 accent-brand-cyan" />
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold text-slate-200">{accent.label}</span>
                    <span className="block truncate text-[9px] text-slate-500">{accent.description}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="mt-4 grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Propuestas de composición">
          {assistantProposals.map((proposal, index) => {
            const selected = proposal.id === selectedProposalId;
            const previewProject = { ...project, carouselBackground: proposal.composition };
            return (
              <article key={proposal.id} className={`min-w-0 rounded-xl border p-2 transition-colors ${selected ? 'border-brand-cyan bg-primary/20' : 'border-slate-800 bg-slate-900/70'}`}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setSelectedProposalId(proposal.id)}
                  className="block w-full text-left focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                >
                  <BackgroundPreview project={previewProject} composition={proposal.composition} showContent={showContent} />
                  <span className="mt-2 flex items-center justify-between gap-1 text-[10px] font-bold text-white">
                    <span className="truncate">{index + 1}. {proposal.label}</span>
                    {selected && <Check className="size-3 shrink-0 text-brand-cyan" />}
                  </span>
                  <span className="mt-1 block text-[9px] leading-snug text-slate-400">{proposal.rationale}</span>
                </button>
                <button type="button" onClick={() => { setSelectedProposalId(proposal.id); onRegenerateBackground(proposal.composition); setAssistantStatus(`Aplicada: ${proposal.label}. Tus capas editables se conservaron.`); }} className="mt-2 w-full rounded-lg bg-amber-400 px-2 py-1.5 text-[10px] font-black text-primary-dark transition-colors hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300/60">
                  Usar esta propuesta
                </button>
              </article>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] text-slate-500" aria-live="polite">{assistantStatus ?? 'Las propuestas no modifican el lienzo hasta que las aplicas.'}</p>
          <button type="button" onClick={applyAssistantProposal} className="inline-flex items-center gap-1 rounded-lg border border-brand-cyan/50 px-2.5 py-1.5 text-[10px] font-bold text-brand-cyan transition-colors hover:bg-brand-cyan/10 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50">
            Aplicar seleccionada
          </button>
        </div>
      </section>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white">
              <SlidersHorizontal className="size-3.5 text-brand-cyan" />
              Composición de fondo
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Solo afecta las capas estructurales.</p>
          </div>
          <button
            type="button"
            onClick={() => update(composition)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-[10px] font-bold text-slate-300 transition-colors hover:border-brand-cyan hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
          >
            <RefreshCw className="size-3" />
            Regenerar
          </button>
        </div>

        <div className="space-y-3">
          <fieldset>
            <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Variante</legend>
            <div className="grid grid-cols-3 gap-1.5">
              {CAROUSEL_BACKGROUND_COLOR_VARIANTS.map((variant) => (
                <button
                  key={variant}
                  type="button"
                  aria-pressed={composition.colorVariant === variant}
                  onClick={() => update({ colorVariant: variant })}
                  className={`flex min-w-0 items-center justify-center gap-1 rounded-lg border px-2 py-2 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                    composition.colorVariant === variant
                      ? 'border-brand-cyan bg-primary/30 text-white'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <span className={`size-2.5 rounded-full border border-white/30 ${VARIANT_SWATCHES[variant]}`} />
                  <span className="truncate">{VARIANT_LABELS[variant]}</span>
                  {composition.colorVariant === variant && <Check className="size-3 shrink-0 text-brand-cyan" />}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Forma
            </span>
            <select
              value={composition.shape}
              onChange={(event) => update({ shape: event.target.value as CarouselBackgroundShapeType })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white outline-none focus:border-brand-cyan focus:ring-2 focus:ring-brand-cyan/30"
            >
              {SHAPE_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Intensidad</span>
              <output className="font-mono text-brand-cyan">{formatPercent(composition.intensity)}</output>
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={composition.intensity}
              onChange={(event) => update({ intensity: Number(event.target.value) })}
              className="w-full accent-brand-cyan"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Escala</span>
              <output className="font-mono text-brand-cyan">{composition.scale.toFixed(2)}×</output>
            </span>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.05"
              value={composition.scale}
              onChange={(event) => update({ scale: Number(event.target.value) })}
              className="w-full accent-brand-cyan"
            />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Continuidad</legend>
            <div className="flex flex-wrap gap-1.5">
              {CONTINUITY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={composition.continuity === option.id}
                  onClick={() => update({ continuity: option.id })}
                  className={`rounded-lg border px-2 py-1.5 text-[10px] font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                    composition.continuity === option.id
                      ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="border-t border-slate-800 pt-3">
            <legend className="mb-1.5 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="inline-flex items-center gap-1.5"><Sparkles className="size-3 text-amber-300" /> Presets de composición</span>
              <span className="font-normal normal-case tracking-normal text-slate-500">7 estilos</span>
            </legend>
            <p className="mb-2 text-[10px] leading-relaxed text-slate-500">
              Aplica una dirección visual completa. Tus textos, imágenes y zonas seguras se conservan.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CAROUSEL_BACKGROUND_PRESETS.map((preset) => {
                const isActive = composition.presetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => update(applyCarouselBackgroundPresetToComposition(composition, preset.id))}
                    className={`group min-w-0 rounded-xl border p-2 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-cyan/50 ${
                      isActive
                        ? 'border-brand-cyan bg-primary/20'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-600'
                    }`}
                  >
                    <PresetPreview preset={preset} />
                    <span className="mt-2 flex items-center justify-between gap-1 text-[10px] font-bold text-white">
                      <span className="truncate">{preset.label}</span>
                      {isActive && <Check className="size-3 shrink-0 text-brand-cyan" />}
                    </span>
                    <span className="mt-1 block text-[10px] leading-snug text-slate-500">{preset.description}</span>
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400">
                      <span className={`size-2 rounded-full border border-white/30 ${VARIANT_SWATCHES[preset.recommendedColorVariant]}`} />
                      {VARIANT_LABELS[preset.recommendedColorVariant]}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="border-t border-slate-800 pt-3">
            <legend className="mb-1.5 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Trayectoria Bézier</span>
              <button
                type="button"
                onClick={resetTrajectory}
                className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-semibold normal-case tracking-normal text-slate-500 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                title="Restaurar trayectoria predeterminada"
              >
                <RotateCcw className="size-3" />
                Restaurar
              </button>
            </legend>
            <p className="mb-2 text-[10px] leading-relaxed text-slate-500">
              Ajusta la curva panorámica. X recorre todas las slides y Y controla su altura.
            </p>
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2">
              <svg
                viewBox="0 0 100 100"
                className="h-20 w-full touch-none overflow-visible text-brand-cyan"
                role="img"
                aria-label="Vista previa de la trayectoria Bézier"
                onPointerMove={(event) => {
                  if (draggedTrajectoryPoint === null) return;
                  const bounds = event.currentTarget.getBoundingClientRect();
                  const x = clampPointValue((event.clientX - bounds.left) / bounds.width);
                  const y = clampPointValue((event.clientY - bounds.top) / bounds.height);
                  updateTrajectoryPoints(
                    trajectoryPoints.map((point, index) =>
                      index === draggedTrajectoryPoint ? { x, y } : point,
                    ),
                  );
                }}
                onPointerUp={() => setDraggedTrajectoryPoint(null)}
                onPointerLeave={() => setDraggedTrajectoryPoint(null)}
              >
                <path d="M 0 50 H 100" className="stroke-slate-700" strokeWidth="1" strokeDasharray="2 3" fill="none" />
                {Array.from({ length: 4 }, (_, index) => (
                  <line
                    key={`slide-cut-${index}`}
                    x1={(index + 1) * 20}
                    x2={(index + 1) * 20}
                    y1="0"
                    y2="100"
                    className="stroke-slate-700/70"
                    strokeWidth="0.6"
                    strokeDasharray="1.5 2"
                  />
                ))}
                <path d={createCarouselBackgroundBezierPath(trajectoryPoints)} className="stroke-current" strokeWidth="2.5" fill="none" />
                {trajectoryPoints.map((point, index) => (
                  <circle
                    key={`${point.x}-${index}`}
                    cx={point.x * 100}
                    cy={point.y * 100}
                    r="3"
                    className={activeTrajectoryPoint === index ? 'fill-amber-400 stroke-white' : 'fill-brand-cyan stroke-slate-950'}
                    strokeWidth="1.5"
                    style={{ cursor: draggedTrajectoryPoint === index ? 'grabbing' : 'grab' }}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      event.currentTarget.setPointerCapture(event.pointerId);
                      setActiveTrajectoryPoint(index);
                      setDraggedTrajectoryPoint(index);
                    }}
                    onFocus={() => setActiveTrajectoryPoint(index)}
                  />
                ))}
              </svg>
            </div>
            <div className="mt-2 space-y-1.5">
              {trajectoryPoints.map((point, index) => (
                <div key={`${index}-${point.x}`} className={`flex flex-wrap items-center gap-1.5 rounded-md px-1 py-0.5 ${activeTrajectoryPoint === index ? 'bg-amber-400/10' : ''}`}>
                  <button
                    type="button"
                    onClick={() => setActiveTrajectoryPoint(index)}
                    className={`w-5 text-[10px] font-bold ${activeTrajectoryPoint === index ? 'text-amber-400' : 'text-slate-500'}`}
                    aria-label={`Seleccionar punto ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                  <label className="flex min-w-[7rem] flex-1 items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] text-slate-400">
                    <span>X</span>
                    <input
                      aria-label={`Punto ${index + 1}, posición X`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={Math.round(point.x * 100)}
                      onChange={(event) => updateTrajectoryPoint(index, 'x', Number(event.target.value) / 100)}
                      className="min-w-0 w-full bg-transparent text-right font-mono text-xs text-white outline-none"
                    />
                    <span>%</span>
                  </label>
                  <label className="flex min-w-[7rem] flex-1 items-center gap-1 rounded-md border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] text-slate-400">
                    <span>Y</span>
                    <input
                      aria-label={`Punto ${index + 1}, posición Y`}
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={Math.round(point.y * 100)}
                      onChange={(event) => updateTrajectoryPoint(index, 'y', Number(event.target.value) / 100)}
                      className="min-w-0 w-full bg-transparent text-right font-mono text-xs text-white outline-none"
                    />
                    <span>%</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => updateTrajectoryPoints(trajectoryPoints.filter((_, pointIndex) => pointIndex !== index))}
                    disabled={trajectoryPoints.length <= 2}
                    className="rounded-md p-1.5 text-slate-500 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-30 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                    aria-label={`Eliminar punto ${index + 1}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addTrajectoryPoint}
              disabled={trajectoryPoints.length >= 12}
              className="mt-2 inline-flex items-center gap-1 rounded-lg border border-dashed border-slate-700 px-2 py-1.5 text-[10px] font-bold text-slate-400 transition-colors hover:border-brand-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
            >
              <Plus className="size-3" />
              Añadir punto
            </button>
          </fieldset>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Eye className="size-3.5 text-brand-cyan" />
            Preview
          </div>
          <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-0.5">
            <button
              type="button"
              onClick={() => setShowContent(false)}
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${!showContent ? 'bg-primary/40 text-white' : 'text-slate-400'}`}
            >
              Fondo
            </button>
            <button
              type="button"
              onClick={() => setShowContent(true)}
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${showContent ? 'bg-primary/40 text-white' : 'text-slate-400'}`}
            >
              Con contenido
            </button>
          </div>
        </div>
        <BackgroundPreview project={project} composition={composition} showContent={showContent} />
        <p className="mt-2 text-center text-[10px] text-slate-500">
          Slide {Math.min((project.currentSlide ?? 0) + 1, project.carouselConfig?.slideCount ?? 1)} de {project.carouselConfig?.slideCount ?? 1}
        </p>
      </div>
    </div>
  );
};
