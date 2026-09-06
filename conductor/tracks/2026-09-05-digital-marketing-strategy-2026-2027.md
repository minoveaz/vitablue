# Track: Estrategia de Marketing Digital & Crecimiento Orgánico (2026–2027)

> **Fecha:** 2026-09-05  
> **Estado:** 🟡 **EN PROGRESO / ACTIVO**  
> **Referencia Estratégica:** [`docs/marketing-strategy/2026-2027-digital-marketing-plan.md`](file:///Users/minoveaz/Documents/Proyectos/Estar%20Protegidos/vitablue-v2-seo-marketing/docs/marketing-strategy/2026-2027-digital-marketing-plan.md)  
> **Objetivo:** Escalar de 54 clics/trimestre a +500 clics/mes y de 2 ventas orgánicas a 20+ pólizas/mes mediante el despliegue de los 4 pilares: SEO & Contenido, Comunidades, Redes Sociales y Lead Nurturing.

---

## 📌 Contexto & Diagnóstico en Vivo (GSC API Oficial)

Conexión completada con la API oficial de Google Search Console (`sc-domain:vitablue.es`) con permisos de `siteOwner`. Datos auditados en vivo (últimos 90 días):
- **Impresiones totales:** 25.001
- **Clics totales:** 68
- **CTR medio:** 0,27%
- **Posición media:** 38,8

### Hallazgos Críticos de la Auditoría Inicial:
1. **Fuga de impresiones en URL Legacy:** `https://www.vitablue.es/productos/seguro-medico-estudiantes-extranjeros-espana.html` acumula **6.124 impresiones** (la mayor de toda la web) en posición 46.8 y solo 3 clics. Requiere blindaje de redirección 301 para transferir autoridad a la canónica moderna.
2. **Tracción Orgánica Internacional en Inglés (Al borde de Página 1):**
   - `/en/blog/student-visa-spain-health-insurance-prices` (Posición **10.2**, 221 impresiones).
   - `/en/blog/student-visa-spain-health-insurance-requirements/` (Posición **15.7**, 1.362 impresiones, 11 clics).
   - Validación con URL Inspection API: `Index status: PASS`, `Submitted and indexed`.
3. **Tracción de Seguro de Mascotas y Visados (Español):**
   - `/productos/sanitas-mascotas.html` (Posición **16.7**, 890 impresiones).
   - `/blog/seguro-medico-residencia-no-lucrativa-espana/` (Posición **33.5**, 693 impresiones).
   - `/blog/requisitos-seguro-medico-visado-estudiante-espana/` (Posición **19.3**, 502 impresiones).

---

## 🗺️ Fases de Ejecución

### Fase 1: Cimientos y Quick Wins Técnicos (Septiembre 2026)

#### 1.1 Conexión de Datos & Diagnóstico Inicial
- [x] Configurar e integrar API oficial de Google Search Console con Service Account (`vitablue-gsc-agent@...`) con rol de `siteOwner`.
- [x] Crear herramienta CLI nativa `scripts/gsc_audit.cjs` con comandos npm (`gsc:summary`, `gsc:opportunities`, `gsc:pages`, `gsc:queries`, `gsc:inspect`).
- [x] Auditar las páginas con mayor volumen de impresiones y CTR < 1,5% en GSC (`npm run gsc:opportunities`).

#### 1.2 Optimización On-Page y Rich Snippets (CTR Boost)
- [x] **Acción 1 ([Issue #130](https://github.com/minoveaz/vitablue/issues/130)):** Blindar la redirección 301 de la URL legacy `/productos/seguro-medico-estudiantes-extranjeros-espana.html` hacia la canónica moderna para concentrar ranking.
- [x] **Acción 2 ([Issue #131](https://github.com/minoveaz/vitablue/issues/131)):** Optimizar On-Page (títulos persuasivos, precios, meta descriptions) y añadir JSON-LD `FAQPage` + `Breadcrumbs` en las guías de estudiantes en inglés (Top 10-15).
- [x] **Acción 3 ([Issue #132](https://github.com/minoveaz/vitablue/issues/132)):** Inyectar FAQ Schema y optimizar CTAs en landings y guías en español (Mascotas, No Lucrativa y Visado de Estudiante).
- [x] **Acción 10 ([Issue #139](https://github.com/minoveaz/vitablue/issues/139)):** Implementar Schema `InsuranceAgency` / `LocalBusiness` y `Organization` en Home y páginas corporativas para elevar E-E-A-T.
- [x] Validar que el build prerenderizado (`npm run build`) inyecte correctamente estos esquemas sin errores en Search Console Rich Results Test.

#### 1.3 Lead Magnet & Captura de Contactos (Pilar 4)
- [x] **Acción 9 ([Issue #138](https://github.com/minoveaz/vitablue/issues/138)):** Estandarizar helper de parámetros contextualizados de WhatsApp por landing, artículo e idioma (`[BLOG-ESTUDIANTE-EN]`, `[MASCOTAS]`).
- [x] **Acción 4 ([Issue #133](https://github.com/minoveaz/vitablue/issues/133)):** Diseñar e implementar motor modular de PDFs (`scripts/pdf-engine/`), checklists consulares oficiales en PDF (ES y EN en blanco VitaBlue), componente bilingüe `LeadMagnetBanner` con descarga directa y despliegue global en Blog, Landing de Estudiantes (ES/EN), Validador Consular y páginas por país/consulado.

#### 1.4 Calendario Editorial de Septiembre ("Mes del Consulado")
- [x] **Acción 5 ([Issue #134](https://github.com/minoveaz/vitablue/issues/134)):** Consolidar y optimizar guía: *"¿Qué seguro médico pide el consulado español para el visado de estudiante?"* en el artículo canónico con FAQ Schema y comparativa de motivos de rechazo (ES).
- [x] **Acción 6 ([Issue #135](https://github.com/minoveaz/vitablue/issues/135)):** Redactar y publicar comparativa: *"Diferencias entre Asisa, Sanitas y Adeslas para el visado de estudiante"* (ES).
- [x] **Acción 7 ([Issue #136](https://github.com/minoveaz/vitablue/issues/136)):** Redactar y publicar artículo: *"¿Qué pasa si te rechazan el visado? Seguro con devolución garantizada"* (ES).
- [x] **Acción 8 ([Issue #137](https://github.com/minoveaz/vitablue/issues/137)):** Redactar y publicar guía en inglés: *"ASISA student insurance Spain — is it valid for student visa?"* (EN).
- [x] **Enlazado cruzado ([Issue #144](https://github.com/minoveaz/vitablue/issues/144)):** Inyectar enlaces internos contextuales cruzados entre todos los artículos de visados y estudiantes.
- [x] **Versiones en inglés ([Issue #145](https://github.com/minoveaz/vitablue/issues/145)):** Publicar versiones en inglés de Copagos (`what-is-copay-health-insurance-spain-guide`) y Carencias (`waiting-periods-health-insurance-spain-guide`).
- [x] Ejecutar `npm run sync-blog` y validar generación estática en `dist/` y `sitemap.xml`.

#### 1.5 Rediseño de Arquitectura y Experiencia del Blog (Knowledge Hub)
- [x] **Artículo Destacado ([Issue #140](https://github.com/minoveaz/vitablue/issues/140)):** Implementar componente Hero Featured Post en `/blog/` y `/en/blog/`.
- [x] **Barra de Filtros y Categorías ([Issue #141](https://github.com/minoveaz/vitablue/issues/141)):** Píldoras temáticas con iconos y contadores dinámicos.
- [x] **Tarjeta Interactiva Nativa en Grid ([Issue #142](https://github.com/minoveaz/vitablue/issues/142)):** Inserción de lead magnet y cotización entre artículos.
- [x] **Artículos Relacionados ([Issue #143](https://github.com/minoveaz/vitablue/issues/143)):** Carrusel horizontal deslizable por snap points al pie del artículo.
- [x] **Layout Knowledge Hub & Mobile Drawer ([Issue #146](https://github.com/minoveaz/vitablue/issues/146)):** Disposición a 2 columnas, sidebar compacto, drawer deslizable con backdrop para móviles y paginación en cliente.

#### 1.6 Auditorías Técnicas y Automatización con Google Search Console API
- [x] **Diagnóstico Técnico de Indexación ([Issue #147](https://github.com/minoveaz/vitablue/issues/147)):** Inspección de 61 URLs con la URL Inspection API, resolución de discrepancias de canonicals y corrección de fechas ISO y BreadcrumbList.
- [x] **Oportunidades de Alto Impacto ([Issue #148](https://github.com/minoveaz/vitablue/issues/148)):** Análisis con Search Analytics API y optimización de snippets en `Home.tsx` (*Agente Oficial Sanitas*) y `AsistenciaFamiliar.tsx` (*Sanitas Asistencia Familiar iPlus* con 403 impresiones en posición 21).
- [x] **Salud y Automatización de Sitemaps ([Issue #149](https://github.com/minoveaz/vitablue/issues/149)):** Auditoría de sitemaps con Webmasters API e integración automática en `npm run sync-blog`.
- [x] **Normalización Estricta de Trailing Slash ([Issue #150](https://github.com/minoveaz/vitablue/issues/150)):** Estandarización de `/` en todos los enlaces internos y regla estricta en CI.

#### 1.7 Despliegue en Producción
- [x] **Promoción a `develop` ([PR #151](https://github.com/minoveaz/vitablue/pull/151)):** Integrado mediante Squash and merge con 100% de tests y verificaciones aprobadas.
- [x] **Promoción a `main` ([PR #152](https://github.com/minoveaz/vitablue/pull/152)):** Desplegado en vivo en `https://www.vitablue.es/` y validado en producción.

#### 1.8 Optimización de Tarjetas Sociales y Open Graph
- [x] **Open Graph y Twitter Cards ([Issue #155](https://github.com/minoveaz/vitablue/issues/155) - [PR #156](https://github.com/minoveaz/vitablue/pull/156)):** Creación de banner Retina oficial de 2400x1260 px, pre-renderizado SSG de imágenes destacadas por artículo y actualización de todas las páginas de producto.

---

### Fase 2: Aceleración, Nurturing & Expansión (Octubre – Noviembre 2026)

#### 2.1 Contenidos de Residencia y Renovación de NIE (Octubre)
- [ ] Publicar guía: *"Seguro médico para la renovación del NIE en España"* (ES/EN).
- [ ] Publicar guía: *"Residencia no lucrativa en España: requisitos médicos 2026"* (ES/EN).
- [ ] Publicar guía: *"Seguro de salud para reagrupación familiar"* (ES/EN).
- [ ] Re-sincronizar sitemap y canónicas automáticas.

#### 2.2 Secuencia Automatizada de Nurturing
- [ ] Configurar secuencia de 5 correos de bienvenida, valor y resolución de dudas consulares para suscriptores del lead magnet.
- [ ] Integrar capturas de email en Supabase (`leads` / `newsletter_subscribers`).
- [ ] Crear la comunidad propia de WhatsApp *"Expatriados y Estudiantes en España — Seguros & Visados"*.

#### 2.3 Producción Multimedia y Social Media (Pilar 3)
- [ ] Exportar carruseles informativos para LinkedIn e Instagram utilizando el **Marketing Studio** de VitaBlue.
- [ ] Publicar vídeos cortos diarios en TikTok/Reels respondiendo a las preguntas más buscadas en Google sobre visados.
- [ ] Activar presencia de valor en Reddit (`r/SpainExpats`, `r/studyabroad`).

---

### Fase 3: Escala, Afiliación & Optimización de CAC (Diciembre 2026)

- [ ] Analizar el Coste de Adquisición (CAC) y volumen de conversión por canal (SEO vs TikTok vs WhatsApp Groups vs Reddit).
- [ ] Doblar esfuerzos en los 2 canales con mejor ratio de conversión a póliza pagada.
- [ ] Implementar programa de recomendación/referidos para clientes existentes.
- [ ] Revisión trimestral de Search Console para medir evolución de CTR (> 2%) y posición media (< 15).

---

## 🛡️ Criterios de Calidad & CI

Toda modificación de código resultante de este track debe cumplir:
1. `npm test` ejecutándose con 100% de tests unitarios y de integración pasando.
2. `npx tsc --noEmit` sin errores de compilación TypeScript.
3. `npm run validate-sitemap` y `npm run validate-static-seo` aprobados.
4. Preservación del 100% de accesibilidad WCAG 2 AA en cualquier componente interactivo nuevo.
