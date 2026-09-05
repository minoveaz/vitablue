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
- [ ] **Acción 1 ([Issue #130](https://github.com/minoveaz/vitablue/issues/130)):** Blindar la redirección 301 de la URL legacy `/productos/seguro-medico-estudiantes-extranjeros-espana.html` hacia la canónica moderna para concentrar ranking.
- [ ] **Acción 2 ([Issue #131](https://github.com/minoveaz/vitablue/issues/131)):** Optimizar On-Page (títulos persuasivos, precios, meta descriptions) y añadir JSON-LD `FAQPage` + `Breadcrumbs` en las guías de estudiantes en inglés (Top 10-15).
- [ ] **Acción 3 ([Issue #132](https://github.com/minoveaz/vitablue/issues/132)):** Inyectar FAQ Schema y optimizar CTAs en landings y guías en español (Mascotas, No Lucrativa y Visado de Estudiante).
- [ ] Reescribir `<title>` y `<meta description>` en landings prioritarias (`StudentInsurance.tsx`, `ForeignerInsurance.tsx`, `ConsularValidatorPage.tsx`) con propuesta de valor transaccional (*precio desde 38€, homologado 100%, devolución garantizada*).
- [ ] Validar que el build prerenderizado (`npm run build`) inyecte correctamente estos esquemas sin errores en Search Console Rich Results Test.

#### 1.2 Lead Magnet & Captura de Contactos (Pilar 4)
- [ ] Diseñar el recurso descargable: *"Checklist Definitiva: Seguro Médico para Visado de Estudiante en España (PDF)"*.
- [ ] Añadir modal o banner de descarga de la checklist en los artículos de estudiantes y visados dentro del blog.
- [ ] Configurar enlace directo a WhatsApp con mensaje contextualizado (`[CHECKLIST-ESTUDIANTE]`).

#### 1.3 Calendario Editorial de Septiembre ("Mes del Consulado")
- [ ] Actualizar y optimizar las guías existentes en `utils/blogData.ts` con FAQs enriquecidas y enlaces a `/validador-visado`.
- [ ] Redactar y publicar el artículo: *"¿Qué seguro médico pide el consulado español para el visado de estudiante?"* (ES).
- [ ] Redactar y publicar el artículo: *"Best health insurance for student visa Spain 2026"* (EN).
- [ ] Redactar y publicar el artículo: *"Diferencias entre Asisa, Sanitas y Adeslas para el visado de estudiante"* (ES).
- [ ] Redactar y publicar el artículo: *"¿Qué pasa si te rechazan el visado? Seguro con devolución garantizada"* (ES).
- [ ] Ejecutar `npm run sync-blog` y validar generación estática en `dist/` y `sitemap.xml`.

#### 1.4 Configuración de Canales de Adquisición Desacoplados
- [ ] Configurar perfil de WhatsApp Business con catálogo de seguros para estudiantes y visados, respuestas rápidas y etiquetas por país/estado.
- [ ] Crear el canal oficial de Telegram de difusión (*@VitaBlueEspaña*).
- [ ] Crear perfil oficial en TikTok e Instagram para distribución de vídeo corto y carruseles.
- [ ] Identificar y unirse a los 10 principales grupos de WhatsApp/Facebook de estudiantes internacionales y expatriados.

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
