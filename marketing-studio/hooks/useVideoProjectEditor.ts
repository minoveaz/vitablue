import { useState } from 'react';
import type { Layer, LayerType, Scene, SceneTemplateId, ShapeLayer, SubtitleLayer, TextLayer, ComponentLayer } from '../../packages/video-studio/src/domain/videoProject';
import { defaultVisaRejectionProject } from '../../packages/video-studio/src/domain/defaultProject';
import { getVideoSceneWarnings } from './videoSceneValidation';

const createSceneId = (scenes: Scene[]): string => {
  const usedIds = new Set(scenes.map((scene) => scene.id));
  let index = scenes.length + 1;

  while (usedIds.has(`slide_${index}`)) index += 1;
  return `slide_${index}`;
};

export const useVideoProjectEditor = (initialScenes: Scene[] = defaultVisaRejectionProject.scenes) => {
  const [scenes, setScenes] = useState<Scene[]>(initialScenes);

  const loadPreset = (presetScenes: Scene[]) => {
    setScenes(presetScenes.map((scene) => ({
      ...scene,
      content: { ...scene.content },
      layers: [...scene.layers],
    })));
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

  const addLayer = (sceneId: string, type: LayerType) => {
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
          layer = { id, type: type as 'image' | 'video', asset: { src: '', alt: '' }, timing };
          break;
      }

      return { ...scene, layers: [...scene.layers, layer] };
    }));
  };

  const addTextLayer = (sceneId: string, customText = 'Nuevo texto') => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-text-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: TextLayer = { id, type: 'text', text: customText, timing, fontSize: 48, color: '#ffffff', position: 'center' };
      return { ...scene, layers: [...scene.layers, layer] };
    }));
  };

  const addSubtitleLayer = (sceneId: string, customText = 'Subtítulo dinámico') => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-sub-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: SubtitleLayer = { id, type: 'subtitle', text: customText, timing, stylePreset: 'viral-yellow', fontSize: 44, position: 'bottom' };
      return { ...scene, layers: [...scene.layers, layer] };
    }));
  };

  const addComponentLayer = (sceneId: string, componentId: string, props: Record<string, unknown> = {}) => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-comp-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: ComponentLayer = { id, type: 'component', componentId, props, timing, position: 'center' };
      return { ...scene, layers: [...scene.layers, layer] };
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
        ...layer,
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
        ...source,
        id: createSceneId(current),
        content: { ...source.content },
        layers: [...source.layers],
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
      };

      const secondPart: Scene = {
        ...source,
        id: createSceneId(current),
        durationInFrames: source.durationInFrames - splitLocalFrame,
        content: { ...source.content },
        layers: source.layers.map((l) => ({ ...l, id: `${l.id}-split` })),
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

  const getSceneWarnings = (sceneId: string) => {
    const scene = scenes.find((s) => s.id === sceneId);
    if (!scene) return [];
    return getVideoSceneWarnings(scene);
  };

  return {
    scenes,
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
    getSceneWarnings,
    loadPreset,
  };
};
