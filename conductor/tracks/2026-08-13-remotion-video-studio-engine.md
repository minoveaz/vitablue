# Track: VitaBlue Social Video Studio

**Fecha:** 2026-08-13
**Estado:** En definición
**Rama:** `feat/remotion-video-studio-engine`

## 1. Objetivo

Crear un estudio de generación de vídeo para redes sociales que permita producir piezas de forma rápida, repetible y editable utilizando los componentes, contenidos y tokens visuales de VitaBlue.

El sistema debe permitir editar dos dimensiones de una pieza:

1. **Contenido:** textos, titulares, CTA, datos, listas, logos, imágenes, colores y componentes de marca.
2. **Vídeo:** orden de escenas, duración, transiciones, animaciones, ritmo, formato, relación de aspecto, capas y audio cuando se incorpore.

La eficiencia es el objetivo principal. Una persona del equipo debe poder partir de una plantilla, cambiar los datos relevantes, previsualizar el resultado y exportar una pieza para redes sin modificar código ni reconstruir el vídeo manualmente.

## 2. Visión del producto

```text
Plantilla de vídeo
      + datos de campaña
      + componentes VitaBlue
      + identidad visual
      + configuración de formato
                |
                v
       VitaBlue Social Video Studio
          |                 |
          v                 v
   Preview editable     Render MP4/WebM
   y timeline           local o server-side
```

El producto no debe convertirse inicialmente en un editor de vídeo generalista. Debe resolver primero el caso de VitaBlue: vídeos cortos, verticales o cuadrados, basados en plantillas de marketing, componentes reutilizables y datos estructurados.

## 3. Decisiones arquitectónicas

### 3.1 Remotion como motor de renderizado

Remotion será el motor de composición y renderizado porque permite definir vídeos como código React, reutilizar componentes existentes y generar salidas reproducibles desde datos estructurados.

Antes de publicar el módulo o usarlo comercialmente, debe verificarse la licencia vigente de Remotion y de cada dependencia de renderizado. "Código disponible" y "uso libre para cualquier escenario comercial" no deben tratarse como equivalentes.

### 3.2 Separación en cuatro capas

```text
Video Domain Core
  Tipos de storyboard, escenas, tracks, assets, duración y validaciones

Remotion Engine
  Composición, animaciones, Player y renderizado

VitaBlue Brand Adapter
  Logo, AdvisorCard, ProductCard, ilustraciones, tokens y componentes de marca

Studio Application
  Editor, formularios, timeline, presets, preview, exportación y biblioteca
```

El núcleo y el motor no deben importar directamente rutas internas de VitaBlue. La marca debe entrar mediante adaptadores, componentes registrados o contratos explícitos. Así la misma base podrá reutilizarse más adelante en Loopdev sin copiar la lógica de edición.

### 3.3 Datos como fuente de verdad

Una pieza debe describirse mediante un storyboard serializable, no mediante JSX específico para cada vídeo:

```ts
interface VideoProject {
  id: string;
  name: string;
  fps: number;
  format: VideoFormat;
  scenes: Scene[];
  audio?: AudioTrack[];
  metadata?: Record<string, unknown>;
}

interface Scene {
  id: string;
  templateId: string;
  startFrame?: number;
  durationInFrames: number;
  layers: Layer[];
  transition?: TransitionConfig;
}
```

El JSON debe poder alimentar tanto el preview como el render local o server-side. No debe existir una versión distinta de la composición para la previsualización y para el MP4 final.

### 3.4 Portabilidad a Loopdev

VitaBlue será el laboratorio funcional inicial y Loopdev será la plataforma canónica futura. Esta portabilidad no debe convertir VitaBlue en una réplica de Loopdev ni añadir multi-tenancy antes de que exista una necesidad real.

Reglas de frontera:

