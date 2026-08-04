-- =====================================================
-- MIGRACIÓN 10: STATES OAUTH DE UN SOLO USO
-- =====================================================

CREATE TABLE IF NOT EXISTS public.oauth_states (
    state_hash text PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider text NOT NULL CHECK (provider IN ('facebook', 'instagram', 'linkedin', 'youtube', 'x', 'tiktok')),
    expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.oauth_states ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.register_oauth_state(p_provider text, p_state_hash text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.has_marketing_role('editor') THEN
        RAISE EXCEPTION 'Insufficient role';
    END IF;
    INSERT INTO public.oauth_states (state_hash, user_id, provider)
    VALUES (p_state_hash, auth.uid(), p_provider);
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_oauth_state(p_provider text, p_state_hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    deleted_count integer;
BEGIN
    DELETE FROM public.oauth_states
    WHERE state_hash = p_state_hash
      AND provider = p_provider
      AND user_id = auth.uid()
      AND expires_at > now();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.register_oauth_state(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.consume_oauth_state(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_oauth_state(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.consume_oauth_state(text, text) TO authenticated;
