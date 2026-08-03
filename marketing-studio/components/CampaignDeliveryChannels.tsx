import React from 'react';
import { Campaign } from '@/marketing-studio/utils/campaigns';
import { Connections } from '@/marketing-studio/utils/connections';
import { platformConfigs } from '@/marketing-studio/config/platforms';

interface CampaignDeliveryChannelsProps {
  campaign: Campaign;
  connections: Connections;
  onChange: (fields: Partial<Campaign>) => void;
}

export const CampaignDeliveryChannels: React.FC<CampaignDeliveryChannelsProps> = ({
  campaign,
  connections,
  onChange,
}) => {
  const automaticPlatforms = campaign.automaticPlatformsConfigured
    ? campaign.automaticPlatforms ?? []
    : campaign.platforms.filter((platform) => connections[platform]?.connected);

  return (
    <div className="space-y-3 pt-2">
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Canales de difusión</span>
      <p className="text-xs text-slate-500">Separa los canales que se publicarán mediante una conexión activa de los que prepararás y publicarás manualmente.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {platformConfigs.map((platform) => {
          const isSelected = campaign.platforms.includes(platform.id);
          const isConnected = connections[platform.id]?.connected;
          const isAutomatic = isSelected && automaticPlatforms.includes(platform.id);

          return (
            <div
              key={platform.id}
              className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all ${isSelected ? 'border-[#005F73]/40 bg-[#EBF7F4]/40' : 'border-slate-200 bg-white'}`}
            >
              <label className="flex min-w-0 cursor-pointer items-center gap-2 text-left text-xs font-bold">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                  const nextPlatforms = isSelected
                    ? campaign.platforms.filter((id) => id !== platform.id)
                    : [...campaign.platforms, platform.id];
                  const nextAutomatic = isSelected
                    ? automaticPlatforms.filter((id) => id !== platform.id)
                    : isConnected ? [...automaticPlatforms, platform.id] : automaticPlatforms;
                  onChange({ platforms: nextPlatforms, automaticPlatforms: nextAutomatic, automaticPlatformsConfigured: true });
                  }}
                  className="h-4 w-4 shrink-0 accent-[#005F73]"
                  aria-label={`${isSelected ? 'Deshabilitar' : 'Habilitar'} ${platform.name}`}
                />
                <span style={{ color: platform.color }}>{platform.icon}</span>
                <span className="truncate text-slate-800">{platform.name}</span>
              </label>
              {isSelected ? (
                <button
                  onClick={() => {
                    if (!isConnected && !isAutomatic) return;
                    const nextAutomatic = isAutomatic
                      ? automaticPlatforms.filter((id) => id !== platform.id)
                      : [...automaticPlatforms, platform.id];
                    onChange({ automaticPlatforms: nextAutomatic, automaticPlatformsConfigured: true });
                  }}
                  disabled={!isConnected && !isAutomatic}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wide transition-colors ${
                    isAutomatic
                      ? 'bg-emerald-100 text-emerald-700'
                      : isConnected
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                  title={isConnected ? 'Cambiar modo de publicación' : 'Conecta esta red para publicar automáticamente'}
                >
                  {isAutomatic ? 'Automático' : 'Manual'}
                </button>
              ) : (
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">Añadir</span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Automático: conexión activa</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400" /> Manual: copy y activo para publicar tú</span>
      </div>
    </div>
  );
};