- El dominio de vídeo no importa módulos de VitaBlue, Supabase, Marketing Studio ni rutas de aplicación.
- Las composiciones de marca se conectan mediante un adaptador ligero, no mediante imports directos desde el core.
- El storyboard no conoce campañas, organizaciones, workspaces, tablas ni políticas de persistencia.
- Los assets se referencian mediante un contrato (`AssetRef`) y no mediante tablas o URLs específicas de un proveedor.
- El editor consume interfaces de dominio y no un repositorio concreto.
- La persistencia se incorporará mediante `VideoProjectRepository` cuando sea necesaria.
- La identidad visual se resuelve mediante tokens semánticos o un contexto de marca, no mediante reglas del dominio.
- El módulo futuro se integrará dentro de Marketing Studio de Loopdev y reutilizará su shell, permisos, Brand Hub y Asset Manager.
- Loopdev podrá convertirse en la implementación canónica sin mantener una segunda lógica autoritativa en VitaBlue.

Contratos ligeros previstos:

```ts
interface VideoBrandAdapter {
  resolveComponent(componentId: string): React.ComponentType<Record<string, unknown>>;
  resolveToken(token: string): string;
}

interface AssetRef {
  assetId?: string;
  src?: string;
  alt?: string;
}

interface VideoProjectRepository {
  load(projectId: string): Promise<VideoProject | null>;
  save(project: VideoProject): Promise<void>;
  duplicate(projectId: string): Promise<VideoProject>;
}

interface VideoAssistant {
  suggestChanges(
    project: VideoProject,
    instruction: string,
  ): Promise<VideoEditOperation[]>;
}
```

Estos contratos no obligan a implementar ahora persistencia, resolución remota de assets ni IA. Solo fijan una frontera de sustitución para que la extracción posterior a Loopdev sea incremental.

## 4. Alcance funcional

### Incluido en el producto objetivo

- Plantillas de vídeo para Reels, Stories, TikTok, Shorts y publicaciones cuadradas.
- Formatos 9:16, 1:1 y 16:9 cuando exista una necesidad real.
- Escenas editables y ordenables.
- Duración por escena y duración total calculada automáticamente.
- Capas de texto, imagen, vídeo, forma, logo, componente React y audio.
- Transiciones y animaciones configurables por plantilla.
- Formularios de contenido adaptados a cada componente.
- Vista previa interactiva con `@remotion/player`.
- Reproducción, pausa, reinicio, salto a escena y scrubbing.
- Timeline visual con escenas y, posteriormente, tracks multicapa.
- Presets reutilizables por campaña, producto, audiencia y canal.
- Validación de textos que desborden el lienzo o no quepan en una escena.
- Exportación local reproducible mediante Remotion CLI.
- Exportación server-side como evolución posterior.
- Uso de componentes reales de VitaBlue con un adaptador de marca.

### Fuera de alcance inicial

- Ser un reemplazo completo de Premiere, After Effects o CapCut.
- Edición libre de cada píxel sin restricciones de plantilla.
- Red social integrada o publicación automática.
- Generación autónoma de campañas por IA.
- Persistencia multiusuario avanzada y control de versiones completo.
- Banco de audio con licencias gestionadas por el sistema.
- Renderizado serverless antes de estabilizar el render local.

## 5. Principio de eficiencia

Cada decisión debe evaluarse con esta pregunta:

> ¿Reduce el tiempo entre elegir una plantilla y obtener un vídeo publicable?

Las primeras capacidades que más aportan eficiencia son:

- plantillas con estructura y copy editable;
- datos separados de la presentación;
- componentes reutilizables;
- presets de formato y duración;
- duplicación de proyectos;
- actualización inmediata del preview;
- validaciones antes de renderizar;
- render local rápido;
- nombres y exportaciones consistentes;
- reutilización de una misma pieza en varios formatos.

La timeline multicapa es importante, pero no debe bloquear la primera versión útil. El primer editor puede ser secuencial por escenas y evolucionar a tracks cuando el modelo de datos ya sea estable.

## 6. Fases de desarrollo

### Fase 0 - Contrato del producto y prueba de viabilidad

- [ ] Definir los primeros canales: Reels/Stories/TikTok y formato 9:16.
- [ ] Elegir dos o tres casos de uso concretos: requisitos de visado, producto de salud y CTA de asesoría.
- [ ] Inventariar componentes VitaBlue aptos para vídeo.
- [ ] Confirmar licencia de Remotion y dependencias.
- [ ] Definir criterios de éxito: tiempo para crear una pieza, tiempo de preview y tiempo de render.
- [ ] Definir qué assets pueden utilizarse y con qué derechos.
- [ ] Registrar qué capacidades serán específicas de VitaBlue y cuáles pertenecen al core reutilizable.
- [ ] Confirmar que el módulo se integrará en Marketing Studio de Loopdev y no como una aplicación independiente.

