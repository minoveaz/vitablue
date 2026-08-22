import { ImageBlockType, ImageLayer, ImageLayerContent, ImageLayerGeometry, ImageLayerStyle } from '../types/imageStudio';
import {
  DEFAULT_LAYER_LAYOUT_CONSTRAINTS,
  type LayerLayoutConstraints,
} from '../../packages/video-studio/src/domain/layoutConstraints';

export type ImageLayerModel = ImageLayerContent & ImageLayerGeometry & ImageLayerStyle & {
  id: ImageLayer['id'];
  zIndex: ImageLayer['zIndex'];
  props: ImageLayer['props'];
  constraints?: LayerLayoutConstraints;
};

export const toImageLayerModel = (layer: ImageLayer): ImageLayerModel => layer;

export interface GroupedLayer extends ImageLayer {
  relX: number;
  relY: number;
  /** Marketing groups use percentages relative to the group bounds. */
  relativeSpace?: 'canvas-percent' | 'group-percent';
}

export const MARKETING_BLOCK_TYPES: readonly ImageBlockType[] = [
  'MarketingBrandHero',
  'MarketingSectionIntro',
  'MarketingTestimonial',
  'MarketingFeatureGrid',
  'MarketingPromoCard',
  'InsuranceProductHero',
  'InsuranceCoverageGrid',
  'InsuranceTestimonialGrid',
  'InsurancePlanComparison',
  'InsuranceProductCard',
  'InsuranceTrustBar',
  'InsuranceProviderBar',
  'InsuranceTransparency',
  'InsuranceFaq',
  'InsuranceAdvisorCta',
];

export const isMarketingBlockType = (blockType?: ImageBlockType): boolean =>
  Boolean(blockType && MARKETING_BLOCK_TYPES.includes(blockType));

interface MarketingGroupOptions {
  width: number;
  height: number;
  position?: { x: number; y: number };
  canvasWidth?: number;
  canvasHeight?: number;
}

interface MarketingPartDefinition {
  part: string;
  relX: number;
  relY: number;
  width: number;
  height: number;
  zIndex: number;
  text?: string;
  [key: string]: unknown;
}

