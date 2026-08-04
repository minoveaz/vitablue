-- QUERY NAME: VitaBlue 08 - OAuth connections
-- =====================================================
-- MIGRACIÓN 08: METADATOS DE CONEXIONES OAUTH
-- =====================================================
-- No guarda access tokens ni refresh tokens. `credential_ref` debe apuntar
-- a un secreto gestionado server-side (Vault/Edge Function).

CREATE TABLE IF NOT EXISTS public.oauth_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text NOT NULL CHECK (provider IN ('facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok')),
    external_account_id text NOT NULL,
    display_name text,
    scopes text[] NOT NULL DEFAULT '{}',
    credential_ref text NOT NULL,
    expires_at timestamptz,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (provider, external_account_id)
);

ALTER TABLE public.oauth_connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Marketing users can read OAuth connections" ON public.oauth_connections;
CREATE POLICY "Marketing users can read OAuth connections"
ON public.oauth_connections FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

DROP POLICY IF EXISTS "Marketing editors can manage OAuth connections" ON public.oauth_connections;
CREATE POLICY "Marketing editors can manage OAuth connections"
ON public.oauth_connections FOR INSERT TO authenticated
WITH CHECK (public.has_marketing_role('editor') AND created_by = auth.uid());

DROP POLICY IF EXISTS "Marketing editors can update OAuth connections" ON public.oauth_connections;
CREATE POLICY "Marketing editors can update OAuth connections"
ON public.oauth_connections FOR UPDATE TO authenticated
USING (public.has_marketing_role('editor'))
WITH CHECK (public.has_marketing_role('editor'));

DROP POLICY IF EXISTS "Marketing admins can delete OAuth connections" ON public.oauth_connections;
CREATE POLICY "Marketing admins can delete OAuth connections"
ON public.oauth_connections FOR DELETE TO authenticated
USING (public.has_marketing_role('admin'));

COMMENT ON COLUMN public.oauth_connections.credential_ref IS
  'Referencia a secreto server-side; nunca almacenar aquí access_token ni refresh_token.';
