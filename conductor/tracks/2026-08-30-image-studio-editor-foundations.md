# Track: Shared Creative Editor Foundation

**Fecha:** 2026-08-30  
**Estado:** En ejecución — Fase 4.5 completada; migración de editores pendiente
**Rama:** `feat/carousel-creative-composition`  
**Áreas:** `[marketing-studio, image-studio, video-studio, editor, vector, remotion, ux, productivity]`

---

## 1. Objetivo

Construir un núcleo editorial compartido para Image Studio y Video Studio,
inspirado en los patrones de Adobe, Figma y Canva, que permita editar
documentos estáticos y temporales sin duplicar modelos ni lógica.

El núcleo debe ser independiente del renderer y cubrir escenas, capas,
geometrías, transforms, constraints, texto, assets, brand tokens, historial y
persistencia. Image Studio lo consumirá para documentos estáticos y Video
Studio lo extenderá con timing, animación, audio y renderizado Remotion.

## 2. Prioridades

### 2.1 Modelo documental compartido

- Definir un contrato común de documento, escenas, capas y grupos.
- Mantener compatibilidad con `ImageProject` y `VideoProject` existentes.
- Separar propiedades visuales compartidas de timing y comportamiento temporal.
- Versionar y validar el modelo con migraciones explícitas.

### 2.2 Geometría y herramientas de dibujo directo

- Rectángulos, círculos, polígonos y estrellas.
- Líneas, flechas, polilíneas y pluma Bézier.
- Previsualización durante el gesto y cancelación segura.
- Configuración contextual de relleno, trazo y cierre.

### 2.3 Selección y transformación

- Selección individual y múltiple.
- Caja de selección, handles, rotación y duplicación.
- Snapping, alineación y distribución.
- Mantener proporciones y límites del lienzo.

### 2.4 Edición vectorial real

- Edición de nodos y tipos de punto.
- Strokes, joins, caps, degradados y opacidad.
- Máscaras, clipping y operaciones booleanas.
- Validación y persistencia segura de geometrías.

### 2.5 Sistema de capas

- Panel de capas completo con reordenación.
- Agrupación, bloqueo, visibilidad y estados.
- Capas globales de carrusel diferenciadas de las capas por slide.
- Acciones de duplicar, ocultar y localizar en el lienzo.

### 2.6 Layout y composición

- Reglas, grids y guías inteligentes.
- Safe zones y snapping semántico.
- Constraints y comportamiento responsive.
- Auto Layout para grupos y componentes editoriales.

### 2.7 Texto

- Cajas redimensionables y estilos reutilizables.
- Auto-fit, truncado controlado y validación de overflow.
- Texto sobre path.
- Variables de marca y jerarquías tipográficas.

### 2.8 Tiempo, animación y prototipado

- Añadir timing opcional por capa y escena.
- Preparar keyframes y propiedades animables sin acoplarlas al renderer.
- Mantener escenas, variantes y transiciones para Video Studio.
- Conservar secuencias y safe zones específicas de carruseles.

### 2.9 Assets, persistencia y productividad

- Reutilizar assets, Brand Kit y referencias de Storage.
- Unificar autosave, versiones, undo/redo y recuperación.
- Compartir exportación y validación sin incluir overlays del editor.
- Preparar comentarios y colaboración para una fase posterior.

### 2.10 Prototipado y carruseles

- Secuencias, variantes y componentes compartidos.
- Transiciones y estados de interacción cuando aplique.
- Edición consistente entre slides.
- Safe zones específicas por plataforma y formato.

## 3. Fases de implementación

### Fase 0 — Congelar comportamiento actual

- [x] No eliminar modelos legacy.
- [x] Documentar invariantes de posición, tamaño, orden, visibilidad, bloqueo,
  texto y assets.
- [x] Crear fixtures representativos de Image Studio y Video Studio.
- [x] Añadir pruebas de compatibilidad y conversión.

### Fase 1 — Crear el core neutral

