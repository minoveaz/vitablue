-- =====================================================
-- MIGRACION 05: TIPOS DE CONTENIDO DE CAMPANA
-- =====================================================
-- Permite definir campanas de texto, video o ambas.

ALTER TABLE public.marketing_campaigns
ADD COLUMN IF NOT EXISTS content_types text[] DEFAULT '{text}';
