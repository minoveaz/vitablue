import React, { useState } from 'react';
import { ArrowRight, Calendar, Plus, Sparkles, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign, deleteCampaign, generateCampaignCopies, saveCampaignToSupabase, saveCampaigns } from '@/marketing-studio/utils/campaigns';
import { getConnections } from '@/marketing-studio/utils/connections';
import { SocialPlatformId } from '@/utils/socialProfiles';
import { platformConfigs } from '@/marketing-studio/config/platforms';
import ConfirmModal from '@/components/molecules/ConfirmModal';

interface CampaignOverviewProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  canEdit: boolean;
  canDelete: boolean;
}

const statusLabels: Record<Campaign['status'], string> = {
  draft: 'Borrador',
  scheduled: 'Programada',
  active: 'Activa',
  completed: 'Completada',
};

const statusColors: Record<Campaign['status'], string> = {
  draft: 'bg-slate-100 text-slate-700 border-slate-200',
  scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export const CampaignOverview: React.FC<CampaignOverviewProps> = ({ campaigns, setCampaigns, canEdit, canDelete }) => {
  const navigate = useNavigate();
  const connections = getConnections();
  const [isCreating, setIsCreating] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('Lanzamiento de Marca');
  const [pendingDelete, setPendingDelete] = useState<Campaign | null>(null);

  const handleCreateCampaign = async () => {
    if (!canEdit) return;
    const name = newCampaignName.trim();
    if (!name) return;

    const now = Date.now();
    const baseId = name
      .toLocaleLowerCase('es')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '')
      .replace('-de-', '-');
    const campaignId = campaigns.some((campaign) => campaign.id === baseId)
      ? `${baseId}-${now}`
      : baseId || `campaign-${now}`;
    const newCampaign: Campaign = {
      id: campaignId,
      name,
      objective: 'Define el objetivo estratégico de esta campaña publicitaria...',
      status: 'draft',
      startDate: new Date().toISOString().split('T')[0],
      platforms: platformConfigs.map((platform) => platform.id),
      contentTypes: ['text'],
      automaticPlatforms: platformConfigs
        .map((platform) => platform.id)
        .filter((platform) => connections[platform as SocialPlatformId]?.connected) as SocialPlatformId[],
      automaticPlatformsConfigured: true,
      copies: generateCampaignCopies(name, platformConfigs.map((platform) => platform.id)),
      assets: [
        {
          id: `asset-${now}-1`,
          name: 'Post Promocional (1x1)',
          type: 'post',
          dimensions: { width: 1080, height: 1080 },
          theme: 'gradient',
          customTitle: 'VitaBlue Seguros',
          customTagline: 'Protección que se adapta a tu vida',
        },
        {
          id: `asset-${now}-2`,
          name: 'Banner Stories (9x16)',
          type: 'story',
          dimensions: { width: 1080, height: 1920 },
          theme: 'dark',
          customTitle: 'Seguros VitaBlue',
          customTagline: 'Encuentra tu seguro de salud ideal',
        },
      ],
    };

    const nextCampaigns = [newCampaign, ...campaigns];
    setCampaigns(nextCampaigns);
    saveCampaigns(nextCampaigns);
    await saveCampaignToSupabase(newCampaign);
    setNewCampaignName('');
    setIsCreating(false);
    navigate(`/marketing-studio/campanas/${newCampaign.id}`);
  };

  const handleDeleteCampaign = async (campaign: Campaign) => {
    if (!canDelete) return;
    setPendingDelete(campaign);
  };

  const performDeleteCampaign = async (campaign: Campaign) => {
    await deleteCampaign(campaign.id, campaigns);
    const remaining = campaigns.filter((item) => item.id !== campaign.id);
    setCampaigns(remaining);
    saveCampaigns(remaining);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#005F73]">Workspace de campañas</p>
          <h2 className="mt-1 font-display text-3xl font-black text-slate-900">Campañas activas</h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500">Consulta el estado de cada campaña y entra en una para gestionar su estrategia, canales, copies y activos.</p>
        </div>
        <button
          onClick={() => setIsCreating((value) => !value)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#005F73] px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-[#004f5e]"
        >
          <Plus size={15} /> Nueva campaña
        </button>
      </header>

      {isCreating && (
        <div className="space-y-4 rounded-2xl border border-dashed border-[#005F73]/40 bg-[#EBF7F4]/40 p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              autoFocus
              value={newCampaignName}
              onChange={(event) => setNewCampaignName(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleCreateCampaign()}
              placeholder="Nombre de campaña..."
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#005F73]"
            />
            <button onClick={handleCreateCampaign} className="rounded-xl bg-[#005F73] px-4 py-2 text-xs font-black text-white">Crear campaña</button>
          </div>
        </div>
      )}

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
          <Sparkles className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="text-xl font-bold text-slate-900">No hay campañas disponibles</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">Crea tu primera campaña para empezar a planificar tus publicaciones.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <article key={campaign.id} className="group flex min-h-[220px] flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#005F73]/40 hover:shadow-md">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase ${statusColors[campaign.status]}`}>
                    {statusLabels[campaign.status]}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">#{campaign.id}</span>
                </div>
                <h3 className="mt-5 line-clamp-2 font-display text-xl font-black text-slate-900">{campaign.name}</h3>
                <p className="mt-2 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">{campaign.objective}</p>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><Calendar size={12} /> {campaign.startDate || 'Sin fecha'}</span>
                  <span>{campaign.platforms.length} canales</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    {campaign.platforms.slice(0, 5).map((platformId) => {
                      const platform = platformConfigs.find((item) => item.id === platformId);
                      return platform ? <span key={platform.id} style={{ color: platform.color }} title={platform.name}>{platform.icon}</span> : null;
                    })}
                  </div>
                  <button onClick={() => navigate(`/marketing-studio/campanas/${campaign.id}`)} className="inline-flex items-center gap-1 rounded-xl bg-[#005F73] px-3 py-2 text-[10px] font-black text-white transition-colors hover:bg-[#004f5e]">
                    Abrir <ArrowRight size={12} />
                  </button>
                  <button onClick={() => handleDeleteCampaign(campaign)} title="Eliminar campaña" className="rounded-xl border border-rose-100 p-2 text-rose-500 transition-colors hover:bg-rose-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      <ConfirmModal
        open={Boolean(pendingDelete)}
        variant="danger"
        title="Eliminar campaña"
        description={pendingDelete ? `¿Seguro que deseas eliminar “${pendingDelete.name}”? Esta acción no se puede deshacer.` : undefined}
        confirmLabel="Eliminar campaña"
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          if (pendingDelete) await performDeleteCampaign(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
};
