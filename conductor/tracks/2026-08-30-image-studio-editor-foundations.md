# Track: Shared Creative Editor Foundation

**Fecha:** 2026-08-30  
**Estado:** En ejecución — Fases 0–4.5, 4.75.1, 4.75.2, 4.75.3, 4.75.4 y el alcance P0 de 4.75.5 completados; 4.75.6+ pendientes
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

Antes de migrar los editores, ambos deben compartir un shell de trabajo
estandarizado, inspirado en la coherencia de suites como Adobe, sin ocultar las
capacidades específicas de composición de Image Studio ni de timeline de Video
Studio.

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

### Fase 4.75 — Creative Studio Shell & Interaction Standard

Objetivo: establecer una experiencia común para Image Studio y Video Studio
antes de migrar sus hooks y renderers al `CreativeDocument`.

#### Fase 4.75.1 — Contrato y arquitectura del shell

- [x] Definir `CreativeStudioShell` como contrato tipado de composición con
  props, slots, regiones y estado, sin reemplazar todavía los shells existentes.
- [x] Estandarizar contractualmente `PlatformHeader`, `SuiteNavigation`,
  `ModuleHeader`, `ToolRail`, `ResourcePanel`, `Toolbar`, `Stage`, `Inspector`,
  `LayersPanel`, `BottomWorkspace` y `Overlays`.
- [x] Definir capacidades y slots de extensión para Image Studio (slide strip,
  preview, crop/export) y Video Studio (scenes, timeline, transport, audio,
  Remotion), sin lógica de dominio en el contrato común.
- [x] Definir el ciclo de estado común `saved`, `saving`, `error`, `offline` y
  `rendering`, y dejar ownership de paneles, foco y shortcuts como integración
  opcional del consumidor.
- [x] Documentar los límites mobile-first y de accesibilidad del contrato.

#### Fase 4.75.2 — Auditoría y consolidación de shells existentes

- [x] Auditar implementaciones y consumidores reales de `BackofficeShell`,
  `SuiteShell`, `SuiteCanvas`, `StudioWorkspaceShell`, `SuiteSidebar` y
  `PlatformHeader`.
- [x] Establecer `SuiteShell`/`SuiteSidebar` como fuente de verdad para
  navegación global y `PlatformHeader` como header global.
- [x] Establecer `SuiteCanvas` como composición común de canvas/stage y
  mantener `StudioWorkspaceShell` como workspace creativo transicional de
  Image Studio, sin crear otro shell paralelo.
- [x] Crear `CreativeStudioShellAdapter` como frontera de adopción del
  contrato 4.75.1, con mapeo explícito de slots y ownership del consumidor.
- [x] Convertir el `BackofficeShell` antiguo en reexport compatible del
  adapter canónico de `components/layouts/BackofficeShell`, sin eliminar
  implementaciones ni romper imports.
- [x] Mantener Image Studio y Video Studio sin migración visual completa.
- [x] Documentar decisiones, consumidores, límites y pendientes en
  `docs/marketing-studio/shared-creative-editor-phase-4.75.2.md`.

#### Fase 4.75.3 — Primitives compartidas (parcialmente completada)

- [x] Extraer primitives opt-in (`StudioToolRail`, paneles de recursos e
  inspector, `CanvasChrome`, `ZoomPanControls`, `SelectionOverlay`,
  `LayerActionMenu`, `ShortcutManager`, `LiveStatus` y `BottomWorkspace`) con
  slots, callbacks y reexports compatibles.
- [x] Definir controles compartidos para zoom, pan, fit-to-screen, reset,
  selección, acciones contextuales y visibilidad de paneles, sin asumir lógica
  de dominio.
- [x] Unificar la presentación de estados `saved`, `saving`, `error`,
  `offline` y `rendering` mediante `LiveStatus`, con integración opt-in en el
  adapter.
- [x] Centralizar el listener de shortcuts por instancia, con protección para
  campos editables y control explícito de `preventDefault`.
- [ ] Migrar `StudioWorkspaceShell`, Image Studio y Video Studio a las
  primitives sin alterar sus dominios.
- [ ] Completar responsive/a11y visual, retirar listeners legacy y validar
  doble aplicación de nudges en los editores migrados.

#### Fase 4.75.4 — Interacción y estados comunes

- [x] Auditar shortcuts/listeners y retirar el doble nudge de Image Studio.
- [x] Adoptar `ShortcutManager` con scopes, ownership único, enable/disable y
  cleanup en Image Studio y Video Studio.
- [x] Unificar la presentación de estados mediante `LiveStatus`, manteniendo
  errores visibles, offline y reintento explícito.
- [x] Definir contratos opt-in para selección, paneles, foco y acciones
  contextuales, conservando ownership del consumidor.
- [x] Cubrir shortcuts, cleanup, callbacks, estados y no duplicación con tests.
- [ ] Migrar completamente los shells y los editores (4.75.5+).

#### Fase 4.75.5 — Responsive y accesibilidad P0

- [x] Asegurar un comportamiento mobile-first seguro a 375px, sin
  desbordamiento del rail, paneles, inspector y canvas, mediante guard explícito
  mientras la UX editorial móvil completa permanece fuera de alcance.
- [ ] Convertir paneles laterales en overlays o bottom sheets según viewport.
- [ ] Definir el timeline: visible en desktop y drawer o bottom workspace en
  móvil.
- [x] Añadir roles, labels, foco visible y navegación de teclado a canvas,
  escenas, capas, timeline, overlays e icon buttons.
- [x] Garantizar targets táctiles mínimos de 44px y `aria-live` para estados de
  guardado, render y errores.
- [x] Revisar colores hard-coded en las superficies modificadas y aplicar
  tokens semánticos del sistema visual.

#### Disponibilidad y contratos de interacción (pendiente)

- [ ] Confirmar y corregir la disponibilidad de Video Studio fuera de `DEV`
  antes de considerarlo superficie de producción.
- [ ] Definir la equivalencia entre Konva/DOM y Remotion como contrato
  semántico, reservando pixel-perfect para los casos que lo requieran.
- [ ] Documentar capacidades comunes y extensiones específicas de cada studio.
- [ ] Validar visualmente y funcionalmente a 375, 768, 1024 y 1440px.

Los siguientes ítems siguen pendientes: migración completa de editores,
responsive/a11y completa, disponibilidad de Video Studio, equivalencia de
renderers y validación visual.

Resultado esperado: ambos estudios deben compartir aproximadamente el 80–90%
del shell y de la interacción, manteniendo como extensiones el carrusel y la
composición avanzada en Image Studio, y timeline, animación, audio y Remotion
en Video Studio.

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
- Image Studio y Video Studio comparten el shell, estados, shortcuts,
  responsive y patrones de accesibilidad definidos en la Fase 4.75.
- El shell común no contiene lógica específica de carrusel, timeline, audio,
  exportación o renderer.
- Las exportaciones no incluyen guías, overlays ni controles del editor.

## 5. Límites

- No sustituye el motor de composición de carruseles ya completado.
- No introduce generación autónoma de diseños sin validación.
- La colaboración en tiempo real queda preparada conceptualmente, pero se
  implementará cuando exista una necesidad operativa concreta.
