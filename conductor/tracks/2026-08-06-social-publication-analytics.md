# Track: VitaBlue Social Publication Analytics — métricas nativas de publicaciones

**Fecha:** 2026-08-06  
**Estado:** Planificado  
**Objetivo:** incorporar estadísticas nativas de publicaciones sociales en Marketing Studio, comenzando por Facebook e Instagram mediante Meta Graph API y dejando preparadas las decisiones de arquitectura para TikTok, X y LinkedIn.

## Contexto y decisión principal

Marketing Studio ya permite gestionar campañas, perfiles, enlaces de atribución y registrar manualmente publicaciones mediante URL. También existe una conexión OAuth de Meta para Facebook e Instagram. Sin embargo, todavía no se consultan métricas nativas de las publicaciones: alcance, impresiones, reproducciones, reacciones, comentarios, compartidos o guardados.

La conexión OAuth no debe considerarse equivalente a una integración de analytics. Para mostrar estadísticas fiables hacen falta:

- tokens válidos y almacenados de forma segura en backend;
- IDs de página, cuenta profesional, media y publicación;
- permisos aprobados por cada plataforma;
- funciones server-side para consultar las APIs;
- almacenamiento histórico de snapshots;
- asociación entre publicación externa, campaña y plataforma;
- tratamiento de expiración, errores, límites y ausencia de métricas.

La decisión inicial es implementar primero Meta, porque Facebook e Instagram son las únicas plataformas con conexión real parcialmente habilitada. TikTok, X y LinkedIn quedan fuera de la primera entrega hasta completar sus integraciones reales y confirmar los productos/API disponibles.

## Estado actual del proyecto

- Marketing Studio tiene campañas en `marketing-studio/utils/campaigns.ts`.
- Las publicaciones se registran manualmente en `marketing-studio/utils/marketingPublications.ts`.
- `CampaignPublicationsPanel.tsx` guarda URL, plataforma, cuenta, estado, fecha, enlace asociado y notas.
- La entidad `MarketingPublication` ya contempla `externalPostId`, pero todavía no se usa para consultar métricas.
- Existe `oauth_connections` para guardar el estado de conexiones externas.
- La conexión Meta usa `oauth-callback` y solicita permisos de páginas e Instagram.
- La aplicación no tiene todavía servicios de analytics ni funciones para insights.
- No existe una tabla de snapshots de métricas sociales.
- No debe confundirse el tracking propio de clics de `marketing_links` con las métricas nativas de Facebook, Instagram o cualquier otra red.
- TikTok, X y LinkedIn tienen partes de interfaz o URLs OAuth preparadas, pero no deben considerarse integraciones productivas hasta completar el intercambio de tokens y las consultas verificadas.

## Alcance funcional

### Incluido en la primera versión: Meta

- Detectar y almacenar el ID externo de la publicación al registrar o publicar un post.
- Resolver las páginas de Facebook disponibles para la conexión Meta.
- Resolver la cuenta profesional de Instagram vinculada a una página cuando corresponda.
- Consultar métricas compatibles con el tipo de publicación y la API vigente.
- Guardar snapshots con fecha de consulta y origen.
- Mostrar el último valor disponible en la campaña.
- Mostrar fecha de última sincronización y estado de la consulta.
- Permitir sincronización manual desde el backoffice.
- Preparar sincronización programada mediante Edge Function o job backend.
- Mostrar estados claros: conectado, sin ID externo, token expirado, sin permisos, no disponible o error temporal.
- Mantener los datos manuales de publicación aunque falle la consulta de métricas.

### Métricas objetivo para Meta

La lista final debe validarse contra la versión de Graph API disponible y el tipo de cuenta/publicación. Como objetivo inicial:

- Facebook: reacciones, comentarios, compartidos, clics o interacciones disponibles, alcance e impresiones cuando la API y los permisos lo permitan.
- Instagram: impresiones, alcance, likes, comentarios, guardados, compartidos, reproducciones y visualizaciones cuando estén disponibles para el tipo de media.
- Vídeo/Reels: reproducciones y tiempo de visualización solo si el endpoint y el permiso aplicable lo soportan.

No se deben mostrar ceros como si fueran datos reales cuando una métrica no esté disponible. La interfaz debe diferenciar entre `0`, `null` y “no soportado”.

### Fuera de la primera versión

- Analytics de TikTok antes de completar su OAuth real y confirmar acceso a Content Posting/Display o APIs de analytics.
- Analytics de X antes de completar OAuth PKCE, permisos de lectura y disponibilidad de métricas para el tipo de publicación.
- Analytics de LinkedIn antes de completar OAuth de organización, permisos de página y productos aprobados.
- Benchmarking entre competidores.
- Predicciones de rendimiento.
- Atribución de conversiones de negocio.
- Métricas demográficas sensibles sin consentimiento, base legal y soporte explícito de la plataforma.
- Actualizaciones en tiempo real.
- Prometer métricas históricas cuando la plataforma solo devuelve ventanas temporales limitadas.

## Modelo de datos propuesto

