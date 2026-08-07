import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Campaign,
  CampaignAsset,
  saveCampaigns, 
  saveCampaignToSupabase,
} from '@/marketing-studio/utils/campaigns';
import { SocialPlatformId, getSocialProfiles } from '@/utils/socialProfiles';
import { getConnections } from '@/marketing-studio/utils/connections';
import { generateCampaignBannerSvg, downloadSvgAsPng } from '@/utils/svgGenerator';
import { CampaignDeliveryChannels } from '@/marketing-studio/components/CampaignDeliveryChannels';
import { CampaignContentWorkspace } from '@/marketing-studio/components/CampaignContentWorkspace';
import { CampaignLinksPanel } from '@/marketing-studio/components/CampaignLinksPanel';
import { CampaignPublicationsPanel } from '@/marketing-studio/components/CampaignPublicationsPanel';
import { CampaignReadinessPanel } from '@/marketing-studio/components/CampaignReadinessPanel';
import { CampaignActivityEntry, CampaignActivityPanel } from '@/marketing-studio/components/CampaignActivityPanel';
import { 
  ArrowLeft,
  Calendar, 
  Check,
  CircleAlert,
  LoaderCircle,
  Sparkles
} from 'lucide-react';

interface CampaignManagerProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  campaignId: string;
  canEdit: boolean;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, setCampaigns, campaignId, canEdit }) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [mockupPlatform, setMockupPlatform] = useState<SocialPlatformId>('instagram');
  const [previewAssetType, setPreviewAssetType] = useState<'post' | 'story'>('post');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [activity, setActivity] = useState<CampaignActivityEntry[]>(() => {
    try { return JSON.parse(window.localStorage.getItem(`vitablue.campaign-activity.${campaignId}`) || '[]'); } catch { return []; }
  });
  const saveTimerRef = useRef<number | null>(null);

  const campaign = campaigns.find((item) => item.id === campaignId);
  const socialProfiles = getSocialProfiles();
  const connections = getConnections();

  useEffect(() => () => {
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
  }, []);

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <Sparkles className="text-slate-300 w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold">Campaña no encontrada</h3>
        <p className="text-slate-500 max-w-sm mt-2">La campaña puede haber sido eliminada o todavía no se ha sincronizado.</p>
        <button
          onClick={() => navigate('/backoffice/marketing-studio/campanas')}
          className="mt-6 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver a campañas
        </button>
      </div>
    );
  }

  const persistCampaign = (nextCampaign: Campaign) => {
    const previous = campaigns.find((item) => item.id === nextCampaign.id);
    const changedField = previous && previous.name !== nextCampaign.name ? 'nombre' : previous && previous.objective !== nextCampaign.objective ? 'objetivo' : previous && previous.status !== nextCampaign.status ? 'estado' : previous && previous.startDate !== nextCampaign.startDate ? 'fecha' : previous && JSON.stringify(previous.platforms) !== JSON.stringify(nextCampaign.platforms) ? 'canales' : 'contenido';
    const entry: CampaignActivityEntry = { id: crypto.randomUUID(), label: `Se actualizó el ${changedField} de la campaña`, createdAt: new Date().toISOString() };
    const nextActivity = [entry, ...activity].slice(0, 12);
    setActivity(nextActivity);
    window.localStorage.setItem(`vitablue.campaign-activity.${nextCampaign.id}`, JSON.stringify(nextActivity));
    saveCampaigns(campaigns.map((item) => item.id === nextCampaign.id ? nextCampaign : item));
    setSaveState('saving');
    if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
    saveTimerRef.current = window.setTimeout(() => {
      void saveCampaignToSupabase(nextCampaign).then((saved) => {
        setSaveState(saved ? 'saved' : 'error');
      }).catch(() => {
        setSaveState('error');
      });
    }, 450);
  };

  const updateCampaignField = (field: keyof Campaign, value: unknown) => {
    if (!canEdit) return;
    const updated = campaigns.map(c => {
      if (c.id === campaign.id) {
        const next = { ...c, [field]: value };
        persistCampaign(next);
        return next;
      }
      return c;
    });
    setCampaigns(updated);
  };

  const updateCampaignFields = (fields: Partial<Campaign>) => {
    if (!canEdit) return;
    const updated = campaigns.map(c => {
      if (c.id === campaign.id) {
        const next = { ...c, ...fields };
        persistCampaign(next);
        return next;
      }
      return c;
    });
    setCampaigns(updated);
  };

  const updateCopy = (platform: SocialPlatformId, text: string) => {
    const nextCopies = { ...campaign.copies, [platform]: text };
    updateCampaignField('copies', nextCopies);
  };

  const updateAsset = (assetId: string, fields: Partial<CampaignAsset>) => {
    const nextAssets = campaign.assets.map((asset) => (
      asset.id === assetId ? { ...asset, ...fields } : asset
    ));
    updateCampaignField('assets', nextAssets);
  };

  const handleExportAsset = async (asset: CampaignAsset) => {
    setIsExporting(true);
    setExportMessage(null);
    try {
      const filename = `vitablue_campaign_${campaign.id}_${asset.type}_${Date.now()}.png`;
      const title = asset.customTitle ?? 'VitaBlue Seguros';
      const tagline = asset.customTagline ?? 'Protección que se adapta a tu vida';
      const theme = asset.theme;
      
      const svgString = generateCampaignBannerSvg(
        asset.dimensions.width,
        asset.dimensions.height,
        asset.type,
        theme,
        title,
        tagline,
        asset.illustration
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

  const handlePreparePublication = async () => {
    try {
      const asset = campaign.assets.find((item) => item.type === previewAssetType && item.id.includes(mockupPlatform))
        ?? campaign.assets.find((item) => item.type === previewAssetType)
        ?? campaign.assets[0];
      if (!asset) return;

      await handleExportAsset(asset);
      const caption = campaign.copies[mockupPlatform] || '';
      if (caption && navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
      }
      setExportMessage(`Activo de ${previewAssetType === 'story' ? 'Story' : 'Post'} descargado y copy copiado para ${mockupPlatform}.`);
    } catch (error) {
      console.error('Error preparing publication:', error);
      setExportMessage('No se pudo preparar la publicación. Descarga el activo manualmente.');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/backoffice/marketing-studio/campanas')}
        className="inline-flex items-center gap-2 text-xs font-black text-slate-500 transition-colors hover:text-primary"
      >
        <ArrowLeft size={14} /> Volver a campañas
      </button>

      <div className="space-y-8">
        {/* Campaign Info */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Configuración de campaña</p>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-black ${saveState === 'error' ? 'bg-rose-50 text-rose-600' : saveState === 'saving' ? 'bg-amber-50 text-amber-700' : saveState === 'saved' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`} aria-live="polite">
                  {saveState === 'saving' && <LoaderCircle size={11} className="animate-spin" />}
                  {saveState === 'saved' && <Check size={11} />}
                  {saveState === 'error' && <CircleAlert size={11} />}
                  {saveState === 'saving' ? 'Guardando...' : saveState === 'saved' ? 'Guardado' : saveState === 'error' ? 'Error al guardar' : 'Guardado automático'}
                </span>
              </div>
              <input
                type="text"
                value={campaign.name}
                onChange={(e) => updateCampaignField('name', e.target.value)}
                className="mt-1 w-full rounded-lg border-b border-transparent bg-transparent px-2 py-1 font-display text-2xl font-black text-slate-800 outline-none transition-colors hover:border-slate-200 hover:bg-slate-50 focus:border-primary focus:bg-slate-50 sm:w-[400px]"
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
              className="w-full text-sm font-semibold text-slate-600 bg-slate-50/50 border border-slate-100 rounded-2xl p-4 min-h-[80px] focus:bg-white focus:border-primary outline-none transition-all"
              placeholder="¿Qué quieres conseguir con esta campaña?"
            />
          </div>

          {/* Platform selection and delivery mode */}
          <CampaignDeliveryChannels campaign={campaign} connections={connections} onChange={updateCampaignFields} />
        </section>

        <CampaignReadinessPanel campaign={campaign} />

        <CampaignContentWorkspace
          campaign={campaign}
          socialProfiles={socialProfiles}
          isExporting={isExporting}
          exportMessage={exportMessage}
          platform={mockupPlatform}
          assetType={previewAssetType}
          onPlatformChange={setMockupPlatform}
          onContentTypesChange={(contentTypes) => updateCampaignField('contentTypes', contentTypes)}
          onAssetTypeChange={setPreviewAssetType}
          onCopyChange={updateCopy}
          onAssetChange={updateAsset}
          onDownload={handleExportAsset}
          onPreparePublication={handlePreparePublication}
        />

        <CampaignLinksPanel campaign={campaign} />

        <CampaignPublicationsPanel campaign={campaign} canEdit={canEdit} />

        <CampaignActivityPanel entries={activity} />
      </div>
    </div>
  );
};
