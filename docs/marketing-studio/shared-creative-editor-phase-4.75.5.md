# Fase 4.75.5 — Responsive y accesibilidad P0

## Alcance

Esta fase endurece el shell compartido y los consumidores actuales de Image
Studio y Video Studio para tablet y escritorio. El editor completo se mantiene
fuera de móvil: en viewports menores a `md` se muestra un estado seguro,
explícito y accesible, sin intentar comprimir el workspace ni introducir un
bottom-sheet incompleto.

## Implementado

- Layout fluido en shell, rail, paneles, inspector, stage y workspace inferior;
  los paneles respetan `min-w-0` y el timeline permite desplazamiento horizontal
  cuando el contenido lo requiere.
- Guard móvil compartido mediante `mobileSafeMode`, con mensajes específicos
  por studio y sin controles editoriales rotos.
- Regiones semánticas para shell, canvas/stage, toolbar, inspector,
  biblioteca, timeline y pistas.
- Labels, estados `aria-pressed`/`aria-selected`, foco visible y activación por
  teclado para escenas, capas, overlays, transporte, zoom/pan y controles de
  icono bajo ownership de estas superficies.
- Regla temporal navegable como slider (`ArrowLeft`, `ArrowRight`, `Home`,
  `End`); selección de escenas y capas con teclado.
- Targets mínimos de 44px en primitives y controles modificados.
- `LiveStatus` conserva los errores visibles y anuncia errores de forma
  asertiva por defecto; guardado y render usan regiones vivas.
- Fondos nuevos sustituidos por tokens semánticos del sistema visual.

## Límites explícitos

- No se migraron completamente los editores a todas las primitives ni se
  construyó una UX de edición móvil.
- No se añadieron roles artificiales a componentes cuyo modelo de interacción
  todavía pertenece al consumidor.
- La equivalencia Konva/DOM y la disponibilidad de Video Studio fuera de
  `DEV` permanecen pendientes para fases posteriores.

## Validación

Se ejecutan `npm run typecheck`, la suite Vitest, `npm run lint` y
`npm run build` como gates de esta fase. Los tests dirigidos de primitives
verifican regiones semánticas, targets táctiles y anuncios de error.

