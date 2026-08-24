# Track: SEM Optimization Suite, Geo-Expansión (Chile & EE.UU. NALCAP) & Blog Lead Magnet Ingestion (2026)

> **Estado**: 🟡 **EN PROGRESO**  
> **Rama**: `feat/sem-optimization-geo-expansion-chile-usa` (ramificada desde `develop` actualizado)  
> **Contexto & Objetivo**: Maximizar el retorno de inversión (ROI) publicitario de Google Ads y expandir la captación orgánica y conversión de VitaBlue mediante 4 iniciativas complementarias:
> 1. **Suite de Optimización SEM**: Blindaje de palabras clave negativas, textos destacados (*callouts*) y fragmentos estructurados para elevar el Quality Score a 10/10.
> 2. **Expansión Geo-Consular Estratégica**: Landings y datos consulares para **Chile 🇨🇱** (Santiago) y **Estados Unidos 🇺🇸** (NALCAP, Miami, NY, LA, Houston, Chicago en español e inglés).
> 3. **Lead Magnet Ingestion**: Widget interactivo del Validador Consular integrado dentro de los artículos del blog para multiplicar la conversión de lectores a WhatsApp.
> 4. **Sincronización SSG, Sitemap & E2E**: Generación estática SSG, actualización de `sitemap.xml`, `llms.txt` y validación con la suite de pruebas automatizadas.

---

## 📌 Metas del Track

1. **Reducir el desperdicio de ad spend en Google Ads al 0%** mediante una lista exhaustiva de términos negativos (trámites públicos, bajas de aseguradoras, empleos, etc.).
2. **Dominar las búsquedas de estudiantes chilenos y estadounidenses (NALCAP / Study Abroad)** con contenido localizado, precios en CLP/USD y requisitos consulares específicos.
3. **Aumentar la tasa de conversión orgánica del blog en un +35%** canalizando a los lectores hacia el Validador Consular interactivo (`/validador-visado`).
4. **Mantener el 100% de calidad, rendimiento y accesibilidad WCAG 2 AA** en todas las nuevas rutas y componentes.

---

## 🗺️ Fases de Ejecución

### Fase 1: Suite de Optimización SEM (Google Ads Negativas & Extensiones)
- [ ] **Inventario de Palabras Clave Negativas**:
  - [ ] Crear documento/inventario con más de 60 palabras clave negativas categorizadas (Seguridad Social, citas previas, bajas de pólizas, reclamos a aseguradoras, ofertas de empleo, etc.).
- [ ] **Pack de Extensiones de Anuncio**:
  - [ ] Textos destacados (*Callout Extensions*) optimizados para CTR.
  - [ ] Fragmentos estructurados (*Structured Snippets*) de coberturas y servicios.
- [ ] **Guía de Enrutamiento por Calidad**:
  - [ ] Mapeo de URLs finales por país para Quality Score 10/10.

---

### Fase 2: Expansión Geo-Consular Estratégica (Chile & EE.UU.)
- [ ] **Modelado de Datos Consulares (`utils/consulatesData.ts`)**:
  - [ ] 🇨🇱 **Chile (Santiago de Chile)**: Divisa CLP, requisitos del Consulado General de España en Santiago, convenios bilaterales, causas frecuentes de requerimiento.
  - [ ] 🇺🇸 **Estados Unidos (Consulados Generales & Programa NALCAP)**: Divisa USD, particularidades de los consulados en Miami, NY, LA, Chicago, Houston, San Francisco y Boston, requisitos específicos de los auxiliares de conversación NALCAP y estudiantes de máster.
- [ ] **Pruebas Unitarias de Datos Consulares (`utils/consulatesData.test.ts`)**:
  - [ ] Pruebas unitarias para validar moneda, requisitos, FAQ y estructura de datos de Chile y EE.UU.
- [ ] **Rutas y Silos Canónicos**:
  - [ ] Registrar `/productos/seguros-salud/seguro-medico-estudiantes/chile` en `config/routes.ts` y `App.tsx`.
  - [ ] Registrar `/productos/seguros-salud/seguro-medico-estudiantes/estados-unidos` (y versión bilingüe) en `config/routes.ts` y `App.tsx`.

---

### Fase 3: Integración del Validador Consular en Artículos del Blog
- [ ] **Componente / CTA de Diagnóstico Rápido (`components/molecules/BlogConsularValidatorCallout.tsx`)**:
  - [ ] Widget contextual mobile-first con selector interactivo y botón de auditoría directa hacia `/validador-visado`.
- [ ] **Inyección en Artículos Estratégicos (`utils/blogData.ts`)**:
  - [ ] Insertar el widget interactivo en las guías de visados y requisitos en español e inglés.

---

### Fase 4: Sincronización SSG, `sitemap.xml`, `llms.txt` y Pruebas E2E
- [ ] **Generación de Sitemap & SSG**:
  - [ ] Ejecutar `npm run sync-blog` para registrar las nuevas URLs canónicas y enlaces `hreflang`.
  - [ ] Actualizar `public/llms.txt` con la cobertura de Chile y EE.UU.
- [ ] **Auditoría Automatizada**:
  - [ ] Actualizar y ejecutar la suite E2E de Playwright (`test:e2e:seo`).
  - [ ] Verificar pre-rendering estático con Puppeteer (`npm run build`).

---

## 📈 Criterios de Aceptación
- 100% de tests unitarios (Vitest) y SEO (Playwright) pasando en verde.
- Cero advertencias de TypeScript y Linting.
- URLs canónicas y etiquetas `hreflang` bidireccionales perfectamente sincronizadas.
