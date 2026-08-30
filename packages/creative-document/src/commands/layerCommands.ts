import type {
  AssetRef,
  CreativeDocument,
  CreativeLayer,
  Geometry,
  JsonObject,
  Point,
  ShapeKind,
  Transform,
} from '../types';
import {
  assertMutable,
  assertUniqueLayerIds,
  cloneLayer,
  contextFor,
  rewriteContainer,
  rewriteLayer,
  sceneFor,
  sceneWithLayers,
  uniqueId,
} from './helpers';
import { CreativeCommandError } from './errors';
import {
  moveTransform,
  resizeGeometry,
  scaleTransform,
  type MoveLayerInput,
  type ResizeLayerInput,
  type ResizeLayerOptions,
  type TransformConstraints,
} from './transforms';

export type CreativeLayerPatch = Partial<{
  name: string;
  transform: Partial<Transform>;
  geometry: Geometry;
  appearance: CreativeLayer['appearance'];
  timing: CreativeLayer['timing'];
  visible: boolean;
  locked: boolean;
  zIndex: number;
  extensions: CreativeLayer['extensions'];
  text: string;
  shape: ShapeKind;
  asset: AssetRef;
  crop: Geometry;
  volume: number;
  componentId: string;
  props: JsonObject;
  children: CreativeLayer[];
  clipContent: boolean;
}>;

const withSceneLayers = (
  document: CreativeDocument,
  sceneId: string,
  updater: (layers: CreativeLayer[], sceneId: string) => CreativeLayer[],
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  return sceneWithLayers(document, sceneId, updater(scene.layers, sceneId));
};

export const updateLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  changes: CreativeLayerPatch,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => {
    const { transform, ...topLevelChanges } = changes;
    return {
      ...cloneLayer(layer),
      ...topLevelChanges,
      ...(transform ? {
        transform: {
          ...layer.transform,
          ...transform,
          ...(transform.position ? { position: { ...layer.transform.position, ...transform.position } } : {}),
          ...(transform.anchor ? { anchor: { ...layer.transform.anchor, ...transform.anchor } } : {}),
          ...(transform.scale ? { scale: { ...layer.transform.scale, ...transform.scale } } : {}),
        },
      } : {}),
    } as CreativeLayer;
  });
  if (!result.found) throw new CreativeCommandError('layer-not-found', `Layer "${layerId}" does not exist.`, { sceneId, layerId });
  assertUniqueLayerIds(result.layers, sceneId);
  return sceneWithLayers(document, sceneId, result.layers);
};

export const addLayer = (
  document: CreativeDocument,
  sceneId: string,
  layer: CreativeLayer,
  parentGroupId?: string,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const incomingIds = new Set<string>();
  const collect = (candidate: CreativeLayer): void => {
    if (incomingIds.has(candidate.id)) {
      throw new CreativeCommandError('duplicate-layer-id', `Duplicate layer id "${candidate.id}".`, { sceneId, layerId: candidate.id });
    }
    incomingIds.add(candidate.id);
    if (candidate.type === 'group') candidate.children.forEach(collect);
  };
  collect(layer);
  const existingIds = new Set<string>();
  scene.layers.forEach((candidate) => {
    const visit = (nested: CreativeLayer): void => {
      existingIds.add(nested.id);
      if (nested.type === 'group') nested.children.forEach(visit);
    };
    visit(candidate);
  });
  const duplicateIncomingId = [...incomingIds].find((id) => existingIds.has(id));
  if (duplicateIncomingId) {
    throw new CreativeCommandError('duplicate-layer-id', `Layer id "${duplicateIncomingId}" already exists.`, { sceneId, layerId: duplicateIncomingId });
  }
  if (parentGroupId !== undefined) {
    const parent = contextFor(scene, parentGroupId);
    if (parent.layer.type !== 'group') throw new CreativeCommandError('invalid-operation', `Layer "${parentGroupId}" is not a group.`, { sceneId, layerId: parentGroupId });
    assertMutable(parent, sceneId, parentGroupId);
  }
  const cloned = cloneLayer(layer);
  const next = withSceneLayers(document, sceneId, (layers) => rewriteContainer(layers, parentGroupId ?? null, (items) => [...items, cloned]).layers);
  assertUniqueLayerIds(next.scenes.find((candidate) => candidate.id === sceneId)?.layers ?? [], sceneId);
  return next;
};

