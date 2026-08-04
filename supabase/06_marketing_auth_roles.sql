-- QUERY NAME: VitaBlue 06 - Auth y roles
-- =====================================================
-- MIGRACIÓN 06: AUTENTICACIÓN Y ROLES DEL MARKETING STUDIO
-- =====================================================
-- Aplicar primero en staging. Crear al menos un usuario admin en
-- auth.users y public.user_roles antes de retirar el acceso público.

CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'editor',
    created_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'editor', 'viewer'))
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read their own marketing role" ON public.user_roles;
CREATE POLICY "Users can read their own marketing role"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_marketing_role(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND (
        role = 'admin'
        OR role = required_role
        OR (required_role = 'viewer' AND role IN ('editor', 'viewer'))
      )
  );
$$;

REVOKE ALL ON FUNCTION public.has_marketing_role(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_marketing_role(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_my_marketing_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_my_marketing_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_my_marketing_role() TO authenticated;

DROP POLICY IF EXISTS "Allow public read access to social_profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Allow public access to social_profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Allow public read access to marketing_campaigns" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Allow public access to marketing_campaigns" ON public.marketing_campaigns;

DROP POLICY IF EXISTS "Marketing users can read their social profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Marketing editors can create social profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Marketing editors can update social profiles" ON public.social_profiles;
DROP POLICY IF EXISTS "Marketing admins can delete social profiles" ON public.social_profiles;

CREATE POLICY "Marketing users can read their social profiles"
ON public.social_profiles FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

CREATE POLICY "Marketing editors can create social profiles"
ON public.social_profiles FOR INSERT TO authenticated
WITH CHECK (public.has_marketing_role('editor'));

CREATE POLICY "Marketing editors can update social profiles"
ON public.social_profiles FOR UPDATE TO authenticated
USING (public.has_marketing_role('editor'))
WITH CHECK (public.has_marketing_role('editor'));

CREATE POLICY "Marketing admins can delete social profiles"
ON public.social_profiles FOR DELETE TO authenticated
USING (public.has_marketing_role('admin'));

DROP POLICY IF EXISTS "Marketing users can read campaigns" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Marketing editors can create campaigns" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Marketing editors can update campaigns" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Marketing admins can delete campaigns" ON public.marketing_campaigns;

CREATE POLICY "Marketing users can read campaigns"
ON public.marketing_campaigns FOR SELECT TO authenticated
USING (public.has_marketing_role('viewer'));

CREATE POLICY "Marketing editors can create campaigns"
ON public.marketing_campaigns FOR INSERT TO authenticated
WITH CHECK (public.has_marketing_role('editor'));

CREATE POLICY "Marketing editors can update campaigns"
ON public.marketing_campaigns FOR UPDATE TO authenticated
USING (public.has_marketing_role('editor'))
WITH CHECK (public.has_marketing_role('editor'));

CREATE POLICY "Marketing admins can delete campaigns"
ON public.marketing_campaigns FOR DELETE TO authenticated
USING (public.has_marketing_role('admin'));

-- Ejemplo operativo posterior a crear el usuario en Supabase Auth:
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('UUID_DEL_USUARIO_ADMIN', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
