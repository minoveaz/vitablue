-- =====================================================
-- MIGRACIÓN 11: DESCONEXIÓN OAUTH SERVER-SIDE
-- =====================================================

CREATE OR REPLACE FUNCTION public.delete_oauth_connection(
    p_provider text,
    p_external_account_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    secret_ref text;
    deleted_count integer;
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;

    SELECT credential_ref INTO secret_ref
    FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;

    IF secret_ref IS NULL THEN
        RETURN false;
    END IF;

    DELETE FROM vault.secrets
    WHERE id = secret_ref::uuid;

    DELETE FROM public.oauth_connections
    WHERE provider = p_provider
      AND external_account_id = p_external_account_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_oauth_connection(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_oauth_connection(text, text) TO authenticated;