**Salida:** tres plantillas objetivo, contrato inicial de datos y una métrica de eficiencia.

### Fase 1 - Núcleo agnóstico del proyecto de vídeo

- [x] Crear tipos estrictos para `VideoProject`, `Scene`, `Layer`, `Asset`, `Transition` y `VideoFormat`.
- [x] Mantener los tipos sin imports de React, Remotion, VitaBlue o Supabase.
- [x] Crear utilidades para calcular duración total y frames acumulados.
- [x] Validar IDs, duraciones, formatos y referencias de plantillas.
- [x] Definir una versión de esquema, `video-schema-v1`.
- [x] Crear un storyboard JSON de ejemplo sin depender de la UI.
- [x] Añadir pruebas unitarias para duración, selección de escena y validación.
- [x] Añadir `AssetRef` opcional sin acoplarlo todavía a Storage.
- [x] Documentar la primera versión de `VideoProjectRepository` sin implementar persistencia.

La Fase 1 no crea tablas, Storage, repositorios concretos ni integración con Loopdev. El contrato de repositorio solo permite sustituir más adelante la memoria/localidad de VitaBlue por el `MarketingRepository` de Loopdev.

**Salida:** un proyecto JSON que pueda ser consumido por cualquier interfaz o renderer.

### Fase 2 - Motor Remotion y adaptador VitaBlue

- [x] Separar el motor de las importaciones directas de VitaBlue.
- [x] Mantener las plantillas y componentes específicos de VitaBlue fuera del dominio común.
- [x] Crear un registro de plantillas por `templateId`.
- [x] Crear un `VideoBrandAdapter` ligero para el componente de asesoría de VitaBlue.
- [x] Implementar una composición genérica que renderice las escenas desde el storyboard.
- [x] Hacer que la duración de `Composition` derive de las escenas.
- [x] Resolver correctamente frames antes, durante y después de cada escena.
- [x] Mantener la misma composición para preview y render CLI.
- [x] Validar el proyecto y las plantillas antes de iniciar un render.
- [ ] Evitar versionar vídeos generados dentro de `packages/video-studio/out/`.
- [x] Verificar que una composición no requiere importar un componente concreto de VitaBlue desde el core.

**Salida:** un vídeo vertical generado desde JSON utilizando componentes de VitaBlue.

### Fase 3 - Editor de storyboard eficiente

- [ ] Crear una pantalla privada en Marketing Studio.
- [ ] Mantener el editor como aplicación de VitaBlue, sin introducir todavía organización, workspace, Brand Hub ni repositorios multi-tenant.
- [x] Listar, seleccionar, duplicar, eliminar y reordenar escenas.
- [x] Editar duración y contenido de la escena activa.
- [x] Mostrar formularios específicos por plantilla.
- [x] Añadir presets de proyecto y de formato.
- [ ] Implementar preview con `@remotion/player`.
- [x] Sincronizar reproducción, pausa, reinicio, frame actual y escena activa.
- [x] Añadir scrubbing y salto directo a una escena.
- [x] Avisar de textos largos, campos faltantes y contenido que exceda límites.
- [x] No borrar contenido automáticamente al cambiar una plantilla sin confirmación.
- [x] Mantener el estado mediante memoria o una implementación local sustituible, sin poner `localStorage` dentro del dominio.

**Salida:** una persona no técnica puede crear y ajustar un vídeo sin editar código.

### Fase 4 - Timeline y edición audiovisual

- [x] Mostrar una timeline horizontal con escala temporal.
- [x] Representar cada escena como un bloque editable.
- [x] Añadir cabezal de reproducción sincronizado con el Player.
- [x] Permitir ajustar inicio y duración mediante interacción controlada.
- [ ] Añadir tracks de texto, imagen, componente, vídeo y audio cuando el caso de uso lo justifique.
- [x] Añadir transiciones con presets seguros.
- [x] Añadir reordenación mediante drag-and-drop con teclado como alternativa accesible.
- [x] Mantener límites para evitar escenas imposibles de renderizar.

**Salida:** edición temporal suficientemente potente para producción de contenido corto, sin intentar replicar un editor profesional completo.

