/* The component is compile-time gated to local development; hooks are never conditionally rendered at runtime. */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { HealthIllustration, PetIllustration, TravelIllustration } from '@/components/illustrations';
import Logo from '@/components/atoms/Logo';
import { MessageSquare, Download, Image as ImageIcon, Video, AlertCircle } from 'lucide-react';
import { Player, PlayerRef } from '@remotion/player';
import { ReelVisaRejection, SlideData } from '../packages/video-studio/src/compositions/ReelVisaRejection';

export const SocialGenerator: React.FC = () => {
  // Safe-guard to prevent this page from rendering/working in production
  if (!import.meta.env.DEV) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
        <p className="text-text-secondary text-sm">Este módulo de automatización de marketing solo está disponible en el entorno de desarrollo local.</p>
      </div>
    );
  }

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');

  const previewRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);

  // Structured Slide-based Storyboard State
  const [slides, setSlides] = useState<SlideData[]>([
    {
      id: 'slide_1',
      durationFrames: 150, // 5 seconds
      type: 'text_hook',
      content: {
        text: 'Si vas a pedir tu visado para España, no cometas el error de contratar un seguro de viaje común.',
        badge: 'VISA READY'
      }
    },
    {
      id: 'slide_2',
      durationFrames: 300, // 10 seconds
      type: 'provider_logos',
      content: {
        text: 'Las oficinas de Extranjería exigen pólizas emitidas por compañías autorizadas en España.'
      }
    },
    {
      id: 'slide_3',
      durationFrames: 450, // 15 seconds
      type: 'requirements_list',
      content: {
        title: 'Requisitos Obligatorios:',
        items: ['Cobertura Completa (100%)', 'Sin Copagos (0 €)', 'Repatriación Incluida']
      }
    },
    {
      id: 'slide_4',
      durationFrames: 450, // 15 seconds
      type: 'advisor_cta',
      content: {
        advisorName: 'Sofía',
        role: 'Asesora experta',
        cta: 'Escríbenos por WhatsApp si necesitas verificar tu póliza'
      }
    }
  ]);

  const [activeSlideId, setActiveSlideId] = useState('slide_1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onFrameChange = (e: { detail: { frame: number } }) => {
      setCurrentFrame(e.detail.frame);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener('frameupdate', onFrameChange);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);

    return () => {
      player.removeEventListener('frameupdate', onFrameChange);
      player.removeEventListener('play', onPlay);
      player.removeEventListener('pause', onPause);
    };
  }, [activeTab, slides]);

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
  };

  const [aspectRatio, setAspectRatio] = useState<'square' | 'story'>('square');
  const [theme, setTheme] = useState<'ocean' | 'midnight' | 'mint' | 'light'>('ocean');
  const [illustration, setIllustration] = useState<'health' | 'pet' | 'travel'>('health');
  const [badgeText, setBadgeText] = useState('VISA READY');
  const [title, setTitle] = useState('¿Buscas seguro médico para tu visado en España?');
  const [subtitle, setSubtitle] = useState('Te ayudamos a elegir la mejor opción sin copagos, sin carencias y con repatriación oficial. Compara gratis en 30 segundos.');
  const [showWhatsappCta, setShowWhatsappCta] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Background configurations
  const themeClasses = {
    ocean: 'bg-gradient-to-br from-primary via-primary-dark to-primary-dark text-white',
    midnight: 'bg-gradient-to-br from-primary-dark via-primary-dark to-primary-dark text-white',
    mint: 'bg-gradient-to-br from-brand-cyan/30 via-white to-brand-cyan/20 text-primary-dark',
    light: 'bg-gradient-to-br from-slate-50 via-white to-slate-100 text-primary-dark',
  };

  const badgeThemeClasses = {
    ocean: 'bg-white/10 text-brand-cyan border-white/20',
    midnight: 'bg-white/10 text-brand-cyan border-white/20',
    mint: 'bg-brand-cyan/20 text-primary border-brand-cyan/40',
    light: 'bg-primary/10 text-primary border-primary/20',
  };

  const handleExport = async () => {
    if (!previewRef.current) return;

    setIsExporting(true);
    setExportError(null);

    // Export dimensions
    const width = 1080;
    const height = aspectRatio === 'square' ? 1080 : 1920;

    try {
      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        skipFonts: true,
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        width,
        height,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const link = document.createElement('a');
      link.download = `vitablue_social_${aspectRatio}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      setExportError('No se pudo exportar la imagen. Inténtalo de nuevo o prueba con otro navegador.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Entorno de Desarrollo Local
          </span>
          <h1 className="text-3xl font-display font-black text-text-main mt-1">Marketing Content Studio</h1>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs text-text-secondary font-semibold">Genera activos visuales y de vídeo optimizados para conversión</p>
          <p className="text-[10px] font-bold text-slate-400">Páginas de recursos dinámicos locales</p>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-slate-200 mb-8 gap-2">
        <button
          onClick={() => setActiveTab('image')}
          className={`flex items-center gap-2 py-3.5 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'image'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-main hover:border-slate-300'
          }`}
        >
          <ImageIcon size={16} />
          <span>Generador de Imágenes</span>
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 py-3.5 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'video'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-secondary hover:text-text-main hover:border-slate-300'
          }`}
        >
          <Video size={16} />
          <span>Generador de Video</span>
          <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Próximamente
          </span>
        </button>
      </div>

      {activeTab === 'image' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Controls */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-text-main border-b border-slate-100 pb-3">Parámetros del Post</h2>

            {/* Ratio Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Formato / Relación de Aspecto</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAspectRatio('square')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === 'square'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  Cuadrado 1:1 (Post Feed)
                </button>
                <button
                  onClick={() => setAspectRatio('story')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === 'story'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                  }`}
                >
                  Vertical 9:16 (Story/TikTok)
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Paleta de Colores (Fondo)</label>
              <div className="grid grid-cols-2 gap-2">
                {(['ocean', 'midnight', 'mint', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                      theme === t
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {t === 'ocean' && 'Ocean Blue'}
                    {t === 'midnight' && 'Midnight Dark'}
                    {t === 'mint' && 'Mint Green'}
                    {t === 'light' && 'Light Light'}
                  </button>
                ))}
              </div>
            </div>

            {/* Illustration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Ilustración Vectorial</label>
              <div className="grid grid-cols-3 gap-2">
                {(['health', 'pet', 'travel'] as const).map((i) => (
                  <button
                    key={i}
                    onClick={() => setIllustration(i)}
                    className={`py-2 px-1.5 rounded-xl border text-[11px] font-semibold capitalize transition-all cursor-pointer ${
                      illustration === i
                        ? 'border-primary bg-primary/5 text-primary font-bold'
                        : 'border-slate-200 bg-white text-text-secondary hover:bg-slate-50'
                    }`}
                  >
                    {i === 'health' && 'Salud'}
                    {i === 'pet' && 'Mascotas'}
                    {i === 'travel' && 'Viajes'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Text Inputs */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Etiqueta Superior (Badge)</label>
                <input
                  type="text"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value.toUpperCase())}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary bg-white"
                  placeholder="VISA READY"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Título del Post</label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary resize-none bg-white"
                  placeholder="Escribe el título..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Subtítulo / Mensaje descriptivo</label>
                <textarea
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary resize-none bg-white"
                  placeholder="Escribe el mensaje..."
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider cursor-pointer" htmlFor="toggle-wa">
                  Mostrar botón WhatsApp
                </label>
                <input
                  id="toggle-wa"
                  type="checkbox"
                  checked={showWhatsappCta}
                  onChange={(e) => setShowWhatsappCta(e.target.checked)}
                  className="w-4 h-4 text-primary focus:ring-primary border-slate-300 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full py-3.5 px-5 rounded-2xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
            >
              <Download className="w-5 h-5" />
              {isExporting ? 'Exportando PNG...' : 'Descargar Imagen PNG'}
            </button>

            {exportError && (
              <p className="text-sm text-red-600 font-medium">{exportError}</p>
            )}
          </div>

          {/* Right column: Preview container */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-50 border border-slate-200/50 rounded-3xl p-8 min-h-[600px] relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">
              Vista Previa Escala (Lienzo Final Real de Exportación a Alta Calidad)
            </div>

            {/* Scaled Preview Frame */}
            <div
              className="border border-slate-300 shadow-xl overflow-hidden shrink-0 relative"
              style={{
                width: '1080px',
                height: aspectRatio === 'square' ? '1080px' : '1920px',
                transform: aspectRatio === 'square' ? 'scale(0.42)' : 'scale(0.28)',
                transformOrigin: 'center center',
                margin: aspectRatio === 'square' ? '-150px 0' : '-350px 0',
              }}
            >
              {/* The element to be captured */}
              <div
                ref={previewRef}
                className={`w-full h-full p-16 flex flex-col justify-between select-none relative ${themeClasses[theme]}`}
                style={{
                  width: '1080px',
                  height: aspectRatio === 'square' ? '1080px' : '1920px',
                }}
              >
                {/* Decorative background grid/bubble elements matching styleguide */}
                <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
                <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-brand-cyan/5 pointer-events-none blur-3xl"></div>

                {/* Upper Section: Logo and Badges */}
                <div className="flex items-center justify-between w-full relative z-10">
                  <Logo
                    iconSize={64}
                    variant={theme === 'mint' || theme === 'light' ? 'default' : 'colored-on-dark'}
                    orientation="horizontal"
                    disableTransition={true}
                  />

                  {badgeText && (
                    <span className={`px-6 py-2.5 rounded-full border text-[18px] font-black uppercase tracking-[0.2em] select-none ${badgeThemeClasses[theme]}`}>
                      {badgeText}
                    </span>
                  )}
                </div>

                {/* Center Section: Core layout */}
                <div className="flex flex-col gap-12 w-full relative z-10">
                  {/* Illustration container */}
                  <div className="w-[320px] h-[240px] flex items-center justify-start text-primary">
                    {illustration === 'health' && <HealthIllustration />}
                    {illustration === 'pet' && <PetIllustration />}
                    {illustration === 'travel' && <TravelIllustration />}
                  </div>

                  <div className="space-y-6 text-left">
                    <h2 className="text-[52px] font-display font-black leading-tight tracking-tight max-w-[900px]">
                      {title}
                    </h2>
                    <p className={`text-[26px] leading-relaxed font-semibold max-w-[850px] ${
                      theme === 'mint' || theme === 'light' ? 'text-text-secondary' : 'text-slate-300'
                    }`}>
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Lower Section: Action info and Footer */}
                <div className="flex items-end justify-between w-full pt-10 border-t border-white/10 relative z-10">
                  <div className="flex flex-col gap-1.5 text-left">
                    <span className={`text-[13px] font-black uppercase tracking-[0.25em] ${
                      theme === 'mint' || theme === 'light' ? 'text-primary' : 'text-brand-cyan'
                    }`}>
                      Asesoría de Seguros Independiente
                    </span>
                    <span className={`text-[20px] font-bold ${
                      theme === 'mint' || theme === 'light' ? 'text-text-main' : 'text-white'
                    }`}>
                      www.vitablue.es
                    </span>
                  </div>

                  {showWhatsappCta && (
                    <div className="flex items-center gap-4 bg-whatsapp text-white px-7 py-4 rounded-[1.5rem] shadow-lg shadow-whatsapp/10 text-[20px] font-bold cursor-pointer">
                      <MessageSquare className="w-6 h-6 fill-white" />
                      <span>Consultar WhatsApp</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Slide Storyboard Editor */}
          <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6 text-left">
            <div>
              <h2 className="text-lg font-bold text-text-main">Storyboard de Escenas</h2>
              <p className="text-xs text-text-secondary mt-1">Organiza y edita los bloques secuenciales de tu video.</p>
            </div>

            {/* Slides Timeline list */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Escenas del Video</label>
              <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setActiveSlideId(slide.id);
                      if (playerRef.current) {
                        // Calculate start frame of this slide
                        const startFrame = slides
                          .slice(0, idx)
                          .reduce((sum, s) => sum + s.durationFrames, 0);
                        playerRef.current.seekTo(startFrame);
                        setCurrentFrame(startFrame);
                      }
                    }}
                    className={`flex w-full items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      activeSlideId === slide.id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 hover:border-slate-200 text-text-secondary bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="capitalize">{slide.type.replace('_', ' ')}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{(slide.durationFrames / 30).toFixed(0)}s</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Slide Editor Form */}
            {(() => {
              const activeSlide = slides.find(s => s.id === activeSlideId);
              if (!activeSlide) return null;

              const handleSlideContentChange = (key: string, val: any) => {
                setSlides(prev => prev.map(s => {
                  if (s.id === activeSlideId) {
                    return {
                      ...s,
                      content: {
                        ...s.content,
                        [key]: val
                      }
                    };
                  }
                  return s;
                }));
              };

              return (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-primary tracking-wider">Editar Escena Activa</span>
                    <span className="text-[10px] font-mono text-slate-400">{activeSlide.id.toUpperCase()}</span>
                  </div>

                  {/* Slide Type Selection */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Plantilla Visual</label>
                    <select
                      value={activeSlide.type}
                      onChange={(e) => {
                        setSlides(prev => prev.map(s => {
                          if (s.id === activeSlideId) {
                            return { ...s, type: e.target.value, content: {} };
                          }
                          return s;
                        }));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-none focus:border-primary"
                    >
                      <option value="text_hook">Gancho de Texto (Hook)</option>
                      <option value="provider_logos">Logos de Aseguradoras</option>
                      <option value="requirements_list">Lista de Requisitos</option>
                      <option value="advisor_cta">Llamado a la Acción (Asesor)</option>
                    </select>
                  </div>

                  {/* Context dynamic fields */}
                  {activeSlide.type === 'text_hook' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Etiqueta (Badge)</label>
                        <input
                          type="text"
                          value={activeSlide.content.badge || ''}
                          onChange={(e) => handleSlideContentChange('badge', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="VISA READY"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Texto Principal</label>
                        <textarea
                          value={activeSlide.content.text || ''}
                          onChange={(e) => handleSlideContentChange('text', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white resize-none"
                          placeholder="Introduce el texto del gancho..."
                        />
                      </div>
                    </div>
                  )}

                  {activeSlide.type === 'provider_logos' && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Texto Explicativo</label>
                      <textarea
                        value={activeSlide.content.text || ''}
                        onChange={(e) => handleSlideContentChange('text', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white resize-none"
                        placeholder="Texto para acompañar logos de aseguradoras..."
                      />
                    </div>
                  )}

                  {activeSlide.type === 'requirements_list' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Título de Sección</label>
                        <input
                          type="text"
                          value={activeSlide.content.title || ''}
                          onChange={(e) => handleSlideContentChange('title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Requisitos Obligatorios"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Requisitos (separados por comas)</label>
                        <textarea
                          value={activeSlide.content.items ? activeSlide.content.items.join(', ') : ''}
                          onChange={(e) => handleSlideContentChange('items', e.target.value.split(',').map(s => s.trim()))}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white resize-none"
                          placeholder="Requisito 1, Requisito 2, Requisito 3..."
                        />
                      </div>
                    </div>
                  )}

                  {activeSlide.type === 'advisor_cta' && (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Nombre Asesor</label>
                        <input
                          type="text"
                          value={activeSlide.content.advisorName || ''}
                          onChange={(e) => handleSlideContentChange('advisorName', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Sofía"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Texto del Botón CTA</label>
                        <input
                          type="text"
                          value={activeSlide.content.cta || ''}
                          onChange={(e) => handleSlideContentChange('cta', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                          placeholder="Consultar WhatsApp"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="bg-[#EBF7F4]/50 border border-[#94D2BD]/20 rounded-2xl p-4 flex gap-3 text-left">
              <AlertCircle className="text-primary shrink-0 w-5 h-5 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-text-main">Renderizado Local</p>
                <p className="text-[11px] text-text-secondary mt-1">
                  Usa <code>npm run render</code> dentro de <code>packages/video-studio</code> para compilar a MP4 en tu sistema local.
                </p>
              </div>
            </div>
          </div>

          {/* Right column: Remotion Player Visor */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-slate-50 border border-slate-200/50 rounded-3xl p-8 min-h-[600px] relative overflow-hidden">
            <div className="absolute top-4 left-4 text-xs font-bold text-slate-400">
              Previsualización interactiva de Remotion (Lienzo 9:16)
            </div>

            {/* Remotion Player element wrapper */}
            <div className="flex flex-col items-center gap-6">
              <div className="shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-black mt-8" style={{ width: '360px', height: '640px' }}>
                <Player
                  ref={playerRef}
                  component={ReelVisaRejection}
                  inputProps={{
                    slides: slides
                  }}
                  durationInFrames={1800}
                  fps={30}
                  compositionWidth={1080}
                  compositionHeight={1920}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  controls={false}
                />
              </div>

              {/* Custom External Controls & Timeline Scrubber */}
              <div className="w-full max-w-[360px] bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-4 text-left">
                {/* Timeline Scrubber & Timestamp */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 font-mono">
                    <span>
                      {(() => {
                        const currentSecs = Math.floor(currentFrame / 30);
                        const mins = String(Math.floor(currentSecs / 60)).padStart(2, '0');
                        const secs = String(currentSecs % 60).padStart(2, '0');
                        return `${mins}:${secs}`;
                      })()}
                    </span>
                    <span>01:00</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1800}
                    value={currentFrame}
                    onChange={(e) => {
                      if (playerRef.current) {
                        playerRef.current.seekTo(Number(e.target.value));
                        setCurrentFrame(Number(e.target.value));
                      }
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs cursor-pointer transition-all active:scale-[0.98]"
                    >
                      {isPlaying ? 'Pausar' : 'Reproducir'}
                    </button>
                    <button
                      onClick={handleRestart}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-all active:scale-[0.98] border border-slate-200"
                    >
                      Reiniciar
                    </button>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">30 FPS · 1800 frames</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialGenerator;
