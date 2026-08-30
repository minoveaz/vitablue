# Shared Creative Editor — Fase 0

Este documento congela el comportamiento observable de los modelos legacy
`ImageProject` (Image Studio) y `VideoProject` (Video Studio). La Fase 0 no
introduce un modelo común ni cambia ningún editor; sirve como contrato de
regresión para las fases posteriores.

## Invariantes compartidas

| Propiedad | Image Studio | Video Studio | Regla de compatibilidad |
| --- | --- | --- | --- |
| Posición | `layer.position.{x,y}` en porcentaje (`0..100` en composiciones normales) | `layer.position.{x,y}` en porcentaje | El handoff existente copia ambos valores sin redondear ni convertir píxeles. |
| Tamaño | `width`/`height` en píxeles; `scale` es independiente | `width`/`height` en píxeles para capas multimedia y shape | El handoff conserva ancho y alto para `image` y `shape`. El modelo Video actual no representa las dimensiones de cajas `text` ni la escala propia de Image Studio. |
| Orden | Orden de `project.layers` y `zIndex` | Orden de `scene.layers` y `zIndex` | Se conservan el orden de la lista y el `zIndex`; no se reordena por visibilidad. |
| Visibilidad | `visible === false` oculta; omitido equivale a visible | `visible === false` oculta; omitido equivale a visible | `false` se conserva explícitamente. |
| Bloqueo | `locked === true` impide editar | `locked === true` impide editar | El estado se copia; el bloqueo no se interpreta como visibilidad. |
| Texto | `props.text` es la fuente preferida; `title` es fallback | `text` contiene el texto editable | El texto debe conservarse literalmente. El bridge actual solo garantiza `fontSize` y color (`fill` → `color`). |
| Assets | `src` referencia un recurso, nunca es necesario incrustar bytes | `asset.src` referencia el mismo recurso y `asset.alt` usa el título | Se conserva la referencia, no se copian bytes. Los fixtures usan rutas públicas existentes, no datos inline. |
| Constraints | `layer.constraints` opcional | `layer.constraints` opcional | Se conserva la configuración si está presente. |

## Conversión legacy actualmente soportada

`createVideoProjectFromImage` crea una escena de 150 frames a 30 FPS y asigna
timing completo a cada capa. Las capas `text`, `image` y `shape` conservan su
semántica; otros tipos se representan como `component` usando `blockType` y
`props`. Las formas se representan como `rectangle` porque ese es el contrato
actual de `VideoProject`. El bridge conserva posición, orden, `zIndex`, estados
de visibilidad/bloqueo y, para `image`/`shape`, ancho y alto. La escala propia
de Image Studio y el tamaño de cajas de texto no tienen representación en el
modelo Video actual y se mantienen como limitaciones conocidas.

Esta limitación es intencional para Fase 0: no se añade conversión inversa, no
se migra ningún consumidor y no se modifica `ImageProject` ni `VideoProject`.
Las pruebas fijan únicamente el comportamiento existente y fallan si un
cambio posterior altera posición, tamaño, orden, visibilidad, bloqueo, texto o
assets.

## Fixtures y seguridad

Los fixtures viven en
`marketing-studio/fixtures/sharedCreativeEditorFixtures.ts`. Contienen
identificadores deterministas, marcas de tiempo fijas y rutas relativas a
assets públicos ya versionados. No contienen tokens, credenciales, PII ni
URLs `data:`. Deben permanecer seguros para ejecutar tests en CI y localmente.
