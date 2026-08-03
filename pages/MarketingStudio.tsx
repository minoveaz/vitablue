import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
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
import { Link } from 'react-router-dom';
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
  const [section, setSection] = useState<StudioSection>('identity');
  const [activePlatform, setActivePlatform] = useState<PlatformId>('instagram');
  const [assetType, setAssetType] = useState<SocialAssetType>('profile');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfiles>(getSocialProfiles);
  const [useDarkBackground, setUseDarkBackground] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const selectedPlatform = platforms.find((platform) => platform.id === activePlatform) ?? platforms[0];
  const selectedProfile = socialProfiles[activePlatform];
  const hasCover = Boolean(selectedPlatform.coverSize);
  const activeDimensions = assetType === 'cover' && selectedPlatform.coverSize
    ? selectedPlatform.coverSize
    : selectedPlatform.profileSize;
  const previewScale = Math.min(
    1,
    520 / activeDimensions.width,
    480 / activeDimensions.height,
  );
  const previewDimensions = {
    width: Math.round(activeDimensions.width * previewScale),
    height: Math.round(activeDimensions.height * previewScale),
  };
  const coverLogoSize = activeDimensions.width >= 2000 ? 220 : 150;
  const coverTitleSize = activeDimensions.width >= 2000 ? 96 : 64;
  const coverSubtitleSize = activeDimensions.width >= 2000 ? 48 : 32;

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

  const handleProfileExport = async () => {
    const assetRef = assetType === 'cover' ? coverRef.current : profileRef.current;
    if (!assetRef) return;

    setIsExporting(true);
    setExportMessage(null);

    try {
      const dataUrl = await toPng(assetRef, {
        cacheBust: true,
        skipFonts: true,
        pixelRatio: 2,
        width: activeDimensions.width,
        height: activeDimensions.height,
        style: { width: `${activeDimensions.width}px`, height: `${activeDimensions.height}px`, transform: 'scale(1)' },
      });
      const link = document.createElement('a');
      link.download = `vitablue_${activePlatform}_${assetType}_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setExportMessage(`${assetType === 'cover' ? 'Portada' : 'Perfil'} de ${selectedPlatform.name} descargado.`);
    } catch (error) {
      console.error('Error generating profile image:', error);
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
          <button onClick={() => setSection('identity')} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'identity' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><Palette size={17} /> Identidad de marca</button>
          <button onClick={() => setSection('profiles')} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'profiles' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><ImageIcon size={17} /> Perfiles sociales</button>
          <button onClick={() => setSection('content')} className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${section === 'content' ? 'border-[#005F73] text-[#005F73]' : 'border-transparent text-slate-400 hover:text-slate-700'}`}><Sparkles size={17} /> Generador de contenido</button>
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
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-[#005F73]">Asset builder</p>
              <h3 className="font-display text-2xl font-black">Activos sociales</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">Previsualiza y descarga el activo con el formato real de cada plataforma.</p>
              <div className="mt-7 space-y-2">
                {platforms.map((platform) => <button key={platform.id} onClick={() => { setActivePlatform(platform.id); setAssetType(platform.coverSize ? assetType : 'profile'); setExportMessage(null); }} className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${activePlatform === platform.id ? 'border-[#005F73] bg-[#EBF7F4]' : 'border-slate-200 hover:border-slate-300'}`}><span className="flex items-center gap-3"><span style={{ color: platform.accent }}>{platform.icon}</span><span><span className="block text-sm font-bold text-slate-800">{platform.name}</span><span className="block text-[11px] text-slate-400">Perfil {formatDimensions(platform.profileSize)}</span></span></span>{activePlatform === platform.id && <Check size={17} className="text-[#005F73]" />}</button>)}
              </div>
              <div className="mt-7 space-y-4 border-t border-slate-100 pt-6">
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-1.5">
                  <button onClick={() => setAssetType('profile')} className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${assetType === 'profile' ? 'bg-white text-[#005F73] shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>Foto de perfil</button>
                  <button onClick={() => hasCover && setAssetType('cover')} disabled={!hasCover} className={`rounded-xl px-3 py-2.5 text-xs font-bold transition-colors ${assetType === 'cover' ? 'bg-white text-[#005F73] shadow-sm' : 'text-slate-400 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50'}`}>Portada / banner</button>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-400">{hasCover ? `${assetType === 'cover' ? 'Portada' : 'Perfil'} recomendada para ${selectedPlatform.name}: ${formatDimensions(activeDimensions)}.` : `${selectedPlatform.name} no utiliza una portada independiente. La vista muestra cómo aparece su foto de perfil.`}</p>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">URL oficial de {selectedPlatform.name}<input type="url" value={selectedProfile.url} onChange={(event) => handleSocialUrlChange(activePlatform, event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#005F73]" placeholder={`https://${activePlatform}.com/...`} /></label>
                <div className="rounded-xl bg-[#EBF7F4] px-3.5 py-3"><p className="text-[10px] font-black uppercase tracking-wider text-[#005F73]">Usuario detectado</p><p className="mt-1 text-sm font-bold text-[#001219]">{selectedProfile.user || 'Añade una URL para detectarlo'}</p></div>
                <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-bold text-slate-700"><span>Fondo oscuro</span><input type="checkbox" checked={useDarkBackground} onChange={(event) => setUseDarkBackground(event.target.checked)} className="h-4 w-4 accent-[#005F73]" /></label>
              </div>
              <button onClick={handleProfileExport} disabled={isExporting} className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#005F73] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#004f5e] disabled:cursor-wait disabled:opacity-60"><Download size={18} />{isExporting ? 'Preparando PNG...' : `Descargar ${assetType === 'cover' ? 'portada' : 'perfil'} de ${selectedPlatform.name}`}</button>
              {exportMessage && <p className="mt-3 text-center text-xs font-semibold text-[#005F73]">{exportMessage}</p>}
            </section>

            <section className="flex min-h-[620px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-[#e8edef] p-6 shadow-sm sm:p-10">
              <div className="mb-5 flex w-full items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wider text-slate-400">Vista previa contextual</p><p className="mt-1 text-sm font-bold text-slate-700">{selectedPlatform.name} · {assetType === 'cover' ? 'Portada' : 'Perfil'}</p></div><span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-slate-500 shadow-sm">{formatDimensions(activeDimensions)}</span></div>
              <div className="w-full max-w-[520px] overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3 text-xs font-bold text-slate-500"> <span style={{ color: selectedPlatform.accent }}>{selectedPlatform.icon}</span> Así se verá en {selectedPlatform.name}</div>
                {assetType === 'cover' && hasCover ? (
                  <div className="bg-white p-4">
                    <div className="overflow-hidden rounded-xl border border-slate-100 bg-[#001219]">
                      <div className="relative overflow-hidden" style={{ width: `${previewDimensions.width}px`, height: `${previewDimensions.height}px` }}>
                        <div ref={coverRef} className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#005F73] via-[#003f4e] to-[#001219]" style={{ width: `${activeDimensions.width}px`, height: `${activeDimensions.height}px`, transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#94D2BD]/20 blur-2xl" /><div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#94D2BD]/10 blur-2xl" />
                        <div className="relative z-10 flex flex-col items-center text-center"><Logo iconSize={coverLogoSize} showText={false} showTagline={false} variant="colored-on-dark" orientation="vertical" /><p className="mt-7 font-display font-black text-white" style={{ fontSize: `${coverTitleSize}px`, lineHeight: 1.1 }}>VitaBlue</p><p className="mt-4 max-w-[1200px] font-semibold text-[#94D2BD]" style={{ fontSize: `${coverSubtitleSize}px`, lineHeight: 1.25 }}>Protección que se adapta a tu vida</p></div>
                        </div>
                        {activePlatform === 'youtube' && <div className="pointer-events-none absolute left-1/2 top-1/2 h-[29.38%] w-[60.39%] -translate-x-1/2 -translate-y-1/2 rounded border border-dashed border-white/70" aria-hidden="true" />}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#f8fafb] p-5">
                    {activePlatform === 'instagram' && <div className="mb-4 flex items-center gap-4 border-b border-slate-200 pb-5"><div className="rounded-full bg-gradient-to-br from-[#EE9B00] via-[#D946EF] to-[#005F73] p-1"><div className="rounded-full bg-white p-1"><Logo iconSize={68} showText={false} showTagline={false} /></div></div><div><p className="font-bold text-slate-800">VitaBlue</p><p className="text-xs text-slate-400">{selectedProfile.user || 'Usuario pendiente'}</p><p className="mt-2 text-xs font-bold text-slate-600">Seguros que se adaptan a ti</p></div></div>}
                    {activePlatform !== 'instagram' && <div className={`mb-4 flex flex-col items-center rounded-2xl px-5 py-6 text-center ${activePlatform === 'tiktok' ? 'bg-[#111827] text-white' : 'bg-white text-slate-800'}`}><Logo iconSize={activePlatform === 'youtube' ? 92 : 78} showText={false} showTagline={false} variant={activePlatform === 'tiktok' ? 'colored-on-dark' : 'default'} /><p className="mt-3 font-display text-2xl font-black">VitaBlue</p><p className={`text-xs ${activePlatform === 'tiktok' ? 'text-[#94D2BD]' : 'text-slate-400'}`}>{selectedProfile.user || 'Usuario pendiente'}</p></div>}
                    <div className="overflow-hidden" style={{ width: `${previewDimensions.width}px`, height: `${previewDimensions.height}px` }}>
                      <div ref={profileRef} className={`relative flex items-center justify-center overflow-hidden ${useDarkBackground ? 'bg-[#001219]' : 'bg-white'}`} style={{ width: `${activeDimensions.width}px`, height: `${activeDimensions.height}px`, transform: `scale(${previewScale})`, transformOrigin: 'top left' }}>
                        <div className="relative z-10 flex items-center justify-center"><Logo iconSize={Math.min(activeDimensions.width, activeDimensions.height) * 0.52} showText={false} showTagline={false} variant={useDarkBackground ? 'colored-on-dark' : 'default'} /></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-7 max-w-lg text-center text-xs leading-relaxed text-slate-500">La vista adapta el encuadre al comportamiento habitual de cada red. La descarga conserva las dimensiones oficiales del activo, sin la interfaz de esta maqueta.</p>
            </section>
          </div>
        ) : <SocialGenerator />}
      </main>
    </div>
  );
};

export default MarketingStudio;