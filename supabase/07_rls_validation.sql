-- QUERY NAME: VitaBlue 07 - Validación RLS
-- =====================================================
-- VALIDACIÓN 07: RLS DEL BACKOFFICE (NO DESTRUCTIVA)
-- =====================================================
-- Ejecutar primero las comprobaciones estructurales en Supabase SQL Editor.
-- Las pruebas de acceso deben ejecutarse desde la aplicación con sesiones
-- reales, porque el SQL Editor suele usar el rol postgres y puede saltarse RLS.

-- 1) Deben existir RLS y las políticas esperadas.
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('user_roles', 'social_profiles', 'marketing_campaigns', 'oauth_connections')
ORDER BY tablename;

SELECT schemaname, tablename, policyname, roles, cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_roles', 'social_profiles', 'marketing_campaigns', 'oauth_connections')
ORDER BY tablename, policyname;

-- 2) Las funciones de autorización deben ser SECURITY DEFINER.
SELECT p.oid::regprocedure AS function_name,
       p.prosecdef AS security_definer,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') AS authenticated_can_execute
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('has_marketing_role', 'get_my_marketing_role');

-- 3) Confirmar que el administrador operativo está asignado.
SELECT ur.user_id, ur.role, ur.created_at
FROM public.user_roles ur
WHERE ur.role = 'admin';

-- Matriz funcional (ejecutar iniciando sesión con cada usuario en /login):
--
-- Perfil       SELECT campaigns/profiles   INSERT/UPDATE   DELETE
-- anónimo      DENEGADO                    DENEGADO        DENEGADO
-- sin rol      DENEGADO                    DENEGADO        DENEGADO
-- viewer       PERMITIDO                   DENEGADO        DENEGADO
-- editor       PERMITIDO                   PERMITIDO       DENEGADO
-- admin        PERMITIDO                   PERMITIDO       PERMITIDO
--
-- Para cada sesión, abrir DevTools y ejecutar únicamente lecturas o
-- operaciones de prueba sobre un registro de staging. No probar DELETE
-- hasta tener un registro desechable y una copia de respaldo.
