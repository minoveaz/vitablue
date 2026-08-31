import { z } from 'zod';
import {
  CREATIVE_DOCUMENT_SCHEMA_VERSION,
  type CreativeDocument,
  type CreativeLayer,
  type JsonValue,
} from './types';
import type { VectorGeometry } from './vectorGeometry';

const IdentifierSchema = z.string().trim().min(1).max(240);
const FiniteNumberSchema = z.number().finite();
const NormalizedNumberSchema = FiniteNumberSchema.min(0).max(1);
const PositiveNumberSchema = FiniteNumberSchema.positive();
const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    FiniteNumberSchema,
    z.boolean(),
    z.null(),
    z.array(JsonValueSchema),
    z.record(z.string(), JsonValueSchema),
  ]),
);
const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

const containsForbiddenAssetReference = (
  value: unknown,
  path: (string | number)[] = [],
): (string | number)[] | null => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return /^(?:data:|blob:)/i.test(normalized)
      || /(?:^|[/?&])(?:signed|sign)(?:ed)?(?:[/=?&]|$)/i.test(normalized)
      || /[?&](?:token|signature|expires|x-amz-[^=]+)=/i.test(normalized)
      ? path
      : null;
  }
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const result = containsForbiddenAssetReference(item, [...path, index]);
      if (result) return result;
    }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      const result = containsForbiddenAssetReference(item, [...path, key]);
      if (result) return result;
    }
  }
  return null;
};

const BinaryFreeJsonObjectSchema = JsonObjectSchema.superRefine((value, context) => {
  const path = containsForbiddenAssetReference(value);
  if (path) {
    context.addIssue({
      code: 'custom',
      path,
      message: 'Inline data/blob and signed URLs are not allowed in CreativeDocument JSON.',
    });
  }
});

const KeyframeSchema = z.object({
  timeMs: FiniteNumberSchema.nonnegative(),
  value: JsonValueSchema,
  easing: z.string().trim().min(1).optional(),
}).strict();

const TemporalExtensionsSchema = z.record(z.string(), JsonValueSchema).superRefine((value, context) => {
  const keyframes = value.keyframes;
  if (keyframes === undefined) return;
  if (!keyframes || typeof keyframes !== 'object' || Array.isArray(keyframes)) {
    context.addIssue({ code: 'custom', path: ['keyframes'], message: 'Temporal keyframes must be grouped by property.' });
    return;
  }
  Object.entries(keyframes).forEach(([property, frames]) => {
    if (!Array.isArray(frames)) {
      context.addIssue({ code: 'custom', path: ['keyframes', property], message: 'Keyframes must be arrays.' });
      return;
    }
    frames.forEach((frame, index) => {
      const result = KeyframeSchema.safeParse(frame);
      if (!result.success) {
        result.error.issues.forEach((issue) => context.addIssue({
          ...issue,
          path: ['keyframes', property, index, ...issue.path],
        }));
      }
    });
  });
});

const LegacyExtensionsSchema = z
  .object({
    legacy: BinaryFreeJsonObjectSchema.optional(),
    imageStudio: BinaryFreeJsonObjectSchema.optional(),
    videoStudio: BinaryFreeJsonObjectSchema.optional(),
    temporal: TemporalExtensionsSchema.optional(),
  })
  .catchall(JsonValueSchema)
  .superRefine((value, context) => {
    const path = containsForbiddenAssetReference(value);
    if (path) {
      context.addIssue({
        code: 'custom',
        path,
        message: 'Inline data/blob and signed URLs are not allowed in CreativeDocument JSON.',
      });
    }
  });
export { LegacyExtensionsSchema };

export const PointSchema = z
  .object({
    x: NormalizedNumberSchema,
    y: NormalizedNumberSchema,
  })
  .strict();

export const GeometrySchema = z
  .object({
    x: NormalizedNumberSchema,
    y: NormalizedNumberSchema,
    width: NormalizedNumberSchema.positive(),
    height: NormalizedNumberSchema.positive(),
  })
  .strict();

const VectorPointSchema = z.object({
  x: NormalizedNumberSchema,
  y: NormalizedNumberSchema,
}).strict();

