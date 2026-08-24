# Track: Image Studio Multi-Platform Carousel Builder (Instagram, TikTok, LinkedIn, Facebook, X)

**Fecha:** 2026-08-24  
**Estado:** Propuesto / En Revisión  
**Rama:** `feat/image-studio-carousel`  

---

## 📌 1. Visión y Propósito

Extender **Image Studio** con un módulo nativo multiplataforma de alto rendimiento para el diseño, composición continua (*seamless/panoramic*), previsualización interactiva y exportación automatizada en 1-click de **carruseles y publicaciones multi-slide** para las principales redes sociales: **Instagram, TikTok (Photo Mode), LinkedIn (Documentos), Facebook (Feed & Ads) y X (Multi-image)**.

El objetivo es eliminar la fricción de cortar imágenes manualmente con herramientas externas y resolver la continuidad visual entre diapositivas en un único lienzo interactivo adaptado a las safe zones de cada red.

---

## 🎯 2. Decisiones de Producto y Arquitectura de Integración

Este módulo se integra de forma limpia y no intrusiva sobre la arquitectura existente de Image Studio en 5 áreas clave:

1. **Hub y Modales de Creación (`ImageStudioHub` & `ImageCanvasFormatsModal`):**
   - Nueva sección destacada de "Carruseles".
   - Selector interactivo de plataforma (Instagram, TikTok, LinkedIn, Facebook, X) y de número de slides (2 a 10).
   - Creación del proyecto con dimensiones compuestas automáticas `(anchoSlide * numSlides) x altoSlide` y modo `isCarousel: true`.

2. **Lienzo Panorámico Continuo (`ImageStage` & `KonvaStage`):**
   - Formato panorámico continuo a `0px` de separación entre diapositivas para permitir que fondos, vectores e imágenes IA fluyan entre slides.
   - Capa de guías sutiles divisorias con badges flotantes superiores no imprimibles (`Slide 1: Portada`, `Slide 2`, ..., `Slide N: CTA`).
   - Botón flotante al final del lienzo `[+ Añadir Diapositiva]` para extender el carrusel en caliente.
   - Snap magnético automático a los bordes y centros de cada slide individual.

3. **Safe Zones y Overlays Reales Multiplataforma (`ImageStage` Guides):**
   - **Instagram Overlay:** Botones de acción (Like, Comentar, Guardar), paginador de puntos y zona de recorte de perfil `1:1` en el Slide 1.
   - **TikTok Photo Mode Overlay:** Zona de seguridad crítica para evitar que el texto quede tapado por los botones laterales derechos (Like, Comentarios, Guardar, Compartir) y la caja inferior de título/descripción/audio.
   - **LinkedIn Overlay:** Barra superior de navegación de documento y botones de pantalla completa.

4. **Barra Superior y Simulador Móvil Interactivo (`ImageEditorToolbar` & `CarouselMobileSimulator`):**
   - Selector de Diapositiva Activa / Focus Mode: botones rápidos en la toolbar para hacer auto-scroll y zoom centrado en un slide específico.
   - Botón *"Vista Previa Carrusel"*: Modal interactivo con marco de smartphone que permite arrastrar y hacer **swipe táctil/ratón** con física suave entre diapositivas reales.
   - Switcher de interfaz dentro del simulador para alternar la visualización en piel de Instagram, TikTok o LinkedIn.

5. **Inspector y Motor de Exportación en 1-Click (`ImageStudioInspector` & `carouselExporter.ts`):**
   - **Pack ZIP (Instagram, TikTok, Facebook, X):** Corta el canvas automáticamente en `slide_01.png`, `slide_02.png`, etc., a 300 DPI en alta calidad empaquetado en ZIP.
   - **PDF Multi-Página (LinkedIn):** Compila los slides como páginas secuenciales en un archivo PDF paginado listo para LinkedIn.
   - **Tira Panorámica Completa:** Exportación de la tira continua en una sola imagen PNG de alta resolución.

6. **Drawer de Plantillas (`ImageStudioTemplatesDrawer`):**
   - Filtro/Categoría "Carruseles" con templates prediseñados de marca (Ocean Teal, Amber Gold, Midnight Blue, Mint Green).

---

## 🏗️ 3. Fases de Ejecución

