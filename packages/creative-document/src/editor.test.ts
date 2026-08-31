import { describe, expect, it } from 'vitest';
import { createCreativeDocumentEditor, type CreativeDocument } from './index';

const document = (): CreativeDocument => ({
  schemaVersion: 1,
  id: 'editor-document',
  name: 'Editor',
  mode: 'image',
  canvas: { id: 'canvas', width: 100, height: 100 },
  scenes: [{
    id: 'scene',
    layers: [{
      id: 'layer',
      type: 'shape',
      shape: 'rectangle',
      transform: { position: { x: 0.5, y: 0.5 }, anchor: { x: 0.5, y: 0.5 }, rotation: 0, scale: { x: 1, y: 1 } },
      geometry: { x: 0.25, y: 0.25, width: 0.25, height: 0.25 },
      constraints: { preserveAspectRatio: true },
    }],
  }],
});

describe('CreativeDocumentEditor', () => {
  it('applies canonical transforms, selection and undo/redo as one history', () => {
    const editor = createCreativeDocumentEditor(document());
    editor.select('layer');
    expect(editor.selection.primaryLayerId).toBe('layer');
    editor.moveLayer('scene', 'layer', { dx: 0.1, dy: 0 }, { clampToCanvas: true }, 'Move');
    expect(editor.document.scenes[0].layers[0].transform.position.x).toBe(0.6);
    expect(editor.history.canUndo).toBe(true);
    editor.undo();
    expect(editor.document.scenes[0].layers[0].transform.position.x).toBe(0.5);
    editor.redo();
    expect(editor.document.scenes[0].layers[0].transform.position.x).toBe(0.6);
  });
});
