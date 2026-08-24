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
- [x] **Inventario de Palabras Clave Negativas**:
  - [x] Crear documento/inventario con más de 60 palabras clave negativas categorizadas (`docs/sem-strategy/01-google-ads-negative-keywords-inventory.md`).
- [x] **Pack de Extensiones de Anuncio**:
  - [x] Textos destacados (*Callout Extensions*) optimizados para CTR (`docs/sem-strategy/02-google-ads-extensions-and-routing-playbook.md`).
  - [x] Fragmentos estructurados (*Structured Snippets*) de coberturas y servicios.
- [x] **Guía de Enrutamiento por Calidad**:
  - [x] Mapeo de URLs finales por país para Quality Score 10/10.


---

### Fase 2: Expansión Geo-Consular Estratégica (Chile & EE.UU.)
- [x] **Modelado de Datos Consulares (`utils/consulatesData.ts`)**:
  - [x] 🇨🇱 **Chile (Santiago de Chile)**: Divisa CLP, requisitos del Consulado General de España en Santiago, convenios bilaterales, causas frecuentes de requerimiento.
  - [x] 🇺🇸 **Estados Unidos (Consulados Generales & Programa NALCAP)**: Divisa USD, particularidades de los consulados en Miami, NY, LA, Chicago, Houston, San Francisco y Boston, requisitos específicos de los auxiliares de conversación NALCAP y estudiantes de máster.
- [x] **Pruebas Unitarias de Datos Consulares (`utils/consulatesData.test.ts`)**:
  - [x] Pruebas unitarias para validar moneda, requisitos, FAQ y estructura de datos de Chile y EE.UU.
- [x] **Rutas y Silos Canónicos**:
  - [x] Registrar `/productos/seguros-salud/seguro-medico-estudiantes/chile` en `config/routes.ts` y `App.tsx`.
  - [x] Registrar `/productos/seguros-salud/seguro-medico-estudiantes/estados-unidos` (y versión bilingüe) en `config/routes.ts` y `App.tsx`.

---

### Fase 3: Integración del Validador Consular en Artículos del Blog
- [x] **Componente / CTA de Diagnóstico Rápido (`components/molecules/BlogConsularValidatorCallout.tsx`)**:
  - [x] Widget contextual mobile-first con selector interactivo y botón de auditoría directa hacia `/validador-visado`.
- [x] **Inyección en Artículos Estratégicos (`utils/blogData.ts`)**:
  - [x] Insertar el widget interactivo en las guías de visados y requisitos en español e inglés y en la barra lateral de los artículos.

---

### Fase 4: Sincronización SSG, `sitemap.xml`, `llms.txt` y Pruebas E2E
- [x] **Generación de Sitemap & SSG**:
  - [x] Ejecutar `npm run sync-blog` para registrar las 55 URLs canónicas y enlaces `hreflang`.
  - [x] Actualizar `public/llms.txt` con la cobertura de Chile y EE.UU.
- [x] **Auditoría Automatizada**:
  - [x] Actualizar y ejecutar la suite E2E de Playwright (`test:e2e:seo`, 62/62 tests en verde).
  - [x] Verificar pre-rendering estático con Puppeteer (`npm run build` con 96 rutas pre-renderizadas).

---

## 📈 Criterios de Aceptación
- 100% de tests unitarios (Vitest) y SEO (Playwright) pasando en verde.
- Cero advertencias de TypeScript y Linting.
- URLs canónicas y etiquetas `hreflang` bidireccionales perfectamente sincronizadas.
