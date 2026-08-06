-- 9. MARKETING LINKS AND CLICK METRICS
-- Enlaces de campaña: configuración privada para el Marketing Studio.
-- Los clics públicos se registran únicamente desde la Edge Function.

CREATE TABLE IF NOT EXISTS public.marketing_links (
    id text PRIMARY KEY,
    name text NOT NULL,
    slug text NOT NULL UNIQUE,
    campaign_id text REFERENCES public.marketing_campaigns(id) ON DELETE SET NULL,
    channel text NOT NULL DEFAULT 'other',
    phone text NOT NULL,
    message text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT marketing_links_channel_check CHECK (channel IN ('tiktok', 'instagram', 'facebook', 'youtube', 'linkedin', 'x', 'other')),
    CONSTRAINT marketing_links_slug_check CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    CONSTRAINT marketing_links_phone_check CHECK (phone ~ '^[0-9]{8,15}$')
);

CREATE TABLE IF NOT EXISTS public.marketing_link_clicks (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    link_id text NOT NULL REFERENCES public.marketing_links(id) ON DELETE CASCADE,
    clicked_at timestamptz NOT NULL DEFAULT now(),
    referrer text,
    user_agent text,
    device text
);

CREATE INDEX IF NOT EXISTS marketing_links_campaign_id_idx ON public.marketing_links(campaign_id);
CREATE INDEX IF NOT EXISTS marketing_links_active_idx ON public.marketing_links(active);
CREATE INDEX IF NOT EXISTS marketing_link_clicks_link_id_idx ON public.marketing_link_clicks(link_id);
CREATE INDEX IF NOT EXISTS marketing_link_clicks_clicked_at_idx ON public.marketing_link_clicks(clicked_at);

ALTER TABLE public.marketing_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_link_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Marketing users can read links" ON public.marketing_links;
CREATE POLICY "Marketing users can read links"
ON public.marketing_links FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

DROP POLICY IF EXISTS "Marketing editors can create links" ON public.marketing_links;
CREATE POLICY "Marketing editors can create links"
ON public.marketing_links FOR INSERT TO authenticated
WITH CHECK (public.has_marketing_role('editor'));

DROP POLICY IF EXISTS "Marketing editors can update links" ON public.marketing_links;
CREATE POLICY "Marketing editors can update links"
ON public.marketing_links FOR UPDATE TO authenticated
USING (public.has_marketing_role('editor'))
WITH CHECK (public.has_marketing_role('editor'));

DROP POLICY IF EXISTS "Marketing admins can delete links" ON public.marketing_links;
CREATE POLICY "Marketing admins can delete links"
ON public.marketing_links FOR DELETE TO authenticated
USING (public.has_marketing_role('admin'));

DROP POLICY IF EXISTS "Marketing users can read link clicks" ON public.marketing_link_clicks;
CREATE POLICY "Marketing users can read link clicks"
ON public.marketing_link_clicks FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

-- No anonymous INSERT policy is intentional. The Edge Function uses the
-- service role after validating the slug and only records a minimal event.

CREATE OR REPLACE VIEW public.marketing_link_stats
WITH (security_invoker = true)
AS
SELECT
    l.id,
    l.slug,
    COUNT(c.id)::integer AS clicks,
    MAX(c.clicked_at) AS last_clicked_at
FROM public.marketing_links l
LEFT JOIN public.marketing_link_clicks c ON c.link_id = l.id
GROUP BY l.id, l.slug;

GRANT SELECT ON public.marketing_link_stats TO authenticated;
