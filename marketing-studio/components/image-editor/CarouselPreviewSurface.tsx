import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal, Ruler, ShieldCheck } from 'lucide-react';
import type { ImageLayer, ImageProject } from '../../types/imageStudio';
import { createDefaultGuideSettings, getCarouselGeometry, getPlatformGuideProfile, isCarouselProject } from '../../utils/imageDesignSystem';
import { ImageLayerBlockRenderer, getBlockDefaultWidth } from './blocks';

export type CarouselPreviewSurfaceMode = 'slide' | 'panorama' | 'comparison' | 'swipe';

export interface CarouselPreviewSurfaceProps {
  project: ImageProject;
  mode: Exclude<CarouselPreviewSurfaceMode, 'comparison'> | 'comparison';
  activeSlideIndex: number;
  onSlideChange: (slideIndex: number) => void;
  comparisonBefore?: ImageProject | null;
  showGuides?: boolean;
  showSafeZones?: boolean;
  className?: string;
}

interface PreviewCanvasProps {
  project: ImageProject;
  slideIndex: number;
  view: 'slide' | 'panorama';
  showGuides: boolean;
  showSafeZones: boolean;
  label?: string;
}

const clampSlide = (index: number, count: number) => Math.min(Math.max(index, 0), Math.max(0, count - 1));

