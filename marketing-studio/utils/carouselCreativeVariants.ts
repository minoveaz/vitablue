import {
  CAROUSEL_ASPECT_RATIO_DIMENSIONS,
} from '../types/imageStudio';
import type {
  CarouselAspectRatio,
  CarouselCreativeVariant,
  ImageLayer,
  ImageProject,
  ImageFormatPreset,
  ImageStyleVariantId,
} from '../types/imageStudio';
import { CAROUSEL_LAYOUT_CATALOG, getCarouselLayout } from '../data/carouselLayoutCatalog';
import { applyLayerStyleVariant, fitTextLayer } from './imageDesignSystem';
import { changeCarouselLayout } from './carouselSlideOperations';
import { normalizeTiptapHtml } from './tiptapHtml';
import {
  CAROUSEL_BACKGROUND_PALETTES,
  regenerateCarouselBackground,
} from './carouselBackgroundComposition';

const STYLE_BACKGROUND: Record<ImageStyleVariantId, string> = {
  ocean: '#005F73',
  gold: '#FFF3D6',
  mint: '#E7F8F2',
  midnight: '#001219',
  white: '#FFFFFF',
};

export const CAROUSEL_ASPECT_RATIOS: Array<{
  id: CarouselAspectRatio;
  label: string;
  description: string;
}> = [
  { id: '1:1', label: 'Cuadrado', description: 'Feed clásico y galerías' },
  { id: '4:5', label: 'Retrato', description: 'Más presencia en el feed' },
  { id: '9:16', label: 'Vertical', description: 'Stories, Reels y TikTok' },
  { id: '16:9', label: 'Panorámico', description: 'LinkedIn, X y presentaciones' },
];

export const CAROUSEL_CREATIVE_VARIANTS: CarouselCreativeVariant[] = [
  ...CAROUSEL_LAYOUT_CATALOG.map((layout) => ({
    id: `layout-${layout.id}`,
    kind: 'layout' as const,
    label: layout.name,
    description: layout.description,
    layoutId: layout.id,
  })),
  { id: 'color-ocean', kind: 'color', label: 'Océano', description: 'Teal VitaBlue con contraste editorial', styleVariant: 'ocean' },
  { id: 'color-gold', kind: 'color', label: 'Ámbar', description: 'Acentos cálidos para campañas de conversión', styleVariant: 'gold' },
  { id: 'color-mint', kind: 'color', label: 'Menta', description: 'Superficie clara y sensación de confianza', styleVariant: 'mint' },
  { id: 'color-midnight', kind: 'color', label: 'Medianoche', description: 'Modo oscuro de alto contraste', styleVariant: 'midnight' },
  { id: 'color-white', kind: 'color', label: 'Blanco', description: 'Fondo blanco con acentos VitaBlue', styleVariant: 'white' },
  { id: 'copy-educational', kind: 'copy', label: 'Educativo', description: 'Explica el valor paso a paso', copyPreset: 'educational' },
  { id: 'copy-direct', kind: 'copy', label: 'Directo', description: 'Mensaje corto orientado a decisión', copyPreset: 'direct' },
  { id: 'copy-proof', kind: 'copy', label: 'Prueba', description: 'Refuerza confianza y evidencia', copyPreset: 'proof' },
  { id: 'cta-quote', kind: 'cta', label: 'Cotizar ahora', description: 'CTA de conversión inmediata', ctaText: 'Cotizar ahora' },
  { id: 'cta-advice', kind: 'cta', label: 'Pedir asesoría', description: 'CTA humano para resolver dudas', ctaText: 'Pedir asesoría gratuita' },
  { id: 'cta-discover', kind: 'cta', label: 'Descubrir opciones', description: 'CTA de exploración', ctaText: 'Descubrir mis opciones' },
  { id: 'image-natural', kind: 'image', label: 'Natural', description: 'Fotografía sin tratamiento', imageTreatment: 'none' },
  { id: 'image-teal', kind: 'image', label: 'Teal', description: 'Tratamiento cromático de marca', imageTreatment: 'teal_tint' },
  { id: 'image-gold', kind: 'image', label: 'Ámbar', description: 'Tratamiento cálido para destacar', imageTreatment: 'gold_tint' },
  { id: 'image-mono', kind: 'image', label: 'Monocromo', description: 'Fotografía sobria en escala de grises', imageTreatment: 'grayscale' },
];

const COPY_BY_PRESET = {
  educational: {
    hook: 'Entiende tu seguro en 3 pasos',
    content: 'La guía clara para elegir cobertura sin complicaciones.',
    proof: 'Todo lo importante, explicado en idioma humano.',
    cta: 'Guarda esta guía para consultarla cuando quieras.',
  },
  direct: {
    hook: 'Protección sin letra pequeña',
    content: 'Compara coberturas y decide con confianza.',
    proof: 'Menos dudas. Más tranquilidad.',
    cta: 'Empieza tu comparación gratuita.',
  },
  proof: {
    hook: 'La elección que más personas recomiendan',
    content: 'Datos claros y acompañamiento independiente.',
    proof: 'Confianza verificada por nuestra comunidad.',
    cta: 'Comprueba qué opción encaja contigo.',
  },
} as const;

