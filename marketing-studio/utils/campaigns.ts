/// <reference types="vite/client" />

import { supabase } from './supabaseClient';
import { SocialPlatformId } from '@/utils/socialProfiles';

export interface CampaignAsset {
  id: string;
  name: string;
  type: 'post' | 'story' | 'banner';
  dimensions: { width: number; height: number };
  theme: 'dark' | 'light' | 'gradient';
  customTitle?: string;
  customTagline?: string;
}

export type CampaignContentType = 'text' | 'video';

export const generateCampaignCopies = (
  campaignName: string,
  platforms: SocialPlatformId[],
): Record<SocialPlatformId, string> => {
  const subject = campaignName || 'esta campaña';
  const copies: Record<SocialPlatformId, string> = {
    facebook: `Presentamos ${subject}: una nueva forma de encontrar el seguro de salud que necesitas. En VitaBlue comparamos opciones de forma clara, gratuita e independiente para que elijas con confianza. Descubre más en vitablue.es.`,
    instagram: `Conoce ${subject}. 🩺 Comparamos seguros de salud de forma clara, gratuita e independiente para ayudarte a elegir sin complicaciones. Descubre la opción que encaja contigo en vitablue.es. #VitaBlue #SegurosDeSalud #Salud`,
    tiktok: `${subject}, explicado fácil. 🩺 Comparamos seguros de salud para que encuentres tu opción sin líos ni spam. Descúbrelo en VitaBlue. #VitaBlue #Seguros #Salud`,
    youtube: `${subject}: descubre cómo encontrar un seguro de salud de forma clara y sencilla. En VitaBlue comparamos diferentes opciones para ayudarte a tomar una decisión informada, sin compromiso y de manera gratuita.`,
    linkedin: `Presentamos ${subject}, una campaña de VitaBlue centrada en hacer más sencilla la elección de un seguro de salud. Comparamos opciones de forma independiente y transparente para ayudar a personas y familias a decidir con confianza.`,
    x: `${subject}: comparamos seguros de salud de forma clara, gratuita e independiente. Encuentra una opción que encaje contigo en vitablue.es. #VitaBlue #SegurosDeSalud`,
  };

  return platforms.reduce<Record<SocialPlatformId, string>>((result, platform) => {
    result[platform] = copies[platform];
    return result;
  }, {} as Record<SocialPlatformId, string>);
};

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate: string;
  platforms: SocialPlatformId[];
  contentTypes: CampaignContentType[];
  automaticPlatforms?: SocialPlatformId[];
  automaticPlatformsConfigured?: boolean;
  copies: Record<SocialPlatformId | string, string>;
  assets: CampaignAsset[];
  created_at?: string;
}

const storageKey = 'vitablue.campaigns';
export const campaignsUpdatedEvent = 'vitablue:campaigns-updated';

export const defaultCampaigns: Campaign[] = [
  {
    id: 'lanzamiento-marca',
    name: 'Lanzamiento de Marca',
    objective: 'Dar a conocer a VitaBlue como el comparador líder e independiente de seguros de salud para estudiantes, expatriados y familias en España.',
    status: 'draft',
    startDate: new Date().toISOString().split('T')[0],
    platforms: ['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube'],
    contentTypes: ['text'],
    copies: generateCampaignCopies('Lanzamiento de Marca', ['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube']),
    assets: [
      {
        id: 'post-lanzamiento-1',
        name: 'Post de Lanzamiento (Feed)',
        type: 'post',
        dimensions: { width: 1080, height: 1080 },
        theme: 'gradient',
        customTitle: 'VitaBlue Seguros',
        customTagline: 'Protección que se adapta a tu vida'
      },
      {
        id: 'story-lanzamiento-1',
        name: 'Story / Reel de Lanzamiento',
        type: 'story',
        dimensions: { width: 1080, height: 1920 },
        theme: 'dark',
        customTitle: '¡Ya estamos aquí!',
        customTagline: 'Comparador de seguros de salud gratuito'
      }
    ]
  }
];

/**
 * Loads campaigns from LocalStorage (synchronous fallback).
 */
export const getCampaigns = (): Campaign[] => {
  if (typeof window === 'undefined') return defaultCampaigns;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultCampaigns;
    return JSON.parse(stored) as Campaign[];
  } catch {
    return defaultCampaigns;
  }
};

/**
 * Saves campaigns to LocalStorage and triggers sync event.
 */
export const saveCampaigns = (campaigns: Campaign[]): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(campaigns));
    window.dispatchEvent(new CustomEvent(campaignsUpdatedEvent, { detail: campaigns }));
  } catch (err) {
    console.error('Error saving campaigns locally:', err);
  }
};

/**
 * Fetches campaigns from Supabase, updates LocalStorage, and dispatches sync event.
 */
export const syncCampaignsWithSupabase = async (): Promise<Campaign[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase marketing_campaigns fetch failed, using local fallback:', error.message);
      return getCampaigns();
    }

    if (data && data.length > 0) {
      // Map database schema back to UI model
      const campaigns: Campaign[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        objective: item.objective || '',
        status: item.status || 'draft',
        startDate: item.start_date || '',
        platforms: item.platforms || [],
        contentTypes: item.content_types || ['text'],
        automaticPlatforms: item.automatic_platforms || [],
        automaticPlatformsConfigured: item.automatic_platforms_configured || false,
        copies: item.copies || {},
        assets: item.assets || []
      }));
      
      saveCampaigns(campaigns);
      return campaigns;
    } else {
      // If db is empty, upload defaults
      const localCampaigns = getCampaigns();
      for (const campaign of localCampaigns) {
        await saveCampaignToSupabase(campaign);
      }
      return localCampaigns;
    }
  } catch (err) {
    console.warn('Network error syncing with Supabase:', err);
    return getCampaigns();
  }
};

/**
 * Uploads/Updates a single campaign to Supabase.
 */
export const saveCampaignToSupabase = async (campaign: Campaign): Promise<void> => {
  try {
    // Database payload structure
    const dbPayload = {
      id: campaign.id,
      name: campaign.name,
      objective: campaign.objective,
      status: campaign.status,
      start_date: campaign.startDate,
      platforms: campaign.platforms,
      content_types: campaign.contentTypes,
      automatic_platforms: campaign.automaticPlatforms || [],
      automatic_platforms_configured: campaign.automaticPlatformsConfigured || false,
      copies: campaign.copies,
      assets: campaign.assets,
      updated_at: new Date().toISOString()
    };

    const query = supabase.from('marketing_campaigns').upsert(dbPayload);

    const { error } = await query;
    if (error) {
      console.warn('Could not upload campaign to Supabase:', error.message);
    }
  } catch (err) {
    console.warn('Network error saving campaign to Supabase:', err);
  }
};

/**
 * Deletes a campaign from Supabase and updates local store.
 */
export const deleteCampaign = async (id: string, allCampaigns: Campaign[]): Promise<void> => {
  const nextCampaigns = allCampaigns.filter(c => c.id !== id);
  saveCampaigns(nextCampaigns);
  
  try {
    const { error } = await supabase.from('marketing_campaigns').delete().eq('id', id);
    if (error) console.warn('Could not delete campaign in Supabase:', error.message);
  } catch (err) {
    console.warn('Network error deleting campaign in Supabase:', err);
  }
};
