# Scripts SQL de VitaBlue

El editor SQL de Supabase guarda el nombre de cada consulta como metadato del
Dashboard. Ese nombre no puede ser asignado desde un archivo `.sql` local.

Al pegar un script en Supabase, cambia `Untitled query` por el nombre indicado:

| Archivo | Nombre recomendado en Supabase |
| --- | --- |
| `01_schema.sql` | `VitaBlue 01 - Schema` |
| `02_rls_policies.sql` | `VitaBlue 02 - RLS base` |
| `03_seed_data.sql` | `VitaBlue 03 - Seed data` |
| `04_campaign_delivery_modes.sql` | `VitaBlue 04 - Campaign delivery modes` |
| `05_campaign_content_types.sql` | `VitaBlue 05 - Campaign content types` |
| `06_marketing_auth_roles.sql` | `VitaBlue 06 - Auth y roles` |
| `07_rls_validation.sql` | `VitaBlue 07 - Validación RLS` |
| `08_oauth_connections.sql` | `VitaBlue 08 - OAuth connections` |
| `09_oauth_vault_helpers.sql` | `VitaBlue 09 - OAuth Vault helpers` |
| `10_oauth_states.sql` | `VitaBlue 10 - OAuth states` |
| `11_oauth_disconnect.sql` | `VitaBlue 11 - OAuth disconnect` |

Los scripts 06–09 incluyen también un comentario identificador al principio.
El nombre de la consulta debe guardarse manualmente en el Dashboard la primera
vez; después Supabase lo conservará en la sección **Private**.
