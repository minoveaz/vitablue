import type { ImageProject } from '../types/imageStudio';
import type {
  CarouselBackgroundColorVariant,
  CarouselBackgroundComposition,
  CarouselBackgroundCompositionInput,
  CarouselBackgroundContinuity,
  CarouselBackgroundPresetId,
} from '../types/carouselBackgroundComposition';
import {
  applyCarouselBackgroundPresetToComposition,
  CAROUSEL_BACKGROUND_PRESETS,
  regenerateCarouselBackground,
  resolveCarouselBackgroundComposition,
} from './carouselBackgroundComposition';

export type CarouselCompositionVisualStyle =
  | 'editorial'
  | 'educational'
  | 'conversion'
  | 'comparison'
  | 'testimonial'
  | 'bold';

export type CarouselCompositionDominantZone = 'top' | 'center' | 'bottom' | 'balanced';

export type CarouselCompositionAccent =
  | 'soft-shadow'
  | 'teal-glow'
  | 'gold-glow'
  | 'focal-point'
  | 'slide-bridge';

export interface CarouselCompositionAssistantInput {
  slideCount: number;
  visualStyle: CarouselCompositionVisualStyle;
  dominantZone: CarouselCompositionDominantZone;
  continuity: CarouselBackgroundContinuity;
  colorPalette: CarouselBackgroundColorVariant;
  intensity: number;
  scale: number;
  selectedAccents: readonly CarouselCompositionAccent[];
  currentComposition?: CarouselBackgroundCompositionInput | null;
}

export interface CarouselCompositionProposal {
  id: string;
  presetId: CarouselBackgroundPresetId;
  label: string;
  description: string;
  rationale: string;
  score: number;
  composition: CarouselBackgroundComposition;
  accents: readonly CarouselCompositionAccent[];
}

const PRESET_ORDER = CAROUSEL_BACKGROUND_PRESETS.map((preset) => preset.id);

const STYLE_WEIGHTS: Record<CarouselCompositionVisualStyle, Partial<Record<CarouselBackgroundPresetId, number>>> = {
  editorial: { 'composicion-editorial': 7, 'montana-central': 4, 'semicirculo-entre-slides': 3 },
  educational: { 'montana-central': 7, 'onda-ascendente': 5, 'composicion-editorial': 4 },
  conversion: { 'cta-final': 8, 'diagonal-dinamica': 6, 'caida-inicial': 4 },
  comparison: { 'diagonal-dinamica': 7, 'semicirculo-entre-slides': 5, 'montana-central': 3 },
  testimonial: { 'onda-ascendente': 7, 'semicirculo-entre-slides': 5, 'composicion-editorial': 3 },
  bold: { 'caida-inicial': 7, 'diagonal-dinamica': 7, 'cta-final': 5 },
};

const ZONE_WEIGHTS: Record<CarouselCompositionDominantZone, Partial<Record<CarouselBackgroundPresetId, number>>> = {
  top: { 'caida-inicial': 5, 'onda-ascendente': 3 },
  center: { 'montana-central': 6, 'semicirculo-entre-slides': 3 },
  bottom: { 'cta-final': 6, 'composicion-editorial': 4 },
  balanced: { 'semicirculo-entre-slides': 5, 'composicion-editorial': 4, 'onda-ascendente': 3 },
};

const RATIONALES: Record<CarouselCompositionVisualStyle, string> = {
  editorial: 'Da espacio a titulares y lectura pausada sin competir con el contenido.',
  educational: 'Marca un punto de atención claro para explicar una idea paso a paso.',
  conversion: 'Concentra el contraste y el acento visual en la decisión final.',
  comparison: 'Ordena la mirada para contrastar opciones y mantener el ritmo entre slides.',
  testimonial: 'Acompaña una progresión cálida que refuerza confianza y prueba social.',
  bold: 'Introduce tensión visual y un gesto gráfico reconocible desde el primer slide.',
};

const clamp = (value: number, min: number, max: number, fallback: number) =>
  Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));

const accentShadow = (
  accents: readonly CarouselCompositionAccent[],
  fallback: CarouselBackgroundComposition['shadow'],
): CarouselBackgroundComposition['shadow'] => {
  if (accents.includes('gold-glow')) return 'glow-gold';
  if (accents.includes('teal-glow')) return 'glow-teal';
  if (accents.includes('soft-shadow')) return 'soft';
  return fallback;
};

