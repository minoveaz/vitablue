import React from 'react';
import { Check, CircleAlert, ClipboardCheck, Link2, Palette, Type } from 'lucide-react';
import { Campaign } from '@/marketing-studio/utils/campaigns';
import { getConnections } from '@/marketing-studio/utils/connections';
import { getMarketingLinks } from '@/marketing-studio/utils/marketingLinks';
import { getPlatformConfig } from '@/marketing-studio/config/platforms';

interface CampaignReadinessPanelProps {
  campaign: Campaign;
}

interface ReadinessItem {
  label: string;
  complete: boolean;
  detail: string;
}

export const CampaignReadinessPanel: React.FC<CampaignReadinessPanelProps> = ({ campaign }) => {
  const connections = getConnections();
  const campaignLinks = getMarketingLinks().filter((link) => link.campaignId === campaign.id);
  const hasCreative = campaign.assets.length > 0;
  const configuredPlatforms = campaign.platforms.filter((platform) => {
    const copyReady = Boolean(campaign.copies[platform]?.trim());
    const assetReady = hasCreative;
    const linkReady = campaignLinks.some((link) => link.channel === platform && link.active);
    return copyReady && assetReady && linkReady;
  });
  const platformWarnings = campaign.platforms.flatMap((platform) => {
    const warnings: string[] = [];
    const copyLength = campaign.copies[platform]?.trim().length ?? 0;
    if (!copyLength) warnings.push('falta copy');
    if (!hasCreative) warnings.push('falta creativo');
    if (!campaignLinks.some((link) => link.channel === platform)) warnings.push('falta enlace');
    if ((platform === 'facebook' || platform === 'instagram') && !connections[platform]?.connected) warnings.push('sin conexión');
    if (platform === 'x' && copyLength > 280) warnings.push('copy supera 280 caracteres');
    return warnings.length ? [{ platform, warnings }] : [];
  });
  const readinessItems: ReadinessItem[] = [
    { label: 'Nombre y objetivo', complete: Boolean(campaign.name.trim() && campaign.objective.trim()), detail: 'Identidad y propósito definidos' },
    { label: 'Fecha y estado', complete: Boolean(campaign.startDate && campaign.status), detail: 'Planificación temporal configurada' },
    { label: 'Canales preparados', complete: campaign.platforms.length > 0 && configuredPlatforms.length === campaign.platforms.length, detail: `${configuredPlatforms.length} de ${campaign.platforms.length} plataformas con copy, activo y enlace` },
    { label: 'Enlaces de campaña', complete: campaign.platforms.length > 0 && configuredPlatforms.length === campaign.platforms.length, detail: campaignLinks.length ? `${configuredPlatforms.length} de ${campaign.platforms.length} plataformas con enlace activo y tracking` : 'Añade un enlace por plataforma para medir clics' },
  ];
  const completed = readinessItems.filter((item) => item.complete).length;
  const percentage = Math.round((completed / readinessItems.length) * 100);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm" aria-labelledby="campaign-readiness-title">
      <div className="flex flex-col gap-5 border-b border-slate-100 bg-slate-50/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <ClipboardCheck size={18} />
            <p className="text-[10px] font-black uppercase tracking-[0.18em]">Control de lanzamiento</p>
          </div>
          <h2 id="campaign-readiness-title" className="mt-1 font-display text-xl font-black text-slate-800">Preparación de campaña</h2>
          <p className="mt-1 text-xs font-semibold text-slate-500">Comprueba lo esencial antes de llevar el contenido a Meta Business Suite.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200" aria-label={`${percentage}% preparado`}>
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <strong className="text-sm font-black text-primary">{percentage}%</strong>
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
        {readinessItems.map((item) => (
          <div key={item.label} className={`rounded-2xl border p-4 ${item.complete ? 'border-emerald-100 bg-emerald-50/60' : 'border-amber-100 bg-amber-50/60'}`}>
            <div className="flex items-start gap-2">
              {item.complete ? <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" /> : <CircleAlert size={16} className="mt-0.5 shrink-0 text-amber-600" />}
              <p className="text-xs font-black text-slate-700">{item.label}</p>
            </div>
            <p className="mt-2 text-[10px] font-semibold leading-relaxed text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-t border-slate-100 p-6 sm:grid-cols-2 lg:grid-cols-3 sm:p-8">
        {campaign.platforms.map((platform) => {
          const config = getPlatformConfig(platform);
          const copyReady = Boolean(campaign.copies[platform]?.trim());
          const assetReady = hasCreative;
          const connectionReady = connections[platform]?.connected ?? false;
          return (
            <div key={platform} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span style={{ color: config.color }}>{config.icon}</span>
                <span className="truncate text-xs font-black text-slate-700">{config.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-slate-400" title="Copy, activo y conexión">
                <span className={copyReady ? 'text-emerald-600' : 'text-amber-500'}><Type size={13} /></span>
                <span className={assetReady ? 'text-emerald-600' : 'text-amber-500'}><Palette size={13} /></span>
                <span className={connectionReady ? 'text-emerald-600' : 'text-slate-300'}><Link2 size={13} /></span>
              </div>
            </div>
          );
        })}
      </div>
      {platformWarnings.length > 0 && <div className="border-t border-amber-100 bg-amber-50/50 p-6 sm:p-8"><p className="text-[10px] font-black uppercase tracking-wider text-amber-700">Revisión antes de publicar</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{platformWarnings.map(({ platform, warnings }) => <p key={platform} className="text-xs font-semibold text-amber-800"><strong>{getPlatformConfig(platform).name}:</strong> {warnings.join(' · ')}</p>)}</div></div>}
    </section>
  );
};