const BezierPointSchema = VectorPointSchema.extend({
  inHandle: VectorPointSchema.optional(),
  outHandle: VectorPointSchema.optional(),
}).strict();

const VectorStrokeSchema = z.object({
  width: FiniteNumberSchema.nonnegative().max(1000),
  units: z.enum(['px', 'normalized']),
  lineCap: z.enum(['butt', 'round', 'square']).optional(),
  lineJoin: z.enum(['miter', 'round', 'bevel']).optional(),
  dash: FiniteNumberSchema.nonnegative().array().optional(),
}).strict().superRefine((stroke, context) => {
  if (stroke.units === 'normalized' && stroke.width > 1) {
    context.addIssue({ code: 'too_big', maximum: 1, origin: 'number', inclusive: true, path: ['width'], message: 'Normalized stroke width cannot exceed 1.' });
  }
});

const ArrowTipSchema = z.object({
  style: z.enum(['none', 'triangle', 'open', 'circle', 'bar']),
  size: FiniteNumberSchema.nonnegative().max(1000).optional(),
  sizeUnits: z.enum(['px', 'normalized']).optional(),
}).strict();

const PathCommandSchema = z.discriminatedUnion('command', [
  z.object({ command: z.literal('M'), point: VectorPointSchema }).strict(),
  z.object({ command: z.literal('L'), point: VectorPointSchema }).strict(),
  z.object({
    command: z.literal('C'),
    points: z.tuple([VectorPointSchema, VectorPointSchema, VectorPointSchema]),
  }).strict(),
  z.object({
    command: z.literal('Q'),
    points: z.tuple([VectorPointSchema, VectorPointSchema]),
  }).strict(),
  z.object({
    command: z.literal('A'),
    radii: z.object({ x: NormalizedNumberSchema, y: NormalizedNumberSchema }).strict(),
    rotation: FiniteNumberSchema.min(-360).max(360),
    largeArc: z.boolean(),
    sweep: z.boolean(),
    point: VectorPointSchema,
  }).strict(),
  z.object({ command: z.literal('Z') }).strict(),
]);

export const ShapeGeometrySchema = z.object({
  kind: z.literal('shape'),
  shape: z.enum(['rectangle', 'ellipse', 'polygon', 'star']),
  closed: z.literal(true),
  radius: FiniteNumberSchema.nonnegative().max(1000).optional(),
  radiusUnits: z.enum(['px', 'normalized']).optional(),
  sides: FiniteNumberSchema.int().min(3).max(64).optional(),
  points: FiniteNumberSchema.int().min(3).max(64).optional(),
  innerRadius: FiniteNumberSchema.nonnegative().max(1000).optional(),
  innerRadiusUnits: z.enum(['px', 'normalized']).optional(),
  stroke: VectorStrokeSchema.optional(),
}).strict().superRefine((shape, context) => {
  if (shape.radiusUnits === 'normalized' && shape.radius !== undefined && shape.radius > 1) {
    context.addIssue({ code: 'too_big', maximum: 1, origin: 'number', inclusive: true, path: ['radius'], message: 'Normalized radius cannot exceed 1.' });
  }
  if (shape.innerRadiusUnits === 'normalized' && shape.innerRadius !== undefined && shape.innerRadius > 1) {
    context.addIssue({ code: 'too_big', maximum: 1, origin: 'number', inclusive: true, path: ['innerRadius'], message: 'Normalized inner radius cannot exceed 1.' });
  }
});

export const PathGeometrySchema = z.object({
  kind: z.literal('path'),
  pathKind: z.enum(['line', 'polyline', 'bezier', 'svg', 'blob', 'wave', 'brace']),
  commands: z.array(PathCommandSchema).min(1).max(4096),
  closed: z.boolean(),
  points: z.array(BezierPointSchema).min(2).max(4096).optional(),
  fillRule: z.enum(['nonzero', 'evenodd']).optional(),
  stroke: VectorStrokeSchema.optional(),
}).strict().superRefine((path, context) => {
  const hasClose = path.commands.some((command) => command.command === 'Z');
  if (hasClose !== path.closed) {
    context.addIssue({ code: 'custom', path: ['closed'], message: 'closed must match the presence of a Z command.' });
  }
  if (path.commands[0]?.command !== 'M') {
    context.addIssue({ code: 'custom', path: ['commands', 0], message: 'A path must start with M.' });
  }
});