const getLayerRole = (project: ImageProject, layer: ImageLayer): string | undefined => {
  const slideIndex = layer.props?.slideIndex;
  if (typeof slideIndex !== 'number') return undefined;
  return project.carouselConfig?.slides[slideIndex]?.role;
};

const getCopyValue = (project: ImageProject, layer: ImageLayer, preset: keyof typeof COPY_BY_PRESET): string | undefined => {
  const tag = String(layer.props?.tag ?? layer.props?.slotId ?? '');
  const role = getLayerRole(project, layer);
  if (tag.includes('title') || tag.includes('hook')) return COPY_BY_PRESET[preset].hook;
  if (tag.includes('body') || tag.includes('content')) return COPY_BY_PRESET[preset].content;
  if (tag.includes('metric') || role === 'proof') return COPY_BY_PRESET[preset].proof;
  if (tag.includes('cta') || role === 'cta') return COPY_BY_PRESET[preset].cta;
  return undefined;
};

const updateLayerCopy = (project: ImageProject, layer: ImageLayer, preset: keyof typeof COPY_BY_PRESET): ImageLayer => {
  if (layer.locked || (layer.type !== 'text' && layer.blockType !== 'CustomText' && !String(layer.props?.tag ?? '').match(/title|body|cta|metric/))) {
    return layer;
  }
  const text = getCopyValue(project, layer, preset);
  if (!text) return layer;
  return fitTextLayer({
    ...layer,
    props: {
      ...layer.props,
      text: normalizeTiptapHtml(text),
      title: normalizeTiptapHtml(text),
      ctaText: normalizeTiptapHtml(text),
      buttonText: normalizeTiptapHtml(text),
      variantCopy: preset,
    },
  });
};

export const getCarouselPresetForAspectRatio = (
  project: ImageProject,
  aspectRatio: CarouselAspectRatio,
): ImageFormatPreset => {
  const dimensions = CAROUSEL_ASPECT_RATIO_DIMENSIONS[aspectRatio];
  const slideCount = project.carouselConfig?.slideCount ?? project.preset.defaultSlideCount ?? 5;
  return {
    ...project.preset,
    id: `${project.preset.id.replace(/-(1x1|4x5|9x16|16x9)$/, '')}-${aspectRatio.replace(':', 'x')}`,
    name: `${project.preset.name.split(' (')[0]} (${aspectRatio})`,
    width: dimensions.width * slideCount,
    height: dimensions.height,
    aspectRatio: `${aspectRatio} (Multi)`,
    isCarousel: true,
    defaultSlideCount: slideCount,
    slideWidth: dimensions.width,
    slideHeight: dimensions.height,
  };
};

export const applyCarouselCreativeVariant = (
  project: ImageProject,
  variant: CarouselCreativeVariant,
): ImageProject => {
  let next = project;
  if (variant.kind === 'layout' && variant.layoutId) {
    const layout = getCarouselLayout(variant.layoutId);
    if (layout) next = changeCarouselLayout(next, layout);
  }

  if (variant.kind === 'color' && variant.styleVariant) {
    next = {
      ...next,
      background: {
        ...next.background,
        gradient: undefined,
        color: STYLE_BACKGROUND[variant.styleVariant],
      },
      layers: next.layers.map((layer) => applyLayerStyleVariant(layer, variant.styleVariant!)),
    };
    if (
      next.carouselConfig?.enabled &&
      (variant.styleVariant === 'white' ||
        variant.styleVariant === 'midnight' ||
        variant.styleVariant === 'ocean')
    ) {
      next = regenerateCarouselBackground(next, { colorVariant: variant.styleVariant });
      next = {
        ...next,
        background: {
          ...next.background,
          gradient: undefined,
          color: CAROUSEL_BACKGROUND_PALETTES[variant.styleVariant].background,
        },
      };
    }
  }

  if (variant.kind === 'copy' && variant.copyPreset) {
    next = { ...next, layers: next.layers.map((layer) => updateLayerCopy(next, layer, variant.copyPreset!)) };
  }

  if (variant.kind === 'cta' && variant.ctaText) {
    const ctaText = normalizeTiptapHtml(variant.ctaText);
    next = {
      ...next,
      layers: next.layers.map((layer) => {
        const tag = String(layer.props?.tag ?? layer.props?.slotId ?? '');
        if (layer.locked || (!tag.includes('cta') && getLayerRole(next, layer) !== 'cta')) return layer;
        return {
          ...layer,
          props: {
            ...layer.props,
            ctaText,
            buttonText: ctaText,
            whatsAppText: ctaText,
            variantCta: variant.id,
          },
        };
      }),
    };
  }

  if (variant.kind === 'image' && variant.imageTreatment) {
    next = {
      ...next,
      layers: next.layers.map((layer) =>
        layer.locked || (layer.type !== 'image' && !layer.src && !layer.props?.imageUrl)
          ? layer
          : { ...layer, filter: variant.imageTreatment },
      ),
    };
  }

  return {
    ...next,
    updatedAt: new Date().toISOString(),
  };
};
