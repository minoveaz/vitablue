import type React from 'react';
import type { ImageLayer } from '../../types/imageStudio';

export interface ImageStageContextMenuState {
  x: number;
  y: number;
  layer: ImageLayer;
}

export interface ImageStageActions {
  onGroupSelectedLayers?: () => void;
  onDeleteSelectedLayers?: () => void;
  onDuplicateSelectedLayers?: () => void;
  onCopySelectedLayers?: () => void;
  onPasteLayers?: () => void;
  onCopyLayerStyle?: (id?: string) => void;
  onPasteLayerStyle?: (id?: string) => void;
  onToggleFlipHorizontal?: (id: string) => void;
  onToggleFlipVertical?: (id: string) => void;
  onToggleLock?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onMoveZIndex?: (id: string, direction: 'up' | 'down' | 'top' | 'bottom') => void;
  onAlignSelectedLayers?: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onNudgeSelectedLayers?: (dx: number, dy: number) => void;
  onFitToCanvas?: (id: string) => void;
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
