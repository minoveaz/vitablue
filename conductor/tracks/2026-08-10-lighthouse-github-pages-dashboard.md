# Track: Dashboard histórico Lighthouse en GitHub Pages — VitaBlue v2

**Fecha:** 2026-08-10  
**Estado:** Planificado  
**Objetivo:** publicar un dashboard histórico con la evolución de las auditorías Lighthouse ejecutadas por CI, conservando resúmenes comparables entre commits sin depender de la retención limitada de artifacts.

## Contexto

VitaBlue ya ejecuta Unlighthouse en GitHub Actions como parte del Quality Gate. Cada auditoría comprueba Performance, Accessibility, Best Practices y SEO sobre el build estático. Los informes completos son útiles para investigar una regresión, pero los artifacts tienen una retención limitada y no ofrecen una visión histórica cómoda.

Este track propone conservar un resumen pequeño por ejecución y publicarlo como un dashboard estático en GitHub Pages. El dashboard será complementario al Quality Gate: mostrará tendencias y contexto, pero no sustituirá los checks obligatorios del CI.

## Alcance

### Incluido

- Extraer de cada ejecución exitosa de Lighthouse un resumen versionado.
- Guardar commit, rama, fecha, rutas auditadas, duración y scores por categoría.
- Registrar métricas de laboratorio disponibles, incluyendo LCP, CLS e INP cuando estén presentes.
- Conservar una serie histórica limitada por número de ejecuciones o antigüedad.
- Generar una página estática con tablas, gráficos y comparación con la ejecución anterior.
- Publicar el dashboard en GitHub Pages mediante un workflow separado.
- Enlazar desde el resumen de GitHub Actions al dashboard y al artifact completo.
- Mantener los informes detallados como artifacts temporales para depuración.

### Fuera de alcance inicial

- Datos reales de usuarios del Chrome UX Report dentro del repositorio.
- Datos personales, URLs privadas, tokens o secretos en los informes publicados.
- Comparativas con otros sitios.
- Bloquear despliegues desde el dashboard.
- Sustituir PageSpeed Insights o la monitorización de producción.
- Dashboard interactivo con backend o base de datos.

## Arquitectura propuesta

1. El job Lighthouse genera `ci-result.json` y el informe detallado.
2. Un job posterior normaliza los datos a un esquema estable, por ejemplo `history/lighthouse.json`.
3. El job incorpora el commit y la fecha de ejecución, evitando duplicados por SHA.
4. Se genera un sitio estático con el histórico y se publica en una rama o entorno de GitHub Pages dedicado.
5. El dashboard muestra la tendencia por categoría, la variación frente a la ejecución anterior y los thresholds vigentes.

La publicación debe evitar escribir directamente sobre `develop` o `main`. El workflow de Pages puede publicar su propio branch de salida o usar GitHub Actions Pages deployment.

## Decisiones pendientes

- Confirmar si se usará GitHub Pages con `actions/upload-pages-artifact` y `actions/deploy-pages`, o una rama de publicación dedicada.
- Elegir generador estático: HTML/TypeScript mínimo, Vite independiente o una solución existente del repositorio.
- Definir retención histórica: por ejemplo, últimas 100 ejecuciones o 12 meses.
- Definir si se guardará un resumen por ruta además del promedio global.
- Determinar cómo representar ejecuciones canceladas, fallidas y reejecutadas.
- Confirmar qué métricas de Lighthouse están disponibles de forma estable en `ci-result.json`.

## Seguridad y privacidad

- No publicar variables de entorno, tokens, headers, cookies ni contenido de formularios.
- Revisar el JSON antes de publicarlo y aplicar una lista explícita de campos permitidos.
- Publicar solo URLs públicas y datos agregados de rendimiento.
- No asumir que un artifact de CI es apto para publicación sin sanitización.
- Mantener permisos mínimos en el workflow de publicación.

## Criterios de aceptación

- [ ] El CI produce un resumen estable de Lighthouse para cada ejecución válida.
- [ ] El resumen no contiene secretos ni datos sensibles.
- [ ] El dashboard muestra al menos scores de Performance, Accessibility, Best Practices y SEO.
- [ ] El dashboard muestra tendencia temporal y comparación con la ejecución anterior.
- [ ] El dashboard identifica commit, rama, fecha y número de rutas auditadas.
- [ ] El dashboard se publica automáticamente en GitHub Pages.
- [ ] Los artifacts detallados siguen disponibles durante la retención configurada.
- [ ] Una ejecución fallida no sobrescribe el último histórico válido.
- [ ] El Quality Gate de Lighthouse continúa siendo la fuente de bloqueo de PRs.

## Dependencias

- Integración de Lighthouse/Unlighthouse en `.github/workflows/ci.yml`.
- Esquema final del archivo `ci-result.json` generado por Unlighthouse.
- Configuración de GitHub Pages y permisos del repositorio.
- Decisión sobre la rama o entorno de publicación.

## Resultado esperado

Disponer de una vista histórica sencilla para responder si VitaBlue mejora o empeora con el tiempo, manteniendo separadas las responsabilidades: CI decide si un cambio cumple los budgets; el dashboard ayuda a observar tendencias; PageSpeed Insights aporta la experiencia real de usuarios en producción.
