# Shared Creative Resource Registry

## Objetivo

Cada herramienta del panel de recursos debe tener una implementación core única,
reutilizable por Image Studio y Video Studio. El contexto del editor se inyecta
mediante contratos y adapters pequeños; el componente no conoce el modelo
legacy, la persistencia ni el renderer.

## Organización propuesta

```text
components/
  creative-resources/
    contracts/
      creativeResource.ts
      creativeResourceContext.ts
      creativeResourceActions.ts
      creativeResourceCapabilities.ts
    registry/
      CreativeResourceRegistry.ts
      creativeResourceCatalog.ts
      creativeResourceAvailability.ts
      creativeResourceToolRail.ts
    shared/
      ResourcePanelHeader.tsx
      ResourceTabs.tsx
      ResourceSearch.tsx
      ResourceFilters.tsx
      ResourceEmptyState.tsx
      ResourceErrorState.tsx
      ResourceLoadingState.tsx
    blocks/
      text/
        TextResource.tsx
        TextResource.contract.ts
        TextResource.adapter.ts
        TextResource.test.tsx
      elements/
        ElementsResource.tsx
        ElementsResource.contract.ts
        ElementsResource.adapter.ts
      media/
        MediaResource.tsx
        MediaResource.contract.ts
        MediaResource.adapter.ts
      layers/
        LayersResource.tsx
        LayersResource.contract.ts
        LayersResource.adapter.ts
      backgrounds/
        BackgroundsResource.tsx
        BackgroundsResource.contract.ts
        BackgroundsResource.adapter.ts
      layout/
        LayoutResource.tsx
        LayoutResource.contract.ts
        LayoutResource.adapter.ts
      brand-kit/
        BrandKitResource.tsx
        BrandKitResource.contract.ts
        BrandKitResource.adapter.ts
      blocks/
        BlocksResource.tsx
        BlocksResource.contract.ts
        BlocksResource.adapter.ts
      templates/
        TemplatesResource.tsx
        TemplatesResource.contract.ts
        TemplatesResource.adapter.ts
      prepare-video/
        PrepareVideoResource.tsx
        PrepareVideoResource.contract.ts
        PrepareVideoResource.adapter.ts
    adapters/
      imageCreativeResourceAdapter.ts
      videoCreativeResourceAdapter.ts
    index.ts
```

## Flujo de datos

```text
ImageProject / CreativeDocument / VideoProject
                    │
          adapter del dominio
                    │
          CreativeResourceContext
                    │
          CreativeResourceRegistry
                    │
      bloque core + shared primitives
                    │
       acciones tipadas del consumidor
```

## Contrato mínimo

Cada bloque debe recibir un contexto equivalente a:

```ts
type CreativeResourceContext = {
  domain: 'image' | 'video';
  documentId: string;
  capabilities: readonly string[];
  selection: {
    layerIds: readonly string[];
    sceneId?: string;
  };
  state: 'ready' | 'loading' | 'error' | 'disabled';
  actions: {
    insert?: (payload: unknown) => void;
    update?: (payload: unknown) => void;
    remove?: (id: string) => void;
    select?: (id: string) => void;
  };
};
```

El contrato productivo deberá sustituir `unknown` por payloads específicos por
bloque. Los componentes no deben importar directamente hooks de Image Studio,
Video Studio, persistencia o Remotion.

## Regla de reutilización

Una mejora visual o de interacción en `blocks/*`, `shared/*` o el registry debe
reflejarse automáticamente en ambos studios. Las diferencias se expresan con
`capabilities`, props y adapters. Si una capacidad no existe en un dominio, el
bloque debe mostrar un estado explícito o deshabilitado, nunca crear una
segunda implementación visual.

Las extensiones de dominio no se fuerzan dentro de los bloques comunes:

- Image Studio: carrusel, panorama, crop, slide strip, exportación y vectorial.
- Video Studio: escenas, timeline, transport, audio, keyframes, Remotion y
  render.

## Implementación Fase 4.75.9

La organización anterior está implementada en `components/creative-resources`.
`CreativeResourceRegistry` mantiene un catálogo ordenado, el icono Lucide, la
descripción y la matriz de disponibilidad. `resolve(id, domain)` nunca devuelve
un bloque que no esté disponible para ese dominio. El estado (`ready`,
`loading`, `error`, `disabled`), la selección y las acciones llegan mediante
`CreativeResourceContext`; los bloques no importan hooks, persistencia ni
Remotion.

Los componentes de `shared/` concentran header, tabs internas, búsqueda, filtros,
acciones y estados accesibles. `ResourceBlockShell` incluye el guard
`hidden md:block` para conservar el alcance desktop/tablet sin exponer una
interfaz incompleta en móvil. Cada carpeta de `blocks/` contiene un contrato,
componente y adapter tipado.

### Clasificación y estado por bloque (paridad interna)

#### Navegación core única (decisión vigente)

`CORE_CREATIVE_RESOURCE_IDS` y `createCreativeResourceToolRail` en
`components/creative-resources/registry` son la única fuente de orden, label,
icono, badge y disponibilidad de los bloques core:

> Texto → Elementos → Medios → Capas → Fondos → Diseño → Kit de Marca

