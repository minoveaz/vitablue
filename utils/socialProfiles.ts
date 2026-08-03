/// <reference types="vite/client" />

import { supabase } from './supabaseClient';

export type SocialPlatformId = 'facebook' | 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'x';

export interface SocialProfile {
  id: SocialPlatformId;
  name: string;
  url: string;
  user: string;
}

export type SocialProfiles = Record<SocialPlatformId, SocialProfile>;

export const defaultSocialProfiles: SocialProfiles = {
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/share/1FwKPbX8N7/?mibextid=wwXIfr',
    user: 'Página VitaBlue',
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/vitablue_seguros/',
    user: '@vitablue_seguros',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    url: 'https://www.tiktok.com/@vitablueseguros',
    user: '@vitablueseguros',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@VitaBlue-seguros',
    user: '@VitaBlue-seguros',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/vitablue-seguros/',
    user: '/company/vitablue-seguros',
  },
  x: {
    id: 'x',
    name: 'X (Twitter)',
    url: 'https://x.com/vitablueseguros',
    user: '@vitablueseguros',
  },
};

const storageKey = 'vitablue.social-profiles';
const profilesUpdatedEvent = 'vitablue:social-profiles-updated';

export const extractSocialUser = (url: string, platform: SocialPlatformId): string => {
  if (!url.trim()) return '';

  try {
    const parsedUrl = new URL(url.trim());
    const segments = parsedUrl.pathname.split('/').filter(Boolean);
    const handleSegment = segments.find((segment) => segment.startsWith('@'));

    if (handleSegment) return handleSegment;
    if (platform === 'linkedin' && segments[0] === 'company' && segments[1]) return `/${segments[0]}/${segments[1]}`;
    if (platform === 'facebook' && segments[0] === 'share') return 'Página VitaBlue';
    if (platform === 'youtube' && segments[0] === 'channel' && segments[1]) return segments[1];

    return segments.at(-1) ? `@${decodeURIComponent(segments.at(-1) ?? '')}` : '';
  } catch {
    return '';
  }
};

export const getSocialProfiles = (): SocialProfiles => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return defaultSocialProfiles;

  try {
    const storedProfiles = window.localStorage.getItem(storageKey);
    if (!storedProfiles) return defaultSocialProfiles;
    const parsedProfiles = JSON.parse(storedProfiles) as Partial<SocialProfiles>;
    const mergedProfiles = { ...defaultSocialProfiles, ...parsedProfiles };

    (['youtube', 'linkedin', 'x'] as const).forEach((platform) => {
      if (!parsedProfiles[platform]?.url) {
        mergedProfiles[platform] = defaultSocialProfiles[platform];
      }
    });

    return mergedProfiles;
  } catch {
    return defaultSocialProfiles;
  }
};

export const saveSocialProfiles = (profiles: SocialProfiles): void => {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(profiles));
  window.dispatchEvent(new CustomEvent(profilesUpdatedEvent, { detail: profiles }));
};

export const socialProfilesUpdatedEvent = profilesUpdatedEvent;

export const syncSocialProfilesWithSupabase = async (): Promise<SocialProfiles> => {
  try {
    const { data, error } = await supabase
      .from('social_profiles')
      .select('*');

    if (error) {
      console.warn('Supabase social_profiles fetch failed:', error.message);
      return getSocialProfiles();
    }

    if (data && data.length > 0) {
      const loaded: Partial<SocialProfiles> = {};
      data.forEach((row) => {
        const platform = row.platform as SocialPlatformId;
        loaded[platform] = {
          id: platform,
          name: defaultSocialProfiles[platform]?.name || platform,
          url: row.url,
          user: row.username || ''
        };
      });

      const merged = { ...getSocialProfiles(), ...loaded };
      saveSocialProfiles(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Network error syncing social profiles:', err);
  }
  return getSocialProfiles();
};

export const saveSocialProfilesToSupabase = async (profiles: SocialProfiles): Promise<void> => {
  try {
    const rows = Object.values(profiles).map((profile) => ({
      platform: profile.id,
      url: profile.url,
      username: profile.user,
      updated_at: new Date().toISOString()
    }));

    const { error } = await supabase
      .from('social_profiles')
      .upsert(rows);

    if (error) {
      console.warn('Could not save social profiles to Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Network error saving social profiles to Supabase:', err);
  }
};