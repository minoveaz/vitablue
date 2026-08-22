# Track: Marketing Studio Modular Suite

**Fecha:** 2026-08-19  
**Estado:** En definición y ejecución  
**Rama:** `feat/remotion-video-studio-engine`  

> **Actualización 2026-08-21 — Roadmap Image Studio**
>
> La Fase 2 original describe el alcance visual inicial, pero no cubre todavía el nivel de
> estabilidad, reutilización y producción necesario para VitaBlue ni para futuros clientes.
> El siguiente roadmap prioriza primero un núcleo fiable y después las capacidades
> profesionales de composición, DAM, IA e integración audiovisual.

### Decisiones de producto — 2026-08-21

- La navegación de Image Studio seguirá un patrón híbrido **Canva + Figma**:
  rail vertical por áreas, drawer contextual para descubrir e insertar recursos e
  inspector técnico para editar propiedades. Las chips serán únicamente filtros
  secundarios.
- El workspace mantendrá un modo oscuro profesional: canvas oscuro neutro, drawer
  ligeramente más claro, inspector más profundo y rail con el tono más oscuro.
  La coherencia de tokens, contraste, estados activos y accesibilidad se revisará
  transversalmente en la fase de calidad.
- Se adopta una taxonomía de 12 áreas: Mis diseños, Plantillas, Elementos, Texto,
  Marca, Medios/Subidos, Capas, Diseño/Layout, Audio, Vídeo, Copys con IA y
  Bloques empresariales/MotionKit.
- Cada área debe documentar propósito, categorías, recursos, metadatos, acciones,
  filtros, preview, integraciones, permisos y estado de implementación.
- El inventario distingue entre áreas de navegación, recursos insertables, bloques
  empresariales y herramientas técnicas del editor.
- La implementación se prioriza como **P0** (Elementos, Texto, Medios, Plantillas
  y Bloques), **P1** (Audio, Vídeo, Layout y Marca), **P2** (Proyectos, DAM,
  permisos y multi-marca) y **P3** (IA, recomendaciones y variantes A/B).
- La Fase 3 de DAM y multi-marca se deja deliberadamente para el final. El orden
  operativo será Fase 4, Fase 5, Fase 6, Fase 7, Fase 8 y, finalmente, Fase 3.
- Antes de implementar nuevas capacidades se hará una auditoría bloque a bloque,
  incluyendo los bloques ya existentes, para separar lo hecho, parcial, demo y
  pendiente. El inventario de referencia se mantiene como artefacto de sesión:
  `image-studio-taxonomy-inventory.md`.
- Image Studio se diseñará como plataforma **multi-organización** y agnóstica de
  sector. El núcleo incluirá capacidades universales (formas, iconos, texto,
  medios, capas, layout, plantillas, variantes, exportación y permisos), mientras
  que cada organización aportará su Brand Hub, recursos, MotionKit, plantillas,
  campañas y reglas legales.
- Ningún contrato universal podrá asumir seguros, visados, aseguradoras u otra
  terminología específica de VitaBlue. Esos elementos se registrarán como
  paquetes de organización.
- Todo recurso reutilizable deberá contemplar como mínimo `kind`, `category`,
  `scope` (`system`, `organization`, `workspace` o `user`), `organizationId`,
  `brandId`, `tags`, `license`, `editableFields`, `lockedFields`,
  `supportedFormats` y `version`.
- La Fase 4 definirá contratos configurables de bloques y recursos, separando
  campos editables y bloqueados, variantes y reglas por organización. La Fase 3
  aportará posteriormente la persistencia multi-organización, workspaces,
  permisos, búsqueda y versionado en Supabase.
- El drawer de Elementos tendrá búsqueda fija, recientes, recomendados, categorías
  visuales y un selector de origen (`system`, `organization`, `workspace`, `user`).
  Las chips serán filtros secundarios, nunca navegación principal.
- El catálogo P0 universal de Elementos cubrirá formas/líneas, iconos/símbolos,
  marcos/máscaras, ilustraciones, fondos/superficies, badges/etiquetas,
  botones/CTAs, componentes reutilizables, elementos guardados y, como P1,
  gráficos/datos.