const marketingPartDefinitions = (
  blockType: ImageBlockType,
  props: Record<string, unknown>,
  width: number,
  height: number,
): MarketingPartDefinition[] => {
  const textValue = (key: string, fallback: string) => String(props[key] ?? fallback);
  const items = (key: string, fallback: string[]) => {
    let value = props[key];
    if (typeof value === 'string') {
      const stringValue = value;
      try {
        value = JSON.parse(value);
      } catch {
        value = stringValue.split(/\r?\n/).map((item: string) => item.trim()).filter(Boolean);
      }
    }
    if (Array.isArray(value) && value.length > 0) return value.map(String);
    return fallback;
  };
  const objectItems = (key: string, fallback: Record<string, unknown>[]) => {
    let value = props[key];
    if (typeof value === 'string') {
      try {
        value = JSON.parse(value);
      } catch {
        value = undefined;
      }
    }
    return Array.isArray(value) && value.length > 0
      ? value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      : fallback;
  };
  const base: MarketingPartDefinition[] = [
    { part: 'background', relX: 0, relY: 0, width, height, zIndex: 0 },
  ];
  const add = (part: string, relX: number, relY: number, partWidth: number, partHeight: number, zIndex: number, text?: string, extra: Record<string, unknown> = {}) =>
    base.push({ part, relX, relY, width: partWidth, height: partHeight, zIndex, text, ...extra });

  switch (blockType) {
    case 'MarketingBrandHero':
      add('eyebrow', -28, -36, width * 0.86, 30, 1, textValue('eyebrow', 'ASESORAMIENTO CLARO'));
      add('title', -8, -10, width * 0.86, 145, 2, textValue('title', 'Encuentra una opción que encaje contigo'));
      add('description', 0, 19, width * 0.82, 90, 3, textValue('description', 'Información sencilla y acompañamiento humano para decidir con confianza.'));
      add('cta', 0, 38, width * 0.38, 52, 4, textValue('ctaText', 'Ver opciones'));
      break;
    case 'MarketingSectionIntro':
      add('eyebrow', 0, -25, width * 0.84, 24, 1, textValue('eyebrow', 'CÓMO TE AYUDAMOS'));
      add('title', 0, 0, width * 0.84, 90, 2, textValue('title', 'Una explicación clara antes de decidir'));
      add('description', 0, 24, width * 0.82, 72, 3, textValue('description', 'Presenta el contexto con una jerarquía consistente y fácil de leer.'));
      break;
    case 'MarketingTestimonial':
      add('stars', -38, -35, width * 0.84, 26, 1, String(props.stars ?? 5));
      add('comment', 0, -5, width * 0.84, 105, 2, `“${textValue('comment', 'El proceso fue sencillo y pude decidir con toda la información.')}”`);
      add('author', -10, 29, width * 0.82, 32, 3, textValue('author', 'Cliente'));
      add('meta', -10, 40, width * 0.82, 24, 4, textValue('meta', 'Cliente satisfecho'));
      break;
    case 'MarketingFeatureGrid': {
      add('eyebrow', 0, -39, width * 0.88, 24, 1, textValue('eyebrow', 'PUNTOS CLAVE'));
      add('title', 0, -28, width * 0.88, 70, 2, textValue('title', 'Lo importante, en un vistazo'));
      items('items', ['Información transparente', 'Opciones comparables', 'Acompañamiento humano']).slice(0, 3).forEach((item, index) => {
        add('item', -31 + index * 31, 18, width * 0.28, height * 0.38, 3, item, { itemIndex: index });
      });
      break;
    }
    case 'MarketingPromoCard':
      add('provider', -34, -35, width * 0.54, 42, 1, textValue('provider', 'VitaBlue'));
      add('product', -34, -22, width * 0.54, 28, 2, textValue('productName', 'Una opción más clara'));
      add('badge', 35, -31, width * 0.3, 34, 3, textValue('badgeText', 'SIN COMPROMISO'));
      add('label', -34, 5, width * 0.82, 24, 4, textValue('visaLabel', 'ACOMPAÑAMIENTO HUMANO'));
      items('features', ['Compara alternativas', 'Decide con calma']).slice(0, 3).forEach((item, index) =>
        add('feature', -34, 19 + index * 12, width * 0.82, 28, 5 + index, item),
      );
      break;
    case 'InsuranceProductHero':
      items('badges', ['Seguro médico para estudiantes', 'Visado garantizado']).slice(0, 3).forEach((item, index) =>
        add('badge', -34 + index * 28, -38, width * 0.25, 30, 1, item),
      );
      add('title', -8, -13, width * 0.88, 145, 2, textValue('title', 'Encuentra una cobertura que cumple con tu visado'));
      add('description', -8, 17, width * 0.84, 70, 3, textValue('description', 'Comparamos alternativas para ayudarte a decidir.'));
      add('primaryAction', -22, 34, width * 0.38, 46, 4, textValue('primaryAction', 'Calcular mi seguro'));
      add('secondaryAction', 22, 34, width * 0.38, 46, 5, textValue('secondaryAction', 'Hablar con un asesor'));
      add('highlights', 0, 44, width * 0.86, 38, 6, items('highlights', ['Certificado en 24 horas', 'Repatriación incluida']).join(' · '));
      break;
    case 'InsuranceCoverageGrid':
      add('eyebrow', 0, -39, width * 0.9, 24, 1, textValue('eyebrow', 'COBERTURAS PRINCIPALES'));
      add('title', 0, -28, width * 0.9, 70, 2, textValue('title', 'Todo lo que incluye tu póliza'));
      objectItems('items', [
        { title: 'Hospitalización completa' },
        { title: 'Asistencia 24 horas' },
        { title: 'Repatriación sanitaria' },
      ]).slice(0, 3).forEach((item, index) =>
        add('item', -31 + index * 31, 19, width * 0.28, height * 0.42, 3, String(item.title ?? 'Cobertura incluida')),
      );
      break;
    case 'InsuranceTestimonialGrid':
      add('eyebrow', 0, -39, width * 0.9, 24, 1, textValue('eyebrow', 'OPINIONES REALES'));
      add('title', 0, -29, width * 0.9, 60, 2, textValue('title', 'La experiencia de quienes ya confían en nosotros'));
      objectItems('items', [
        { comment: 'Un asesoramiento claro, rápido y muy humano.' },
        { comment: 'Encontré la póliza que necesitaba.' },
      ]).slice(0, 2).forEach((item, index) =>
        add('item', -24 + index * 48, 19, width * 0.42, height * 0.45, 3, String(item.comment ?? 'Opinión de cliente')),
      );
      break;
    case 'InsurancePlanComparison':
      add('eyebrow', 0, -40, width * 0.9, 24, 1, textValue('eyebrow', 'MODALIDADES'));
      add('title', 0, -30, width * 0.9, 60, 2, textValue('title', 'Compara tu protección'));
      objectItems('plans', [
        { name: 'Seguro Básico' },
        { name: 'Seguro Completo' },
        { name: 'Seguro Premium' },
      ]).slice(0, 3).forEach((item, index) =>
        add('plan', -31 + index * 31, 17, width * 0.28, height * 0.48, 3, String(item.name ?? 'Plan')),
      );
      break;
    case 'InsuranceProductCard':
      add('badge', 30, -38, width * 0.38, 30, 1, textValue('badge', 'RECOMENDADO'));
      add('icon', -36, -30, 46, 46, 2, '✓');
      add('title', -22, -25, width * 0.7, 54, 3, textValue('title', 'Seguro médico'));
      add('tagline', -22, -9, width * 0.7, 24, 4, textValue('tagline', 'Cobertura completa'));
      add('description', -22, 7, width * 0.7, 54, 5, textValue('description', 'Protección para tu día a día.'));
      add('features', -22, 26, width * 0.7, 45, 6, items('features', ['Hospitalización incluida', 'Asesoramiento humano']).join(' · '));
      add('price', 25, 39, width * 0.4, 38, 7, textValue('price', 'Consultar'));
      break;
    case 'InsuranceTrustBar':
      objectItems('items', [
        { title: 'Homologación oficial' },
        { title: 'Gestión en 24 horas' },
        { title: 'Soporte continuo' },
      ]).slice(0, 3).forEach((item, index) =>
        add('item', -31 + index * 31, 0, width * 0.28, height * 0.7, 1, String(item.title ?? 'Protección verificada')),
      );
      break;
    case 'InsuranceProviderBar':
      add('eyebrow', 0, -23, width * 0.9, 30, 1, textValue('eyebrow', 'ASEGURADORAS OFICIALES HOMOLOGADAS'));
      add('providers', 0, 13, width * 0.9, 70, 2, items('providers', ['Sanitas', 'Adeslas']).join(' · '));
      break;
    case 'InsuranceTransparency':
      add('title', 0, -35, width * 0.86, 50, 1, textValue('title', 'Transparencia de cobertura'));
      add('description', 0, -22, width * 0.86, 32, 2, textValue('description', 'Comprueba lo que cubre cada póliza.'));
      add('inclusions', -25, 15, width * 0.42, height * 0.42, 3, items('inclusions', ['Sin copagos', 'Repatriación incluida']).join(' · '));
      add('exclusions', 25, 15, width * 0.42, height * 0.42, 4, items('exclusions', ['Tratamientos estéticos']).join(' · '));
      break;
    case 'InsuranceFaq':
      add('eyebrow', 0, -39, width * 0.9, 24, 1, textValue('eyebrow', 'PREGUNTAS FRECUENTES'));
      add('title', 0, -29, width * 0.9, 60, 2, textValue('title', 'Resolvemos tus dudas antes de contratar'));
      objectItems('items', [
        { question: '¿El seguro cumple los requisitos de mi visado?' },
        { question: '¿Puedo recibir ayuda antes de decidir?' },
      ]).slice(0, 3).forEach((item, index) =>
        add('faq', 0, 4 + index * 22, width * 0.82, 62, 3 + index, String(item.question ?? '¿Tienes alguna duda?')),
      );
      break;
    case 'InsuranceAdvisorCta':
      add('icon', -40, -28, 42, 42, 1, '♥');
      add('title', -8, -20, width * 0.84, 70, 2, textValue('title', '¿Necesitas ayuda para elegir tu seguro?'));
      add('description', -8, 8, width * 0.82, 64, 3, textValue('description', 'Nuestros asesores te orientan de forma gratuita y sin compromiso.'));
      add('cta', -8, 31, width * 0.48, 48, 4, textValue('ctaText', 'Hablar con un asesor'));
      break;
    default:
      break;
  }
  return base;
};

