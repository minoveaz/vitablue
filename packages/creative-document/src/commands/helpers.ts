import type { CreativeDocument, CreativeLayer, CreativeScene, GroupLayer, Point } from '../types';
import { CreativeCommandError } from './errors';

export interface LayerContext {
  layer: CreativeLayer;
  ancestors: CreativeLayer[];
  parentId: string | null;
  index: number;
}

export const cloneLayer = (layer: CreativeLayer): CreativeLayer => {
  const clone = <T>(value: T): T => {
    if (Array.isArray(value)) return value.map((item) => clone(item)) as T;
    if (typeof value === 'object' && value !== null) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, clone(item)]),
      ) as T;
    }
    return value;
  };
  return clone(layer);
};

export const layerIds = (layer: CreativeLayer): string[] =>
  layer.type === 'group' ? [layer.id, ...layer.children.flatMap(layerIds)] : [layer.id];

export const assertUniqueLayerIds = (layers: CreativeLayer[], sceneId: string): void => {
  const seen = new Set<string>();
  const visit = (layer: CreativeLayer): void => {
    if (seen.has(layer.id)) {
      throw new CreativeCommandError(
        'duplicate-layer-id',
        `Duplicate layer id "${layer.id}" in scene "${sceneId}".`,
        { sceneId, layerId: layer.id },
      );
    }
    seen.add(layer.id);
    if (layer.type === 'group') layer.children.forEach(visit);
  };
  layers.forEach(visit);
};

export const sceneFor = (document: CreativeDocument, sceneId: string): CreativeScene => {
  const scene = document.scenes.find((candidate) => candidate.id === sceneId);
  if (!scene) {
    throw new CreativeCommandError('scene-not-found', `Scene "${sceneId}" does not exist.`, { sceneId });
  }
  assertUniqueLayerIds(scene.layers, sceneId);
  return scene;
};

const visitLayers = (
  layers: CreativeLayer[],
  parentId: string | null,
  ancestors: CreativeLayer[],
  targetId: string,
): LayerContext | undefined => {
  for (const [index, layer] of layers.entries()) {
    if (layer.id === targetId) return { layer, ancestors, parentId, index };
    if (layer.type === 'group') {
      const result = visitLayers(layer.children, layer.id, [...ancestors, layer], targetId);
      if (result) return result;
    }
  }
  return undefined;
};

export const contextFor = (scene: CreativeScene, layerId: string): LayerContext => {
  const context = visitLayers(scene.layers, null, [], layerId);
  if (!context) {
    throw new CreativeCommandError(
      'layer-not-found',
      `Layer "${layerId}" does not exist in scene "${scene.id}".`,
      { sceneId: scene.id, layerId },
    );
  }
  return context;
};

export const assertMutable = (context: LayerContext, sceneId: string, layerId: string): void => {
  const lockedAncestor = [...context.ancestors, context.layer].find((layer) => layer.locked);
  if (lockedAncestor) {
    throw new CreativeCommandError(
      'layer-locked',
      `Layer "${layerId}" cannot be mutated because "${lockedAncestor.id}" is locked.`,
      { sceneId, layerId },
    );
  }
};

export const rewriteLayer = (
  layers: CreativeLayer[],
  targetId: string,
  updater: (layer: CreativeLayer) => CreativeLayer,
): { layers: CreativeLayer[]; found: boolean } => {
  let found = false;
  const nextLayers = layers.map((layer) => {
    if (layer.id === targetId) {
      found = true;
      return updater(layer);
    }
    if (layer.type !== 'group') return layer;
    const result = rewriteLayer(layer.children, targetId, updater);
    if (!result.found) return layer;
    found = true;
    return { ...layer, children: result.layers };
  });
  return { layers: nextLayers, found };
};

export const rewriteContainer = (
  layers: CreativeLayer[],
  parentId: string | null,
  updater: (layers: CreativeLayer[]) => CreativeLayer[],
): { layers: CreativeLayer[]; found: boolean } => {
  if (parentId === null) return { layers: updater(layers), found: true };
  let found = false;
  const nextLayers = layers.map((layer) => {
    if (layer.id === parentId && layer.type === 'group') {
      found = true;
      return { ...layer, children: updater(layer.children) };
    }
    if (layer.type !== 'group' || found) return layer;
    const result = rewriteContainer(layer.children, parentId, updater);
    if (!result.found) return layer;
    found = true;
    return { ...layer, children: result.layers };
  });
  return { layers: nextLayers, found };
};

export const sceneWithLayers = (
  document: CreativeDocument,
  sceneId: string,
  layers: CreativeLayer[],
): CreativeDocument => ({
  ...document,
  scenes: document.scenes.map((scene) => (scene.id === sceneId ? { ...scene, layers } : scene)),
});

export const uniqueId = (base: string, used: Set<string>): string => {
  if (!used.has(base)) return base;
  let suffix = 2;
  while (used.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
};

export const clampPoint = (point: Point): Point => ({
  x: Math.max(0, Math.min(1, point.x)),
  y: Math.max(0, Math.min(1, point.y)),
});

export const isGroup = (layer: CreativeLayer): layer is GroupLayer => layer.type === 'group';
