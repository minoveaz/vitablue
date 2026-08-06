-- Additional attribution metadata for campaign links.
ALTER TABLE public.marketing_links
  ADD COLUMN IF NOT EXISTS placement text,
  ADD COLUMN IF NOT EXISTS content_id text;

ALTER TABLE public.marketing_link_clicks
  ADD COLUMN IF NOT EXISTS country_code text,
  ADD COLUMN IF NOT EXISTS language text,
  ADD COLUMN IF NOT EXISTS browser text,
  ADD COLUMN IF NOT EXISTS operating_system text,
  ADD COLUMN IF NOT EXISTS landing_url text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content text,
  ADD COLUMN IF NOT EXISTS redirect_status text NOT NULL DEFAULT 'success';

ALTER TABLE public.marketing_link_clicks
  DROP CONSTRAINT IF EXISTS marketing_link_clicks_country_code_check;

ALTER TABLE public.marketing_link_clicks
  ADD CONSTRAINT marketing_link_clicks_country_code_check
  CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$');

CREATE INDEX IF NOT EXISTS marketing_link_clicks_country_idx ON public.marketing_link_clicks(country_code);
CREATE INDEX IF NOT EXISTS marketing_link_clicks_utm_campaign_idx ON public.marketing_link_clicks(utm_campaign);
CREATE INDEX IF NOT EXISTS marketing_link_clicks_landing_url_idx ON public.marketing_link_clicks(landing_url);
