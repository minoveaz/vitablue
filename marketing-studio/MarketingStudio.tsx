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
  Globe,
} from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Logo from '@/components/atoms/Logo';
import SocialGenerator from '@/marketing-studio/SocialGenerator';
import { 
  getSocialProfiles, 
  saveSocialProfiles, 
  SocialPlatformId, 
  SocialProfiles, 
  extractSocialUser, 
  socialProfilesUpdatedEvent,
  syncSocialProfilesWithSupabase,
  saveSocialProfilesToSupabase
} from '@/utils/socialProfiles';
import { 
  Campaign, 
  getCampaigns, 
  syncCampaignsWithSupabase 
} from '@/marketing-studio/utils/campaigns';
import { CampaignManager } from '@/marketing-studio/components/CampaignManager';
import { CampaignOverview } from '@/marketing-studio/components/CampaignOverview';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from '@/components/molecules/ConfirmModal';
import SaaSShell from '@/components/layouts/SaaSShell';
import { backofficeNavigation } from '@/components/layouts/BackofficeShell';
import { 
  getConnections, 
  syncConnectionsWithSupabase,
  startPlatformOAuth, 
  handleOAuthCallback, 
  disconnectPlatform,
  SocialConnections
} from '@/marketing-studio/utils/connections';

type StudioSection = 'identity' | 'profiles' | 'campaigns' | 'connections' | 'content';
type PlatformId = SocialPlatformId;
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
  { 
    id: 'x', 
    name: 'X (Twitter)', 
    recommendedSize: '400 × 400 px', 
    profileSize: { width: 400, height: 400 }, 
    coverSize: { width: 1500, height: 500 }, 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ), 
    accent: '#0f172a' 
  },
];

const colorTokens = [
  { name: 'Ocean Blue', value: '#005F73', className: 'bg-[#005F73]' },
  { name: 'Midnight', value: '#001219', className: 'bg-[#001219]' },
  { name: 'Mint', value: '#94D2BD', className: 'bg-[#94D2BD]' },
  { name: 'Amber', value: '#EE9B00', className: 'bg-[#EE9B00]' },
];

const formatDimensions = (dimensions: { width: number; height: number }) => `${dimensions.width} × ${dimensions.height} px`;

