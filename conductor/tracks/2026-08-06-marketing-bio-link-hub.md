# Track: VitaBlue Bio Link Hub — página propia tipo Linktree

**Fecha:** 2026-08-06  
**Estado:** Planificado  
**Objetivo:** construir una página propia de enlaces para VitaBlue, optimizada para perfiles sociales, campañas y tráfico móvil, sin depender de Linktree u otra plataforma externa.

## Contexto y decisión principal

VitaBlue necesita una URL única para perfiles sociales que permita reunir la web, WhatsApp, redes sociales y campañas activas. La página debe funcionar como un “link in bio” propio, pero integrada con Marketing Studio, Supabase y el tracking de enlaces ya existente.

La decisión es construir una primera versión bajo el dominio propio:

```text
https://www.vitablue.es/bio
```

Los botones no deben apuntar directamente a WhatsApp cuando sea necesario medir atribución. Deben utilizar los enlaces internos `/r/:slug` y la tabla `marketing_links`, de forma que cada clic conserve canal, campaña, publicación y métricas.

## Estado actual del proyecto

- Existe Supabase como backend común y cliente en `marketing-studio/utils/supabaseClient.ts`.
- Existe `marketing_links` para enlaces globales y de campaña.
- Existe `marketing_link_clicks` con tracking de clics, dispositivo, navegador, sistema operativo, idioma, URL de aterrizaje y UTMs.
- Existe `marketing_campaign_publications` para relacionar publicaciones reales con campañas y enlaces.
- Marketing Studio tiene gestión de campañas, perfiles sociales y enlaces.
- El dominio canónico de producción es `https://www.vitablue.es`.
- La aplicación usa React Router, prerender SEO y fallback SPA mediante `.htaccess`.
- Las áreas de gestión están protegidas mediante autenticación y roles de Marketing Studio.

## Alcance funcional

### Incluido en la primera versión

- Página pública `/bio` responsive y mobile-first.
- Identidad visual VitaBlue: logo, nombre, descripción y fondo configurable.
- Botones ordenables para web, WhatsApp, campañas, formularios y redes sociales.
- Iconos sociales configurables desde los perfiles ya existentes.
- Activación y desactivación de botones.
- Enlaces destacados o prioritarios.
- Secciones visuales para separar “Contrata”, “Habla con nosotros” y “Síguenos”.
- Enlaces internos `/r/:slug` para los botones con tracking.
- Clics por botón y acumulado por página.
- Soporte para UTMs cuando el enlace de destino las necesite.
- Vista previa básica dentro de Marketing Studio.
- Código QR de la página `/bio`.
- Estados de publicación: borrador, activo e inactivo.

### Fuera de la primera versión

- Pagos, cursos y productos digitales.
- Respuestas automáticas de Instagram.
- Suscripciones por email y campañas de newsletter.
- Personalización individual por país o visitante.
- Múltiples workspaces o múltiples marcas.
- Analítica avanzada con cohortes, embudos y atribución multicanal.
- Programación compleja de contenido social.
- Bloqueos por edad, código o suscripción.

## Modelo de datos propuesto

La página debe ser independiente de las campañas, pero reutilizar sus enlaces y perfiles.

### `marketing_bio_pages`

- `id` uuid.
- `slug` text único, inicialmente `bio`.
- `name` y `description`.
- `avatar_url` o referencia al activo de marca.
- `theme` jsonb para colores, fondo y variante visual.
- `active` boolean.
- `seo_indexable` boolean, por defecto `false`.
- `created_at`, `updated_at`.

### `marketing_bio_blocks`

- `id` uuid.
- `page_id` uuid con relación a `marketing_bio_pages`.
- `type`: `link`, `social`, `heading`, `image`, `form`, `spacer`.
- `title`, `subtitle`, `url` y `icon` cuando corresponda.
- `marketing_link_id` opcional para reutilizar un enlace global o de campaña.
- `campaign_id` opcional para mostrar contexto de campaña.
- `sort_order` integer.
- `active` boolean.
- `starts_at`, `ends_at` opcionales para programación futura.
- `settings` jsonb para configuración específica del bloque.
- `created_at`, `updated_at`.

