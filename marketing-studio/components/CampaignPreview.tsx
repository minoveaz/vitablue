import React from 'react';
import { ChevronRight } from 'lucide-react';
import Logo from '@/components/atoms/Logo';
import { StudentIllustration } from '@/components/illustrations/health/Student';
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
        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full text-center p-4 min-h-[220px]">
          {/* Small top logo for student illustration layout */}
          {asset.illustration === 'student' ? (
            <div className="flex items-center gap-2 justify-center mt-2">
              <div className="w-7 h-7 shrink-0 flex items-center justify-center">
                <Logo iconSize={26} showText={false} showTagline={false} variant={asset.theme === 'light' ? 'default' : 'colored-on-dark'} />
              </div>
              <span className={`font-display font-black text-sm tracking-tight ${textColor}`}>VitaBlue</span>
            </div>
          ) : (
            <div className="h-6" />
          )}

          {/* Center Graphic */}
          {asset.illustration === 'student' ? (
            <div className="relative w-44 h-28 flex items-center justify-center my-1 select-none">
              {/* Soft radial glow circle */}
              <div className="absolute inset-0 m-auto w-26 h-26 rounded-full bg-brand-cyan/25 blur-sm pointer-events-none" />
              <div className="relative z-10 w-36 h-26 text-primary shrink-0 flex items-center justify-center">
                <StudentIllustration />
              </div>
            </div>
          ) : (
            <div className="my-3 flex items-center justify-center">
              <Logo iconSize={asset.type === 'story' ? 44 : 36} showText={false} showTagline={false} variant="colored-on-dark" />
            </div>
          )}

          {/* Bottom Texts */}
          <div className="mb-1 w-full">
            <div className="flex items-center gap-1.5 justify-center">
              <p className={`font-display font-black text-sm leading-tight ${textColor}`}>
                {asset.customTitle || 'VitaBlue Seguros'}
              </p>
              {(asset.customTitle || '').includes('España') && (
                <div className="w-5 h-3.5 rounded-[3px] overflow-hidden border border-slate-200/20 flex flex-col shrink-0">
                  <div className="h-[25%] bg-[#AA151B]" />
                  <div className="h-[50%] bg-[#F1BF00]" />
                  <div className="h-[25%] bg-[#AA151B]" />
                </div>
              )}
            </div>
            <p className={`mt-1 font-semibold text-[9px] leading-tight max-w-[200px] mx-auto ${taglineColor}`}>
              {asset.customTagline || 'Protección que se adapta a tu vida'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
