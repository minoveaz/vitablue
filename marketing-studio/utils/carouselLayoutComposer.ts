import type {
  CarouselElementSlot,
  CarouselLayout,
  CarouselSlideLayout,
  ImageLayer,
  ImageProject,
  CarouselConfig,
} from '../types/imageStudio';
import { IMAGE_FORMAT_PRESETS } from '../types/imageStudio';
import { defaultMotionBrandTokens } from '../../packages/video-studio/src/motion-kit';

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

export const instantiateCarouselLayout = (
  layout: CarouselLayout,
  slideCount: number,
  options: {
    title?: string;
    platform?: CarouselConfig['platform'];
    slideWidth?: number;
    slideHeight?: number;
  } = {},
): ImageProject => {
  const platform = options.platform ?? layout.supportedPlatforms[0] ?? 'instagram';
  const preset = IMAGE_FORMAT_PRESETS.find(
    (item) => item.carouselPlatform === platform && item.isCarousel,
  ) ?? IMAGE_FORMAT_PRESETS.find((item) => item.isCarousel);
  if (!preset) throw new Error('No carousel preset is available');

  const safeSlideCount = Math.max(layout.minSlides, Math.min(layout.maxSlides, Math.round(slideCount)));
  const slideWidth = options.slideWidth ?? preset.slideWidth ?? 1080;
  const slideHeight = options.slideHeight ?? preset.slideHeight ?? preset.height;
  const now = new Date().toISOString();
  const layers: ImageLayer[] = [];
  const slides = Array.from({ length: safeSlideCount }, (_, index) => {
    const slideLayout = getCarouselSlideLayout(layout, index);
    return {
      index,
      title: slideLayout.label,
      role: slideLayout.role,
    };
  });

  slides.forEach((slide, slideIndex) => {
    const slideLayout = getCarouselSlideLayout(layout, slideIndex);
    slideLayout.slots.forEach((slot, slotIndex) => {
      const frame = getCarouselSlotFrame(slot);
      if (slot.type === 'decorative') return;
      layers.push({
        id: `carousel-${layout.id}-${slideIndex}-${slot.id}`,
        type: slot.type === 'media' ? 'image' : 'text',
        title: `${slide.title}: ${slot.type}`,
        props: {
          text: slot.type === 'title' ? slide.title : slot.type === 'cta' ? 'COMENZAR AHORA' : '',
          tag: slot.type,
          slideIndex,
          slotId: slot.id,
        },
        position: {
          x: ((slideIndex + (frame.x + frame.width / 2) / 100) / safeSlideCount) * 100,
          y: frame.y + frame.height / 2,
        },
        zIndex: 10 + slotIndex,
        scale: 1,
        width: (frame.width / 100) * slideWidth,
        height: (frame.height / 100) * slideHeight,
        fontSize: slot.type === 'title' ? 54 : 24,
        fontWeight: slot.type === 'title' ? '800' : '500',
        fill: '#f8fafc',
        align: 'left',
        visible: true,
        constraints: { snapToGuides: true },
      });
    });
  });

  return {
    id: `carousel-${layout.id}-${Date.now()}`,
    title: options.title ?? layout.name,
    preset: { ...preset, width: slideWidth * safeSlideCount, height: slideHeight },
    background: { type: 'solid', color: '#001219' },
    layers,
    brandTokens: defaultMotionBrandTokens,
    carouselConfig: {
      enabled: true,
      platform,
      slideCount: safeSlideCount,
      slideWidth,
      slideHeight,
      layoutId: layout.id,
      currentSlideIndex: 0,
      slides,
      showSlideDividers: true,
      showSlideNumbers: true,
      autoSnapToSlides: true,
    },
    createdAt: now,
    updatedAt: now,
  };
};