Image Studio y Video Studio renderizan esa misma definición mediante un único
`StudioToolRail` vertical a la izquierda. El panel de recursos solo resuelve el
bloque activo; no contiene ningún selector horizontal principal. Video añade
Escenas y Audio en una sección vertical separada del mismo rail, siguiendo el
mismo patrón de icono, label, estado activo y badge. `ResourceTabs` queda
reservado para subcategorías internas legítimas, nunca para navegación principal.
Timeline, transport, keyframes y Remotion siguen en el workspace inferior/stage.
Los badges (por ejemplo, el contador de capas) se inyectan como datos, nunca
cambian la estructura compartida.

| Bloque | Clasificación | Image Studio | Video Studio | Estado y límite honesto |
| --- | --- | --- | --- | --- |
| Texto | Core Image + Video | `TextResource` compartido | **Compartido 100% en estructura y catálogo**: acciones rápidas, búsqueda, Universal/Empresa/Míos, categorías, cards, previews tipográficas y metadata | El adapter traduce Insertar a la API tipográfica de cada dominio; los presets guardados se leen desde la extensión de Image y Video puede mostrar un estado vacío para Míos hasta exponer persistencia propia |
| Elementos | Core Image + Video | `ElementsResource` compartido | **Compartido 100% en estructura**: categorías, búsqueda, filtros de scope/formato/estado, cards e Insertar | El catálogo enriquecido y recursos guardados siguen siendo datos Image; Video adapta a shape |
| Medios | Core Image + Video | `MediaResource` compartido | **Compartido 100% en estructura**: header, upload/dropzone, búsqueda, scopes, categorías, selector de recorte, cards y acciones | Image conecta Storage remoto (incluido fondo y borrado); Video adapta upload a capas nativas del proyecto |
| Capas | Core Image + Video | `LayersResource` compartido | **Compartido 100% en estructura**: árbol, selección, visibilidad, bloqueo, orden y estados disabled | Video solo habilita acciones que expone su contrato; inspector/timeline conservan controles temporales |
| Kit de Marca | Core Image + Video | `BrandKitResource` compartido | **Compartido 100% en estructura**: categorías, búsqueda, colores, tipografías, logos/assets y aplicación | El adapter decide si aplica un asset como layer/component; MotionKit sigue siendo extensión Video |
| Fondos | Core Image + Video (capacidad parcial) | `BackgroundsResource` compartido | **Compartido 100% en estructura**: variantes, búsqueda, categorías, cards y acción/estado explícito | Video permanece disabled hasta que su renderer persista fondos; Image conserva composición/carrusel avanzada |
| Diseño | Core Image + Video (capacidad parcial) | `LayoutResource` compartido | **Compartido 100% en estructura**: tabs internas Diseño/Organizar/Estilo, controles y disabled state | Video habilita solo layout-update sobre selección; guías, safe zones y geometría avanzada siguen en Image |
| Carrusel / slides | Específico Image | Disponible en Image | No disponible en registry Video | La secuencia de escenas de Video no se modela como carrusel |
| Plantillas estáticas | Específico Image | Registry → drawer actual | No disponible | Los presets de escenas de Video conservan su flujo propio |
| Bloques de campaña | Específico Image | Registry → drawer actual | No disponible | Los componentes de vídeo se insertan desde Kit de Marca |
| Crop / Panorama | Específico Image | Disponible en Image | No disponible | Requieren superficie y geometría del canvas de Image |
| Preparar para Video | Específico Image | Bridge `imageVideoBridge` | No disponible | Es un handoff de Image hacia Video, no una herramienta de edición de Video |
| Escenas / timeline / transport | Específico Video | No disponible | Disponible en Video | Se conservan fuera del registry para no duplicar el modelo temporal |
| Audio / keyframes / transiciones / Remotion | Específico Video | No disponible | Disponible en Video | Se conservan en timeline, inspector y renderer de Video |

Image y Video montan ahora la misma implementación interna de los siete bloques
core desde `CreativeResourceRegistry`; los adapters aportan datos y acciones sin
duplicar presentación.

El catálogo completo de tipografías vive junto a `TextResource` en
`blocks/text/textPresets.ts`; `marketing-studio/data/textPresets.ts` permanece como
re-export de compatibilidad para las extensiones Image que aún consumen el tipo.

el adapter añade `documentId`, `sceneId` y `layerIds`, y sus callbacks traducen
las acciones a la escena/capa activa. Fondos y Diseño exponen únicamente la
capacidad que el documento y renderer de Video soportan hoy.

`MediaResource` mantiene el drawer de referencia en una única implementación:
`MediaResource.contract.ts` define assets, recorte y callbacks de upload/listado,
`extensions.media` transporta esas operaciones desde cada adapter y el bloque
renderiza el mismo header, dropzone, scopes, categorías, cards y estados. Image
usa los callbacks de Storage; Video devuelve data URLs y traduce el tipo del
archivo a una capa `image`/`video` del proyecto activo.

### Límites y pendientes

- Los drawers Image conservan debajo del core las extensiones específicas de
  carrusel, stock, edición tipográfica avanzada y Brand Kit descargable. El
  drawer legado de texto ya no se monta: `TextResource` es la única vista core
  para ambos studios.
- Los estados `disabled` son deliberados cuando Video no puede persistir una
  mutación; no se sustituye el contenido por una lista reducida.
- Video no tiene todavía un catálogo remoto persistido: sus uploads se convierten
  en data URLs y se insertan como capas del proyecto activo. Stock y acciones de
  fondo se habilitan cuando el adapter exponga una fuente/renderizador compatible.
- Sustituir el handoff por `CreativeDocument` en la fase posterior.
