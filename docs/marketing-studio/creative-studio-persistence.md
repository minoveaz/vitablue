# Contratos de persistencia de Creative Studio

**Fecha:** 2026-08-27  
**Fases:** 1 — contratos y tenancy; 2 — persistencia de proyectos  
**Estado:** contratos definidos y adaptadores de Fase 2 preparados

## Referencias revisadas

- VitaBlue: `supabase/01_schema.sql`, `supabase/02_rls_policies.sql`,
  `supabase/06_marketing_auth_roles.sql`, `marketing-studio/types/imageStudio.ts`
  y los adaptadores de persistencia local.
- Loopdev remoto (`minoveaz/loopdev`): ramas `main` y
  `feature/crm-shared-foundation`; migraciones de Platform Core para
  organizaciones, permisos, marcas, workspaces y campañas, además de
  `packages/contracts/src/platform/tenancy.ts` y
  `packages/contracts/src/marketing/{scope,asset}.ts`.

Loopdev es la referencia canónica de tenancy: el permiso se resuelve en
server-side con `has_organization_permission(organization_id, permission)`.
Los contratos locales de VitaBlue no sustituyen esa comprobación.

## Modelo de dominio

```text
Campaign (opcional)
  └── CreativeProject (organization + workspace + brand)
        ├── CreativeProjectVersion (snapshot inmutable)
        ├── CreativeProjectVariant (derivada de una versión)
        ├── CreativeAssetReference (capa → asset)
        └── CreativeAsset (Storage metadata)
```

### Creative Project

`CreativeProject` representa el documento editable, no un fichero exportado.
Su `composition` es JSON estructurado y `currentVersion` empieza en `1`.
Los tipos soportados son `image`, `carousel`, `video`, `document`,
`social_post`, `story` y `advertisement`. Los estados son `draft`, `ready` y
`archived`.

Cada proyecto exige `organizationId`, `workspaceId` y `brandId`. La asociación
con `campaignId` es opcional. El scope de tenancy es inmutable en el contrato
de actualización.

### Versions y variants

Una versión contiene un snapshot con `schemaVersion: 1`, nombre, tipo creativo,
composición y metadata. No se modifica: una edición crea otra versión con un
número creciente y `changeSummary` opcional.

Una variante identifica una derivación (`format`, `platform`, `color`, `copy`,
`cta` o `image`) desde `sourceVersion`. Puede declarar plataforma, ratio,
dimensiones y `overrides`, sin duplicar el proyecto base.

### Assets y referencias

`CreativeAsset` contiene metadata de un objeto de Supabase Storage: clase
`source`, `font` o `export`, origen `upload`, `import`, `generated` o `export`,
MIME, tamaño, checksum, dimensiones y ruta. Los assets pueden ser:

- específicos de workspace/brand;
- compartidos por toda la organización cuando esos dos campos son `null`.

`CreativeAssetReference` enlaza una capa (`layerId`) con un asset dentro de un
proyecto o snapshot. Conserva `focalPoint`, `crop`, `mask` y reglas de
sustitución (`none`, `manual`, `same_type`, `tag`).

No se aceptan URLs `data:` ni `blob:` en composiciones o rutas de assets.
Imágenes, blobs y exportaciones viven en Storage; el JSON editable guarda
referencias y metadata.

## Ownership y acceso

La fila de cada entidad debe mantener el mismo `organization_id` que su
proyecto. Las foreign keys compuestas previstas para Fase 2 serán:

- `(brand_id, organization_id) → brands`;
- `(workspace_id, organization_id) → workspaces`;
- `campaign_id → marketing_campaign_records` cuando exista.

Un asset compartido a nivel organización se puede leer desde cualquier
workspace/brand de esa organización, nunca desde otra organización. Si
`workspace_brands` tiene filas, el workspace también debe estar vinculado a la
marca; un workspace sin filas conserva el alcance organizativo de Loopdev.

| Rol | read | edit | approve | publish | manage |
| --- | --- | --- | --- | --- | --- |
| `owner` | sí | sí | sí | sí | sí |
| `admin` | sí | sí | sí | sí | sí |
| `agent` (Loopdev) | sí | no | no | no | no |
| `editor` (VitaBlue legacy) | sí | sí | no | no | no |
| `viewer` | sí | no | no | no | no |

La plataforma puede conceder bypass a administradores de plataforma, pero las
filas siguen filtrándose por organización. `editor` solo es una compatibilidad
temporal con `public.user_roles`; no es un nuevo rol de Loopdev. En Fase 2 las
operaciones usarán `marketing.read` y `marketing.manage` mediante RPC/RLS,
nunca una decisión únicamente del cliente.

## Implementación de Fase 1

Los contratos Zod y sus tipos inferidos están en
`marketing-studio/contracts/creativePersistence.ts`, reexportados desde
`marketing-studio/contracts/index.ts`. Las pruebas cubren defaults, rechazo de
payloads inline, inmutabilidad del scope, entidades relacionadas y la matriz
de permisos. Las migraciones de proyectos, versiones y variantes están en
`supabase/migrations/20260827230000_create_marketing_creative_persistence.sql`.
El repositorio Supabase y el fallback IndexedDB/localStorage están en
`marketing-studio/utils/creativeProjectRepository.ts`.

## Fase 2: límites de la arquitectura actual

El repositorio remoto usa el cliente publishable de Supabase y delega la
autorización en RLS y en `save_marketing_creative_project`, que hace el
autosave con `expected_updated_at` y `client_mutation_id` de forma atómica.
Los reintentos con el mismo mutation id no crean versiones duplicadas. Cuando
no hay red, el adaptador conserva el proyecto en IndexedDB (con localStorage
como último fallback); la sincronización explícita seguirá siendo necesaria al
conectar el editor en Fase 4.

VitaBlue es actualmente una SPA Vite: no existe un servidor HTTP ni un
directorio de route handlers. Por eso no se añadió una falsa API `/api`; el
repositorio es el contrato/adaptador que puede conectarse a una Edge Function
o backend server-side cuando se defina esa frontera. La migración exige que la
plataforma de tenancy publique `organization_id` (y opcionalmente
`workspace_id`/`brand_id`) en los claims JWT. El `user_roles` actual solo tiene
roles globales y no puede autorizar organizaciones por sí mismo.

No se ejecutaron migraciones ni se levantó Docker/Supabase. Para activar el
guardado remoto y validar RLS se necesitan Docker/Supabase activos y los claims
de tenancy disponibles, además de aplicar antes `06_marketing_auth_roles.sql`
(la migración usa `has_marketing_role`). Hasta entonces el editor existente
mantiene IndexedDB como ruta local; la integración del editor con el repositorio
remoto queda para la siguiente iteración.
