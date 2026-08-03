-- =====================================================
-- MIGRACION 04: MODOS DE DIFUSION DE CAMPANAS
-- =====================================================
-- Anade los campos para separar canales automaticos y manuales.

ALTER TABLE public.marketing_campaigns
ADD COLUMN IF NOT EXISTS automatic_platforms text[] DEFAULT '{}';

ALTER TABLE public.marketing_campaigns
ADD COLUMN IF NOT EXISTS automatic_platforms_configured boolean DEFAULT false;