### Fase 5 - Exportación y biblioteca de plantillas

- [x] Crear comando de render con props del proyecto.
- [x] Mostrar validación previa al render.
- [x] Mostrar progreso, errores y ruta de salida.
- [x] Definir nombres de archivo y metadatos de exportación.
- [x] Permitir exportar variantes 9:16, 1:1 y otras configuraciones soportadas.
- [x] Crear biblioteca versionada de plantillas y presets.
- [x] Permitir duplicar una pieza y modificar solo copy, colores o CTA.
- [x] Añadir snapshots o fixtures visuales para detectar regresiones.
- [ ] Separar presets y plantillas de VitaBlue de los contratos que se trasladarán al Content Engine de Loopdev.

**Salida:** flujo repetible desde plantilla hasta archivo publicable.

### Fase 6 - Render server-side

- [ ] Medir primero duración y consumo del render local.
- [ ] Definir un job de render separado del request HTTP del backoffice.
- [ ] Evaluar Remotion Lambda, worker Node dedicado o proveedor especializado.
- [ ] Usar Edge Functions para autorización, creación del job y consulta de estado, no para ejecutar Chromium si el runtime no lo soporta adecuadamente.
- [ ] Definir almacenamiento temporal y política de eliminación de los vídeos generados.
- [ ] Añadir límites de concurrencia, tamaño y coste.

**Salida:** exportación remota fiable sin bloquear la aplicación web.

### Fase 7 - Capacidades asistidas por Gemini u otro LLM

La IA debe ser una capa opcional sobre un sistema determinista de plantillas. No debe generar JSX arbitrario ni controlar directamente el render.

- [ ] Crear un contrato de comandos de edición, por ejemplo `replaceText`, `addScene`, `changeTemplate`, `adaptToFormat` y `suggestCopy`.
- [ ] Validar cada comando contra el esquema del proyecto.
- [ ] Permitir que el LLM proponga cambios que el usuario pueda revisar.
- [ ] Añadir generación de variantes de copy por canal y audiencia.
- [ ] Ajustar un guion a una plantilla existente.
- [ ] Detectar textos demasiado largos y proponer versiones más breves.
- [ ] Crear escenas a partir de datos estructurados de producto.
- [ ] Mantener aprobación humana antes de exportar o publicar.
- [ ] No enviar secretos, credenciales ni datos innecesarios al proveedor.
- [ ] Mantener la IA fuera de la primera versión útil y detrás de una interfaz `VideoAssistant`.
- [ ] Hacer que la IA devuelva operaciones sobre `VideoProject`, nunca JSX arbitrario.
- [ ] Ejecutar la futura integración mediante un gateway server-side en Loopdev, con aprobación humana.

Ejemplo de interacción futura:

```text
"Crea una versión de 20 segundos para TikTok, mantén el CTA de WhatsApp,
usa un tono más directo y no cambies los requisitos legales."
```

La respuesta esperada no sería código, sino un patch validable sobre `VideoProject`:

```json
{
  "schemaVersion": "video-schema-v1",
  "operations": [
    { "op": "setDuration", "sceneId": "requirements", "frames": 360 },
    { "op": "replaceText", "sceneId": "hook", "field": "text", "value": "..." }
  ]
}
```

## 7. Métricas de éxito

- Tiempo desde plantilla seleccionada hasta primer preview.
- Tiempo desde cambios de contenido hasta preview actualizado.
- Tiempo de render local de un vídeo de 15-30 segundos.
- Porcentaje de vídeos que requieren editar código.
- Porcentaje de renders que fallan por contenido inválido.
- Número de piezas producidas por plantilla.
- Porcentaje de componentes reutilizados entre web y vídeo.
- Tiempo necesario para adaptar una pieza a otro formato.

## 8. Matriz de responsabilidades

