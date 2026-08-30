# Track: Image Studio Editor Foundations

**Fecha:** 2026-08-30  
**Estado:** Planificado  
**Rama:** `feat/carousel-creative-composition`  
**Áreas:** `[marketing-studio, image-studio, editor, vector, ux, productivity]`

---

## 1. Objetivo

Convertir Image Studio en un editor gráfico sólido y accesible, inspirado en
los patrones de Adobe, Figma y Canva, sin perder la simplicidad necesaria para
crear piezas de marketing rápidamente.

La interfaz debe mostrar controles contextuales según la herramienta y el
elemento seleccionado, priorizar el uso móvil y mantener los contratos actuales
de proyectos, carruseles, marca y persistencia.

## 2. Prioridades

### 2.1 Herramientas de dibujo directo

- Rectángulos, círculos, polígonos y estrellas.
- Líneas, flechas, polilíneas y pluma Bézier.
- Previsualización durante el gesto y cancelación segura.
- Configuración contextual de relleno, trazo y cierre.

### 2.2 Selección y transformación

- Selección individual y múltiple.
- Caja de selección, handles, rotación y duplicación.
- Snapping, alineación y distribución.
- Mantener proporciones y límites del lienzo.

### 2.3 Edición vectorial real

- Edición de nodos y tipos de punto.
- Strokes, joins, caps, degradados y opacidad.
- Máscaras, clipping y operaciones booleanas.
- Validación y persistencia segura de geometrías.

### 2.4 Sistema de capas

- Panel de capas completo con reordenación.
- Agrupación, bloqueo, visibilidad y estados.
- Capas globales de carrusel diferenciadas de las capas por slide.
- Acciones de duplicar, ocultar y localizar en el lienzo.

### 2.5 Layout y composición

- Reglas, grids y guías inteligentes.
- Safe zones y snapping semántico.
- Constraints y comportamiento responsive.
- Auto Layout para grupos y componentes editoriales.

### 2.6 Texto

- Cajas redimensionables y estilos reutilizables.
- Auto-fit, truncado controlado y validación de overflow.
- Texto sobre path.
- Variables de marca y jerarquías tipográficas.

### 2.7 Prototipado y carruseles

- Secuencias, variantes y componentes compartidos.
- Transiciones y estados de interacción cuando aplique.
- Edición consistente entre slides.
- Safe zones específicas por plataforma y formato.

### 2.8 Productividad, exportación y colaboración

- Undo/redo semántico e historial de cambios.
- Atajos, copiar estilos, recientes y favoritos.
- Autosave, versiones y recuperación.
- Exportación fiable de PNG, ZIP, PDF y panorámicas.
- Comentarios y colaboración preparados para una fase posterior.

## 3. Fases de implementación

### Fase 1 — Dibujo y selección

- [ ] Consolidar herramientas de dibujo directo.
- [ ] Implementar selección múltiple y caja de transformación.
- [ ] Añadir snapping, alineación y distribución.

### Fase 2 — Capas y edición vectorial

- [ ] Crear panel de capas contextual.
- [ ] Completar edición de nodos y estilos vectoriales.
- [ ] Añadir máscaras y clipping.

### Fase 3 — Layout y texto

- [ ] Incorporar reglas, grids y guías inteligentes.
- [ ] Implementar constraints y Auto Layout.
- [ ] Completar cajas de texto, auto-fit y estilos.

### Fase 4 — Prototipado y productividad

- [ ] Añadir variantes y componentes compartidos.
- [ ] Consolidar historial, atajos y autosave.
- [ ] Completar exportación y validación de resultados.

### Fase 5 — Calidad

- [ ] Añadir pruebas de contratos y operaciones editoriales.
- [ ] Validar responsive desde 375px.
- [ ] Añadir regresión visual móvil y escritorio.
- [ ] Probar documentos largos, recursos inválidos y recuperación.

## 4. Criterios de aceptación

- Una persona puede dibujar, seleccionar, transformar y editar elementos sin
  abandonar el lienzo.
- El inspector muestra únicamente controles relevantes para la selección actual.
- Las operaciones conservan undo/redo, persistencia y compatibilidad legacy.
- Las composiciones funcionan en formatos individuales y panorámicos.
- El editor es usable desde 375px y mantiene precisión en escritorio.
- Las exportaciones no incluyen guías, overlays ni controles del editor.

## 5. Límites

- No sustituye el motor de composición de carruseles ya completado.
- No introduce generación autónoma de diseños sin validación.
- La colaboración en tiempo real queda preparada conceptualmente, pero se
  implementará cuando exista una necesidad operativa concreta.
