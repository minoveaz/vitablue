import { describe, expect, it } from 'vitest';
import type { CreativeDocument, CreativeLayer, VideoLayer } from '../types';
import {
  CreativeCommandError,
  addLayer,
  duplicateLayer,
  groupLayers,
  moveLayer,
  removeLayer,
  reorderLayer,
  resizeLayer,
  rotateLayer,
  scaleLayer,
  setLayerLocked,
  setLayerVisibility,
  ungroupLayer,
  updateLayer,
} from '../index';
import {
  clearSelection,
  createSelectionState,
  selectAll,
  selectLayer,
  selectLayersByBounds,
  toggleLayerSelection,
} from '../selection';
import { SemanticHistory } from '../history';

const layer = (id: string, overrides: Partial<CreativeLayer> = {}): CreativeLayer => ({
  id,
  type: 'shape',
  shape: 'rectangle',
  transform: { position: { x: 0.25, y: 0.25 }, anchor: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 } },
  geometry: { x: 0.1, y: 0.1, width: 0.2, height: 0.2 },
  zIndex: 1,
  ...overrides,
} as CreativeLayer);

const documentWith = (...layers: CreativeLayer[]): CreativeDocument => ({
  schemaVersion: 1,
  id: 'doc',
  name: 'Test',
  mode: 'image',
  canvas: { id: 'canvas', width: 1000, height: 1000 },
  scenes: [{ id: 'scene', layers }],
});

describe('CreativeDocument layer commands', () => {
  it('are immutable and preserve unrelated fields and video timing', () => {
    const video = layer('video', {
      type: 'video',
      asset: { assetId: 'asset', storagePath: 'videos/source.mp4' },
      timing: { startMs: 500, durationMs: 2500 },
      extensions: { videoStudio: { transition: 'fade' } },
    } as Partial<VideoLayer>);
    const document = documentWith(video);
    const next = moveLayer(document, 'scene', 'video', { dx: 0.1, dy: 0.1 });
    expect(next).not.toBe(document);
    expect(next.scenes[0]).not.toBe(document.scenes[0]);
    expect(next.scenes[0].layers[0]).not.toBe(document.scenes[0].layers[0]);
    expect(document.scenes[0].layers[0].transform.position).toEqual({ x: 0.25, y: 0.25 });
    expect((next.scenes[0].layers[0] as VideoLayer).timing).toEqual({ startMs: 500, durationMs: 2500 });
    expect((next.scenes[0].layers[0] as VideoLayer).extensions).toEqual({ videoStudio: { transition: 'fade' } });
  });

  it('rejects missing scenes, layers, duplicate ids and locked mutations', () => {
    const document = documentWith(layer('one', { locked: true }), layer('two'));
    expect(() => updateLayer(document, 'missing', 'one', { name: 'x' })).toThrow(CreativeCommandError);
    expect(() => updateLayer(document, 'scene', 'missing', { name: 'x' })).toThrow(CreativeCommandError);
    expect(() => addLayer(document, 'scene', layer('two'))).toThrow(/already exists/);
    expect(() => moveLayer(document, 'scene', 'one', { dx: 0.1 })).toThrow(/locked/);
    expect(() => removeLayer(document, 'scene', 'one')).toThrow(/locked/);
    expect(() => duplicateLayer(document, 'scene', 'one')).toThrow(/locked/);
  });

  it('allows dedicated visibility and lock commands on locked layers', () => {
    const document = documentWith(layer('one', { locked: true }));
    const hidden = setLayerVisibility(document, 'scene', 'one', false);
    expect(hidden.scenes[0].layers[0].visible).toBe(false);
    const unlocked = setLayerLocked(hidden, 'scene', 'one', false);
    expect(unlocked.scenes[0].layers[0].locked).toBe(false);
  });

  it('adds, duplicates and reorders without dropping zIndex or extensions', () => {
    const source = layer('one', { zIndex: 7, extensions: { legacy: { keep: true } } });
    const document = documentWith(source);
    const added = addLayer(document, 'scene', layer('two', { zIndex: 9 }));
    expect(added.scenes[0].layers.map((item) => item.id)).toEqual(['one', 'two']);
    expect(() => duplicateLayer(added, 'scene', 'one', { id: 'two' })).toThrow(/already exists/);
    const duplicated = duplicateLayer(added, 'scene', 'one', { id: 'copy', offset: { x: 0, y: 0 } });
    expect(duplicated.scenes[0].layers.map((item) => item.id)).toEqual(['one', 'copy', 'two']);
    expect(duplicated.scenes[0].layers[1].zIndex).toBe(10);
    expect(duplicated.scenes[0].layers[1].extensions).toEqual(source.extensions);
    const reordered = reorderLayer(duplicated, 'scene', 'copy', { toIndex: 2 });
    expect(reordered.scenes[0].layers.map((item) => item.id)).toEqual(['one', 'two', 'copy']);
    expect(reordered.scenes[0].layers.map((item) => item.zIndex)).toEqual([7, 9, 10]);
  });

  it('clamps normalized movement, resize and scale while retaining aspect ratio', () => {
    const document = documentWith(layer('one'));
    const moved = moveLayer(document, 'scene', 'one', { x: 5, y: -2 });
    expect(moved.scenes[0].layers[0].transform.position).toEqual({ x: 0.9, y: 0.1 });
    const resized = resizeLayer(document, 'scene', 'one', { width: 0.4, height: 0.1 }, { preserveAspectRatio: true });
    expect(resized.scenes[0].layers[0].geometry.width).toBeCloseTo(0.4);
    expect(resized.scenes[0].layers[0].geometry.height).toBeCloseTo(0.4);
    const scaled = scaleLayer(document, 'scene', 'one', 20, { preserveAspectRatio: true });
    expect(scaled.scenes[0].layers[0].transform.scale).toEqual({ x: 5, y: 5 });
    const rotated = rotateLayer(document, 'scene', 'one', 90);
    expect(rotated.scenes[0].layers[0].transform.rotation).toBe(90);
  });

  it('groups siblings, supports nested groups, and ungroups immutably', () => {
    const document = documentWith(layer('one'), layer('two', { zIndex: 2 }), layer('three'));
    const grouped = groupLayers(document, 'scene', ['one', 'two'], { id: 'group' });
    const group = grouped.scenes[0].layers[0];
    expect(group.type).toBe('group');
    if (group.type !== 'group') return;
    expect(group.children.map((item) => item.id)).toEqual(['one', 'two']);
    const nested = groupLayers(grouped, 'scene', ['one', 'two'], { id: 'nested' });
    const nestedGroup = (nested.scenes[0].layers[0] as Extract<CreativeLayer, { type: 'group' }>).children[0];
    expect(nestedGroup.type).toBe('group');
    const ungrouped = ungroupLayer(nested, 'scene', 'nested');
    expect(ungrouped.scenes[0].layers[0].type).toBe('group');
    expect((ungrouped.scenes[0].layers[0] as Extract<CreativeLayer, { type: 'group' }>).children.map((item) => item.id)).toEqual(['one', 'two']);
  });

  it('does not allow mutations below a locked group', () => {
    const grouped = groupLayers(documentWith(layer('one'), layer('two')), 'scene', ['one', 'two'], { id: 'group' });
    const locked = setLayerLocked(grouped, 'scene', 'group', true);
    expect(() => moveLayer(locked, 'scene', 'one', { dx: 0.1 })).toThrow(/locked/);
    expect(() => ungroupLayer(locked, 'scene', 'group')).toThrow(/locked/);
  });
});