- [x] Definir `CreativeDocument`, escenas, capas y extensiones legacy.
- [x] Definir transformaciones y geometrías normalizadas `0..1`.
- [x] Definir appearance, assets, timing opcional y grupos.
- [x] Añadir schema versionado con Zod.

### Fase 2 — Crear adaptadores

- [x] Implementar conversiones Image ↔ CreativeDocument.
- [x] Implementar conversiones Video ↔ CreativeDocument.
- [x] Preservar propiedades no migradas en `extensions.legacy`.
- [x] Resolver assets mediante referencias persistibles.

### Fase 3 — Unificar operaciones de dominio

- [x] Extraer comandos puros de capas, selección, transformación y grupos.
- [x] Extraer undo/redo e historial semántico.
- [x] Convertir los hooks React en adaptadores de estado.

### Fase 4 — Unificar assets y persistencia

- [x] Crear `CreativeAssetRef` canónico.
- [x] Añadir repositorio neutral de documentos reutilizable por Video Studio.
- [x] Unificar autosave, versiones, recuperación y validación.
- [x] Mantener fachadas legacy durante la migración.

### Fase 4.5 — Core vectorial compartido

- [x] Auditar y clasificar el catálogo en primitivas, paths y geometrías semánticas.
- [x] Definir `ShapeGeometry`, `PathGeometry`, `PathCommand`, Bézier, flechas,
  conectores y la unión `VectorGeometry` con coordenadas normalizadas.
- [x] Validar y serializar geometrías de forma estricta y segura con Zod.
- [x] Conservar puntos, comandos, cierre, handles, endpoints, anclajes y puntas
  en adaptadores Image/Video; mantener extensiones cuando Video no puede
  representar una geometría avanzada.
- [x] Publicar fixtures, pruebas round-trip y contrato neutral de renderers.
- [ ] Migrar hooks y renderers productivos de Image Studio y Video Studio.

### Fase 5 — Migrar Image Studio

- [ ] Migrar capas, transforms, geometrías, grupos, constraints y selección.
- [ ] Mantener carruseles, panorama, crop, preview y exportación como extensiones.

### Fase 6 — Migrar Video Studio

- [ ] Migrar capas, escenas, componentes, assets y constraints.
- [ ] Mantener timeline, frames, keyframes, audio, transiciones y Remotion como
  extensiones temporales.

### Fase 7 — Sustituir el bridge actual

- [ ] Reemplazar el handoff directo por `CreativeDocument` persistido.
- [ ] Mantener `vitablue:image-video-handoff` como fallback temporal.
- [ ] Completar el consumo del documento en `SocialGenerator`.

### Fase 8 — Registry de renderers

- [ ] Crear registry común de renderers semánticos.
- [ ] Implementar adaptadores Konva/DOM y Remotion.
- [ ] Compartir props semánticas del Motion Kit.

### Fase 9 — Retirada progresiva

- [ ] Retirar modelos internos duplicados tras validar consumidores.
- [ ] Mantener aliases y funciones legacy.
- [ ] Eliminar bridge y persistencia específica cuando no tengan consumidores.

## 4. Criterios de aceptación

- Image Studio y Video Studio consumen contratos compartidos para capas,
  geometrías, transforms, assets y Brand Kit.
- Una persona puede dibujar, seleccionar, transformar y editar elementos sin
  abandonar el lienzo.
- El inspector muestra únicamente controles relevantes para la selección actual.
- Las operaciones conservan undo/redo, persistencia y compatibilidad legacy en
  ambos editores.
- Video Studio añade tiempo, animación y audio sin contaminar el modelo estático.
- Las composiciones funcionan en formatos individuales y panorámicos.
- El editor es usable desde 375px y mantiene precisión en escritorio.
- Las exportaciones no incluyen guías, overlays ni controles del editor.

## 5. Límites

- No sustituye el motor de composición de carruseles ya completado.
- No introduce generación autónoma de diseños sin validación.
- La colaboración en tiempo real queda preparada conceptualmente, pero se
  implementará cuando exista una necesidad operativa concreta.
