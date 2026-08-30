# Shared Creative Editor Foundation — Fase 4

## Frontera de assets

Los adaptadores legacy siguen aceptando `ImageLayer.src`, `props.imageUrl` y
`VideoLayer.asset.src` para renderizar y hacer handoff. Al convertir a
`CreativeDocument`, esos valores se convierten en `CreativeAssetRef`
(`assetId` + `storagePath`). `data:`, `blob:` y URLs firmadas (tokens,
signature, expires, `signed/`) se rechazan antes de persistir. La URL firmada
solo existe en el resultado runtime de `CreativeAssetResolver`.

`imagePersistence.ts` conserva la biblioteca existente y sus claves
`vitablue_image_studio_*`; sus `dataUrl` son una compatibilidad interna de la
biblioteca legacy, no documentos creativos. `imageVideoBridge.ts`, `ImageProject`
y `VideoProject` no se sustituyen.

## Persistencia

`packages/creative-document` contiene el repositorio neutral, la validación
Zod, versionado optimista y autosave cancelable. El core solo conoce
`CreativeDocumentStorageAdapter`; `createLocalStorageCreativeDocumentStorage`
es el adapter durable para navegadores sin duplicar ni borrar datos legacy.
`marketing-studio/utils/creativeDocumentRepository.ts` es la frontera opcional
que reutiliza `CreativeProjectRepository`/Supabase y conserva tenancy, versiones
y `draftDocument`; acepta un decoder explícito cuando el payload aún es legacy.
En SSR o tests sin DOM se puede usar el adapter en memoria;
el adapter local explícitamente informa `unavailable` si no se inyecta storage.
Video Studio dispone de `createVideoProjectRepositoryFromCreativeDocuments`
como fachada compatible: convierte al cargar/guardar, sin migrar aún su editor.

La migración completa de los editores y la sustitución del bridge quedan para
las fases 5–7.
