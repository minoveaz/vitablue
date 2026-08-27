import type React from 'react';
import type { ImageLayer } from '../../types/imageStudio';

export interface ImageStageContextMenuState {
  x: number;
  y: number;
  layer: ImageLayer;
  /**
   * Snapshot the selection at the point of the context-menu gesture. The
   * selection state can change after the menu opens, but actions must still
   * apply to the layer(s) that were right-clicked.
   */
  targetLayerIds?: string[];
}

export const resolveContextMenuLayerIds = (layerId: string, selectedLayerIds: string[]): string[] =>
  selectedLayerIds.includes(layerId) ? selectedLayerIds : [layerId];

export const getContextMenuTargetLayerIds = (
  layerId: string,
  selectedLayerIds: string[],
  targetLayerIds?: string[],
): string[] => targetLayerIds ? [...targetLayerIds] : resolveContextMenuLayerIds(layerId, selectedLayerIds);

export type ContextMenuActionHandler = ((action: () => void) => void) & {
  reset: () => void;
};

export const createContextMenuActionHandler = (onClose: () => void): ContextMenuActionHandler => {
  let handled = false;
  const runAction = ((action: () => void) => {
    if (handled) return;
    handled = true;
    try {
      action();
    } finally {
      onClose();
    }
  }) as ContextMenuActionHandler;
  runAction.reset = () => {
    handled = false;
  };
  return runAction;
};

export interface ImageStageActions {
  onGroupSelectedLayers?: (layerIds?: string[]) => void;
  onDeleteSelectedLayers?: (layerIds?: string[]) => void;
  onDuplicateSelectedLayers?: (layerIds?: string[]) => void;
  onCopySelectedLayers?: (layerIds?: string[]) => void;
  onPasteLayers?: () => void;
  onCopyLayerStyle?: (id?: string) => void;
  onPasteLayerStyle?: (id?: string, targetLayerIds?: string[]) => void;
  onToggleFlipHorizontal?: (id: string, targetLayerIds?: string[]) => void;
  onToggleFlipVertical?: (id: string, targetLayerIds?: string[]) => void;
  onToggleLock?: (id: string, targetLayerIds?: string[], forceState?: boolean) => void;
  onToggleVisibility?: (id: string, targetLayerIds?: string[], forceState?: boolean) => void;
  onMoveZIndex?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom', targetLayerIds?: string[]) => void;
  onAlignSelectedLayers?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom', layerIds?: string[]) => void;
  onDistributeSelectedLayers?: (direction: 'horizontal' | 'vertical', layerIds?: string[]) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onNudgeSelectedLayers?: (dx: number, dy: number) => void;
  onFitToCanvas?: (id: string, targetLayerIds?: string[]) => void;
  onUngroupLayer?: (id: string) => void;
  onSaveToMyDesigns?: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
}

export type ResizeCorner = 'nw' | 'ne' | 'se' | 'sw' | 'e' | 'w' | 'n' | 's';

export interface ImageStageInteractionHandlers {
  handlePointerDown: (event: React.PointerEvent, layer: ImageLayer) => void;
  handleContextMenu: (event: React.MouseEvent, layer: ImageLayer) => void;
  handleResizeStart: (event: React.PointerEvent, layer: ImageLayer, corner?: ResizeCorner) => void;
  handleRotateStart: (event: React.PointerEvent, layer: ImageLayer) => void;
}
