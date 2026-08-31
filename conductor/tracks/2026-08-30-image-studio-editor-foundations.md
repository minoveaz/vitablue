# Track: Shared Creative Editor Foundation

**Fecha:** 2026-08-30  
**Estado:** En ejecución — Fases 0–4.5, 4.75.1–4.75.9, 4.75.10 (bloques core), 4.75.11 (inspector), 4.75.12 (toolbar) y 4.75.13 (hubs) implementadas en código y tests; escritorio validado visualmente; mejoras responsive de tablet y algunas capacidades de persistencia de Video quedan pospuestas; Fase 5 y fases posteriores pendientes
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

#### Fase 4.75.6 — Integración progresiva de los shells

- [x] Auditar `ImageStudio.tsx` y localizar la composición efectiva de toolbar,
  sidebar/layers, stage, inspector, carrusel, preview, crop y exportación.
- [x] Integrar el workspace de Image Studio con `CreativeStudioShellAdapter`,
  `SuiteShell`, `SuiteCanvas` y `StudioToolRail` sin anidar
  `StudioWorkspaceShell` ni duplicar `PlatformHeader`/paneles.
- [x] Mantener carrusel, slide strip, preview, crop, exportación y edición
  vectorial como extensiones de dominio; el adapter solo compone regiones.
- [x] Propagar el guard seguro móvil al adapter y conservar funcionalidad de
  tablet/escritorio y navegación existente.
- [x] Añadir pruebas de contrato/integración para el mapping de Image Studio y
  documentar la frontera de migración.
- [ ] Extraer completamente las superficies legacy de Image Studio, migrar
  Video Studio o sustituir sus fachadas.

#### Fase 4.75.7 — Integración progresiva y hardening de Video Studio

- [x] Auditar consumidores, rutas privadas y guard DEV de `SocialGenerator` sin
  cambiar permisos ni convertir la superficie en producción sin evidencia.
- [x] Integrar Video Studio con `CreativeStudioShellAdapter`, manteniendo
  `SuiteShell`/`SuiteCanvas` como propietarios del shell global y sin duplicar
  headers o layouts.
- [x] Replicar en Video Studio la shell creativa de Image Studio con un único
  `StudioToolRail`, panel contextual, stage, inspector y workspace inferior,
  sin reintroducir `SuiteSidebar`.
- [x] Mantener escenas, timeline, transport, audio y Remotion como extensiones
  de dominio, conservando las fachadas legacy y sus callbacks.
- [x] Corregir el callback `onResizeScene` no implementado con resize acotado al
  mínimo de un frame válido y accesible, sin inventar una política de
  sincronización de capas.
- [x] Añadir pruebas de contrato/integración del mapping de Video Studio y del
  resize de escenas; conservar el guard seguro móvil.
- [x] Alinear toolbar e inspector de Video Studio con la densidad, tokens,
  bordes, fondos, estados activos, icon buttons y focus rings de Image Studio,
  conservando controles específicos de vídeo.
- [x] Mantener errores de render visibles en el inspector contextual con
  reintento explícito.
- [x] Añadir contrato visual/integración sin snapshots frágiles para estructura,
  clases críticas, callbacks y slots del shell.
- [ ] Migrar completamente Video Studio a `CreativeDocument`, extraer fachadas
  legacy, resolver equivalencia entre renderers y completar UX editorial móvil.

#### Disponibilidad y contratos de interacción (pendiente)

- [ ] Confirmar y corregir la disponibilidad de Video Studio fuera de `DEV`
  antes de considerarlo superficie de producción.
- [ ] Definir la equivalencia entre Konva/DOM y Remotion como contrato
  semántico, reservando pixel-perfect para los casos que lo requieran.
- [ ] Documentar capacidades comunes y extensiones específicas de cada studio.
- [ ] Validar visualmente y funcionalmente a 375, 768, 1024 y 1440px.

#### Fase 4.75.8 — Auditoría común y correctiva

- [x] Verificar la composición real de ambos workspaces con
  `CreativeStudioShellAdapter`; `SuiteShell` no monta `SuiteSidebar` cuando el
  modo es `hidden`.
- [x] Verificar la matriz común de header, ModuleHeader, rail, recursos,
  toolbar, CanvasChrome/CanvasGrid/stage, inspector, capas, workspace inferior y
  overlays, dejando las capacidades de carrusel y timeline como extensiones.
- [x] Verificar ownership único de slots y callbacks; mantener bridges y
  fachadas legacy durante la migración.
- [x] Verificar estados `saved`, `saving`, `error`, `offline` y `rendering`,
  mensajes visibles y reintento explícito.
