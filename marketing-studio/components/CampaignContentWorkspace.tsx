import React from 'react';
import { FileText, MonitorPlay } from 'lucide-react';
import { Campaign, CampaignAsset } from '@/marketing-studio/utils/campaigns';
import { SocialPlatformId, SocialProfiles } from '@/utils/socialProfiles';
import { CampaignAssetEditor } from '@/marketing-studio/components/CampaignAssetEditor';
import { CampaignPreview } from '@/marketing-studio/components/CampaignPreview';
import { CampaignContentTypeSelector } from '@/marketing-studio/components/CampaignContentTypeSelector';
import { platformConfigs } from '@/marketing-studio/config/platforms';

interface CampaignContentWorkspaceProps {
  campaign: Campaign;
  socialProfiles: SocialProfiles;
  isExporting: boolean;
  exportMessage: string | null;
  platform: SocialPlatformId;
  assetType: 'post' | 'story';
  onPlatformChange: (platform: SocialPlatformId) => void;
  onContentTypesChange: (types: Campaign['contentTypes']) => void;
  onAssetTypeChange: (type: 'post' | 'story') => void;
  onCopyChange: (platform: SocialPlatformId, text: string) => void;
  onAssetChange: (assetId: string, fields: Partial<CampaignAsset>) => void;
  onDownload: (asset: CampaignAsset) => void;
  onPrepareInstagram: () => void;
}

export const CampaignContentWorkspace: React.FC<CampaignContentWorkspaceProps> = ({
  campaign,
  socialProfiles,
  isExporting,
  exportMessage,
  platform,
  assetType,
  onPlatformChange,
  onContentTypesChange,
  onAssetTypeChange,
  onCopyChange,
  onAssetChange,
  onDownload,
  onPrepareInstagram,
}) => {
  const selectedPlatform = platformConfigs.find((item) => item.id === platform);
  const selectedAsset = campaign.assets.find((asset) => asset.type === assetType) ?? campaign.assets[0];
  const selectedAssetIndex = selectedAsset ? campaign.assets.indexOf(selectedAsset) : -1;
  const hasVideo = campaign.contentTypes?.includes('video');

  return (
    <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm sm:p-8">
      <header className="flex flex-col gap-2 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <MonitorPlay size={18} className="text-primary" />
          <h3 className="font-display text-xl font-black">Centro de contenido</h3>
        </div>
        <p className="text-xs text-slate-400">Selecciona una red y un formato para editar el copy, el activo y su previsualización en un mismo espacio.</p>
      </header>

      <CampaignContentTypeSelector
        value={campaign.contentTypes ?? ['text']}
        onChange={onContentTypesChange}
      />

      <div className="flex flex-wrap items-center gap-2">
        {campaign.platforms.map((platformId) => {
          const config = platformConfigs.find((item) => item.id === platformId);
          if (!config) return null;
          const isSelected = platformId === platform;
          return (
            <button
              key={platformId}
              type="button"
              onClick={() => onPlatformChange(platformId)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-black transition-all ${isSelected ? 'border-primary bg-brand-cyan text-primary shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
              title={`Editar contenido de ${config.name}`}
            >
              <span style={{ color: config.color }}>{config.icon}</span>
              {config.name}
            </button>
          );
        })}
        {campaign.platforms.length === 0 && <span className="text-xs font-semibold text-slate-400">Activa al menos un canal para crear contenido.</span>}
      </div>

      {campaign.platforms.length > 0 && (
        <div className="grid gap-6 xl:grid-cols-[minmax(220px,0.8fr)_minmax(320px,1fr)_minmax(240px,0.8fr)]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contenido de {selectedPlatform?.name}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary"><FileText size={12} /> Texto</span>
            </div>
            <textarea
              value={campaign.copies[platform] || ''}
              onChange={(event) => onCopyChange(platform, event.target.value)}
              className="min-h-[180px] w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-semibold leading-relaxed text-slate-600 outline-none transition-all focus:border-primary focus:bg-white"
              placeholder={`Escribe el copy promocional para ${selectedPlatform?.name}...`}
            />
            <div className="rounded-2xl bg-slate-50 p-3 text-[10px] font-semibold leading-relaxed text-slate-400">
              El copy generado automáticamente se puede modificar antes de preparar o descargar la publicación.
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Previsualización</span>
              <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                {(['post', 'story'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onAssetTypeChange(type)}
                    className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase transition-colors ${assetType === type ? 'bg-white text-primary shadow-sm' : 'text-slate-500'}`}
                  >
                    {type === 'post' ? 'Post' : 'Story'}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-semibold text-slate-400">
              {selectedPlatform?.name} · {assetType === 'story' ? 'vertical 9:16' : selectedPlatform?.id === 'instagram' ? 'feed vertical 4:5' : 'feed cuadrado'}
            </p>
            <div className="flex min-h-[400px] items-center justify-center rounded-3xl bg-[#EBF1F3] p-5">
              <CampaignPreview
                asset={selectedAsset}
                platform={platform}
                platformName={selectedPlatform?.name ?? platform}
                username={socialProfiles[platform]?.user || '@vitablueseguros'}
                copy={campaign.copies[platform] || ''}
              />
            </div>
            {platform === 'instagram' && (
              <button
                type="button"
                onClick={onPrepareInstagram}
                disabled={isExporting || !selectedAsset}
                className="w-full rounded-xl bg-[#D946EF] px-3 py-2.5 text-[10px] font-black text-white transition-colors hover:bg-[#c026d3] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Preparar Instagram
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Activo seleccionado</span>
              {selectedAsset && <span className="text-[10px] font-bold text-slate-400">{selectedAssetIndex + 1}/{campaign.assets.length}</span>}
            </div>
            {selectedAsset ? (
              <CampaignAssetEditor
                asset={selectedAsset}
                isExporting={isExporting}
                onChange={(fields) => onAssetChange(selectedAsset.id, fields)}
                onDownload={() => onDownload(selectedAsset)}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs font-semibold text-slate-400">No hay activos visuales para este formato.</div>
            )}
            {hasVideo && <div className="rounded-2xl border border-dashed border-slate-200 p-3 text-[10px] font-bold text-slate-400">El contenido de vídeo estará disponible en la siguiente iteración.</div>}
            {exportMessage && <p className="rounded-xl bg-brand-cyan px-3 py-2 text-center text-[10px] font-bold text-primary">{exportMessage}</p>}
          </div>
        </div>
      )}
    </section>
  );
};
