import type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundPresetId,
  CarouselBackgroundShapeType,
  CarouselBackgroundTrajectoryType,
} from '../types/carouselBackgroundComposition';
import {
  CAROUSEL_BACKGROUND_COLOR_VARIANTS,
  CAROUSEL_BACKGROUND_PRESET_IDS,
} from '../types/carouselBackgroundComposition';
import {
  CAROUSEL_COMPOSITION_ACCENTS,
  CAROUSEL_COMPOSITION_VISUAL_STYLES,
  type BrandCompositionCurveFamily,
  type BrandCompositionSavedInput,
  type BrandVisualCompositionConfig,
  type BrandVisualCompositionConfigInput,
  type CarouselCompositionAccent,
  type CarouselCompositionVisualStyle,
  type SavedCarouselComposition,
} from '../types/carouselCompositionIdentity';
import {
  CAROUSEL_BACKGROUND_PRESETS,
  resolveCarouselBackgroundComposition,
} from './carouselBackgroundComposition';

export type {
  BrandCompositionCurveFamily,
  BrandCompositionSavedInput,
  BrandVisualCompositionConfig,
  BrandVisualCompositionConfigInput,
  CarouselCompositionAccent,
  CarouselCompositionVisualStyle,
  SavedCarouselComposition,
} from '../types/carouselCompositionIdentity';

const ALL_PALETTES = [...CAROUSEL_BACKGROUND_COLOR_VARIANTS];
const ALL_PRESETS = [...CAROUSEL_BACKGROUND_PRESET_IDS];
const ALL_CURVES: BrandCompositionCurveFamily[] = [
  'wave',
  'blob',
  'organic',
  'curve',
  'sine',
  'arc',
  'diagonal',
  'flat',
];
const ALL_STYLES = [...CAROUSEL_COMPOSITION_VISUAL_STYLES];
const ALL_ACCENTS = [...CAROUSEL_COMPOSITION_ACCENTS];

export const DEFAULT_BRAND_VISUAL_COMPOSITION_CONFIG: BrandVisualCompositionConfig = {
  version: 1,
  allowedPalettes: [...ALL_PALETTES],
  preferredCurveFamilies: ['wave', 'curve', 'organic'],
  preferredStyleFamilies: [...ALL_STYLES],
  intensityCap: 1,
  scaleCap: 2,
  enabledAccents: [...ALL_ACCENTS],
  allowedPresets: [...ALL_PRESETS],
  savedCompositions: [],
};

const isString = (value: unknown): value is string => typeof value === 'string';
const unique = <T>(values: readonly T[]): T[] => [...new Set(values)];
const clamp = (value: unknown, min: number, max: number, fallback: number): number => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};
const enumList = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: readonly T[],
): T[] => {
  if (!Array.isArray(value)) return [...fallback];
  const result = unique(value.filter((item): item is T => isString(item) && allowed.includes(item as T)));
  return result.length ? result : [...fallback];
};

const isAccent = (value: unknown): value is CarouselCompositionAccent =>
  isString(value) && (CAROUSEL_COMPOSITION_ACCENTS as readonly string[]).includes(value);

export const normalizeBrandVisualCompositionConfig = (
  input?: BrandVisualCompositionConfigInput | null,
): BrandVisualCompositionConfig => {
  const source = input && typeof input === 'object' ? input : {};
  const savedInput = Array.isArray(source.savedCompositions) ? source.savedCompositions : [];
  const config: BrandVisualCompositionConfig = {
    version: 1,
    ...(isString(source.brandId) ? { brandId: source.brandId } : {}),
    ...(isString(source.brandName) ? { brandName: source.brandName } : {}),
    allowedPalettes: enumList(source.allowedPalettes, ALL_PALETTES, ALL_PALETTES),
    preferredCurveFamilies: enumList(source.preferredCurveFamilies, ALL_CURVES, DEFAULT_BRAND_VISUAL_COMPOSITION_CONFIG.preferredCurveFamilies),
    preferredStyleFamilies: enumList(source.preferredStyleFamilies, ALL_STYLES, ALL_STYLES),
    intensityCap: clamp(source.intensityCap ?? source.maxIntensity, 0, 1, 1),
    scaleCap: clamp(source.scaleCap ?? source.maxScale, 0.25, 3, 2),
    enabledAccents: Array.isArray(source.enabledAccents)
      ? unique(source.enabledAccents.filter(isAccent))
      : [...ALL_ACCENTS],
    allowedPresets: enumList(source.allowedPresets, ALL_PRESETS, ALL_PRESETS),
    savedCompositions: [],
  };
  config.savedCompositions = savedInput
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === 'object')
    .map((item, index) => normalizeSavedCarouselComposition(item, config, index))
    .filter((item): item is SavedCarouselComposition => Boolean(item))
    .slice(0, 50);
  return config;
};

const presetStyleFamilies: Record<CarouselBackgroundPresetId, CarouselCompositionVisualStyle[]> = {
  'caida-inicial': ['bold', 'conversion'],
  'montana-central': ['educational', 'editorial'],
  'onda-ascendente': ['educational', 'testimonial'],
  'semicirculo-entre-slides': ['comparison', 'testimonial'],
  'diagonal-dinamica': ['conversion', 'comparison', 'bold'],
  'composicion-editorial': ['editorial'],
  'cta-final': ['conversion', 'bold'],
};

