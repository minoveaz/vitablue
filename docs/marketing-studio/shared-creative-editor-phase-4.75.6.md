# Fase 4.75.6 — Integración progresiva de los shells

## Alcance

Image Studio adopta `CreativeStudioShellAdapter` como frontera de composición
para el editor de proyecto. `SuiteShell` es el único propietario de
`PlatformHeader` y `SuiteSidebar`; `SuiteCanvas` es el único propietario de las
zonas de canvas, toolbar, contexto, inspector y workspace inferior. No se
anida `StudioWorkspaceShell`, evitando headers, rails o inspectores duplicados.

## Auditoría y decisión de composición

El punto de composición real estaba en `ImageStudio.tsx`: persistencia,
selección y estado viven en `useImageProjectEditor`; `ImageEditorToolbar`,
`ImageStage`, `ImageStudioAssetSidebar` y `ImageStudioInspector` son superficies
de dominio; `CarouselSlideStrip` y `CarouselMobileSimulator` son extensiones de
carrusel. `StudioWorkspaceShell` envolvía todas esas piezas y volvía a
renderizar el header global.

La migración conserva esas fachadas y las conecta así:

- `StudioToolRail` reemplaza el rail visual legacy.
- El drawer de recursos y su contenido (`ImageStudioAssetSidebar`, incluyendo
  `ImageStudioLayersPanel`) permanecen legacy dentro de `resourcePanel`.
- `ImageEditorToolbar` y la barra contextual permanecen juntos en `toolbar`.
- `ImageStage` permanece como `stage`, incluyendo crop, selección, vectores y
  transforms.
- `ImageStudioInspector` se conecta como `inspector` y conserva su control de
  visibilidad.
- `CarouselSlideStrip` se expone como extensión `slideStrip` en
  `bottomWorkspace`; `CarouselMobileSimulator` como extensión `preview` en
  `overlays`. Crop y export siguen siendo callbacks del toolbar/stage, sin
  mover lógica de dominio al shell.

El hub, los estados de carga y los errores continúan usando `BackofficeShell`
porque son vistas de overview, no el workspace editorial.

## Responsive y estados

El adapter propaga `mobileSafeMode`: por debajo de `768px` se muestra el estado
seguro existente y se ocultan las superficies editoriales, sin overflow
horizontal. Tablet y escritorio conservan rail, drawer, canvas, inspector,
strip, preview, crop, exportación y edición vectorial. El estado de guardado
continúa visible en `ImageEditorToolbar`; no se añade un `LiveStatus` duplicado.

## Límites explícitos

- Video Studio no se migra en esta fase; sus superficies y `StudioWorkspaceShell`
  quedan intactos, con el contrato preparado para una adopción posterior.
- No se extraen todavía las capas, transforms, crop, exportación, renderer
  Konva/DOM ni la lógica de carrusel fuera de Image Studio.
- `ImageStudioLayersPanel` sigue siendo una pestaña del sidebar, no un panel
  global independiente.
- `ModuleHeader` no se añade al workspace porque el toolbar existente ya posee
  título, navegación y acciones; añadirlo duplicaría controles.

## Validación

Se añadieron pruebas de contrato/integración para el dominio Image Studio y el
mapping de `slideStrip`/`preview`. Ejecutar `npm run typecheck`, los tests
dirigidos y la suite existente, `npm run lint` y `npm run build`.