const MarketingStudio: React.FC = () => {
  const { role } = useAuth();
  const canEdit = role === 'admin' || role === 'editor';
  const canDelete = role === 'admin';
  const { pathname } = useLocation();
  const { campaignId } = useParams<{ campaignId?: string }>();
  
  let section: StudioSection = 'identity';
  if (pathname.includes('/perfiles-sociales')) {
    section = 'profiles';
  } else if (pathname.includes('/campanas')) {
    section = 'campaigns';
  } else if (pathname.includes('/conexiones')) {
    section = 'connections';
  } else if (pathname.includes('/generador-contenido')) {
    section = 'content';
  }

  const [activePlatform, setActivePlatform] = useState<PlatformId>('instagram');
  const [mockupTheme, setMockupTheme] = useState<'light' | 'dark'>('light');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfiles>(getSocialProfiles);
  const [campaigns, setCampaigns] = useState<Campaign[]>(getCampaigns);
  const [connections, setConnections] = useState<SocialConnections>(getConnections);
  const [pendingDisconnect, setPendingDisconnect] = useState<PlatformId | null>(null);
  const [disconnectError, setDisconnectError] = useState<string | null>(null);
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
    // 1. Listen for profiles localStorage updates
    const handleProfilesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SocialProfiles>;
      setSocialProfiles(customEvent.detail ?? getSocialProfiles());
    };
    window.addEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);

    // 2. Perform Supabase database sync (Hybrid Sync Strategy)
    syncSocialProfilesWithSupabase().then((synced) => {
      setSocialProfiles(synced);
    });
    syncCampaignsWithSupabase().then((syncedCamps) => {
      setCampaigns(syncedCamps);
    });
    syncConnectionsWithSupabase().then((syncedConnections) => {
      setConnections(syncedConnections);
    });

    return () => {
      window.removeEventListener(socialProfilesUpdatedEvent, handleProfilesUpdate);
    };
  }, []);

  React.useEffect(() => {
    // 3. Process OAuth callbacks from redirect query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get('code');
    const state = queryParams.get('state');

    if (code && state) {
      let platform: SocialPlatformId | null = null;
      if (state.startsWith('linkedin_')) platform = 'linkedin';
      if (state.startsWith('meta_')) platform = 'facebook';
      if (state.startsWith('google_')) platform = 'youtube';
      if (state.startsWith('x_')) platform = 'x';
      if (state.startsWith('tiktok_')) platform = 'tiktok';
      if (!platform) {
        platform = window.sessionStorage.getItem('vitablue.oauth.provider') as SocialPlatformId | null;
      }

      if (platform) {
        setIsExporting(true);
        setExportMessage(`Conectando con ${platform}...`);
        
        handleOAuthCallback(platform, code, state).then((res) => {
          if (res.success) {
            setConnections(getConnections());
            setExportMessage(`¡Cuenta de ${platform} conectada con éxito!`);
          } else {
            setExportMessage(`Error al conectar con ${platform}: ${res.error}`);
          }
          setIsExporting(false);
          
          // Clear URL query parameters
          const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        });
      }
    }
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
    saveSocialProfilesToSupabase(nextProfiles);
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
    <SaaSShell navigation={backofficeNavigation} title={section === 'identity' ? 'Identidad de Marca & Sistema Visual' : section === 'profiles' ? 'Gestión de Perfiles Sociales' : section === 'campaigns' ? 'Planificador de Campañas Multicanal' : section === 'connections' ? 'Configuración de Conexiones de API' : 'Generador Automático de Contenido'}>
      {/* SIDEBAR NAVIGATION */}
      <aside className="hidden">
        <div className="p-6">
          <div className="mb-8 pb-4 border-b border-slate-800/60 text-left">
            <h1 className="font-display text-xl font-black tracking-tight text-white">Marketing Studio</h1>
            <span className="text-[9px] font-black uppercase tracking-wider text-[#94D2BD] block mt-1">Dev Workspace</span>
          </div>
          
          <nav className="space-y-1.5" aria-label="Secciones de Marketing Studio">
            <Link to="/marketing-studio/identidad-de-marca" className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${section === 'identity' ? 'bg-[#005F73] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              <Palette size={16} /> Identidad de marca
            </Link>
            <Link to="/marketing-studio/perfiles-sociales" className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${section === 'profiles' ? 'bg-[#005F73] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              <ImageIcon size={16} /> Perfiles sociales
            </Link>
            <Link to="/marketing-studio/campanas" className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${section === 'campaigns' ? 'bg-[#005F73] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              <Sparkles size={16} className="text-[#94D2BD] shrink-0" /> Gestión de Campañas
            </Link>
            <Link to="/marketing-studio/conexiones" className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${section === 'connections' ? 'bg-[#005F73] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              <Globe size={16} className="shrink-0" /> Conexiones API
            </Link>
            <Link to="/marketing-studio/generador-contenido" className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${section === 'content' ? 'bg-[#005F73] text-white shadow-sm' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}`}>
              <Sparkles size={16} /> Generador de contenido
            </Link>
          </nav>
        </div>
        
        <div className="p-6 border-t border-slate-800/60 space-y-4">
          <div className="rounded-xl border border-[#94D2BD]/20 bg-[#EBF7F4]/5 px-3.5 py-2.5 text-[10px] font-semibold text-[#94D2BD] text-center leading-relaxed">
            Solo en desarrollo local
          </div>
          <Link to="/" className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 justify-center">
            <span>Salir al sitio</span>
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <div className="contents">
        {/* ADMIN HEADER BAR */}
        <header className="hidden">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#005F73] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-wider text-[#005F73]">Panel de Administración</span>
            </div>
            <h2 className="font-display text-xl font-black text-slate-800 mt-1">
              {section === 'identity' && 'Identidad de Marca & Sistema Visual'}
              {section === 'profiles' && 'Gestión de Perfiles Sociales'}
              {section === 'campaigns' && 'Planificador de Campañas Multicanal'}
              {section === 'connections' && 'Configuración de Conexiones de API'}
              {section === 'content' && 'Generador Automático de Contenido'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBF7F4] border border-[#94D2BD]/20 text-[10px] font-bold text-[#005F73]">
              <Check size={11} className="text-[#005F73]" />
              <span>Base de Datos Sincronizada</span>
            </div>

            <div className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-3 py-1.5 rounded-xl">
              Entorno Local: Activo
            </div>
          </div>
        </header>

        {/* BRAND IDENTITY MODULE */}
        {section === 'identity' && (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] text-left animate-fadeIn">
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-5 sm:px-8">
                <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#005F73]">Brand board</p>
                <h3 className="font-display text-2xl font-black">Sistema visual VitaBlue</h3>
              </div>
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
                    {colorTokens.map((token) => (
                      <div key={token.name} className="overflow-hidden rounded-2xl border border-slate-100">
                        <div className={`h-20 ${token.className}`} />
                        <div className="p-3">
                          <p className="text-xs font-bold text-slate-700">{token.name}</p>
                          <p className="mt-1 font-mono text-[10px] text-slate-400">{token.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 flex items-start gap-3 rounded-2xl bg-[#f4f7f8] p-4">
                    <Type className="mt-0.5 text-[#005F73]" size={19} />
                    <div>
                      <p className="text-sm font-bold">Tipografía</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">Poppins para titulares y navegación. Inter para textos funcionales y lectura.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-[#001219] p-7 text-white shadow-sm sm:p-9">
              <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#94D2BD]">Dirección creativa</p>
              <h3 className="font-display text-3xl font-black leading-tight">Clara, humana y preparada para avanzar.</h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">La identidad combina confianza aseguradora con una energía digital accesible. Cada activo debe sentirse útil antes que decorativo.</p>
              <div className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm">
                {['Usar el logo con espacio de protección generoso.', 'Priorizar Ocean Blue para acciones y puntos de orientación.', 'Reservar Amber Gold para llamadas de atención.', 'Mantener mensajes breves y fáciles de escanear.'].map((rule) => (
                  <div key={rule} className="flex gap-3">
                    <Check className="shrink-0 text-[#94D2BD]" size={17} />
                    <span className="text-slate-300">{rule}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* SOCIAL MEDIA PROFILES MODULE */}
        {section === 'profiles' && (
          <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] text-left animate-fadeIn">
            {/* Left Column: Config Panel */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 space-y-6">
              <div>
                <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#005F73]">Asset builder</p>
                <h3 className="font-display text-2xl font-black">Activos sociales</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">Configura los activos vectoriales de marca y visualiza su maquetación.</p>
              </div>

              {/* Platform selector */}
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
                      className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                        activePlatform === platform.id
                          ? 'border-[#005F73] bg-[#EBF7F4]'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span style={{ color: platform.accent }}>{platform.icon}</span>
                        <span>
                          <span className="block text-sm font-bold text-slate-800">{platform.name}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold">
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

              {/* URL and download options */}
              <div className="space-y-4 border-t border-slate-100 pt-5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  URL oficial de {selectedPlatform.name}
                  <input
                    type="url"
                    value={selectedProfile.url}
                    onChange={(event) => handleSocialUrlChange(activePlatform, event.target.value)}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#005F73] bg-white"
                    placeholder={`https://${activePlatform}.com/...`}
                  />
                </label>

                <div className="rounded-xl bg-[#EBF7F4] px-3.5 py-2.5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#005F73]">Usuario detectado</p>
                  <p className="mt-0.5 text-sm font-bold text-[#001219]">{selectedProfile.user || 'Añade una URL para detectarlo'}</p>
                </div>

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

              {exportMessage && (
                <p className="text-center text-xs font-semibold text-[#005F73] bg-[#EBF7F4] py-2 rounded-xl border border-[#94D2BD]/30 animate-pulse">
                  {exportMessage}
                </p>
              )}
            </section>

            {/* Right Column: Context Preview */}
            <section className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-[#e8edef] p-6 shadow-sm sm:p-8">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">Vista previa contextual real</p>
                  <p className="mt-0.5 text-sm font-bold text-slate-700">Canal: {selectedPlatform.name}</p>
                </div>
                
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

              <div className={`w-full max-w-[540px] mx-auto overflow-hidden rounded-2xl border transition-colors shadow-2xl ${
                mockupTheme === 'dark' ? 'border-[#3e4042] bg-[#18191A]' : 'border-slate-200 bg-white'
              }`}>
                <div className={`flex items-center gap-2 border-b px-4 py-2.5 text-[11px] font-bold tracking-wide select-none ${
                  mockupTheme === 'dark' ? 'border-white/10 text-white/50 bg-[#242526]' : 'border-slate-100 text-slate-400 bg-slate-50'
                }`}>
                  <span style={{ color: selectedPlatform.accent }}>{selectedPlatform.icon}</span>
                  <span>Previsualización de Perfil Oficial en {selectedPlatform.name}</span>
                </div>

                <div className="p-0">
                  {/* FACEBOOK */}
                  {activePlatform === 'facebook' && (
                    <div className="relative">
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

                      <div className="px-6 pb-6 pt-16 relative">
                        <div 
                          className={`absolute left-6 top-[-36px] rounded-full border-[4px] w-20 h-20 shadow-md overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-[#18191A]' : 'border-white'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={40} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        <div className="text-left space-y-1">
                          <h4 className={`text-xl font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">
                            {selectedProfile.user || 'Página · Correduría de seguros'}
                          </p>
                          <div className="flex gap-2 pt-3">
                            <button className="px-4 py-1.5 rounded-lg bg-[#1877F2] text-white text-xs font-bold shadow-sm">
                              Te gusta
                            </button>
                            <button className={`px-4 py-1.5 rounded-lg text-xs font-bold border ${
                              mockupTheme === 'dark' ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}>
                              Enviar mensaje
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LINKEDIN */}
                  {activePlatform === 'linkedin' && (
                    <div className="relative">
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

                      <div className="px-6 pb-6 pt-16 relative">
                        <div 
                          className={`absolute left-6 top-[-44px] rounded-full border-[4px] w-22 h-22 shadow-md overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-[#18191A]' : 'border-white'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={44} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        <div className="space-y-1">
                          <h4 className={`text-xl font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className={`text-xs font-semibold ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            Asesoría de Seguros Independiente y Gratuita en España
                          </p>
                          <p className="text-[10px] text-slate-400 font-semibold">
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

                  {/* YOUTUBE */}
                  {activePlatform === 'youtube' && (
                    <div>
                      <div className="w-full aspect-[5.68/1] bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] relative overflow-hidden">
                        <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-[#94D2BD]/25 blur-2xl" />
                        <div className="absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-[#94D2BD]/10 blur-2xl" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 select-none">
                          <Logo iconSize={32} showText={false} showTagline={false} variant="colored-on-dark" />
                          <p className="mt-1 font-display font-black text-white text-[11px] leading-none">VitaBlue</p>
                          <p className="mt-0.5 font-semibold text-[#94D2BD] text-[6px] leading-tight max-w-[150px]">
                            Protección que se adapta a tu vida
                          </p>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div 
                          className={`rounded-full border w-16 h-16 shadow-md overflow-hidden flex items-center justify-center shrink-0 select-none ${
                            mockupTheme === 'dark' ? 'border-[#3e4042]' : 'border-slate-100'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={36} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        <div className="text-left space-y-1">
                          <h4 className={`text-lg font-bold font-display leading-tight ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue Seguros
                          </h4>
                          <p className="text-xs text-slate-400 font-semibold">
                            {selectedProfile.user || '@VitaBlue-seguros'} · 4.8K suscriptores · 12 vídeos
                          </p>
                          <p className={`text-xs max-w-sm ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                            El comparador independiente de seguros de salud gratuito.
                          </p>
                          <div className="pt-2">
                            <button className="px-5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900">
                              Suscribirse
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* INSTAGRAM */}
                  {activePlatform === 'instagram' && (
                    <div className="p-6 space-y-6">
                      <div className="flex gap-6 items-center">
                        <div 
                          className={`rounded-full border-[3px] p-0.5 w-20 h-20 shadow-md flex items-center justify-center shrink-0 select-none ${
                            mockupTheme === 'dark' ? 'border-[#3e4042]' : 'border-slate-100'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
                            <Logo iconSize={40} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                          </div>
                        </div>

                        <div className="text-left space-y-3 flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <h4 className={`text-lg font-bold font-display ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                              vitablue_seguros
                            </h4>
                            <div className="flex gap-1.5">
                              <button className="px-3.5 py-1 rounded bg-[#0095F6] text-white text-[11px] font-bold">
                                Seguir
                              </button>
                              <button className={`px-3 py-1 rounded text-[11px] font-bold border ${
                                mockupTheme === 'dark' ? 'border-white/10 text-white bg-white/5' : 'border-slate-200 text-slate-800 bg-slate-50'
                              }`}>
                                Mensaje
                              </button>
                            </div>
                          </div>

                          <div className="flex gap-5 text-xs select-none">
                            <div><span className="font-bold">24</span> publicaciones</div>
                            <div><span className="font-bold">1.5K</span> seguidores</div>
                            <div><span className="font-bold">110</span> seguidos</div>
                          </div>
                        </div>
                      </div>

                      <div className="text-left space-y-1 text-xs">
                        <p className={`font-bold ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>VitaBlue</p>
                        <p className="text-slate-400 font-semibold">Correduría de seguros</p>
                        <p className={mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>
                          Comparador independiente de seguros en España. Sin spam y 100% gratuito. Hablamos en idioma humano. 💬 Asistencia en vivo 👇
                        </p>
                        <p className="text-sky-600 font-semibold hover:underline cursor-pointer">
                          {selectedProfile.url || 'linktr.ee/vitablue'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TIKTOK */}
                  {activePlatform === 'tiktok' && (
                    <div className="p-6 text-center space-y-4">
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

                      <p className={`text-xs max-w-sm mx-auto leading-relaxed ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        El comparador independiente de seguros de salud, estudios y asistencia en España. Sin spam.
                      </p>
                    </div>
                  )}

                  {/* X (TWITTER) */}
                  {activePlatform === 'x' && (
                    <div className="relative text-left font-sans">
                      <div className="w-full aspect-[3/1] bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219] relative overflow-hidden">
                        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#94D2BD]/20 blur-xl" />
                        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#94D2BD]/10 blur-xl" />
                        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3 select-none">
                          <Logo iconSize={36} showText={false} showTagline={false} variant="colored-on-dark" />
                          <p className="mt-1.5 font-display font-black text-white text-base leading-none">VitaBlue</p>
                          <p className="mt-1 font-semibold text-[#94D2BD] text-[8px] leading-tight max-w-[200px]">
                            Protección que se adapta a tu vida
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-16 relative">
                        <div 
                          className={`absolute left-6 top-[-40px] rounded-full border-[4px] w-20 h-20 shadow-md overflow-hidden flex items-center justify-center select-none ${
                            mockupTheme === 'dark' ? 'border-[#15181C]' : 'border-white'
                          } ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`}
                        >
                          <Logo iconSize={40} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} />
                        </div>

                        <div className="absolute right-6 top-3">
                          <button className={`px-5 py-1.5 rounded-full text-xs font-black transition-all ${
                            mockupTheme === 'dark' ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}>
                            Seguir
                          </button>
                        </div>

                        <div className="space-y-1">
                          <h4 className={`text-xl font-bold font-display leading-none ${mockupTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            VitaBlue
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold">
                            {selectedProfile.user || '@vitablueseguros'}
                          </p>
                          <p className={`text-xs pt-1 leading-relaxed ${mockupTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                            El comparador independiente de seguros de salud, estudiantes y nómadas digitales en España. 🩺 Sin spam y 100% gratuito.
                          </p>
                          <div className="flex gap-4 pt-3 text-[11px] font-bold text-slate-500">
                            <div>
                              <span className={mockupTheme === 'dark' ? 'text-white' : 'text-slate-800'}>84</span> Siguiendo
                            </div>
                            <div>
                              <span className={mockupTheme === 'dark' ? 'text-white' : 'text-slate-800'}>1.5K</span> Seguidores
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Informative text */}
              <p className="mt-6 max-w-lg mx-auto text-center text-xs leading-relaxed text-slate-500">
                La vista simula la composición real y recortes de cada red en modo {mockupTheme === 'light' ? 'claro' : 'oscuro'}.
              </p>

              {/* Real assets preview and download gallery */}
              <div className="mt-8 w-full border-t border-slate-200/80 pt-6 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
                  Activos listos en alta resolución
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Foto de Perfil</p>
                    
                    <div className="w-[140px] h-[140px] rounded-xl border border-slate-200/60 overflow-hidden relative flex items-center justify-center shrink-0 bg-slate-50">
                      <div 
                        style={{
                          transform: 'scale(0.18)',
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
                          className={`relative overflow-hidden flex items-center justify-center ${
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

                  {hasCover && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Portada / Banner</p>
                      
                      <div className="w-full h-[140px] rounded-xl border border-slate-200/60 overflow-hidden relative bg-[#001219] flex items-center justify-center shrink-0">
                        <div 
                          style={{
                            transform: `scale(${Math.min(200 / selectedPlatform.coverSize!.width, 110 / selectedPlatform.coverSize!.height)})`,
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
        )}

        {/* CONNECTIONS API MODULE */}
        {section === 'connections' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-left animate-fadeIn">
            <div>
              <h2 className="font-display text-2xl font-black text-slate-800">Conexiones API con Redes Sociales</h2>
              <p className="text-slate-400 text-xs mt-1">Conecta tus cuentas corporativas de forma segura en local. OAuth 2.0 y Proxy de Vite activos.</p>
            </div>

            {exportMessage && (
              <div className="bg-[#EBF7F4] border border-[#94D2BD]/30 py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#005F73] animate-pulse">
                {exportMessage}
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {platforms.map((plat) => {
                if (plat.id === 'instagram') return null; // Unify with Facebook card
                
                const conn = connections[plat.id];
                const isConnected = conn?.connected;
                const isMeta = plat.id === 'facebook';
                const cardTitle = isMeta ? 'Meta (Facebook & Instagram)' : plat.name;

                return (
                  <div key={plat.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/30 flex flex-col justify-between gap-5 hover:shadow-sm transition-all text-left">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="p-2.5 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm" style={{ color: plat.accent }}>
                          {isMeta ? (
                            <span className="flex gap-1 items-center">
                              <Facebook size={18} className="text-[#1877F2]" />
                              <Instagram size={18} className="text-[#D946EF]" />
                            </span>
                          ) : plat.icon}
                        </span>
                        <div>
                          <span className="block text-sm font-bold text-slate-800">{cardTitle}</span>
                          <span className="block text-[10px] text-slate-400 font-semibold">API OAuth 2.0</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100/60">
                        {isConnected ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-50 border border-emerald-200 text-emerald-700 font-sans">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
                              Conectado
                            </span>
                            <span className="block text-xs font-bold text-slate-700 mt-2 truncate">
                              Facebook: {conn.username}
                            </span>
                            {isMeta && connections.instagram?.connected && (
                              <span className="block text-xs font-bold text-slate-700 truncate">
                                Instagram: {connections.instagram.username}
                              </span>
                            )}
                            <span className="block text-[9px] text-slate-400 font-semibold mt-1">
                              Vinculado: {conn.connectedAt}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 border border-slate-200 text-slate-600">
                              Desconectado
                            </span>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-2">
                              Requiere Client ID y Client Secret de desarrollador configurados en tu archivo local <code>.env.local</code>.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100/60">
                      {isConnected ? (
                        <button
                          onClick={() => {
                            if (canEdit) {
                              setDisconnectError(null);
                              setPendingDisconnect(plat.id);
                            }
                          }}
                          disabled={!canEdit}
                          className="w-full flex items-center justify-center py-2.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
                        >
                          Desconectar
                        </button>
                      ) : (
                        <button
                          onClick={() => startPlatformOAuth(plat.id)}
                          className="w-full flex items-center justify-center py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Conectar cuenta
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* CAMPAIGN MANAGER MODULE */}
        {section === 'campaigns' && (
          <div className="animate-fadeIn">
            {campaignId ? (
              <CampaignManager campaigns={campaigns} setCampaigns={setCampaigns} campaignId={campaignId} canEdit={canEdit} />
            ) : (
              <CampaignOverview campaigns={campaigns} setCampaigns={setCampaigns} canEdit={canEdit} canDelete={canDelete} />
            )}
          </div>
        )}

        {/* CONTENT GENERATOR MODULE */}
        {section === 'content' && (
          <div className="animate-fadeIn">
            <SocialGenerator />
          </div>
        )}
        <ConfirmModal
          open={Boolean(pendingDisconnect)}
          variant="danger"
          title="Desconectar cuenta"
          description={disconnectError ?? 'Se eliminará la conexión de VitaBlue y la credencial almacenada en Vault. Tendrás que autorizarla de nuevo para volver a utilizarla.'}
          confirmLabel="Desconectar"
          onCancel={() => {
            setPendingDisconnect(null);
            setDisconnectError(null);
          }}
          onConfirm={async () => {
            if (!pendingDisconnect) return;
            try {
              setConnections(await disconnectPlatform(pendingDisconnect));
              setPendingDisconnect(null);
              setDisconnectError(null);
            } catch (error) {
              setDisconnectError(error instanceof Error ? error.message : 'No se pudo desconectar la cuenta.');
            }
          }}
        />
      </div>
    </SaaSShell>
  );
};

export default MarketingStudio;