export const getCarouselPresetStyleFamilies = (
  presetId: CarouselBackgroundPresetId,
): readonly CarouselCompositionVisualStyle[] => presetStyleFamilies[presetId] ?? [];

export const getCarouselPresetCurveFamilies = (
  presetId: CarouselBackgroundPresetId,
): readonly BrandCompositionCurveFamily[] => {
  const preset = CAROUSEL_BACKGROUND_PRESETS.find((item) => item.id === presetId);
  if (!preset) return [];
  return [preset.composition.shape as CarouselBackgroundShapeType, preset.composition.trajectory?.type as CarouselBackgroundTrajectoryType];
};

export const filterCarouselBackgroundPresets = (
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): typeof CAROUSEL_BACKGROUND_PRESETS => {
  const config = normalizeBrandVisualCompositionConfig(configInput);
  return CAROUSEL_BACKGROUND_PRESETS.filter((preset) => config.allowedPresets.includes(preset.id));
};

export const filterCarouselBackgroundPalettes = (
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): CarouselBackgroundColorVariant[] =>
  normalizeBrandVisualCompositionConfig(configInput).allowedPalettes;

export const filterCarouselCompositionAccents = (
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): CarouselCompositionAccent[] =>
  normalizeBrandVisualCompositionConfig(configInput).enabledAccents;

export const scoreBrandPresetPreference = (
  presetId: CarouselBackgroundPresetId,
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): number => {
  const config = normalizeBrandVisualCompositionConfig(configInput);
  const preset = CAROUSEL_BACKGROUND_PRESETS.find((item) => item.id === presetId);
  if (!preset) return Number.NEGATIVE_INFINITY;
  const curveScore = getCarouselPresetCurveFamilies(presetId)
    .filter((family) => config.preferredCurveFamilies.includes(family)).length;
  const styleScore = getCarouselPresetStyleFamilies(presetId)
    .filter((style) => config.preferredStyleFamilies.includes(style)).length;
  return curveScore * 2 + styleScore;
};

export const constrainCarouselCompositionToBrand = (
  composition: CarouselBackgroundCompositionInput | null | undefined,
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): CarouselBackgroundComposition => {
  const config = normalizeBrandVisualCompositionConfig(configInput);
  const resolved = resolveCarouselBackgroundComposition(composition);
  const colorVariant = config.allowedPalettes.includes(resolved.colorVariant)
    ? resolved.colorVariant
    : config.allowedPalettes[0];
  const presetId = resolved.presetId && config.allowedPresets.includes(resolved.presetId)
    ? resolved.presetId
    : undefined;
  return resolveCarouselBackgroundComposition({
    ...resolved,
    colorVariant,
    ...(presetId ? { presetId } : { presetId: undefined }),
    intensity: Math.min(resolved.intensity, config.intensityCap),
    scale: Math.min(resolved.scale, config.scaleCap),
  });
};

const normalizeSavedCarouselComposition = (
  input: Record<string, unknown>,
  config: BrandVisualCompositionConfig,
  index: number,
): SavedCarouselComposition | null => {
  if (!input.composition || typeof input.composition !== 'object') return null;
  const composition = constrainCarouselCompositionToBrand(
    input.composition as CarouselBackgroundCompositionInput,
    config,
  );
  const now = new Date().toISOString();
  return {
    id: isString(input.id) && input.id ? input.id : `brand-composition-${index + 1}`,
    name: isString(input.name) && input.name.trim() ? input.name.trim() : `Composición ${index + 1}`,
    composition,
    createdAt: isString(input.createdAt) ? input.createdAt : now,
    updatedAt: isString(input.updatedAt) ? input.updatedAt : now,
  };
};

export const saveBrandCarouselComposition = (
  configInput: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null | undefined,
  input: BrandCompositionSavedInput,
): BrandVisualCompositionConfig => {
  const config = normalizeBrandVisualCompositionConfig(configInput);
  const now = new Date().toISOString();
  const id = input.id?.trim() || `brand-composition-${Date.now().toString(36)}`;
  const existing = config.savedCompositions.find((item) => item.id === id);
  const saved: SavedCarouselComposition = {
    id,
    name: input.name?.trim() || existing?.name || 'Composición guardada',
    composition: constrainCarouselCompositionToBrand(input.composition, config),
    createdAt: existing?.createdAt ?? input.createdAt ?? now,
    updatedAt: now,
  };
  return {
    ...config,
    savedCompositions: [
      saved,
      ...config.savedCompositions.filter((item) => item.id !== id),
    ].slice(0, 50),
  };
};

export const removeBrandCarouselComposition = (
  configInput: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null | undefined,
  compositionId: string,
): BrandVisualCompositionConfig => {
  const config = normalizeBrandVisualCompositionConfig(configInput);
  return {
    ...config,
    savedCompositions: config.savedCompositions.filter((item) => item.id !== compositionId),
  };
};

export const isBrandAccentEnabled = (
  accent: CarouselCompositionAccent,
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): boolean => normalizeBrandVisualCompositionConfig(configInput).enabledAccents.includes(accent);

export const isBrandPresetAllowed = (
  presetId: CarouselBackgroundPresetId,
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): boolean => normalizeBrandVisualCompositionConfig(configInput).allowedPresets.includes(presetId);

export const isBrandPaletteAllowed = (
  palette: CarouselBackgroundColorVariant,
  configInput?: BrandVisualCompositionConfigInput | BrandVisualCompositionConfig | null,
): boolean => normalizeBrandVisualCompositionConfig(configInput).allowedPalettes.includes(palette);