export function createMarketingBlockGroup(
  blockType: ImageBlockType,
  props: Record<string, unknown>,
  id: string,
  options: MarketingGroupOptions,
): ImageLayer {
  if (!isMarketingBlockType(blockType)) throw new Error(`Unsupported marketing block: ${blockType}`);
  const { width, height } = options;
  const position = options.position ?? { x: 50, y: 50 };
  const children: GroupedLayer[] = marketingPartDefinitions(blockType, props, width, height).map((part, index) => ({
    id: `${id}-${part.part}-${index + 1}`,
    type: 'block',
    blockType: 'MarketingBlockPart',
    title: `${part.part} (${blockType})`,
    props: { parentBlockType: blockType, ...props, ...part },
    position,
    zIndex: part.zIndex,
    scale: 1,
    width: part.width,
    height: part.height,
    relX: part.relX,
    relY: part.relY,
    relativeSpace: 'group-percent',
  }));
  return {
    id,
    type: 'block',
    blockType: 'CustomGroup',
    title: `${blockType} · Grupo editable`,
    props: {
      ...props,
      marketingBlockType: blockType,
      childrenLayers: children,
      initialCentroid: position,
      relativeSpace: 'group-percent',
      baseWidth: width,
      baseHeight: height,
      canvasWidth: options.canvasWidth,
      canvasHeight: options.canvasHeight,
    },
    position,
    zIndex: 1,
    scale: 1,
    width,
    height,
    constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS },
  };
}