describe('selection commands', () => {
  it('supports single, additive, toggle and clear selection', () => {
    let state = createSelectionState();
    state = selectLayer(state, 'one');
    state = selectLayer(state, 'two', true);
    expect(state.selectedLayerIds).toEqual(['one', 'two']);
    state = toggleLayerSelection(state, 'one');
    expect(state.selectedLayerIds).toEqual(['two']);
    expect(clearSelection().selectedLayerIds).toEqual([]);
  });

  it('selects all leaves and bounds without mutating state', () => {
    const document = documentWith(layer('one'), layer('two', { geometry: { x: 0.7, y: 0.7, width: 0.1, height: 0.1 } }));
    expect(selectAll(document, 'scene').selectedLayerIds).toEqual(['one', 'two']);
    expect(selectLayersByBounds(document, 'scene', { x: 0, y: 0, width: 0.5, height: 0.5 }).selectedLayerIds).toEqual(['one']);
    expect(selectLayersByBounds(document, 'scene', { x: 0, y: 0, width: 1, height: 1 }, { mode: 'contains' }).selectedLayerIds).toEqual(['one', 'two']);
  });
});

describe('semantic history', () => {
  it('supports undo/redo, redo invalidation, limits and gesture grouping', () => {
    const history = new SemanticHistory(0, { limit: 3 });
    expect(history.canUndo).toBe(false);
    history.apply(1, { label: 'move' });
    history.apply(2, { label: 'move' });
    history.beginGroup('drag');
    history.apply(3);
    history.apply(4);
    history.endGroup();
    expect(history.length).toBe(3);
    expect(history.present).toBe(4);
    expect(history.undo()).toBe(2);
    expect(history.redo()).toBe(4);
    history.undo();
    history.apply(9);
    expect(history.canRedo).toBe(false);

    const objectHistory = new SemanticHistory({ nested: { value: 1 } });
    const snapshot = objectHistory.present;
    snapshot.nested.value = 9;
    expect(objectHistory.present.nested.value).toBe(1);
  });
});
