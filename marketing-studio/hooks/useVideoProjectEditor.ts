import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from 'react';
import type { Layer, LayerType, Scene, SceneTemplateId, ShapeLayer, SubtitleLayer, TextLayer, ComponentLayer, VideoProject } from '../../packages/video-studio/src/domain/videoProject';
import { defaultVisaRejectionProject } from '../../packages/video-studio/src/domain/defaultProject';
import { getVideoSceneWarnings } from './videoSceneValidation';
import { DEFAULT_LAYER_LAYOUT_CONSTRAINTS } from '../../packages/video-studio/src/domain/layoutConstraints';
import {
  creativeDocumentToVideoProject,
  videoProjectToCreativeDocument,
} from '../../packages/creative-document/src/adapters/videoProjectAdapter';
import type { CreativeDocument, Keyframe, TemporalExtensions } from '../../packages/creative-document/src/types';
import {
  addLayer as addCreativeLayer,
  duplicateLayer as duplicateCreativeLayer,
  moveLayer as moveCreativeLayer,
  removeLayer as removeCreativeLayer,
  reorderLayer as reorderCreativeLayer,
  resizeLayer as resizeCreativeLayer,
  rotateLayer as rotateCreativeLayer,
  scaleLayer as scaleCreativeLayer,
  updateLayer as updateCreativeLayerCommand,
} from '../../packages/creative-document/src/commands';
import type { CreativeLayerPatch, ReorderLayerInput } from '../../packages/creative-document/src/commands/layerCommands';
import type { ResizeLayerInput, ResizeLayerOptions, TransformConstraints } from '../../packages/creative-document/src/commands/transforms';

const createSceneId = (scenes: Scene[]): string => {
  const usedIds = new Set(scenes.map((scene) => scene.id));
  let index = scenes.length + 1;

  while (usedIds.has(`slide_${index}`)) index += 1;
  return `slide_${index}`;
};

const cloneVideoValue = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(cloneVideoValue);
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, cloneVideoValue(item)]),
    );
  }
  return value;
};

const cloneVideoRecord = <T extends object>(value: T): T =>
  cloneVideoValue(value) as T;

const cloneVideoLayer = (layer: Layer): Layer => ({
  ...layer,
  ...(layer.timing ? { timing: { ...layer.timing } } : {}),
  ...('asset' in layer ? { asset: cloneVideoRecord(layer.asset) } : {}),
  ...('props' in layer ? { props: cloneVideoRecord(layer.props) } : {}),
  ...('constraints' in layer && layer.constraints ? { constraints: cloneVideoRecord(layer.constraints) } : {}),
  ...('highlightWords' in layer && layer.highlightWords ? { highlightWords: [...layer.highlightWords] } : {}),
});

const cloneVideoScene = (scene: Scene): Scene => ({
  ...scene,
  content: cloneVideoRecord(scene.content),
  ...(scene.transition ? { transition: { ...scene.transition } } : {}),
  layers: scene.layers.map(cloneVideoLayer),
});

const isRuntimeAssetUrl = (value: unknown): value is string =>
  typeof value === 'string' && /^(?:data:|blob:|https?:|\/\/)/i.test(value);

const preserveRuntimeAssetUrls = (candidate: VideoProject, converted: VideoProject): VideoProject => {
  const urls = new Map<string, string>();
  candidate.scenes.forEach((scene) => scene.layers.forEach((layer) => {
    const source = 'asset' in layer ? layer.asset.src : layer.type === 'audio' ? layer.src : undefined;
    if (isRuntimeAssetUrl(source)) urls.set(layer.id, source);
  }));
  candidate.audio?.forEach((track) => {
    if (isRuntimeAssetUrl(track.src)) urls.set(track.id, track.src);
  });
  if (!urls.size) return converted;
  return {
    ...converted,
    scenes: converted.scenes.map((scene) => ({
      ...scene,
      layers: scene.layers.map((layer) => {
        const runtimeUrl = urls.get(layer.id);
        if (!runtimeUrl) return layer;
        if ('asset' in layer) return { ...layer, asset: { ...layer.asset, src: runtimeUrl } };
        if (layer.type === 'audio') return { ...layer, src: runtimeUrl };
        return layer;
      }),
    })),
    ...(converted.audio
      ? {
          audio: converted.audio.map((track) => {
            const runtimeUrl = urls.get(track.id);
            return runtimeUrl ? { ...track, src: runtimeUrl } : track;
          }),
        }
      : {}),
  };
};

