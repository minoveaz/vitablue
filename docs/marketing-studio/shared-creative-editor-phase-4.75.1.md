# Shared Creative Editor — Fase 4.75.1

## Contrato y arquitectura del shell

Esta fase deja definido el contrato de composición de `CreativeStudioShell`
antes de extraer primitives o migrar editores. El contrato está en
`components/backoffice-shell/contracts/creativeStudioShell.ts` y se exporta
desde `components/backoffice-shell`.

La auditoría y consolidación posterior de los shells, junto con la frontera de
adopción del contrato, está documentada en
`docs/marketing-studio/shared-creative-editor-phase-4.75.2.md`.

### Auditoría de shells existentes

- `StudioWorkspaceShell` (Image Studio) es la referencia más avanzada: ya
  compone `PlatformHeader`, `ToolRail`, drawer de recursos, `Toolbar`, `Stage`,
  inspector y overlays, con ownership de visibilidad en el consumidor.
- `SuiteShell` + `SuiteSidebar` + `SuiteCanvas` cubren navegación global,
  `PlatformHeader`, `ModuleHeader`, panel contextual y canvas, pero no el rail
  creativo ni el workspace inferior.
- `BackofficeShell` es un adapter legacy con su propio header, navegación,
  contexto y overlay; no se sustituye en esta fase para no romper sus
  consumidores.
- Video Studio compone actualmente `BackofficeShell`/superficies de Marketing
  Studio con `CreativeEditorAssetSidebar` y `VideoTimeline`; scenes, timeline,
  transport, audio y Remotion siguen siendo dominio, no shell común.

La auditoría confirma una frontera común aproximada de estructura, pero no una
implementación única todavía. Por eso este cambio solo publica el contrato y
mantiene los shells actuales intactos.

### Regiones comunes

`CreativeStudioShellSlots` hace explícitas estas regiones:

| Región | Responsabilidad |
| --- | --- |
| `platformHeader` | Identidad y acciones globales de VitaBlue OS |
| `suiteNavigation` | Navegación de la suite y módulos |
| `moduleHeader` | Breadcrumbs, título y estado del documento |
| `toolRail` | Herramientas principales del editor |
| `resourcePanel` | Recursos contextuales y biblioteca |
| `toolbar` | Acciones del contexto de edición |
| `stage` | Lienzo o viewport principal; es la única región requerida |
| `inspector` | Propiedades de la selección |
| `layersPanel` | Árbol de capas y acciones de organización |
| `bottomWorkspace` | Workspace inferior, como timeline o strip |
| `overlays` | Modales, menús y estados superpuestos |

Los slots aceptan un `ReactNode` o una función que recibe el estado,
interacción y extensión de dominio. Esto permite componer sin que el contrato
común conozca Konva, DOM, Remotion, carruseles o timeline.

### Estado y ownership

El ciclo común es `saved`, `saving`, `error`, `offline` y `rendering`.
`error` puede incluir código, mensaje y si admite retry. El estado legacy
`unsaved` no se duplica: durante una migración debe expresarse mediante el
estado del consumidor hasta que se acuerde un mapping de producto.

El ownership de visibilidad de paneles, foco y shortcuts es opcional y por
defecto permanece en el consumidor. El contrato solo define el shape de esas
señales y callbacks; no instala listeners globales ni cambia la interacción
existente.

### Extensiones de dominio

- **Image Studio:** `slide-strip`, `preview`, `crop` y `export`, con slots
  específicos para cada extensión.
- **Video Studio:** `scenes`, `timeline`, `transport`, `audio` y `remotion`,
  con slots específicos para cada extensión.

Las extensiones son discriminadas por `domain` y no añaden lógica específica al
shell común. Esta fase no migra `StudioWorkspaceShell`, `BackofficeShell`,
`SuiteShell` ni consumidores de Video Studio; esos trabajos quedan para fases
posteriores.

### Responsive y accesibilidad

El contrato declara como requisitos futuros mobile-first, targets táctiles
mínimos de 44px, regiones etiquetadas, foco visible, navegación por teclado y
`aria-live` para estados. La implementación responsive/a11y completa y la
validación visual quedan pendientes.
