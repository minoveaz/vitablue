import { supabase } from './supabaseClient';

export type MarketingLinkChannel = 'tiktok' | 'instagram' | 'facebook' | 'youtube' | 'linkedin' | 'x' | 'other';

export interface MarketingLink {
  id: string;
  name: string;
  slug: string;
  channel: MarketingLinkChannel;
  campaignId?: string;
  placement?: string;
  contentId?: string;
  phone: string;
  message: string;
  active: boolean;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketingLinkClick {
  id: string;
  linkId: string;
  clickedAt: string;
  countryCode?: string;
  language?: string;
  device?: string;
  browser?: string;
  operatingSystem?: string;
  landingUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  redirectStatus?: string;
}

const storageKey = 'vitablue.marketing-links';
const linksUpdatedEvent = 'vitablue:marketing-links-updated';
export const publicSiteOrigin = (import.meta.env.VITE_PUBLIC_SITE_URL || 'https://www.vitablue.es').replace(/\/$/, '');

export const defaultMarketingLinks: MarketingLink[] = [
  {
    id: 'link-tiktok-lanzamiento',
    name: 'TikTok · Lanzamiento de marca',
    slug: 'tiktok-estudiantes',
    channel: 'tiktok',
    campaignId: 'lanzamiento-marca-v2',
    phone: '34694583452',
    message: 'Hola, vengo de TikTok de VitaBlue y necesito información sobre el seguro médico para mi visado de estudios en España.',
    active: true,
    clicks: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

export const getMarketingLinks = (): MarketingLink[] => {
  if (typeof window === 'undefined') return defaultMarketingLinks;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return defaultMarketingLinks;
    return JSON.parse(stored) as MarketingLink[];
  } catch {
    return defaultMarketingLinks;
  }
};

export const saveMarketingLinks = (links: MarketingLink[]): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(storageKey, JSON.stringify(links));
  window.dispatchEvent(new CustomEvent(linksUpdatedEvent, { detail: links }));
};

const toDbPayload = (link: MarketingLink) => ({
  id: link.id,
  name: link.name,
  slug: link.slug,
  campaign_id: link.campaignId || null,
  placement: link.placement || null,
  content_id: link.contentId || null,
  channel: link.channel,
  phone: normalizePhone(link.phone),
  message: link.message,
  active: link.active,
  created_at: link.createdAt,
  updated_at: link.updatedAt,
});

export const saveMarketingLinksToSupabase = async (links: MarketingLink[]): Promise<void> => {
  try {
    const { error } = await supabase.from('marketing_links').upsert(links.map(toDbPayload));
    if (error) console.warn('Could not upload marketing links to Supabase:', error.message);
  } catch (error) {
    console.warn('Network error saving marketing links:', error);
  }
};

export const syncMarketingLinksWithSupabase = async (): Promise<MarketingLink[]> => {
  try {
    const { data, error } = await supabase.from('marketing_links').select('*').order('created_at', { ascending: false });
    if (error || !data) return getMarketingLinks();
    const { data: stats } = await supabase.from('marketing_link_stats').select('id, clicks');
    const clicksById = new Map((stats ?? []).map((stat) => [stat.id as string, stat.clicks as number]));
    const synced = data.map((item) => ({
      id: item.id, name: item.name, slug: item.slug, campaignId: item.campaign_id ?? undefined,
      placement: item.placement ?? undefined, contentId: item.content_id ?? undefined,
      channel: item.channel as MarketingLinkChannel, phone: item.phone, message: item.message,
      active: item.active, clicks: clicksById.get(item.id) ?? 0,
      createdAt: item.created_at, updatedAt: item.updated_at,
    }));
    saveMarketingLinks(synced);
    return synced;
  } catch (error) {
    console.warn('Network error loading marketing links:', error);
    return getMarketingLinks();
  }
};

/** Loads a small recent sample for the lightweight VitaBlue panel. */
export const getMarketingLinkClicks = async (): Promise<MarketingLinkClick[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_link_clicks')
      .select('id, link_id, clicked_at, country_code, language, device, browser, operating_system, landing_url, utm_source, utm_medium, utm_campaign, utm_content, redirect_status')
      .order('clicked_at', { ascending: false })
      .limit(100);
    if (error || !data) return [];
    return data.map((item) => ({
      id: item.id,
      linkId: item.link_id,
      clickedAt: item.clicked_at,
      countryCode: item.country_code ?? undefined,
      language: item.language ?? undefined,
      device: item.device ?? undefined,
      browser: item.browser ?? undefined,
      operatingSystem: item.operating_system ?? undefined,
      landingUrl: item.landing_url ?? undefined,
      utmSource: item.utm_source ?? undefined,
      utmMedium: item.utm_medium ?? undefined,
      utmCampaign: item.utm_campaign ?? undefined,
      utmContent: item.utm_content ?? undefined,
      redirectStatus: item.redirect_status ?? undefined,
    }));
  } catch (error) {
    console.warn('Network error loading marketing link clicks:', error);
    return [];
  }
};

export const resolveMarketingLinkWithTracking = async (slug: string, landingUrl = typeof window !== 'undefined' ? window.location.href : undefined): Promise<string | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('marketing-link-redirect', { body: { slug, landingUrl } });
    if (!error && data?.redirectUrl) return data.redirectUrl as string;
  } catch (error) {
    console.warn('Marketing link tracking unavailable, using local fallback:', error);
  }
  const link = getMarketingLinkBySlug(slug);
  if (!link) return null;
  const trackedLink = registerMarketingLinkClick(slug);
  return buildWhatsAppUrl(trackedLink ?? link);
};

export const marketingLinksUpdatedEvent = linksUpdatedEvent;

export const getMarketingLinkBySlug = (slug: string): MarketingLink | undefined =>
  getMarketingLinks().find((link) => link.slug === slug && link.active);

export const buildWhatsAppUrl = (link: Pick<MarketingLink, 'phone' | 'message'>): string =>
  `https://wa.me/${normalizePhone(link.phone)}?text=${encodeURIComponent(link.message)}`;

export const getPublicMarketingLinkUrl = (slug: string, origin = publicSiteOrigin) =>
  `${origin}/r/${slug}`;

export const registerMarketingLinkClick = (slug: string): MarketingLink | undefined => {
  const links = getMarketingLinks();
  const index = links.findIndex((link) => link.slug === slug && link.active);
  if (index < 0) return undefined;
  const nextLink = { ...links[index], clicks: links[index].clicks + 1, updatedAt: new Date().toISOString() };
  links[index] = nextLink;
  saveMarketingLinks(links);
  return nextLink;
};

/** Reserved for the next persistence layer once the Supabase table/RLS is defined. */
export const checkMarketingLinksBackend = async (): Promise<boolean> => {
  const { error } = await supabase.from('marketing_links').select('id').limit(1);
  return !error;
};
