# Auditoría total de la web pública

**Proyecto:** VitaBlue v2  
**Fecha del baseline:** 2026-08-11  
**Rama:** `feat/vitablue-ui-patterns`

## Alcance

La auditoría cubre las rutas públicas canónicas, las rutas dinámicas del blog, las rutas legacy, las páginas legales, los flujos públicos y el Styleguide de desarrollo. El inventario de Playwright se obtiene desde `config/routes.ts` y `utils/blogData.ts` mediante `e2e/fixtures/publicRoutes.ts`.

## Fases

| Fase | Objetivo | Estado baseline |
|---|---|---|
| 1 | Inventario único de rutas y baseline de componentes | Completada |
| 2 | Build, prerender y paridad de rutas/sitemap | Completada |
| 3 | Playwright SEO, responsive, runtime y accesibilidad | Completada con incidencia Axe |
| 4 | Flujos funcionales públicos | Completada |
| 5 | Auditoría visual y Atomic Design | Completada; baseline visual creado |
| 6 | Lighthouse/Unlighthouse e informe consolidado | Ejecutada; informe consolidado |

## Resultados consolidados

### Correcto

- `npm run typecheck`
- `npm run build`
- Prerender de 58 rutas configuradas
- `npx playwright test e2e/responsive.diagnostic.spec.ts --project=mobile-compact`
- 31 rutas sin overflow horizontal a 375px
- `npx playwright test e2e/public.runtime.audit.spec.ts --project=desktop`: 62/62 correctos
- `npx playwright test e2e/public.flows.spec.ts --project=desktop`: 3/3 correctos
- Baseline visual previo: 186/186 snapshots correctos (31 rutas x 3 perfiles). Tras el ajuste de contraste del footer, la comparación pendiente queda en 93/186, con diferencias esperables de apariencia que requieren decisión de aceptación antes de actualizar snapshots.
- Responsive desktop/mobile/compact: 62/62 correctos
- `npx playwright test e2e/accessibility.audit.spec.ts --project=desktop`: 15/31 correctos después de corregir el badge del blog, el índice de artículos y el footer; quedan 16 rutas con contrastes compartidos/localizados.
- El inventario dinámico de rutas carga correctamente en Playwright
- Unlighthouse: global 93, performance 83, accessibility 91, best practices 100, SEO 99 sobre 16 rutas

### Incidencias detectadas

1. **Accesibilidad serious:** Axe detectó contraste insuficiente en `text-slate-400`/`text-slate-500`, `text-emerald-600` y el verde WhatsApp claro `#25D366`. El token `whatsapp-dark` se corrigió a `#087443`, pero quedan tokens secundarios por ajustar. Resultado actual: 8/31 páginas pasan sin violaciones serious/critical.
2. **Lint warnings:** un `any` en el test de navegación y dos warnings en el área de Marketing Studio.
3. **Auditoría de componentes:** el auditor reporta 72 componentes reutilizables, 28 bloques inline legítimos y 0 candidatos reales a reutilización: 100% de cobertura funcional.
4. **SEO:** la paridad de rutas y sitemap está corregida; queda como mejora futura hacer explícitas las relaciones ES/EN en los datos del blog.
5. **Rendimiento:** Unlighthouse alcanza 83 en performance y queda como backlog de optimización.

## Métrica de componentes inline

Se medirá en dos momentos:

- **Fase 1:** baseline antes de las correcciones.
- **Fase 5:** verificación final después de la auditoría visual y de componentes.

La métrica se ejecuta localmente con `npm run audit:components` y en CI con `npm run audit:components:ci`. El resultado actual es **72 reutilizables, 28 inline legítimos y 0 candidatos**, con **100% de cobertura funcional**. El gate CI de 90% pasa actualmente.

## Cierre y pendientes

1. Resolver los contrastes compartidos restantes, especialmente textos secundarios en footer y superficies oscuras.
2. Revisar el backlog de performance de Unlighthouse (83) antes de fijar umbrales de CI.
3. Hacer explícitas las relaciones ES/EN de artículos en los datos SEO.
