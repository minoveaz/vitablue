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

export type CampaignPersistenceErrorKind = 'authentication' | 'permission' | 'schema' | 'network';

export class CampaignPersistenceError extends Error {
  readonly kind: CampaignPersistenceErrorKind;
  readonly operation: 'read' | 'write' | 'delete';
  readonly code?: string;

  constructor(
    kind: CampaignPersistenceErrorKind,
    operation: 'read' | 'write' | 'delete',
    message: string,
    code?: string,
  ) {
    super(message);
    this.name = 'CampaignPersistenceError';
    this.kind = kind;
    this.operation = operation;
    this.code = code;
  }
}

type SupabaseErrorLike = { code?: string; message?: string; status?: number };

const isPermissionError = (error: SupabaseErrorLike): boolean =>
  error.status === 401 || error.status === 403 || error.code === '42501' || error.code === '401';

const isSchemaError = (error: SupabaseErrorLike): boolean =>
  error.code === '42P01' || error.code === '42703' || error.code === '42883'
    || error.code === 'PGRST204' || error.code === 'PGRST205';

const campaignPersistenceError = (
  error: SupabaseErrorLike,
  operation: CampaignPersistenceError['operation'],
): CampaignPersistenceError => {
  const code = error.code;
  if (isPermissionError(error)) {
    return new CampaignPersistenceError(
      error.status === 401 || error.code === '401' ? 'authentication' : 'permission',
      operation,
      operation === 'read'
        ? 'No se pudieron leer las campañas: inicia sesión y verifica que tu usuario tenga acceso al Marketing Studio.'
        : `No se pudo ${operation === 'delete' ? 'eliminar' : 'guardar'} la campaña: tu usuario necesita el rol editor o admin en public.user_roles. Solicita que un administrador lo asigne; no se ha modificado ninguna política RLS.`,
      code,
    );
  }
  if (isSchemaError(error)) {
    return new CampaignPersistenceError(
      'schema',
      operation,
      'No se pudo persistir la campaña porque el esquema de Supabase no está actualizado. Aplica las migraciones de marketing_campaigns (incluida 06_marketing_auth_roles.sql).',
      code,
    );
  }
  return new CampaignPersistenceError(
    'network',
    operation,
    `No se pudo ${operation === 'read' ? 'leer' : operation === 'delete' ? 'eliminar' : 'guardar'} la campaña por un error de red. Comprueba la conexión e inténtalo de nuevo.`,
    code,
  );
};

const campaignColumns = 'id,name,objective,status,start_date,platforms,content_types,automatic_platforms,automatic_platforms_configured,copies,assets,created_at,updated_at';

const mapCampaignRow = (item: Record<string, unknown>): Campaign => ({
  id: String(item.id ?? ''),
  name: String(item.name ?? ''),
  objective: typeof item.objective === 'string' ? item.objective : '',
  status: item.status === 'scheduled' || item.status === 'active' || item.status === 'completed' ? item.status : 'draft',
  startDate: typeof item.start_date === 'string' ? item.start_date : '',
  platforms: Array.isArray(item.platforms) ? item.platforms as SocialPlatformId[] : [],
  contentTypes: Array.isArray(item.content_types) ? item.content_types as CampaignContentType[] : ['text'],
  automaticPlatforms: Array.isArray(item.automatic_platforms) ? item.automatic_platforms as SocialPlatformId[] : [],
  automaticPlatformsConfigured: item.automatic_platforms_configured === true,
  copies: item.copies && typeof item.copies === 'object' ? item.copies as Record<string, string> : {},
  assets: Array.isArray(item.assets) ? item.assets as CampaignAsset[] : [],
  ...(typeof item.created_at === 'string' ? { created_at: item.created_at } : {}),
});

