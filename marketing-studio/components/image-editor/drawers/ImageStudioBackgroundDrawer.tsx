import React, { useMemo, useState } from 'react';
import { Check, Eye, Layers, Plus, RefreshCw, RotateCcw, SlidersHorizontal, Trash2 } from 'lucide-react';
import type { ImageLayer, ImageProject } from '../../../types/imageStudio';
import type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundContinuity,
  CarouselBackgroundShapeType,
  CarouselBackgroundTrajectoryPoint,
} from '../../../types/carouselBackgroundComposition';
import { CAROUSEL_BACKGROUND_COLOR_VARIANTS } from '../../../types/carouselBackgroundComposition';
import {
  CAROUSEL_BACKGROUND_PALETTES,
  generateCarouselBackgroundLayers,
  createCarouselBackgroundBezierPath,
  getCarouselBackgroundTrajectoryPoints,
  isCarouselBackgroundLayer,
  resolveCarouselBackgroundComposition,
} from '../../../utils/carouselBackgroundComposition';
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

export const ImageStudioBackgroundDrawer: React.FC<ImageStudioBackgroundDrawerProps> = ({
  project,
  onRegenerateBackground,
}) => {
  const [showContent, setShowContent] = useState(true);
  const composition = resolveCarouselBackgroundComposition(project.carouselBackground);
  const isCarousel = Boolean(project.carouselConfig?.enabled || project.preset.isCarousel);

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
                className="h-20 w-full overflow-visible text-brand-cyan"
                role="img"
                aria-label="Vista previa de la trayectoria Bézier"
              >
                <path d="M 0 50 H 100" className="stroke-slate-700" strokeWidth="1" strokeDasharray="2 3" fill="none" />
                <path d={createCarouselBackgroundBezierPath(trajectoryPoints)} className="stroke-current" strokeWidth="2.5" fill="none" />
                {trajectoryPoints.map((point, index) => (
                  <circle
                    key={`${point.x}-${index}`}
                    cx={point.x * 100}
                    cy={point.y * 100}
                    r="3"
                    className="fill-brand-cyan stroke-slate-950"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>
            <div className="mt-2 space-y-1.5">
              {trajectoryPoints.map((point, index) => (
                <div key={`${index}-${point.x}`} className="flex flex-wrap items-center gap-1.5">
                  <span className="w-5 text-[10px] font-bold text-slate-500">{index + 1}</span>
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