### `marketing_bio_clicks`

Solo será necesaria si el clic no puede atribuirse a `marketing_link_clicks`.

- `id` uuid.
- `page_id` uuid.
- `block_id` uuid.
- `marketing_link_id` opcional.
- `clicked_at` timestamptz.
- `referrer`, `user_agent`, `device`, `browser`, `operating_system`.
- `country_code` solo si una capa de infraestructura proporciona geolocalización.
- `landing_url`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.

**Decisión:** reutilizar `marketing_link_clicks` cuando el bloque tenga `marketing_link_id`; crear `marketing_bio_clicks` únicamente para bloques propios como formularios o redes sociales sin enlace interno.

## Arquitectura objetivo

```text
Perfil social
     |
     v
https://www.vitablue.es/bio
     |
     +--> bloque web      --> URL pública o enlace /r/:slug
     +--> bloque WhatsApp --> marketing-link-redirect --> WhatsApp
     +--> bloque campaña  --> landing o enlace de campaña
     +--> bloque social   --> perfil social externo
     +--> bloque formulario --> Supabase / CRM futuro
     |
     v
Marketing Studio --> edición, orden, activación y estadísticas
```

## Fases de implementación

### Fase 0 — Contrato visual y contenido

- [ ] Confirmar la URL pública definitiva: `/bio` o `/links/vitablue`.
- [ ] Definir el objetivo principal: WhatsApp, web, captación o distribución social.
- [ ] Definir los primeros 5–8 botones.
- [ ] Definir el orden móvil y el CTA principal.
- [ ] Confirmar logo, avatar, colores, fondo y tipografía.
- [ ] Decidir si habrá una única página o una página por marca/campaña en el futuro.

**Salida:** wireframe móvil, contenido inicial y decisión de arquitectura de páginas.

### Fase 1 — Modelo y seguridad

- [ ] Crear migración para `marketing_bio_pages` y `marketing_bio_blocks`.
- [ ] Añadir constraints para tipos de bloque, orden y URLs válidas.
- [ ] Añadir relación opcional con `marketing_links` y `marketing_campaigns`.
- [ ] Activar RLS en todas las tablas.
- [ ] Permitir lectura pública únicamente de páginas y bloques activos.
- [ ] Permitir crear, editar, ordenar y borrar solo a usuarios `editor` o `admin`.
- [ ] Reservar operaciones administrativas y borrado definitivo para `admin`.
- [ ] No guardar secretos, tokens ni datos personales innecesarios en los bloques.

**Criterio:** una persona anónima puede ver `/bio`, pero no puede modificar su configuración mediante Supabase.

### Fase 2 — Página pública

- [ ] Crear la ruta `/bio` en React Router.
- [ ] Implementar diseño mobile-first sin anchos fijos exteriores.
- [ ] Renderizar bloques por `sort_order`.
- [ ] Mostrar estado vacío seguro si la página no está configurada.
- [ ] Añadir `noindex, nofollow` inicialmente si la página se usa solo desde redes sociales.
- [ ] Añadir Open Graph para compartir la página en redes.
- [ ] Añadir accesibilidad: foco visible, etiquetas, contraste y navegación por teclado.
- [ ] Validar carga rápida y funcionamiento en webviews de TikTok, Instagram y X.

### Fase 3 — Gestión desde Marketing Studio

- [ ] Añadir sección “Bio Link” o “Página de enlaces” en Marketing Studio.
- [ ] Crear y editar título, descripción, avatar y tema.
- [ ] Crear bloques desde enlaces globales y de campaña existentes.
- [ ] Permitir añadir enlaces externos controlados.
- [ ] Permitir reordenar bloques.
- [ ] Permitir activar, desactivar y eliminar bloques.
- [ ] Mostrar vista previa móvil.
- [ ] Mostrar URL pública y botón de copiar.
- [ ] Generar un QR de `/bio`.
- [ ] Mostrar advertencia si se intenta enlazar directamente a WhatsApp sin tracking.

