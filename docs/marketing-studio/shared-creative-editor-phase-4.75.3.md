# Shared Creative Editor — Fase 4.75.3

**Fecha:** 2026-08-30  
**Estado:** Parcialmente completada (primitives opt-in; migración visual pendiente)

## Alcance

Se extrajeron primitives neutrales en `components/backoffice-shell/primitives`:

- `StudioToolRail`
- `StudioResourcePanel`
- `StudioInspectorPanel`
- `CanvasChrome`
- `ZoomPanControls`
- `SelectionOverlay`
- `LayerActionMenu`
- `ShortcutManager`
- `LiveStatus`
- `BottomWorkspace`

También se publican desde `components/backoffice-shell` y cada primitive tiene
un reexport individual para facilitar adopción incremental.

## Decisiones

- Las primitives solo presentan estado y emiten callbacks; no conocen
  `ImageProject`, `VideoProject`, carruseles, escenas, timeline, audio,
  Remotion, exportación ni renderer.
- Los paneles, overlays, rail y bottom workspace son opt-in mediante
  `visible`/`open`; los consumidores actuales no cambian de shell.
- Slots (`headerSlot`, `footerSlot`, `toolbar`, `topSlot`, `bottomSlot`,
  `overlays`) se mantienen como `ReactNode`, permitiendo que cada editor
  conserve su dominio.
- Los controles interactivos tienen nombres accesibles, foco visible y targets
  táctiles mínimos de 44px. `LiveStatus` usa `role=status` y `aria-live`.
- `ShortcutManager` instala un único listener por instancia, evita inputs por
  defecto y permite a cada host decidir `preventDefault`, `stopPropagation` y
  `allowInInput`.
- `CreativeStudioShellAdapter` admite `showLiveStatus` como integración opt-in;
  la presentación existente de Image Studio y Video Studio permanece intacta.
- Se usan tokens/clases semánticas existentes; no se añadieron colores hex
  directos a las primitives.

## Validación

- Tests unitarios/contractuales en
  `components/backoffice-shell/__tests__/studioPrimitives.test.tsx` cubren
  slots, visibilidad, estados, accesibilidad, selección, acciones y shortcuts.
- `npm run typecheck`
- `npx vitest run components/backoffice-shell/__tests__/studioPrimitives.test.tsx`

## Pendiente para 4.75.4+

La migración completa de `StudioWorkspaceShell`, Image Studio y Video Studio,
la composición responsive específica a 375px, la auditoría a11y visual,
la retirada de listeners legacy, la disponibilidad productiva de Video Studio y
la validación visual en todos los breakpoints quedan pendientes.
