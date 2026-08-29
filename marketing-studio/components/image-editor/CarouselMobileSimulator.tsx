import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Music2,
  CheckCircle2,
  Sparkles,
  Palette,
  Type,
  MousePointerClick,
  Image as ImageIcon,
  Monitor,
  PanelTop,
  Scan,
  ShieldCheck,
} from 'lucide-react';
import type {
  CarouselAspectRatio,
  CarouselCreativeVariant,
  ImageLayer,
  ImageProject,
} from '../../types/imageStudio';
import { ImageLayerBlockRenderer, getBlockDefaultWidth } from './blocks';
import { CarouselPreviewSurface, type CarouselPreviewSurfaceMode } from './CarouselPreviewSurface';
import { getCarouselGeometry, isCarouselProject } from '../../utils/imageDesignSystem';
import {
  CAROUSEL_ASPECT_RATIOS,
  CAROUSEL_CREATIVE_VARIANTS,
} from '../../utils/carouselCreativeVariants';

export interface CarouselMobileSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  project: ImageProject;
  onApplyVariant?: (variant: CarouselCreativeVariant) => void;
  onAdaptAspectRatio?: (aspectRatio: CarouselAspectRatio) => void;
  comparisonBefore?: ImageProject | null;
}

export const CarouselMobileSimulator: React.FC<CarouselMobileSimulatorProps> = ({
  isOpen,
  onClose,
  project,
  onApplyVariant,
  onAdaptAspectRatio,
  comparisonBefore,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [platformMode, setPlatformMode] = useState<'instagram' | 'tiktok' | 'linkedin'>('instagram');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showComparison, setShowComparison] = useState(Boolean(comparisonBefore));
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);
  const [surfaceMode, setSurfaceMode] = useState<CarouselPreviewSurfaceMode>('swipe');
  const [showSurfaceGuides, setShowSurfaceGuides] = useState(true);
  const [showSurfaceSafeZones, setShowSurfaceSafeZones] = useState(true);

  const isPanoramicCarousel = isCarouselProject(project.preset, project.carouselConfig?.enabled);
  const carouselConfig = project.carouselConfig;
  const carouselGeometry = getCarouselGeometry(project.preset, carouselConfig?.slideCount, carouselConfig?.enabled);
  const slideCount = isPanoramicCarousel
    ? carouselGeometry.slideCount
    : 1;
  const slideWidth = isPanoramicCarousel
    ? carouselConfig?.slideWidth ?? carouselGeometry.slideWidth
    : project.preset.width;
  const slideHeight = isPanoramicCarousel
    ? carouselConfig?.slideHeight ?? carouselGeometry.slideHeight
    : project.preset.height;
  const canvasWidth = project.preset.width;
  const canvasHeight = project.preset.height;

  const slideBoxRef = useRef<HTMLDivElement | null>(null);
  const [measuredSlideWidth, setMeasuredSlideWidth] = useState<number>(340);

  useEffect(() => {
    if (!isOpen) return;
    const updateSize = () => {
      if (slideBoxRef.current) {
        setMeasuredSlideWidth(slideBoxRef.current.clientWidth);
      }
    };
    updateSize();
    const timer = window.setTimeout(updateSize, 100);
    window.addEventListener('resize', updateSize);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, [isOpen, platformMode]);

  useEffect(() => {
    setCurrentSlide((slide) => Math.min(slide, slideCount - 1));
  }, [project.id, project.preset.id, slideCount]);

  useEffect(() => {
    const platform = project.carouselConfig?.platform ?? project.preset.carouselPlatform;
    if (project.preset.id.includes('tiktok') || platform === 'tiktok') {
      setPlatformMode('tiktok');
    } else if (project.preset.id.includes('linkedin') || platform === 'linkedin') {
      setPlatformMode('linkedin');
    } else {
      setPlatformMode('instagram');
    }
  }, [project.carouselConfig?.platform, project.preset.carouselPlatform, project.preset.id]);

  useEffect(() => {
    setShowComparison(Boolean(comparisonBefore));
  }, [comparisonBefore]);

  if (!isOpen) return null;

  const nextSlide = () => {
    if (currentSlide < slideCount - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  // Drag / Touch gestures
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || touchStart === null) return;
    const diff = e.clientX - touchStart;
    setTouchDelta(diff);
  };

  const handleMouseUp = () => {
    if (touchDelta < -40 && currentSlide < slideCount - 1) {
      nextSlide();
    } else if (touchDelta > 40 && currentSlide > 0) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchDelta(0);
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStart === null) return;
    const diff = e.touches[0].clientX - touchStart;
    setTouchDelta(diff);
  };

  const handleTouchEnd = () => {
    handleMouseUp();
  };

  // Canvas background snapshot color / style
  const bgStyle = {
    background: project.background.gradient ?? project.background.color ?? 'var(--color-secondary)',
  };

  const getFilterStyle = (layer: ImageLayer) => {
    const parts: string[] = [];
    if (layer.brightness !== undefined && layer.brightness !== 100) parts.push(`brightness(${layer.brightness}%)`);
    if (layer.contrast !== undefined && layer.contrast !== 100) parts.push(`contrast(${layer.contrast}%)`);
    if (layer.blur !== undefined && layer.blur > 0) parts.push(`blur(${layer.blur}px)`);
    if (layer.filter === 'grayscale') parts.push('grayscale(100%)');
    if (layer.filter === 'sepia') parts.push('sepia(80%)');
    if (layer.filter === 'contrast') parts.push('contrast(160%) saturate(120%)');
    if (layer.filter === 'teal_tint') parts.push('hue-rotate(150deg) saturate(130%)');
    if (layer.filter === 'gold_tint') parts.push('sepia(50%) hue-rotate(330deg) saturate(160%)');
    return parts.length > 0 ? parts.join(' ') : undefined;
  };

  const getShadowStyle = (layer: ImageLayer) => {
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
        return 'rounded-full overflow-hidden';
      case 'squircle':
        return 'rounded-[2.5rem] overflow-hidden';
      case 'phone_mockup':
        return 'rounded-[3rem] border-4 border-slate-700 shadow-2xl overflow-hidden';
      case 'shield':
        return 'rounded-b-[3rem] rounded-t-2xl overflow-hidden';
      default:
        return '';
    }
  };

  const getPlatformLabel = () => {
    if (platformMode === 'tiktok') return 'TikTok Photo Mode';
    if (platformMode === 'linkedin') return 'LinkedIn documento';
    return 'Instagram carrusel';
  };

  const currentAspectRatio: CarouselAspectRatio | undefined = CAROUSEL_ASPECT_RATIOS.find((ratio) => {
    const [width, height] = ratio.id.split(':').map(Number);
    return Math.abs(slideWidth / slideHeight - width / height) < 0.03;
  })?.id;

  const getVariants = (kind: CarouselCreativeVariant['kind']) =>
    CAROUSEL_CREATIVE_VARIANTS.filter((variant) => variant.kind === kind);

  const applyVariant = (variant: CarouselCreativeVariant) => {
    setActiveVariantId(variant.id);
    onApplyVariant?.(variant);
    setShowComparison(true);
    setSurfaceMode('comparison');
  };

  const renderComparisonSlide = (snapshot: ImageProject, label: string) => {
    const snapshotGeometry = getCarouselGeometry(
      snapshot.preset,
      snapshot.carouselConfig?.slideCount,
      snapshot.carouselConfig?.enabled,
    );
    const snapshotSlide = Math.min(currentSlide, snapshotGeometry.slideCount - 1);
    const width = snapshot.carouselConfig?.slideWidth ?? snapshotGeometry.slideWidth;
    const height = snapshot.carouselConfig?.slideHeight ?? snapshotGeometry.slideHeight;
    const slideLayers = snapshot.layers.filter((layer) => {
      const owner = layer.props?.slideIndex;
      return typeof owner === 'number' ? owner === snapshotSlide : snapshotSlide === 0;
    });

    return (
      <div className="min-w-0">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="font-mono text-[9px] text-slate-500">{snapshot.preset.aspectRatio}</span>
        </div>
        <div
          className="relative mx-auto w-full overflow-hidden rounded-xl border border-slate-700 bg-primary-dark"
          style={{ aspectRatio: `${width} / ${height}` }}
          aria-label={`${label}: slide ${snapshotSlide + 1}`}
        >
          <div className="absolute inset-0" style={{ background: snapshot.background.gradient ?? snapshot.background.color }}>
            {slideLayers.map((layer) => (
              <div
                key={layer.id}
                className="pointer-events-none absolute overflow-hidden text-[4px] leading-tight text-white"
                style={{
                  left: `${(layer.position.x - snapshotSlide * 100)}%`,
                  top: `${layer.position.y}%`,
                  width: layer.width ? `${Math.max(8, (layer.width / width) * 100)}%` : '24%',
                  height: layer.height ? `${Math.max(5, (layer.height / height) * 100)}%` : '14%',
                  transform: `translate(-50%, -50%) scale(${layer.scale ?? 1})`,
                  opacity: layer.opacity ?? 1,
                  zIndex: layer.zIndex,
                }}
              >
                <ImageLayerBlockRenderer layer={layer} brandTokens={snapshot.brandTokens} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn select-none">
      {/* Container Modal */}
      <div className="relative flex w-full max-w-5xl flex-col items-center justify-center gap-5 md:flex-row md:items-start">
        
        {/* SIMULADOR SMARTPHONE / SUPERFICIE PROFESIONAL */}
        {surfaceMode === 'swipe' ? (
        <div className="relative flex flex-col items-center">
          {/* Marco iPhone Mockup */}
          <div className="relative flex aspect-[9/19] w-full max-w-[22rem] flex-col overflow-hidden rounded-[2.5rem] border-8 border-slate-800 bg-black shadow-2xl">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-50 pointer-events-none">
              <div className="flex h-5 w-24 items-center justify-end rounded-full border border-slate-800/80 bg-black px-2">
                <div className="size-2 rounded-full bg-slate-900 border border-slate-700" />
              </div>
            </div>

            {/* BARRA SUPERIOR DE RED SOCIAL SEGÚN PLATAFORMA */}
            {platformMode === 'instagram' && (
              <div className="z-40 flex items-center justify-between bg-black px-4 pb-2 pt-8 text-white">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[1.5px]">
                    <div className="size-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                      VB
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      vitablue.es <CheckCircle2 className="size-3 text-brand-cyan fill-brand-cyan text-black" />
                    </div>
                    <div className="text-[10px] text-slate-400">Audio original</div>
                  </div>
                </div>
                <MoreVertical className="size-4 text-slate-400" />
              </div>
            )}

            {platformMode === 'tiktok' && (
              <div className="z-40 flex items-center justify-center gap-6 bg-black/30 px-4 pb-2 pt-8 text-xs font-bold text-white drop-shadow">
                <span className="text-slate-400">Siguiendo</span>
                <span className="border-b-2 border-white pb-0.5">Para ti</span>
              </div>
            )}

            {platformMode === 'linkedin' && (
              <div className="z-40 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-3 pb-2 pt-8 text-white">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-md bg-primary text-[10px] font-bold text-white">
                    in
                  </div>
                  <div>
                    <div className="text-[11px] font-bold">VitaBlue Seguros</div>
                    <div className="text-[9px] text-slate-400">Documento deslizable</div>
                  </div>
                </div>
                <div className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-brand-cyan font-bold">
                  {currentSlide + 1} / {slideCount}
                </div>
              </div>
            )}

            {/* VISOR DE DIAPOSITIVAS INTERACTIVO (SWIPE / DRAG) */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative flex-1 w-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing ${
                platformMode === 'tiktok' ? 'bg-black' : 'bg-slate-950'
              }`}
            >
              {/* Contenedor de slides continuo */}
              <div
                className="flex h-full w-full transition-transform ease-out duration-300 items-center"
                style={{
                  transform: `translateX(calc(-${currentSlide * 100}% + ${touchDelta}px))`,
                  transitionDuration: isDragging ? '0ms' : '300ms',
                }}
              >
                {Array.from({ length: slideCount }, (_, idx) => {
                  return (
                    <div
                      key={idx}
                      className="h-full w-full shrink-0 flex items-center justify-center p-2 relative overflow-hidden"
                      style={platformMode === 'tiktok' ? { padding: 0 } : {}}
                    >
                      {/* Slide Box */}
                      <div
                        ref={idx === 0 ? slideBoxRef : undefined}
                        className="relative w-full shadow-2xl overflow-hidden rounded-xl"
                        style={{
                          aspectRatio: `${slideWidth} / ${slideHeight}`,
                          maxHeight: platformMode === 'tiktok' ? '100%' : '85%',
                          ...bgStyle,
                        }}
                      >
                        {/* Full Resolution Canvas Scaled to Slide Viewport */}
                        <div
                          className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
                          style={{
                            width: `${canvasWidth}px`,
                            height: `${canvasHeight}px`,
                            transform: `scale(${measuredSlideWidth / slideWidth}) translateX(-${idx * slideWidth}px)`,
                          }}
                        >
                          {/* Render of layers */}
                          {project.layers.map((layer) => {
                            if (layer.visible === false) return null;
                            const blockProps = layer.props ?? {};
                            const widthStyle = getBlockDefaultWidth(layer.blockType, layer.width, blockProps);
                            const scaleX = (layer.scale ?? 1) * (layer.flipHorizontal ? -1 : 1);
                            const scaleY = (layer.scale ?? 1) * (layer.flipVertical ? -1 : 1);

                            return (
                              <div
                                key={layer.id}
                                className={`absolute pointer-events-none select-none ${getClipClass(layer.clipShape)}`}
                                style={{
                                  left: `${layer.position.x}%`,
                                  top: `${layer.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${scaleX}, ${scaleY})`,
                                  zIndex: layer.zIndex,
                                  width: widthStyle,
                                  height: layer.height
                                    ? `${layer.height}px`
                                    : layer.blockType === 'GeometricShape'
                                    ? '200px'
                                    : 'auto',
                                  opacity: layer.opacity ?? 1,
                                  boxShadow: getShadowStyle(layer),
                                  borderWidth: layer.blockType === 'GeometricShape' ? undefined : layer.borderWidth ? `${layer.borderWidth}px` : undefined,
                                  borderColor: layer.blockType === 'GeometricShape' ? undefined : layer.borderColor,
                                  borderStyle: layer.blockType === 'GeometricShape' ? undefined : layer.borderWidth ? 'solid' : undefined,
                                  borderRadius: layer.blockType === 'GeometricShape' ? undefined : layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                                  filter: getFilterStyle(layer),
                                }}
                              >
                                <ImageLayerBlockRenderer
                                  layer={layer}
                                  brandTokens={project.brandTokens}
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Indicador de Número en Slide */}
                        <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono font-bold text-white/90">
                          {idx + 1}/{slideCount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* OVERLAY TIKTOK UI (Lado Derecho & Footer) */}
              {platformMode === 'tiktok' && (
                <>
                  <div className="absolute right-2 bottom-16 flex flex-col items-center gap-4 z-40 text-white drop-shadow-md">
                    <button
                      type="button"
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex min-h-11 min-w-11 flex-col items-center justify-center text-[10px]"
                    >
                      <Heart className={`size-6 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                      <span>24.8K</span>
                    </button>
                    <div className="flex flex-col items-center text-[10px]">
                      <MessageCircle className="size-6 text-white" />
                      <span>412</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSaved(!isSaved)}
                      className="flex min-h-11 min-w-11 flex-col items-center justify-center text-[10px]"
                    >
                      <Bookmark className={`size-6 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                      <span>3.2K</span>
                    </button>
                    <div className="flex flex-col items-center text-[10px]">
                      <Share2 className="size-6 text-white" />
                      <span>Share</span>
                    </div>
                  </div>

                  <div className="absolute left-3 right-16 bottom-4 z-40 text-white text-xs drop-shadow">
                    <div className="font-bold flex items-center gap-1">
                      @vitablue.es <CheckCircle2 className="size-3 text-brand-cyan fill-brand-cyan text-black" />
                    </div>
                    <p className="text-[11px] line-clamp-2 text-slate-200 mt-0.5">
                      Desliza para ver la guía completa 📲 Guarda este carrusel para tu próximo viaje #seguros #españa
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-300 mt-1">
                      <Music2 className="size-3 animate-spin" /> Sonido original - VitaBlue
                    </div>
                  </div>
                </>
              )}

              {/* OVERLAY INSTAGRAM FOOTER (Botones Like, Comentario, Guardar & Puntos) */}
              {platformMode === 'instagram' && (
                <div className="absolute inset-x-0 bottom-0 bg-black/95 px-4 pt-2 pb-5 z-40 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setIsLiked(!isLiked)} className="flex min-h-11 min-w-11 items-center justify-center">
                        <Heart className={`size-5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                      </button>
                      <MessageCircle className="size-5 text-white" />
                      <Share2 className="size-5 text-white" />
                    </div>

                    {/* PAGINADOR DE PUNTOS INSTAGRAM */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: slideCount }, (_, i) => (
                        <button
                          type="button"
                          key={i}
                          aria-label={`Ir al slide ${i + 1}`}
                          onClick={() => setCurrentSlide(i)}
                          className={`rounded-full transition-all ${
                            i === currentSlide ? 'size-1.5 bg-brand-cyan' : 'size-1 bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <button type="button" onClick={() => setIsSaved(!isSaved)} className="flex min-h-11 min-w-11 items-center justify-center">
                      <Bookmark className={`size-5 ${isSaved ? 'text-amber-400 fill-amber-400' : 'text-white'}`} />
                    </button>
                  </div>
                  <div className="text-[10px] font-bold text-slate-200">
                    Les gusta a <span className="font-bold">estudiantes_madrid</span> y <span className="font-bold">842 más</span>
                  </div>
                </div>
              )}

              {/* OVERLAY LINKEDIN PAGINATOR FOOTER */}
              {platformMode === 'linkedin' && (
                <div className="absolute inset-x-0 bottom-0 bg-slate-900/95 px-4 py-3 z-40 text-white flex items-center justify-between border-t border-slate-800">
                  <span className="text-[10px] text-slate-300 font-bold">Página {currentSlide + 1} de {slideCount}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: slideCount }, (_, i) => (
                      <button
                        type="button"
                        key={i}
                        aria-label={`Ir a la página ${i + 1}`}
                        onClick={() => setCurrentSlide(i)}
                        className={`h-1 rounded-full transition-all ${
                          i === currentSlide ? 'w-4 bg-primary' : 'w-1.5 bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Barra Home Indicator de iOS */}
            <div className="h-4 bg-black flex items-center justify-center">
              <div className="h-1 w-28 rounded-full bg-slate-700" />
            </div>
          </div>

          {/* CONTROLES DE NAVEGACIÓN EXTERNOS RÁPIDOS */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex size-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
            >
              <ChevronLeft className="size-5" />
            </button>

            <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Slide {currentSlide + 1} de {slideCount}
            </span>

            <button
              type="button"
              onClick={nextSlide}
              disabled={currentSlide === slideCount - 1}
              className="flex size-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-lg"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
          {slideCount > 1 && (
            <div className="mt-3 flex w-full max-w-[380px] gap-2 overflow-x-auto pb-1" aria-label="Miniaturas del carrusel">
              {Array.from({ length: slideCount }, (_, index) => {
                const metadata = carouselConfig?.slides[index];
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir al slide ${index + 1}`}
                    aria-current={currentSlide === index ? 'true' : undefined}
                    className={`flex min-w-14 flex-col gap-1 rounded-lg border p-1 transition-all ${
                      currentSlide === index ? 'border-brand-cyan ring-2 ring-brand-cyan/30' : 'border-slate-700 opacity-70'
                    }`}
                  >
                    <span className="flex aspect-[4/5] items-center justify-center rounded bg-primary-dark text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="truncate text-[9px] font-medium text-slate-300">{metadata?.role ?? 'slide'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        ) : (
          <CarouselPreviewSurface
            project={project}
            mode={surfaceMode}
            activeSlideIndex={currentSlide}
            onSlideChange={setCurrentSlide}
            comparisonBefore={comparisonBefore}
            showGuides={showSurfaceGuides}
            showSafeZones={showSurfaceSafeZones}
            className="max-w-3xl"
          />
        )}

        {/* PANEL LATERAL DE CONFIGURACIÓN DEL SIMULADOR */}
        <div className="flex max-h-[78vh] w-full flex-col gap-4 overflow-y-auto rounded-3xl border border-slate-800 bg-primary-dark/95 p-4 text-white sm:p-5 md:max-w-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-brand-cyan" />
              <div>
                <span className="block text-xs font-bold">Simulador Interactivo</span>
                <span className="text-[10px] text-slate-400">{getPlatformLabel()}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="text-[11px] font-bold text-slate-400">Superficie de preview</label>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">Producción</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
              {([
                ['slide', 'Slide', PanelTop],
                ['panorama', 'Panorama', Scan],
                ['comparison', 'Antes / después', Sparkles],
                ['swipe', 'Swipe', Smartphone],
              ] as const).map(([mode, label, Icon]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSurfaceMode(mode)}
                  disabled={mode === 'comparison' && !comparisonBefore}
                  aria-pressed={surfaceMode === mode}
                  className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[10px] font-bold transition-colors ${
                    surfaceMode === mode
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
                  }`}
                >
                  <Icon className="size-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {surfaceMode !== 'swipe' && <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setShowSurfaceGuides((visible) => !visible)}
              aria-pressed={showSurfaceGuides}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-colors ${
                showSurfaceGuides ? 'border-amber-300/60 bg-amber-300/10 text-amber-200' : 'border-slate-700 text-amber-100/70 hover:text-white'
              }`}
            >
              <Scan className="size-3.5" /> Cortes
            </button>
            <button
              type="button"
              onClick={() => setShowSurfaceSafeZones((visible) => !visible)}
              aria-pressed={showSurfaceSafeZones}
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-colors ${
                showSurfaceSafeZones ? 'border-brand-cyan/60 bg-brand-cyan/10 text-brand-cyan' : 'border-slate-700 text-brand-cyan/70 hover:text-white'
              }`}
            >
              <ShieldCheck className="size-3.5" /> Safe zones
            </button>
          </div>}

          {/* SELECTOR DE PLATAFORMA */}
          <div>
            <label className="mb-1.5 block text-[11px] font-bold text-slate-400">
              Vista previa de plataforma
            </label>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
              <button
                type="button"
                onClick={() => setPlatformMode('instagram')}
                className={`min-h-11 rounded-lg text-center font-bold transition-all ${
                  platformMode === 'instagram'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setPlatformMode('tiktok')}
                className={`min-h-11 rounded-lg text-center font-bold transition-all ${
                  platformMode === 'tiktok'
                    ? 'bg-slate-800 text-brand-cyan shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                TikTok
              </button>
              <button
                type="button"
                onClick={() => setPlatformMode('linkedin')}
                className={`min-h-11 rounded-lg text-center font-bold transition-all ${
                  platformMode === 'linkedin'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* ADAPTACIÓN SEMÁNTICA DE FORMATO */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="size-3.5 text-brand-cyan" />
              <span className="text-[11px] font-bold text-slate-300">Formato de publicación</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CAROUSEL_ASPECT_RATIOS.map((ratio) => {
                const active = currentAspectRatio === ratio.id;
                return (
                  <button
                    key={ratio.id}
                    type="button"
                    onClick={() => onAdaptAspectRatio?.(ratio.id)}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                      active
                        ? 'border-brand-cyan bg-primary/30 text-white'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-500'
                    }`}
                    aria-pressed={active}
                  >
                    <span className="font-mono text-[11px] font-bold">{ratio.id}</span>
                    <span className="text-[9px] text-slate-400">{ratio.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VARIANTES DE DIRECCIÓN DE ARTE */}
          <div className="space-y-3 border-t border-slate-800 pt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-3.5 text-accent" />
                <span className="text-[11px] font-bold text-slate-300">Variantes de composición</span>
              </div>
              {comparisonBefore && (
                <button
                  type="button"
                  onClick={() => setShowComparison((visible) => !visible)}
                  className="text-[10px] font-bold text-brand-cyan underline-offset-2 hover:underline"
                >
                  {showComparison ? 'Ocultar comparación' : 'Ver antes / después'}
                </button>
              )}
            </div>
            {[
              { kind: 'layout' as const, label: 'Layout', icon: <Sparkles className="size-3" /> },
              { kind: 'color' as const, label: 'Color', icon: <Palette className="size-3" /> },
              { kind: 'copy' as const, label: 'Copy', icon: <Type className="size-3" /> },
              { kind: 'cta' as const, label: 'CTA', icon: <MousePointerClick className="size-3" /> },
              { kind: 'image' as const, label: 'Imagen', icon: <ImageIcon className="size-3" /> },
            ].map((group) => (
              <div key={group.kind} className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.icon}
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {getVariants(group.kind).map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => applyVariant(variant)}
                      aria-pressed={activeVariantId === variant.id}
                      title={variant.description}
                      className={`min-h-10 rounded-lg border px-2.5 py-1.5 text-[10px] font-bold transition-colors ${
                        activeVariantId === variant.id
                          ? 'border-brand-cyan bg-primary text-white'
                          : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-500 hover:text-white'
                      }`}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {comparisonBefore && showComparison && (
            <div className="space-y-2 border-t border-slate-800 pt-3">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                <Sparkles className="size-3.5 text-accent" />
                Antes / después
              </div>
              <div className="grid grid-cols-2 gap-2">
                {renderComparisonSlide(comparisonBefore, 'Antes')}
                {renderComparisonSlide(project, 'Después')}
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-center">
            💡 Arrastra o desliza sobre el teléfono para revisar cada corte y validar la lectura.
          </div>
        </div>

      </div>
    </div>
  );
};