export const ArrowGeometrySchema = z.object({
  kind: z.literal('arrow'),
  start: VectorPointSchema,
  end: VectorPointSchema,
  head: ArrowTipSchema,
  tail: ArrowTipSchema,
  shaft: PathGeometrySchema,
  stroke: VectorStrokeSchema.optional(),
}).strict().superRefine((arrow, context) => {
  if (arrow.shaft.closed) context.addIssue({ code: 'custom', path: ['shaft', 'closed'], message: 'An arrow shaft must be open.' });
});

const ConnectorAnchorSchema = z.object({
  point: VectorPointSchema,
  nodeId: IdentifierSchema.optional(),
  side: z.enum(['top', 'right', 'bottom', 'left', 'center', 'free']).optional(),
  offset: NormalizedNumberSchema.optional(),
}).strict();

export const ConnectorGeometrySchema = z.object({
  kind: z.literal('connector'),
  route: z.enum(['straight', 'elbow', 'curved']),
  startAnchor: ConnectorAnchorSchema,
  endAnchor: ConnectorAnchorSchema,
  commands: z.array(PathCommandSchema).min(1).max(4096),
  closed: z.literal(false),
  head: ArrowTipSchema.optional(),
  tail: ArrowTipSchema.optional(),
  stroke: VectorStrokeSchema.optional(),
}).strict().superRefine((connector, context) => {
  if (connector.commands.some((command) => command.command === 'Z')) {
    context.addIssue({ code: 'custom', path: ['commands'], message: 'Connectors cannot contain Z.' });
  }
  if (connector.commands[0]?.command !== 'M') {
    context.addIssue({ code: 'custom', path: ['commands', 0], message: 'A connector must start with M.' });
  }
});

export const VectorGeometrySchema: z.ZodType<VectorGeometry> = z.union([
  ShapeGeometrySchema,
  PathGeometrySchema,
  ArrowGeometrySchema,
  ConnectorGeometrySchema,
]);

export const TransformSchema = z
  .object({
    position: PointSchema,
    anchor: PointSchema,
    rotation: FiniteNumberSchema,
    scale: z
      .object({
        x: PositiveNumberSchema,
        y: PositiveNumberSchema,
      })
      .strict(),
  })
  .strict();

export const FillAppearanceSchema = z
  .object({
    color: z.string().trim().min(1),
    opacity: NormalizedNumberSchema.optional(),
  })
  .strict();

export const StrokeAppearanceSchema = z
  .object({
    color: z.string().trim().min(1),
    width: PositiveNumberSchema,
    opacity: NormalizedNumberSchema.optional(),
    lineCap: z.enum(['butt', 'round', 'square']).optional(),
    lineJoin: z.enum(['miter', 'round', 'bevel']).optional(),
    dash: PositiveNumberSchema.array().optional(),
  })
  .strict();

export const TypographyAppearanceSchema = z
  .object({
    fontFamily: z.string().trim().min(1),
    fontSize: PositiveNumberSchema,
    fontWeight: z.number().int().min(1).max(1000).optional(),
    lineHeight: PositiveNumberSchema.optional(),
    letterSpacing: FiniteNumberSchema.optional(),
    color: z.string().trim().min(1).optional(),
    align: z.enum(['left', 'center', 'right', 'justify']).optional(),
    italic: z.boolean().optional(),
    underline: z.boolean().optional(),
  })
  .strict();

export const ShadowAppearanceSchema = z
  .object({
    color: z.string().trim().min(1),
    offsetX: FiniteNumberSchema,
    offsetY: FiniteNumberSchema,
    blur: FiniteNumberSchema.nonnegative(),
    spread: FiniteNumberSchema.optional(),
    opacity: NormalizedNumberSchema.optional(),
  })
  .strict();