const cloneWithIds = (layer: CreativeLayer, rootId: string, used: Set<string>): CreativeLayer => {
  const idMap = new Map<string, string>();
  const collect = (candidate: CreativeLayer, isRoot: boolean): void => {
    const nextId = isRoot ? rootId : uniqueId(`${candidate.id}-copy`, used);
    idMap.set(candidate.id, nextId);
    used.add(nextId);
    if (candidate.type === 'group') candidate.children.forEach((child) => collect(child, false));
  };
  collect(layer, true);
  const replace = (candidate: CreativeLayer): CreativeLayer => {
    const next = { ...cloneLayer(candidate), id: idMap.get(candidate.id) ?? candidate.id };
    return next.type === 'group' ? { ...next, children: next.children.map(replace) } : next;
  };
  return replace(layer);
};

export const duplicateLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  options: { id?: string; offset?: Point; zIndex?: number } = {},
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const used = new Set(scene.layers.flatMap((layer) => {
    const ids: string[] = [];
    const visit = (candidate: CreativeLayer): void => { ids.push(candidate.id); if (candidate.type === 'group') candidate.children.forEach(visit); };
    visit(layer);
    return ids;
  }));
  const requestedId = options.id ?? `${layerId}-copy`;
  if (options.id && used.has(requestedId)) {
    throw new CreativeCommandError('duplicate-layer-id', `Layer id "${requestedId}" already exists.`, { sceneId, layerId: requestedId });
  }
  const duplicate = cloneWithIds(context.layer, uniqueId(requestedId, used), used);
  const offset = options.offset ?? { x: 0, y: 0 };
  const moved = {
    ...duplicate,
    transform: moveTransform(duplicate, { dx: offset.x, dy: offset.y }, {}),
    zIndex: options.zIndex ?? Math.max(...scene.layers.map((layer) => layer.zIndex ?? 0), 0) + 1,
  } as CreativeLayer;
  return withSceneLayers(document, sceneId, (layers) =>
    rewriteContainer(layers, context.parentId, (items) => {
      const next = [...items];
      next.splice(context.index + 1, 0, moved);
      return next;
    }).layers,
  );
};

export const removeLayer = (document: CreativeDocument, sceneId: string, layerId: string): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  return withSceneLayers(document, sceneId, (layers) =>
    rewriteContainer(layers, context.parentId, (items) => items.filter((layer) => layer.id !== layerId)).layers,
  );
};

export type ReorderLayerInput = number | { toIndex: number } | { direction: 'up' | 'down' };

export const reorderLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  input: ReorderLayerInput,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  return withSceneLayers(document, sceneId, (layers) =>
    rewriteContainer(layers, context.parentId, (items) => {
      const targetIndex = typeof input === 'number'
        ? input
        : 'toIndex' in input
          ? input.toIndex
          : context.index + (input.direction === 'up' ? -1 : 1);
      if (!Number.isInteger(targetIndex) || targetIndex < 0 || targetIndex >= items.length) {
        throw new CreativeCommandError('invalid-input', `Invalid target index "${targetIndex}".`, { sceneId, layerId });
      }
      if (targetIndex === context.index) return items;
      const next = [...items];
      const [moved] = next.splice(context.index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    }).layers,
  );
};

export const setLayerVisibility = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  visible?: boolean,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  contextFor(scene, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => ({
    ...cloneLayer(layer),
    visible: visible ?? layer.visible === false,
  }));
  return sceneWithLayers(document, sceneId, result.layers);
};

export const setLayerLocked = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  locked?: boolean,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  contextFor(scene, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => ({
    ...cloneLayer(layer),
    locked: locked ?? !layer.locked,
  }));
  return sceneWithLayers(document, sceneId, result.layers);
};

export const moveLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  input: MoveLayerInput,
  constraints: TransformConstraints = {},
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => ({
    ...cloneLayer(layer),
    transform: moveTransform(layer, input, constraints),
  }));
  return sceneWithLayers(document, sceneId, result.layers);
};

export const resizeLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  input: ResizeLayerInput,
  options: ResizeLayerOptions = {},
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => {
    const resized = resizeGeometry(layer, input, options);
    return { ...cloneLayer(layer), geometry: resized.geometry, transform: resized.transform };
  });
  return sceneWithLayers(document, sceneId, result.layers);
};

export const rotateLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  rotation: number,
  options: { relative?: boolean } = {},
): CreativeDocument => {
  if (!Number.isFinite(rotation)) throw new CreativeCommandError('invalid-input', 'Rotation must be finite.', { sceneId, layerId });
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => ({
    ...cloneLayer(layer),
    transform: {
      ...layer.transform,
      rotation: options.relative ? layer.transform.rotation + rotation : rotation,
    },
  }));
  return sceneWithLayers(document, sceneId, result.layers);
};