const hasCampaignWriteAccess = async (): Promise<boolean> => {
  if (typeof supabase.rpc !== 'function') return false;
  const { data, error } = await supabase.rpc('has_marketing_role', { required_role: 'editor' });
  if (error) throw campaignPersistenceError(error, 'write');
  return data === true;
};

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
  let authResult;
  try {
    authResult = await supabase.auth.getUser();
  } catch (error) {
    throw campaignPersistenceError(error as SupabaseErrorLike, 'read');
  }
  if (authResult.error) throw campaignPersistenceError(authResult.error, 'read');
  // Marketing campaigns are protected by RLS. Do not issue anonymous requests
  // (or attempt to bootstrap defaults) when the backoffice session is absent.
  if (!authResult.data.user) return getCampaigns();

  let data: Record<string, unknown>[] = [];
  try {
    const result = await supabase
      .from('marketing_campaigns')
      .select(campaignColumns)
      .order('created_at', { ascending: false });
    if (result.error) throw result.error;
    data = (result.data ?? []) as Record<string, unknown>[];
  } catch (error) {
    const typed = campaignPersistenceError(error as SupabaseErrorLike, 'read');
    if (typed.kind !== 'network') throw typed;
    console.warn(typed.message);
    return getCampaigns();
  }

  if (data.length > 0) {
      // Map database schema back to UI model
      const dbCampaigns: Campaign[] = data.map(mapCampaignRow);
      
      // Merge and update default campaigns
      const mergedCampaigns = [...dbCampaigns];
      const needsDefaultWrite = defaultCampaigns.some((defaultCamp) => {
        const existing = mergedCampaigns.find((campaign) => campaign.id === defaultCamp.id);
        return !existing
          || existing.name !== defaultCamp.name
          || JSON.stringify(existing.copies) !== JSON.stringify(defaultCamp.copies)
          || JSON.stringify(existing.assets) !== JSON.stringify(defaultCamp.assets);
      });
      const canWrite = needsDefaultWrite ? await hasCampaignWriteAccess() : false;
      for (const defaultCamp of defaultCampaigns) {
        const index = mergedCampaigns.findIndex((c) => c.id === defaultCamp.id);
        if (index === -1) {
          mergedCampaigns.push(defaultCamp);
          if (canWrite) await saveCampaignToSupabase(defaultCamp);
        } else {
          // Force update copies, assets and name of default campaigns to push fresh code updates
          mergedCampaigns[index] = {
            ...mergedCampaigns[index],
            name: defaultCamp.name,
            copies: defaultCamp.copies,
            assets: defaultCamp.assets
          };
          if (canWrite) await saveCampaignToSupabase(mergedCampaigns[index]);
        }
      }
      
      saveCampaigns(mergedCampaigns);
      return mergedCampaigns;
  } else {
    // An empty result may be a read-only user's valid view. Check the role
    // before attempting to bootstrap defaults, avoiding predictable 403s.
    if (await hasCampaignWriteAccess()) {
      for (const campaign of defaultCampaigns) await saveCampaignToSupabase(campaign);
    }
    saveCampaigns(defaultCampaigns);
    return defaultCampaigns;
  }
};

/**
 * Uploads/Updates a single campaign to Supabase.
 */
export const saveCampaignToSupabase = async (campaign: Campaign): Promise<boolean> => {
  let authResult;
  try {
    authResult = await supabase.auth.getUser();
  } catch (error) {
    throw campaignPersistenceError(error as SupabaseErrorLike, 'write');
  }
  if (authResult.error) throw campaignPersistenceError(authResult.error, 'write');
  if (!authResult.data.user) {
    throw new CampaignPersistenceError(
      'authentication',
      'write',
      'No se pudo guardar la campaña: inicia sesión en el Marketing Studio para continuar.',
    );
  }

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
      throw campaignPersistenceError(error, 'write');
    }
    return true;
  } catch (error) {
    if (error instanceof CampaignPersistenceError) throw error;
    throw campaignPersistenceError(error as SupabaseErrorLike, 'write');
  }
};

/**
 * Deletes a campaign from Supabase and updates local store.
 */
export const deleteCampaign = async (id: string, allCampaigns: Campaign[]): Promise<void> => {
  const nextCampaigns = allCampaigns.filter(c => c.id !== id);
  saveCampaigns(nextCampaigns);
  
  try {
    const authResult = await supabase.auth.getUser();
    if (authResult.error) throw campaignPersistenceError(authResult.error, 'delete');
    if (!authResult.data.user) throw new CampaignPersistenceError('authentication', 'delete', 'No se pudo eliminar la campaña: inicia sesión en el Marketing Studio para continuar.');
    const { error } = await supabase.from('marketing_campaigns').delete().eq('id', id);
    if (error) throw campaignPersistenceError(error, 'delete');
  } catch (error) {
    if (error instanceof CampaignPersistenceError) throw error;
    throw campaignPersistenceError(error as SupabaseErrorLike, 'delete');
  }
};
