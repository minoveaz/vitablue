import React from 'react';
import { ChevronRight } from 'lucide-react';
import Logo from '@/components/atoms/Logo';
import { CampaignAsset } from '@/marketing-studio/utils/campaigns';
import { SocialPlatformId } from '@/utils/socialProfiles';

interface CampaignPreviewProps {
  asset?: CampaignAsset;
  platform: SocialPlatformId;
  platformName: string;
  username: string;
  copy: string;
}

const getPreviewAspect = (platform: SocialPlatformId, assetType: CampaignAsset['type']) => {
  if (assetType === 'story') return 'aspect-[9/16] max-h-[330px]';
  if (platform === 'instagram') return 'aspect-[4/5]';
  if (platform === 'youtube') return 'aspect-video';
  return 'aspect-square';
};

export const CampaignPreview: React.FC<CampaignPreviewProps> = ({
  asset,
  platform,
  platformName,
  username,
  copy,
}) => {
  if (!asset) {
    return <span className="text-xs font-semibold text-slate-400">Sin activo visual</span>;
  }

  const background = asset.theme === 'light'
    ? 'bg-white'
    : asset.theme === 'gradient'
      ? 'bg-gradient-to-br from-primary via-primary-dark to-brand-cyan'
      : 'bg-primary-dark';
  const textColor = asset.theme === 'light' ? 'text-primary-dark' : 'text-white';
  const taglineColor = asset.theme === 'light' ? 'text-primary' : 'text-brand-cyan';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md w-full max-w-[340px] overflow-hidden text-left p-4 space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-dark flex items-center justify-center select-none overflow-hidden border border-slate-100">
            <Logo iconSize={18} showText={false} showTagline={false} variant="colored-on-dark" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900 leading-none">VitaBlue</span>
            <span className="block text-[9px] text-slate-400 font-semibold mt-0.5">{username}</span>
          </div>
        </div>
        <ChevronRight size={14} className="text-slate-400" />
      </div>

      <p className="text-[11px] text-slate-700 leading-relaxed font-medium whitespace-pre-line">
        {copy || `Escribe un copy para ${platformName}...`}
      </p>

      <div className={`w-full ${getPreviewAspect(platform, asset.type)} rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-100 ${background}`}>
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-brand-cyan/20 blur-xl" />
        <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-brand-cyan/10 blur-xl" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-5">
          <Logo iconSize={asset.type === 'story' ? 38 : 32} showText={false} showTagline={false} variant="colored-on-dark" />
          <p className={`mt-2 font-display font-black text-sm leading-tight ${textColor}`}>
            {asset.customTitle || 'VitaBlue Seguros'}
          </p>
          <p className={`mt-1 font-semibold text-[8px] leading-tight max-w-[180px] ${taglineColor}`}>
            {asset.customTagline || 'Protección que se adapta a tu vida'}
          </p>
        </div>
      </div>
    </div>
  );
};