- [x] Verificar zoom/pan/fit/reset, selección, focus y targets táctiles en las
  superficies compartidas; `StudioStageToolbar` centraliza el chrome común.
- [x] Verificar el guard móvil limitado y el alcance funcional de tablet/escritorio.
- [x] Verificar rutas privadas y guard DEV sin cambiar permisos; disponibilidad
  productiva queda pendiente.
- [x] Añadir `CREATIVE_STUDIO_PARITY_MATRIX` y tests estructurales/
  visuales-contract sin snapshots frágiles; documentar la matriz completa en
  `docs/marketing-studio/shared-creative-editor-phase-4.75.8.md`.
- [x] Corregir divergencias reales de resource panel e inspector usando los
  primitives compartidos, sin `ModuleContextSidebar` anidado.
- [x] Recuperar el backdrop técnico como `CanvasGrid`, exportarlo desde el
  barrel de primitives y montarlo una sola vez en `CanvasChrome` para Image y
  Video. La API tipada admite `visible`, `pattern` (`dotted`/`technical`),
  `spacing`/`size`, `color`, `opacity`, `className`, `style` y `decorative`;
  `pattern`/`variant` admiten `dotted` y `technical`;
  `CANVAS_GRID_PATTERNS` centraliza los valores del patrón y `canvasGrid` permite
  configurarlo desde el adapter.
- [x] Corregir el stage blanco de Video Studio: `SuiteCanvas` no declaraba
  `flex-col` en su `<main>`, así que el `flex-1` de `CanvasChrome` se ignoraba,
  Remotion recibía un viewport de altura intrínseca y el resto del canvas
  mostraba el fondo blanco. Se añadió la clase flex del owner común y una
  regresión que comprueba el montaje de Remotion con el storyboard actual.
- [ ] Validar manualmente la composición visual en navegador a 768, 1024 y
  1440 px.
- [ ] Migrar el modelo a `CreativeDocument`, retirar bridges/fachadas legacy o
  completar UX editorial móvil (Fase 5+).

#### Fase 4.75.9 — Paridad interna de bloques core

- [x] Montar los siete bloques core mediante componentes únicos de
  `components/creative-resources` en Image Studio y Video Studio.
- [x] Compartir búsqueda, filtros, categorías, cards, acciones base y estados
  explícitos en Texto, Elementos, Medios, Capas y Kit de Marca.
- [x] Compartir variantes, categorías y aplicación/disabled state en Fondos, y
  controles de diseño/alineación/safe zones con capabilities en Diseño.
- [ ] Completar equivalencia de catálogos enriquecidos, upload/stock, composición
  de carrusel y edición tipográfica avanzada en Video; son extensiones que no
  existen en su modelo actual y no se consideran paridad core pendiente.
- [ ] Validar manualmente la composición visual en navegador a 768, 1024 y
  1440 px y ampliar cobertura de callbacks específicos de cada adapter.

Los siguientes ítems siguen pendientes: migración completa de editores,
responsive/a11y completa, disponibilidad de Video Studio, equivalencia de
renderers y validación visual.

Resultado esperado: ambos estudios deben compartir aproximadamente el 80–90%
del shell y de la interacción, manteniendo como extensiones el carrusel y la
composición avanzada en Image Studio, y timeline, animación, audio y Remotion
en Video Studio.

### Fase 4.75.9 — Creative Resource Registry & Shared Tool Content

Objetivo: convertir cada bloque de recursos de Image Studio en un componente
core independiente, gobernado por props y contratos, reutilizable por Image
Studio y Video Studio sin duplicar presentación ni lógica de interacción.

- [x] Auditar por separado Texto, Elementos, Medios, Capas, Fondos, Diseño,
  Kit de Marca, Bloques, Plantillas y Preparar para Video.
- [x] Definir contratos tipados de entrada, estado, acciones y capacidades para
  cada bloque, incluyendo el contexto document/scene/layer de Video.
- [x] Extraer la presentación común de cada bloque sin acoplarla a
  `ImageProject`, `VideoProject`, carrusel, timeline o renderer.
- [x] Crear `CreativeResourceRegistry` con metadata, permisos, orden, icono,
  disponibilidad por dominio y renderer del contenido.
- [x] Crear adapters mínimos para traducir cada bloque al contexto Image o
  Video.
- [x] Mantener una implementación visual única por bloque; las diferencias de
  dominio deben resolverse mediante props/capabilities, no forks de JSX.
- [x] Integrar y verificar en Video Studio Texto, Elementos, Medios, Capas y
  Kit de Marca mediante el registry y callbacks de escena/capa.
- [x] Integrar y verificar la parte compatible de Diseño (centrar una capa
  seleccionada) y dejar Fondos como fachada explícita mientras el renderer no
  acepte mutaciones de fondo.