const focalPointFor = (
  zone: CarouselCompositionDominantZone,
): { x: number; y: number } => {
  if (zone === 'top') return { x: 0.5, y: 0.28 };
  if (zone === 'center') return { x: 0.5, y: 0.5 };
  if (zone === 'bottom') return { x: 0.65, y: 0.76 };
  return { x: 0.5, y: 0.58 };
};

const scorePreset = (
  presetId: CarouselBackgroundPresetId,
  input: CarouselCompositionAssistantInput,
): number => {
  const slideCountScore = input.slideCount >= 7
    ? (presetId === 'onda-ascendente' || presetId === 'semicirculo-entre-slides' ? 3 : 0)
    : input.slideCount <= 3
      ? (presetId === 'cta-final' || presetId === 'composicion-editorial' ? 2 : 0)
      : 1;
  const continuityScore = input.continuity === 'seamless'
    ? (presetId === 'caida-inicial' || presetId === 'onda-ascendente' || presetId === 'diagonal-dinamica' ? 3 : 0)
    : input.continuity === 'flow'
      ? (presetId === 'semicirculo-entre-slides' || presetId === 'onda-ascendente' ? 3 : 0)
      : (presetId === 'composicion-editorial' || presetId === 'cta-final' ? 3 : 0);
  return (
    (STYLE_WEIGHTS[input.visualStyle][presetId] ?? 0) +
    (ZONE_WEIGHTS[input.dominantZone][presetId] ?? 0) +
    slideCountScore +
    continuityScore
  );
};

const applyAssistantPreferences = (
  composition: CarouselBackgroundComposition,
  input: CarouselCompositionAssistantInput,
): CarouselBackgroundComposition => {
  const accents = input.selectedAccents;
  return resolveCarouselBackgroundComposition({
    ...composition,
    continuity: input.continuity,
    intensity: clamp(input.intensity, 0, 1, composition.intensity),
    scale: clamp(input.scale, 0.25, 3, composition.scale),
    shadow: accentShadow(accents, composition.shadow),
    ...(accents.includes('focal-point') ? { focalPoint: focalPointFor(input.dominantZone) } : {}),
    ...(accents.includes('slide-bridge') && input.continuity === 'local'
      ? { continuity: 'flow' }
      : {}),
  });
};

/**
 * Ranks the approved background presets into stable, selectable proposals.
 * No random values or model calls are used, so the same brief always produces
 * the same ordering and can be safely regenerated in the editor.
 */
export const generateCarouselCompositionProposals = (
  input: CarouselCompositionAssistantInput,
  limit = 3,
): CarouselCompositionProposal[] => {
  const requestedLimit = Number.isFinite(limit) ? Math.floor(limit) : 3;
  const safeLimit = Math.max(1, Math.min(CAROUSEL_BACKGROUND_PRESETS.length, requestedLimit));
  const base = input.currentComposition ?? undefined;
  return CAROUSEL_BACKGROUND_PRESETS
    .map((preset, index) => {
      const score = scorePreset(preset.id, input);
      const presetComposition = applyCarouselBackgroundPresetToComposition(base, preset.id, {
        colorVariant: input.colorPalette,
        intensity: input.intensity,
        scale: input.scale,
        preserveCustomEdits: true,
      });
      const composition = applyAssistantPreferences(presetComposition, input);
      return {
        id: `assistant-${preset.id}`,
        presetId: preset.id,
        label: preset.label,
        description: preset.description,
        rationale: RATIONALES[input.visualStyle],
        score,
        composition,
        accents: [...input.selectedAccents],
        index,
      };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .slice(0, safeLimit)
    .map(({ index: _index, ...proposal }) => proposal);
};

export const selectCarouselCompositionProposal = (
  proposals: readonly CarouselCompositionProposal[],
  proposalId: string | null | undefined,
): CarouselCompositionProposal | undefined =>
  proposals.find((proposal) => proposal.id === proposalId) ?? proposals[0];

/** Applies a complete proposal through the same structural regeneration path as the editor. */
export const applyCarouselCompositionProposal = (
  project: ImageProject,
  proposal: CarouselCompositionProposal,
): ImageProject => regenerateCarouselBackground(project, proposal.composition);

/** Exposed for consumers that need the catalog order when rendering deterministic UI. */
export const getCarouselCompositionPresetOrder = (): readonly CarouselBackgroundPresetId[] => PRESET_ORDER;
