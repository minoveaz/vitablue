import type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundPresetId,
  CarouselBackgroundShapeType,
  CarouselBackgroundTrajectoryType,
} from './carouselBackgroundComposition';

export const CAROUSEL_COMPOSITION_ACCENTS = [
  'soft-shadow',
  'teal-glow',
  'gold-glow',
  'focal-point',
  'slide-bridge',
] as const;
export type CarouselCompositionAccent = (typeof CAROUSEL_COMPOSITION_ACCENTS)[number];

export const CAROUSEL_COMPOSITION_VISUAL_STYLES = [
  'editorial',
  'educational',
  'conversion',
  'comparison',
  'testimonial',
  'bold',
] as const;
export type CarouselCompositionVisualStyle = (typeof CAROUSEL_COMPOSITION_VISUAL_STYLES)[number];

export type BrandCompositionCurveFamily =
  | CarouselBackgroundShapeType
  | CarouselBackgroundTrajectoryType;

export interface SavedCarouselComposition {
  id: string;
  name: string;
  composition: CarouselBackgroundComposition;
  createdAt: string;
  updatedAt: string;
}

/** The visual guardrails applied to every carousel created for a brand. */
export interface BrandVisualCompositionConfig {
  version: 1;
  brandId?: string;
  brandName?: string;
  allowedPalettes: CarouselBackgroundColorVariant[];
  preferredCurveFamilies: BrandCompositionCurveFamily[];
  preferredStyleFamilies: CarouselCompositionVisualStyle[];
  intensityCap: number;
  scaleCap: number;
  enabledAccents: CarouselCompositionAccent[];
  allowedPresets: CarouselBackgroundPresetId[];
  savedCompositions: SavedCarouselComposition[];
}

export type BrandVisualCompositionConfigInput = Partial<
  Omit<BrandVisualCompositionConfig, 'version' | 'savedCompositions'>
> & {
  version?: unknown;
  savedCompositions?: unknown;
  /** Accepted aliases make migrations from early editor experiments harmless. */
  maxIntensity?: unknown;
  maxScale?: unknown;
};

export type BrandCompositionSavedInput = Omit<
  Partial<SavedCarouselComposition>,
  'composition'
> & {
  id?: string;
  name?: string;
  composition: CarouselBackgroundCompositionInput;
};