export const scaleLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
  scale: number | Point,
  constraints: TransformConstraints = {},
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  assertMutable(context, sceneId, layerId);
  const result = rewriteLayer(scene.layers, layerId, (layer) => ({
    ...cloneLayer(layer),
    transform: scaleTransform(layer, scale, constraints),
  }));
  return sceneWithLayers(document, sceneId, result.layers);
};

export interface GroupLayersOptions {
  id?: string;
  name?: string;
  clipContent?: boolean;
}

const boundsOf = (layers: CreativeLayer[]): Geometry => {
  const left = Math.min(...layers.map((layer) => layer.geometry.x));
  const top = Math.min(...layers.map((layer) => layer.geometry.y));
  const right = Math.max(...layers.map((layer) => layer.geometry.x + layer.geometry.width));
  const bottom = Math.max(...layers.map((layer) => layer.geometry.y + layer.geometry.height));
  return { x: left, y: top, width: Math.max(0.000001, right - left), height: Math.max(0.000001, bottom - top) };
};

export const groupLayers = (
  document: CreativeDocument,
  sceneId: string,
  layerIds: string[],
  options: GroupLayersOptions = {},
): CreativeDocument => {
  if (layerIds.length < 2 || new Set(layerIds).size !== layerIds.length) {
    throw new CreativeCommandError('invalid-input', 'A group requires at least two distinct layers.', { sceneId });
  }
  const scene = sceneFor(document, sceneId);
  const contexts = layerIds.map((layerId) => contextFor(scene, layerId));
  const parentId = contexts[0].parentId;
  if (contexts.some((context) => context.parentId !== parentId)) {
    throw new CreativeCommandError('invalid-operation', 'Only sibling layers can be grouped.', { sceneId });
  }
  contexts.forEach((context) => assertMutable(context, sceneId, context.layer.id));
  const used = new Set<string>();
  scene.layers.forEach((layer) => {
    const visit = (candidate: CreativeLayer): void => { used.add(candidate.id); if (candidate.type === 'group') candidate.children.forEach(visit); };
    visit(layer);
  });
  const groupId = uniqueId(options.id ?? `${sceneId}-group`, used);
  if (options.id && used.has(options.id)) {
    throw new CreativeCommandError('duplicate-layer-id', `Layer id "${options.id}" already exists.`, { sceneId, layerId: options.id });
  }
  const children = contexts
    .slice()
    .sort((a, b) => a.index - b.index)
    .map((context) => cloneLayer(context.layer));
  const geometry = boundsOf(children);
  const group: CreativeLayer = {
    id: groupId,
    type: 'group',
    name: options.name,
    transform: {
      position: { x: geometry.x + geometry.width / 2, y: geometry.y + geometry.height / 2 },
      anchor: { x: 0.5, y: 0.5 },
      rotation: 0,
      scale: { x: 1, y: 1 },
    },
    geometry,
    children,
    ...(options.clipContent === undefined ? {} : { clipContent: options.clipContent }),
    zIndex: Math.max(...children.map((child) => child.zIndex ?? 0), 0),
  };
  const selected = new Set(layerIds);
  return withSceneLayers(document, sceneId, (layers) =>
    rewriteContainer(layers, parentId, (items) => {
      const indexes = items.flatMap((item, index) => selected.has(item.id) ? [index] : []);
      const firstIndex = Math.min(...indexes);
      const remaining = items.filter((item) => !selected.has(item.id));
      remaining.splice(firstIndex, 0, group);
      return remaining;
    }).layers,
  );
};

export const ungroupLayer = (
  document: CreativeDocument,
  sceneId: string,
  layerId: string,
): CreativeDocument => {
  const scene = sceneFor(document, sceneId);
  const context = contextFor(scene, layerId);
  if (context.layer.type !== 'group') throw new CreativeCommandError('invalid-operation', `Layer "${layerId}" is not a group.`, { sceneId, layerId });
  assertMutable(context, sceneId, layerId);
  const group = context.layer;
  return withSceneLayers(document, sceneId, (layers) =>
    rewriteContainer(layers, context.parentId, (items) => {
      const index = items.findIndex((item) => item.id === layerId);
      if (index < 0) return items;
      return [...items.slice(0, index), ...group.children.map(cloneLayer), ...items.slice(index + 1)];
    }).layers,
  );
};

export type { MoveLayerInput, ResizeLayerInput, ResizeLayerOptions, TransformConstraints };
