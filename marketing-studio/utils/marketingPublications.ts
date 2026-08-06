import { supabase } from './supabaseClient';
import { SocialPlatformId } from '@/utils/socialProfiles';

export type MarketingPublicationStatus = 'prepared' | 'published' | 'archived';

export interface MarketingPublication {
  id: string;
  campaignId: string;
  platform: SocialPlatformId;
  publicationUrl: string;
  externalPostId?: string;
  accountHandle?: string;
  status: MarketingPublicationStatus;
  publishedAt?: string;
  linkId?: string;
  contentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const storageKey = 'vitablue.marketing-publications';

const fromDb = (item: Record<string, any>): MarketingPublication => ({
  id: item.id,
  campaignId: item.campaign_id,
  platform: item.platform as SocialPlatformId,
  publicationUrl: item.publication_url,
  externalPostId: item.external_post_id ?? undefined,
  accountHandle: item.account_handle ?? undefined,
  status: item.status as MarketingPublicationStatus,
  publishedAt: item.published_at ?? undefined,
  linkId: item.link_id ?? undefined,
  contentId: item.content_id ?? undefined,
  notes: item.notes ?? undefined,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const toDb = (publication: MarketingPublication) => ({
  id: publication.id,
  campaign_id: publication.campaignId,
  platform: publication.platform,
  publication_url: publication.publicationUrl,
  external_post_id: publication.externalPostId || null,
  account_handle: publication.accountHandle || null,
  status: publication.status,
  published_at: publication.publishedAt || null,
  link_id: publication.linkId || null,
  content_id: publication.contentId || null,
  notes: publication.notes || null,
  created_at: publication.createdAt,
  updated_at: publication.updatedAt,
});

export const getMarketingPublications = (campaignId?: string): MarketingPublication[] => {
  if (typeof window === 'undefined') return [];
  try {
    const publications = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as MarketingPublication[];
    return campaignId ? publications.filter((item) => item.campaignId === campaignId) : publications;
  } catch {
    return [];
  }
};

export const saveMarketingPublications = (publications: MarketingPublication[]) => {
  if (typeof window !== 'undefined') window.localStorage.setItem(storageKey, JSON.stringify(publications));
};

export const syncMarketingPublications = async (campaignId: string): Promise<MarketingPublication[]> => {
  try {
    const { data, error } = await supabase
      .from('marketing_campaign_publications')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });
    if (error || !data) return getMarketingPublications(campaignId);
    const remote = data.map((item) => fromDb(item));
    const local = getMarketingPublications().filter((item) => item.campaignId !== campaignId);
    saveMarketingPublications([...local, ...remote]);
    return remote;
  } catch (error) {
    console.warn('Network error loading campaign publications:', error);
    return getMarketingPublications(campaignId);
  }
};

export const saveMarketingPublicationToSupabase = async (publication: MarketingPublication) => {
  try {
    const { error } = await supabase.from('marketing_campaign_publications').upsert(toDb(publication));
    if (error) console.warn('Could not upload campaign publication:', error.message);
  } catch (error) {
    console.warn('Network error saving campaign publication:', error);
  }
};

export const deleteMarketingPublicationFromSupabase = async (id: string) => {
  try {
    const { error } = await supabase.from('marketing_campaign_publications').delete().eq('id', id);
    if (error) console.warn('Could not delete campaign publication:', error.message);
  } catch (error) {
    console.warn('Network error deleting campaign publication:', error);
  }
};
