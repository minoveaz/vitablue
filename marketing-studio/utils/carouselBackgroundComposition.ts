import type { CarouselGeometry, ImageLayer, ImageProject } from '../types/imageStudio';
import {
  CAROUSEL_BACKGROUND_COLOR_VARIANTS,
  type CarouselBackgroundColorVariant,
  type CarouselBackgroundColorVariantDefinition,
  type CarouselBackgroundComposition,
  type CarouselBackgroundCompositionInput,
  type CarouselBackgroundLayer,
  type CarouselBackgroundLayerMetadata,
  type CarouselBackgroundSafeZone,
} from '../types/carouselBackgroundComposition';

export type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundColorVariantDefinition,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundLayer,
  CarouselBackgroundSafeZone,
} from '../types/carouselBackgroundComposition';

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));

/**
 * Approved contrast pairs: `contrast` is used for content over the background,
 * `secondary` for lower forms, and `muted` only for decorative accents.
 * White keeps the lower forms pale; midnight and ocean keep them darker than
 * the content surface so text safe zones remain readable.
 */
export const CAROUSEL_BACKGROUND_PALETTES: Record<
  CarouselBackgroundColorVariant,
  CarouselBackgroundColorVariantDefinition
> = {
  white: {
    id: 'white',
    background: '#FFFAF5',
    primary: '#005F73',
    secondary: '#005F73',
    contrast: '#001219',
    muted: '#EE9B00',
  },
  midnight: {
    id: 'midnight',
    background: '#001219',
    primary: '#005F73',
    secondary: '#123B46',
    contrast: '#FFFFFF',
    muted: '#94D2BD',
  },
  ocean: {
    id: 'ocean',
    background: '#005F73',
    primary: '#001219',
    secondary: '#0B5262',
    contrast: '#FFFFFF',
    muted: '#94D2BD',
  },
  'amber-gold': {
    id: 'amber-gold',
    background: '#EE9B00',
    primary: '#001219',
    secondary: '#B86F00',
    contrast: '#FFFFFF',
    muted: '#94D2BD',
  },
  'white-editorial': {
    id: 'white-editorial',
    background: '#FFFFFF',
    primary: '#005F73',
    secondary: '#E7F8F2',
    contrast: '#001219',
    muted: '#94D2BD',
  },
};

export const DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION: CarouselBackgroundComposition = {
  version: 1,
  id: 'carousel-background-default',
  colorVariant: 'white',
  shape: 'wave',
  trajectory: {
    type: 'sine',
    amplitude: 0.07,
    frequency: 1,
    phase: 0,
  },
  mask: 'safe-zone',
  shadow: 'soft',
  continuity: 'seamless',
  intensity: 0.88,
  height: 0.38,
  scale: 1,
  verticalPosition: 0.72,
};

export interface CarouselBackgroundGenerationOptions {
  geometry: CarouselGeometry;
  composition?: CarouselBackgroundCompositionInput | null;
  projectId?: string;
  safeZone?: Partial<CarouselBackgroundSafeZone>;
}

const isColorVariant = (value: unknown): value is CarouselBackgroundColorVariant =>
  typeof value === 'string' &&
  (CAROUSEL_BACKGROUND_COLOR_VARIANTS as readonly string[]).includes(value);

const normalizeSafeZone = (
  safeZone: Partial<CarouselBackgroundSafeZone> | undefined,
  geometry: CarouselGeometry,
): CarouselBackgroundSafeZone => {
  const fallback = {
    top: Math.round(geometry.slideHeight * 0.08),
    right: Math.round(geometry.slideWidth * 0.05),
    bottom: Math.round(geometry.slideHeight * 0.12),
    left: Math.round(geometry.slideWidth * 0.05),
  };
  return {
    top: clamp(safeZone?.top ?? fallback.top, 0, geometry.slideHeight / 2),
    right: clamp(safeZone?.right ?? fallback.right, 0, geometry.slideWidth / 2),
    bottom: clamp(safeZone?.bottom ?? fallback.bottom, 0, geometry.slideHeight / 2),
    left: clamp(safeZone?.left ?? fallback.left, 0, geometry.slideWidth / 2),
  };
};

