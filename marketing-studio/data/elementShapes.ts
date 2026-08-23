import {
  ElementCatalogCategoryId,
  ElementResourceKind,
  TraditionalShapeType,
} from '../types/elementCatalog';

const UNIVERSAL_FILL = '#475569';
const UNIVERSAL_ACCENT = '#F59E0B';
const UNIVERSAL_SOFT = '#CBD5E1';

export interface ShapeCatalogItem {
  id: string;
  name: string;
  shapeType: TraditionalShapeType;
  kind: ElementResourceKind;
  category: ElementCatalogCategoryId;
  tags: string[];
  defaultWidth: number;
  defaultHeight: number;
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
  defaultBorderRadius?: number;
  defaultSides?: number;
  defaultPoints?: number;
  defaultInnerRadius?: number;
}

export interface ShapeCatalogSection {
  id:
    | 'lines'
    | 'connectors'
    | 'basic_shapes'
    | 'polygons'
    | 'stars'
    | 'arrows'
    | 'organic'
    | 'symbols'
    | 'brackets'
    | 'separators'
    | 'frames'
    | 'masks'
    | 'universal_surfaces';
  title: string;
  items: ShapeCatalogItem[];
}

const shape = (
  id: string,
  name: string,
  shapeType: TraditionalShapeType,
  defaultWidth = 200,
  defaultHeight = 200,
  defaultFill = UNIVERSAL_FILL,
  extra: Partial<ShapeCatalogItem> = {},
): ShapeCatalogItem => ({
  id,
  name,
  shapeType,
  kind: 'shape',
  category: 'forms_lines',
  tags: [],
  defaultWidth,
  defaultHeight,
  defaultFill,
  ...extra,
});

const line = (
  id: string,
  name: string,
  shapeType: TraditionalShapeType,
  extra: Partial<ShapeCatalogItem> = {},
) => shape(id, name, shapeType, 400, 40, 'transparent', {
  kind: 'line',
  defaultStroke: '#FFFFFF',
  defaultStrokeWidth: 4,
  ...extra,
});