- [x] Compartir tokens, tabs internas, búsqueda, filtros, estados vacíos,
  loading, error, focus y acciones primarias.
- [x] Mantener como extensiones específicas: carrusel/slides, plantillas
  estáticas, bloques de campaña, crop, panorama y preparar para Video en Image;
  escenas, timeline, transport, audio, keyframes, transiciones y Remotion en
  Video.
- [x] Garantizar que una modificación de un componente core se refleja en ambos
  estudios mediante el registry y sus adapters.
- [x] Añadir tests por bloque, tests de registry y matriz de compatibilidad
  Image/Video.
- [x] Documentar la clasificación y el estado real en
  `docs/marketing-studio/shared-creative-resource-registry.md`.
- [x] Validar desktop/tablet y conservar el guard seguro móvil.

#### Decisión de paridad visual — 2026-08-31

- [x] Consolidar el orden y la disponibilidad de los bloques core en
  `CORE_CREATIVE_RESOURCE_IDS`/`createCreativeResourceToolRail`: Texto,
  Elementos, Medios, Capas, Fondos, Diseño y Kit de Marca.
- [x] Renderizar los bloques desde un `StudioToolRail` vertical compartido en
  ambos estudios; eliminar cualquier selector horizontal principal.
- [x] Separar Escenas y Audio como extensiones verticales de Video sin
  sustituir la navegación core; timeline, transport y Remotion conservan sus
  slots actuales.
- [x] Cubrir orden, disponibilidad, estructura y separación de extensiones con
  `creativeResourceNavigationContract.test.ts`.

Regla de navegación: el rail vertical es el único selector de bloques. El
panel/header/search/filter/spacing/scroll muestra únicamente el bloque activo y
mantiene el chrome compartido de Image Studio. `ResourceTabs` solo puede
aparecer como subcategoría interna. Image mantiene drawers legacy dentro del
slot registry para preservar persistencia y callbacks; la migración interna de
su contenido a bloques registry sigue pendiente.

### Fase 4.75.12 — Paridad de toolbars Image/Video

**En ejecución.** Image Studio es la fuente visual de verdad para el chrome de
edición. `StudioToolbar` centraliza el contrato y la presentación de la barra
superior (título, estado, historial, safe zones, preview, inspector, copiar,
menús, exportación, foco y targets táctiles); Image Studio y Video Studio la
consumen mediante fachadas delgadas. `StudioStageToolbarControls` centraliza
selección/mano, zoom, fit, separadores y reset de pan en ambos stages. Video
mantiene únicamente sus extensiones de formato, zoom de visor, presets y
exportación MP4; playback, timeline y audio permanecen en el workspace inferior.

- [x] Extraer `StudioToolbar` y sus contratos tipados desde
  `ImageEditorToolbar`.
- [x] Migrar `ImageEditorToolbar` y `CreativeEditorToolbar` al componente común
  sin duplicar JSX de toolbar.
- [x] Centralizar los controles comunes de `StudioStageToolbar` y conservar
  dibujo/carrusel como extensiones de Image Studio.
- [x] Mantener labels, orden, estados, focus rings, responsividad y
  accesibilidad de teclado en los componentes compartidos.
- [x] Añadir pruebas estructurales focalizadas para el ownership único de las
  toolbars y los controles de stage.
- [ ] Validar manualmente la paridad visual en navegador a 768, 1024 y 1440 px.

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
### Fase 4.75.10 — Paridad visual 100% de bloques core

**Objetivo:** Image Studio y Video Studio deben renderizar exactamente el mismo
componente para cada recurso core. Los adapters solo pueden aportar datos,
capacidades y callbacks del dominio; no pueden duplicar JSX ni añadir contenido
visual al panel compartido.

**Criterios de cierre:**

- `Text`, `Elements`, `Media`, `Layers`, `Backgrounds`, `Layout` y `Brand Kit`
  se resuelven desde el mismo `CreativeResourceRegistry`.
- El panel core activo muestra únicamente el componente registrado; las
  extensiones específicas quedan aisladas en sus tabs propias.
- No se renderiza el drawer legacy como footer, fallback ni contenido adicional
  cuando el tab activo es core.
- Los tests verifican la misma estructura visual, frame, búsqueda, filtros,
  tarjetas, estados y acciones en ambos dominios.
- Se valida manualmente en 768, 1024 y 1440 px antes de declarar la fase
  completada.

**Decisión de implementación:** se trabajará bloque por bloque tomando la
implementación actual de Image Studio como fuente visual y funcional de verdad.
Cada bloque se extraerá completo a `components/creative-resources/blocks/` y el
mismo componente se renderizará en Image Studio y Video Studio. Los adapters
solo resolverán datos, capacidades y callbacks; no contendrán JSX alternativo.

