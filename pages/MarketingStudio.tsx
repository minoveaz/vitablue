import React, { useRef, useState } from 'react';
import { generateProfileSvg, generateCoverSvg, downloadSvgAsPng } from '@/utils/svgGenerator';
import {
  Check,
  Download,
  Facebook,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  Palette,
  Sparkles,
  Type,
  Youtube,
  Music2,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '@/components/atoms/Logo';
import SocialGenerator from '@/pages/SocialGenerator';
import { getSocialProfiles, saveSocialProfiles, SocialPlatformId, SocialProfiles, extractSocialUser, socialProfilesUpdatedEvent } from '@/utils/socialProfiles';

type StudioSection = 'identity' | 'profiles' | 'content';
type PlatformId = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin';
type SocialAssetType = 'profile' | 'cover';

interface PlatformConfig {
  id: PlatformId;
  name: string;
  recommendedSize: string;
  profileSize: { width: number; height: number };
  coverSize?: { width: number; height: number };
  icon: React.ReactNode;
  accent: string;
}

const platforms: PlatformConfig[] = [
  { id: 'facebook', name: 'Facebook', recommendedSize: '180 × 180 px', profileSize: { width: 180, height: 180 }, coverSize: { width: 820, height: 312 }, icon: <Facebook size={20} />, accent: '#1877F2' },
  { id: 'instagram', name: 'Instagram', recommendedSize: '320 × 320 px', profileSize: { width: 320, height: 320 }, icon: <Instagram size={20} />, accent: '#D946EF' },
  { id: 'tiktok', name: 'TikTok', recommendedSize: '200 × 200 px', profileSize: { width: 200, height: 200 }, icon: <Music2 size={20} />, accent: '#111827' },
  { id: 'youtube', name: 'YouTube', recommendedSize: '800 × 800 px', profileSize: { width: 800, height: 800 }, coverSize: { width: 2560, height: 1440 }, icon: <Youtube size={20} />, accent: '#FF0033' },
  { id: 'linkedin', name: 'LinkedIn', recommendedSize: '300 × 300 px', profileSize: { width: 300, height: 300 }, coverSize: { width: 1584, height: 396 }, icon: <Linkedin size={20} />, accent: '#0A66C2' },
];

const colorTokens = [
  { name: 'Ocean Blue', value: '#005F73', className: 'bg-[#005F73]' },
  { name: 'Midnight', value: '#001219', className: 'bg-[#001219]' },
  { name: 'Mint', value: '#94D2BD', className: 'bg-[#94D2BD]' },
  { name: 'Amber', value: '#EE9B00', className: 'bg-[#EE9B00]' },
];

const formatDimensions = (dimensions: { width: number; height: number }) => `${dimensions.width} × ${dimensions.height} px`;

const MarketingStudio: React.FC = () => {
  const { pathname } = useLocation();
  
  let section: StudioSection = 'identity';
  if (pathname.includes('/perfiles-sociales')) {
    section = 'profiles';
  } else if (pathname.includes('/generador-contenido')) {
    section = 'content';
  }
  const [activePlatform, setActivePlatform] = useState<PlatformId>('instagram');
  const [mockupTheme, setMockupTheme] = useState<'light' | 'dark'>('light');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfiles>(getSocialProfiles);
  const [useDarkBackground, setUseDarkBackground] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const selectedPlatform = platforms.find((platform) => platform.id === activePlatform) ?? platforms[0];
  const selectedProfile = socialProfiles[activePlatform];
  const hasCover = Boolean(selectedPlatform.coverSize);
  
  const coverDimensions = selectedPlatform.coverSize ?? { width: 1640, height: 624 };
  const coverLogoSize = coverDimensions.width >= 2000 ? 220 : 150;
  const coverTitleSize = coverDimensions.width >= 2000 ? 96 : 64;
  const coverSubtitleSize = coverDimensions.width >= 2000 ? 48 : 32;

  React.useEffect(() => {
    const handleProfilesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SocialProfiles>;
      setSocialProfiles(customEvent.detail ?? getSocialProfiles());
    };

    window.addEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);
    return () => window.removeEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);
  }, []);

  const handleSocialUrlChange = (platform: SocialPlatformId, url: string) => {
    const nextProfiles = {
      ...socialProfiles,
      [platform]: {
        ...socialProfiles[platform],
        url,
        user: extractSocialUser(url, platform),
      },
    };
    setSocialProfiles(nextProfiles);
    saveSocialProfiles(nextProfiles);
  };

  const handleSocialExport = async (type: SocialAssetType) => {
    setIsExporting(true);
    setExportMessage(null);

    try {
      const filename = `vitablue_${activePlatform}_${type}_${Date.now()}.png`;

      if (type === 'profile') {
        const svgString = generateProfileSvg(useDarkBackground);
        await downloadSvgAsPng(svgString, 800, 800, filename);
      } else {
        if (!selectedPlatform.coverSize) return;
        const { width, height } = selectedPlatform.coverSize;
        const svgString = generateCoverSvg(width, height, coverLogoSize, coverTitleSize, coverSubtitleSize);
        await downloadSvgAsPng(svgString, width, height, filename);
      }

      setExportMessage(`${type === 'cover' ? 'Portada' : 'Foto de perfil'} descargada en alta resolución.`);
    } catch (error) {
      console.error('Error generating asset image:', error);
      setExportMessage('No se pudo descargar la imagen. Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-[#001219]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-5">
            <Logo iconSize={42} showTagline={false} />
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#005F73]">Local workspace</p>
              <h1 className="font-display text-xl font-black tracking-tight sm:text-2xl">Marketing Studio</h1>
            </div>
          </div>
          <Link to="/" className="text-sm font-bold text-slate-500 transition-colors hover:text-[#005F73]">Salir al sitio <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#005F73]"><Sparkles size={15} /> Centro de marca</div>
            <h2 className="font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">Todo lo que VitaBlue necesita para expresarse.</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">Un espacio de trabajo privado para preparar activos de marca, mantener consistencia visual y crear contenido listo para publicar.</p>
          </div>
          <div className="rounded-2xl border border-[#94D2BD]/50 bg-[#EBF7F4] px-4 py-3 text-xs font-semibold text-[#005F73]">Solo disponible en desarrollo local</div>
        </div>

        <nav className="mb-8 flex gap-1 overflow-x-auto border-b border-slate-200" aria-label="Secciones de Marketing Studio">
          <Link to="/marketing-studio/identidad-de-marca" className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'identity' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><Palette size={17} /> Identidad de marca</Link>
          <Link to="/marketing-studio/perfiles-sociales" className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'profiles' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><ImageIcon size={17} /> Perfiles sociales</Link>
          <Link to="/marketing-studio/generador-contenido" className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'content' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><Sparkles size={17} /> Generador de contenido</Link>
        </nav>

        {section === 'identity' ? (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8"><p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#005F73]">Brand board</p><h3 className="font-display text-2xl font-black">Sistema visual VitaBlue</h3></div>
              <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
                <div>
                  <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">Logotipos disponibles</p>
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><Logo iconSize={48} showTagline={false} /></div>
                    <div className="rounded-2xl bg-[#001219] p-5"><Logo iconSize={48} showTagline={false} variant="colored-on-dark" /></div>
                    <div className="rounded-2xl bg-[#005F73] p-5"><Logo iconSize={48} showTagline={false} variant="white" /></div>
                  </div>
                </div>
                <div>
                  <p className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">Paleta oficial</p>
                  <div className="grid grid-cols-2 gap-3">
                    {colorTokens.map((token) => <div key={token.name} className="overflow-hidden rounded-2xl border border-slate-100"><div className={`h-20 ${token.className}`} /><div className="p-3"><p className="text-xs font-bold text-slate-700">{token.name}</p><p className="mt-1 font-mono text-[10px] text-slate-400">{token.value}</p></div></div>)}
                  </div>
                  <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f4f7f8] p-4"><Type className="mt-0.5 text-[#005F73]" size={19} /><div><p className="text-sm font-bold">Tipografía</p><p className="mt-1 text-xs leading-relaxed text-slate-500">Poppins para titulares y navegación. Inter para textos funcionales y lectura.</p></div></div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#001219] p-7 text-white shadow-sm sm:p-9">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#94D2BD]">Dirección creativa</p>
              <h3 className="font-display text-3xl font-black leading-tight">Clara, humana y preparada para avanzar.</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">La identidad combina confianza aseguradora con una energía digital accesible. Cada activo debe sentirse útil antes que decorativo.</p>
              <div className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm">
                {['Usar el logo con espacio de protección generoso.', 'Priorizar Ocean Blue para acciones y puntos de orientación.', 'Reservar Amber Gold para llamadas de atención.', 'Mantener mensajes breves y fáciles de escanear.'].map((rule) => <div key={rule} className="flex gap-3"><Check className="shrink-0 text-[#94D2BD]" size={17} /><span className="text-slate-300">{rule}</span></div>)}
              </div>
            </section>
          </div>
        ) : section === 'profiles' ? (
          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left Column: Asset Builder Controls */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#005F73]">Asset builder</p>
                <h3 className="font-display text-2xl font-black">Activos sociales</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Configura y descarga los activos vectoriales de marca a resoluciones ultra altas.</p>
              </div>

              {/* Platform Selector buttons */}
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Seleccionar plataforma</p>
                <div className="space-y-1.5">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => {
                        setActivePlatform(platform.id);
                        setExportMessage(null);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-all cursor-pointer ${
                        activePlatform === platform.id
                          ? 'border-[#005F73] bg-[#EBF7F4]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span style={{ color: platform.accent }}>{platform.icon}</span>
                        <span>
                          <span className="block text-sm font-bold text-slate-800">{platform.name}</span>
                          <span className="block text-[10px] text-slate-400">
                            Perfil: {formatDimensions(platform.profileSize)}
                            {platform.coverSize && ` | Portada: ${formatDimensions(platform.coverSize)}`}
                          </span>
                        </span>
                      </span>
                      {activePlatform === platform.id && <Check size={16} className="text-[#005F73]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuration parameters */}
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  URL oficial de {selectedPlatform.name}
                  <input
                    type="url"
                    value={selectedProfile.url}
                    onChange={(event) => handleSocialUrlChange(activePlatform, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#005F73]"
                    placeholder={`https://${activePlatform}.com/...`}
                  />
                </label>

                <div className="rounded-xl bg-[#EBF7F4] px-3.5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#005F73]">Usuario detectado</p>
                  <p className="mt-0.5 text-sm font-bold text-[#001219]">{selectedProfile.user || 'Añade una URL para detectarlo'}</p>
                </div>

                {/* Profile Photo Export Background Options */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Estilo de descarga (Perfil)</p>
                  <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-bold text-slate-700">
                    <span>Fondo oscuro (Midnight)</span>
                    <input
                      type="checkbox"
                      checked={useDarkBackground}
                      onChange={(event) => setUseDarkBackground(event.target.checked)}
                      className="h-4 w-4 accent-[#005F73] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* High Resolution Asset Download Panel */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Descargar en Alta Definición (PNG)</p>
                
                <button
                  onClick={() => handleSocialExport('profile')}
                  disabled={isExporting}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 hover:border-[#005F73] hover:bg-[#005F73]/5 transition-all text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  <div>
                    <span className="block text-xs font-bold text-slate-800">Foto de Perfil</span>
                    <span className="block text-[10px] text-slate-400">Alta resolución: 800 × 800 px</span>
                  </div>
                  <Download size={18} className="text-[#005F73]" />
                </button>

                {hasCover && (
                  <button
                    onClick={() => handleSocialExport('cover')}
                    disabled={isExporting}
                    className="w-full flex items-center justify-between rounded-2xl border border-slate-200 p-3.5 hover:border-[#005F73] hover:bg-[#005F73]/5 transition-all text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div>
                      <span className="block text-xs font-bold text-slate-800">Portada / Banner</span>
                      <span className="block text-[10px] text-slate-400">
                        Resolución retina: {formatDimensions(selectedPlatform.coverSize!)}
                      </span>
                    </div>
                    <Download size={18} className="text-[#005F73]" />
                  </button>
                )}
              </div>

              {exportMessage && (
                <p className="text-center text-xs font-semibold text-[#005F73] bg-[#EBF7F4] py-2 rounded-xl border border-[#94D2BD]/30 animate-pulse">
                  {exportMessage}
                </p>
              )}
            </section>

            {/* Right Column: Visual Mockup Previews */}
            <section className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#e8edef] p-6 shadow-sm sm:p-8">
              
              {/* Mockup Header: Toggle theme */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Vista previa contextual real</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-700">Canal: {selectedPlatform.name}</p>
                </div>
                
                {/* Mockup Light/Dark mode switcher */}
                <div className="flex items-center gap-1.5 bg-slate-300/50 p-1 rounded-xl">
                  <button
                    onClick={() => setMockupTheme('light')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mockupTheme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Modo Claro
                  </button>
                  <button
                    onClick={() => setMockupTheme('dark')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      mockupTheme === 'dark' ? 'bg-[#0f0f0f] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Modo Oscuro
                  </button>
                </div>
              </div>

              {/* Realistic mockup canvas */}
              <div className={`w-full max-w-[540px] mx-auto overflow-hidden rounded-2xl border transition-colors shadow-2xl ${
                mockupTheme === 'dark' ? 'border-[#3e4042] bg-[#18191A]' : 'border-slate-200 bg-white'
              }`}>
                {/* Simulated browser/network top info bar */}
                <div className={`flex items-center gap-2 border-b px-4 py-2.5 text-[11px] font-bold tracking-wide select-none ${
                  mockupTheme === 'dark' ? 'border-white/10 text-white/50 bg-[#242526]' : 'border-slate-100 text-slate-400 bg-slate-50'
                }`}>
                  <span style={{ color: selectedPlatform.accent }}>{selectedPlatform.icon}</span>
                  <span>Previsualización de Perfil Oficial en {selectedPlatform.name}</span>
                </div>

                {/* Platform specific mockup renders */}
                <div className="p-0">
                  {/* FACEBOOK MOCKUP */}
                  {activePlatform === 'facebook' && (
                    <div className="relative">
                      {/* Banner */}
                      <div className="w-full aspect-[2.63/1] bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] relative overflow-hidden">
                        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#94D2BD]/20 blur-xl" />
                        <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-[#94D2BD]/10 blur-xl" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 select-none">
                          <Logo iconSize={40} showText={false} showTagline={false} variant="colored-on-dark" />
                          <p className="mt-2.5 font-display font-black text-white text-lg leading-none">VitaBlue</p>
                          <p className="mt-1.5 font-semibold text-[#94D2BD] text-[10px] leading-tight max-w-[220px]">
                            Protección que se adapta a tu vida
                          </p>
                        </div>
                      </div>

                      {/* Avatar container */}
                      <div className="px-6 pb-6 pt-16 relative">
                        <div 
                          className={`absolute left-6 top-[-36px] rounded-full border-[4px] w-20 h-20 shadow-md overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-[#18191A]' : 'border-white'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={40} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        {/* Name and actions */}
                        <div className="text-left space-y-1">
                          <h4 className={`text-xl font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            {selectedProfile.user || 'Página · Correduría de seguros'}
                          </p>
                          <div className="flex gap-2 pt-3">
                            <button className="px-4 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold shadow-sm">
                              Enviar mensaje
                            </button>
                            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold ${
                              mockupTheme === 'dark' ? 'bg-[#3A3B3C] text-white hover:bg-[#4E4F50]' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}>
                              Te gusta
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LINKEDIN MOCKUP */}
                  {activePlatform === 'linkedin' && (
                    <div className="relative text-left">
                      {/* Cover */}
                      <div className="w-full aspect-[4/1] bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] relative overflow-hidden">
                        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#94D2BD]/20 blur-xl" />
                        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-[#94D2BD]/10 blur-xl" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 select-none">
                          <Logo iconSize={36} showText={false} showTagline={false} variant="colored-on-dark" />
                          <p className="mt-1 font-display font-black text-white text-base leading-none">VitaBlue</p>
                          <p className="mt-0.5 font-semibold text-[#94D2BD] text-[9px] leading-tight max-w-[200px]">
                            Protección que se adapta a tu vida
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-6 pb-6 pt-16 relative">
                        {/* Avatar */}
                        <div 
                          className={`absolute left-6 top-[-44px] rounded-full border-[4px] w-22 h-22 shadow-md overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-[#18191A]' : 'border-white'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={44} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        {/* LinkedIn Company Bio Details */}
                        <div className="space-y-1">
                          <h4 className={`text-xl font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className={`text-xs font-semibold ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Asesoría de Seguros Independiente y Gratuita en España
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Servicios financieros · Madrid, Comunidad de Madrid · 1,240 seguidores
                          </p>
                          <div className="flex gap-2 pt-4">
                            <button className="px-4 py-1.5 rounded-full bg-[#0A66C2] text-white text-xs font-bold shadow-sm">
                              + Seguir
                            </button>
                            <button className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                              mockupTheme === 'dark' ? 'border-white/20 text-[#0A66C2] hover:bg-white/5' : 'border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2]/5'
                            }`}>
                              Visitar sitio web
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* YOUTUBE MOCKUP */}
                  {activePlatform === 'youtube' && (
                    <div className="relative text-left">
                      {/* YouTube Slim Banner */}
                      <div className="w-full aspect-[6/1] bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] relative overflow-hidden">
                        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#94D2BD]/20 blur-xl" />
                        <div className="absolute -bottom-28 -left-20 h-48 w-48 rounded-full bg-[#94D2BD]/10 blur-xl" />
                        <div className="relative z-10 flex items-center justify-between h-full px-12 select-none">
                          <div className="flex items-center gap-4">
                            <Logo iconSize={40} showText={false} showTagline={false} variant="colored-on-dark" />
                            <div className="text-left">
                              <p className="font-display font-black text-white text-lg leading-none">VitaBlue</p>
                              <p className="mt-1 font-semibold text-[#94D2BD] text-[10px] leading-tight">
                                Protección que se adapta a tu vida
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* YouTube Profile Details Row */}
                      <div className="p-6 flex gap-4 items-start">
                        {/* Circular Avatar */}
                        <div 
                          className={`rounded-full border w-16 h-16 shrink-0 overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-white/10' : 'border-slate-100'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={36} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        {/* Title and stats */}
                        <div className="space-y-1.5">
                          <h4 className={`text-xl font-bold font-display leading-tight ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className="text-xs text-slate-400 font-semibold">
                            {selectedProfile.user || '@VitaBlue-seguros'} · 10.4K suscriptores · 78 vídeos
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 max-w-[340px]">
                            El comparador independiente de seguros de salud, viaje y asistencia en España...
                          </p>
                          <button className={`mt-2.5 px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                            mockupTheme === 'dark' ? 'bg-white text-black hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}>
                            Suscribirse
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INSTAGRAM MOCKUP */}
                  {activePlatform === 'instagram' && (
                    <div className="p-6 text-left">
                      {/* Grid Header Info */}
                      <div className="flex items-center justify-between gap-6 pb-6 border-b border-white/5">
                        {/* Circular Avatar with Instagram story gradient */}
                        <div className="rounded-full bg-gradient-to-tr from-[#EE9B00] via-[#D946EF] to-[#005F73] p-[2.5px] select-none shadow-sm">
                          <div className="rounded-full bg-white p-[2px]">
                            <div 
                              className={`rounded-full border w-16 h-16 overflow-hidden flex items-center justify-center ${
                                useDarkBackground ? 'bg-[#001219]' : 'bg-white'
                              }`}
                            >
                              <Logo iconSize={34} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                            </div>
                          </div>
                        </div>

                        {/* Statistics count */}
                        <div className="flex gap-6 pr-4">
                          <div className="text-center">
                            <span className={`block text-sm font-black ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>24</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Posts</span>
                          </div>
                          <div className="text-center">
                            <span className={`block text-sm font-black ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>1.5K</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Seguidores</span>
                          </div>
                          <div className="text-center">
                            <span className={`block text-sm font-black ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>110</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Seguidos</span>
                          </div>
                        </div>
                      </div>

                      {/* Bio Details */}
                      <div className="pt-4 space-y-1 text-xs">
                        <h4 className={`text-sm font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          VitaBlue
                        </h4>
                        <p className="text-[11px] text-slate-400 font-semibold">Correduría de seguros</p>
                        <p className={`${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'} leading-relaxed max-w-[420px]`}>
                          Comparador independiente de seguros en España. Sin spam y 100% gratuito. Hablamos en idioma humano. 💬 Asistencia en vivo 👇
                        </p>
                        <a href="https://www.vitablue.es" target="_blank" rel="noreferrer" className="block text-[#005F73] font-bold pt-1 hover:underline">
                          linktr.ee/vitablue
                        </a>
                        
                        <div className="grid grid-cols-3 gap-2 pt-4">
                          <button className={`py-1.5 rounded-lg text-[11px] font-bold text-center ${
                            mockupTheme === 'dark' ? 'bg-[#363636] text-white' : 'bg-slate-100 text-slate-800'
                          }`}>
                            Seguir
                          </button>
                          <button className={`py-1.5 rounded-lg text-[11px] font-bold text-center ${
                            mockupTheme === 'dark' ? 'bg-[#363636] text-white' : 'bg-slate-100 text-slate-800'
                          }`}>
                            Mensaje
                          </button>
                          <button className={`py-1.5 rounded-lg text-[11px] font-bold text-center ${
                            mockupTheme === 'dark' ? 'bg-[#363636] text-white' : 'bg-slate-100 text-slate-800'
                          }`}>
                            Contacto
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TIKTOK MOCKUP */}
                  {activePlatform === 'tiktok' && (
                    <div className="p-6 text-center space-y-4">
                      {/* Avatar Centered */}
                      <div className="flex flex-col items-center select-none">
                        <div 
                          className={`rounded-full border-2 w-20 h-20 overflow-hidden shadow-md flex items-center justify-center ${
                            mockupTheme === 'dark' ? 'border-[#3e4042]' : 'border-slate-100'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={42} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>
                        
                        <h4 className={`text-lg font-bold font-display mt-3 leading-none ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          VitaBlue
                        </h4>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                          {selectedProfile.user || '@vitablueseguros'}
                        </p>
                        
                        <button className="mt-3.5 px-8 py-1.5 rounded bg-[#FE2C55] text-white text-xs font-bold shadow-sm">
                          Seguir
                        </button>
                      </div>

                      {/* Statistics */}
                      <div className="flex justify-center gap-6 text-xs font-bold pt-2 border-t border-b border-white/5 py-3">
                        <div>
                          <span className={`mr-1 ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>14</span>
                          <span className="text-slate-400 font-semibold">Siguiendo</span>
                        </div>
                        <div>
                          <span className={`mr-1 ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>980</span>
                          <span className="text-slate-400 font-semibold">Seguidores</span>
                        </div>
                        <div>
                          <span className={`mr-1 ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>4.2K</span>
                          <span className="text-slate-400 font-semibold">Me gusta</span>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className={`text-xs max-w-sm mx-auto leading-relaxed ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        El comparador independiente de seguros de salud, estudios y asistencia en España. Sin spam.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative text below mockup */}
              <p className="mt-6 max-w-lg mx-auto text-center text-xs leading-relaxed text-slate-500">
                La vista simula la composición real y recortes de cada red en modo {mockupTheme === 'light' ? 'claro' : 'oscuro'}.
              </p>

              {/* Assets Download Gallery (Visible and scaled to guarantee browser layout renders correctly) */}
              <div className="mt-8 w-full border-t border-slate-200/80 pt-6 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                  Activos Listos en Alta Resolución
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Profile photo block */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Foto de Perfil</p>
                    
                    {/* Visual container with scaled wrapper inside */}
                    <div className="w-[160px] h-[160px] rounded-xl border border-slate-200/60 overflow-hidden relative bg-slate-50 flex items-center justify-center shrink-0">
                      <div 
                        style={{
                          transform: 'scale(0.2)',
                          transformOrigin: 'center center',
                          width: '800px',
                          height: '800px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <div 
                          ref={profileRef}
                          className={`relative flex items-center justify-center overflow-hidden ${
                            useDarkBackground ? 'bg-[#001219]' : 'bg-white'
                          }`}
                          style={{ 
                            width: '800px', 
                            height: '800px', 
                            minWidth: '800px', 
                            minHeight: '800px'
                          }}
                        >
                          <div className="relative z-10 flex items-center justify-center">
                            <Logo iconSize={420} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} disableTransition={true} />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleSocialExport('profile')}
                      disabled={isExporting}
                      className="w-full py-2 px-3 rounded-xl bg-[#005F73] hover:bg-[#004f5e] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Download size={14} />
                      <span>Descargar Perfil</span>
                    </button>
                  </div>

                  {/* Cover banner block */}
                  {hasCover && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Portada / Banner</p>
                      
                      {/* Visual container with scaled wrapper inside */}
                      <div className="w-full h-[160px] rounded-xl border border-slate-200/60 overflow-hidden relative bg-[#001219] flex items-center justify-center shrink-0">
                        <div 
                          style={{
                            transform: `scale(${Math.min(220 / selectedPlatform.coverSize!.width, 140 / selectedPlatform.coverSize!.height)})`,
                            transformOrigin: 'center center',
                            width: `${selectedPlatform.coverSize!.width}px`,
                            height: `${selectedPlatform.coverSize!.height}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <div 
                            ref={coverRef}
                            className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219]"
                            style={{
                              width: `${selectedPlatform.coverSize!.width}px`,
                              height: `${selectedPlatform.coverSize!.height}px`,
                              minWidth: `${selectedPlatform.coverSize!.width}px`,
                              minHeight: `${selectedPlatform.coverSize!.height}px`
                            }}
                          >
                            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#94D2BD]/20 blur-2xl" />
                            <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#94D2BD]/10 blur-2xl" />
                            <div className="relative z-10 flex flex-col items-center text-center">
                              <Logo iconSize={coverLogoSize} showText={false} showTagline={false} variant="colored-on-dark" orientation="vertical" disableTransition={true} />
                              <p className="mt-7 font-display font-black text-white" style={{ fontSize: `${coverTitleSize}px`, lineHeight: 1.1 }}>VitaBlue</p>
                              <p className="mt-4 max-w-[1200px] font-semibold text-[#94D2BD]" style={{ fontSize: `${coverSubtitleSize}px`, lineHeight: 1.25 }}>
                                Protección que se adapta a tu vida
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleSocialExport('cover')}
                        disabled={isExporting}
                        className="w-full py-2 px-3 rounded-xl bg-[#005F73] hover:bg-[#004f5e] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Download size={14} />
                        <span>Descargar Portada</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        ) : <SocialGenerator />}
      </main>
    </div>
  );
};

export default MarketingStudio;