### Fase 4 — Atribución y estadísticas

- [ ] Reutilizar `marketing_links` para botones de WhatsApp y campañas.
- [ ] Identificar clics por `block_id` cuando la arquitectura lo permita.
- [ ] Mostrar clics por bloque, campaña y canal.
- [ ] Mostrar tasa simple de clics por bloque si se dispone de visitas a la página.
- [ ] Mostrar dispositivos y referentes disponibles.
- [ ] Mantener país como dato opcional hasta disponer de una capa fiable de geolocalización.
- [ ] Añadir UTMs configurables por bloque.
- [ ] Evitar duplicar eventos cuando un bloque redirige a `/r/:slug`.

### Fase 5 — Programación y variantes

- [ ] Añadir `starts_at` y `ends_at` para mostrar u ocultar bloques por fecha.
- [ ] Añadir prioridad o spotlight para un CTA temporal.
- [ ] Crear variantes por campaña, canal o marca solo si aparece una necesidad real.
- [ ] Mantener una única URL pública estable para no romper perfiles sociales.
- [ ] Añadir historial de cambios antes de permitir edición por varios usuarios.

### Fase 6 — Captación y CRM futuro

- [ ] Añadir bloque de formulario de contacto con consentimiento explícito.
- [ ] Guardar leads en el modelo CRM, no en una tabla aislada sin relación.
- [ ] Asociar fuente, campaña, bloque y enlace de origen.
- [ ] Integrar email marketing solo con consentimiento y proveedor definido.
- [ ] Preparar el modelo para suscripción, pero no activarlo por defecto.

## Reglas de negocio iniciales

- El CTA principal debe ser visible sin desplazamiento excesivo en móvil.
- Los enlaces de WhatsApp deben pasar por un `marketing_link` cuando se necesite atribución.
- Un bloque inactivo no debe aparecer en la página pública.
- Una página inactiva debe responder con una experiencia neutra, no con datos internos.
- Los enlaces de campañas eliminadas deben quedar inactivos o mostrar una alternativa válida.
- La página no debe indexarse inicialmente; la indexación se decidirá con contenido SEO propio.
- Los clics no deben considerarse conversiones: una conversión requerirá WhatsApp Business, CRM o un evento posterior.
- No se debe inferir país, nacionalidad o residencia si la infraestructura no proporciona un dato fiable.

## Criterios de aceptación

- Una persona puede abrir `https://www.vitablue.es/bio` desde móvil y ver los botones activos.
- El CTA de WhatsApp abre el mensaje correcto y registra un único clic.
- Un editor puede modificar el orden y estado de los bloques desde Marketing Studio.
- Un usuario sin sesión no puede modificar la página ni sus bloques.
- Un bloque asociado a una campaña muestra la campaña correcta en el backoffice.
- Los clics aparecen asociados al enlace, bloque o campaña correspondiente.
- La página no aparece en sitemap ni se indexa mientras `seo_indexable` sea `false`.
- El build, prerender, validación de rutas, tests y RLS pasan antes de publicar.
- La página no rompe el sitio público ni las rutas legacy existentes.

## Dependencias y decisiones pendientes

- Decidir si el módulo vivirá dentro de VitaBlue o se extraerá a Loopdev conservando las mismas tablas.
- Confirmar si habrá una sola página `/bio` o múltiples páginas por marca.
- Confirmar el proveedor futuro para formularios, email y CRM.
- Decidir si se necesita analítica de visitas además de clics.
- Confirmar política de privacidad y consentimiento para formularios y analítica.
- Definir si la página pública debe ser `noindex` permanentemente o indexable con contenido propio.
