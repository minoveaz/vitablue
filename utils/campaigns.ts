/// <reference types="vite/client" />

import { supabase } from './supabaseClient';
import { SocialPlatformId } from './socialProfiles';

export interface CampaignAsset {
  id: string;
  name: string;
  type: 'post' | 'story' | 'banner';
  dimensions: { width: number; height: number };
  theme: 'dark' | 'light' | 'gradient';
  customTitle?: string;
  customTagline?: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  startDate: string;
  platforms: SocialPlatformId[];
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
    copies: {
      facebook: '¡Llegamos para proteger lo que más importa! 💙 VitaBlue es tu nuevo comparador de seguros de salud 100% gratuito e independiente en España. Encuentra la cobertura ideal y olvídate de la letra pequeña.',
      instagram: '🩺 ¿Buscando seguro médico en España? Te presentamos VitaBlue: tu comparador independiente de seguros de salud. Comparamos más de 20 aseguradoras para darte la opción perfecta. ¡Visita el link de nuestra bio! #VitaBlue #SegurosDeSalud #Expatriados',
      tiktok: 'Seguro médico sin complicaciones en España 🇪🇸✈️ ¿Estudiante o nómada digital? Te lo explicamos fácil en VitaBlue. ¡Cotiza gratis ya! Link en bio. #Seguros #Estudiantes #NomadasDigitales #Españavisa',
      youtube: 'Te presentamos VitaBlue, el comparador de seguros de salud diseñado para adaptarse a tu estilo de vida. Comparamos las mejores aseguradoras como Sanitas, Adeslas y más, de manera transparente, gratuita y sin compromiso. ¡Mira nuestro cotizador en la web!',
      linkedin: 'Nos complace anunciar el lanzamiento de VitaBlue, un comparador independiente de seguros de salud diseñado para simplificar la toma de decisiones para familias, expatriados y profesionales en España. Transparencia y simplicidad en un solo lugar.',
      x: '¡Hola X! 🩺 Lanzamos VitaBlue, el comparador independiente de seguros de salud en España. 100% gratuito, sin spam y adaptado a ti. Cotiza en menos de 2 minutos: https://vitablue.es/wizard'
    },
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
      id: campaign.id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/) 
        ? campaign.id 
        : undefined, // Let Supabase auto-generate if it's a slug/text ID
      name: campaign.name,
      objective: campaign.objective,
      status: campaign.status,
      start_date: campaign.startDate,
      platforms: campaign.platforms,
      copies: campaign.copies,
      assets: campaign.assets,
      updated_at: new Date().toISOString()
    };

    let query;
    if (dbPayload.id) {
      query = supabase.from('marketing_campaigns').upsert(dbPayload);
    } else {
      // For slug-based campaigns, match by name or let it insert
      const { data } = await supabase
        .from('marketing_campaigns')
        .select('id')
        .eq('name', campaign.name)
        .maybeSingle();
        
      if (data?.id) {
        query = supabase.from('marketing_campaigns').update(dbPayload).eq('id', data.id);
      } else {
        query = supabase.from('marketing_campaigns').insert(dbPayload);
      }
    }

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
    // Delete from Supabase if it's a UUID
    if (id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      const { error } = await supabase.from('marketing_campaigns').delete().eq('id', id);
      if (error) console.warn('Could not delete campaign in Supabase:', error.message);
    } else {
      // Slug-based local defaults deleted only locally
      console.log('Deleted default campaign locally');
    }
  } catch (err) {
    console.warn('Network error deleting campaign in Supabase:', err);
  }
};
