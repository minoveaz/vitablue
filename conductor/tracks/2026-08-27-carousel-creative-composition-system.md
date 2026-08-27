# Track: Carousel Creative Composition System

**Fecha:** 2026-08-27  
**Estado:** Pausado temporalmente — priorizar persistencia de Creative Studio  
**Rama:** `feat/carousel-creative-composition`  
**Áreas:** `[marketing-studio, image-studio, carousel, templates, ux, visual-design]`

---

## Nota de priorización

La evolución visual del carrusel queda pausada para priorizar una base de
persistencia compartida para Marketing Studio / Creative Studio. Al reanudar
este track, sus proyectos deberán consumir el modelo persistente definido en
`2026-08-27-marketing-creative-studio-persistence.md`.

## 1. Objetivo

Llevar los carruseles de VitaBlue desde un lienzo panorámico funcional a un
sistema editorial de composición visual capaz de producir piezas coherentes,
profesionales y listas para publicar en Instagram, LinkedIn, TikTok, Facebook y
X.

El objetivo no es añadir más controles aislados, sino ofrecer una experiencia
guiada de dirección de arte: una plantilla define la narrativa, la jerarquía,
los recursos visuales, los espacios seguros y las reglas de composición, y el
usuario puede personalizar el contenido sin romper el diseño.

Las referencias visuales de esta fase incluyen:

- Composiciones panorámicas con elementos que cruzan varias diapositivas.
- Mockups de móvil para previsualización, excluidos de la exportación.
- Formas orgánicas, máscaras, fotografías circulares y fondos editoriales.
- Jerarquías tipográficas y slides con roles narrativos diferenciados.
- Flechas, conectores y patrones que refuerzan la continuidad entre slides.

---

## 2. Principios de diseño

1. **Narrativa antes que controles:** cada slide debe tener un propósito
   editorial claro: portada, contexto, problema, beneficios, prueba,
   comparativa o llamada a la acción.
2. **Continuidad controlada:** fondos, formas, imágenes y conectores pueden
   atravesar divisiones, pero nunca deben comprometer la legibilidad de un
   slide individual.
3. **Edición segura:** modificar copy, imágenes o colores debe respetar
   constraints, safe zones, contraste y límites del layout.
4. **Preview fiel:** el simulador debe mostrar la experiencia real de consumo
   en móvil; los mockups y overlays nunca se incluyen en los archivos exportados.
5. **Sistema de marca:** las composiciones deben usar tokens semánticos de
   VitaBlue y permitir variantes de campaña sin introducir estilos arbitrarios.
6. **Mobile first:** la composición debe ser legible desde 375px y adaptarse a
   escritorio sin depender de anchos fijos en la interfaz.

---

## 3. Alcance funcional

### 3.1 Catálogo de layouts editoriales

- Crear layouts reutilizables para 3, 5 y 7 slides.
- Definir roles por slide y una estructura narrativa editable.
- Incluir variantes educativas, comparativas, testimoniales y de conversión.
- Mostrar preview realista antes de crear el proyecto.
- Mantener layouts independientes de una marca concreta y aplicar Brand Kit
  mediante tokens.

### 3.2 Motor de composición

- Añadir constraints para márgenes, columnas, alineación y safe zones.
- Permitir elementos continuos entre slides mediante grupos y anclajes.
- Crear regiones de contenido para título, cuerpo, badge, imagen y CTA.
- Ajustar automáticamente texto largo, tamaño y espaciado sin solapamientos.
- Preservar la composición al cambiar formato o número de slides.

### 3.3 Recursos visuales

- Máscaras circulares, orgánicas, squircle, hexágono y formas personalizadas.
- Focal point y object-fit para imágenes.
- Capas decorativas con curvas, blobs, marcos, patrones y conectores.
- Biblioteca de combinaciones tipográficas y estilos editoriales.
- Componentes reutilizables de portada, comparativa, métrica, testimonio y CTA.

### 3.4 Navegación y edición por slide

- Barra inferior con miniaturas y roles narrativos.
- Reordenar y duplicar slides mediante drag-and-drop.
- Cambiar el layout de un slide sin perder su contenido compatible.
- Editar un slide en focus mode y volver a la vista panorámica.
- Mostrar qué elementos son continuos y cuáles pertenecen a un único slide.

### 3.5 Preview y exportación

- Mockups de móvil para Instagram, TikTok y LinkedIn.
- Preview de swipe con paginador, safe zones y estados de interfaz.
- Exportación individual, ZIP, PDF y panorámica con nombres estables.
- Validación visual de cortes, sangrías, márgenes y elementos fuera de safe zone.
- Excluir overlays, mockups, guías y controles del resultado exportado.

---

## 4. Fases de implementación

### Fase 1 — Contratos y layouts de referencia

- [x] Definir `CarouselLayout`, `CarouselSlideLayout` y `CarouselElementSlot`.
- [x] Definir roles narrativos y reglas de compatibilidad por plataforma.
- [x] Crear una plantilla de referencia de 5 slides con identidad VitaBlue.
- [x] Registrar layouts en el catálogo con previews y metadatos.

### Fase 2 — Composición guiada

- [x] Implementar regiones, constraints y anclajes entre slides.
- [ ] Añadir máscaras, focal point y elementos decorativos continuos.
- [x] Incorporar auto-fit de texto y validación de overflow.
- [ ] Añadir componentes editoriales de conversión.

### Fase 3 — Edición multi-slide

- [x] Implementar miniaturas, focus mode y navegación por slide en el editor y simulador.
- [x] Añadir reordenación y duplicación de diapositivas a nivel de dominio.
- [x] Permitir cambiar layouts conservando contenido compatible.
- [x] Integrar undo/redo y persistencia para operaciones multi-slide.

### Fase 4 — Preview y variantes

- [x] Mejorar mockups y pieles de Instagram, TikTok y LinkedIn.
- [x] Añadir variantes de layout, color, copy, CTA e imagen.
- [x] Implementar adaptación semántica a `1:1`, `4:5`, `9:16` y `16:9`.
- [x] Mantener una comparación antes/después de la variante.

### Fase 5 — Calidad y publicación

- [ ] Añadir tests de contratos, constraints y composición.
- [ ] Añadir regresión visual móvil y escritorio.
- [ ] Validar cortes pixel-perfect y ausencia de overlays en exportaciones.
- [ ] Probar textos largos, fuentes ausentes, imágenes inválidas y recursos
  grandes.
- [ ] Documentar layouts, scopes, licencias y reglas de uso.

---

## 5. Criterios de aceptación

- Una persona puede crear un carrusel completo partiendo de un layout sin
  reconstruir cada slide desde cero.
- El resultado mantiene continuidad visual sin sacrificar legibilidad
  individual.
- El contenido puede cambiarse sin romper constraints ni safe zones.
- El preview móvil representa correctamente el consumo por swipe.
- Las exportaciones coinciden con el preview y no incluyen elementos de editor.
- Las variantes por plataforma mantienen la jerarquía y el CTA.
- El sistema funciona correctamente en móvil y escritorio.

---

## 6. Límites de esta fase

- No incluye publicación directa en APIs sociales.
- No introduce generación autónoma de JSX ni diseños no validados por el
  sistema de composición.
- No sustituye la persistencia existente ni crea una segunda biblioteca de
  assets.
- La IA podrá proponer copy o variantes en una fase posterior, siempre mediante
  comandos validados y aprobación humana.