export function createCarouselBackgroundComposition(
  colorVariant?: CarouselBackgroundColorVariant,
  overrides?: CarouselBackgroundCompositionInput,
): CarouselBackgroundComposition;
export function createCarouselBackgroundComposition(
  overrides: CarouselBackgroundCompositionInput,
): CarouselBackgroundComposition;
export function createCarouselBackgroundComposition(
  colorVariantOrOverrides: CarouselBackgroundColorVariant | CarouselBackgroundCompositionInput = 'white',
  overrides: CarouselBackgroundCompositionInput = {},
): CarouselBackgroundComposition {
  const objectInput = typeof colorVariantOrOverrides === 'object' ? colorVariantOrOverrides : undefined;
  const colorVariant = objectInput?.colorVariant ?? colorVariantOrOverrides;
  const palette = isColorVariant(colorVariant) ? colorVariant : 'white';
  return resolveCarouselBackgroundComposition({
    ...DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION,
    ...(objectInput ?? {}),
    ...overrides,
    id: overrides.id ?? `carousel-background-${palette}`,
    colorVariant: overrides.colorVariant ?? palette,
  });
}

export const resolveCarouselBackgroundComposition = (
  composition?: CarouselBackgroundCompositionInput | null,
): CarouselBackgroundComposition => {
  const source = composition ?? {};
  const colorVariant = isColorVariant(source.colorVariant) ? source.colorVariant : 'white';
  const trajectory = {
    ...DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION.trajectory,
    ...(source.trajectory ?? {}),
  };
  const safeZone = source.safeZone
    ? {
        top: clamp(Number(source.safeZone.top ?? 108), 0, 10000),
        right: clamp(Number(source.safeZone.right ?? 54), 0, 10000),
        bottom: clamp(Number(source.safeZone.bottom ?? 162), 0, 10000),
        left: clamp(Number(source.safeZone.left ?? 54), 0, 10000),
      }
    : undefined;
  return {
    ...DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION,
    ...source,
    version: 1,
    id: source.id || `carousel-background-${colorVariant}`,
    colorVariant,
    trajectory: {
      type: ['sine', 'arc', 'diagonal', 'flat'].includes(trajectory.type)
        ? trajectory.type
        : 'sine',
      amplitude: clamp(trajectory.amplitude, 0, 0.25),
      frequency: clamp(trajectory.frequency, 0.25, 4),
      phase: Number.isFinite(trajectory.phase) ? trajectory.phase : 0,
    },
    safeZone,
    intensity: clamp(Number(source.intensity ?? DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION.intensity), 0, 1),
    height: clamp(Number(source.height ?? DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION.height), 0.08, 0.7),
    scale: clamp(Number(source.scale ?? DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION.scale), 0.25, 3),
    verticalPosition: clamp(
      Number(source.verticalPosition ?? DEFAULT_CAROUSEL_BACKGROUND_COMPOSITION.verticalPosition),
      0,
      1,
    ),
  };
};

const trajectoryOffset = (
  x: number,
  trajectory: CarouselBackgroundComposition['trajectory'],
): number => {
  const angle = x * trajectory.frequency * Math.PI * 2 + trajectory.phase;
  if (trajectory.type === 'flat') return 0;
  if (trajectory.type === 'diagonal') return (x - 0.5) * 2 * trajectory.amplitude;
  if (trajectory.type === 'arc') return (x - 0.5) ** 2 * trajectory.amplitude;
  return Math.sin(angle) * trajectory.amplitude;
};

const asMetadata = (
  composition: CarouselBackgroundComposition,
  slideIndex: number,
  layerRole: CarouselBackgroundLayerMetadata['layerRole'],
): CarouselBackgroundLayerMetadata => ({
  compositionId: composition.id,
  slideIndex,
  layerRole,
  shape: composition.shape,
  trajectory: composition.trajectory,
  mask: composition.mask,
  continuity: composition.continuity,
  isCarouselBackground: true,
});

const shadowPreset = (
  shadow: CarouselBackgroundComposition['shadow'],
): ImageLayer['shadowPreset'] => {
  if (shadow === 'glow-teal') return 'glow_teal';
  if (shadow === 'glow-gold') return 'glow_gold';
  if (shadow === 'soft') return 'soft';
  if (shadow === 'deep') return 'deep';
  return 'none';
};

const shapeTypeFor = (shape: CarouselBackgroundComposition['shape']): string => {
  if (shape === 'blob' || shape === 'organic') return 'blob-2';
  if (shape === 'curve') return 'curve';
  return 'carousel-wave';
};

const toLayerPosition = (
  slideIndex: number,
  x: number,
  y: number,
  geometry: CarouselGeometry,
): { x: number; y: number } => ({
  x: ((slideIndex * geometry.slideWidth + x) / geometry.panoramaWidth) * 100,
  y: (y / geometry.panoramaHeight) * 100,
});