export const AppearanceSchema = z
  .object({
    opacity: NormalizedNumberSchema,
    blendMode: z
      .enum([
        'normal',
        'multiply',
        'screen',
        'overlay',
        'darken',
        'lighten',
        'color-dodge',
        'color-burn',
      ])
      .optional(),
    fill: FillAppearanceSchema.optional(),
    stroke: StrokeAppearanceSchema.optional(),
    typography: TypographyAppearanceSchema.optional(),
    shadow: ShadowAppearanceSchema.optional(),
    borderRadius: NormalizedNumberSchema.optional(),
  })
  .strict();

const LogicalStoragePathSchema = z
  .string()
  .trim()
  .min(1)
  .max(1024)
  .refine(
    (path) =>
      !/^(?:data|blob|https?|file|javascript):/i.test(path) &&
      !path.startsWith('//') &&
      !/[?#]/.test(path) &&
      !/(?:^|[/?&])(?:signed|sign)(?:ed)?(?:[/=?&]|$)/i.test(path) &&
      !/[?&](?:token|signature|expires|x-amz-[^=]+)=/i.test(path),
    'storagePath must be a logical Storage path, not an inline, remote, or signed URL.',
  );

export const CreativeAssetRefSchema = z
  .object({
    assetId: IdentifierSchema.refine(
      (assetId) => !/^(?:data|blob|https?|file|javascript):/i.test(assetId),
      'assetId must be a stable identifier, not a URL.',
    ),
    storagePath: LogicalStoragePathSchema,
    alt: z.string().optional(),
    mimeType: z.string().trim().min(1).optional(),
  })
  .strict();

/** Legacy schema name retained while editors migrate to CreativeAssetRef. */
export const AssetRefSchema = CreativeAssetRefSchema;

export const TimingSchema = z
  .object({
    startMs: FiniteNumberSchema.nonnegative(),
    durationMs: FiniteNumberSchema.positive(),
  })
  .strict();

export const CreativeLayerBaseSchema = z
  .object({
    id: IdentifierSchema,
    name: z.string().trim().min(1).max(240).optional(),
    transform: TransformSchema,
    geometry: GeometrySchema,
    appearance: AppearanceSchema.optional(),
    timing: TimingSchema.optional(),
    visible: z.boolean().optional(),
    locked: z.boolean().optional(),
    zIndex: z.number().int().finite().optional(),
    constraints: BinaryFreeJsonObjectSchema.optional(),
    extensions: LegacyExtensionsSchema.optional(),
  })
  .strict();

export const TextLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('text'),
  text: z.string(),
}).strict();

export const ShapeLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('shape'),
  shape: z.enum(['rectangle', 'ellipse', 'line', 'polygon', 'star']),
  vectorGeometry: VectorGeometrySchema.optional(),
}).strict();

export const ImageLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('image'),
  asset: AssetRefSchema,
  crop: GeometrySchema.optional(),
}).strict();

export const VideoLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('video'),
  asset: AssetRefSchema,
  crop: GeometrySchema.optional(),
}).strict();

export const AudioLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('audio'),
  asset: AssetRefSchema,
  volume: NormalizedNumberSchema.optional(),
}).strict();

export const ComponentLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('component'),
  componentId: IdentifierSchema,
  props: BinaryFreeJsonObjectSchema.optional(),
}).strict();

const CreativeLayerSchema: z.ZodType<CreativeLayer> = z.lazy(() =>
  z.discriminatedUnion('type', [
    TextLayerSchema,
    ShapeLayerSchema,
    ImageLayerSchema,
    VideoLayerSchema,
    AudioLayerSchema,
    ComponentLayerSchema,
    GroupLayerSchema,
  ]),
);

export const GroupLayerSchema = CreativeLayerBaseSchema.extend({
  type: z.literal('group'),
  children: z.array(CreativeLayerSchema),
  clipContent: z.boolean().optional(),
}).strict();

export { CreativeLayerSchema };

export const CreativeCanvasSchema = z
  .object({
    id: IdentifierSchema,
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    background: AppearanceSchema.optional(),
    extensions: LegacyExtensionsSchema.optional(),
  })
  .strict();

export const CreativeSceneSchema = z
  .object({
    id: IdentifierSchema,
    name: z.string().trim().min(1).max(240).optional(),
    layers: z.array(CreativeLayerSchema),
    timing: TimingSchema.optional(),
    extensions: LegacyExtensionsSchema.optional(),
  })
  .strict();

