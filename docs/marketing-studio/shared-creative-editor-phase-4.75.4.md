# Shared Creative Editor — Fase 4.75.4

**Fecha:** 2026-08-30  
**Estado:** Completada (interacción y estados comunes, adopción opt-in)

## Alcance

- `ShortcutManager` ahora comparte un listener por `target` y `scope`, acepta
  `enable/disable`, callbacks tipados y libera registros/listeners al desmontar.
  Un evento solo puede ser consumido una vez; los campos editables siguen
  protegidos por defecto.
- Image Studio usa el manager común para undo/redo, agrupación, clipboard,
  duplicado, borrado y nudges. Se retiró el listener de nudges duplicado del
  viewport; el viewport conserva el ownership de pan/hand.
- Video Studio usa el mismo manager para transport, seek, split y borrado.
  Timeline, audio, transport y Remotion siguen siendo dominio de Video.
- `CreativeStudioShellInteraction` incluye contratos opt-in para scope,
  selección y acciones contextuales. El consumidor mantiene el ownership por
  defecto de paneles, foco y shortcuts.
- `LiveStatus` presenta los estados comunes `saved`, `saving`, `error`,
  `offline` y `rendering`, incluyendo errores visibles y reintento explícito.
  Las barras de Image y Video lo consumen sin migrar todavía sus shells.

## Auditoría y ownership

| Superficie | Owner durante 4.75.4 |
| --- | --- |
| Undo/redo, clipboard, agrupación, duplicado, borrado y nudge de Image | `ShortcutManager(scope="consumer")` |
| Pan/hand, spacebar, V/H y wheel de Image | viewport/stage existente |
| Transport, seek, split y borrado de Video | `ShortcutManager(scope="consumer")` |
| Timeline, audio y Remotion | Video Studio |
| Paneles, foco, selección y acciones contextuales | consumidor; contrato opt-in |

La auditoría detectó que Image registraba nudge tanto en `ImageStudio` como en
`useImageStageViewport`; se conserva un único owner. Los managers comparten
registro por target/scope y un evento no puede ejecutarse dos veces.

## Límites deliberados

La migración no sustituye `StudioWorkspaceShell`, no implementa bottom sheets
móviles ni completa la auditoría responsive/a11y. Zoom, pan, fit, reset y
selección siguen en los stages actuales; `ZoomPanControls` y los contratos
compartidos quedan disponibles para una adopción posterior sin forzar un
renderer común.

## Validación

- `npm run typecheck`
- `npx vitest run components/backoffice-shell/__tests__/studioPrimitives.test.tsx`
- suite, lint y build del proyecto
