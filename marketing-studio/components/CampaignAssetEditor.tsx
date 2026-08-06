import React from 'react';
import { Download } from 'lucide-react';
import { CampaignAsset } from '@/marketing-studio/utils/campaigns';

interface CampaignAssetEditorProps {
  asset: CampaignAsset;
  isExporting: boolean;
  onChange: (fields: Partial<CampaignAsset>) => void;
  onDownload: () => void;
}

export const CampaignAssetEditor: React.FC<CampaignAssetEditorProps> = ({
  asset,
  isExporting,
  onChange,
  onDownload,
}) => (
  <div className="border border-slate-200 rounded-3xl p-5 bg-slate-50/30 flex flex-col justify-between gap-5 hover:shadow-sm transition-all">
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-xs font-black text-slate-800">{asset.name}</span>
          <span className="block text-[10px] text-slate-400 font-semibold">
            {asset.dimensions.width}x{asset.dimensions.height} px ({asset.type})
          </span>
        </div>
        <select
          value={asset.theme}
          onChange={(event) => onChange({ theme: event.target.value as CampaignAsset['theme'] })}
          className="text-[10px] font-bold border border-slate-200 rounded-lg px-2 py-1 outline-none cursor-pointer bg-white"
          aria-label={`Fondo de ${asset.name}`}
        >
          <option value="gradient">Degradado</option>
          <option value="dark">Fondo Oscuro</option>
          <option value="light">Fondo Claro</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Diseño / Ilustración</span>
          <select
            value={asset.illustration ?? 'logo'}
            onChange={(event) => onChange({ illustration: event.target.value as CampaignAsset['illustration'] })}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-primary outline-none cursor-pointer"
          >
            <option value="logo">Logotipo Corporativo VitaBlue</option>
            <option value="student">Ilustración de Estudiante (Visado)</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Título de Banner</span>
          <input
            type="text"
            value={asset.customTitle ?? ''}
            onChange={(event) => onChange({ customTitle: event.target.value })}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-primary outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase">Tagline / Subtítulo</span>
          <input
            type="text"
            value={asset.customTagline ?? ''}
            onChange={(event) => onChange({ customTagline: event.target.value })}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white focus:border-primary outline-none"
          />
        </label>
      </div>
    </div>

    <button
      onClick={onDownload}
      disabled={isExporting}
      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-2xl bg-primary hover:bg-primary-dark text-white text-xs font-bold cursor-pointer disabled:opacity-50"
    >
      <Download size={14} />
      <span>Descargar {asset.type === 'story' ? 'Story' : 'Post'}</span>
    </button>
  </div>
);
