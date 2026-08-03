import React, { useState } from 'react';
import { 
  Campaign, 
  CampaignAsset, 
  defaultCampaigns, 
  saveCampaigns, 
  saveCampaignToSupabase, 
  deleteCampaign 
} from '@/utils/campaigns';
import { SocialPlatformId, getSocialProfiles } from '@/utils/socialProfiles';
import { generateCampaignBannerSvg, downloadSvgAsPng } from '@/utils/svgGenerator';
import { 
  Plus, 
  Trash2, 
  Download, 
  Calendar, 
  Globe, 
  CheckCircle, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Music2, 
  Youtube, 
  Sparkles, 
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Logo from '@/components/atoms/Logo';

// Custom X logo icon
const XIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface CampaignManagerProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
}

const statusColors = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

const platforms = [
  { id: 'facebook', name: 'Facebook', icon: <Facebook size={16} />, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: <Instagram size={16} />, color: '#D946EF' },
  { id: 'tiktok', name: 'TikTok', icon: <Music2 size={16} />, color: '#111827' },
  { id: 'youtube', name: 'YouTube', icon: <Youtube size={16} />, color: '#FF0033' },
  { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin size={16} />, color: '#0A66C2' },
  { id: 'x', name: 'X (Twitter)', icon: <XIcon size={14} />, color: '#0f172a' },
] as const;

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, setCampaigns }) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || 'lanzamiento-marca');
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  
  // Custom states for editing campaign assets text
  const [customTitles, setCustomTitles] = useState<Record<string, string>>({});
  const [customTaglines, setCustomTaglines] = useState<Record<string, string>>({});
  const [assetThemes, setAssetThemes] = useState<Record<string, 'dark' | 'light' | 'gradient'>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Mockup preview active platform tab
  const [mockupPlatform, setMockupPlatform] = useState<SocialPlatformId>('instagram');

  const campaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];
  const socialProfiles = getSocialProfiles();

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <Sparkles className="text-slate-300 w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold">No hay campañas disponibles</h3>
        <p className="text-slate-500 max-w-sm mt-2">Crea tu primera campaña para planificar y estructurar publicaciones en redes sociales.</p>
        <button 
          onClick={() => handleCreateCampaign('Campaña de Lanzamiento')}
          className="mt-6 px-5 py-2.5 bg-[#005F73] hover:bg-[#004f5e] text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <Plus size={16} /> Crear campaña
        </button>
      </div>
    );
  }

  const updateCampaignField = (field: keyof Campaign, value: any) => {
    const updated = campaigns.map(c => {
      if (c.id === campaign.id) {
        const next = { ...c, [field]: value };
        saveCampaignToSupabase(next); // Sync background to Supabase
        return next;
      }
      return c;
    });
    setCampaigns(updated);
    saveCampaigns(updated);
  };

  const updateCopy = (platform: SocialPlatformId, text: string) => {
    const nextCopies = { ...campaign.copies, [platform]: text };
    updateCampaignField('copies', nextCopies);
  };

  const handleCreateCampaign = (name: string) => {
    if (!name.trim()) return;
    const newCampaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name,
      objective: 'Define el objetivo estratégico de esta campaña publicitaria...',
      status: 'draft',
      startDate: new Date().toISOString().split('T')[0],
      platforms: ['instagram', 'x', 'facebook'],
      copies: {
        instagram: '¡Escribe tu post aquí! #hashtag',
        x: 'Escribe tu post corto para X.com...',
        facebook: 'Comparte con tu comunidad en Facebook...'
      },
      assets: [
        {
          id: `asset-${Date.now()}-1`,
          name: 'Post Promocional (1x1)',
          type: 'post',
          dimensions: { width: 1080, height: 1080 },
          theme: 'gradient',
          customTitle: 'VitaBlue Seguros',
          customTagline: 'Protección que se adapta a tu vida'
        },
        {
          id: `asset-${Date.now()}-2`,
          name: 'Banner Stories (9x16)',
          type: 'story',
          dimensions: { width: 1080, height: 1920 },
          theme: 'dark',
          customTitle: 'Seguros VitaBlue',
          customTagline: 'Encuentra tu seguro de salud ideal'
        }
      ]
    };

    const nextCampaigns = [newCampaign, ...campaigns];
    setCampaigns(nextCampaigns);
    saveCampaigns(nextCampaigns);
    saveCampaignToSupabase(newCampaign);
    setSelectedCampaignId(newCampaign.id);
    setIsCreating(false);
    setNewCampaignName('');
  };

  const handleDeleteCampaign = async () => {
    if (window.confirm(`¿Seguro que deseas eliminar la campaña "${campaign.name}"?`)) {
      await deleteCampaign(campaign.id, campaigns);
      const remaining = campaigns.filter(c => c.id !== campaign.id);
      setCampaigns(remaining);
      if (remaining.length > 0) {
        setSelectedCampaignId(remaining[0].id);
      }
    }
  };

  const handleExportAsset = async (asset: CampaignAsset) => {
    setIsExporting(true);
    setExportMessage(null);
    try {
      const filename = `vitablue_campaign_${campaign.id}_${asset.type}_${Date.now()}.png`;
      const title = customTitles[asset.id] ?? asset.customTitle ?? 'VitaBlue Seguros';
      const tagline = customTaglines[asset.id] ?? asset.customTagline ?? 'Protección que se adapta a tu vida';
      const theme = assetThemes[asset.id] ?? asset.theme;
      
      const svgString = generateCampaignBannerSvg(
        asset.dimensions.width,
        asset.dimensions.height,
        asset.type,
        theme,
        title,
        tagline
      );
      
      await downloadSvgAsPng(svgString, asset.dimensions.width, asset.dimensions.height, filename);
      setExportMessage(`Activo "${asset.name}" descargado en resolución nativa.`);
    } catch (err) {
      console.error(err);
      setExportMessage('Ocurrió un error al descargar. Inténtalo de nuevo.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* CAMPAIGN LIST PANEL */}
      <div className="flex flex-col gap-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Mis Campañas</span>
            <button 
              onClick={() => setIsCreating(true)}
              className="p-1.5 rounded-lg bg-[#005F73]/5 hover:bg-[#005F73]/10 text-[#005F73] transition-colors cursor-pointer"
              title="Nueva campaña"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Create Input Modal Form */}
          {isCreating && (
            <div className="p-3 border border-dashed border-[#005F73]/50 rounded-2xl bg-[#EBF7F4]/30 space-y-2.5 animate-fadeIn">
              <input
                type="text"
                placeholder="Nombre de campaña..."
                value={newCampaignName}
                onChange={(e) => setNewCampaignName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white focus:border-[#005F73] outline-none"
              />
              <div className="flex gap-1.5 justify-end">
                <button 
                  onClick={() => setIsCreating(false)} 
                  className="px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleCreateCampaign(newCampaignName)}
                  className="px-2.5 py-1 text-[10px] font-bold text-white bg-[#005F73] hover:bg-[#004f5e] rounded-md cursor-pointer"
                >
                  Crear
                </button>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            {campaigns.map((c) => {
              const isActive = c.id === selectedCampaignId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCampaignId(c.id)}
                  className={`w-full flex items-center justify-between text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'border-[#005F73] bg-[#005F73]/5 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="max-w-[150px]">
                    <span className={`block text-xs font-bold truncate ${isActive ? 'text-[#005F73]' : 'text-slate-800'}`}>
                      {c.name}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">
                      {c.startDate}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase rounded-full border ${statusColors[c.status]}`}>
                    {c.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleDeleteCampaign}
          className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 text-xs font-bold transition-all cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Eliminar campaña activa</span>
        </button>
      </div>

      {/* CAMPAIGN EDITING WORKSPACE */}
      <div className="space-y-8">
        {/* Campaign Info */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#005F73] mb-1">Campaña Activa</p>
              <input
                type="text"
                value={campaign.name}
                onChange={(e) => updateCampaignField('name', e.target.value)}
                className="font-display text-2xl font-black text-slate-800 bg-transparent hover:bg-slate-50 border-b border-transparent hover:border-slate-200 focus:bg-slate-50 focus:border-[#005F73] px-2 py-1 outline-none rounded-lg w-full sm:w-[400px]"
              />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Launch Date */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5">
                <Calendar size={14} className="text-slate-400" />
                <input
                  type="date"
                  value={campaign.startDate}
                  onChange={(e) => updateCampaignField('startDate', e.target.value)}
                  className="bg-transparent outline-none cursor-pointer text-slate-600 font-bold"
                />
              </div>

              {/* Status Select */}
              <select
                value={campaign.status}
                onChange={(e) => updateCampaignField('status', e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none cursor-pointer"
              >
                <option value="draft">Borrador</option>
                <option value="scheduled">Programada</option>
                <option value="active">Activa</option>
                <option value="completed">Completada</option>
              </select>
            </div>
          </div>

          {/* Objective */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Objetivo Estratégico</span>
            <textarea
              value={campaign.objective}
              onChange={(e) => updateCampaignField('objective', e.target.value)}
              className="w-full text-sm font-semibold text-slate-600 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 min-h-[80px] focus:bg-white focus:border-[#005F73] outline-none transition-all"
              placeholder="¿Qué quieres conseguir con esta campaña?"
            />
          </div>

          {/* Platform selection checklists */}
          <div className="space-y-3 pt-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Canales de difusión</span>
            <div className="flex flex-wrap gap-2.5">
              {platforms.map((plat) => {
                const isSelected = campaign.platforms.includes(plat.id);
                return (
                  <button
                    key={plat.id}
                    onClick={() => {
                      const nextPlats = isSelected
                        ? campaign.platforms.filter(p => p !== plat.id)
                        : [...campaign.platforms, plat.id];
                      updateCampaignField('platforms', nextPlats);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <span style={{ color: isSelected ? '#FFFFFF' : plat.color }}>{plat.icon}</span>
                    <span>{plat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dynamic Graphic Campaign Banners generator */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display text-xl font-black">Activos Visuales de Campaña</h3>
              <p className="text-slate-400 text-xs mt-1">Banners promocionales personalizados listos para descargar en alta definición.</p>
            </div>
            <Sparkles className="text-[#005F73] w-5 h-5 animate-pulse" />
          </div>

          {exportMessage && (
            <div className="bg-[#EBF7F4] border border-[#94D2BD]/30 py-2.5 px-4 rounded-xl text-center text-xs font-bold text-[#005F73] animate-pulse">
              {exportMessage}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {campaign.assets.map((asset) => {
              const currentTitle = customTitles[asset.id] ?? asset.customTitle ?? 'VitaBlue Seguros';
              const currentTagline = customTaglines[asset.id] ?? asset.customTagline ?? 'Protección que se adapta a tu vida';
              const currentTheme = assetThemes[asset.id] ?? asset.theme;

              return (
                <div key={asset.id} className="border border-slate-200 rounded-3xl p-5 bg-slate-50/30 flex flex-col justify-between gap-5 hover:shadow-sm transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-xs font-black text-slate-800">{asset.name}</span>
                        <span className="block text-[10px] text-slate-400 font-semibold">{asset.dimensions.width}x{asset.dimensions.height} px ({asset.type})</span>
                      </div>
                      
                      {/* Theme switcher */}
                      <select
                        value={currentTheme}
                        onChange={(e) => setAssetThemes({ ...assetThemes, [asset.id]: e.target.value as any })}
                        className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer bg-white"
                      >
                        <option value="gradient">Degradado</option>
                        <option value="dark">Fondo Oscuro</option>
                        <option value="light">Fondo Claro</option>
                      </select>
                    </div>

                    {/* Content Customizer */}
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Título de Banner</label>
                        <input
                          type="text"
                          value={currentTitle}
                          onChange={(e) => setCustomTitles({ ...customTitles, [asset.id]: e.target.value })}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-[#005F73] outline-none"
                        />
                      </div>
                      
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Tagline / Subtítulo</label>
                        <input
                          type="text"
                          value={currentTagline}
                          onChange={(e) => setCustomTaglines({ ...customTaglines, [asset.id]: e.target.value })}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-[#005F73] outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExportAsset(asset)}
                    disabled={isExporting}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-[#005F73] hover:bg-[#004f5e] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    <Download size={14} />
                    <span>Descargar {asset.type === 'story' ? 'Story' : 'Post'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Copywriting & Post live feed preview */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-left">
          <div>
            <h3 className="font-display text-xl font-black">Planificador de Contenido y Previsualización</h3>
            <p className="text-slate-400 text-xs mt-1">Escribe los textos publicitarios y previsualiza cómo se verá la publicación en cada canal.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Copywriter list */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Redacción por Red Social</span>
              
              {campaign.platforms.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl text-center text-xs font-semibold text-slate-400">
                  Selecciona al menos un canal arriba para redactar sus publicaciones.
                </div>
              ) : (
                <div className="space-y-4">
                  {campaign.platforms.map((platformId) => {
                    const plat = platforms.find(p => p.id === platformId);
                    if (!plat) return null;
                    return (
                      <div key={platformId} className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <span style={{ color: plat.color }}>{plat.icon}</span>
                          <span>Publicación en {plat.name}</span>
                        </div>
                        <textarea
                          value={campaign.copies[platformId] || ''}
                          onChange={(e) => updateCopy(platformId, e.target.value)}
                          className="w-full text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 rounded-2xl p-3 min-h-[90px] focus:bg-white focus:border-[#005F73] outline-none"
                          placeholder={`Escribe el copy promocional para ${plat.name}...`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Post Live Feed Mockup */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Previsualizador de Post</span>
                
                {/* Mockup filter tabs */}
                <div className="flex gap-1.5">
                  {campaign.platforms.map((platformId) => {
                    const isActive = mockupPlatform === platformId;
                    const plat = platforms.find(p => p.id === platformId);
                    if (!plat) return null;
                    return (
                      <button
                        key={platformId}
                        onClick={() => setMockupPlatform(platformId)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-[#005F73]/10 border-[#005F73] text-[#005F73]' 
                            : 'border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={`Previsualizar en ${plat.name}`}
                      >
                        {plat.icon}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feed Card container mockup */}
              <div className="bg-[#EBF1F3] rounded-3xl p-6 flex items-center justify-center min-h-[380px]">
                {!campaign.platforms.includes(mockupPlatform) && campaign.platforms.length > 0 ? (
                  <button 
                    onClick={() => setMockupPlatform(campaign.platforms[0])}
                    className="text-xs font-bold text-[#005F73] underline"
                  >
                    Activa previsualización para {platforms.find(p => p.id === campaign.platforms[0])?.name}
                  </button>
                ) : campaign.platforms.length === 0 ? (
                  <span className="text-xs font-semibold text-slate-400">Sin vista previa</span>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md w-full max-w-[340px] overflow-hidden text-left p-4 space-y-3 font-sans">
                    {/* Header: User avatar + info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#001219] flex items-center justify-center select-none overflow-hidden border border-slate-100">
                          <Logo iconSize={18} showText={false} showTagline={false} variant="colored-on-dark" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-900 leading-none">VitaBlue</span>
                          <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">
                            {socialProfiles[mockupPlatform]?.user || `@vitablueseguros`}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-400" />
                    </div>

                    {/* Copywriting caption */}
                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {campaign.copies[mockupPlatform] || 'Escribe un copy en el panel lateral para verlo reflejado aquí...'}
                    </p>

                    {/* Banner Card Graphic preview */}
                    <div className="w-full aspect-square bg-[#001219] rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-100">
                      <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#94D2BD]/20 blur-xl" />
                      <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-[#94D2BD]/10 blur-xl" />
                      
                      {/* Scaled view of the square post banner */}
                      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-3">
                        <Logo iconSize={32} showText={false} showTagline={false} variant="colored-on-dark" />
                        <p className="mt-2 font-display font-black text-white text-sm leading-none">
                          {customTitles[campaign.assets[0]?.id] ?? campaign.assets[0]?.customTitle ?? 'VitaBlue Seguros'}
                        </p>
                        <p className="mt-1 font-semibold text-[#94D2BD] text-[8px] leading-tight max-w-[180px]">
                          {customTaglines[campaign.assets[0]?.id] ?? campaign.assets[0]?.customTagline ?? 'Protección que se adapta a tu vida'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
