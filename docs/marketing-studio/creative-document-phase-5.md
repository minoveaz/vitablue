# CreativeDocument migration — Phase 5.3 status

**Last updated:** 2026-08-31  
**Status:** Canonical v1 runtime/persistence rollout is active by default for
the editor routes, with an explicit `false` feature flag for rollback. Image
and Video scene/layer state now use the canonical document as their runtime
source of truth; legacy projections remain available at integration boundaries
and retain runtime asset URLs.

## Implemented

- `CreativeDocument` v1 is the shared, validated representation for image and
  video layers, scenes, transforms, appearance, timing, assets and constraints.
- Image and Video adapters are bidirectional and retain unsupported or
  studio-specific fields in `extensions.legacy`.
- `migrateCreativeDocument` accepts canonical v1, legacy ImageProject,
  legacy VideoProject and the persisted `imageStudio`/`videoStudio` envelopes.
  Unknown canonical versions fail closed; no destructive rewrite is performed.
- The neutral `CreativeDocumentEditor` provides validated layer operations,
  selection and semantic undo/redo. Image and Video editor hooks expose
  canonical document snapshots and canonical layer operations by default while
  retaining their legacy project/scene facades. Video Studio's canonical mode
  stores its document internally and derives the legacy scene projection.
- Image and Video persistence can write canonical v1 with
  `documentFormat: 'creative-document'`. The editor routes enable this by
  default; set `VITE_CREATIVE_DOCUMENT_IMAGE_MIGRATION=false` or
  `VITE_CREATIVE_DOCUMENT_VIDEO_MIGRATION=false` for an explicit legacy
  rollback. Both formats are readable, including legacy VideoProject payloads.
- `rehearseCreativeDocumentPersistence` exercises both encoders and the
  migration/round-trip boundary without a remote write.
- Video's Remotion stage accepts canonical scenes at the renderer boundary,
  restores session-only asset URLs from the legacy projection, and falls back
  to legacy scenes if conversion fails.
- The Video editor hook defaults to canonical runtime mode even when called
  outside the route. Passing `canonicalRuntime: false`, or setting
  `VITE_CREATIVE_DOCUMENT_VIDEO_MIGRATION=false` on the route, preserves the
  legacy state, persistence envelope and renderer input.
- Direct hook harness coverage exercises canonical scene/layer commands, scene
  timing, temporal keyframes and the explicit legacy fallback. The inspector
  now provides minimal keyframe authoring for opacity, position, rotation and
  scale; the timeline shows and seeks to authored markers.
- Image Studio's hook now stores the canonical document and derives the
  `ImageProject` compatibility facade. Core callbacks run through
  `CreativeDocumentEditor`; selection, transforms, groups and constraints are
  validated at that boundary. Inline/local assets deliberately fall back to
  the legacy facade until they have a durable Storage reference.
- Storage asset references remain logical paths/IDs; signed URLs are resolved
  only at runtime. Inline payloads are rejected by the canonical boundary.

## Deliberately deferred

- Image Studio still owns specialized carousel, crop, panorama, preview and
  export operations. They remain compatibility extensions over the canonical
  state, and unknown runtime URLs retain the legacy path.
- Video Studio keeps frame-based timeline callbacks as a compatibility facade,
  but scene timing, layer timing, keyframes, audio metadata and transitions are
  represented as explicit temporal extensions where they are not part of the
  static core. Scene-local audio remains local; project audio remains a global
  track.
- Production rollout still requires an operator to run the rehearsal against a
  representative persisted sample and verify the explicit `false` rollback
  flag before removing legacy consumers.
- A renderer-native temporal contract remains future work. Keyframes are
  authored and round-tripped as temporal extensions, but Remotion still owns
  animation evaluation and the new controls do not claim interpolation
  support beyond the existing renderer behavior.
- Operational verification against a representative persisted sample and
  manual visual validation at 768/1024/1440px remain outstanding; no legacy
  consumers have been removed or declared unsupported.
