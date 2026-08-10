# Track E2E Playwright Responsive & SEO Audit — VitaBlue v2

**Fecha:** 2026-08-10
**Estado:** ✅ Completado
**Objetivo:** Implementar pruebas automatizadas End-to-End con Playwright para validar la estabilidad responsive (Mobile-First) y crear un sistema de auditoría automatizada de SEO para todas las páginas públicas de VitaBlue v2, integrado en GitHub Actions CI.

---

## Contexto & Inspiración (de `loopdev`)

Tomando como referencia el patrón de testing E2E implementado en `loopdev`:
- Pruebas dedicadas de **responsividad y baseline visual** (`responsive.visual.spec`).
- Diagnóstico de layout móvil (`mobile-diagnostic.spec`) con auditoría de `scrollWidth > clientWidth` para detectar desbordamiento horizontal (`overflow-x`).
- Integración en **GitHub Actions** con matriz de proyectos (`desktop`, `mobile`, `mobile-compact`) usando `--workers=1` para máxima estabilidad.
- Auditoría automatizada de accesibilidad (a11y) y SEO sintáctico/estático en HTML pre-renderizado.

---

## Fase 1 — Playwright E2E Responsive Testing & GitHub Actions CI

### 1.1 Configuración de Playwright
- [x] Instalar `@playwright/test` y dependencias necesarias (`playwright install --with-deps chromium`).
  - ℹ️ Ya estaba instalado: `@playwright/test@1.62.1`, Chromium en caché local.
- [x] Crear `playwright.config.ts` configurado para Vite/dist pre-renderizado.
  - ✅ Mejorado: añadido `workers: 1` en CI, reporter HTML, video en fallo, `snapshotPathTemplate` por proyecto.
- [x] Definir perfiles de dispositivos en `projects`:
  - `desktop` (1440x900)
  - `mobile` (iPhone 13 / 390px)
  - `mobile-compact` (iPhone SE / 375px & 320px)

### 1.2 Suite de Pruebas Responsivas Móviles
- [x] **Detector de Overflow Horizontal (`overflow-x`):** [`e2e/responsive.diagnostic.spec.ts`](../../e2e/responsive.diagnostic.spec.ts)
  - Recorre 30 rutas públicas (todas las del sitemap más páginas legales).
  - 3 niveles de verificación: `body`, `document.documentElement`, y elementos hijos directos.
  - Mensajes de error con detalle del elemento ofensor y px de desbordamiento.
  - Se ejecuta en los 3 proyectos: desktop, mobile, mobile-compact.
- [x] **Tests de Navegación e Interacción Móvil:** [`e2e/mobile.navigation.spec.ts`](../../e2e/mobile.navigation.spec.ts)
  - Navbar: visibilidad hamburguesa, logo, overflow del nav.
  - Home: h1 visible, CTA principal con tap target ≥ 44px, footer sin overflow.
  - Cotizador (Wizard): carga sin overflow, contenido interactivo presente.
  - Blog: listado con artículos, artículo individual en móvil.
  - Páginas de producto: 4 páginas con h1 único y visible.

### 1.3 Integración en GitHub Actions CI (`.github/workflows/ci.yml`)
- [x] Crear workflow [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) que active los checks en `pull_request` y `push` a `main`/`develop`.
- [x] Paso de `build` con pre-renderizado (`npm run build`).
- [x] Paso de ejecución Playwright con reportes en formato `github` y `html`.
- [x] Preservación de artefactos en fallos (`trace`, `screenshot`, `video`, `html report`).
- [x] Matriz de proyectos con `fail-fast: false` para ver todos los resultados.
- [x] `concurrency` para cancelar runs duplicados en la misma rama.

---

## Fase 2 — Auditoría Automatizada de SEO & Integración en CI

### 2.1 Crawler & Auditor SEO Automatizado de Páginas Públicas
- [x] Crear [`e2e/seo.audit.spec.ts`](../../e2e/seo.audit.spec.ts) con 27 rutas indexables + 5 rutas legales.
- [x] Validar status HTTP `200 OK` para todas las rutas públicas canónicas.
- [x] **Check de Meta-etiquetas SEO:**
  - Presencia y longitud adecuada de `<title>` (10–120 chars) y `<meta name="description">` (50–300 chars).
  - Presencia de un único `<h1>` semántico por página indexable.
  - Tag `<link rel="canonical">` coherente con la URL canónica esperada.
  - Metadatos Open Graph (`og:title`, `og:image`, `og:description`).
