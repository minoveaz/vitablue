import { describe, expect, it, vi } from 'vitest';
import {
  createContextMenuActionHandler,
  getContextMenuTargetLayerIds,
  resolveContextMenuLayerIds,
} from './ImageStage.types';

describe('ImageStageContextMenu selection routing', () => {
  it('keeps a multi-selection when the context target is selected', () => {
    expect(resolveContextMenuLayerIds('layer-2', ['layer-1', 'layer-2'])).toEqual(['layer-1', 'layer-2']);
  });

  it('routes a context action to the clicked layer instead of stale selection', () => {
    expect(resolveContextMenuLayerIds('layer-3', ['layer-1', 'layer-2'])).toEqual(['layer-3']);
  });

  it('preserves the right-click target selection snapshot', () => {
    expect(getContextMenuTargetLayerIds('layer-3', ['layer-1'], ['layer-2', 'layer-3']))
      .toEqual(['layer-2', 'layer-3']);
  });

  it('routes single and multi deletes to the intended target ids', () => {
    const deleteSelectedLayers = vi.fn();
    deleteSelectedLayers(getContextMenuTargetLayerIds('layer-3', ['layer-3']));
    deleteSelectedLayers(getContextMenuTargetLayerIds('layer-3', ['layer-1', 'layer-3']));
    expect(deleteSelectedLayers).toHaveBeenNthCalledWith(1, ['layer-3']);
    expect(deleteSelectedLayers).toHaveBeenNthCalledWith(2, ['layer-1', 'layer-3']);
  });

  it('invokes a menu action and closes it once', () => {
    const onClose = vi.fn();
    const action = vi.fn();
    const runAction = createContextMenuActionHandler(onClose);

    runAction(action);
    runAction(action);

    expect(action).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
