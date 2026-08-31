# Contratos de persistencia de Creative Studio

**Fecha:** 2026-08-27  
**Fases:** 1–5 — contratos, persistencia, integración remota y rollout
**Estado:** VitaBlue conectado al repositorio y Storage privados de LoopDev

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
referencias y metadata. Las URLs firmadas solo existen durante la sesión: al
cargar un proyecto o la biblioteca se renuevan desde el `storage_path`, y los
exports de carrusel (ZIP, PDF y panorama) se registran como assets remotos.

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
filas siguen filtrándose por organización. En LoopDev, `owner` y `admin` pueden
gestionar Marketing, mientras que `agent` puede leerlo. En Fase 2 las
operaciones usan `marketing.read` y `marketing.manage` mediante RPC/RLS, nunca
una decisión únicamente del cliente.

### Retirada segura

LoopDev no expone `DELETE` para proyectos creativos, versiones ni variantes:
sus grants y políticas de `marketing.manage` permiten conservar el historial y
actualizar el estado. VitaBlue retira un proyecto mediante `status = 'archived'`
con `organization_id`, `workspace_id`, `brand_id` y `updated_at` esperados; los
conflictos se muestran como una actualización concurrente, sin mostrar detalles
del error remoto. Las referencias de assets permanecen protegidas por sus FKs y
los assets solo se limpian mediante el flujo de huérfanos permitido por LoopDev.

## Implementación de Fase 1

Los contratos Zod y sus tipos inferidos están en
`marketing-studio/contracts/creativePersistence.ts`, reexportados desde
`marketing-studio/contracts/index.ts`. Las pruebas cubren defaults, rechazo de
payloads inline, inmutabilidad del scope, entidades relacionadas y la matriz
de permisos. Las migraciones de proyectos, versiones y variantes están en
`supabase/migrations/20260827230000_create_marketing_creative_persistence.sql`.
El repositorio Supabase está en
`marketing-studio/utils/creativeProjectRepository.ts`; los adaptadores locales
se conservan únicamente para leer migraciones legacy explícitas.

## Integración remota de VitaBlue

El repositorio remoto usa el cliente publishable de Supabase y delega la
autorización en RLS y en `save_marketing_creative_project`, que hace el
autosave con `expected_updated_at` y `client_mutation_id` de forma atómica.
Los reintentos con el mismo mutation id no crean versiones duplicadas. El editor
mantiene el documento únicamente en memoria y reintenta el autosave remoto con
debounce; no usa IndexedDB ni localStorage para proyectos, medios o recovery.

VitaBlue es actualmente una SPA Vite: no existe un servidor HTTP ni un
directorio de route handlers. Por eso no se añadió una falsa API `/api`; el
repositorio es el contrato/adaptador que puede conectarse a una Edge Function
o backend server-side cuando se defina esa frontera. La integración local de
LoopDev no publica un scope de tenancy en claims JWT: `getCreativeScope`
consulta las filas visibles de `organization_memberships`, `workspaces`,
`workspace_brands` y `brands`, siempre con el cliente publishable.

La interfaz de VitaBlue solo usa esas filas para elegir una organización,
workspace de Marketing y marca disponibles. La autorización real se mantiene
en RLS y en `has_organization_permission` (`marketing.read` /
`marketing.manage`); el cliente no decide permisos ni acepta claims
`organization_id`, `workspace_id` o `brand_id`.
Los uploads usan buckets privados y registran metadata en
`marketing_creative_assets`; los paquetes ligeros contienen JSON sin binarios.
La migración `20260827230000_create_marketing_creative_persistence.sql` provisiona
la tabla, los tres buckets privados y las políticas tenant-scoped compatibles
con LoopDev. Requiere las tablas de Platform Core y sus funciones de membresía/
permisos. El scope se resuelve con consultas RLS del usuario autenticado,
nunca desde `user_metadata`, `service_role` ni claims personalizados.
La importación de datos legacy solo se inicia mediante la acción explícita
“Importar diseños del navegador”, permite seleccionar proyectos y conserva los
originales para poder revertir.

## Rollout de CreativeDocument v1

Las rutas de edición escriben `CreativeDocument` v1 por defecto. El rollback es
explícito y reversible: `VITE_CREATIVE_DOCUMENT_IMAGE_MIGRATION=false` mantiene
el envelope `imageStudio`, y `VITE_CREATIVE_DOCUMENT_VIDEO_MIGRATION=false`
mantiene `videoStudio`. Ambos decoders siguen activos para leer datos existentes.

Antes de activar el rollout en un entorno con datos reales, ejecutar
`rehearseCreativeDocumentPersistence` con una muestra representativa de cada
tipo. La rehearsal no escribe en Supabase: valida los dos encoders, la migración
y el round-trip al modelo legacy. Si falla por un asset sin referencia estable,
debe promoverse primero a `marketing_creative_assets`; no se debe persistir una
URL firmada o un payload inline como atajo.
