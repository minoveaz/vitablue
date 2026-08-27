-- Marketing Creative Studio, fase 2.
-- Esta migración es deliberadamente aditiva y no crea organizaciones/workspaces
-- de VitaBlue. Esas tablas y sus claims de tenancy deben existir antes de activarla.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.marketing_creative_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  brand_id uuid NOT NULL,
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  campaign_id text,
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 160),
  creative_type text NOT NULL CHECK (creative_type IN (
    'image', 'carousel', 'video', 'document', 'social_post', 'story', 'advertisement'
  )),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
  current_version integer NOT NULL DEFAULT 1 CHECK (current_version > 0),
  composition jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (id, organization_id, workspace_id, brand_id)
);

CREATE TABLE IF NOT EXISTS public.marketing_creative_project_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  brand_id uuid NOT NULL,
  version integer NOT NULL CHECK (version > 0),
  snapshot jsonb NOT NULL,
  change_summary text CHECK (change_summary IS NULL OR char_length(btrim(change_summary)) <= 500),
  client_mutation_id uuid,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version),
  UNIQUE (client_mutation_id),
  CONSTRAINT marketing_creative_project_versions_project_scope_fk
    FOREIGN KEY (project_id, organization_id, workspace_id, brand_id)
    REFERENCES public.marketing_creative_projects(id, organization_id, workspace_id, brand_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.marketing_creative_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  organization_id uuid NOT NULL,
  workspace_id uuid NOT NULL,
  brand_id uuid NOT NULL,
  source_version integer NOT NULL CHECK (source_version > 0),
  kind text NOT NULL CHECK (kind IN ('format', 'platform', 'color', 'copy', 'cta', 'image')),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 160),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ready', 'archived')),
  platform text CHECK (platform IS NULL OR platform IN (
    'instagram', 'tiktok', 'linkedin', 'facebook', 'x', 'youtube', 'email', 'web', 'document'
  )),
  aspect_ratio text CHECK (aspect_ratio IS NULL OR aspect_ratio ~ '^[0-9]+(:[0-9]+)?$'),
  width integer CHECK (width IS NULL OR width > 0),
  height integer CHECK (height IS NULL OR height > 0),
  overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketing_creative_variants_project_scope_fk
    FOREIGN KEY (project_id, organization_id, workspace_id, brand_id)
    REFERENCES public.marketing_creative_projects(id, organization_id, workspace_id, brand_id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS marketing_creative_projects_scope_idx
  ON public.marketing_creative_projects (organization_id, workspace_id, brand_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS marketing_creative_projects_campaign_idx
  ON public.marketing_creative_projects (campaign_id);
CREATE INDEX IF NOT EXISTS marketing_creative_project_versions_project_idx
  ON public.marketing_creative_project_versions (project_id, version DESC);
CREATE INDEX IF NOT EXISTS marketing_creative_variants_project_idx
  ON public.marketing_creative_variants (project_id, updated_at DESC);

CREATE OR REPLACE FUNCTION public.marketing_creative_scope_matches_claims(
  p_organization_id uuid,
  p_workspace_id uuid,
  p_brand_id uuid
) RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    auth.uid() IS NOT NULL
    AND (
      (auth.jwt() ->> 'organization_id')::uuid = p_organization_id
      OR (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid = p_organization_id
    )
    AND (
      (auth.jwt() ->> 'workspace_id') IS NULL
      OR (auth.jwt() ->> 'workspace_id')::uuid = p_workspace_id
    )
    AND (
      (auth.jwt() ->> 'brand_id') IS NULL
      OR (auth.jwt() ->> 'brand_id')::uuid = p_brand_id
    );
$$;

CREATE OR REPLACE FUNCTION public.has_marketing_creative_permission(required_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    CASE
      WHEN required_role = 'viewer' THEN public.has_marketing_role('viewer')
      WHEN required_role = 'editor' THEN public.has_marketing_role('editor')
      WHEN required_role = 'admin' THEN public.has_marketing_role('admin')
      ELSE false
    END;
$$;

REVOKE ALL ON FUNCTION public.marketing_creative_scope_matches_claims(uuid, uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_marketing_creative_permission(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.marketing_creative_scope_matches_claims(uuid, uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_marketing_creative_permission(text) TO authenticated;

ALTER TABLE public.marketing_creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_creative_project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_creative_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creative users can read projects in their tenant" ON public.marketing_creative_projects;
CREATE POLICY "Creative users can read projects in their tenant"
  ON public.marketing_creative_projects FOR SELECT TO authenticated
  USING (
    public.has_marketing_creative_permission('viewer')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative editors can create projects in their tenant" ON public.marketing_creative_projects;
CREATE POLICY "Creative editors can create projects in their tenant"
  ON public.marketing_creative_projects FOR INSERT TO authenticated
  WITH CHECK (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative editors can update projects in their tenant" ON public.marketing_creative_projects;
CREATE POLICY "Creative editors can update projects in their tenant"
  ON public.marketing_creative_projects FOR UPDATE TO authenticated
  USING (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  )
  WITH CHECK (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative admins can delete projects in their tenant" ON public.marketing_creative_projects;
CREATE POLICY "Creative admins can delete projects in their tenant"
  ON public.marketing_creative_projects FOR DELETE TO authenticated
  USING (
    public.has_marketing_creative_permission('admin')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative users can read project versions in their tenant" ON public.marketing_creative_project_versions;
CREATE POLICY "Creative users can read project versions in their tenant"
  ON public.marketing_creative_project_versions FOR SELECT TO authenticated
  USING (
    public.has_marketing_creative_permission('viewer')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative editors can write project versions in their tenant" ON public.marketing_creative_project_versions;
CREATE POLICY "Creative editors can write project versions in their tenant"
  ON public.marketing_creative_project_versions FOR INSERT TO authenticated
  WITH CHECK (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative users can read variants in their tenant" ON public.marketing_creative_variants;
CREATE POLICY "Creative users can read variants in their tenant"
  ON public.marketing_creative_variants FOR SELECT TO authenticated
  USING (
    public.has_marketing_creative_permission('viewer')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative editors can create variants in their tenant" ON public.marketing_creative_variants;
CREATE POLICY "Creative editors can create variants in their tenant"
  ON public.marketing_creative_variants FOR INSERT TO authenticated
  WITH CHECK (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative editors can update variants in their tenant" ON public.marketing_creative_variants;
CREATE POLICY "Creative editors can update variants in their tenant"
  ON public.marketing_creative_variants FOR UPDATE TO authenticated
  USING (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  )
  WITH CHECK (
    public.has_marketing_creative_permission('editor')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

DROP POLICY IF EXISTS "Creative admins can delete variants in their tenant" ON public.marketing_creative_variants;
CREATE POLICY "Creative admins can delete variants in their tenant"
  ON public.marketing_creative_variants FOR DELETE TO authenticated
  USING (
    public.has_marketing_creative_permission('admin')
    AND public.marketing_creative_scope_matches_claims(organization_id, workspace_id, brand_id)
  );

CREATE OR REPLACE FUNCTION public.save_marketing_creative_project(
  p_project_id uuid,
  p_organization_id uuid,
  p_workspace_id uuid,
  p_brand_id uuid,
  p_owner_user_id uuid,
  p_campaign_id text,
  p_name text,
  p_creative_type text,
  p_status text,
  p_composition jsonb,
  p_metadata jsonb,
  p_expected_updated_at timestamptz DEFAULT NULL,
  p_change_summary text DEFAULT NULL,
  p_client_mutation_id uuid DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  current_row public.marketing_creative_projects%ROWTYPE;
  next_version integer;
  snapshot jsonb;
  content_changed boolean;
BEGIN
  IF NOT public.has_marketing_creative_permission('editor')
     OR NOT public.marketing_creative_scope_matches_claims(p_organization_id, p_workspace_id, p_brand_id) THEN
    RAISE EXCEPTION 'creative project authorization failed' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO current_row
  FROM public.marketing_creative_projects
  WHERE id = p_project_id
  FOR UPDATE;

  IF p_client_mutation_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.marketing_creative_project_versions
    WHERE client_mutation_id = p_client_mutation_id
  ) THEN
    RETURN (SELECT to_jsonb(p) FROM public.marketing_creative_projects p WHERE p.id = p_project_id);
  END IF;

  IF current_row.id IS NOT NULL AND p_expected_updated_at IS NOT NULL
     AND current_row.updated_at <> p_expected_updated_at THEN
    RAISE EXCEPTION 'creative project was modified by another client' USING ERRCODE = '40001';
  END IF;

  snapshot := jsonb_build_object(
    'schemaVersion', 1,
    'name', p_name,
    'creativeType', p_creative_type,
    'composition', p_composition,
    'metadata', coalesce(p_metadata, '{}'::jsonb)
  );
  content_changed := current_row.id IS NULL
    OR current_row.name IS DISTINCT FROM p_name
    OR current_row.creative_type IS DISTINCT FROM p_creative_type
    OR current_row.composition IS DISTINCT FROM p_composition
    OR current_row.metadata IS DISTINCT FROM coalesce(p_metadata, '{}'::jsonb);
  next_version := coalesce(current_row.current_version, 0) + CASE WHEN content_changed THEN 1 ELSE 0 END;

  IF current_row.id IS NULL THEN
    INSERT INTO public.marketing_creative_projects (
      id, organization_id, workspace_id, brand_id, owner_user_id, campaign_id,
      name, creative_type, status, current_version, composition, metadata,
      created_by, updated_by
    ) VALUES (
      p_project_id, p_organization_id, p_workspace_id, p_brand_id, p_owner_user_id, p_campaign_id,
      p_name, p_creative_type, coalesce(p_status, 'draft'), 1, p_composition,
      coalesce(p_metadata, '{}'::jsonb), auth.uid(), auth.uid()
    );
    next_version := 1;
  ELSE
    UPDATE public.marketing_creative_projects
    SET name = coalesce(p_name, name),
        creative_type = coalesce(p_creative_type, creative_type),
        status = coalesce(p_status, status),
        campaign_id = p_campaign_id,
        composition = coalesce(p_composition, composition),
        metadata = coalesce(p_metadata, metadata),
        current_version = next_version,
        updated_by = auth.uid(),
        updated_at = now()
    WHERE id = p_project_id;
  END IF;

  IF content_changed THEN
    INSERT INTO public.marketing_creative_project_versions (
      project_id, organization_id, workspace_id, brand_id, version, snapshot,
      change_summary, client_mutation_id, created_by
    ) VALUES (
      p_project_id, p_organization_id, p_workspace_id, p_brand_id, next_version, snapshot,
      p_change_summary, p_client_mutation_id, auth.uid()
    ) ON CONFLICT (client_mutation_id) DO NOTHING;
  END IF;

  RETURN (SELECT to_jsonb(p) FROM public.marketing_creative_projects p WHERE p.id = p_project_id);
END;
$$;

REVOKE ALL ON FUNCTION public.save_marketing_creative_project(uuid, uuid, uuid, uuid, uuid, text, text, text, text, jsonb, jsonb, timestamptz, text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_marketing_creative_project(uuid, uuid, uuid, uuid, uuid, text, text, text, text, jsonb, jsonb, timestamptz, text, uuid) TO authenticated;