const getLayerStyle = (layer: ImageLayer, geometry: ReturnType<typeof getCarouselGeometry>) => ({
  left: `${layer.position.x}%`,
  top: `${layer.position.y}%`,
  width: layer.width
    ? `${(layer.width / geometry.panoramaWidth) * 100}%`
    : getBlockDefaultWidth(layer.blockType, layer.width, layer.props ?? {}),
  height: layer.height
    ? `${(layer.height / geometry.slideHeight) * 100}%`
    : layer.blockType === 'GeometricShape'
      ? `${(200 / geometry.slideHeight) * 100}%`
      : undefined,
  transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${(layer.scale ?? 1) * (layer.flipHorizontal ? -1 : 1)}, ${(layer.scale ?? 1) * (layer.flipVertical ? -1 : 1)})`,
  opacity: layer.opacity ?? 1,
  zIndex: layer.zIndex,
  filter: getLayerFilter(layer),
  boxShadow: getLayerShadow(layer),
  borderWidth: layer.borderWidth ? `${layer.borderWidth}px` : undefined,
  borderColor: layer.borderColor,
  borderStyle: layer.borderWidth ? 'solid' : undefined,
  borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
});

const getLayerFilter = (layer: ImageLayer) => {
  const filters: string[] = [];
  if (layer.brightness !== undefined && layer.brightness !== 100) filters.push(`brightness(${layer.brightness}%)`);
  if (layer.contrast !== undefined && layer.contrast !== 100) filters.push(`contrast(${layer.contrast}%)`);
  if (layer.blur !== undefined && layer.blur > 0) filters.push(`blur(${layer.blur}px)`);
  if (layer.filter === 'grayscale') filters.push('grayscale(100%)');
  if (layer.filter === 'sepia') filters.push('sepia(80%)');
  if (layer.filter === 'contrast') filters.push('contrast(160%) saturate(120%)');
  if (layer.filter === 'teal_tint') filters.push('hue-rotate(150deg) saturate(130%)');
  if (layer.filter === 'gold_tint') filters.push('sepia(50%) hue-rotate(330deg) saturate(160%)');
  return filters.length ? filters.join(' ') : undefined;
};

const getLayerShadow = (layer: ImageLayer) => {
  if (layer.shadowPreset === 'soft') return '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)';
  if (layer.shadowPreset === 'deep') return '0 25px 50px -12px rgba(0, 0, 0, 0.7)';
  if (layer.shadowPreset === 'glow_teal') return '0 0 25px rgba(148, 210, 189, 0.6), 0 0 10px rgba(0, 95, 115, 0.8)';
  if (layer.shadowPreset === 'glow_gold') return '0 0 25px rgba(238, 155, 0, 0.6), 0 0 10px rgba(202, 103, 2, 0.8)';
  if (layer.shadowPreset === 'neon') return '0 0 5px var(--color-pastel), 0 0 20px var(--color-primary), 0 0 40px var(--color-secondary)';
  if (layer.shadowBlur || layer.shadowColor) {
    return `${layer.shadowOffsetX ?? 0}px ${layer.shadowOffsetY ?? 4}px ${layer.shadowBlur ?? 10}px ${layer.shadowColor ?? 'rgba(0,0,0,0.4)'}`;
  }
  return undefined;
};

const getClipClass = (clipShape: ImageLayer['clipShape']) => {
  switch (clipShape) {
    case 'circle':
    case 'pill':
      return 'overflow-hidden rounded-full';
    case 'squircle':
      return 'overflow-hidden rounded-[2.5rem]';
    case 'phone_mockup':
      return 'overflow-hidden rounded-[3rem] border-4 border-slate-700';
    case 'shield':
      return 'overflow-hidden rounded-b-[3rem] rounded-t-2xl';
    default:
      return 'overflow-visible';
  }
};

const PreviewGuides: React.FC<{
  geometry: ReturnType<typeof getCarouselGeometry>;
  project: ImageProject;
  view: 'slide' | 'panorama';
  slideIndex: number;
  showGuides: boolean;
  showSafeZones: boolean;
}> = ({ geometry, project, view, slideIndex, showGuides, showSafeZones }) => {
  if (!showGuides && !showSafeZones) return null;
  const settings = project.guideSettings ?? createDefaultGuideSettings(project.preset);
  const profile = getPlatformGuideProfile(project.preset, settings.profileId);
  const slideCount = geometry.slideCount;
  const inset = (key: 'top' | 'right' | 'bottom' | 'left') => `${(profile.safeInsets[key] / geometry.slideHeight) * 100}%`;

  return (
    <div className="pointer-events-none absolute inset-0 z-40" aria-hidden="true">
      {showGuides && view === 'panorama' && Array.from({ length: slideCount - 1 }, (_, index) => {
        const left = `${((index + 1) / slideCount) * 100}%`;
        return (
          <div key={`cut-${index}`} className="absolute inset-y-0 border-l border-dashed border-amber-300/90" style={{ left }}>
            <span className="absolute left-1 top-2 whitespace-nowrap rounded bg-slate-950/85 px-1.5 py-1 text-[9px] font-bold text-amber-200 shadow-lg">
              Corte {index + 1} · {geometry.slideWidth}px
            </span>
            <span className="absolute bottom-2 left-1 rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] text-slate-200">✂</span>
          </div>
        );
      })}
      {showGuides && view === 'slide' && (
        <div className="absolute inset-0 border border-dashed border-amber-300/80">
          <span className="absolute left-2 top-2 rounded bg-slate-950/85 px-1.5 py-1 text-[9px] font-bold text-amber-200">
            Slide {slideIndex + 1} · {geometry.slideWidth} × {geometry.slideHeight}
          </span>
        </div>
      )}
      {showSafeZones && (view === 'slide' ? [slideIndex] : Array.from({ length: slideCount }, (_, index) => index)).map((index) => {
        const offset = view === 'slide' ? 0 : index / slideCount;
        const width = view === 'slide' ? 100 : 100 / slideCount;
        return (
          <div
            key={`safe-${index}`}
            className="absolute border border-dashed border-brand-cyan/90 bg-brand-cyan/[0.06]"
            style={{
              left: `${offset * 100 + (profile.safeInsets.left / geometry.slideWidth) * width}%`,
              top: inset('top'),
              width: `${width * (1 - (profile.safeInsets.left + profile.safeInsets.right) / geometry.slideWidth)}%`,
              height: `calc(100% - ${inset('top')} - ${inset('bottom')})`,
            }}
          >
            <span className="absolute -top-5 left-0 whitespace-nowrap rounded bg-slate-950/85 px-1.5 py-0.5 text-[9px] font-bold text-brand-cyan">
              Zona segura
            </span>
          </div>
        );
      })}
    </div>
  );
};

const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  project,
  slideIndex,
  view,
  showGuides,
  showSafeZones,
  label,
}) => {
  const geometry = getCarouselGeometry(
    project.preset,
    project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount,
    project.carouselConfig?.enabled,
  );
  const isCarousel = isCarouselProject(project.preset, project.carouselConfig?.enabled);
  const visibleSlideIndex = clampSlide(slideIndex, geometry.slideCount);
  const canvasWidth = view === 'slide' ? geometry.slideWidth : geometry.panoramaWidth;
  const layers = project.layers.filter((layer) => layer.visible !== false);

  return (
    <div className="min-w-0">
      {label && <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><span>{label}</span><span className="font-mono text-slate-500">{canvasWidth} × {geometry.slideHeight}</span></div>}
      <div
        className="relative mx-auto w-full overflow-hidden rounded-2xl border border-slate-700 bg-primary-dark shadow-2xl"
        style={{ aspectRatio: `${canvasWidth} / ${geometry.slideHeight}`, background: project.background.gradient ?? project.background.color }}
        role="img"
        aria-label={`${view === 'slide' ? `Vista del slide ${slideIndex + 1}` : 'Vista panorámica del carrusel'}${label ? `: ${label}` : ''}`}
      >
        <div
          className="absolute left-0 top-0 h-full"
          style={{
            width: isCarousel && view === 'slide' ? `${geometry.slideCount * 100}%` : '100%',
            transform: isCarousel && view === 'slide' ? `translateX(-${(visibleSlideIndex / geometry.slideCount) * 100}%)` : undefined,
          }}
        >
          {layers.map((layer) => (
            <div key={layer.id} className={`absolute ${getClipClass(layer.clipShape)}`} style={getLayerStyle(layer, geometry)}>
              <ImageLayerBlockRenderer layer={layer} brandTokens={project.brandTokens} />
            </div>
          ))}
        </div>
        <PreviewGuides geometry={geometry} project={project} view={view} slideIndex={visibleSlideIndex} showGuides={showGuides} showSafeZones={showSafeZones} />
      </div>
    </div>
  );
};

export const CarouselPreviewSurface: React.FC<CarouselPreviewSurfaceProps> = ({
  project,
  mode,
  activeSlideIndex,
  onSlideChange,
  comparisonBefore,
  showGuides = true,
  showSafeZones = true,
  className = '',
}) => {
  const geometry = getCarouselGeometry(project.preset, project.carouselConfig?.slideCount, project.carouselConfig?.enabled);
  const slideIndex = clampSlide(activeSlideIndex, geometry.slideCount);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const swipeRegionRef = useRef<HTMLDivElement>(null);

  const stepSlide = (direction: number) => onSlideChange(clampSlide(slideIndex + direction, geometry.slideCount));
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'swipe') return;
    setDragStart(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (mode !== 'swipe' || dragStart === null) return;
    const delta = event.clientX - dragStart;
    if (Math.abs(delta) > 36) stepSlide(delta < 0 ? 1 : -1);
    setDragStart(null);
  };

  return (
    <section ref={swipeRegionRef} className={`w-full min-w-0 rounded-3xl border border-slate-800 bg-slate-950/80 p-3 text-white shadow-2xl sm:p-4 ${className}`} aria-label="Vista previa profesional del carrusel">
      {mode === 'comparison' ? (
        comparisonBefore ? (
          <div className="grid min-w-0 gap-3 md:grid-cols-2">
            <PreviewCanvas project={comparisonBefore} slideIndex={slideIndex} view="slide" showGuides={showGuides} showSafeZones={showSafeZones} label="Antes" />
            <PreviewCanvas project={project} slideIndex={slideIndex} view="slide" showGuides={showGuides} showSafeZones={showSafeZones} label="Después" />
          </div>
        ) : (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-slate-700 px-5 text-center text-xs text-slate-400">
            Aplica una variante para activar la comparación antes / después.
          </div>
        )
      ) : mode === 'panorama' ? (
        <PreviewCanvas project={project} slideIndex={slideIndex} view="panorama" showGuides={showGuides} showSafeZones={showSafeZones} label="Tira panorámica · cortes de exportación" />
      ) : mode === 'slide' ? (
        <div className="mx-auto max-w-xl">
          <PreviewCanvas project={project} slideIndex={slideIndex} view="slide" showGuides={showGuides} showSafeZones={showSafeZones} label={`Slide ${slideIndex + 1} de ${geometry.slideCount}`} />
        </div>
      ) : (
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => setDragStart(null)}
          className="mx-auto max-w-sm touch-pan-y select-none"
          role="region"
          aria-label={`Simulación de swipe, slide ${slideIndex + 1} de ${geometry.slideCount}`}
        >
          <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-slate-800 bg-black p-2 shadow-2xl">
            <div className="mx-auto mb-2 h-1.5 w-20 rounded-full bg-slate-700" />
            <PreviewCanvas project={project} slideIndex={slideIndex} view="slide" showGuides={showGuides} showSafeZones={showSafeZones} />
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-bold text-slate-400">
              <span className="inline-flex items-center gap-1"><MoveHorizontal className="size-3.5 text-brand-cyan" /> Desliza para probar</span>
              <span className="font-mono text-slate-300">{slideIndex + 1}/{geometry.slideCount}</span>
            </div>
          </div>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
          {showGuides && <span className="inline-flex items-center gap-1"><Ruler className="size-3 text-amber-300" /> Cortes visibles</span>}
          {showSafeZones && <span className="inline-flex items-center gap-1"><ShieldCheck className="size-3 text-brand-cyan" /> Zona segura</span>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => stepSlide(-1)} disabled={slideIndex === 0} className="flex size-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:border-brand-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-35" aria-label="Slide anterior"><ChevronLeft className="size-4" /></button>
          <span className="min-w-16 text-center font-mono text-[10px] font-bold text-slate-300">{slideIndex + 1} / {geometry.slideCount}</span>
          <button type="button" onClick={() => stepSlide(1)} disabled={slideIndex === geometry.slideCount - 1} className="flex size-8 items-center justify-center rounded-lg border border-slate-700 text-slate-300 transition-colors hover:border-brand-cyan hover:text-white disabled:cursor-not-allowed disabled:opacity-35" aria-label="Slide siguiente"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </section>
  );
};
