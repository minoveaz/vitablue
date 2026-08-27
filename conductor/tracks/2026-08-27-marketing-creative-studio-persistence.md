# Track: Persistencia de Marketing Studio / Creative Studio

**Fecha:** 2026-08-27  
**Estado:** Propuesto / En definición  
**Áreas:** `[marketing-studio, creative-studio, supabase, assets, campaigns, crm-patterns]`

## Objetivo

Crear una base persistente y multi-tenant para Creative Studio dentro de
Marketing Studio. Los proyectos editables, sus versiones, variantes, recursos
referenciados y exportaciones deben sobrevivir al navegador local y estar
disponibles para reutilización futura.

## Decisión de dominio

Un diseño de Image Studio es un **Creative Project**, no un asset simple.
Un **Creative Asset** es un recurso derivado o reutilizable: PNG, JPG, ZIP,
PDF, panorama, vídeo, miniatura o recurso subido. El proyecto conserva la
composición editable; los archivos se almacenan en Supabase Storage y se
referencian mediante metadata, nunca como base64 dentro del JSON principal.

```text
Campaign
  └── Creative Project
        ├── Versions
        ├── Variants
        ├── Source asset references
        └── Exported creative assets
```

## Alcance

- Persistencia Supabase para proyectos creativos.
- Storage separado para imágenes, fuentes y exportaciones.
- Tenancy por `organization_id`, `workspace_id` y `brand_id`.
- Asociación opcional con campañas, canales y publicaciones.
- Estados `draft`, `ready`, `archived`.
- Versionado, recuperación y auditoría.
- Migración desde IndexedDB/localStorage cuando el usuario lo solicite.
- Caché local offline sin ser la fuente de verdad.
- Permisos siguiendo el patrón de Contacts/Leads de Loopdev.
- API server-side y validación de contratos.

## Modelo inicial

### `marketing_creative_projects`

Identidad, nombre, tipo creativo, estado, campaña asociada, configuración,
layout y composición editable normalizada.

### `marketing_creative_project_versions`

Snapshots inmutables del proyecto, número de versión, autor, motivo y fecha.

### `marketing_creative_variants`

Variantes de formato, plataforma, color, copy, CTA o imagen derivadas de un
proyecto base.

### `marketing_creative_assets`

Archivos exportados o recursos reutilizables con `storage_path`, MIME, tamaño,
dimensiones, formato, plataforma y referencia al proyecto/versión.

### `marketing_creative_asset_references`

Referencias desde capas del proyecto a assets almacenados, incluyendo focal
point, recorte, máscara y reglas de sustitución.

## Fases

### Fase 1 — Contratos y tenancy

**Resultado:** modelo de dominio aprobado y compatible con la plataforma.

- [x] Revisar el esquema Supabase actual de VitaBlue.
- [x] Adoptar patrones de organizaciones, workspaces, marcas y permisos.
- [x] Definir contratos TypeScript y schemas de validación.
- [x] Definir estados, tipos creativos y reglas de ownership.
- [x] Documentar matriz de acceso por rol y workspace.

### Fase 2 — Persistencia de proyectos

**Resultado:** guardar y abrir proyectos editables desde Supabase.

- [x] Crear migraciones para proyectos, versiones y variantes.
- [ ] Implementar repositorio server-side de Creative Studio.
- [ ] Añadir API CRUD con autorización.
- [ ] Sustituir IndexedDB como fuente de verdad sin romper modo offline.
- [x] Implementar autosave con control de concurrencia y `updated_at`.
- [x] Añadir recuperación ante errores de red sin duplicar versiones.

### Fase 3 — Assets y Storage

**Resultado:** recursos desacoplados del documento creativo.

- [ ] Crear buckets y políticas de Supabase Storage.
- [ ] Separar recursos fuente de exportaciones derivadas.
- [ ] Implementar referencias de assets desde capas.
- [ ] Evitar base64 persistente y controlar límites de tamaño.
- [ ] Añadir eliminación segura y detección de assets huérfanos.
- [ ] Generar miniaturas y metadata sin bloquear el editor.

### Fase 4 — Integración con Marketing Studio

**Resultado:** Creative Studio funciona como módulo nativo de Marketing Studio.

- [ ] Conectar proyectos con campañas, marcas, canales y publicaciones.
- [ ] Añadir estados, búsqueda, filtros y archivado.
- [ ] Persistir versiones, recuperación y cambios multi-slide.
- [ ] Migrar proyectos locales seleccionados por el usuario.
- [ ] Añadir importación/exportación de proyecto ligero.
- [ ] Mantener compatibilidad con carruseles y layouts existentes.

### Fase 5 — Calidad y operación

**Resultado:** operación segura, observable y mantenible.

- [ ] Tests de tenancy, permisos, contratos y concurrencia.
- [ ] Tests de migración IndexedDB/localStorage.
- [ ] Validar exportaciones y referencias rotas.
- [ ] Añadir observabilidad, limpieza de assets huérfanos y documentación.
- [ ] Definir backups, retención y límites de almacenamiento.
- [ ] Ejecutar una migración piloto antes de activar la sincronización por defecto.

## Dependencias entre fases

La Fase 1 bloquea las Fases 2 y 3. La Fase 2 debe existir antes de migrar
proyectos desde el navegador. La Fase 3 puede desarrollarse en paralelo con
la API de proyectos, pero la integración completa de la Fase 4 depende de
ambas. La activación por defecto queda bloqueada hasta completar la Fase 5 y
validar una migración piloto reversible.

## Criterios de aceptación

- Un Creative Project puede abrirse desde cualquier dispositivo autorizado.
- El JSON editable no contiene imágenes base64 ni blobs innecesarios.
- Los assets exportados son versionables y reutilizables.
- La eliminación de caché local no elimina el trabajo persistido.
- Las reglas de organización, workspace y marca se aplican server-side.
- Los carruseles actuales pueden migrarse sin perder composición ni metadata.

## Fuera de alcance inicial

- Reemplazar el CRM de Contacts/Leads.
- Construir un DAM completo.
- Procesamiento avanzado de vídeo.
- Sincronización colaborativa en tiempo real.
