import type {
  CarouselElementSlot,
  CarouselLayout,
  CarouselSlideLayout,
  ImageLayer,
} from '../types/imageStudio';

export interface CarouselSlotFrame {
  x: number;
  y: number;
  width: number;
  height: number;
  maxLines?: number;
  continuity: CarouselElementSlot['continuity'];
}

const DEFAULT_MARGIN = 8;

const SLOT_FRAMES: Record<CarouselElementSlot['type'], Omit<CarouselSlotFrame, 'continuity' | 'maxLines'>> = {
  eyebrow: { x: 12, y: 14, width: 76, height: 8 },
  title: { x: 12, y: 28, width: 76, height: 22 },
  body: { x: 12, y: 54, width: 68, height: 22 },
  badge: { x: 12, y: 82, width: 28, height: 8 },
  media: { x: 68, y: 22, width: 26, height: 56 },
  metric: { x: 12, y: 76, width: 32, height: 14 },
  cta: { x: 12, y: 82, width: 42, height: 8 },
  decorative: { x: 0, y: 0, width: 100, height: 100 },
};

export const getCarouselSlideLayout = (
  layout: CarouselLayout,
  index: number,
): CarouselSlideLayout => {
  if (layout.slides.length === 0) {
    throw new Error(`Carousel layout "${layout.id}" has no slide layouts`);
  }
  return layout.slides[index % layout.slides.length];
};

export const getCarouselSlotFrame = (
  slot: CarouselElementSlot,
  margin = DEFAULT_MARGIN,
): CarouselSlotFrame => {
  const base = SLOT_FRAMES[slot.type];
  const inset = slot.type === 'decorative' ? 0 : margin;
  return {
    x: Math.min(100 - base.width, base.x + inset),
    y: Math.min(100 - base.height, base.y + inset),
    width: Math.max(0, Math.min(base.width, 100 - inset * 2)),
    height: Math.max(0, Math.min(base.height, 100 - inset * 2)),
    maxLines: slot.maxLines,
    continuity: slot.continuity ?? 'local',
  };
};

export const validateCarouselLayoutLayers = (
  layers: ImageLayer[],
  canvasWidth: number,
  canvasHeight: number,
): string[] => {
  const errors: string[] = [];
  for (const layer of layers) {
    const width = (layer.width ?? 0) * (layer.scale || 1);
    const height = (layer.height ?? 0) * (layer.scale || 1);
    const centerX = (layer.position.x / 100) * canvasWidth;
    const centerY = (layer.position.y / 100) * canvasHeight;
    if (centerX - width / 2 < 0 || centerX + width / 2 > canvasWidth) {
      errors.push(`${layer.id}: horizontal overflow`);
    }
    if (centerY - height / 2 < 0 || centerY + height / 2 > canvasHeight) {
      errors.push(`${layer.id}: vertical overflow`);
    }
  }
  return errors;
};
