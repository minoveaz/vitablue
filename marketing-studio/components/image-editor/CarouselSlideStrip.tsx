import React, { useMemo, useState } from 'react';
import { Copy, GripVertical, Layers, Plus } from 'lucide-react';
import type { ImageLayer, ImageProject } from '../../types/imageStudio';
import { CAROUSEL_LAYOUT_CATALOG } from '../../data/carouselLayoutCatalog';
import { ImageLayerBlockRenderer } from './blocks';

interface CarouselSlideStripProps {
  project: ImageProject;
  activeSlideIndex: number;
  onSelectSlide: (slideIndex: number) => void;
  onReorderSlides: (fromIndex: number, toIndex: number) => void;
  onDuplicateSlide: (slideIndex: number) => void;
  onChangeLayout: (layoutId: string) => void;
}

const getSlideLayers = (layers: ImageLayer[], slideIndex: number): ImageLayer[] =>
  layers.filter((layer) => {
    if (
      layer.id.includes('-panorama-wave') ||
      layer.id.includes('-panorama-wave-midnight') ||
      layer.id.includes('-top-semicircle-large')
    ) {
      return true;
    }
    const owner = layer.props?.slideIndex;
    if (typeof owner === 'number') return owner === slideIndex;
    return slideIndex === 0;
  });

export const CarouselSlideStrip: React.FC<CarouselSlideStripProps> = ({
  project,
  activeSlideIndex,
  onSelectSlide,
  onReorderSlides,
  onDuplicateSlide,
  onChangeLayout,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const config = project.carouselConfig;
  const slideWidth = config?.slideWidth ?? project.preset.slideWidth ?? project.preset.width;
  const slideHeight = config?.slideHeight ?? project.preset.slideHeight ?? project.preset.height;
  const slideCount = config?.slideCount ?? 0;
  const activeLayoutId = config?.layoutId ?? CAROUSEL_LAYOUT_CATALOG[0]?.id ?? '';
  const layoutOptions = useMemo(
    () => CAROUSEL_LAYOUT_CATALOG.filter((layout) => layout.supportedPlatforms.includes(config?.platform ?? 'instagram')),
    [config?.platform],
  );

  if (!config?.enabled || slideCount < 1) return null;

  return (
    <section className="shrink-0 border-t border-slate-800 bg-primary-dark/95 px-3 py-2.5 text-white sm:px-5" aria-label="Editor de diapositivas">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="flex items-center gap-2">
          <Layers className="size-3.5 text-brand-cyan" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Diapositivas</span>
          <span className="rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-brand-cyan">
            {slideCount}
          </span>
        </div>
        <label className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
          Layout
          <select
            value={activeLayoutId}
            onChange={(event) => onChangeLayout(event.target.value)}
            className="max-w-[12rem] rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-200 outline-none focus:border-brand-cyan"
            aria-label="Cambiar layout del carrusel"
          >
            {layoutOptions.map((layout) => (
              <option key={layout.id} value={layout.id}>{layout.name}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex min-w-0 flex-wrap items-end gap-2 overflow-x-auto pb-0.5" role="list" aria-label="Miniaturas del carrusel">
        {Array.from({ length: slideCount }, (_, index) => {
          const metadata = config.slides[index];
          const slideLayers = getSlideLayers(project.layers, index);
          return (
            <div
              key={`${metadata?.index ?? index}-${metadata?.role ?? 'slide'}`}
              role="listitem"
              draggable
              onDragStart={(event) => {
                setDraggedIndex(index);
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', String(index));
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(event) => {
                event.preventDefault();
                const source = draggedIndex ?? Number(event.dataTransfer.getData('text/plain'));
                if (Number.isInteger(source) && source !== index) onReorderSlides(source, index);
                setDraggedIndex(null);
              }}
              onDragEnd={() => setDraggedIndex(null)}
              className={`group relative w-24 shrink-0 sm:w-28 ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div
                role="button"
                tabIndex={0}
                draggable
                onClick={() => onSelectSlide(index)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onSelectSlide(index);
                  }
                }}
                aria-label={`Editar slide ${index + 1}: ${metadata?.title ?? metadata?.role ?? 'slide'}`}
                aria-current={activeSlideIndex === index ? 'true' : undefined}
                className={`relative block aspect-[4/5] w-full overflow-hidden rounded-xl border bg-primary-dark text-left transition-all ${
                  activeSlideIndex === index
                    ? 'border-brand-cyan ring-2 ring-brand-cyan/30'
                    : 'border-slate-700 hover:border-slate-500'
                }`}
                style={{ aspectRatio: `${slideWidth} / ${slideHeight}` }}
              >
                <div className="absolute inset-0" style={{ background: project.background.gradient ?? project.background.color }}>
                  {slideLayers.map((layer) => {
                    const width = layer.width ? `${Math.max(8, (layer.width / slideWidth) * 100)}%` : '22%';
                    const height = layer.height ? `${Math.max(5, (layer.height / slideHeight) * 100)}%` : '12%';
                    const isPanoramic =
                      layer.id.includes('-panorama-wave') ||
                      layer.id.includes('-panorama-wave-midnight') ||
                      layer.id.includes('-top-semicircle-large');
                    const left = isPanoramic
                      ? `${(((layer.position.x / 100) * slideWidth * slideCount - index * slideWidth) / slideWidth) * 100}%`
                      : typeof layer.props?.slideIndex === 'number'
                        ? `${(layer.position.x - (index * 100) / slideCount) * slideCount}%`
                        : `${layer.position.x}%`;
                    return (
                      <div
                        key={layer.id}
                        className="pointer-events-none absolute overflow-hidden text-[4px] leading-tight text-white"
                        style={{
                          left,
                          top: `${layer.position.y}%`,
                          width,
                          height,
                          transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${layer.scale ?? 1})`,
                          transformOrigin: 'center',
                          opacity: layer.opacity ?? 1,
                          zIndex: layer.zIndex,
                        }}
                      >
                        <div className="h-full w-full overflow-hidden rounded-sm bg-white/10">
                          <ImageLayerBlockRenderer layer={layer} brandTokens={project.brandTokens} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="absolute left-1.5 top-1.5 rounded bg-black/65 px-1 py-0.5 font-mono text-[9px] font-bold text-white">
                  {index + 1}
                </span>
                <GripVertical className="absolute right-1.5 top-1.5 size-3 text-white/60" aria-hidden="true" />
                <span className="absolute inset-x-1 bottom-1 truncate rounded bg-black/60 px-1 py-0.5 text-[9px] font-semibold text-white">
                  {metadata?.title ?? metadata?.role ?? 'Slide'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDuplicateSlide(index)}
                disabled={slideCount >= 10}
                className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-slate-300 shadow-lg transition-colors hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                aria-label={`Duplicar slide ${index + 1}`}
                title="Duplicar slide"
              >
                <Copy className="size-3" />
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => onDuplicateSlide(slideCount - 1)}
          disabled={slideCount >= 10}
          className="flex aspect-[4/5] w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-slate-700 text-slate-500 transition-colors hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-40 sm:w-28"
          aria-label="Añadir diapositiva duplicando la última"
          title="Añadir diapositiva"
        >
          <Plus className="size-4" />
          <span className="text-[9px] font-bold">Añadir</span>
        </button>
      </div>
    </section>
  );
};
