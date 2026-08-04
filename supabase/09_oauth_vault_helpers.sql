-- QUERY NAME: VitaBlue 09 - OAuth Vault helpers
-- =====================================================
-- MIGRACIÓN 09: ALMACENAMIENTO DE CREDENCIALES OAUTH EN VAULT
-- =====================================================
-- La función recibe tokens únicamente desde una Edge Function autenticada
-- y devuelve el identificador de Vault, nunca el secreto.

CREATE OR REPLACE FUNCTION public.store_oauth_connection_secret(
    p_provider text,
    p_external_account_id text,
    p_display_name text,
    p_scopes text[],
    p_access_token text,
    p_refresh_token text,
    p_expires_at timestamptz
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    secret_id uuid;
    connection_id uuid;
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;

    IF p_provider NOT IN ('facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok') THEN
        RAISE EXCEPTION 'Unsupported OAuth provider';
    END IF;

    IF nullif(trim(p_access_token), '') IS NULL THEN
        RAISE EXCEPTION 'Access token is required';
    END IF;

    SELECT vault.create_secret(
        jsonb_build_object(
            'access_token', p_access_token,
            'refresh_token', nullif(p_refresh_token, '')
        )::text,
        format('oauth:%s:%s', p_provider, p_external_account_id),
        'VitaBlue OAuth credential'
    ) INTO secret_id;

    INSERT INTO public.oauth_connections (
        provider,
        external_account_id,
        display_name,
        scopes,
        credential_ref,
        expires_at,
        created_by,
        updated_at
    ) VALUES (
        p_provider,
        p_external_account_id,
        p_display_name,
        coalesce(p_scopes, '{}'),
        secret_id::text,
        p_expires_at,
        auth.uid(),
        now()
    )
    ON CONFLICT (provider, external_account_id)
    DO UPDATE SET
        display_name = excluded.display_name,
        scopes = excluded.scopes,
        credential_ref = excluded.credential_ref,
        expires_at = excluded.expires_at,
        updated_at = now();

    SELECT id INTO connection_id
    FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;

    RETURN connection_id;
END;
$$;

REVOKE ALL ON FUNCTION public.store_oauth_connection_secret(text, text, text, text[], text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.store_oauth_connection_secret(text, text, text, text[], text, text, timestamptz) TO authenticated;