export const ELEMENT_SHAPE_SECTIONS: ShapeCatalogSection[] = [
  {
    id: 'lines',
    title: 'Líneas',
    items: [
      line('line-solid', 'Línea sólida', 'line', { defaultHeight: 12 }),
      line('line-dashed', 'Línea discontinua', 'line-dashed', { defaultHeight: 12 }),
      line('line-dotted', 'Línea punteada', 'line-dotted', { defaultHeight: 12 }),
      line('line-arrow-right', 'Línea con flecha', 'line-arrow-right', { defaultHeight: 28 }),
      line('line-arrow-both', 'Línea con flecha doble', 'line-arrow-both', { defaultHeight: 28 }),
      line('line-curve', 'Curva Bézier', 'curve', { defaultHeight: 140 }),
      line('line-arc', 'Arco', 'arc', { defaultHeight: 160 }),
    ],
  },
  {
    id: 'connectors',
    title: 'Conectores',
    items: [
      line('connector-elbow', 'Conector en ángulo', 'connector-elbow', { defaultHeight: 160 }),
      line('connector-curved', 'Conector curvo', 'connector-curved', { defaultHeight: 160 }),
    ],
  },
  {
    id: 'basic_shapes',
    title: 'Formas básicas',
    items: [
      shape('shape-square', 'Cuadrado / Rectángulo', 'rectangle'),
      shape('shape-rounded-rect', 'Rectángulo redondeado', 'rounded_rect', 240, 160, UNIVERSAL_FILL, { defaultBorderRadius: 24 }),
      shape('shape-circle', 'Círculo / Elipse', 'circle'),
      shape('shape-triangle-up', 'Triángulo arriba', 'triangle-up'),
      shape('shape-triangle-down', 'Triángulo abajo', 'triangle-down'),
    ],
  },
  {
    id: 'polygons',
    title: 'Polígonos',
    items: [
      shape('shape-pentagon', 'Pentágono', 'pentagon'),
      shape('shape-hexagon', 'Hexágono', 'hexagon'),
      shape('shape-octagon', 'Octágono', 'octagon'),
      shape('shape-diamond', 'Rombo / Diamante', 'diamond'),
      shape('shape-polygon-7', 'Polígono paramétrico', 'polygon-parametric', 200, 200, UNIVERSAL_FILL, {
        defaultSides: 7,
        tags: ['paramétrico', '7 lados'],
      }),
    ],
  },
  {
    id: 'stars',
    title: 'Estrellas',
    items: [
      shape('shape-star-4', 'Estrella de 4 puntas', 'star-4', 200, 200, UNIVERSAL_ACCENT),
      shape('shape-star-5', 'Estrella tradicional', 'star-5', 200, 200, UNIVERSAL_ACCENT),
      shape('shape-star-6', 'Estrella de 6 puntas', 'star-6', 200, 200, UNIVERSAL_ACCENT),
      shape('shape-star-8', 'Estrella de 8 puntas', 'star-8', 200, 200, UNIVERSAL_ACCENT),
      shape('shape-burst-12', 'Sello de 12 puntas', 'burst-12', 200, 200, UNIVERSAL_ACCENT),
      shape('shape-star-parametric', 'Estrella paramétrica', 'star-parametric', 200, 200, UNIVERSAL_ACCENT, {
        defaultPoints: 10,
        defaultInnerRadius: 42,
        tags: ['paramétrica', '10 puntas'],
      }),
    ],
  },
  {
    id: 'arrows',
    title: 'Flechas',
    items: [
      shape('shape-arrow-right', 'Flecha derecha', 'arrow-right', 220, 120),
      shape('shape-arrow-left', 'Flecha izquierda', 'arrow-left', 220, 120),
      shape('shape-arrow-up', 'Flecha arriba', 'arrow-up', 120, 220),
      shape('shape-arrow-down', 'Flecha abajo', 'arrow-down', 120, 220),
      shape('shape-arrow-both', 'Flecha bidireccional', 'arrow-both', 240, 120),
    ],
  },
  {
    id: 'organic',
    title: 'Formas orgánicas',
    items: [
      shape('shape-blob-soft', 'Blob suave', 'blob-1', 240, 210, UNIVERSAL_SOFT),
      shape('shape-blob-fluid', 'Blob fluido', 'blob-2', 240, 210, UNIVERSAL_FILL),
      shape('shape-blob-cloud', 'Blob nube', 'blob-3', 240, 210, UNIVERSAL_ACCENT),
    ],
  },
  {
    id: 'symbols',
    title: 'Símbolos',
    items: [
      shape('shape-speech-bubble', 'Bocadillo de diálogo', 'speech_bubble', 220, 180, UNIVERSAL_FILL, {
        kind: 'symbol',
        category: 'icons_symbols',
      }),
      shape('shape-heart', 'Corazón', 'heart', 200, 200, '#E63946', {
        kind: 'symbol',
        category: 'icons_symbols',
      }),
      shape('shape-shield', 'Escudo', 'shield', 200, 200, UNIVERSAL_ACCENT, {
        kind: 'symbol',
        category: 'icons_symbols',
      }),
    ],
  },
  {
    id: 'brackets',
    title: 'Corchetes',
    items: [
      line('bracket-square-left', 'Corchete izquierdo', 'bracket-square-left', { defaultWidth: 100, defaultHeight: 220 }),
      line('bracket-square-right', 'Corchete derecho', 'bracket-square-right', { defaultWidth: 100, defaultHeight: 220 }),
      line('bracket-square-pair', 'Par de corchetes', 'bracket-square-pair', { defaultWidth: 260, defaultHeight: 220 }),
      line('bracket-curly-pair', 'Par de llaves', 'bracket-curly-pair', { defaultWidth: 260, defaultHeight: 220 }),
    ],
  },
  {
    id: 'separators',
    title: 'Separadores decorativos',
    items: [
      line('separator-wave', 'Separador ondulado', 'separator-wave', { defaultHeight: 50 }),
      line('separator-zigzag', 'Separador zigzag', 'separator-zigzag', { defaultHeight: 50 }),
      line('separator-dots', 'Separador de puntos', 'separator-dots', { defaultHeight: 50 }),
      line('separator-diamond', 'Separador con diamante', 'separator-diamond', { defaultHeight: 50 }),
    ],
  },
  {
    id: 'frames',
    title: 'Marcos',
    items: [
      shape('frame-simple', 'Marco clásico', 'frame-simple', 280, 210, 'transparent', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
      }),
      shape('frame-rounded', 'Marco redondeado', 'frame-rounded', 280, 210, 'transparent', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
        defaultBorderRadius: 24,
      }),
      shape('frame-circle', 'Marco ovalado', 'frame-circle', 240, 240, 'transparent', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
      }),
      shape('frame-corners', 'Esquinas editoriales', 'frame-corners', 280, 210, 'transparent', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
      }),
      shape('frame-polaroid', 'Marco instantáneo', 'frame-polaroid', 240, 280, '#FFFFFF', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
      }),
      shape('frame-film', 'Tira de película', 'frame-film', 320, 190, 'transparent', {
        kind: 'frame',
        category: 'frames_masks',
        defaultStroke: '#FFFFFF',
        defaultStrokeWidth: 8,
      }),
    ],
  },
  {
    id: 'masks',
    title: 'Máscaras',
    items: [
      shape('mask-circle', 'Máscara circular', 'mask-circle', 220, 220, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
      }),
      shape('mask-rounded', 'Máscara redondeada', 'mask-rounded', 260, 200, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
        defaultBorderRadius: 32,
      }),
      shape('mask-hexagon', 'Máscara hexagonal', 'mask-hexagon', 220, 220, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
      }),
      shape('mask-arch', 'Máscara de arco', 'mask-arch', 220, 260, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
      }),
      shape('mask-blob', 'Máscara orgánica', 'mask-blob', 240, 220, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
      }),
      shape('mask-heart', 'Máscara corazón', 'mask-heart', 220, 220, UNIVERSAL_SOFT, {
        kind: 'mask',
        category: 'frames_masks',
      }),
    ],
  },
  {
    id: 'universal_surfaces',
    title: 'Superficies universales',
    items: [
      shape('surface-panel', 'Panel de contenido', 'rounded_rect', 360, 220, '#0F172A', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        defaultBorderRadius: 24,
        tags: ['panel', 'contenedor'],
      }),
      shape('surface-card', 'Tarjeta neutra', 'rounded_rect', 320, 180, '#1E293B', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        defaultBorderRadius: 18,
        tags: ['tarjeta', 'contenedor'],
      }),
      shape('surface-soft', 'Superficie suave', 'rounded_rect', 320, 180, '#334155', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        defaultBorderRadius: 32,
        tags: ['suave', 'contenedor'],
      }),
      shape('surface-circle', 'Fondo circular', 'circle', 240, 240, '#0E7490', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        tags: ['circular', 'fondo'],
      }),
      shape('surface-highlight', 'Franja destacada', 'rounded_rect', 360, 96, '#0F766E', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        defaultBorderRadius: 18,
        tags: ['destacado', 'franja', 'contenedor'],
      }),
      shape('surface-divider', 'Divisor de sección', 'rectangle', 420, 16, '#475569', {
        kind: 'surface',
        category: 'backgrounds_surfaces',
        tags: ['divisor', 'separador'],
      }),
    ],
  },
];