const generatedLayer = (
  projectId: string,
  key: string,
  slideIndex: number,
  geometry: CarouselGeometry,
  position: { x: number; y: number },
  size: { width: number; height: number },
  props: Record<string, unknown>,
  composition: CarouselBackgroundComposition,
  layerRole: CarouselBackgroundLayerMetadata['layerRole'],
  style: Partial<ImageLayer> = {},
): CarouselBackgroundLayer => ({
  id: `${projectId}-carousel-background-${slideIndex + 1}-${key}`,
  type: 'block',
  blockType: 'GeometricShape',
  title: `Fondo · ${key} · slide ${slideIndex + 1}`,
  position: toLayerPosition(slideIndex, position.x, position.y, geometry),
  // Keep structural layers above the artboard background and below content.
  zIndex: style.zIndex ?? 0,
  scale: 1,
  width: Math.max(1, size.width),
  height: Math.max(1, size.height),
  locked: true,
  visible: true,
  constraints: { participatesInAutoLayout: false, snapToGuides: false },
  ...style,
  props: { ...asMetadata(composition, slideIndex, layerRole), ...props },
});

/**
 * Generates only structural layers. It never reads or mutates content layers.
 * Waves are bounded to (and touch) their slide; secondary forms stay inside
 * the horizontal and vertical safe insets.
 */
