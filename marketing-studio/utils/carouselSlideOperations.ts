import type {
  CarouselLayout,
  CarouselSlideLayout,
  ImageLayer,
  ImageProject,
} from '../types/imageStudio';
import { getCarouselLayout } from '../data/carouselLayoutCatalog';
import { getCarouselSlotFrame, getCarouselSlideLayout } from './carouselLayoutComposer';

const getLayerSlideIndex = (layer: ImageLayer): number | undefined => {
  const value = layer.props?.slideIndex;
  return typeof value === 'number' ? value : undefined;
};

const moveLayerToSlide = (layer: ImageLayer, slideIndex: number, slideCount: number): ImageLayer => ({
  ...layer,
  props: { ...layer.props, slideIndex },
  position: { ...layer.position, x: layer.position.x - ((getLayerSlideIndex(layer) ?? 0) * 100) / slideCount + (slideIndex * 100) / slideCount },
});

const getLayerSlotType = (
  layer: ImageLayer,
  slideLayout?: CarouselSlideLayout,
): CarouselSlideLayout['slots'][number]['type'] | undefined => {
  const slotId = layer.props?.slotId;
  const slot = typeof slotId === 'string' ? slideLayout?.slots.find((item) => item.id === slotId) : undefined;
  if (slot) return slot.type;
  const tag = layer.props?.tag;
  return typeof tag === 'string' && ['eyebrow', 'title', 'body', 'badge', 'media', 'metric', 'cta', 'decorative'].includes(tag)
    ? (tag as CarouselSlideLayout['slots'][number]['type'])
    : undefined;
};

const createUniqueLayerId = (layer: ImageLayer, usedIds: Set<string>): string => {
  let suffix = 1;
  let id = `${layer.id}-copy`;
  while (usedIds.has(id)) id = `${layer.id}-copy-${suffix++}`;
  usedIds.add(id);
  return id;
};

export const reorderCarouselSlides = (
  project: ImageProject,
  fromIndex: number,
  toIndex: number,
): ImageProject => {
  const config = project.carouselConfig;
  if (!config?.enabled || fromIndex === toIndex) return project;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= config.slideCount || toIndex >= config.slideCount) {
    throw new RangeError('Carousel slide index is out of bounds');
  }
  const order = config.slides.map((_, index) => index);
  const [moved] = order.splice(fromIndex, 1);
  order.splice(toIndex, 0, moved);
  const remap = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]));
  return {
    ...project,
    currentSlide: remap.get(project.currentSlide ?? config.currentSlideIndex) ?? project.currentSlide,
    layers: project.layers.map((layer) => {
      const slideIndex = getLayerSlideIndex(layer);
      return slideIndex === undefined ? layer : moveLayerToSlide(layer, remap.get(slideIndex) ?? slideIndex, config.slideCount);
    }),
    carouselConfig: {
      ...config,
      currentSlideIndex: remap.get(config.currentSlideIndex) ?? config.currentSlideIndex,
      slides: order.map((oldIndex, newIndex) => ({ ...config.slides[oldIndex], index: newIndex })),
    },
  };
};

export const duplicateCarouselSlide = (project: ImageProject, slideIndex: number): ImageProject => {
  const config = project.carouselConfig;
  if (!config?.enabled) return project;
  if (config.slideCount >= 10) throw new RangeError('Carousel slide limit reached');
  if (slideIndex < 0 || slideIndex >= config.slideCount) throw new RangeError('Carousel slide index is out of bounds');
  const insertAt = slideIndex + 1;
  const unit = 100 / config.slideCount;
  const usedIds = new Set(project.layers.map((layer) => layer.id));
  const duplicated = project.layers
    .filter((layer) => getLayerSlideIndex(layer) === slideIndex)
    .map((layer) => ({
      ...layer,
      id: createUniqueLayerId(layer, usedIds),
      position: { ...layer.position, x: layer.position.x + unit },
      props: { ...layer.props, slideIndex: insertAt },
    }));
  const shifted = project.layers.map((layer) => {
    const index = getLayerSlideIndex(layer);
    return index !== undefined && index > slideIndex ? moveLayerToSlide(layer, index + 1, config.slideCount) : layer;
  });
  return {
    ...project,
    layers: [...shifted, ...duplicated],
    carouselConfig: {
      ...config,
      slideCount: config.slideCount + 1,
      currentSlideIndex: config.currentSlideIndex > slideIndex ? config.currentSlideIndex + 1 : config.currentSlideIndex,
      slides: [...config.slides.slice(0, insertAt), { ...config.slides[slideIndex], index: insertAt }, ...config.slides.slice(insertAt)].map(
        (slide, index) => ({ ...slide, index }),
      ),
    },
  };
};

/**
 * Changes the narrative layout while retaining layer content whenever a slot
 * with the same id or compatible slot type exists on the destination slide.
 * Layers without a compatible slot are retained in place to avoid data loss.
 */
export const changeCarouselLayout = (
  project: ImageProject,
  layout: CarouselLayout,
): ImageProject => {
  const config = project.carouselConfig;
  if (!config?.enabled || config.layoutId === layout.id) return project;
  const oldLayout = config.layoutId ? getCarouselLayout(config.layoutId) : undefined;
  const slideWidth = config.slideWidth || project.preset.slideWidth || project.preset.width;
  const slideHeight = config.slideHeight || project.preset.slideHeight || project.preset.height;
  const nextLayers = project.layers.map((layer) => {
    const slideIndex = getLayerSlideIndex(layer);
    if (slideIndex === undefined || slideIndex >= config.slideCount) return layer;

    const oldSlideLayout = oldLayout ? getCarouselSlideLayout(oldLayout, slideIndex) : undefined;
    const nextSlideLayout = getCarouselSlideLayout(layout, slideIndex);
    const oldSlotId = layer.props?.slotId;
    const oldType = getLayerSlotType(layer, oldSlideLayout);
    const targetSlot =
      (typeof oldSlotId === 'string' && nextSlideLayout.slots.find((slot) => slot.id === oldSlotId)) ??
      nextSlideLayout.slots.find((slot) => slot.type === oldType);
    if (!targetSlot || targetSlot.type === 'decorative') return layer;

    const frame = getCarouselSlotFrame(targetSlot);
    return {
      ...layer,
      props: {
        ...layer.props,
        slotId: targetSlot.id,
        tag: targetSlot.type,
      },
      position: {
        x: slideIndex * 100 + frame.x + frame.width / 2,
        y: frame.y + frame.height / 2,
      },
      width: (frame.width / 100) * slideWidth,
      height: (frame.height / 100) * slideHeight,
    };
  });

  return {
    ...project,
    layers: nextLayers,
    carouselConfig: {
      ...config,
      layoutId: layout.id,
      slides: config.slides.map((slide, index) => {
        const slideLayout = getCarouselSlideLayout(layout, index);
        return { ...slide, title: slideLayout.label, role: slideLayout.role, index };
      }),
    },
    updatedAt: new Date().toISOString(),
  };
};
