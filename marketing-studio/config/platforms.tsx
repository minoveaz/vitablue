import React from 'react';
import {
  Facebook,
  Instagram,
  Linkedin,
  Music2,
  Youtube,
} from 'lucide-react';
import { SocialPlatformId } from '@/utils/socialProfiles';

const XIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export interface PlatformConfig {
  id: SocialPlatformId;
  name: string;
  color: string;
  icon: React.ReactNode;
  recommendedSize: string;
  profileSize: { width: number; height: number };
  coverSize?: { width: number; height: number };
}

export const platformConfigs: PlatformConfig[] = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2', recommendedSize: '180 × 180 px', profileSize: { width: 180, height: 180 }, coverSize: { width: 820, height: 312 }, icon: <Facebook size={18} /> },
  { id: 'instagram', name: 'Instagram', color: '#D946EF', recommendedSize: '320 × 320 px', profileSize: { width: 320, height: 320 }, icon: <Instagram size={18} /> },
  { id: 'tiktok', name: 'TikTok', color: '#111827', recommendedSize: '200 × 200 px', profileSize: { width: 200, height: 200 }, icon: <Music2 size={18} /> },
  { id: 'youtube', name: 'YouTube', color: '#FF0033', recommendedSize: '800 × 800 px', profileSize: { width: 800, height: 800 }, coverSize: { width: 2560, height: 1440 }, icon: <Youtube size={18} /> },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2', recommendedSize: '300 × 300 px', profileSize: { width: 300, height: 300 }, coverSize: { width: 1584, height: 396 }, icon: <Linkedin size={18} /> },
  { id: 'x', name: 'X (Twitter)', color: '#0f172a', recommendedSize: '400 × 400 px', profileSize: { width: 400, height: 400 }, coverSize: { width: 1500, height: 500 }, icon: <XIcon size={16} /> },
];

export const getPlatformConfig = (platform: SocialPlatformId) => (
  platformConfigs.find((config) => config.id === platform) ?? platformConfigs[0]
);
