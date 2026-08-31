# Fase 4.75.7 — Integración progresiva y hardening de Video Studio

## Alcance completado

Video Studio (`/backoffice/marketing-studio/generador-contenido` y su entrada
legacy `/backoffice/marketing-studio/dam/video/new`) adopta
`CreativeStudioShellAdapter` como frontera de composición. `SuiteShell` continúa
siendo el único propietario de `PlatformHeader` y navegación, y `SuiteCanvas`
continúa siendo el propietario del layout compartido. No se anidan shells ni se
duplican headers, rails o inspectores.

La shell visual de Video Studio replica la composición de Image Studio: un único
`StudioToolRail` creativo a la izquierda, un panel contextual para escenas,
recursos, capas y audio, el stage central, el inspector derecho y el workspace
inferior. El panel contextual reutiliza las acciones existentes de
`CreativeEditorAssetSidebar`; el rail no añade fuentes de assets ni operaciones
de audio nuevas.

La composición real queda separada de las extensiones de vídeo:

- `CreativeEditorToolbar` permanece como toolbar de dominio.
- `CreativeEditorAssetSidebar` se expone como extensión `scenes` y se coloca
  dentro del panel contextual controlado por el rail.
- `VideoStage` y su reproductor Remotion se mantienen como extensión `remotion`
  y región `stage`.
- `TransportControls` y `VideoTimeline` se exponen como extensiones `transport`
  y `timeline` en el workspace inferior.
- Audio continúa representado por las pistas de audio del timeline y el
  renderer Remotion. El acceso del rail solo muestra la acción existente para
  añadir una pista; no se inventa un catálogo de audio nuevo.
- Inspector, selección de capas, menú contextual, transiciones, assets y render
  mantienen sus callbacks y ownership legacy.

## Paridad visual del toolbar e inspector

Video Studio ya comparte el contrato visual de Image Studio sin compartir
lógica de dominio:

- `CreativeEditorToolbar` usa la misma densidad `min-h-11`, grupos segmentados,
  radios, bordes `slate`, fondos `slate-950`, estados activos teal y focus rings
  cyan que `ImageEditorToolbar`/`ImageStageToolbar`. Sus controles siguen siendo
  propios de vídeo: relación de aspecto, safe zones, zoom, preset, render MP4 y
  enlace a Image Studio.
- La barra flotante de zoom de `VideoStage` comparte la posición centrada,
  altura, radios, fondo midnight, wrap y focus rings de `ImageStageToolbar`,
  conservando zoom, pan y fit-to-screen de Remotion.
- `CreativeEditorInspector` conserva `ModuleContextPanel` como único contenedor
  contextual y adopta los mismos controles compactos, estados bloqueados,
  botones iconográficos y focus rings del inspector de imagen. Las propiedades
  de escenas, capas, timeline y audio siguen siendo de vídeo.
- Los errores de render permanecen visibles dentro del inspector, con `role=alert`
  y reintento explícito, además del estado existente en el toolbar.
- Se añadió un contrato de integración sin snapshots frágiles para fijar slots,
  clases de presentación críticas, callbacks de dominio y ausencia de
  `SuiteSidebar` duplicado.

El callback `onResizeScene` de `VideoTimeline` ya no se ignora: se añadió un
handle pointer/teclado, con el mínimo de un frame requerido por la validación
actual y actualización a través del callback existente. No se modifican
automáticamente las duraciones
de las capas porque el modelo actual no define esa política.

## Disponibilidad y permisos

Las dos rutas siguen siendo privadas; la ruta principal aparece en la navegación
del backoffice con `content: enabled`, por lo que no se han cambiado permisos ni
ocultado la entrada. Los alias `/marketing-studio/generador-contenido` y las
entradas `MarketingStudio` continúan redirigiendo/seleccionando esa vista según
la configuración existente. Sin embargo, `SocialGenerator` mantiene el guard explícito
`!import.meta.env.DEV` que muestra “Acceso Denegado” fuera de desarrollo. La
evidencia del producto actual no permite convertirla en una superficie de
producción: el editor usa un endpoint/render worker local y no existe una
política de despliegue o autorización de producción documentada. La decisión se
deja visible para una fase posterior, sin silenciar errores ni alterar el
comportamiento existente.

## Responsive y validación

Se conserva `mobileSafeMode`: por debajo de 768 px se muestra únicamente el
guard seguro; tablet y escritorio mantienen stage, escenas, inspector,
reproducción, timeline, audio, assets y exportación.

Se añadieron pruebas de contrato/integración para las capacidades y el mapping
de Video Studio, además de cobertura del límite de resize. Permanecen
pendientes la migración completa a `CreativeDocument`, la extracción de las
fachadas legacy, la equivalencia pixel-perfect de renderers y la UX editorial
móvil.