const CreativeDocumentBaseSchema = z
  .object({
    schemaVersion: z.literal(CREATIVE_DOCUMENT_SCHEMA_VERSION),
    id: IdentifierSchema,
    name: z.string().trim().min(1).max(240),
    mode: z.enum(['image', 'video', 'mixed']),
    canvas: CreativeCanvasSchema,
    scenes: z.array(CreativeSceneSchema),
    assets: z.array(AssetRefSchema).optional(),
    extensions: LegacyExtensionsSchema.optional(),
  })
  .strict();

const addMissingVideoTimingIssues = (
  document: z.infer<typeof CreativeDocumentBaseSchema>,
  context: z.RefinementCtx,
): void => {
  if (document.mode !== 'video') return;

  document.scenes.forEach((scene, sceneIndex) => {
    if (!scene.timing) {
      context.addIssue({
        code: 'custom',
        path: ['scenes', sceneIndex, 'timing'],
        message: `Video scene "${scene.id}" requires timing.`,
      });
    }

    const visitLayer = (layer: CreativeLayer, path: (string | number)[]): void => {
      if (!layer.timing) {
        context.addIssue({
          code: 'custom',
          path: [...path, 'timing'],
          message: `Video layer "${layer.id}" requires timing.`,
        });
      }
      if (layer.type === 'group') {
        layer.children.forEach((child, childIndex) => visitLayer(child, [...path, 'children', childIndex]));
      }
    };

    scene.layers.forEach((layer, layerIndex) =>
      visitLayer(layer, ['scenes', sceneIndex, 'layers', layerIndex]),
    );
  });
};

const ensureUniqueAssetIds = (
  document: z.infer<typeof CreativeDocumentBaseSchema>,
  context: z.RefinementCtx,
): void => {
  if (!document.assets) return;
  const seen = new Set<string>();
  document.assets.forEach((asset, index) => {
    if (seen.has(asset.assetId)) {
      context.addIssue({
        code: 'custom',
        path: ['assets', index, 'assetId'],
        message: `Duplicate assetId "${asset.assetId}".`,
      });
    }
    seen.add(asset.assetId);
  });
};

export const CreativeDocumentSchema = CreativeDocumentBaseSchema.superRefine(
  (document, context) => {
    const forbiddenPath = containsForbiddenAssetReference(document);
    if (forbiddenPath) {
      context.addIssue({
        code: 'custom',
        path: forbiddenPath,
        message: 'Inline data/blob and signed URLs are not allowed in CreativeDocument.',
      });
    }
    addMissingVideoTimingIssues(document, context);
    ensureUniqueAssetIds(document, context);
  },
);

export type CreativeDocumentValidationIssue = {
  path: (string | number)[];
  code: string;
  message: string;
};

export class CreativeDocumentValidationError extends Error {
  readonly issues: CreativeDocumentValidationIssue[];

  constructor(error: z.ZodError) {
    super(`Invalid CreativeDocument: ${error.issues.map((issue) => issue.message).join('; ')}`);
    this.name = 'CreativeDocumentValidationError';
    this.issues = error.issues.map((issue) => ({
      path: issue.path.filter(
        (segment): segment is string | number =>
          typeof segment === 'string' || typeof segment === 'number',
      ),
      code: issue.code,
      message: issue.message,
    }));
  }
}

export type SafeCreativeDocumentValidation =
  | { success: true; data: CreativeDocument }
  | { success: false; error: CreativeDocumentValidationError; issues: CreativeDocumentValidationIssue[] };

export function safeValidateCreativeDocument(value: unknown): SafeCreativeDocumentValidation {
  const result = CreativeDocumentSchema.safeParse(value);
  if (result.success) return { success: true, data: result.data };
  const error = new CreativeDocumentValidationError(result.error);
  return { success: false, error, issues: error.issues };
}

export function validateCreativeDocument(value: unknown): CreativeDocument {
  const result = safeValidateCreativeDocument(value);
  if (!result.success) throw result.error;
  return result.data;
}

export type CreativeDocumentInput = z.input<typeof CreativeDocumentSchema>;