export interface VideoProjectEditorOptions {
  persistenceReady?: boolean;
  /** Reversible runtime adoption seam; legacy scene callbacks remain intact. */
  canonicalRuntime?: boolean;
  persistProject?: (project: VideoProject, expectedUpdatedAt?: string) => Promise<VideoProject>;
}

export const useVideoProjectEditor = (
  initialScenesOrProject: Scene[] | VideoProject = defaultVisaRejectionProject.scenes,
  options: VideoProjectEditorOptions = {},
) => {
  const { persistenceReady = true, persistProject } = options;
  // Video uses the canonical document unless the route explicitly opts out.
  // The public rollback seam remains `canonicalRuntime: false`.
  const canonicalRuntime = options.canonicalRuntime ?? true;
  const initialProject = useMemo(
    () => Array.isArray(initialScenesOrProject)
      ? { ...defaultVisaRejectionProject, scenes: initialScenesOrProject }
      : initialScenesOrProject,
    [initialScenesOrProject],
  );
  const [legacyScenes, setLegacyScenes] = useState<Scene[]>(() => initialProject.scenes.map(cloneVideoScene));
  const initialCanonicalDocument = useMemo<CreativeDocument | null>(() => {
    try {
      return videoProjectToCreativeDocument(initialProject);
    } catch {
      return null;
    }
  }, [initialProject]);
  /**
   * In canonical mode this is the source of truth. `legacyScenes` is retained
   * only as a runtime projection so old consumers can continue to receive
   * signed URLs and frame-based values without changing their contracts.
   */
  const [canonicalDocumentState, setCanonicalDocumentState] = useState<CreativeDocument | null>(
    initialCanonicalDocument,
  );
  const [projectName, setProjectNameState] = useState(initialProject.name);
  const [projectId, setProjectId] = useState(initialProject.id);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(
    'updatedAt' in initialProject ? (initialProject as VideoProject & { updatedAt?: string }).updatedAt : undefined,
  );
  const [saveState, setSaveState] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(updatedAt);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);
  const lastLoadedProjectRef = useRef(initialProject.id);
  const projectRef = useRef(initialProject);
  const scenes = useMemo<Scene[]>(() => {
    if (!canonicalRuntime || !canonicalDocumentState) return legacyScenes;
    try {
      const converted = creativeDocumentToVideoProject(canonicalDocumentState);
      return preserveRuntimeAssetUrls(
        { ...initialProject, id: projectId, name: projectName, scenes: legacyScenes },
        converted,
      ).scenes.map(cloneVideoScene);
    } catch {
      return legacyScenes;
    }
  }, [canonicalDocumentState, canonicalRuntime, initialProject, legacyScenes, projectId, projectName]);
  const creativeDocument = useMemo<CreativeDocument | null>(() => {
    if (canonicalRuntime && canonicalDocumentState) return canonicalDocumentState;
    try {
      return videoProjectToCreativeDocument({
        ...initialProject,
        id: projectId,
        name: projectName,
        scenes: legacyScenes,
      });
    } catch {
      return null;
    }
  }, [canonicalDocumentState, canonicalRuntime, initialProject, projectId, projectName, legacyScenes]);
  const requireCreativeDocument = useCallback((): CreativeDocument => {
    if (!creativeDocument) {
      throw new Error('El proyecto de vídeo contiene assets inline o incompletos; usa referencias de Storage.');
    }
    return creativeDocument;
  }, [creativeDocument]);
  const applyCreativeDocument = useCallback((document: CreativeDocument) => {
    const converted = preserveRuntimeAssetUrls(
      { ...initialProject, id: projectId, name: projectName, scenes },
      creativeDocumentToVideoProject(document),
    );
    setCanonicalDocumentState(document);
    setProjectId(converted.id);
    setProjectNameState(converted.name);
    setLegacyScenes(converted.scenes.map(cloneVideoScene));
    setHasLocalChanges(true);
    return document;
  }, [initialProject, projectId, projectName, scenes]);
  const updateCreativeLayer = useCallback((
    sceneId: string,
    layerId: string,
    changes: CreativeLayerPatch,
  ) => applyCreativeDocument(updateCreativeLayerCommand(requireCreativeDocument(), sceneId, layerId, changes)), [applyCreativeDocument, requireCreativeDocument]);
  const moveCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    input: { x?: number; y?: number; dx?: number; dy?: number },
    constraints?: TransformConstraints,
  ) => applyCreativeDocument(moveCreativeLayer(requireCreativeDocument(), sceneId, layerId, input, constraints)), [applyCreativeDocument, requireCreativeDocument]);
  const resizeCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    input: ResizeLayerInput,
    options?: ResizeLayerOptions,
  ) => applyCreativeDocument(resizeCreativeLayer(requireCreativeDocument(), sceneId, layerId, input, options)), [applyCreativeDocument, requireCreativeDocument]);
  const addCreativeLayerToDocument = useCallback((
    sceneId: string,
    layer: CreativeDocument['scenes'][number]['layers'][number],
    parentGroupId?: string,
  ) => applyCreativeDocument(addCreativeLayer(requireCreativeDocument(), sceneId, layer, parentGroupId)), [applyCreativeDocument, requireCreativeDocument]);
  const duplicateCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    options?: { id?: string; offset?: { x: number; y: number }; zIndex?: number },
  ) => applyCreativeDocument(duplicateCreativeLayer(requireCreativeDocument(), sceneId, layerId, options)), [applyCreativeDocument, requireCreativeDocument]);
  const removeCreativeLayerFromDocument = useCallback(
    (sceneId: string, layerId: string) => applyCreativeDocument(removeCreativeLayer(requireCreativeDocument(), sceneId, layerId)),
    [applyCreativeDocument, requireCreativeDocument],
  );
  const reorderCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    input: ReorderLayerInput,
  ) => applyCreativeDocument(reorderCreativeLayer(requireCreativeDocument(), sceneId, layerId, input)), [applyCreativeDocument, requireCreativeDocument]);
  const rotateCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    rotation: number,
    options?: { relative?: boolean },
  ) => applyCreativeDocument(rotateCreativeLayer(requireCreativeDocument(), sceneId, layerId, rotation, options)), [applyCreativeDocument, requireCreativeDocument]);
  const scaleCreativeLayerInDocument = useCallback((
    sceneId: string,
    layerId: string,
    scale: number | { x: number; y: number },
    constraints?: TransformConstraints,
  ) => applyCreativeDocument(scaleCreativeLayer(requireCreativeDocument(), sceneId, layerId, scale, constraints)), [applyCreativeDocument, requireCreativeDocument]);
  const updateSceneTiming = useCallback((
    sceneId: string,
    timing: { startMs: number; durationMs: number },
  ) => {
    if (!canonicalRuntime || !creativeDocument) {
      setHasLocalChanges(true);
      setLegacyScenes((current) => current.map((scene) => scene.id !== sceneId ? scene : {
        ...scene,
        durationInFrames: Math.max(1, Math.round((timing.durationMs * initialProject.fps) / 1000)),
      }));
      return null;
    }
    const document = requireCreativeDocument();
    return applyCreativeDocument({
      ...document,
      scenes: document.scenes.map((scene) => scene.id === sceneId ? { ...scene, timing } : scene),
    });
  }, [applyCreativeDocument, canonicalRuntime, creativeDocument, initialProject.fps, requireCreativeDocument]);
  const updateSceneTransition = useCallback((
    sceneId: string,
    transition: { type: string; durationMs?: number },
  ) => {
    if (!canonicalRuntime || !creativeDocument) {
      setHasLocalChanges(true);
      setLegacyScenes((current) => current.map((scene) => scene.id !== sceneId ? scene : {
        ...scene,
        transition: {
          type: transition.type as NonNullable<Scene['transition']>['type'],
          durationInFrames: Math.max(0, Math.round(((transition.durationMs ?? 0) * initialProject.fps) / 1000)),
        },
      }));
      return null;
    }
    const document = requireCreativeDocument();
    return applyCreativeDocument({
      ...document,
      scenes: document.scenes.map((scene) => scene.id === sceneId
        ? {
            ...scene,
            extensions: {
              ...(scene.extensions ?? {}),
              temporal: {
                ...(scene.extensions?.temporal ?? {}),
                transition,
              },
            },
          }
        : scene),
    });
  }, [applyCreativeDocument, canonicalRuntime, creativeDocument, initialProject.fps, requireCreativeDocument]);
  const updateLayerKeyframes = useCallback((
    sceneId: string,
    layerId: string,
    property: string,
    keyframes: Keyframe[],
  ) => {
    if (!canonicalRuntime || !creativeDocument) {
      setHasLocalChanges(true);
      setLegacyScenes((current) => current.map((scene) => scene.id !== sceneId
        ? scene
        : {
            ...scene,
            layers: scene.layers.map((layer) => layer.id !== layerId
              ? layer
              : { ...layer, keyframes: { ...((layer as Layer & { keyframes?: Record<string, Keyframe[]> }).keyframes ?? {}), [property]: keyframes } } as unknown as Layer),
          }));
      return null;
    }
    const document = requireCreativeDocument();
    const next = updateCreativeLayerCommand(document, sceneId, layerId, {
      extensions: {
        ...(document.scenes.find((scene) => scene.id === sceneId)?.layers
          .find((layer) => layer.id === layerId)?.extensions ?? {}),
        temporal: {
          ...(document.scenes.find((scene) => scene.id === sceneId)?.layers
            .find((layer) => layer.id === layerId)?.extensions?.temporal ?? {}),
          keyframes: {
            ...(document.scenes.find((scene) => scene.id === sceneId)?.layers
              .find((layer) => layer.id === layerId)?.extensions?.temporal?.keyframes ?? {}),
            [property]: keyframes,
          },
        } satisfies TemporalExtensions,
      },
    });
    return applyCreativeDocument(next);
  }, [applyCreativeDocument, canonicalRuntime, creativeDocument, requireCreativeDocument]);
  const updateLayerTiming = useCallback((
    sceneId: string,
    layerId: string,
    timing: { startFrame: number; durationInFrames: number },
  ) => updateCreativeLayer(sceneId, layerId, {
    timing: {
      startMs: Math.round((timing.startFrame * 1000) / initialProject.fps),
      durationMs: Math.max(1, Math.round((timing.durationInFrames * 1000) / initialProject.fps)),
    },
  }), [initialProject.fps, updateCreativeLayer]);
  const setScenes = (next: SetStateAction<Scene[]>) => {
    setHasLocalChanges(true);
    const candidate = typeof next === 'function' ? next(scenes) : next;
    if (!canonicalRuntime) {
      setLegacyScenes(candidate);
      return;
    }
    try {
      const canonical = videoProjectToCreativeDocument({
        ...initialProject,
        id: projectId,
        name: projectName,
        scenes: candidate,
      });
      const converted = preserveRuntimeAssetUrls(
        { ...initialProject, id: projectId, name: projectName, scenes: candidate },
        creativeDocumentToVideoProject(canonical),
      );
      setCanonicalDocumentState(canonical);
      setLegacyScenes(converted.scenes.map(cloneVideoScene));
    } catch {
      // Keep legacy scene edits available until every asset has a durable
      // reference; canonical adoption must never make the editor unusable.
      setCanonicalDocumentState(null);
      setLegacyScenes(candidate);
    }
  };

  useEffect(() => {
    if (initialProject.id === lastLoadedProjectRef.current) return;
    lastLoadedProjectRef.current = initialProject.id;
    setLegacyScenes(initialProject.scenes.map(cloneVideoScene));
    try {
      setCanonicalDocumentState(videoProjectToCreativeDocument(initialProject));
    } catch {
      setCanonicalDocumentState(null);
    }
    setProjectNameState(initialProject.name);
    setProjectId(initialProject.id);
    setUpdatedAt('updatedAt' in initialProject ? (initialProject as VideoProject & { updatedAt?: string }).updatedAt : undefined);
    setLastSavedAt('updatedAt' in initialProject ? (initialProject as VideoProject & { updatedAt?: string }).updatedAt : undefined);
    setHasLocalChanges(false);
  }, [initialProject]);

  useEffect(() => {
    projectRef.current = { ...initialProject, id: projectId, name: projectName, scenes };
  }, [initialProject, projectId, projectName, scenes]);

  useEffect(() => {
    if (!hasLocalChanges || !persistProject || !persistenceReady) return;
    const snapshot = projectRef.current;
    setSaveState('saving');
    const timer = window.setTimeout(() => {
      void persistProject(snapshot, updatedAt)
        .then((saved) => {
          setProjectId(saved.id);
          setCanonicalDocumentState((current) => current ? { ...current, id: saved.id, name: saved.name } : current);
          setUpdatedAt('updatedAt' in saved ? (saved as VideoProject & { updatedAt?: string }).updatedAt : undefined);
          setLastSavedAt('updatedAt' in saved ? (saved as VideoProject & { updatedAt?: string }).updatedAt : new Date().toISOString());
          setHasLocalChanges(false);
          setSaveState('saved');
        })
        .catch(() => setSaveState('error'));
    }, 350);
    return () => window.clearTimeout(timer);
  }, [hasLocalChanges, persistProject, persistenceReady, scenes, projectName, updatedAt]);

  const updateProjectName = (name: string) => {
    setProjectNameState(name);
    setCanonicalDocumentState((current) => current ? { ...current, name } : current);
    setHasLocalChanges(true);
  };

  const loadPreset = (presetScenes: Scene[]) => {
    setScenes(presetScenes.map(cloneVideoScene));
  };

  const updateScene = (sceneId: string, changes: Partial<Scene>) => {
    setScenes((current) => current.map((scene) => (
      scene.id === sceneId ? { ...scene, ...changes } : scene
    )));
  };

  const updateSceneContent = (sceneId: string, key: string, value: unknown) => {
    setScenes((current) => current.map((scene) => (
      scene.id === sceneId
        ? { ...scene, content: { ...scene.content, [key]: value } }
        : scene
    )));
  };

  const addLayer = (sceneId: string, type: LayerType, assetSrc = '', assetId?: string) => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-${type}-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };

      let layer: Layer;
      switch (type) {
        case 'text':
          layer = { id, type: 'text', text: 'Nuevo titular', timing, fontSize: 48, color: '#ffffff', position: 'center' } as TextLayer;
          break;
        case 'subtitle':
          layer = { id, type: 'subtitle', text: 'Subtítulo del vídeo', timing, stylePreset: 'viral-yellow', fontSize: 44, position: 'bottom' } as SubtitleLayer;
          break;
        case 'shape':
          layer = { id, type: 'shape', shape: 'pill', color: 'rgba(0, 95, 115, 0.4)', timing, width: 320, height: 80, position: 'center' } as ShapeLayer;
          break;
        case 'component':
          layer = { id, type: 'component', componentId: 'AdvisorCard', props: { name: 'Asesor VitaBlue', role: 'Especialista en Visados', cta: 'WhatsApp' }, timing, position: 'center' } as ComponentLayer;
          break;
        case 'audio':
          layer = { id, type: 'audio', src: '', timing, volume: 1 };
          break;
        case 'image':
        case 'video':
        default:
          layer = {
            id,
            type: type as 'image' | 'video',
            asset: { src: assetSrc, ...(assetId ? { assetId } : {}), alt: '' },
            timing,
          };
          break;
      }

      return {
        ...scene,
        layers: [...scene.layers, { ...layer, constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS } }],
      };
    }));
  };

  const addTextLayer = (sceneId: string, customText = 'Nuevo texto') => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-text-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: TextLayer = { id, type: 'text', text: customText, timing, fontSize: 48, color: '#ffffff', position: 'center' };
      return { ...scene, layers: [...scene.layers, { ...layer, constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS } }] };
    }));
  };

  const addSubtitleLayer = (sceneId: string, customText = 'Subtítulo dinámico') => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-sub-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: SubtitleLayer = { id, type: 'subtitle', text: customText, timing, stylePreset: 'viral-yellow', fontSize: 44, position: 'bottom' };
      return { ...scene, layers: [...scene.layers, { ...layer, constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS } }] };
    }));
  };

  const addComponentLayer = (sceneId: string, componentId: string, props: Record<string, unknown> = {}) => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-comp-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      
      let initialProps = props;
      if (Object.keys(props).length === 0) {
        if (componentId === 'MotionAdvisorCard' || componentId === 'AdvisorCard') {
          initialProps = { name: 'Sofía', role: 'Asesora Especialista en Visados', badge: 'ASESORA ASIGNADA · EN DIRECTO', whatsAppText: 'Pregúntanos por WhatsApp' };
        } else if (componentId === 'MotionTrustBadge') {
          initialProps = { title: 'PÓLIZA 100% VÁLIDA PARA VISADO', subtitle: 'Sin Copagos · Cobertura Completa · Repatriación Incluida', highlight: 'GARANTÍA CONSULAR', verifiedLabel: 'VERIFICADO' };
        } else if (componentId === 'MotionProviderGrid') {
          initialProps = { title: 'COMPAÑÍAS LÍDERES AUTORIZADAS', subtitle: 'Aceptadas oficialmente por Extranjería y Consulados' };
        } else if (componentId === 'MotionComparisonCard') {
          initialProps = { title: '¿SEGURO DE VIAJE O SEGURO DE VISADO?', wrongOptionTitle: 'Seguro de Viaje Común', wrongOptionDesc: '❌ Denegación inmediata: no cumple requisitos de Extranjería ni tiene red médica completa en España.', correctOptionTitle: 'Seguro VitaBlue Extranjería', correctOptionDesc: '✅ Aprobación garantizada: sin copagos, cobertura total y repatriación incluida.' };
        }
      }

      const layer: ComponentLayer = { id, type: 'component', componentId, props: initialProps, timing, position: 'center' };
      return { ...scene, layers: [...scene.layers, { ...layer, constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS } }] };
    }));
  };

  const removeLayer = (sceneId: string, layerId: string) => {
    setScenes((current) => current.map((scene) => (
      scene.id === sceneId
        ? { ...scene, layers: scene.layers.filter((layer) => layer.id !== layerId) }
        : scene
    )));
  };

  const duplicateLayer = (sceneId: string, layerId: string) => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const layer = scene.layers.find((l) => l.id === layerId);
      if (!layer) return scene;
      const duplicate: Layer = {
        ...cloneVideoLayer(layer),
        id: `${scene.id}-${layer.type}-${Date.now()}`,
      };
      return { ...scene, layers: [...scene.layers, duplicate] };
    }));
  };

  const updateLayer = (sceneId: string, layerId: string, changes: Partial<Layer>) => {
    setScenes((current) => current.map((scene) => (
      scene.id === sceneId
        ? { ...scene, layers: scene.layers.map((layer) => layer.id === layerId ? { ...layer, ...changes } as Layer : layer) }
        : scene
    )));
  };

  const addScene = (templateId: SceneTemplateId = 'text_hook') => {
    const id = createSceneId(scenes);
    setScenes((current) => [
      ...current,
      {
        id,
        templateId,
        durationInFrames: 150,
        content: {},
        layers: [],
      },
    ]);
    return id;
  };

  const duplicateScene = (sceneId: string) => {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      if (index < 0) return current;

      const source = current[index];
      const duplicate: Scene = {
        ...cloneVideoScene(source),
        id: createSceneId(current),
      };

      return [...current.slice(0, index + 1), duplicate, ...current.slice(index + 1)];
    });
  };

  const removeScene = (sceneId: string) => {
    setScenes((current) => current.filter((scene) => scene.id !== sceneId));
  };

  const splitScene = (sceneId: string, splitLocalFrame: number) => {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      if (index < 0) return current;

      const source = current[index];
      if (splitLocalFrame <= 15 || splitLocalFrame >= source.durationInFrames - 15) {
        return current; // Evitar splits demasiado pequeños
      }

      const firstPart: Scene = {
        ...source,
        durationInFrames: splitLocalFrame,
        layers: source.layers.map(cloneVideoLayer),
      };

      const secondPart: Scene = {
        ...source,
        id: createSceneId(current),
        durationInFrames: source.durationInFrames - splitLocalFrame,
        content: { ...source.content },
        layers: source.layers.map((l) => ({ ...cloneVideoLayer(l), id: `${l.id}-split` })),
      };

      return [...current.slice(0, index), firstPart, secondPart, ...current.slice(index + 1)];
    });
  };

  const moveScene = (sceneId: string, direction: 'up' | 'down') => {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      if (index < 0) return current;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= current.length) return current;

      const updated = [...current];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const moveSceneToIndex = (sceneId: string, targetIndex: number) => {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length || index === targetIndex) {
        return current;
      }

      const updated = [...current];
      const [moved] = updated.splice(index, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  const updateLayerPosition = (sceneId: string, layerId: string, position: { x: number; y: number }) => {
    updateLayer(sceneId, layerId, { position });
  };

  const reorderLayer = (sceneId: string, layerId: string, direction: 'up' | 'down') => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const index = scene.layers.findIndex((l) => l.id === layerId);
      if (index < 0) return scene;
      const targetIndex = direction === 'up' ? index + 1 : index - 1;
      if (targetIndex < 0 || targetIndex >= scene.layers.length) return scene;

      const layers = [...scene.layers];
      const [moved] = layers.splice(index, 1);
      layers.splice(targetIndex, 0, moved);
      return { ...scene, layers };
    }));
  };

  const getSceneWarnings = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return [];
    return getVideoSceneWarnings(scene);
  };

  return {
    scenes,
    project: { ...initialProject, id: projectId, name: projectName, scenes, ...(updatedAt ? { updatedAt } : {}) } as VideoProject,
    canonicalRuntime,
    creativeDocument,
    canonicalDocument: canonicalRuntime ? canonicalDocumentState : null,
    applyCreativeDocument,
    addCreativeLayer: addCreativeLayerToDocument,
    updateCreativeLayer,
    duplicateCreativeLayer: duplicateCreativeLayerInDocument,
    removeCreativeLayer: removeCreativeLayerFromDocument,
    reorderCreativeLayer: reorderCreativeLayerInDocument,
    moveCreativeLayer: moveCreativeLayerInDocument,
    resizeCreativeLayer: resizeCreativeLayerInDocument,
    rotateCreativeLayer: rotateCreativeLayerInDocument,
    scaleCreativeLayer: scaleCreativeLayerInDocument,
    updateSceneTiming,
    updateLayerTiming,
    updateLayerKeyframes,
    updateSceneTransition,
    projectName,
    updateProjectName,
    saveState,
    lastSavedAt,
    setScenes,
    updateScene,
    updateSceneContent,
    addScene,
    duplicateScene,
    removeScene,
    splitScene,
    moveScene,
    moveSceneToIndex,
    addLayer,
    addTextLayer,
    addSubtitleLayer,
    addComponentLayer,
    duplicateLayer,
    removeLayer,
    updateLayer,
    updateLayerPosition,
    reorderLayer,
    getSceneWarnings,
    loadPreset,
  };
};
