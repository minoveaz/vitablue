# Fase 4.75.8 — Auditoría final común de Image Studio y Video Studio

**Fecha:** 2026-08-30  
**Estado:** corrección aplicada en la rama actual; sin commit ni push.

## Matriz común verificada

| Superficie | Owner único | Image Studio | Video Studio | Verificación |
| --- | --- | --- | --- | --- |
| Platform/suite header | `SuiteShell` → `PlatformHeader` | Adapter | Adapter | `creative-studio-platform-header` |
| Module header | `ModuleHeader` | `slots.moduleHeader` | `slots.moduleHeader` | `creative-studio-module-header` |
| Suite shell y sidebar | `SuiteShell` | `navMode="hidden"` | `navMode="hidden"` | No se monta `SuiteSidebar` en modo hidden |
| Canvas layout | `SuiteCanvas` + `CanvasChrome` | Adapter | Adapter | `creative-studio-canvas` / `creative-studio-canvas-chrome` |
| Tool rail | `StudioToolRail` | slot común | slot común | rail vertical, active/disabled y focus iguales |
| Recursos | `StudioResourcePanel` | contenido de Image | contenido de Video | header, cierre, padding, scroll y width iguales |
| Toolbar principal | `SuiteCanvas` | `ImageEditorToolbar` | `CreativeEditorToolbar` | misma densidad, wrap, tokens y targets |
| Toolbar de stage | `StudioStageToolbar` | `ImageStageToolbar` | `VideoStage` | misma geometría, fondo, border, z-index y focus |
| Canvas grid | `CanvasChrome` → `CanvasGrid` | dotted/technical | dotted/technical | una configuración, fondo decorativo y `pointer-events: none` |
| Stage | `CanvasChrome` | Konva/DOM | Remotion | renderer de dominio, chrome compartido |
| Inspector | `SuiteCanvas` + `StudioInspectorPanel` | propiedades de imagen | propiedades de vídeo | mismo panel, `as="div"` sin landmark anidado |
| Capas | panel de recursos | capas Image | capas Video | contenido y callbacks de dominio |
| Workspace inferior | extensión | slide strip/carrusel | timeline/transport/audio | `BottomWorkspace` disponible y owner único |
| Overlays/menús | Adapter/slots | crop, preview, context toolbar | safe zones, context menu, transición | no se duplica el shell |
| Lifecycle | `LiveStatus` | saved/saving/error/offline | saved/saving/error/offline/rendering | `aria-live`, mensaje y retry |
| Keyboard/focus | `ShortcutManager` + stage | scope consumer | scope consumer | listener único, cleanup y targets 44 px |

La matriz está publicada como `CREATIVE_STUDIO_PARITY_MATRIX` en
`components/backoffice-shell/contracts/creativeStudioParity.ts` y se valida en
`marketing-studio/__tests__/creativeStudioParity.test.ts`, junto con los
contratos existentes. Son comprobaciones estructurales y de contrato visual,
no snapshots frágiles.

## Correcciones aplicadas

- `SuiteShell` no monta `SuiteSidebar` cuando `navMode="hidden"`; los dos
  estudios conservan únicamente `PlatformHeader` y su shell creativo.
- Se corrigió el stage blanco/vacío de Video Studio: `SuiteCanvas` entregaba su
  `<main>` como bloque, por lo que el `flex-1` de `CanvasChrome` no tenía efecto.
  El canvas se encogía a la altura intrínseca del toolbar y el resto quedaba
  mostrando el fondo blanco de `SuiteCanvas`; al convertir ese owner en
  `flex-col`, `CanvasChrome` ocupa toda el área y Remotion vuelve a medir y
  montar el Player con las escenas actuales.
- `SuiteShell` resuelve correctamente el modo interno cuando el callback de
  navegación no recibe un valor controlado.
- `ModuleHeader` tiene una variante `studio` compartida; ambos editores
  montan la misma estructura, tipografía, borde, fondo y focus de breadcrumbs.
- `CanvasChrome` se convierte en owner común del stage y
  `StudioStageToolbar` centraliza el chrome inferior de zoom/pan/fit/reset.
- `CanvasGrid` es la primitive compartida del backdrop de ambos estudios. Su
  configuración por defecto es `pattern="dotted"`, `spacing=24`, color
  `var(--color-primary)` sobre `var(--color-secondary)` y no captura eventos.
  `CanvasChrome` la monta una sola vez; se puede desactivar con `grid={false}` o
  configurar mediante   `CanvasGridProps`/`canvasGrid` sin acoplarse al renderer. `pattern` y
  `variant` son aliases tipados (`dotted`/`technical`); `opacity` acepta
  también una variable CSS.
  Video añade selección/mano equivalente a Image; los callbacks siguen siendo
  propios de cada renderer.
- `StudioResourcePanel` y `StudioInspectorPanel` mantienen un único header,
  cierre táctil, padding, scroll, background, borders y contratos de datos.
- Toolbars, overlays, paneles y controles mantienen wrap responsive,
  focus-visible y targets mínimos de 44 px; se conservan los callbacks
  existentes.
- Los estados `saved`, `saving`, `error`, `offline` y `rendering` siguen
  visibles mediante `LiveStatus`, con retry explícito para errores.
- Se preservan carrusel, slide strip, preview/crop/export/vector de Image y
  scenes/timeline/transport/audio/Remotion/render de Video.

## Divergencias intencionales

- Image usa slides, Konva/DOM, crop, vector y exportación; Video usa scenes,
  frames, timeline, transport, audio y Remotion. Solo cambia el contenido de
  dominio dentro de los slots compartidos.
- Image conserva Hub/DAM y persistencia remota; Video conserva su hook y render
  worker legacy.
- No se migra `CreativeDocument`, ni se eliminan bridges o fachadas legacy.
- El guard móvil muestra una pantalla segura hasta `md` (768 px); no se
  inventa una UX editorial móvil completa.
- `SocialGenerator` continúa limitado a `DEV`; disponibilidad productiva,
  permisos y equivalencia pixel-perfect entre Konva/DOM y Remotion siguen fuera
  de esta fase.

## Checklist de verificación

- [x] Ambos workspaces usan `CreativeStudioShellAdapter`.
- [x] No se monta `SuiteSidebar` en ningún studio (`navMode="hidden"`).
- [x] Header de plataforma, ModuleHeader, rail, recursos, toolbar, canvas,
  stage, inspector y overlays tienen owner común.
- [x] Resource panel e inspector usan primitives idénticos de chrome.
- [x] Stage toolbar de Image y Video usa `StudioStageToolbar`.
- [x] Image y Video reciben la misma `CanvasGrid` desde `CanvasChrome`; la
  primitive se exporta desde `components/backoffice-shell/primitives`.
- [x] Estados, retry, shortcuts, cleanup y targets táctiles tienen contratos.
- [x] Matriz automatizable y tests estructurales/visuales-contract añadidos.
- [x] Suite completa, typecheck, lint y build ejecutados correctamente
  (`370` tests, sin errores de lint; quedan solo warnings preexistentes).
- [x] Regresión cubierta con `VideoStage.test.tsx`: Remotion recibe el
  storyboard, dimensiones y adaptador esperados; el contrato de `SuiteCanvas`
  verifica que el padre del stage conserva la altura flex necesaria.
- [ ] Validación visual manual en 768, 1024 y 1440 px (requiere navegador).
- [ ] Fase 5: migración a `CreativeDocument`.
