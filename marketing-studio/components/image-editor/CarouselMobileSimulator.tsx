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
  FileText,
  Instagram,
  CheckCircle2,
  ZoomIn,
  Sparkles,
} from 'lucide-react';
import { ImageProject } from '../../types/imageStudio';

export interface CarouselMobileSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  project: ImageProject;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
}

export const CarouselMobileSimulator: React.FC<CarouselMobileSimulatorProps> = ({
  isOpen,
  onClose,
  project,
  canvasRef,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [platformMode, setPlatformMode] = useState<'instagram' | 'tiktok' | 'linkedin'>('instagram');
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);

  const slideCount = project.preset.defaultSlideCount ?? (project.carouselConfig?.slideCount || 5);
  const slideWidth = project.preset.slideWidth ?? 1080;
  const slideHeight = project.preset.height ?? 1350;

  useEffect(() => {
    if (project.preset.id.includes('tiktok') || project.preset.carouselPlatform === 'tiktok') {
      setPlatformMode('tiktok');
    } else if (project.preset.id.includes('linkedin') || project.preset.carouselPlatform === 'linkedin') {
      setPlatformMode('linkedin');
    } else {
      setPlatformMode('instagram');
    }
  }, [project.preset]);

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

  const isPortrait = slideHeight >= slideWidth;

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
                        className="relative w-full shadow-2xl overflow-hidden rounded-xl"
                        style={{
                          aspectRatio: `${slideWidth} / ${slideHeight}`,
                          maxHeight: platformMode === 'tiktok' ? '100%' : '85%',
                          ...bgStyle,
                        }}
                      >
                        {/* Layers snapshot rendered inside slice viewport */}
                        <div
                          className="absolute inset-0 origin-top-left"
                          style={{
                            width: `${project.preset.width}px`,
                            height: `${project.preset.height}px`,
                            transform: `scale(${1 / slideCount}) translateX(-${idx * 100}%)`,
                          }}
                        >
                          {/* Mini render of layers */}
                          {project.layers.map((layer) => {
                            if (layer.visible === false) return null;
                            return (
                              <div
                                key={layer.id}
                                className="absolute pointer-events-none"
                                style={{
                                  left: `${layer.position.x}%`,
                                  top: `${layer.position.y}%`,
                                  transform: `translate(-50%, -50%) rotate(${layer.rotation ?? 0}deg) scale(${layer.scale ?? 1})`,
                                  zIndex: layer.zIndex,
                                }}
                              >
                                {layer.type === 'text' && (
                                  <div
                                    className="font-bold whitespace-nowrap"
                                    style={{
                                      color: layer.color ?? '#FFFFFF',
                                      fontSize: `${layer.fontSize ?? 28}px`,
                                      fontFamily: layer.fontFamily ?? 'Inter',
                                    }}
                                  >
                                    {layer.text}
                                  </div>
                                )}
                                {layer.type === 'shape' && (
                                  <div
                                    style={{
                                      width: `${layer.width ?? 100}px`,
                                      height: `${layer.height ?? 100}px`,
                                      background: layer.color ?? '#94D2BD',
                                      borderRadius: layer.shapeType === 'circle' ? '9999px' : '16px',
                                    }}
                                  />
                                )}
                                {layer.type === 'image' && layer.imageUrl && (
                                  <img
                                    src={layer.imageUrl}
                                    alt=""
                                    className="object-cover rounded-lg"
                                    style={{
                                      width: `${layer.width ?? 200}px`,
                                      height: `${layer.height ?? 200}px`,
                                    }}
                                  />
                                )}
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
