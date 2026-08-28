# Sistema de fondos y capas inferiores para carruseles

## Objetivo

Diseñar e implementar un sistema reutilizable de composición de fondos para
carruseles editoriales. La prioridad es resolver las capas inferiores —fondos,
formas orgánicas, ondas, curvas, máscaras, sombras y continuidad entre
diapositivas— antes de colocar el contenido editable encima.

## Contexto

Las plantillas actuales ya permiten crear carruseles y distribuir contenido,
pero todavía se perciben como bloques independientes. Las referencias muestran
una composición donde el fondo inferior construye ritmo visual, profundidad y
continuidad entre slides.

## Alcance

- Variantes cromáticas VitaBlue:
  - Fondo blanco/cálido.
  - Midnight blue.
  - Ocean teal.
- Composiciones inferiores parametrizables por slide.
- Formas orgánicas, ondas, blobs y curvas continuas.
- Máscaras y recortes para imágenes y mockups.
- Sombras, capas de contraste y profundidad.
- Safe zones para títulos, cuerpos, métricas y CTA.
- Continuidad visual entre slides sin desbordar el lienzo.
- Edición y persistencia de parámetros desde Image Studio.
- Exportación sin overlays, guías ni artefactos de composición.

## Principios de diseño

1. El fondo debe funcionar como sistema, no como decoración aislada.
2. Las curvas y formas deben poder continuar de una diapositiva a la siguiente.
3. El contraste debe mantenerse en las tres variantes cromáticas.
4. Las capas inferiores no deben impedir editar o seleccionar el contenido.
5. La composición debe conservarse al cambiar formato y número de slides.
6. Los valores deben usar tokens semánticos y evitar colores arbitrarios en UI.

## Decisión de experiencia de usuario

El usuario no dibuja curvas ni configura coordenadas manualmente. Selecciona
una plantilla base y una variante cromática —blanco, midnight blue u ocean
teal— y el sistema genera automáticamente las capas inferiores, las formas y
la continuidad entre slides. Después puede añadir, mover, editar, duplicar o
eliminar libremente los componentes de contenido desde el canvas. La
regeneración afecta únicamente al fondo y nunca debe sobrescribir textos,
imágenes, métricas o CTA existentes.

El panel expone solo controles de alto nivel: intensidad, color secundario,
tipo de forma, continuidad, altura, escala y posición vertical. Las
coordenadas, trayectorias y reglas internas permanecen encapsuladas en el
motor de composición.

## Fases

### Fase 1 — Contratos y exploración visual

- [x] Definir `CarouselBackgroundComposition` y sus variantes.
- [x] Definir tipos de forma, trayectoria, máscara, sombra y continuidad.
- [x] Documentar safe zones y reglas de contraste por variante.
- [x] Crear una composición piloto para un carrusel de 5 slides.

### Fase 2 — Motor de composición

- [x] Implementar resolución de formas por slide y posición panorámica.
- [x] Implementar curvas/ondas continuas entre límites de slide.
- [x] Añadir máscaras, focal points y recortes no destructivos.
- [x] Validar overflow, safe zones y z-index de capas inferiores.
- [x] Mantener compatibilidad con proyectos legacy.

### Fase 3 — Integración visual

- [x] Integrar las composiciones en las plantillas blanco, midnight y ocean.
- [x] Añadir controles simples de variante, intensidad, escala y continuidad.
- [x] Mostrar preview de fondos sin contenido y con contenido real.
- [x] Permitir regenerar la base sin perder capas editables.

### Fase 4 — Calidad y exportación

- [x] Añadir tests de contratos, geometría y continuidad.
- [x] Validar formatos `1:1`, `4:5`, `9:16` y `16:9`.
- [x] Comprobar cortes pixel-perfect entre slides.
- [x] Verificar exportación PNG, ZIP, PDF y panorama.
- [ ] Añadir regresión visual móvil y escritorio.
- [x] Documentar tokens, licencias y reglas de uso.

## Criterios de aceptación

- Las tres variantes cromáticas tienen una base visual editorial coherente.
- Las formas inferiores se perciben como una composición continua.
- Ninguna capa estructural invade otra slide ni las safe zones críticas.
- El usuario puede editar el contenido sin quedar bloqueado por el fondo.
- El usuario puede regenerar el fondo sin perder los componentes manuales.
- Cambiar de layout, formato o número de slides conserva la intención visual.
- Las exportaciones no contienen guías, overlays ni artefactos del editor.
- Los tests y validaciones visuales cubren los casos principales.

## Fuera de alcance inicial

- Generación automática de ilustraciones mediante servicios externos.
- Animación avanzada o vídeo.
- Sustitución completa del motor de renderizado existente.
- Edición vectorial libre comparable a Figma.
