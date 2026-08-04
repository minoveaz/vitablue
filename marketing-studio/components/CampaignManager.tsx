import React, { useState } from 'react';
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
import { 
  ArrowLeft,
  Calendar, 
  Sparkles
} from 'lucide-react';

interface CampaignManagerProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  campaignId: string;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ campaigns, setCampaigns, campaignId }) => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [mockupPlatform, setMockupPlatform] = useState<SocialPlatformId>('instagram');
  const [previewAssetType, setPreviewAssetType] = useState<'post' | 'story'>('post');

  const campaign = campaigns.find((item) => item.id === campaignId);
  const socialProfiles = getSocialProfiles();
  const connections = getConnections();

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 shadow-sm text-center">
        <Sparkles className="text-slate-300 w-16 h-16 mb-4" />
        <h3 className="text-xl font-bold">Campaña no encontrada</h3>
        <p className="text-slate-500 max-w-sm mt-2">La campaña puede haber sido eliminada o todavía no se ha sincronizado.</p>
        <button
          onClick={() => navigate('/marketing-studio/campanas')}
          className="mt-6 px-5 py-2.5 bg-[#005F73] hover:bg-[#004f5e] text-white font-bold text-sm rounded-xl flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft size={16} /> Volver a campañas
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

  const updateCampaignFields = (fields: Partial<Campaign>) => {
    const updated = campaigns.map(c => {
      if (c.id === campaign.id) {
        const next = { ...c, ...fields };
        saveCampaignToSupabase(next);
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

  const handlePrepareInstagram = async () => {
    try {
      const asset = campaign.assets.find((item) => item.type === previewAssetType) ?? campaign.assets[0];
      if (!asset) return;

      await handleExportAsset(asset);
      const caption = campaign.copies.instagram || '';
      if (caption && navigator.clipboard) {
        await navigator.clipboard.writeText(caption);
      }
      setExportMessage(`Activo de ${previewAssetType === 'story' ? 'Story' : 'Post'} descargado y caption copiado para Instagram.`);
    } catch (error) {
      console.error('Error preparing Instagram publication:', error);
      setExportMessage('No se pudo preparar la publicación de Instagram. Descarga el activo manualmente.');
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/marketing-studio/campanas')}
        className="inline-flex items-center gap-2 text-xs font-black text-slate-500 transition-colors hover:text-[#005F73]"
      >
        <ArrowLeft size={14} /> Volver a campañas
      </button>

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

          {/* Platform selection and delivery mode */}
          <CampaignDeliveryChannels campaign={campaign} connections={connections} onChange={updateCampaignFields} />
        </section>

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
          onPrepareInstagram={handlePrepareInstagram}
        />
      </div>
    </div>
  );
};
