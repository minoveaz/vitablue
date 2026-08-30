# Shared Creative Editor — Fase 4.5

## Core vectorial compartido

`packages/creative-document` define el contrato vectorial neutral y versionado
para Image Studio y Video Studio. Los bounds y puntos son normalizados
(`0..1`). Los strokes y radios declaran siempre sus unidades (`px` o
`normalized`); los valores legacy de Image Studio se convierten explícitamente.

### Clasificación del catálogo

| Familia | Tipos | Contrato |
| --- | --- | --- |
| Primitivas | `rectangle`, `ellipse`, `polygon`, `star` | `ShapeGeometry` |
| Paths | `line`, `polyline`, `bezier`, `svg`, `blob`, `wave` | `PathGeometry` + `PathCommand` |
| Semánticas | `arrow`, `connector`, `brace` | `ArrowGeometry` / `ConnectorGeometry` o path tipado |

Rectángulos redondeados, anillos, marcos, máscaras y símbolos conservan sus
parámetros legacy en `ShapeGeometry` o en `extensions.legacy` cuando no tienen
una representación vectorial concreta. Blobs conservan el path específico;
no se convierten en rectángulos.

### Seguridad y compatibilidad

`VectorGeometrySchema` solo acepta comandos SVG estructurados (`M`, `L`, `C`,
`Q`, `A`, `Z`), coordenadas finitas normalizadas y paths abiertos/cerrados
coherentes. `serializeVectorGeometry` y `deserializeVectorGeometry` validan
en ambos límites. Los adaptadores de Image/Video conservan la geometría core
como fuente; Video mantiene una extensión explícita cuando su modelo legacy
solo puede representar una forma simple.

El registry de renderers no importa React, DOM, Konva ni Remotion. Cada editor
registra su adapter host cuando se migren los editores en fases posteriores.
