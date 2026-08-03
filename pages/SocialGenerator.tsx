import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { HealthIllustration, PetIllustration, TravelIllustration } from '@/components/illustrations';
import Logo from '@/components/atoms/Logo';
import { ShieldCheck, MessageSquare, ArrowRight, Download, Image as ImageIcon } from 'lucide-react';

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

  const previewRef = useRef<HTMLDivElement>(null);
  const [aspectRatio, setAspectRatio] = useState<'square' | 'story'>('square');
  const [theme, setTheme] = useState<'ocean' | 'midnight' | 'mint' | 'light'>('ocean');
  const [illustration, setIllustration] = useState<'health' | 'pet' | 'travel'>('health');
  const [badgeText, setBadgeText] = useState('VISA READY');
  const [title, setTitle] = useState('¿Buscas seguro médico para tu visado en España?');
  const [subtitle, setSubtitle] = useState('Te ayudamos a elegir la mejor opción sin copagos, sin carencias y con repatriación oficial. Compara gratis en 30 segundos.');
  const [showWhatsappCta, setShowWhatsappCta] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  // Background configurations
  const themeClasses = {
    ocean: 'bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] text-white',
    midnight: 'bg-gradient-to-br from-[#001219] via-[#011c26] to-[#002430] text-white',
    mint: 'bg-gradient-to-br from-[#EBF7F4] via-white to-[#E6F7F8] text-[#001219]',
    light: 'bg-gradient-to-br from-[#F8F9FA] via-white to-[#F0F4F6] text-[#001219]',
  };

  const badgeThemeClasses = {
    ocean: 'bg-white/10 text-[#94D2BD] border-white/20',
    midnight: 'bg-white/10 text-[#94D2BD] border-white/20',
    mint: 'bg-[#94D2BD]/20 text-[#005F73] border-[#94D2BD]/40',
    light: 'bg-[#005F73]/10 text-[#005F73] border-[#005F73]/20',
  };

  const handleExport = () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    // Export dimensions
    const width = 1080;
    const height = aspectRatio === 'square' ? 1080 : 1920;

    toPng(previewRef.current, {
      cacheBust: true,
      width: width,
      height: height,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
        width: `${width}px`,
        height: `${height}px`,
      }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `vitablue_social_${aspectRatio}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
        setIsExporting(false);
      })
      .catch((err) => {
        console.error('Error generating image:', err);
        setIsExporting(false);
      });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Entorno de Desarrollo Local
          </span>
          <h1 className="text-3xl font-display font-black text-text-main mt-1">Generador de Contenido de Marca</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-secondary font-semibold">Crea imágenes premium para redes al instante</p>
          <p className="text-[10px] font-bold text-slate-400">Píxeles exactos de exportación: 1080x1080 / 1080x1920</p>
        </div>
      </div>

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
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary"
                placeholder="VISA READY"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Título del Post</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary resize-none"
                placeholder="Escribe el título..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Subtítulo / Mensaje descriptivo</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={4}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-text-main focus:outline-none focus:border-primary resize-none"
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
            className="w-full py-3.5 px-5 rounded-2xl bg-primary hover:bg-[#004f5e] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Download className="w-5 h-5" />
            {isExporting ? 'Exportando PNG...' : 'Descargar Imagen PNG'}
          </button>
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
              <div className="absolute bottom-[-100px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#94D2BD]/5 pointer-events-none blur-3xl"></div>

              {/* Upper Section: Logo and Badges */}
              <div className="flex items-center justify-between w-full relative z-10">
                <Logo
                  iconSize={64}
                  variant={theme === 'mint' || theme === 'light' ? 'default' : 'colored-on-dark'}
                  orientation="horizontal"
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
                    theme === 'mint' || theme === 'light' ? 'text-[#005F73]' : 'text-[#94D2BD]'
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
                  <div className="flex items-center gap-4 bg-[#25D366] text-white px-7 py-4 rounded-[1.5rem] shadow-lg shadow-[#25D366]/10 text-[20px] font-bold cursor-pointer">
                    <MessageSquare className="w-6 h-6 fill-white" />
                    <span>Consultar WhatsApp</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialGenerator;
