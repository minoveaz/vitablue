import { useState } from 'react';
import type { Layer, LayerType, Scene, SceneTemplateId } from '../../packages/video-studio/src/domain/videoProject';
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

  const addLayer = (sceneId: string, type: Exclude<LayerType, 'shape' | 'component'>) => {
    setScenes((current) => current.map((scene) => {
      if (scene.id !== sceneId) return scene;
      const id = `${scene.id}-${type}-${scene.layers.length + 1}`;
      const timing = { startFrame: 0, durationInFrames: scene.durationInFrames };
      const layer: Layer = type === 'text'
        ? { id, type, text: 'Nuevo texto', timing }
        : type === 'audio'
          ? { id, type, src: '', timing, volume: 1 }
          : { id, type, asset: { src: '', alt: '' }, timing };
      return { ...scene, layers: [...scene.layers, layer] };
    }));
  };

  const addTextLayer = (sceneId: string) => addLayer(sceneId, 'text');

  const removeLayer = (sceneId: string, layerId: string) => {
    setScenes((current) => current.map((scene) => (
      scene.id === sceneId
        ? { ...scene, layers: scene.layers.filter((layer) => layer.id !== layerId) }
        : scene
    )));
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
    setScenes((current) => current.length > 1
      ? current.filter((scene) => scene.id !== sceneId)
      : current);
  };

  const moveScene = (sceneId: string, direction: 'up' | 'down') => {
    setScenes((current) => {
      const index = current.findIndex((scene) => scene.id === sceneId);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (index < 0 || targetIndex < 0 || targetIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const moveSceneToIndex = (sceneId: string, targetIndex: number) => {
    setScenes((current) => {
      const sourceIndex = current.findIndex((scene) => scene.id === sceneId);
      if (sourceIndex < 0 || targetIndex < 0 || targetIndex >= current.length || sourceIndex === targetIndex) {
        return current;
      }

      const next = [...current];
      const [scene] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, scene);
      return next;
    });
  };

  const getSceneWarnings = (sceneId: string) => {
    const scene = scenes.find((item) => item.id === sceneId);
    return scene ? getVideoSceneWarnings(scene) : [];
  };

  return {
    scenes,
    setScenes,
    updateScene,
    updateSceneContent,
    addTextLayer,
    addLayer,
    removeLayer,
    updateLayer,
    addScene,
    duplicateScene,
    removeScene,
    moveScene,
    moveSceneToIndex,
    getSceneWarnings,
    loadPreset,
  };
};
