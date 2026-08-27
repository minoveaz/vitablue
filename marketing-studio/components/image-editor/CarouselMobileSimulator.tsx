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
} from 'lucide-react';
import { ImageLayer, ImageProject } from '../../types/imageStudio';
import { ImageLayerBlockRenderer, getBlockDefaultWidth } from './blocks';
import { getCarouselGeometry } from '../../utils/imageDesignSystem';

export interface CarouselMobileSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  project: ImageProject;
}

export const CarouselMobileSimulator: React.FC<CarouselMobileSimulatorProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [platformMode, setPlatformMode] = useState<'instagram' | 'tiktok' | 'linkedin'>('instagram');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const isPanoramicCarousel = Boolean(project.preset.isCarousel || project.carouselConfig?.enabled);
  const carouselConfig = project.carouselConfig;
  const carouselGeometry = getCarouselGeometry(project.preset, carouselConfig?.slideCount);
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
    background: project.background.gradient ?? project.background.color ?? '#001219',
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
    if (layer.shadowPreset === 'neon') return '0 0 5px #00FFFF, 0 0 20px #005F73, 0 0 40px #001219';
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

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn select-none">
      {/* Container Modal */}
      <div className="relative flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full justify-center">
        
        {/* SIMULADOR SMARTPHONE */}
        <div className="relative flex flex-col items-center">
          {/* Marco iPhone Mockup */}
          <div className="relative w-[340px] sm:w-[380px] h-[680px] sm:h-[720px] rounded-[3rem] border-[10px] border-slate-800 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-50 pointer-events-none">
              <div className="h-4.5 w-24 rounded-full bg-black border border-slate-800/80 flex items-center justify-end px-2">
                <div className="size-2 rounded-full bg-slate-900 border border-slate-700" />
              </div>
            </div>

            {/* BARRA SUPERIOR DE RED SOCIAL SEGÚN PLATAFORMA */}
            {platformMode === 'instagram' && (
              <div className="pt-8 px-4 pb-2 bg-black flex items-center justify-between z-40 text-white">
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
              <div className="pt-8 px-4 pb-1 bg-transparent flex items-center justify-center gap-6 z-40 text-white text-xs font-bold drop-shadow">
                <span className="text-slate-400">Siguiendo</span>
                <span className="border-b-2 border-white pb-0.5">Para ti</span>
              </div>
            )}

            {platformMode === 'linkedin' && (
              <div className="pt-8 px-3 pb-2 bg-slate-900 flex items-center justify-between z-40 text-white border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-md bg-[#005F73] flex items-center justify-center text-[10px] font-bold text-white">
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
                      className="flex flex-col items-center text-[10px]"
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
                      className="flex flex-col items-center text-[10px]"
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
                      <button type="button" onClick={() => setIsLiked(!isLiked)}>
                        <Heart className={`size-5 ${isLiked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
                      </button>
                      <MessageCircle className="size-5 text-white" />
                      <Share2 className="size-5 text-white" />
                    </div>

                    {/* PAGINADOR DE PUNTOS INSTAGRAM */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: slideCount }, (_, i) => (
                        <div
                          key={i}
                          className={`rounded-full transition-all ${
                            i === currentSlide ? 'size-1.5 bg-brand-cyan' : 'size-1 bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>

                    <button type="button" onClick={() => setIsSaved(!isSaved)}>
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
                      <div
                        key={i}
                        className={`h-1 rounded-full transition-all ${
                          i === currentSlide ? 'w-4 bg-[#005F73]' : 'w-1.5 bg-slate-700'
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
        </div>

        {/* PANEL LATERAL DE CONFIGURACIÓN DEL SIMULADOR */}
        <div className="flex flex-col gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-3xl w-full md:w-72 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="size-4 text-brand-cyan" />
              <span className="text-xs font-bold">Simulador Interactivo</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="size-7 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* SELECTOR DE PLATAFORMA */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1.5 block">
              Vista previa de plataforma
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setPlatformMode('instagram')}
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                  platformMode === 'instagram'
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Instagram
              </button>
              <button
                type="button"
                onClick={() => setPlatformMode('tiktok')}
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
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
                className={`py-1.5 rounded-lg font-bold transition-all text-center ${
                  platformMode === 'linkedin'
                    ? 'bg-[#005F73] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LinkedIn
              </button>
            </div>
          </div>

          {/* CHECKLIST DE CALIDAD VISUAL */}
          <div className="space-y-2 text-xs bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="size-3 text-amber-400" /> Checklist de Retención
            </span>
            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Continuidad visual entre diapositivas comprobada.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Textos clave centrados fuera de las zonas de botones.</span>
            </div>
            <div className="flex items-start gap-2 text-slate-300 text-[11px]">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>Última slide con llamado a la acción claro.</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            💡 Puedes arrastrar con el ratón o deslizar con el dedo sobre el teléfono para probar la fluidez.
          </div>
        </div>

      </div>
    </div>
  );
};