#### Fase 4.75.10.1 — Bloque Medios

**En ejecución.** Auditar y extraer el bloque Medios actual de Image Studio,
incluyendo subida, drag-and-drop, biblioteca remota, scopes, búsqueda,
categorías, selección de clip shape, inserción, eliminación, estados de carga y
errores. Después se sustituirá el bloque de Video Studio por ese mismo
componente y se validará la paridad visual en 768, 1024 y 1440 px.

#### Fase 4.75.10.2 — Bloque Elements

**Completado en código y tests focalizados.** `ElementsResource` contiene la
implementación completa de Image Studio (scopes, búsqueda, categorías, filtros,
recientes, favoritos, recomendaciones, dibujo rápido, guardados, estados y
callbacks) y se resuelve desde el registry en Image y Video. Video puede
insertar elementos, pero no expone persistencia propia para favoritos/recientes.

#### Fase 4.75.10.3 — Bloque Layers

**Completado en código y tests focalizados.** `LayersResource` comparte árbol,
selección, visibilidad, bloqueo, filtro, renombrado, duplicado, eliminación,
z-order y drag-and-drop. El adapter de Video normaliza las capas de la escena
activa; las acciones solo persisten si el host las proporciona.

#### Fase 4.75.10.4 — Bloque Backgrounds

**Completado en código y tests focalizados.** `BackgroundsResource` conserva el
asistente de composición, propuestas, paletas, continuidad, intensidad,
escala, acentos, composiciones guardadas, trayectoria, preview y reset. Video
muestra una limitación explícita porque actualmente no ofrece persistencia de
fondos; Image conserva los callbacks de regeneración y configuración de marca.

#### Fase 4.75.10.5 — Bloque Layout

**Completado en código y tests focalizados.** `LayoutResource` comparte guías,
grid, márgenes, safe zones, snapping, alineación, distribución, z-order,
agrupación, edición de contenido, tipografía, estilos, opacidad, bordes,
sombras, variantes y auto-layout. Video muestra estado no disponible mientras
su adapter no exponga `layout-update` ni callbacks de persistencia.

#### Fase 4.75.10.6 — Bloque Brand Kit

**Completado en código y tests focalizados.** `BrandKitResource` comparte logos,
destacados, descargas, colores copiables, fondos, componentes y reglas de uso.
Video puede insertar componentes mediante su callback de dominio, pero no
persiste la configuración del Brand Kit ni sus composiciones guardadas.

**Validación restante:** quedan pendientes la comprobación visual manual en
768/1024/1440 px y la validación de build/prerender; typecheck y lint pasan sin
errores (lint mantiene warnings preexistentes y avisos de tipos `any`).

### Fase 4.75.11 — Inspector compartido Image/Video

**Completado en código.** Se extrajo `StudioInspector` y su contrato declarativo
a `components/creative-resources/inspector/`. Image Studio conserva su inspector
completo como fuente visual, usando ahora el mismo panel y chrome; Video Studio
usa el mismo componente para selección, visibilidad, bloqueo, transformación,
posición, dimensiones, rotación, opacidad, tipografía, color, alineación,
escena, timing y medios. Las secciones de timing/media son extensiones explícitas
del adapter de Video y los adapters solo entregan datos y callbacks.

**Validación:** typecheck y pruebas focalizadas pasan; lint no reporta errores
(solo warnings existentes). La validación visual manual en 768/1024/1440 px y
el build completo/prerender quedan pendientes de ejecutar en este entorno.

### Fase 4.75.13 — Hubs de proyectos Image/Video

**Implementado en código y tests focalizados.** Ambos hubs comparten el chrome
visual de tarjetas (`StudioHubProjectCard`) para mantener la misma jerarquía,
previews, metadatos, acciones, estados y responsive grid. Video Studio conserva
copy, formatos y controles específicos de vídeo. La frontera de persistencia
clasifica documentos por `draftDocument.mode`/composición (`imageStudio` o
`videoStudio`), por lo que Image Studio nunca muestra proyectos de vídeo ni
acepta abrirlos por ID. Se mantiene el archivado como estado reversible y la
creación abre el proyecto recién persistido.

**Estado actual del track:** el shell, los bloques core, inspector, toolbar y
hubs ya comparten componentes y contratos. La validación visual de escritorio
queda aceptada; la optimización específica para tablet se pospone para una fase
responsive posterior. También quedan pendientes algunas capacidades de
persistencia de Video antes de iniciar la migración operativa completa hacia
`CreativeDocument` de la Fase 5.