| Capacidad | VitaBlue ahora | Core reutilizable | Loopdev futuro |
|---|---|---|---|
| Storyboard, escenas y duración | Usa el contrato común | Sí | Reutiliza |
| Remotion renderer | Configuración local | Sí | Reutiliza |
| Componentes visuales | Adaptador VitaBlue | Contrato | `@loopdev/ui` y adaptador de marca |
| Tokens de marca | Tokens VitaBlue | Referencias semánticas | Brand Hub |
| Assets | `src` o referencias locales | `AssetRef` | Asset Manager |
| Proyectos | Memoria o local | `VideoProjectRepository` | `MarketingRepository` |
| Permisos | Backoffice existente | Fuera del core | Capabilities multi-tenant |
| Persistencia | No inicialmente | Interfaz sustituible | Repositorio Loopdev |
| IA | Fuera del MVP | `VideoAssistant` futuro | Gateway LLM server-side |
| Publicación social | Fuera del MVP | Fuera del core | Integrations |

## 9. Plan de extracción posterior a Loopdev

La extracción solo comenzará cuando el flujo local de VitaBlue sea útil y esté medido. El orden previsto es:

1. Extraer `domain` y utilidades de storyboard como paquete compartido.
2. Extraer el motor Remotion y sus plantillas genéricas.
3. Crear el adaptador de marca Loopdev conectado a Brand Hub, tokens y `@loopdev/ui`.
4. Integrar el editor dentro del shell de Marketing Studio de Loopdev.
5. Conectar `VideoProjectRepository` con el repositorio de Marketing de Loopdev.
6. Conectar assets mediante Asset Manager y URLs firmadas cuando exista Storage.
7. Añadir permisos por organización, workspace, marca y capability.
8. Añadir el gateway LLM server-side y los comandos de edición revisables.

No se copiará la implementación completa de VitaBlue como una segunda aplicación autoritativa. VitaBlue conserva el adaptador y los casos de uso propios; Loopdev conserva la plataforma, persistencia, permisos y publicación.

## 10. Riesgos y controles

- **Acoplamiento a VitaBlue:** usar adaptadores y contratos de componentes.
- **Desfase entre preview y MP4:** una única composición compartida.
- **Texto ilegible o desbordado:** validación previa y límites por plantilla.
- **Timeline sobredimensionada:** empezar por escenas secuenciales.
- **Render lento:** medir antes de introducir serverless.
- **Costes de infraestructura:** límites, colas y exportación bajo demanda.
- **IA impredecible:** comandos estructurados, validación y aprobación humana.
- **Licencias de Remotion y assets:** revisión legal y de dependencias antes de producción.
- **Pérdida de trabajo:** aunque el primer motor sea local, el modelo debe quedar preparado para persistencia y versionado posteriores.
- **Sobrediseño en VitaBlue:** limitar ahora los contratos a interfaces pequeñas y no implementar multi-tenancy, OAuth, Storage o gateway LLM.
- **Migración duplicada:** extraer primero el core probado y mantener la lógica de producto dentro de adaptadores.
- **Dependencia de la aplicación anfitriona:** validar periódicamente que el dominio compila sin importar la raíz de VitaBlue.

## 11. Criterios de aceptación de la primera versión útil

- Una persona puede seleccionar una plantilla 9:16 y cambiar su contenido sin editar código.
- Puede añadir, eliminar, duplicar y reordenar escenas.
- Puede modificar la duración de cada escena.
- El preview y el render local muestran exactamente el mismo storyboard.
- La duración total se calcula automáticamente.
- El sistema advierte de textos faltantes o demasiado largos antes de renderizar.
- Puede producir al menos tres tipos de vídeo utilizando componentes reales de VitaBlue.
- Puede exportar un MP4 reproducible mediante Remotion CLI.
- No se versionan renders generados ni secretos en el repositorio.
- El núcleo del proyecto no depende de rutas internas específicas de VitaBlue.
- Las referencias a assets pueden migrarse de una fuente local a un resolver futuro sin cambiar el storyboard.
- El editor puede sustituir su almacenamiento local por un repositorio sin mover lógica de dominio.
- La composición de prueba utiliza un adaptador de marca y no una importación directa desde el core.
- El track deja documentado qué parte se trasladará a Loopdev y qué parte permanecerá específica de VitaBlue.

## Resultado esperado

VitaBlue dispondrá de una fábrica de vídeos basada en plantillas y componentes, capaz de convertir una idea o campaña en varias piezas consistentes para redes sociales con pocos cambios manuales. El motor será reutilizable, el editor estará orientado a velocidad y la IA podrá añadirse después como asistente controlado sobre datos estructurados, sin convertirse en una dependencia crítica del renderizado.