export function generateCarouselBackgroundLayers(
  options: CarouselBackgroundGenerationOptions,
): CarouselBackgroundLayer[];
export function generateCarouselBackgroundLayers(
  composition: CarouselBackgroundCompositionInput,
  geometry: CarouselGeometry,
  projectId?: string,
): CarouselBackgroundLayer[];
export function generateCarouselBackgroundLayers(
  optionsOrComposition: CarouselBackgroundGenerationOptions | CarouselBackgroundCompositionInput,
  legacyGeometry?: CarouselGeometry,
  legacyProjectId = 'carousel',
): CarouselBackgroundLayer[] {
  const options = 'geometry' in optionsOrComposition
    ? optionsOrComposition as CarouselBackgroundGenerationOptions
    : { composition: optionsOrComposition, geometry: legacyGeometry!, projectId: legacyProjectId };
  if (!options.geometry || options.geometry.slideCount < 1) return [];

  const geometry = options.geometry;
  const composition = resolveCarouselBackgroundComposition(options.composition);
  const safe = normalizeSafeZone(composition.safeZone ?? options.safeZone, geometry);
  const availableWidth = Math.max(1, geometry.slideWidth - safe.left - safe.right);
  const availableHeight = Math.max(1, geometry.slideHeight - safe.top - safe.bottom);
  const desiredHeight = availableHeight * composition.height * composition.scale;
  const height = Math.max(1, Math.min(availableHeight, desiredHeight));
  // Leave a sub-pixel guard at each edge to avoid browser floating-point
  // rounding turning an exactly touching layer into an overflow.
  // A slight overlap prevents antialiasing seams where adjacent slide waves meet.
  const width = Math.max(1, Math.min(geometry.slideWidth + 0.2, geometry.slideWidth * composition.scale));
  const lowerBandCenter = safe.top + availableHeight * composition.verticalPosition;
  const centerY =
    composition.colorVariant === 'white'
      ? geometry.slideHeight - height / 2
      : clamp(lowerBandCenter, safe.top + height / 2, geometry.slideHeight - safe.bottom - height / 2);
  const palette = CAROUSEL_BACKGROUND_PALETTES[composition.colorVariant];
  const fill = composition.secondaryColor ?? palette.secondary;
  const opacity = clamp(composition.intensity, 0, 1);
  const projectId = options.projectId ?? 'carousel';
  const layers: CarouselBackgroundLayer[] = [];
  const whiteWaveProfile = [0.28, 0.78, 0.9, 0.48, 0.7, 0.64];
  const whiteWavePath = `M0 0 L10 0 C10 18 12 38 18 58 C24 78 32 92 40 94 C48 94 52 22 60 18 C68 14 74 70 80 62 C88 50 94 78 100 ${whiteWaveProfile[5] * 100} L100 100 L0 100Z`;
  const midnightWavePath = 'M0 72 C10 68 16 78 24 78 C34 78 38 62 46 54 C54 46 60 48 68 58 C76 68 82 74 90 70 C95 68 98 64 100 62 L100 100 L0 100Z';
  const oceanWavePath = 'M0 82 C12 72 20 76 30 78 C40 80 44 68 52 54 C60 40 68 38 76 52 C84 66 88 72 100 68 L100 100 L0 100Z';
  const amberWavePath = 'M0 62 C10 62 16 70 24 82 C32 94 38 92 44 78 C50 64 54 36 64 28 C74 20 82 42 88 58 C94 74 98 78 100 78 L100 100 L0 100Z';
  const editorialWavePath = 'M0 76 C12 70 22 74 32 84 C42 94 48 92 56 78 C64 64 70 42 78 40 C86 38 92 58 100 68 L100 100 L0 100Z';

  if (
    composition.colorVariant === 'white' ||
    composition.colorVariant === 'midnight' ||
    composition.colorVariant === 'ocean' ||
    composition.colorVariant === 'amber-gold' ||
    composition.colorVariant === 'white-editorial'
  ) {
    layers.push(
      generatedLayer(
        projectId,
        composition.colorVariant === 'white'
          ? 'panorama-wave'
          : composition.colorVariant === 'midnight'
            ? 'panorama-wave-midnight'
            : composition.colorVariant === 'ocean'
              ? 'panorama-wave-ocean'
              : composition.colorVariant === 'amber-gold'
                ? 'panorama-wave-amber'
                : 'panorama-wave-editorial',
        0,
        geometry,
        { x: geometry.panoramaWidth / 2, y: geometry.slideHeight / 2 },
        { width: geometry.panoramaWidth, height: geometry.slideHeight },
        {
          shapeType: 'carousel-wave',
          fill: composition.colorVariant === 'white'
            ? fill
            : palette.primary,
          wavePath: composition.colorVariant === 'white'
            ? whiteWavePath
            : composition.colorVariant === 'midnight'
              ? midnightWavePath
              : composition.colorVariant === 'ocean'
                ? oceanWavePath
                : composition.colorVariant === 'amber-gold'
                  ? amberWavePath
                  : editorialWavePath,
        },
        composition,
        'wave',
        { opacity: 1, shadowPreset: 'none', zIndex: 0 },
      ),
    );
    const largeAccentWidth = geometry.slideWidth * 0.8;
    const largeAccentHeight = largeAccentWidth / 2;
    layers.push(
      generatedLayer(
        projectId,
        'top-semicircle-large',
        0,
        geometry,
        { x: geometry.slideWidth * 2, y: largeAccentHeight / 2 },
        { width: largeAccentWidth, height: largeAccentHeight },
        { shapeType: 'top-semicircle', fill: palette.muted },
        composition,
        'wave',
        { opacity: clamp(opacity * 0.9, 0, 1), shadowPreset: 'none', zIndex: 0 },
      ),
    );
  }

  for (let slideIndex = 0; slideIndex < geometry.slideCount; slideIndex += 1) {
    const start = trajectoryOffset(slideIndex / geometry.slideCount, composition.trajectory);
    const end = trajectoryOffset((slideIndex + 1) / geometry.slideCount, composition.trajectory);
    const baseY = centerY / geometry.slideHeight;
    const trajectory = {
      ...composition.trajectory,
      startY: clamp(baseY + start, 0, 1),
      endY: clamp(baseY + end, 0, 1),
    };
    const waveStartY = composition.colorVariant === 'white'
      ? whiteWaveProfile[slideIndex]
        ? whiteWaveProfile[slideIndex] * 100
        : 64
      : clamp(50 + (start * geometry.slideHeight * 100) / height, 8, 92);
    const waveEndY = composition.colorVariant === 'white'
      ? (whiteWaveProfile[slideIndex + 1] ?? 0.64) * 100
      : clamp(50 + (end * geometry.slideHeight * 100) / height, 8, 92);
    // The wave reaches both slide edges so adjacent generated layers form a
    // continuous panorama. Its vertical band remains bounded by the safe zone.
    const x = (geometry.slideWidth - width) / 2;
    const metadata = {
      trajectory,
      continuityStart: slideIndex === 0 ? trajectory.startY : undefined,
      continuityEnd: slideIndex === geometry.slideCount - 1 ? trajectory.endY : undefined,
    };

    if (
      composition.colorVariant !== 'white' &&
      composition.colorVariant !== 'midnight' &&
      composition.colorVariant !== 'ocean' &&
      composition.colorVariant !== 'amber-gold' &&
      composition.colorVariant !== 'white-editorial'
    ) {
      layers.push(
      generatedLayer(
        projectId,
        'wave',
        slideIndex,
        geometry,
        {
          x: x + width / 2,
          y: centerY,
        },
        {
          width,
          height,
        },
        {
          shapeType: shapeTypeFor(composition.shape),
          fill,
          borderRadius: 42,
          waveStartY,
          waveEndY,
          ...metadata,
        },
        composition,
        'wave',
        {
          opacity,
          shadowPreset: shadowPreset(composition.shadow),
        },
      ),
      );
    }

    if (composition.colorVariant === 'white' && [4].includes(slideIndex)) {
      const accentWidth = width * 0.56;
      const accentX = x + (width - accentWidth) * (slideIndex === 2 ? 0.25 : 0.5);
      const accentHeight = Math.min(availableHeight * 0.18, height * 0.5);
      layers.push(
        generatedLayer(
          projectId,
          'top-semicircle',
          slideIndex,
          geometry,
          { x: accentX + accentWidth / 2, y: accentHeight / 2 },
          { width: accentWidth, height: accentHeight },
          {
            shapeType: 'top-semicircle',
            fill: palette.muted,
          },
          composition,
          'wave',
          { opacity: clamp(opacity * 0.9, 0, 1), shadowPreset: 'none', zIndex: 0 },
        ),
      );
    }

    if (composition.shape !== 'curve' && composition.colorVariant !== 'white') {
      const organicWidth = Math.min(width * 0.28, availableWidth * 0.34);
      const organicHeight = Math.min(height * 0.8, availableHeight * 0.22);
      const focalX = clamp(composition.focalPoint?.x ?? (slideIndex % 2 ? 0.78 : 0.22), 0.12, 0.88);
      const focalY = clamp(composition.focalPoint?.y ?? 0.82, 0.1, 0.95);
      const organicX = safe.left + availableWidth * focalX;
      const organicY = safe.top + availableHeight * focalY;
      layers.push(
        generatedLayer(
          projectId,
          'organic',
          slideIndex,
          geometry,
          { x: organicX, y: clamp(organicY, safe.top + organicHeight / 2, geometry.slideHeight - safe.bottom - organicHeight / 2) },
          { width: organicWidth, height: organicHeight },
          {
            shapeType: 'blob-3',
            fill: palette.primary,
            mask: composition.mask,
            focalPoint: { x: focalX, y: focalY },
          },
          composition,
          'organic',
          {
            opacity: clamp(opacity * 0.5, 0, 1),
            zIndex: -19,
            shadowPreset: shadowPreset(composition.shadow),
          },
        ),
      );
    }
  }
  return layers;
}