### Cambios en `marketing_campaign_publications`

Mantener la publicación manual existente y añadir, si todavía no existe en Supabase:

- `external_post_id` text nullable.
- `external_account_id` text nullable.
- `external_parent_id` text nullable para página, cuenta o canal propietario.
- `published_at` timestamptz nullable.
- `analytics_status` text: `not_configured`, `pending`, `synced`, `expired`, `forbidden`, `unsupported`, `error`.
- `analytics_last_synced_at` timestamptz nullable.
- `analytics_error` text nullable, sin incluir tokens ni secretos.

### `marketing_publication_metric_snapshots`

- `id` uuid.
- `publication_id` uuid con relación a `marketing_campaign_publications`.
- `campaign_id` uuid para consultas eficientes y auditoría.
- `platform` text.
- `external_post_id` text.
- `captured_at` timestamptz.
- `metrics` jsonb con nombres normalizados y valores numéricos.
- `raw_metrics` jsonb opcional, solo si no contiene datos sensibles y resulta necesario para depuración.
- `source_api_version` text.
- `status` text: `success`, `partial`, `unsupported`, `forbidden`, `error`.
- `error_code` text nullable.
- `created_at` timestamptz.

### Métricas normalizadas

Usar un contrato común para que la interfaz no dependa de cada proveedor:

- `impressions`.
- `reach`.
- `views`.
- `likes`.
- `comments`.
- `shares`.
- `saves`.
- `clicks`.
- `engagements`.
- `watch_time_seconds`.

Cada valor debe aceptar `null` cuando no esté disponible. No rellenar ausencias con `0`.

## Arquitectura objetivo

```text
Marketing Studio
      |
      v
Publicación + externalPostId + plataforma
      |
      v
Edge Function / backend analytics-sync
      |
      +--> Meta Graph API
      +--> TikTok API futura
      +--> X API futura
      +--> LinkedIn API futura
      |
      v
metric snapshots en Supabase
      |
      v
Campaña --> publicación --> tarjetas y series de métricas
```

Los tokens y las llamadas a proveedores deben permanecer en backend o Edge Functions. El navegador no debe recibir tokens de larga duración ni llamar directamente a endpoints que expongan credenciales.

## Fases de implementación

### Fase 0 — Auditoría de credenciales, permisos y contrato

- [ ] Confirmar la versión de Meta Graph API que se usará.
- [ ] Confirmar que la app Meta tiene los productos y permisos aprobados para producción.
- [ ] Confirmar si la página de Facebook es administrable por el usuario conectado.
- [ ] Confirmar que Instagram usa cuenta profesional y está vinculada a una página de Facebook.
- [ ] Documentar expiración y renovación de tokens.
- [ ] Enumerar métricas disponibles por tipo de publicación.
- [ ] Definir nombres normalizados y significado de cada métrica.
- [ ] Decidir si las publicaciones se crearán desde VitaBlue o se registrarán manualmente después de publicar.

**Salida:** matriz de plataformas, permisos, endpoints, métricas y limitaciones.

### Fase 1 — Modelo, seguridad y migraciones

- [ ] Crear migración para campos adicionales de `marketing_campaign_publications`.
- [ ] Crear `marketing_publication_metric_snapshots`.
- [ ] Activar RLS.
- [ ] Permitir lectura de métricas únicamente a usuarios autenticados con rol `viewer`, `editor` o `admin` del Marketing Studio.
- [ ] Permitir insertar snapshots únicamente desde funciones backend o una ruta server-side autorizada.
- [ ] Añadir índices por `publication_id`, `campaign_id`, `platform` y `captured_at`.
- [ ] Evitar almacenar access tokens en tablas accesibles al cliente.
- [ ] Añadir retención o limpieza de snapshots si el volumen crece.

**Criterio:** un usuario anónimo no puede consultar métricas internas ni modificar publicaciones.

### Fase 2 — Integración Meta server-side

- [ ] Revisar `oauth-callback` para guardar la conexión Meta necesaria para páginas e Instagram.
- [ ] Guardar de forma segura tokens y fechas de expiración.
- [ ] Implementar resolución de páginas administrables.
- [ ] Implementar resolución de cuenta profesional de Instagram vinculada.
- [ ] Implementar cliente server-side con timeouts, reintentos limitados y logs sin secretos.
- [ ] Añadir consulta de insights por publicación de Facebook.
- [ ] Añadir consulta de insights por media de Instagram.
- [ ] Normalizar respuestas a `metrics`.
- [ ] Registrar `status`, versión de API y errores de proveedor.
- [ ] Tratar respuestas parciales y métricas no soportadas.

### Fase 3 — Registro y sincronización de publicaciones

- [ ] Permitir introducir `externalPostId` desde el panel de publicaciones.
- [ ] Extraer el ID desde URLs de Facebook e Instagram solo cuando el formato sea fiable.
- [ ] No asumir que el ID visible en una URL es suficiente para todos los tipos de media.
- [ ] Validar que la publicación pertenece a la cuenta/página conectada cuando la API lo permita.
- [ ] Añadir acción “Sincronizar estadísticas”.
- [ ] Añadir sincronización de todas las publicaciones de una campaña.
- [ ] Guardar un snapshot por ejecución, evitando duplicados accidentales.
- [ ] Mantener el formulario editable aunque la sincronización falle.

