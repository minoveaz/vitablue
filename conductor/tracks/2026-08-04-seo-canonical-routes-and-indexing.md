# Track SEO — VitaBlue

**Fecha:** 2026-08-04  
**Estado:** Planificado  
**Objetivo:** consolidar una arquitectura SEO verificable para que todas las URLs públicas canónicas, el prerender, el sitemap, los canonical/hreflang y las redirecciones legacy se mantengan sincronizados.

## Contexto

La aplicación tenía inventarios independientes en React Router, prerender y sitemap. Ya existe una primera base en `config/routes.ts`, pero todavía falta completar la automatización y la validación SEO por página.

## Ya realizado

- [x] Registro tipado en `config/routes.ts`.
- [x] Prerender conectado al registro.
- [x] Sitemap generado desde el registro y `blogData.ts`.
- [x] Rutas privadas excluidas del sitemap.
- [x] Canonical, alternate y x-default generados desde `PublicLayout`.
- [x] Clasificación de URLs legacy con destino canónico.
- [x] Redirecciones 301 preparadas en `public/.htaccess`.
- [x] Validadores de paridad, sitemap y registro integrados en CI.

## Fase 1 — Inventario y contrato SEO

- [ ] Auditar todas las URLs públicas actuales y clasificarlas como canónicas, legacy, legales, funnel o privadas.
- [ ] Confirmar una única URL canónica por contenido y por idioma.
- [ ] Añadir al registro `priority`, `changeFrequency`, `xDefault`, `redirectStatus` y fuente de contenido cuando aplique.
- [ ] Documentar qué páginas son indexables y cuáles deben usar `noindex`.

## Fase 2 — Metadatos y enlaces alternativos

- [ ] Validar `title` y `meta description` por cada ruta indexable.
- [ ] Validar longitud, idioma y ausencia de títulos/descripciones duplicados.
- [ ] Generar `canonical`, `alternate` y `x-default` sin duplicados.
- [ ] Resolver correctamente rutas dinámicas de blog y sus versiones idiomáticas.
- [ ] Añadir Open Graph y Twitter Cards desde datos de ruta/contenido.

## Fase 3 — Sitemap, robots y prerender

- [ ] Generar el sitemap únicamente con rutas canónicas indexables.
- [ ] Excluir login, backoffice, cotizador, resultados, styleguide y legacy.
- [ ] Validar que cada URL del sitemap tenga una ruta real y un HTML prerenderizado.
- [ ] Validar que ninguna ruta indexable quede fuera del prerender o sitemap.
- [ ] Revisar `robots.txt` y bloquear áreas privadas sin bloquear recursos públicos necesarios.
- [ ] Revisar tamaño, encoding, hostname y trailing slash del sitemap.

## Fase 4 — Redirecciones legacy

- [ ] Mantener un mapa explícito de URL legacy → URL canónica.
- [ ] Aplicar redirecciones permanentes en Hostinger mediante `.htaccess` o la infraestructura equivalente.
- [ ] Evitar que una URL legacy renderice el mismo contenido como segunda página indexable.
- [ ] Probar cadenas, bucles, query strings y trailing slash.
- [ ] Mantener las redirecciones de campañas antiguas hasta confirmar que no existen enlaces activos.

## Fase 5 — Blog y generación estructurada

- [ ] Sustituir la sincronización basada en regex por una generación estructurada desde `blogData.ts`.
- [ ] Generar rutas, sitemap, canonical, hreflang y metadatos de artículos desde los mismos datos.
- [ ] Fallar el build si existe un slug duplicado, idioma inválido o artículo sin canonical.
- [ ] Validar artículos antiguos y sus enlaces internos.

## Fase 6 — Verificación en producción

- [ ] Comprobar headers `301` de las URLs legacy.
- [ ] Comprobar `200` y canonical de las landings públicas.
- [ ] Comprobar que rutas privadas redirigen a login o quedan protegidas.
- [ ] Comprobar `sitemap.xml` y `robots.txt` en `https://vitablue.es`.
- [ ] Revisar cobertura e indexación en Google Search Console.
- [ ] Revisar errores 404, redirecciones y páginas duplicadas después del despliegue.

## Puerta de calidad SEO

El pipeline debe fallar si:

- Una ruta indexable no tiene canonical.
- Una ruta canónica no está en prerender o sitemap cuando corresponde.
- El sitemap contiene una URL legacy, privada o inexistente.
- Existe una redirección duplicada, circular o sin destino.
- Hay slugs de blog duplicados o metadatos obligatorios ausentes.

## Criterios de aceptación

- El sitemap contiene solo URLs públicas canónicas.
- Cada landing indexable tiene HTML prerenderizado, canonical y metadatos válidos.
- Las versiones ES/EN están enlazadas mediante hreflang correcto.
- Las 301 legacy funcionan en producción sin cadenas ni bucles.
- Ninguna URL privada aparece en sitemap, canonical o hreflang.
- Un cambio de ruta actualiza las salidas SEO desde una única fuente de verdad.

## Dependencias y decisiones pendientes

- Confirmar canonicals legales con negocio/legal.
- Confirmar si las páginas del funnel deben permanecer `noindex`.
- Configurar y revisar Google Search Console del dominio `vitablue.es`.
- Decidir si Hostinger seguirá usando `.htaccess` o una capa CDN/proxy para redirects.
