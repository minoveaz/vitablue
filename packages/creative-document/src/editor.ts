import {
  addLayer,
  duplicateLayer,
  groupLayers,
  moveLayer,
  removeLayer,
  reorderLayer,
  resizeLayer,
  rotateLayer,
  scaleLayer,
  updateLayer,
} from './commands';
import type { CreativeLayer, CreativeDocument, Point } from './types';
import { createSelectionState, type SelectionState, selectLayer, selectLayers, clearSelection } from './selection';
import { createSemanticHistory, type SemanticHistory } from './history';
import type { MoveLayerInput, ResizeLayerInput, ResizeLayerOptions, TransformConstraints } from './commands/transforms';
import type { CreativeLayerPatch, GroupLayersOptions, ReorderLayerInput } from './commands/layerCommands';
import { validateCreativeDocument } from './schema';

export interface CreativeDocumentEditorOptions {
  historyLimit?: number;
}

export interface CreativeDocumentEditor {
  readonly history: SemanticHistory<CreativeDocument>;
  readonly document: CreativeDocument;
  readonly selection: SelectionState;
  apply(next: CreativeDocument, label?: string): CreativeDocument;
  updateLayer(sceneId: string, layerId: string, changes: CreativeLayerPatch, label?: string): CreativeDocument;
  addLayer(sceneId: string, layer: CreativeLayer, parentGroupId?: string, label?: string): CreativeDocument;
  duplicateLayer(sceneId: string, layerId: string, options?: { id?: string; offset?: Point; zIndex?: number }, label?: string): CreativeDocument;
  removeLayer(sceneId: string, layerId: string, label?: string): CreativeDocument;
  reorderLayer(sceneId: string, layerId: string, input: ReorderLayerInput, label?: string): CreativeDocument;
  moveLayer(sceneId: string, layerId: string, input: MoveLayerInput, constraints?: TransformConstraints, label?: string): CreativeDocument;
  resizeLayer(sceneId: string, layerId: string, input: ResizeLayerInput, options?: ResizeLayerOptions, label?: string): CreativeDocument;
  rotateLayer(sceneId: string, layerId: string, rotation: number, options?: { relative?: boolean }, label?: string): CreativeDocument;
  scaleLayer(sceneId: string, layerId: string, scale: number | Point, constraints?: TransformConstraints, label?: string): CreativeDocument;
  groupLayers(sceneId: string, layerIds: string[], options?: GroupLayersOptions, label?: string): CreativeDocument;
  select(layerId: string, additive?: boolean): SelectionState;
  selectMany(layerIds: string[]): SelectionState;
  clearSelection(): SelectionState;
  undo(): CreativeDocument;
  redo(): CreativeDocument;
}

export const createCreativeDocumentEditor = (
  initial: CreativeDocument,
  options: CreativeDocumentEditorOptions = {},
): CreativeDocumentEditor => {
  const history = createSemanticHistory(validateCreativeDocument(initial), {
    limit: options.historyLimit,
    clone: (document) => JSON.parse(JSON.stringify(document)) as CreativeDocument,
    equals: (left, right) => JSON.stringify(left) === JSON.stringify(right),
  });
  let selection = createSelectionState();
  const apply = (next: CreativeDocument, label?: string): CreativeDocument => {
    const validated = validateCreativeDocument(next);
    history.apply(validated, { label });
    return history.present;
  };
  const operation = (next: CreativeDocument, label?: string): CreativeDocument => apply(next, label);
  return {
    history,
    get document() { return history.present; },
    get selection() { return selection; },
    apply,
    updateLayer: (sceneId, layerId, changes, label) => operation(updateLayer(history.present, sceneId, layerId, changes), label),
    addLayer: (sceneId, layer, parentGroupId, label) => operation(addLayer(history.present, sceneId, layer, parentGroupId), label),
    duplicateLayer: (sceneId, layerId, options, label) => operation(duplicateLayer(history.present, sceneId, layerId, options), label),
    removeLayer: (sceneId, layerId, label) => operation(removeLayer(history.present, sceneId, layerId), label),
    reorderLayer: (sceneId, layerId, input, label) => operation(reorderLayer(history.present, sceneId, layerId, input), label),
    moveLayer: (sceneId, layerId, input, constraints, label) => operation(moveLayer(history.present, sceneId, layerId, input, constraints), label),
    resizeLayer: (sceneId, layerId, input, options, label) => operation(resizeLayer(history.present, sceneId, layerId, input, options), label),
    rotateLayer: (sceneId, layerId, rotation, options, label) => operation(rotateLayer(history.present, sceneId, layerId, rotation, options), label),
    scaleLayer: (sceneId, layerId, scale, constraints, label) => operation(scaleLayer(history.present, sceneId, layerId, scale, constraints), label),
    groupLayers: (sceneId, layerIds, options, label) => operation(groupLayers(history.present, sceneId, layerIds, options), label),
    select: (layerId, additive = false) => {
      selection = selectLayer(selection, layerId, additive);
      return selection;
    },
    selectMany: (layerIds) => {
      selection = selectLayers(selection, layerIds);
      return selection;
    },
    clearSelection: () => {
      selection = clearSelection();
      return selection;
    },
    undo: () => history.undo(),
    redo: () => history.redo(),
  };
};