### Fase 4 — Interfaz de campaña

- [ ] Añadir tarjeta de estadísticas por publicación.
- [ ] Mostrar última sincronización y estado.
- [ ] Mostrar métricas no disponibles como “No disponible”, no como cero.
- [ ] Mostrar variación frente al snapshot anterior cuando existan dos puntos de datos.
- [ ] Mostrar acumulados de campaña sin sumar métricas incompatibles.
- [ ] Mostrar enlace a la publicación externa.
- [ ] Añadir mensajes accionables para permisos, token expirado, ID ausente y API no compatible.
- [ ] Mantener una vista de datos manuales y una vista de datos nativos claramente diferenciadas.

### Fase 5 — Automatización y observabilidad

- [ ] Crear job periódico de sincronización con frecuencia prudente.
- [ ] Aplicar límites de rate y backoff.
- [ ] Registrar duración, proveedor, publicación, resultado y código de error.
- [ ] Añadir alertas para tokens próximos a expirar.
- [ ] Añadir reintento manual desde el backoffice.
- [ ] Evitar que un error de una publicación interrumpa toda la campaña.
- [ ] Documentar costes, límites y ventanas históricas de cada API.

### Fase 6 — TikTok, X y LinkedIn

- [ ] TikTok: confirmar producto/API y permisos concretos para consultar estadísticas de vídeos publicados.
- [ ] TikTok: reemplazar el intercambio simulado de OAuth por un flujo backend real.
- [ ] X: implementar OAuth 2.0 PKCE real, permisos de lectura y consulta de métricas disponibles.
- [ ] LinkedIn: confirmar acceso de organización, permisos aprobados y endpoints de page/post analytics.
- [ ] Implementar cada proveedor detrás del contrato normalizado, sin acoplar la UI a su respuesta.
- [ ] Añadir pruebas de capacidad por plataforma antes de mostrar la opción al usuario.
- [ ] No mostrar una plataforma como “conectada” si solo existe una simulación local.

## Reglas de negocio iniciales

- Una conexión OAuth no implica que las estadísticas estén disponibles.
- Las métricas nativas deben etiquetarse por plataforma y fecha de captura.
- `0` significa cero confirmado; `null` significa no disponible o no soportado.
- No se deben borrar datos manuales si falla una sincronización.
- Un snapshot histórico no se sobreescribe: se crea uno nuevo, salvo deduplicación explícita de la misma ejecución.
- Las métricas de enlaces propios no deben mezclarse con impresiones o alcance de una red social.
- Las métricas deben atribuirse a una publicación externa concreta, no solo a una campaña.
- Los tokens nunca se envían al navegador ni se incluyen en errores, logs o respuestas de UI.
- Las publicaciones sin `externalPostId` deben mostrar “Estadísticas no configuradas”.
- La interfaz no debe afirmar que una métrica es completa si la API devuelve datos parciales.
- La suma de likes, comentarios y compartidos no debe presentarse como engagement oficial salvo que así se defina y documente.

## Criterios de aceptación

- Un administrador puede conectar Meta y ver claramente la página y cuenta profesional asociadas.
- Una publicación de Facebook con `externalPostId` válido puede sincronizar sus métricas desde backend.
- Una publicación de Instagram con media ID válido puede sincronizar sus métricas compatibles.
- Las métricas se guardan como snapshots históricos en Supabase.
- Una respuesta parcial no rompe el panel y muestra qué datos faltan.
- Un token expirado produce un estado accionable y no un error genérico.
- Una publicación sin ID externo no intenta una consulta inválida.
- Los datos manuales de URL, estado y fecha permanecen intactos tras un error de analytics.
- Un usuario sin rol no puede ejecutar una sincronización ni leer snapshots privados.
- El navegador nunca expone access tokens.
- El build, las pruebas de integración, las políticas RLS y las funciones backend pasan antes de publicar.
- TikTok, X y LinkedIn no aparecen como analytics disponibles hasta tener una integración real verificada.

## Dependencias y decisiones pendientes

- Confirmar acceso de producción y revisión de permisos de Meta.
- Confirmar si se publicará vía API o si las publicaciones seguirán siendo manuales.
- Confirmar estrategia de renovación de tokens Meta.
- Elegir Edge Functions de Supabase frente a otro backend para los jobs.
- Definir retención de snapshots y granularidad histórica.
- Definir zona horaria de presentación.
- Decidir si las métricas se muestran solo por publicación o también en un dashboard agregado.
- Confirmar presupuesto y límites de cada proveedor.
- Confirmar qué métricas son imprescindibles para la primera versión: alcance, impresiones, interacciones y reproducciones.
- Revisar política de privacidad, tratamiento de identificadores externos y retención de datos.