- [x] **Check de Prerender:** Verificar que el HTML estático servido contenga texto clave (SSG validado sin requerir JS).
- [x] Check de `noindex` en páginas legales (si está declarado en robots meta).

### 2.2 Integración de Unlighthouse / Lighthouse CI (Opcional/Complementario)
- [ ] Evaluar e integrar auditoría de puntuación SEO y Core Web Vitals usando `unlighthouse` o `lhci` en el build estático.
- [ ] Establecer un threshold mínimo de puntuación SEO (ej. 95+/100) en el CI.

---

## Scripts Añadidos a `package.json`

```bash
npm run test:e2e               # Todos los proyectos (desktop + mobile + mobile-compact)
npm run test:e2e:mobile        # Solo mobile + mobile-compact
npm run test:e2e:desktop       # Solo desktop
npm run test:e2e:seo           # Solo auditoría SEO (desktop)
npm run test:e2e:responsive    # Solo tests de overflow horizontal
npm run test:e2e:ui            # Modo UI interactivo (desarrollo local)
```

---

## Archivos Creados / Modificados

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| [`playwright.config.ts`](../../playwright.config.ts) | ✏️ Mejorado | workers=1 CI, reporter HTML, video, snapshotPath |
| [`e2e/responsive.diagnostic.spec.ts`](../../e2e/responsive.diagnostic.spec.ts) | ✏️ Expandido | 30 rutas, 3 niveles de check, mensajes detallados |
| [`e2e/mobile.navigation.spec.ts`](../../e2e/mobile.navigation.spec.ts) | ✨ Nuevo | Navbar, Home, Wizard, Blog, Productos en móvil |
| [`e2e/seo.audit.spec.ts`](../../e2e/seo.audit.spec.ts) | ✨ Nuevo | SEO audit: title, desc, h1, canonical, OG, SSG check |
| [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) | ✨ Nuevo | CI 4-job: build→playwright(matrix)→seo→quality-gate |
| [`package.json`](../../package.json) | ✏️ Actualizado | 6 scripts test:e2e:* añadidos |

---

## Puerta de Calidad (Quality Gate)

El pipeline de GitHub Actions fallará si:
1. Cualquier página pública presenta desbordamiento horizontal (`overflow-x`) en móvil.
2. ~~Hay regresiones visuales no aprobadas en las capturas de Playwright.~~ _(Visual baselines: pendiente, requiere aprobación inicial de snapshots)_
3. Alguna URL pública del `sitemap.xml` devuelve error (404/500) o carece de HTML pre-renderizado.
4. Falta título, meta descripción, canonical o se detecta más de un `<h1>` en una página indexable.
5. Open Graph incompleto (`og:title`, `og:description`, `og:image`).

---

## Criterios de Aceptación

- [x] Suite de Playwright operativa localmente (`npm run test:e2e`) y en CI (`.github/workflows/ci.yml`).
- [x] Cobertura completa de la regla Mobile-First (iPhone SE 375px hasta Desktop 1440px).
- [x] Auditoría SEO automatizada ejecutándose sobre cada build de producción antes del despliegue.

---

## Notas de Implementación

- **Visual Baselines (screenshots):** Se ha omitido la creación de snapshots iniciales en este track. Los `toHaveScreenshot()` requieren una aprobación manual inicial (`npx playwright test --update-snapshots`). Se recomienda ejecutarlos por primera vez localmente y commitear los snapshots al repositorio.
- **Unlighthouse/LHCI:** Evaluado pero no integrado en este track — puede ser un track separado. Requiere instalación adicional (`@unlighthouse/cli` o `@lhci/cli`) y configuración de threshold.
- **Prerenderizado en CI:** El build SSG usa Puppeteer con `--no-sandbox`. En GitHub Actions Ubuntu, esto funciona directamente. El `executablePath` local de macOS sólo aplica en desarrollo.
