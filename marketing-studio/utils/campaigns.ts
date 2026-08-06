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
  illustration?: 'logo' | 'student';
}

export type CampaignContentType = 'text' | 'video';

export const generateCampaignCopies = (
  _campaignName: string,
  platforms: SocialPlatformId[],
): Record<SocialPlatformId, string> => {
  const copies: Record<SocialPlatformId, string> = {
    facebook: `¿Vienes a estudiar a España? 🎓🇪🇸✈️ Consigue el seguro médico obligatorio para tu visado de estudiante de forma rápida, barata y 100% online. En VitaBlue comparamos las mejores aseguradoras autorizadas que cumplen con todos los requisitos del consulado: sin copagos, sin carencias y con repatriación incluida.\n\n👉 Más información y tarifas en: vitablue.es/productos/seguros-salud/seguro-medico-estudiantes\n💬 Consúltanos directamente por WhatsApp haciendo clic aquí: https://wa.me/34694583452 🩺`,
    instagram: `¿Planificando tus estudios en España? 🎓🇪🇸 No te la juegues con el seguro médico obligatorio para tu visado. En VitaBlue te ayudamos a comparar y contratar la póliza perfecta que cumple al 100% con los requisitos consulares. 👇\n\n✅ 100% válido para visados de estudiantes extranjeros\n🚫 Sin copagos y sin carencias (atención médica desde el día 1)\n✈️ Incluye repatriación de restos obligatorio\n⚡ Compara y calcula tu precio en 30 segundos gratis\n\n🔗 Toda la información detallada en el link de nuestra bio o visita: vitablue.es/productos/seguros-salud/seguro-medico-estudiantes\n\n💬 ¿Tienes dudas con los requisitos? Escríbenos directamente a nuestro WhatsApp oficial: +34 694 58 34 52 (enlace en bio).\n\n#VisadoDeEstudiante #EstudiarEnEspaña #SeguroMédicoEstudiantes #ErasmusEspaña #MundoErasmus #EstudiantesExtranjeros`,
    tiktok: `POV: Estás preparando tu visado para España y necesitas el seguro médico homologado (sin copagos/carencias + repatriación). 💀 En VitaBlue te ayudamos al instante.\n\n👉 Info completa en vitablue.es/productos/seguros-salud/seguro-medico-estudiantes o escríbenos al WhatsApp del perfil: +34 694 58 34 52 🩺✈️ #visado #españa #estudiantes #erasmus #latinosenespaña #tips`,
    youtube: `Guía rápida para contratar el seguro médico para el visado de estudiante en España. En VitaBlue comparamos de forma independiente las aseguradoras homologadas por el consulado español que cumplen con el requisito de no tener copagos, carencias y contar con repatriación.\n\n👉 Detalles de pólizas: https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes\n💬 WhatsApp de consultas rápidas: https://wa.me/34694583452`,
    linkedin: `Facilitamos la movilidad académica internacional hacia España. Si eres estudiante de posgrado, investigador o estás gestionando traslados de estudiantes extranjeros, en VitaBlue comparamos de forma transparente seguros médicos homologados exigidos por los consulados españoles (sin copagos, sin carencias y con cobertura de repatriación).\n\n👉 Más información en: https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes\n💬 Asesoramiento personalizado vía WhatsApp: https://wa.me/34694583452`,
    x: `¿Vienes a estudiar a España? 🎓🇪🇸 Consigue el seguro médico obligatorio para tu visado al mejor precio. 100% homologado: sin copagos, sin carencias y con repatriación.\n\n👉 Info: vitablue.es/productos/seguros-salud/seguro-medico-estudiantes\n💬 WhatsApp de ayuda: https://wa.me/34694583452`,
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
    id: 'lanzamiento-marca-v2',
    name: 'Lanzamiento de Marca v2',
    objective: 'Captar estudiantes extranjeros que necesitan contratar el seguro médico obligatorio y homologado para tramitar su visado de estudios en España.',
    status: 'draft',
    startDate: new Date().toISOString().split('T')[0],
    platforms: ['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube'],
    contentTypes: ['text'],
    copies: generateCampaignCopies('Lanzamiento de Marca', ['facebook', 'instagram', 'linkedin', 'tiktok', 'x', 'youtube']),
    assets: [
      {
        id: 'post-facebook',
        name: 'Post Facebook: Seguro Médico Visado',
        type: 'post',
        dimensions: { width: 1080, height: 1080 },
        theme: 'gradient',
        customTitle: 'Seguro Médico Visado',
        customTagline: 'Cumple 100% con los requisitos para estudiar en España.',
        illustration: 'logo'
      },
      {
        id: 'post-instagram',
        name: 'Post Instagram: Estudia en España',
        type: 'post',
        dimensions: { width: 1080, height: 1080 },
        theme: 'light',
        customTitle: 'Estudia en España',
        customTagline: 'Seguro médico sin copagos ni carencias.',
        illustration: 'student'
      },
      {
        id: 'post-x',
        name: 'Post X: Seguro Estudiante',
        type: 'post',
        dimensions: { width: 1080, height: 1080 },
        theme: 'dark',
        customTitle: 'Seguro Estudiante',
        customTagline: 'Elige tu póliza consular en 30 segundos.',
        illustration: 'logo'
      },
      {
        id: 'story-instagram',
        name: 'Story Instagram: Visado de Estudiante',
        type: 'story',
        dimensions: { width: 1080, height: 1920 },
        theme: 'gradient',
        customTitle: 'Visado de Estudiante',
        customTagline: 'Compara tu seguro homologado online.',
        illustration: 'student'
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
      const dbCampaigns: Campaign[] = data.map((item) => ({
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
      
      // Merge and update default campaigns
      const mergedCampaigns = [...dbCampaigns];
      for (const defaultCamp of defaultCampaigns) {
        const index = mergedCampaigns.findIndex((c) => c.id === defaultCamp.id);
        if (index === -1) {
          mergedCampaigns.push(defaultCamp);
          await saveCampaignToSupabase(defaultCamp);
        } else {
          // Force update copies, assets and name of default campaigns to push fresh code updates
          mergedCampaigns[index] = {
            ...mergedCampaigns[index],
            name: defaultCamp.name,
            copies: defaultCamp.copies,
            assets: defaultCamp.assets
          };
          await saveCampaignToSupabase(mergedCampaigns[index]);
        }
      }
      
      saveCampaigns(mergedCampaigns);
      return mergedCampaigns;
    } else {
      // If db is empty, upload defaults
      for (const campaign of defaultCampaigns) {
        await saveCampaignToSupabase(campaign);
      }
      saveCampaigns(defaultCampaigns);
      return defaultCampaigns;
    }
  } catch (err) {
    console.warn('Network error syncing with Supabase:', err);
    return getCampaigns();
  }
};

/**
 * Uploads/Updates a single campaign to Supabase.
 */
export const saveCampaignToSupabase = async (campaign: Campaign): Promise<boolean> => {
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
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Network error saving campaign to Supabase:', err);
    return false;
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
