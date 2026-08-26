import React, { useEffect, useRef, useState } from 'react';
import {
  Crop,
  FlipHorizontal,
  FlipVertical,
  ImagePlus,
  Maximize2,
  RotateCw,
  Undo2,
} from 'lucide-react';
import type { CarouselGeometry, ImageLayer } from '../../types/imageStudio';

export interface ImageContextualToolbarProps {
  layer: ImageLayer;
  isCarousel: boolean;
  activeSlideIndex: number;
  carouselGeometry: CarouselGeometry;
  onCrop: (layerId: string) => void;
  onRotate: (layerId: string, rotation: number) => void;
  onToggleFlipHorizontal: (layerId: string) => void;
  onToggleFlipVertical: (layerId: string) => void;
  onFitToActiveSlide: (layerId: string, slideIndex: number) => void;
  onReplaceLayerContent: (layerId: string, replacement: { imageUrl: string }) => void;
  onResetAdjustments: (layerId: string) => void;
}

const actionClass =
  'inline-flex min-h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 text-[11px] font-semibold text-slate-200 transition-colors hover:border-brand-cyan/60 hover:bg-primary/20 hover:text-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700/80 disabled:hover:bg-slate-900/80 disabled:hover:text-slate-200';

export const ImageContextualToolbar: React.FC<ImageContextualToolbarProps> = ({
  layer,
  isCarousel,
  activeSlideIndex,
  carouselGeometry,
  onCrop,
  onRotate,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onFitToActiveSlide,
  onReplaceLayerContent,
  onResetAdjustments,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacementUrl, setReplacementUrl] = useState(
    String(layer.props.imageUrl ?? layer.src ?? ''),
  );
  const [replacementError, setReplacementError] = useState<string | null>(null);
  const isLocked = Boolean(layer.locked);
  const imageUrl = String(layer.props.imageUrl ?? layer.src ?? '');
  const objectFit = String(layer.props.objectFit ?? 'cover');
  const focalPoint = layer.props.focalPoint as { x?: number; y?: number } | undefined;
  useEffect(() => {
    setReplacementUrl(imageUrl);
    setReplacementError(null);
  }, [layer.id, imageUrl]);
  const hasAdjustments =
    (layer.rotation ?? 0) !== 0 ||
    Boolean(layer.flipHorizontal) ||
    Boolean(layer.flipVertical) ||
    (layer.filter ?? 'none') !== 'none' ||
    (layer.brightness ?? 100) !== 100 ||
    (layer.contrast ?? 100) !== 100 ||
    (layer.blur ?? 0) !== 0 ||
    objectFit !== 'cover' ||
    Number(focalPoint?.x ?? 50) !== 50 ||
    Number(focalPoint?.y ?? 50) !== 50;

  const replaceWithUrl = () => {
    const nextUrl = replacementUrl.trim();
    if (!nextUrl) return;
    setReplacementError(null);
    onReplaceLayerContent(layer.id, { imageUrl: nextUrl });
  };

  const replaceWithFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setReplacementError('Selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setReplacementError('No se pudo leer la imagen.');
        return;
      }
      setReplacementError(null);
      setReplacementUrl(dataUrl);
      onReplaceLayerContent(layer.id, { imageUrl: dataUrl });
    };
    reader.onerror = () => setReplacementError('No se pudo leer la imagen.');
    reader.readAsDataURL(file);
  };

  return (
    <div
      data-image-contextual-toolbar
      className="flex w-full min-w-0 flex-wrap items-center justify-center gap-1.5"
      aria-label={`Herramientas de imagen para ${layer.title}`}
    >
      <span className="mr-1 flex min-w-0 max-w-44 items-center gap-1.5 border-r border-slate-800 pr-2 text-[11px] font-bold text-slate-200">
        <ImagePlus className="size-3.5 shrink-0 text-brand-cyan" aria-hidden="true" />
        <span className="truncate">{layer.title}</span>
        {isLocked && <span className="shrink-0 text-amber-300" title="Capa bloqueada" aria-label="Capa bloqueada">🔒</span>}
      </span>

      <button type="button" className={actionClass} onClick={() => onCrop(layer.id)} disabled={isLocked} title="Recortar al marco" aria-label="Recortar al marco">
        <Crop className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Recortar</span>
      </button>
      <button type="button" className={actionClass} onClick={() => onRotate(layer.id, ((layer.rotation ?? 0) + 90) % 360)} disabled={isLocked} title="Rotar 90 grados a la derecha" aria-label="Rotar 90 grados a la derecha">
        <RotateCw className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Rotar</span>
      </button>
      <button type="button" className={`${actionClass} ${layer.flipHorizontal ? 'border-brand-cyan/60 bg-primary/30 text-brand-cyan' : ''}`} onClick={() => onToggleFlipHorizontal(layer.id)} disabled={isLocked} aria-pressed={Boolean(layer.flipHorizontal)} title="Voltear horizontalmente" aria-label="Voltear horizontalmente">
        <FlipHorizontal className="size-3.5" aria-hidden="true" />
        <span className="hidden md:inline">Flip H</span>
      </button>
      <button type="button" className={`${actionClass} ${layer.flipVertical ? 'border-brand-cyan/60 bg-primary/30 text-brand-cyan' : ''}`} onClick={() => onToggleFlipVertical(layer.id)} disabled={isLocked} aria-pressed={Boolean(layer.flipVertical)} title="Voltear verticalmente" aria-label="Voltear verticalmente">
        <FlipVertical className="size-3.5" aria-hidden="true" />
        <span className="hidden md:inline">Flip V</span>
      </button>

      <button type="button" className={actionClass} onClick={() => onFitToActiveSlide(layer.id, activeSlideIndex)} disabled={isLocked} title={isCarousel ? `Ajustar al slide ${activeSlideIndex + 1} de ${carouselGeometry.slideCount}` : 'Ajustar al lienzo'} aria-label={isCarousel ? `Ajustar al slide activo, ${activeSlideIndex + 1} de ${carouselGeometry.slideCount}` : 'Ajustar al lienzo'}>
        <Maximize2 className="size-3.5" aria-hidden="true" />
        <span className="hidden lg:inline">{isCarousel ? `Slide ${activeSlideIndex + 1}` : 'Ajustar'}</span>
      </button>

      <div className="flex min-w-0 flex-wrap items-center gap-1" role="group" aria-label="Reemplazar imagen">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          className="sr-only"
          onChange={replaceWithFile}
          disabled={isLocked}
        />
        <button type="button" className={actionClass} onClick={() => fileInputRef.current?.click()} disabled={isLocked} title="Subir una imagen para reemplazarla" aria-label="Subir una imagen para reemplazarla">
          <ImagePlus className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Reemplazar</span>
        </button>
        <label className="sr-only" htmlFor={`replace-image-url-${layer.id}`}>URL de la nueva imagen</label>
        <input
          id={`replace-image-url-${layer.id}`}
          type="url"
          value={replacementUrl}
          onChange={(event) => setReplacementUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') replaceWithUrl();
          }}
          placeholder="URL de imagen"
          disabled={isLocked}
          className="h-8 w-28 rounded-lg border border-slate-700/80 bg-slate-950 px-2 text-[10px] text-white outline-none transition-colors placeholder:text-slate-500 focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan/40 disabled:cursor-not-allowed disabled:opacity-40 sm:w-40"
        />
        <button type="button" className="inline-flex h-8 items-center rounded-lg border border-primary/50 bg-primary/20 px-2 text-[10px] font-bold text-brand-cyan transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40" onClick={replaceWithUrl} disabled={isLocked || !replacementUrl.trim()} title="Aplicar URL de imagen" aria-label="Aplicar URL de imagen">
          Aplicar
        </button>
      </div>

      <button type="button" className={`${actionClass} ${hasAdjustments ? 'text-amber-200 hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-200' : ''}`} onClick={() => onResetAdjustments(layer.id)} disabled={isLocked || !hasAdjustments} title="Restablecer ajustes de imagen" aria-label="Restablecer ajustes de imagen">
        <Undo2 className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Restablecer</span>
      </button>

      {replacementError && <span className="basis-full text-center text-[10px] font-medium text-rose-300" role="alert">{replacementError}</span>}
      <span className="sr-only" aria-live="polite">{imageUrl ? 'Imagen lista para editar' : 'Sin imagen seleccionada'}</span>
    </div>
  );
};
