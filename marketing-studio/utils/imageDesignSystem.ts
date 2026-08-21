import {
  CanvasGuideSettings,
  ImageFormatPreset,
  ImageLayer,
  ImagePlatformGuideId,
  ImageStyleVariantId,
  ImageTextFit,
} from '../types/imageStudio';

export interface PlatformGuideProfile {
  id: ImagePlatformGuideId;
  label: string;
  description: string;
  safeInsets: { top: number; right: number; bottom: number; left: number };
  margins: { top: number; right: number; bottom: number; left: number };
  columns: number;
  columnGap: number;
}

export interface AutoLayoutOptions {
  direction: 'vertical' | 'horizontal' | 'grid';
  gap?: number;
  columns?: number;
  alignment?: 'start' | 'center' | 'end';
  profileId?: ImagePlatformGuideId | 'auto';
}

export interface ContentReplacement {
  text?: string;
  imageUrl?: string;
  props?: Record<string, unknown>;
}

const pctInsets = (
  preset: ImageFormatPreset,
  top: number,
  right: number,
  bottom: number,
  left: number
) => ({
  top: Math.round(preset.height * top),
  right: Math.round(preset.width * right),
  bottom: Math.round(preset.height * bottom),
  left: Math.round(preset.width * left),
});

export const resolvePlatformGuideId = (preset: ImageFormatPreset): ImagePlatformGuideId => {
  if (preset.id === 'story-vertical') return 'meta-story';
  if (preset.id === 'facebook-cover') return 'facebook-cover';
  if (preset.category === 'instagram' || preset.category === 'facebook') return 'meta-feed';
  if (preset.category === 'tiktok') return 'tiktok';
  if (preset.category === 'linkedin') return 'linkedin';
  if (preset.category === 'twitter') return 'x';
  if (preset.category === 'youtube') return 'youtube';
  if (preset.category === 'email_marketing') return 'email';
  if (preset.category === 'documents' || preset.category === 'sheets') return 'document';
  return 'web';
};

export const getPlatformGuideProfile = (
  preset: ImageFormatPreset,
  requestedId: ImagePlatformGuideId | 'auto' = 'auto'
): PlatformGuideProfile => {
  const id = requestedId === 'auto' ? resolvePlatformGuideId(preset) : requestedId;
  const margin = pctInsets(preset, 0.05, 0.05, 0.05, 0.05);
  const common = { id, margins: margin };

  switch (id) {
    case 'meta-story':
      return {
        ...common,
        label: 'Meta Stories / Reels',
        description: 'Protege texto y CTA de la cabecera y los controles inferiores.',
        safeInsets: pctInsets(preset, 0.13, 0.056, 0.177, 0.056),
        columns: 4,
        columnGap: Math.round(preset.width * 0.022),
      };
    case 'tiktok':
      return {
        ...common,
        label: 'TikTok',
        description: 'Evita navegación, descripción y acciones laterales de TikTok.',
        safeInsets: pctInsets(preset, 0.08, 0.1, 0.2, 0.056),
        columns: 4,
        columnGap: Math.round(preset.width * 0.022),
      };
    case 'facebook-cover':
      return {
        ...common,
        label: 'Portada de Facebook',
        description: 'Conserva el contenido principal en el recorte móvil central.',
        safeInsets: pctInsets(preset, 0.04, 0.11, 0.04, 0.11),
        columns: 8,
        columnGap: Math.round(preset.width * 0.018),
      };
    case 'linkedin':
      return {
        ...common,
        label: 'LinkedIn Feed',
        description: 'Área de lectura segura para publicaciones profesionales.',
        safeInsets: pctInsets(preset, 0.06, 0.05, 0.06, 0.05),
        columns: 12,
        columnGap: Math.round(preset.width * 0.018),
      };
    case 'x':
      return {
        ...common,
        label: 'X / Twitter',
        description: 'Mantiene el mensaje clave fuera de recortes de vista previa.',
        safeInsets: pctInsets(preset, 0.07, 0.06, 0.07, 0.06),
        columns: preset.width / preset.height > 2 ? 12 : 8,
        columnGap: Math.round(preset.width * 0.016),
      };
    case 'youtube':
      return {
        ...common,
        label: 'YouTube',
        description: 'Composición segura para miniaturas y vídeo horizontal.',
        safeInsets: pctInsets(preset, 0.05, 0.05, 0.05, 0.05),
        columns: 12,
        columnGap: Math.round(preset.width * 0.018),
      };
    case 'email':
      return {
        ...common,
        label: 'Email marketing',
        description: 'Márgenes compatibles con clientes de correo y bloques responsivos.',
        safeInsets: pctInsets(preset, 0.06, 0.06, 0.06, 0.06),
        columns: 6,
        columnGap: Math.round(preset.width * 0.02),
      };
    case 'document':
      return {
        ...common,
        label: 'Documento / Informe',
        description: 'Respeta sangrado visual y zona editorial de lectura.',
        safeInsets: pctInsets(preset, 0.07, 0.07, 0.07, 0.07),
        columns: 12,
        columnGap: Math.round(preset.width * 0.018),
      };
    case 'web':
      return {
        ...common,
        label: 'Web / Display',
        description: 'Zona flexible para banners y cabeceras adaptativas.',
        safeInsets: pctInsets(preset, 0.06, 0.06, 0.06, 0.06),
        columns: 12,
        columnGap: Math.round(preset.width * 0.018),
      };
    default:
      return {
        ...common,
        id: 'meta-feed',
        label: 'Meta Feed',
        description: 'Zona segura para publicaciones y anuncios de Meta.',
        safeInsets: pctInsets(preset, 0.05, 0.05, 0.05, 0.05),
        columns: preset.aspectRatio === '1:1' ? 6 : 4,
        columnGap: Math.round(preset.width * 0.022),
      };
  }
};