export function createCustomGroup(layers: ImageLayer[], id: string): ImageLayer {
  if (layers.length < 2) throw new Error('A group requires at least two layers.');
  const center = {
    x: Math.round((layers.reduce((sum, layer) => sum + layer.position.x, 0) / layers.length) * 10) / 10,
    y: Math.round((layers.reduce((sum, layer) => sum + layer.position.y, 0) / layers.length) * 10) / 10,
  };
  const children: GroupedLayer[] = layers.map((layer) => ({
    ...layer,
    relX: Math.round((layer.position.x - center.x) * 100) / 100,
    relY: Math.round((layer.position.y - center.y) * 100) / 100,
  }));

  return {
    id,
    type: 'block',
    blockType: 'CustomGroup',
    title: `Grupo (${layers.length} elementos)`,
    props: { childrenLayers: children, initialCentroid: center },
    position: center,
    zIndex: Math.max(...layers.map((layer) => layer.zIndex)),
    scale: 1,
    constraints: { ...DEFAULT_LAYER_LAYOUT_CONSTRAINTS },
  };
}

export function expandCustomGroup(group: ImageLayer): ImageLayer[] {
  if (group.blockType !== 'CustomGroup') return [];
  const props = group.props as {
    childrenLayers?: GroupedLayer[];
    initialCentroid?: { x: number; y: number };
    relativeSpace?: 'canvas-percent' | 'group-percent';
    baseWidth?: number;
    baseHeight?: number;
    canvasWidth?: number;
    canvasHeight?: number;
  };
  if (!Array.isArray(props.childrenLayers)) return [];
  const centroid = props.initialCentroid ?? group.position;
  const scale = group.scale ?? 1;
  const rotation = group.rotation ?? 0;
  const radians = (rotation * Math.PI) / 180;
  const groupWidth = group.width ?? props.baseWidth ?? 420;
  const groupHeight = group.height ?? props.baseHeight ?? 280;
  const resizeScale = Math.min(
    groupWidth / (props.baseWidth ?? groupWidth),
    groupHeight / (props.baseHeight ?? groupHeight),
  );
  const canvasWidth = props.canvasWidth ?? 1080;
  const canvasHeight = props.canvasHeight ?? 1080;

  return props.childrenLayers.map((child) => {
    const isGroupRelative = child.relativeSpace === 'group-percent' || props.relativeSpace === 'group-percent';
    const offsetX = isGroupRelative
      ? ((child.relX ?? 0) * groupWidth) / canvasWidth
      : (child.relX ?? child.position.x - centroid.x);
    const offsetY = isGroupRelative
      ? ((child.relY ?? 0) * groupHeight) / canvasHeight
      : (child.relY ?? child.position.y - centroid.y);
    const rotatedX = offsetX * Math.cos(radians) - offsetY * Math.sin(radians);
    const rotatedY = offsetX * Math.sin(radians) + offsetY * Math.cos(radians);
    return {
      ...child,
      position: {
        x: Math.round((group.position.x + rotatedX * scale) * 10) / 10,
        y: Math.round((group.position.y + rotatedY * scale) * 10) / 10,
      },
      scale: Math.round((child.scale ?? 1) * scale * resizeScale * 100) / 100,
      rotation: Math.round(((child.rotation ?? 0) + rotation) % 360),
      zIndex: group.zIndex + (child.zIndex ? child.zIndex / 100 : 0),
    };
  });
}
