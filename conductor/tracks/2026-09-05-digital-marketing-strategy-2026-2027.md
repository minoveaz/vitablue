# Track: Estrategia de Marketing Digital & Crecimiento Orgánico (2026–2027)

> **Fecha:** 2026-09-05  
> **Estado:** 🟡 **EN PROGRESO / ACTIVO**  
> **Referencia Estratégica:** [`docs/marketing-strategy/2026-2027-digital-marketing-plan.md`](file:///Users/minoveaz/Documents/Proyectos/Estar%20Protegidos/vitablue-v2-seo-marketing/docs/marketing-strategy/2026-2027-digital-marketing-plan.md)  
> **Objetivo:** Escalar de 54 clics/trimestre a +500 clics/mes y de 2 ventas orgánicas a 20+ pólizas/mes mediante el despliegue de los 4 pilares: SEO & Contenido, Comunidades, Redes Sociales y Lead Nurturing.

---

## 📌 Contexto & Diagnóstico

El sitio registra **22.000 impresiones trimestrales en Google Search Console** con una posición media de **39,9** y un **CTR del 0,2%**. Las ventas orgánicas iniciales registradas en **Nigeria 🇳🇬 y Sudáfrica 🇿🇦** confirman la tracción internacional en visados de estudiantes. Este track ejecuta la hoja de ruta técnica y de contenidos para acelerar la conversión y abrir canales desvinculados del algoritmo de Google.

---

## 🗺️ Fases de Ejecución

### Fase 1: Cimientos y Quick Wins Técnicos (Septiembre 2026)

#### 1.1 Optimización On-Page y Rich Snippets (CTR Boost)
- [ ] Auditar las páginas y artículos con mayor volumen de impresiones y CTR < 0,5% en GSC.
- [ ] Reescribir `<title>` y `<meta description>` en landings prioritarias (`StudentInsurance.tsx`, `ForeignerInsurance.tsx`, `ConsularValidatorPage.tsx`) con propuesta de valor transaccional (*precio desde 38€, homologado 100%, devolución garantizada*).
- [ ] Implementar marcado estructurado JSON-LD `FAQPage` en las páginas de producto y en el visor de artículos (`BlogPost.tsx`).
- [ ] Implementar `BreadcrumbList` Schema en las rutas del blog y productos.
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