export const createDefaultGuideSettings = (preset: ImageFormatPreset): CanvasGuideSettings => {
  const profile = getPlatformGuideProfile(preset);
  return {
    profileId: 'auto',
    showRulers: true,
    showGrid: false,
    showColumns: true,
    showMargins: true,
    showSafeZone: true,
    snapToGuides: true,
    columns: profile.columns,
    columnGap: profile.columnGap,
    customVerticalGuides: [],
    customHorizontalGuides: [],
  };
};

export const getGuideSnapLines = (
  preset: ImageFormatPreset,
  settings?: CanvasGuideSettings
): { vertical: number[]; horizontal: number[] } => {
  const resolved = settings ?? createDefaultGuideSettings(preset);
  const profile = getPlatformGuideProfile(preset, resolved.profileId);
  const vertical = new Set<number>();
  const horizontal = new Set<number>();

  if (resolved.showMargins) {
    vertical.add(profile.margins.left);
    vertical.add(preset.width - profile.margins.right);
    horizontal.add(profile.margins.top);
    horizontal.add(preset.height - profile.margins.bottom);
  }
  if (resolved.showSafeZone) {
    vertical.add(profile.safeInsets.left);
    vertical.add(preset.width - profile.safeInsets.right);
    horizontal.add(profile.safeInsets.top);
    horizontal.add(preset.height - profile.safeInsets.bottom);
  }
  if (resolved.showColumns) {
    const columns = Math.max(1, resolved.columns);
    const contentWidth = preset.width - profile.margins.left - profile.margins.right;
    const columnWidth = (contentWidth - resolved.columnGap * (columns - 1)) / columns;
    for (let index = 0; index <= columns; index += 1) {
      const x = profile.margins.left + index * (columnWidth + resolved.columnGap);
      vertical.add(Math.round(Math.min(preset.width, x)));
    }
  }
  resolved.customVerticalGuides.forEach((percent) => vertical.add((percent / 100) * preset.width));
  resolved.customHorizontalGuides.forEach((percent) => horizontal.add((percent / 100) * preset.height));

  return { vertical: [...vertical], horizontal: [...horizontal] };
};

