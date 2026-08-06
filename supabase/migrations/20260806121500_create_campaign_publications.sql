-- Publicaciones reales realizadas dentro de una campaña.
CREATE TABLE IF NOT EXISTS public.marketing_campaign_publications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id text NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
    platform text NOT NULL,
    publication_url text NOT NULL,
    external_post_id text,
    account_handle text,
    status text NOT NULL DEFAULT 'published',
    published_at timestamptz,
    link_id text REFERENCES public.marketing_links(id) ON DELETE SET NULL,
    content_id text,
    notes text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT marketing_campaign_publications_platform_check
      CHECK (platform IN ('facebook', 'instagram', 'tiktok', 'youtube', 'linkedin', 'x')),
    CONSTRAINT marketing_campaign_publications_status_check
      CHECK (status IN ('prepared', 'published', 'archived')),
    CONSTRAINT marketing_campaign_publications_url_check
      CHECK (publication_url ~* '^https?://')
);

CREATE INDEX IF NOT EXISTS marketing_campaign_publications_campaign_idx
  ON public.marketing_campaign_publications(campaign_id);
CREATE INDEX IF NOT EXISTS marketing_campaign_publications_platform_idx
  ON public.marketing_campaign_publications(platform);
CREATE UNIQUE INDEX IF NOT EXISTS marketing_campaign_publications_external_post_idx
  ON public.marketing_campaign_publications(platform, external_post_id)
  WHERE external_post_id IS NOT NULL;

ALTER TABLE public.marketing_campaign_publications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Marketing users can read campaign publications" ON public.marketing_campaign_publications;
CREATE POLICY "Marketing users can read campaign publications"
ON public.marketing_campaign_publications FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

DROP POLICY IF EXISTS "Marketing editors can create campaign publications" ON public.marketing_campaign_publications;
CREATE POLICY "Marketing editors can create campaign publications"
ON public.marketing_campaign_publications FOR INSERT TO authenticated
WITH CHECK (public.has_marketing_role('editor'));

DROP POLICY IF EXISTS "Marketing editors can update campaign publications" ON public.marketing_campaign_publications;
CREATE POLICY "Marketing editors can update campaign publications"
ON public.marketing_campaign_publications FOR UPDATE TO authenticated
USING (public.has_marketing_role('editor'))
WITH CHECK (public.has_marketing_role('editor'));

DROP POLICY IF EXISTS "Marketing admins can delete campaign publications" ON public.marketing_campaign_publications;
CREATE POLICY "Marketing admins can delete campaign publications"
ON public.marketing_campaign_publications FOR DELETE TO authenticated
USING (public.has_marketing_role('admin'));
