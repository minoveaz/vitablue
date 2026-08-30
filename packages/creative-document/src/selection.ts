import type { CreativeDocument, CreativeLayer, Geometry } from './types';

export interface SelectionState {
  readonly selectedLayerIds: readonly string[];
  readonly primaryLayerId: string | null;
}

export interface SelectionBoundsOptions {
  mode?: 'intersects' | 'contains';
  includeGroups?: boolean;
}

export const createSelectionState = (ids: readonly string[] = []): SelectionState => {
  const unique = [...new Set(ids)];
  return { selectedLayerIds: unique, primaryLayerId: unique[0] ?? null };
};

const stateWith = (ids: readonly string[], primaryLayerId?: string | null): SelectionState => {
  const unique = [...new Set(ids)];
  return {
    selectedLayerIds: unique,
    primaryLayerId: primaryLayerId && unique.includes(primaryLayerId) ? primaryLayerId : unique[0] ?? null,
  };
};

export const selectLayer = (
  state: SelectionState,
  layerId: string,
  additive = false,
): SelectionState => stateWith(additive ? [...state.selectedLayerIds, layerId] : [layerId], layerId);

export const selectLayers = (state: SelectionState, layerIds: readonly string[]): SelectionState =>
  stateWith(layerIds, layerIds[0] ?? state.primaryLayerId);

export const toggleLayerSelection = (state: SelectionState, layerId: string): SelectionState => {
  if (state.selectedLayerIds.includes(layerId)) {
    const remaining = state.selectedLayerIds.filter((id) => id !== layerId);
    return stateWith(remaining, remaining[0] ?? null);
  }
  return stateWith([...state.selectedLayerIds, layerId], layerId);
};

export const clearSelection = (): SelectionState => createSelectionState();

const allLayers = (layers: CreativeLayer[], includeGroups: boolean): CreativeLayer[] =>
  layers.flatMap((layer) => {
    if (layer.type !== 'group') return [layer];
    return [
      ...(includeGroups ? [layer] : []),
      ...allLayers(layer.children, includeGroups),
    ];
  });

export const selectAll = (
  document: CreativeDocument,
  sceneId: string,
  options: { includeGroups?: boolean } = {},
): SelectionState => {
  const scene = document.scenes.find((candidate) => candidate.id === sceneId);
  if (!scene) return clearSelection();
  return stateWith(allLayers(scene.layers, options.includeGroups === true).map((layer) => layer.id));
};

const intersects = (a: Geometry, b: Geometry): boolean =>
  a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

const contains = (outer: Geometry, inner: Geometry): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

export const selectLayersByBounds = (
  document: CreativeDocument,
  sceneId: string,
  bounds: Geometry,
  options: SelectionBoundsOptions = {},
): SelectionState => {
  const scene = document.scenes.find((candidate) => candidate.id === sceneId);
  if (!scene) return clearSelection();
  const mode = options.mode ?? 'intersects';
  const ids = allLayers(scene.layers, options.includeGroups === true)
    .filter((layer) => mode === 'contains' ? contains(bounds, layer.geometry) : intersects(bounds, layer.geometry))
    .map((layer) => layer.id);
  return stateWith(ids);
};

export const selectByBounds = selectLayersByBounds;
