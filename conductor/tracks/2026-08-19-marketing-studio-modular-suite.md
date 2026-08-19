# Track: Marketing Studio Modular Suite

**Fecha:** 2026-08-19  
**Estado:** En definición y ejecución  
**Rama:** `feat/remotion-video-studio-engine`  

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

### Fase 2 - Consolidación de Brand Hub
- [ ] Unificar la gestión de Identidad Visual y Perfiles Sociales en una experiencia fluida.
- [ ] Añadir panel de configuración de Tono & Voz para alimentar las directrices del Asistente IA.

### Fase 3 - Consolidación de Asset Manager / DAM
- [ ] Catálogo completo de componentes MotionKit con previsualización en dispositivo móvil (9:16, 1:1, 16:9).
- [ ] Soporte para descarga de snapshots estáticos (PNG) directamente desde el DAM.
- [ ] Organización de biblioteca de audios y pistas con etiquetas de búsqueda.

### Fase 4 - Creative Studio: Inserción de Bloques Visuales "Ready-to-Use"
- [ ] Permitir insertar bloques visuales completos (Asesora, Checks de requisitos, Comparativas) con 1 clic en el Video Generator.
- [ ] Formularios de edición ultraligeros en el inspector (solo modificar textos/copies, sin alterar layouts ni maquetación).
- [ ] Sincronización multi-resolución en caliente (9:16, 1:1, 16:9).

### Fase 5 - Gemini Creative Copilot (Asistente IA)
- [ ] Contrato tipado `VideoAssistant` para generación de guiones a partir de un brief o temática.
- [ ] Generación automática de ganchos (*hooks*) de alta retención para Reels y TikTok.
- [ ] Estructuración de proyectos de vídeo en 4 escenas con capas y componentes de MotionKit pre-configurados.

### Fase 6 - Campaign Orchestrator & Portabilidad a LoopDev
- [ ] Conexión fluida entre las piezas generadas en Creative Studio y los enlaces UTM de Campaign Orchestrator.
- [ ] Extracción limpia de paquetes agnósticos (`@loopdev/video-engine`, `@loopdev/brand-hub`) para integración canónica en LoopDev.

---

## 5. Criterios de Aceptación

1. **Claridad de Separación:** Cada vista del Backoffice pertenece a uno y solo uno de los 4 módulos funcionales.
2. **Eficiencia Creativa:** El tiempo para producir un Reel publicitario completo a partir de un brief o plantilla no supera los 3 minutos.
3. **Cero Fricción de Diseño:** En Video Studio no se maquetan cajas desde cero; se insertan bloques visuales homologados de MotionKit con edición exclusiva de texto.
4. **Portabilidad Total:** El núcleo de renderizado y el catálogo de activos no contienen acoplamientos rígidos con la base de datos de VitaBlue, permitiendo su exportación directa a LoopDev.
