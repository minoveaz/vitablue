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
- [ ] Actualizar URLs canónicas (con trailing slash) en `public/llms.txt` y `public/llms-full.txt`.
- [ ] Incorporar descripciones detalladas de productos (Sanitas International Students, Expatriados, Más Salud, Mascotas, etc.) con sus coberturas clave en `llms-full.txt`.
- [ ] Añadir metadatos de entidad (`InsuranceAgency` / Correduría de Seguros) para facilitar la citación por modelos de lenguaje.

### Fase 2: Estrategia de Topic Clusters (Contenido Long-Tail)
- [ ] **Cluster 1: Visados y Trámites de Extranjería en España**
  - *Guía de Precios Reales: Seguro Médico para Visado de Estudiante 2026*.
  - *Cómo tramitar el Certificado de Cobertura Oficial en 24h para el Consulado*.
  - *Seguro de Salud para Nómadas Digitales: Requisitos UGE y Teletrabajo*.
  - *Seguro Sin Copagos vs Con Copagos: Exigencias de Extranjería*.
- [ ] **Cluster 2: Comparativas y Salud Familiar**
  - *Sanitas vs Adeslas vs DKV: ¿Cuál es el mejor seguro médico en España?*.
  - *Seguro de salud para mayores de 65 años: precios y límites de contratación*.
  - *Periodos de carencia en el embarazo: qué pólizas cubren parto desde el primer día*.

### Fase 3: Enlazado Interno y Automatización SSG
- [ ] Enlazar cada nuevo artículo a su respectiva página de producto y al wizard de cotización.
- [ ] Actualizar base de datos de contenido en `utils/blogData.ts`.
- [ ] Ejecutar `npm run sync-blog` para regenerar rutas SSG, `vite.config.ts` y `sitemap.xml`.
- [ ] Validar con Playwright E2E y suites de SEO (`npm run typecheck`, `npm run validate-sitemap`).

---

## 📈 Métricas de Éxito
- Crecimiento sostenido de páginas indexadas en Google Search Console (>50 URLs válidas).
- Incremento de impresiones y clics en términos long-tail ("seguro visado estudiante espana precio", "seguro nomada digital espana").
- Indexación y citación activa en motores de IA (Perplexity, ChatGPT).