### Fase 1: Modelo de Datos, Presets Multiplataforma y Configuración
- [x] Extender `marketing-studio/types/imageStudio.ts` con tipos de carrusel (`CarouselConfig`, `CarouselPlatformPreset`, `CarouselSlideRole`, `CarouselExportFormat`).
- [x] Registrar presets de carrusel en `IMAGE_FORMAT_PRESETS` (Instagram 4:5, Instagram 1:1, TikTok 9:16 Photo Mode, LinkedIn 4:5, X 1:1).
- [x] Añadir configuración de número de slides (2 a 10) y metadatos de roles (*Hook/Portada*, *Content/Cuerpo*, *CTA/Cierre*).
- [x] Añadir perfiles de Safe Zones para carruseles en `imageDesignSystem.ts` (`instagram-carousel`, `tiktok-photo`, `linkedin-document`).

### Fase 2: Lienzo Panorámico y Sistema de Guías & Safe Zones
- [x] Soporte en el Canvas Engine para renderizado de ancho compuesto `(width * slideCount)`.
- [x] Renderizado de líneas divisorias entre slides con badges de posición (`Slide 1: Portada`...).
- [x] Marcadores visuales de corte entre diapositivas en `ImageStage` y `KonvaStage`.
- [x] Sistema de Safe Zones conmutables por plataforma:
  - [x] Instagram Feed + Recorte Perfil 1:1 en Slide 1.
  - [x] TikTok Photo Mode UI (sidebar derecho + bottom info).
  - [x] LinkedIn Reader Safe Area.
- [x] Snap magnético al arrastrar elementos a los bordes y centros de cada slide individual (`useKonvaSnapping.ts`).

### Fase 3: Simulador de Swipe Móvil Multiplataforma (Mobile Preview)
- [x] Crear el componente `CarouselMobileSimulator.tsx` en `marketing-studio/components/image-editor/`.
- [x] Implementar gestos táctiles y de ratón (arrastre horizontal, transiciones suaves y paginador).
- [x] Switcher de interfaz en el simulador (Instagram UI / TikTok UI / LinkedIn UI).
- [x] Botón de acceso directo en `ImageEditorToolbar.tsx` (*"Vista Previa Móvil"*).
- [x] Integración de estado y modal en `ImageStudio.tsx`.

### Fase 4: Motor de Exportación Multi-Slide (ZIP / PDF / Tira)
- [ ] Crear la utilidad de corte y compresión `marketing-studio/utils/carouselExporter.ts`.
- [ ] Integración de exportación ZIP con nombres secuenciales (`slide_01.png`...) a resolución nativa.
- [ ] Integración de exportación PDF multi-página para LinkedIn.
- [ ] Añadir modal de opciones de descarga específico para carruseles en `ImageStudioInspector.tsx`.

### Fase 5: Plantillas de Marca y Puntos de Entrada
- [ ] Añadir selector de "Crear Carrusel" en el Hub y en `ImageCanvasFormatsModal` con selector de plataforma y número de slides.
- [ ] Añadir sección de Carruseles en `ImageStudioTemplatesDrawer.tsx`.
- [ ] Crear plantillas base de carrusel con la identidad de marca (Ocean Teal, Amber Gold, Midnight Blue, Mint Green):
  - *Instagram / LinkedIn Educativo / How-To (5 slides - 4:5)*
  - *TikTok Viral Photo Mode / Guía Rápida (5 slides - 9:16)*
  - *Comparativa / Mitos vs Realidades (4 slides - 4:5 / 1:1)*
  - *Storytelling / CTA Conversión (5 slides - 4:5)*

---

## 🧪 4. Plan de Validación y Calidad

- **Pruebas de Responsive y Render:** Verificar que el canvas panorámico permita zoom out fluido y scroll horizontal para todos los formatos (incluyendo TikTok 9:16 panorámico).
- **Validación de Safe Zones:** Confirmar que los elementos en TikTok y portada de Instagram no queden solapados por las interfaces nativas.
- **Validación de Cortes:** Confirmar que al descargar el ZIP, las imágenes unidas encajen píxel a píxel sin líneas blancas ni desfases.
- **Validación de Swipe:** Probar la suavidad y límites de deslizamiento en el simulador móvil en los tres modos de plataforma.
- **Compilación Limpia:** Ejecutar `npm run build` para garantizar cero errores de TypeScript y empaquetado.
