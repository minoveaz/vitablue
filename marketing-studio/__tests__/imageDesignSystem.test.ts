import { describe, expect, it } from 'vitest';
import { IMAGE_FORMAT_PRESETS, ImageLayer } from '../types/imageStudio';
import {
  applyLayerStyleVariant,
  autoLayoutLayers,
  createDefaultGuideSettings,
  fitTextLayer,
  getCarouselGeometry,
  getCarouselSlideFrame,
  getGuideSnapLines,
  getPlatformGuideProfile,
  replaceLayerContent,
  resizeLayerForFormat,
} from '../utils/imageDesignSystem';
import { calculateSnapping } from '../hooks/useKonvaSnapping';

const portrait = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-portrait')!;
const story = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'story-vertical')!;
const carousel = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-carousel-portrait')!;
const squareCarousel = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'instagram-carousel-square')!;
const tiktokCarousel = IMAGE_FORMAT_PRESETS.find((preset) => preset.id === 'tiktok-carousel-photo')!;

const layer = (id: string, overrides: Partial<ImageLayer> = {}): ImageLayer => ({
  id,
  type: 'text',
  blockType: 'CustomText',
  title: id,
  props: { text: id },
  position: { x: 50, y: 50 },
  zIndex: 1,
  scale: 1,
  width: 360,
  height: 120,
  fontSize: 48,
  ...overrides,
});