- Cada tarjeta del drawer mostrará preview, nombre, tipo, scope, licencia,
  compatibilidad Image/Video y estado de aprobación o bloqueo. Las acciones
  estándar serán insertar, editar, reemplazar, guardar y enviar a Video Studio
  cuando corresponda.

---

## 1. Objetivo y Visión del Producto

Evolucionar las herramientas de marketing existentes en una **Suite Modular Empresarial de Marketing (Marketing Studio Suite)** agnóstica, escalable y con capacidad *white-label*. 

El sistema separa estrictamente cuatro responsabilidades:
1. **Definir** quién es la marca y cómo habla (**Brand Hub**).
2. **Almacenar y clasificar** los activos digitales reutilizables (**Asset Manager / DAM**).
3. **Producir y generar** piezas audiovisuales y gráficas de alta conversión (**Creative Studio**).
4. **Distribuir, medir y orquestar** el tráfico publicitario (**Campaign Orchestrator**).

Esta arquitectura garantiza que la generación de contenido en VitaBlue sea un entorno de alta velocidad y, a su vez, una base 100% portable y reutilizable para la plataforma canónica **LoopDev**.

---

## 2. Arquitectura y Topología de los 4 Módulos

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                 MARKETING STUDIO SUITE                                   │
├──────────────────────────┬──────────────────────────┬─────────────────────────┬──────────┤
│ 1. BRAND HUB             │ 2. ASSET MANAGER (DAM)   │ 3. CREATIVE STUDIO      │ 4. CAMPAIGN ORCHESTRATOR
├──────────────────────────┼──────────────────────────┼─────────────────────────┼──────────┤
│ • Identidad de Marca     │ • Biblioteca de Medios   │ • Video Studio (Reels)  │ • Campañas
│ • Perfiles Sociales      │ • Audio & SFX Library    │ • Image Studio (Banners)│ • Links & UTMs (/r/:slug)
│ • Tono & Directrices IA  │ • Catálogo MotionKit     │ • Gemini Copilot (IA)   │ • Conexiones & Webhooks
└──────────────────────────┴──────────────────────────┴─────────────────────────┴──────────┘
```

---

### Módulo 1: 🎨 Brand Hub (Identidad, Voz y Presencia Digital)
> **Misión:** Fuente única de verdad (*Single Source of Truth*) sobre la identidad, arquetipo y canales de la marca.

* **Identidad Visual & Tokens:** Logos vectoriales (variantes claro/oscuro), paleta de colores semántica (`vb-ocean`, `vb-mint`, `vb-gold`, `vb-midnight`), tipografías (Poppins/Inter) y tokens CSS.
* **Perfiles Sociales Oficiales:** Configuración y metadata de cuentas conectadas (Instagram `@vitablue.es`, TikTok, YouTube, LinkedIn, X), biografías oficiales, links en bio y avatares de perfil.
* **Tono, Voz & Directrices IA:** Definición de arquetipos de comunicación, directrices de estilo, restricciones legales y vocabulario aprobado para alimentar a los asistentes de inteligencia artificial.

---

### Módulo 2: 🗄️ Asset Manager / DAM (Biblioteca Central de Activos Digitales)
> **Misión:** Repositorio centralizado para almacenar, organizar, versionar y buscar recursos listos para producción. **En este módulo NO se generan vídeos ni imágenes; únicamente se gestionan y clasifican.**

* **Biblioteca de Medios:** Fotografías oficiales, retratos de asesores en alta resolución, vídeos de stock en bucle (fondos para reels), ilustraciones vectoriales y badges consulares.
* **Biblioteca de Audio & SFX:** Pistas de música clasificadas por BPM, género (Lofi, Corporate, Dynamic Trust) y efectos de sonido (*pops*, *whooshes*, campanas).
* **Catálogo de Componentes Homologados (MotionKit):** Registro y vista previa de componentes visuales aprobados por diseño (`MotionAdvisorCard`, `MotionTrustBadge`, `MotionProviderGrid`, `MotionComparisonCard`).
* **Versionado & White-Label:** Gestión de activos por marca cliente, etiquetas y carpetas.

---

### Módulo 3: ⚡ Creative Studio (La Fábrica de Contenidos)
> **Misión:** Espacio de trabajo interactivo donde los creadores y la IA producen piezas de marketing a partir de los recursos del DAM y la identidad del Brand Hub.

* **🎬 Video Studio (Remotion Engine):**
  * Editor de vídeo para Instagram Reels, TikTok, YouTube Shorts (9:16), posts de Feed (1:1) y YouTube (16:9).
  * Línea de tiempo interactiva con cabezal, atajos (`Cmd+B` para división de clips, `Espacio` para Play/Pause), pistas de audio sincronizadas con atenuación fade-in/out.
  * Interacción directa sobre el lienzo (*on-canvas editing*): arrastre libre, guías inteligentes de centrado, selección de capas y zoom estilo Canva.
  * Motor de renderizado MP4 local mediante Node.js y Puppeteer.
* **🖼️ Image & Banner Studio (Static Engine):**
  * Generador de piezas estáticas: portadas de redes sociales, posts cuadrados 1:1, carruseles de Instagram y banners de Display para Meta Ads y Google Ads (PNG/SVG/WebP).
* **✨ Gemini Creative Copilot (IA Asistente):**
  * Asistente inteligente para generar guiones en 4 actos (Gancho ➔ Problema ➔ Requisitos ➔ Asesoría), ganchos virales (*hooks*), variaciones A/B de copy y estructuración automática de escenas de vídeo.

---

### Módulo 4: 🚀 Campaign Orchestrator (Gestión, Enlaces y Tráfico)
> **Misión:** Conectar las piezas creativas con las campañas de adquisición de tráfico y medir su efectividad comercial.

* **Gestor de Campañas:** Agrupación de anuncios, presupuestos, creatividades asignadas y objetivos de conversión.
* **Link Manager & UTMs (`/r/:slug`):** Generador de enlaces acortados rastreables con parámetros UTM automáticos (para TikTok/Meta Ads) y redirección inteligente.
* **Conexiones & Delivery:** Webhooks, integraciones con redes publicitarias y exportación de paquetes de creatividades para media buyers.

---

## 3. Mapeo del Código Existente

| Archivo / Paquete Actual | Módulo Destino en la Suite | Función Principal |
| :--- | :--- | :--- |
| `marketing-studio/BrandIdentity.tsx` | **1. Brand Hub** | Editor de tokens, logos, tipografías y paleta de colores. |
| `marketing-studio/SocialProfiles.tsx` | **1. Brand Hub** | Editor de perfiles y canales sociales oficiales. |
| `marketing-studio/AssetManagement.tsx` | **2. Asset Manager (DAM)** | Catálogo de activos, tokens white-label y audio library. |
| `packages/video-studio/src/motion-kit/*` | **2. Asset Manager (DAM)** | Biblioteca de componentes de vídeo 1080p homologados. |
| `marketing-studio/SocialGenerator.tsx` <br> `components/creative-editor/*` <br> `packages/video-studio/*` | **3. Creative Studio (Video Studio)** | Editor de vídeo interactivo multicapa, timeline y render MP4. |
| `marketing-studio/utils/svgGenerator.ts` | **3. Creative Studio (Image Studio)** | Generador de portadas de redes y piezas estáticas PNG/SVG. |
| `marketing-studio/Campaigns.tsx` | **4. Campaign Orchestrator** | Estructura de campañas y asignación de creatividades. |
| `marketing-studio/ShortLinks.tsx` <br> `pages/public/MarketingRedirect.tsx` | **4. Campaign Orchestrator** | Acortador de enlaces con UTMs y redirecciones `/r/:slug`. |
| `marketing-studio/Connections.tsx` | **4. Campaign Orchestrator** | Conexiones externas, webhooks y exportación. |

---

## 4. Fases de Desarrollo

### Fase 1 - Reorganización de Navegación y Shell Modular
- [x] Actualizar la estructura de navegación en `BackofficeShell.tsx` agrupando los módulos bajo los 4 pilares:
  - *1. Brand Hub* (`Identidad de marca`, `Perfiles sociales`)
  - *2. Asset Manager (DAM)* (`Biblioteca & MotionKit`)
  - *3. Creative Studio* (`Video Studio (Reels & Ads)`)
  - *4. Campaign Orchestrator* (`Gestión de campañas`, `Enlaces y UTMs`, `Conexiones API`)
- [x] Mantener compatibilidad total mediante redirecciones de rutas en `App.tsx` y `config/routes.ts`.
- [x] Actualizar `MarketingStudioShell.tsx` con resolución automática de pilares, breadcrumbs y badges de contexto.

### Fase 2 - Creative Studio: Editor de Assets Visuales & Gráficos (Image & Graphic Studio)
- [x] **Stack Tecnológico:**
  - **Lienzo React + Tailwind (WYSIWYG):** Renderizado en vivo usando componentes React puros y tokens semánticos de marca.
  - **Exportación en Cliente (`html-to-image`):** Generación instantánea en navegador a PNG / WebP en 1080p nativo sin dependencias de servidor.
  - **Integración con Remotion Still / Video:** Mismo contrato de componentes consumible por Remotion (`<Still />` o escenas de vídeo).
- [x] **Estructura de Interfaz (Inspirada en Canva):**
  - **Top Bar:** Botón volver, título editable, selector de presets / *Magic Resize* (4:5 Post Instagram, 1:1 Cuadrado, 9:16 Story/Reel, 16:9 Landscape, Portadas), botón *Guardar en DAM*, *Enviar a Video Studio* y *Descargar PNG*.
  - **Left Rail + Drawer:** Pestañas para Plantillas, Bloques Visuales (MotionKit), Texto, Brand Kit (Tokens/Logos) y Fotos/Medios.
  - **Lienzo Central (`ImageStage`):** Arrastre libre (*drag & drop*), selección con *bounding box*, guías magnéticas de centrado y controles de zoom (`Fit`, `50%`, `75%`, `100%`).
  - **Barra Flotante de Acciones Rápidas:** Color, tipografía, vidrio (*glassmorphism*), alineación, Z-Index, duplicar y eliminar.
  - **Right Context Inspector (`ImageContextInspector`):** Formulario dinámico para el bloque seleccionado (foto de asesor, citas, sellos, comparativas).
- [x] Editor visual interactivo para los bloques gráficos clave:
  - **Tarjeta de Asesor:** Selector de foto/avatar, badge de estado en vivo, mensaje personalizado y botón WhatsApp con resplandor.
  - **Sellos de Garantía Consular & Trust:** Badges de certificación, checks oficiales y textos de validez.
  - **Parrilla de Aseguradoras:** Selector de compañías oficiales (Sanitas, Adeslas, Asisa, DKV) y etiquetas de cobertura.
  - **Comparativa Visual (Antes vs Después):** Contraste ❌ vs ✅ con opciones personalizadas.
  - **Gancho Titular & Alerta:** Titular de alto impacto con badge de advertencia.
- [x] Motor de exportación directa en alta resolución:
  - Descarga instantánea en **PNG**, **JPEG** y **SVG** a 1080p para publicación directa en redes.
- [x] Guardado directo como **Activo Reutilizable en Asset DAM** y botón "A Video Studio" para consumirlo en vídeos.
- [x] Navegación unificada entre *Video Studio (Reels)* e *Image Studio (Canva)* con un solo clic.

### Roadmap recomendado para llevar Image Studio a nivel profesional

#### Fase 1 — Estabilizar el núcleo del editor
- [x] Asegurar que las operaciones de edición persistentes (posición múltiple, escala, tamaño, rotación y opacidad) entren en el historial de undo/redo.
- [x] Consolidar el modelo runtime de capas y grupos a partir de contratos explícitos para geometría, estilos y contenido mediante utilidades compartidas de modelo, agrupación y expansión.
- [x] Auditar los drawers y el inspector de Image Studio: se ha extraído el chrome común de secciones a `EditorPanelSection` y se han eliminado cabeceras repetidas en los paneles revisados.
- [x] Separar cambios transitorios de interacción (drag/resize) de cambios confirmados para evitar historiales ruidosos.
- [x] Añadir autosave recuperable, estado de guardado y recuperación ante errores mediante snapshot de recuperación en `localStorage`.
- [x] Validar límites, solapamientos, capas fuera del canvas y datos incompletos.
- [x] Añadir pruebas unitarias del motor de transformaciones, agrupación, historial y persistencia; la suite de Image Studio cubre 20 casos.

#### Fase 2 — Sistema de diseño profesional
- [x] Reglas, guías, columnas, márgenes y safe zones por plataforma.
- [x] Auto-layout, ajuste inteligente de texto, máscaras, recorte y focal point.
- [x] Reemplazo de contenido sin romper la composición.
- [x] Variantes de color, estilo y componentes bloqueables.

#### P0 — Catálogo universal de Elementos (completado 2026-08-21)
- [x] Contrato tipado y normalización retrocompatible para presets y elementos guardados: tipo, categoría, scope, licencia, formatos, aprobación, bloqueo y versionado.
- [x] Separación explícita entre primitivas universales de sistema y recursos del paquete de organización VitaBlue, sin persistencia Supabase.
- [x] Drawer híbrido Canva + Figma con búsqueda fija, recientes, recomendados, categorías visuales, selector de origen y chips únicamente como filtros secundarios.
- [x] Catálogo real de marcos y máscaras vectoriales, con recursos insertables y previews resistentes a recursos desconocidos.
- [x] Biblioteca universal ampliada a 58 iconos y símbolos agnósticos de sector, sin IDs de organización o marca.
- [x] Formas y conectores completos: curvas, arcos, conectores angulares y curvos, polígonos y estrellas paramétricos, blobs, corchetes y separadores decorativos.
- [x] Renderer gráfico compartido entre previews del drawer y capas geométricas del canvas, con fallback explícito.
- [x] Taxonomía P0 completa y tarjetas con preview, nombre, tipo, scope, licencia, compatibilidad Image/Video, estado e inserción estándar.
- [x] Pruebas focalizadas de metadatos y renderizado de cada recurso, taxonomía, normalización, filtros y aislamiento multi-organización; typecheck y lint validados.

#### P1 — Audio, Vídeo, Layout y Marca (siguiente fase)
Estado actual:
- [x] Existe un drawer de Medios con inserción de imágenes, fotos de stock, asesoras y fondos.
- [x] Existe un puente inicial hacia Video Studio/Remotion y un editor de vídeo con timeline, transporte y zonas seguras.
- [x] Existe un drawer de Layout con guías, safe zones, columnas, auto-layout, ajuste de texto y variantes.
- [x] Existe un Brand Kit con logos, colores, gradientes y destacados de Instagram.
- [x] El editor conserva composición al reemplazar imágenes y permite focal point, recorte y object-fit.

Pendiente para cerrar P1:
- [ ] Convertir Audio en una biblioteca funcional con preview, duración, licencia, búsqueda, favoritos e inserción en timeline.
- [ ] Completar Vídeo con selección de clips, preview reproducible, trim, duración, transiciones y sincronización de audio.
- [ ] Unificar Layout como sistema de constraints reutilizable entre formatos, no solo acciones puntuales del drawer.
- [ ] Convertir Brand Kit en tokens aplicables globalmente, con validación de contraste, fuentes, logos protegidos y estados de aprobación.
- [ ] Conectar Medios, Marca y Vídeo con scopes, reemplazo seguro, undo/redo y persistencia del proyecto.
- [ ] Añadir pruebas de interacción y regresión visual para los cuatro módulos en móvil y escritorio.

#### Fase 3 — DAM real y multi-marca
- [ ] Persistir proyectos, plantillas, assets y elementos reutilizables en Supabase.
- [ ] Incorporar versiones, carpetas, etiquetas, búsqueda, workspaces y permisos.
- [ ] Mantener `localStorage` únicamente como caché offline o fallback temporal.

#### Cierre del track — Bibliotecas de Elementos y Texto
- [ ] Auditar y ampliar las bibliotecas Universal y Empresa de Elementos y Texto,
  manteniendo scopes, categorías visuales, previews, licencias y colores neutros
  para recursos universales.
- [ ] Incorporar librerías externas seleccionadas (tipografías, iconos, patrones e
  ilustraciones) con assets locales, metadatos de licencia y fallback seguro.
- [ ] Ampliar Medios al finalizar el track con Pexels (fotos/vídeos), Pixabay
  (fotos, vídeos, ilustraciones y audio), Openverse/Wikimedia (recursos abiertos),
  Coverr/Mixkit (clips) y colecciones gráficas como unDraw, Storyset y Hero
  Patterns; separar claramente Universal, Empresa y Míos.
- [ ] Registrar por recurso la fuente, autor, licencia, fecha de captura,
  restricciones de uso y política de caché antes de permitir su inserción.
- [ ] Validar la experiencia completa de navegación e inserción en móvil y
  escritorio, incluyendo búsqueda, filtros, recientes, favoritos y estados vacíos.

#### Fase 4 — Plantillas y bloques empresariales
- [ ] Definir contratos tipados de bloques con campos editables, bloqueados y variantes por formato.
- [ ] Añadir validación de branding, textos legales y compatibilidad con Brand Hub.
- [ ] Versionar y previsualizar componentes reutilizables.

#### Fase 5 — Smart Resize y variantes de campaña
- [ ] Reorganizar composiciones según reglas semánticas, no solo escalar píxeles.
- [ ] Generar variantes 1:1, 4:5, 9:16 y 16:9 sin solapamientos.
- [ ] Crear variantes A/B de copy, imagen, CTA y color.
- [ ] Exportar paquetes completos de campaña.

#### Fase 6 — IA creativa especializada
- [ ] Convertir briefs en composiciones basadas en plantillas y bloques aprobados.
- [ ] Generar hooks, copys, variantes y adaptaciones por plataforma.
- [ ] Revisar legibilidad, contraste, branding y exceso de texto.
- [ ] Recomendar assets disponibles en el DAM.

#### Fase 7 — Integración con Video Studio
- [ ] Insertar diseños y bloques de Image Studio en escenas con un clic.
- [ ] Adaptar automáticamente el aspect ratio y conservar la referencia al asset original.
- [ ] Permitir edición limitada a campos aprobados en vídeo.

#### Fase 8 — Producción y calidad
- [ ] Completar pruebas unitarias, visuales, de exportación, persistencia y permisos.
- [ ] Probar textos largos, fuentes ausentes, imágenes inválidas y assets de gran tamaño.
- [ ] Medir rendimiento y reforzar límites de seguridad para uploads.

### Fase 3 - Creative Studio: Consumo de Assets en Video Studio (Remotion)
- [ ] Permitir insertar los bloques visuales editados directamente en cualquier escena del Video Generator con 1 solo clic.
- [ ] Adaptación automática del bloque al aspect ratio de la escena de vídeo activa.
- [ ] Formulario ultraligero en el inspector de vídeo (solo modificar textos, sin tocar maquetación ni estilos).

### Fase 4 - Consolidación de Brand Hub (Identidad, Perfiles y Tono IA)
- [ ] Unificar la gestión de Identidad Visual y Perfiles Sociales en una experiencia fluida.
- [ ] Añadir panel de configuración de Tono & Voz para alimentar las directrices del Asistente IA.

### Fase 5 - Gemini Creative Copilot (Asistente IA)
- [ ] Contrato tipado `VideoAssistant` para generación de guiones a partir de un brief o temática.
- [ ] Generación automática de ganchos (*hooks*) de alta retención para Reels y TikTok.
- [ ] Estructuración de proyectos de vídeo en 4 escenas con capas y componentes de MotionKit pre-configurados.

### Fase 6 - Campaign Orchestrator & Portabilidad canónica a LoopDev
- [ ] Conexión fluida entre las piezas generadas en Creative Studio y los enlaces UTM de Campaign Orchestrator.
- [ ] Extracción limpia de paquetes agnósticos (`@loopdev/video-engine`, `@loopdev/brand-hub`) para integración canónica en LoopDev.

---

## 5. Criterios de Aceptación

1. **Claridad de Separación:** Cada vista del Backoffice pertenece a uno y solo uno de los 4 módulos funcionales.
2. **Eficiencia Creativa:** El tiempo para producir un Reel publicitario completo a partir de un brief o plantilla no supera los 3 minutos.
3. **Cero Fricción de Diseño:** En Video Studio no se maquetan cajas desde cero; se insertan bloques visuales homologados de MotionKit con edición exclusiva de texto.
4. **Portabilidad Total:** El núcleo de renderizado y el catálogo de activos no contienen acoplamientos rígidos con la base de datos de VitaBlue, permitiendo su exportación directa a LoopDev.
