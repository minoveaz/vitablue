# Shared Creative Editor — Fase 4.75.2

## Auditoría y consolidación de shells existentes

Esta fase convierte el contrato tipado de 4.75.1 en una frontera de composición
adoptable. No extrae primitives, no cambia el modelo documental y no migra por
completo ningún editor.

## Inventario de consumidores reales

| Superficie | Shell que consume | Uso actual |
| --- | --- | --- |
| Backoffice general | `components/layouts/BackofficeShell` | Adapter usado por Home, Catálogo, Tools y Document Intelligence. |
| Marketing Studio | `components/layouts/BackofficeShell` a través de `MarketingStudioShell` | Asset Management y superficies de marketing. |
| Video Studio | `components/layouts/BackofficeShell` | `SocialGenerator` compone toolbar, biblioteca contextual, stage, inspector, transport y timeline como contenido de dominio. |
| Image Studio hub/estados | `components/layouts/BackofficeShell` | Hub, carga y error de persistencia. |
| Image Studio editor | `StudioWorkspaceShell` | Rail creativo, drawer de recursos, toolbar, stage, inspector, strip y overlays. |
| Runtime declarativo | `SuiteRuntime` (sin consumidores de producción detectados) | Composición preparada sobre `SuiteShell` + `SuiteCanvas`. |

También se revisaron las implementaciones de `PlatformHeader`, `SuiteSidebar`,
`SuiteCanvas` y `SuiteShell`. No se encontraron consumidores reales del antiguo
`components/backoffice-shell/BackofficeShell`; solo estaba reexportado desde el
barrel.

## Decisión de fuente de verdad

La arquitectura consolidada queda delimitada así:

1. **Navegación global:** `SuiteShell` + `SuiteSidebar`.
2. **Header global:** `PlatformHeader`, montado por `SuiteShell`.
3. **Canvas y layout de zonas comunes:** `SuiteCanvas`.
4. **Composición creativa temporal de Image Studio:** `StudioWorkspaceShell`.
   Sigue siendo una superficie de editor específica y no una segunda fuente de
   navegación global. Su uso se mantiene intacto durante la migración.
5. **Compatibilidad de páginas existentes:** `components/layouts/BackofficeShell`
   es el adapter canónico que traduce las props legacy a los puntos 1–3.

`backofficeNavigation` permanece como dato legacy no consumido; la navegación
efectiva de las páginas anteriores procede de `vitablueBackofficeSchema` y
`SuiteSidebar`. No se eliminan datos legacy en esta fase.

## Frontera de adopción 4.75.1

`components/backoffice-shell/CreativeStudioShellAdapter.tsx` implementa una
frontera sin markup de shell duplicado:

- recibe `CreativeStudioShellProps` y un `NavigationSchema` explícitos;
- delega navegación y header a `SuiteShell`;
- delega canvas a `SuiteCanvas`;
- mantiene `platformHeader` y `suiteNavigation` como regiones reservadas: no las
  renderiza de nuevo ni permite duplicar el header/sidebar globales;
- resuelve slots con el contexto de estado, interacción y extensión;
- agrupa temporalmente `toolRail`/`resourcePanel` en la zona contextual izquierda
  y `layersPanel`/`inspector` en la derecha;
- conserva `bottomWorkspace` como footer y `overlays` como overlay del suite;
- no instala listeners ni asume ownership de paneles, foco o shortcuts.

Esta frontera permite migrar un consumidor por partes sin envolver un
`StudioWorkspaceShell` dentro de otro shell ni duplicar `PlatformHeader`.
No se conecta automáticamente a los editores actuales: la adopción queda
intencionadamente opt-in para que 4.75.3 pueda extraer primitives sin cambiar
el comportamiento de Image Studio o Video Studio.

## Duplicado de `BackofficeShell`

El archivo antiguo `components/backoffice-shell/BackofficeShell.tsx` ya no
contiene una implementación paralela. Se conserva como reexport deprecated de
`components/layouts/BackofficeShell`, que es la implementación compatible
canónica. Antes del cambio no había imports directos del archivo antiguo; el
reexport evita romper imports indirectos o integraciones externas.

## Límites y pendientes

Queda explícitamente fuera de 4.75.2:

- extraer `StudioToolRail`, `StudioResourcePanel`, `StudioInspectorPanel`,
  `CanvasChrome`, controles de zoom/pan, overlays, acciones de capas,
  `ShortcutManager`, estados live y `BottomWorkspace`;
- sustituir el workspace visual de Image Studio;
- convertir Video Studio entero al contrato;
- definir responsive/a11y completo, equivalencia de renderers y validación visual;
- retirar aliases o superficies legacy.

Estos trabajos pertenecen a 4.75.3 y a las fases de migración posteriores.