describe('Image Studio professional design system', () => {
  it('keeps panorama and slide geometry explicit for carousel ratios', () => {
    const geometry = getCarouselGeometry(carousel);

    expect(geometry.panoramaWidth).toBe(5400);
    expect(geometry.panoramaHeight).toBe(1350);
    expect(geometry.slideWidth).toBe(1080);
    expect(geometry.slideHeight).toBe(1350);
    expect(geometry.slideCount).toBe(5);

    expect(getCarouselGeometry(squareCarousel).panoramaHeight).toBe(1080);
    expect(getCarouselGeometry(tiktokCarousel).panoramaHeight).toBe(1920);
    expect(getCarouselGeometry(tiktokCarousel).slideWidth).toBe(1080);
  });

  it('treats an explicitly enabled carousel config as a carousel', () => {
    const geometry = getCarouselGeometry(portrait, 3, true);

    expect(geometry.slideCount).toBe(3);
    expect(geometry.slideWidth).toBe(360);
    expect(geometry.panoramaWidth).toBe(1080);
    expect(geometry.panoramaHeight).toBe(1350);
  });

  it('centers image fitting on the active slide instead of the panorama', () => {
    const frame = getCarouselSlideFrame(carousel, 3);

    expect(frame.index).toBe(3);
    expect(frame.width).toBe(1080);
    expect(frame.height).toBe(1350);
    expect(frame.center).toEqual({ x: 70, y: 50 });
    expect(getCarouselSlideFrame(carousel, 99).center.x).toBe(90);
    expect(getCarouselSlideFrame(portrait, 4).center).toEqual({ x: 50, y: 50 });
  });

  it('places built-in guide snap lines in every slide coordinate system', () => {
    const targets = getGuideSnapLines(carousel, createDefaultGuideSettings(carousel));
    const expectedLeftEdges = [0, 1080, 2160, 3240, 4320];

    expectedLeftEdges.forEach((offset) => expect(targets.vertical).toContain(offset + 43));
    expect(targets.horizontal).toContain(108);
    expect(targets.horizontal).toContain(1188);
  });

  it('resolves platform safe zones, columns, margins and ruler settings', () => {
    const profile = getPlatformGuideProfile(story);
    const settings = createDefaultGuideSettings(story);

    expect(profile.id).toBe('meta-story');
    expect(profile.safeInsets.top).toBeGreaterThan(profile.margins.top);
    expect(profile.safeInsets.bottom).toBeGreaterThan(profile.safeInsets.top);
    expect(settings.columns).toBe(4);
    expect(settings.showRulers).toBe(true);
    expect(settings.showSafeZone).toBe(true);
  });

  it('uses professional and custom guides as magnetic snap targets', () => {
    const settings = {
      ...createDefaultGuideSettings(portrait),
      customVerticalGuides: [25],
      customHorizontalGuides: [75],
    };
    const targets = getGuideSnapLines(portrait, settings);
    const customX = portrait.width * 0.25;
    const customY = portrait.height * 0.75;
    const result = calculateSnapping(
      'moving',
      customX + 2,
      customY - 2,
      100,
      100,
      portrait.width,
      portrait.height,
      [],
      { verticalGuides: targets.vertical, horizontalGuides: targets.horizontal }
    );

    expect(result.x).toBe(customX);
    expect(result.y).toBe(customY);
  });

  it('auto-layouts unlocked layers inside the platform safe area without moving locked components', () => {
    const locked = layer('locked', { locked: true, position: { x: 8, y: 8 } });
    const layers = [layer('a'), layer('b'), layer('c'), locked];
    const result = autoLayoutLayers(layers, layers.map((item) => item.id), portrait, {
      direction: 'vertical',
      gap: 24,
    });

    const profile = getPlatformGuideProfile(portrait);
    const editable = result.filter((item) => !item.locked);

    expect(result.find((item) => item.id === 'locked')?.position).toEqual({ x: 8, y: 8 });
    expect(editable[0].position.y).toBeLessThan(editable[1].position.y);
    expect(editable[1].position.y).toBeLessThan(editable[2].position.y);
    editable.forEach((item) => {
      const centerY = (item.position.y / 100) * portrait.height;
      expect(centerY).toBeGreaterThanOrEqual(profile.safeInsets.top);
      expect(centerY).toBeLessThanOrEqual(portrait.height - profile.safeInsets.bottom);
    });
  });

  it('keeps explicit edge constraints when adapting a layer to another format', () => {
    const pinned = layer('pinned', {
      position: { x: 12, y: 20 },
      width: 200,
      height: 100,
      constraints: {
        horizontal: 'start',
        vertical: 'end',
        width: 'fixed',
        height: 'fixed',
      },
    });
    const resized = resizeLayerForFormat(
      pinned,
      { width: portrait.width, height: portrait.height },
      { width: 1920, height: 1080 }
    );

    expect(resized.width).toBe(200);
    expect(resized.height).toBe(100);
    expect(resized.position.x).toBeGreaterThan(7);
    expect(resized.position.x).toBeLessThan(15);
    expect(resized.position.y).toBeGreaterThan(15);
    expect(resized.position.y).toBeLessThan(25);
  });

  it('fits long copy into its text box using persisted fitting rules', () => {
    const longCopy = layer('copy', {
      props: {
        text: 'Seguro médico completo sin copagos, sin carencias y con certificado consular inmediato',
      },
      width: 280,
      height: 110,
      fontSize: 72,
    });
    const fitted = fitTextLayer(longCopy, {
      mode: 'auto',
      minFontSize: 12,
      maxFontSize: 72,
      maxLines: 3,
    });

    expect(fitted.fontSize).toBeGreaterThanOrEqual(12);
    expect(fitted.fontSize).toBeLessThan(72);
    expect(fitted.props.textFit).toMatchObject({ mode: 'auto', maxLines: 3 });
  });

  it('replaces content and applies variants without changing composition', () => {
    const original = layer('photo', {
      type: 'image',
      blockType: undefined,
      props: {
        imageUrl: 'old.jpg',
        objectFit: 'cover',
        focalPoint: { x: 30, y: 60 },
      },
      position: { x: 42, y: 38 },
      rotation: 12,
      clipShape: 'circle',
    });
    const replaced = replaceLayerContent(original, { imageUrl: 'new.jpg' });
    const styled = applyLayerStyleVariant(replaced, 'gold');

    expect(replaced.props.imageUrl).toBe('new.jpg');
    expect(replaced.props.objectFit).toBe('cover');
    expect(replaced.props.focalPoint).toEqual({ x: 30, y: 60 });
    expect(styled.position).toEqual(original.position);
    expect(styled.rotation).toBe(12);
    expect(styled.clipShape).toBe('circle');
    expect(styled.styleVariant).toBe('gold');
  });

  it('prevents content and style edits on locked components', () => {
    const locked = layer('protected', { locked: true });
    expect(replaceLayerContent(locked, { text: 'Changed' })).toBe(locked);
    expect(applyLayerStyleVariant(locked, 'mint')).toBe(locked);
    expect(fitTextLayer(locked)).toBe(locked);
  });
});
