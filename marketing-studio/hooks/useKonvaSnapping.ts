import { ImageLayer } from '../types/imageStudio';

export interface SnapGuideLine {
  points: [number, number, number, number]; // [x1, y1, x2, y2]
  orientation: 'vertical' | 'horizontal';
  color: string;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuideLine[];
}

export interface SnapGuideTargets {
  verticalGuides?: number[];
  horizontalGuides?: number[];
}

const SNAP_THRESHOLD = 6; // pixels

export function calculateSnapping(
  draggingLayerId: string,
  targetX: number,
  targetY: number,
  layerWidth: number,
  layerHeight: number,
  canvasWidth: number,
  canvasHeight: number,
  layers: ImageLayer[],
  guideTargets?: SnapGuideTargets
): SnapResult {
  let snappedX = targetX;
  let snappedY = targetY;
  const guides: SnapGuideLine[] = [];

  const halfW = layerWidth / 2;
  const halfH = layerHeight / 2;

  const targetLeft = targetX - halfW;
  const targetRight = targetX + halfW;
  const targetCenterX = targetX;

  const targetTop = targetY - halfH;
  const targetBottom = targetY + halfH;
  const targetCenterY = targetY;

  // 1. Lineas de referencia vertical (Canvas center, left, right)
  const verticalTargets: { val: number; type: string }[] = [
    { val: 0, type: 'canvas-edge' },
    { val: canvasWidth / 2, type: 'canvas-center' },
    { val: canvasWidth, type: 'canvas-edge' },
  ];

  // 2. Lineas de referencia horizontal (Canvas center, top, bottom)
  const horizontalTargets: { val: number; type: string }[] = [
    { val: 0, type: 'canvas-edge' },
    { val: canvasHeight / 2, type: 'canvas-center' },
    { val: canvasHeight, type: 'canvas-edge' },
  ];

  guideTargets?.verticalGuides?.forEach((value) => {
    if (Number.isFinite(value)) verticalTargets.push({ val: value, type: 'design-guide' });
  });
  guideTargets?.horizontalGuides?.forEach((value) => {
    if (Number.isFinite(value)) horizontalTargets.push({ val: value, type: 'design-guide' });
  });

  // Añadir bordes y centros de otras capas
  for (const l of layers) {
    if (l.id === draggingLayerId || l.visible === false) continue;
    const lWidth = l.width ?? 380;
    const lHeight = l.height ?? 200;
    const lx = (l.position.x / 100) * canvasWidth;
    const ly = (l.position.y / 100) * canvasHeight;

    verticalTargets.push(
      { val: lx - lWidth / 2, type: 'layer-edge' },
      { val: lx, type: 'layer-center' },
      { val: lx + lWidth / 2, type: 'layer-edge' }
    );

    horizontalTargets.push(
      { val: ly - lHeight / 2, type: 'layer-edge' },
      { val: ly, type: 'layer-center' },
      { val: ly + lHeight / 2, type: 'layer-edge' }
    );
  }

  // --- SNAPPING VERTICAL (Eje X) ---
  let minDiffX = SNAP_THRESHOLD;
  let bestSnapX: number | null = null;
  let bestGuideX: number | null = null;

  for (const t of verticalTargets) {
    // Snap centro a target
    const diffCenter = Math.abs(targetCenterX - t.val);
    if (diffCenter < minDiffX) {
      minDiffX = diffCenter;
      bestSnapX = t.val;
      bestGuideX = t.val;
    }
    // Snap borde izquierdo a target
    const diffLeft = Math.abs(targetLeft - t.val);
    if (diffLeft < minDiffX) {
      minDiffX = diffLeft;
      bestSnapX = t.val + halfW;
      bestGuideX = t.val;
    }
    // Snap borde derecho a target
    const diffRight = Math.abs(targetRight - t.val);
    if (diffRight < minDiffX) {
      minDiffX = diffRight;
      bestSnapX = t.val - halfW;
      bestGuideX = t.val;
    }
  }

  if (bestSnapX !== null && bestGuideX !== null) {
    snappedX = bestSnapX;
    guides.push({
      points: [bestGuideX, 0, bestGuideX, canvasHeight],
      orientation: 'vertical',
      color: bestGuideX === canvasWidth / 2 ? '#EE9B00' : '#94D2BD',
    });
  }

  // --- SNAPPING HORIZONTAL (Eje Y) ---
  let minDiffY = SNAP_THRESHOLD;
  let bestSnapY: number | null = null;
  let bestGuideY: number | null = null;

  for (const t of horizontalTargets) {
    // Snap centro a target
    const diffCenter = Math.abs(targetCenterY - t.val);
    if (diffCenter < minDiffY) {
      minDiffY = diffCenter;
      bestSnapY = t.val;
      bestGuideY = t.val;
    }
    // Snap borde superior a target
    const diffTop = Math.abs(targetTop - t.val);
    if (diffTop < minDiffY) {
      minDiffY = diffTop;
      bestSnapY = t.val + halfH;
      bestGuideY = t.val;
    }
    // Snap borde inferior a target
    const diffBottom = Math.abs(targetBottom - t.val);
    if (diffBottom < minDiffY) {
      minDiffY = diffBottom;
      bestSnapY = t.val - halfH;
      bestGuideY = t.val;
    }
  }

  if (bestSnapY !== null && bestGuideY !== null) {
    snappedY = bestSnapY;
    guides.push({
      points: [0, bestGuideY, canvasWidth, bestGuideY],
      orientation: 'horizontal',
      color: bestGuideY === canvasHeight / 2 ? '#EE9B00' : '#94D2BD',
    });
  }

  return {
    x: snappedX,
    y: snappedY,
    guides,
  };
}