export const isCarouselBackgroundLayer = (layer: ImageLayer): layer is CarouselBackgroundLayer =>
  layer.props?.isCarouselBackground === true;

/**
 * Replaces generated structural layers while preserving every editable layer,
 * including projects created before the composition field existed.
 */
export const regenerateCarouselBackground = (
  project: ImageProject,
  composition?: CarouselBackgroundCompositionInput | null,
): ImageProject => {
  const config = project.carouselConfig;
  const slideCount = config?.slideCount ?? project.carouselPages ?? 1;
  const slideWidth = config?.slideWidth ?? project.preset.slideWidth ?? project.preset.width / slideCount;
  const slideHeight = config?.slideHeight ?? project.preset.slideHeight ?? project.preset.height;
  const geometry: CarouselGeometry = {
    slideCount: Math.max(1, Math.round(slideCount)),
    slideWidth,
    slideHeight,
    panoramaWidth: slideWidth * Math.max(1, Math.round(slideCount)),
    panoramaHeight: slideHeight,
  };
  const mergedSafeZone =
    project.carouselBackground?.safeZone || composition?.safeZone
      ? {
          ...(project.carouselBackground?.safeZone ?? {}),
          ...(composition?.safeZone ?? {}),
        }
      : undefined;
  const resolved = resolveCarouselBackgroundComposition({
    ...(project.carouselBackground ?? {}),
    ...(composition ?? {}),
    trajectory: {
      ...(project.carouselBackground?.trajectory ?? {}),
      ...(composition?.trajectory ?? {}),
    },
    ...(mergedSafeZone ? { safeZone: mergedSafeZone } : {}),
  });
  const generated = generateCarouselBackgroundLayers({
    projectId: project.id,
    geometry,
    composition: resolved,
  });
  return {
    ...project,
    carouselBackground: resolved,
    layers: [...project.layers.filter((layer) => !isCarouselBackgroundLayer(layer)), ...generated],
  };
};
