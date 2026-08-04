import React from 'react';
import { Check } from 'lucide-react';
import { SocialPlatformId, SocialProfiles } from '@/utils/socialProfiles';

export interface SocialPlatformConfig {
  id: SocialPlatformId;
  name: string;
  profileSize: { width: number; height: number };
  coverSize?: { width: number; height: number };
  icon: React.ReactNode;
  accent: string;
}

interface SocialProfilesConfigPanelProps {
  platforms: SocialPlatformConfig[];
  activePlatform: SocialPlatformId;
  selectedPlatform: SocialPlatformConfig;
  selectedProfile: SocialProfiles[SocialPlatformId];
  useDarkBackground: boolean;
  exportMessage: string | null;
  onPlatformChange: (platform: SocialPlatformId) => void;
  onUrlChange: (url: string) => void;
  onDarkBackgroundChange: (enabled: boolean) => void;
}

const formatDimensions = (dimensions: { width: number; height: number }) => `${dimensions.width} × ${dimensions.height} px`;

const SocialProfilesConfigPanel: React.FC<SocialProfilesConfigPanelProps> = ({
  platforms,
  activePlatform,
  selectedPlatform,
  selectedProfile,
  useDarkBackground,
  exportMessage,
  onPlatformChange,
  onUrlChange,
  onDarkBackgroundChange,
}) => (
  <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
    <div>
      <p className="mb-1 text-xs font-black uppercase tracking-[0.18em] text-primary">Asset builder</p>
      <h3 className="font-display text-2xl font-black">Activos sociales</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">Configura los activos vectoriales de marca y visualiza su maquetación.</p>
    </div>

    <div className="space-y-2">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">Seleccionar plataforma</p>
      <div className="space-y-1.5">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            type="button"
            onClick={() => onPlatformChange(platform.id)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all ${
              activePlatform === platform.id ? 'border-primary bg-brand-cyan' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="flex items-center gap-3">
              <span style={{ color: platform.accent }}>{platform.icon}</span>
              <span>
                <span className="block text-sm font-bold text-slate-800">{platform.name}</span>
                <span className="block text-[10px] font-semibold text-slate-400">
                  Perfil: {formatDimensions(platform.profileSize)}
                  {platform.coverSize && ` | Portada: ${formatDimensions(platform.coverSize)}`}
                </span>
              </span>
            </span>
            {activePlatform === platform.id && <Check size={16} className="text-primary" />}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-4 border-t border-slate-100 pt-5">
      <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
        URL oficial de {selectedPlatform.name}
        <input
          type="url"
          value={selectedProfile.url}
          onChange={(event) => onUrlChange(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-primary"
          placeholder={`https://${activePlatform}.com/...`}
        />
      </label>

      <div className="rounded-xl bg-brand-cyan px-3.5 py-2.5">
        <p className="text-[10px] font-black uppercase tracking-wider text-primary">Usuario detectado</p>
        <p className="mt-0.5 text-sm font-bold text-primary-dark">{selectedProfile.user || 'Añade una URL para detectarlo'}</p>
      </div>

      <div className="space-y-2 border-t border-slate-100 pt-4">
        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Estilo de descarga (Perfil)</p>
        <label className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50 px-3.5 py-3 text-sm font-bold text-slate-700">
          <span>Fondo oscuro (Midnight)</span>
          <input
            type="checkbox"
            checked={useDarkBackground}
            onChange={(event) => onDarkBackgroundChange(event.target.checked)}
            className="h-4 w-4 cursor-pointer accent-primary"
          />
        </label>
      </div>
    </div>

    {exportMessage && (
      <p className="animate-pulse rounded-xl border border-brand-cyan/30 bg-brand-cyan py-2 text-center text-xs font-semibold text-primary">
        {exportMessage}
      </p>
    )}
  </section>
);

export default SocialProfilesConfigPanel;