const getLayerSize = (layer: ImageLayer) => ({
  width: (layer.width ?? 380) * (layer.scale ?? 1),
  height:
    (layer.height ??
      (layer.type === 'text' || layer.blockType === 'CustomText'
        ? (layer.fontSize ?? 32) * (Number(layer.props.maxLines ?? 2) + 0.5)
        : 200)) * (layer.scale ?? 1),
});

export const autoLayoutLayers = (
  layers: ImageLayer[],
  selectedIds: string[],
  preset: ImageFormatPreset,
  options: AutoLayoutOptions
): ImageLayer[] => {
  const selected = layers.filter((layer) => selectedIds.includes(layer.id) && !layer.locked);
  if (selected.length === 0) return layers;

  const profile = getPlatformGuideProfile(preset, options.profileId);
  const safe = {
    left: profile.safeInsets.left,
    top: profile.safeInsets.top,
    width: preset.width - profile.safeInsets.left - profile.safeInsets.right,
    height: preset.height - profile.safeInsets.top - profile.safeInsets.bottom,
  };
  const gap = Math.max(0, options.gap ?? Math.round(Math.min(preset.width, preset.height) * 0.03));
  const placement = new Map<string, { x: number; y: number; scale?: number }>();
  const alignment = options.alignment ?? 'center';
  const alignCrossAxis = (start: number, available: number, item: number) => {
    if (alignment === 'start') return start + item / 2;
    if (alignment === 'end') return start + available - item / 2;
    return start + available / 2;
  };

  if (options.direction === 'grid') {
    const columns = Math.max(1, Math.min(options.columns ?? 2, selected.length));
    const rows = Math.ceil(selected.length / columns);
    const cellWidth = (safe.width - gap * (columns - 1)) / columns;
    const cellHeight = (safe.height - gap * (rows - 1)) / rows;
    selected.forEach((layer, index) => {
      const size = getLayerSize(layer);
      const fitScale = Math.min(1, cellWidth / size.width, cellHeight / size.height);
      const column = index % columns;
      const row = Math.floor(index / columns);
      placement.set(layer.id, {
        x: safe.left + column * (cellWidth + gap) + cellWidth / 2,
        y: safe.top + row * (cellHeight + gap) + cellHeight / 2,
        scale: (layer.scale ?? 1) * fitScale,
      });
    });
  } else {
    const vertical = options.direction === 'vertical';
    const sizes = selected.map(getLayerSize);
    const total = sizes.reduce((sum, size) => sum + (vertical ? size.height : size.width), 0) + gap * (selected.length - 1);
    const available = vertical ? safe.height : safe.width;
    const fitScale = Math.min(1, Math.max(0.1, (available - gap * (selected.length - 1)) / Math.max(1, total - gap * (selected.length - 1))));
    const fittedTotal =
      sizes.reduce((sum, size) => sum + (vertical ? size.height : size.width) * fitScale, 0) +
      gap * (selected.length - 1);
    let cursor = (vertical ? safe.top : safe.left) + Math.max(0, (available - fittedTotal) / 2);
    selected.forEach((layer, index) => {
      const size = sizes[index];
      const primarySize = (vertical ? size.height : size.width) * fitScale;
      const crossSize = (vertical ? size.width : size.height) * fitScale;
      placement.set(layer.id, {
        x: vertical ? alignCrossAxis(safe.left, safe.width, crossSize) : cursor + primarySize / 2,
        y: vertical ? cursor + primarySize / 2 : alignCrossAxis(safe.top, safe.height, crossSize),
        scale: (layer.scale ?? 1) * fitScale,
      });
      cursor += primarySize + gap;
    });
  }

  return layers.map((layer) => {
    const next = placement.get(layer.id);
    if (!next) return layer;
    return {
      ...layer,
      position: {
        x: Math.round((next.x / preset.width) * 1000) / 10,
        y: Math.round((next.y / preset.height) * 1000) / 10,
      },
      scale: Math.round((next.scale ?? layer.scale) * 100) / 100,
    };
  });
};

const estimateWrappedLines = (text: string, fontSize: number, width: number): number => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 1;
  const maxUnits = Math.max(1, width / (fontSize * 0.55));
  let lines = 1;
  let current = 0;
  words.forEach((word) => {
    const units = Math.max(1, word.length);
    if (current > 0 && current + 1 + units > maxUnits) {
      lines += 1;
      current = units;
    } else {
      current += (current > 0 ? 1 : 0) + units;
    }
  });
  return lines;
};

