# Track: SEO Growth, Topic Clusters & AI Search Optimization (2026)

> **Contexto & Objetivo**: Escalar el tráfico orgánico cualificado y las conversiones de VitaBlue aplicando la metodología moderna de SEO 2026 (Topic Clusters de alta intención, optimización GEO/LLMO para motores de IA, enlazado interno contextual y autoridad E-E-A-T).

---

## 📌 Metas del Track

1. **Optimización para Motores de IA (LLMO / GEO)**:
   - Sincronizar y enriquecer `public/llms.txt` y `public/llms-full.txt` con especificaciones canónicas, entidades y propuestas de valor para ChatGPT Search, Perplexity, Claude y Google SGE.
2. **Topic Clusters & Expansión de Contenido Transaccional (Blog)**:
   - Crear clusters de artículos long-tail atacando las dudas clave con alta intención de compra (visados, requisitos de extranjería, comparativas multimarca de seguros de salud).
3. **E-E-A-T & Señales de Confianza**:
   - Reforzar autoría, transparencia de correduría, metadatos y enlazado interno estructurado en todas las guías y productos.
4. **Smart Internal Linking**:
   - Conectar artículos del blog con las landings de producto y el cotizador interactivo (`/wizard`).

---

## 🗺️ Fases de Ejecución

### Fase 1: Optimización GEO / AI Search & LLMs Knowledge Base
- [x] Crear y estructurar base de datos inicial en `public/llms.txt` y `public/llms-full.txt`.
- [x] Actualizar URLs canónicas bilingües (ES/EN) y rutas jerárquicas finales en `public/llms.txt` y `public/llms-full.txt`.
- [x] Incorporar descripciones detalladas de productos (Sanitas International Students, Expatriados, Más Salud, Mascotas, etc.) con sus coberturas clave en `llms-full.txt`.
- [x] Añadir metadatos de entidad (`InsuranceAgency` / Correduría de Seguros, DGSFP, E-E-A-T y FAQs para LLMs) para facilitar la citación por modelos de lenguaje.


### Fase 2: Estrategia de Topic Clusters (Contenido Long-Tail)
- [x] **Artículos Base de Cluster de Visados y Salud**:
  - [x] *Requisitos del Seguro Médico para Visado de Estudiante en España*.
  - [x] *Seguro Médico para Residencia No Lucrativa en España*.
  - [x] *Guía del Seguro de Salud para Pareja de Hecho y NIE*.
  - [x] *¿Qué es el Copago en un Seguro de Salud?*.
  - [x] *¿Qué son los Periodos de Carencia en un Seguro Médico?*.
  - [x] *Preexistencias Médicas en el Seguro de Salud*.
- [ ] **Nuevos Artículos de Expansión de Clusters**:
  - [x] *Guía de Precios Reales: Seguro Médico para Visado de Estudiante 2026*.
  - [x] *Cómo tramitar el Certificado de Cobertura Oficial en 24h para el Consulado*.
  - [x] *Seguro de Salud para Nómadas Digitales: Requisitos UGE y Teletrabajo*.
  - [x] *Sanitas vs Adeslas vs Asisa vs DKV: ¿Cuál es el mejor seguro médico en España?*.
  - [ ] *Seguro de salud para mayores de 65 años: precios y límites de contratación*.
  - [ ] *Periodos de carencia en el embarazo: qué pólizas cubren parto desde el primer día*.

### Fase 3: Enlazado Interno y Automatización SSG
- [x] Enlazado interno de artículos base con landings y `/wizard`.
- [x] Automatización de sincronización (`npm run sync-blog`) con `vite.config.ts` y `sitemap.xml`.
- [ ] Integrar nuevos artículos del cluster en `utils/blogData.ts` y sincronizar SSG.
- [ ] Validar con Playwright E2E y suites de SEO (`npm run typecheck`, `npm run validate-sitemap`).

### Fase 4: Sinergia SEM/Google Ads & Atribución de Leads (Growth)
- [x] **Seguimiento Global de Conversiones Google Ads**:
  - Implementación del evento `conversion_event_contact` en `utils/analytics.ts` compatible con `gtag` y `dataLayer`.
  - Captura automática de clics salientes a WhatsApp (`wa.me`), teléfonos (`tel:`) y correos en toda la web.
  - Integración en formulario de contacto, cotizador `/wizard`, resultados y hero conversacional.
- [ ] **Atribución Inteligente en WhatsApp (Growth + SEM)**:
  - Guardar parámetros de campaña (`gclid`, `utm_source`, `utm_campaign`) en `sessionStorage`.
  - Incorporar etiqueta de atribución discreta en el mensaje inicial de WhatsApp (ej: `[Ref: GADS-EST]` o `[Ref: WEB-ORG]`).
- [ ] **Optimización de Quality Score en Landings de Silos**:
  - Alinear H1/H2 y schemas FAQPage en `/estudiantes`, `/expatriados`, `/nomadas` con keywords de alta intención de compra.
- [ ] **CTAs Interactivos de Conversión en Artículos de Blog**:
  - Componentes de llamada a la acción contextuales que conecten las dudas del artículo con el cotizador `/wizard`.
- [ ] **Conversiones Mejoradas de Google Ads (Enhanced Conversions)**:
  - Anonimización/hashing SHA-256 de datos de contacto para mejorar la atribución en iOS/Safari.


---

## 📈 Métricas de Éxito
- Crecimiento sostenido de páginas indexadas en Google Search Console (>50 URLs válidas).
- Incremento de impresiones y clics en términos long-tail ("seguro visado estudiante espana precio", "seguro nomada digital espana").
- Registro del 100% de conversiones de contacto y cotización en Google Ads y GA4.
- Indexación y citación activa en motores de IA (Perplexity, ChatGPT).

