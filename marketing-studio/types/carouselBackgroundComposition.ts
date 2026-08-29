import type { ImageLayer } from './imageStudio';
import type {
  EditableVectorGeometry,
  EditableVectorGeometryInput,
} from './vectorGeometry';

export const CAROUSEL_BACKGROUND_COLOR_VARIANTS = ['white', 'midnight', 'ocean', 'amber-gold', 'white-editorial'] as const;
export type CarouselBackgroundColorVariant = (typeof CAROUSEL_BACKGROUND_COLOR_VARIANTS)[number];

export type CarouselBackgroundShapeType = 'wave' | 'blob' | 'organic' | 'curve';
export type CarouselBackgroundTrajectoryType = 'sine' | 'arc' | 'diagonal' | 'flat';
export type CarouselBackgroundMask = 'none' | 'safe-zone' | 'rounded' | 'circle' | 'blob';
export type CarouselBackgroundShadow = 'none' | 'soft' | 'deep' | 'glow-teal' | 'glow-gold';
export type CarouselBackgroundContinuity = 'local' | 'flow' | 'seamless';

/** A normalized point in the panoramic trajectory editor (0..1 on both axes). */
export interface CarouselBackgroundTrajectoryPoint {
  /** Horizontal position across the full panorama. */
  x: number;
  /** Vertical position within the generated lower-band profile. */
  y: number;
}

/** Safe insets are expressed in pixels in the coordinate space of one slide. */
export interface CarouselBackgroundSafeZone {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CarouselBackgroundTrajectory {
  type: CarouselBackgroundTrajectoryType;
  /** Wave amplitude as a fraction of slide height. */
  amplitude: number;
  /** Number of complete cycles across the panorama. */
  frequency: number;
  /** Phase in radians. */
  phase: number;
  /** Optional persisted control points for a custom cubic Bézier profile. */
  points?: CarouselBackgroundTrajectoryPoint[];
  /** Resolved endpoints, present on generated per-slide metadata. */
  startY?: number;
  endY?: number;
}

export interface CarouselBackgroundColorVariantDefinition {
  id: CarouselBackgroundColorVariant;
  background: string;
  primary: string;
  secondary: string;
  contrast: string;
  muted: string;
}

export interface CarouselBackgroundComposition {
  version: 1;
  id: string;
  colorVariant: CarouselBackgroundColorVariant;
  shape: CarouselBackgroundShapeType;
  trajectory: CarouselBackgroundTrajectory;
  mask: CarouselBackgroundMask;
  shadow: CarouselBackgroundShadow;
  continuity: CarouselBackgroundContinuity;
  /** 0..1, controls opacity and the size of generated forms. */
  intensity: number;
  /** Fraction of slide height used by the lower composition (0..1). */
  height: number;
  /** Multiplier applied before the generated bounds are clamped. */
  scale: number;
  /** Preferred lower-band position, normalized to 0..1. */
  verticalPosition: number;
  /** Optional safe zone override for every slide. */
  safeZone?: CarouselBackgroundSafeZone;
  /** Optional focal point for secondary organic forms. */
  focalPoint?: { x: number; y: number };
  /** Optional reusable geometry override for the generated panorama surface. */
  vectorGeometry?: EditableVectorGeometry;
  secondaryColor?: string;
}

export type CarouselBackgroundCompositionInput = Omit<
  Partial<CarouselBackgroundComposition>,
  'trajectory' | 'safeZone' | 'vectorGeometry'
> & {
  trajectory?: Partial<CarouselBackgroundTrajectory>;
  safeZone?: Partial<CarouselBackgroundSafeZone>;
  vectorGeometry?: EditableVectorGeometryInput;
};

export interface CarouselBackgroundLayerMetadata {
  compositionId: string;
  slideIndex: number;
  layerRole: 'wave' | 'organic' | 'shadow';
  shape: CarouselBackgroundShapeType;
  trajectory: CarouselBackgroundTrajectory;
  mask: CarouselBackgroundMask;
  continuity: CarouselBackgroundContinuity;
  /** Marks generated layers so regeneration never removes editable content. */
  isCarouselBackground: true;
}

export type CarouselBackgroundLayer = ImageLayer & {
  props: ImageLayer['props'] & CarouselBackgroundLayerMetadata;
};