export const fitTextLayer = (layer: ImageLayer, overrides: Partial<ImageTextFit> = {}): ImageLayer => {
  if (layer.locked || (layer.type !== 'text' && layer.blockType !== 'CustomText')) return layer;
  const current = (layer.props.textFit as ImageTextFit | undefined) ?? {
    mode: 'auto',
    minFontSize: 12,
    maxFontSize: layer.fontSize ?? 72,
    maxLines: 3,
  };
  const settings: ImageTextFit = { ...current, ...overrides };
  const text = String(layer.props.text ?? layer.title ?? '');
  const width = Math.max(40, layer.width ?? 420);
  const lineHeight = layer.lineHeight ?? 1.2;
  const availableHeight = layer.height ?? settings.maxLines * settings.maxFontSize * lineHeight;
  let low = Math.max(8, settings.minFontSize);
  let high = Math.max(low, settings.maxFontSize);
  let best = low;

  while (low <= high) {
    const candidate = Math.floor((low + high) / 2);
    const lines = estimateWrappedLines(text, candidate, width);
    const fits = lines <= settings.maxLines && lines * candidate * lineHeight <= availableHeight;
    if (fits) {
      best = candidate;
      low = candidate + 1;
    } else {
      high = candidate - 1;
    }
  }

  return {
    ...layer,
    fontSize: settings.mode === 'auto' ? best : layer.fontSize,
    props: { ...layer.props, textFit: settings },
  };
};

export const replaceLayerContent = (layer: ImageLayer, replacement: ContentReplacement): ImageLayer => {
  if (layer.locked) return layer;
  const props = { ...layer.props, ...(replacement.props ?? {}) };
  if (replacement.imageUrl !== undefined) {
    props.imageUrl = replacement.imageUrl;
    props.src = replacement.imageUrl;
  }
  if (replacement.text !== undefined) {
    const contentKeys = [
      'text',
      'ctaText',
      'whatsAppText',
      'verifiedLabel',
      'highlight',
      'title',
      'buttonText',
    ].filter((key) => key in props);
    (contentKeys.length > 0 ? contentKeys : ['text']).forEach((key) => {
      props[key] = replacement.text;
    });
  }
  return {
    ...layer,
    src: replacement.imageUrl ?? layer.src,
    props,
  };
};

const STYLE_VARIANTS: Record<
  ImageStyleVariantId,
  { primary: string; accent: string; text: string; soft: string; shadow: ImageLayer['shadowPreset'] }
> = {
  ocean: { primary: '#005F73', accent: '#94D2BD', text: '#FFFFFF', soft: '#DDF3EC', shadow: 'glow_teal' },
  gold: { primary: '#EE9B00', accent: '#CA6702', text: '#001219', soft: '#FFF3D6', shadow: 'glow_gold' },
  mint: { primary: '#94D2BD', accent: '#005F73', text: '#001219', soft: '#E7F8F2', shadow: 'soft' },
  midnight: { primary: '#001219', accent: '#94D2BD', text: '#FFFFFF', soft: '#0B2831', shadow: 'deep' },
};

export const applyLayerStyleVariant = (layer: ImageLayer, variantId: ImageStyleVariantId): ImageLayer => {
  if (layer.locked) return layer;
  const variant = STYLE_VARIANTS[variantId];
  const isText = layer.type === 'text' || layer.blockType === 'CustomText';
  return {
    ...layer,
    styleVariant: variantId,
    fill: isText ? variant.primary : layer.type === 'shape' ? variant.primary : layer.fill,
    borderColor: variant.accent,
    shadowPreset: variant.shadow,
    props: {
      ...layer.props,
      variant: variantId,
      primaryColor: variant.primary,
      accentColor: variant.accent,
      textColor: variant.text,
      color: isText ? variant.primary : (layer.props.color ?? variant.text),
      surfaceColor: variant.soft,
    },
  };
};
