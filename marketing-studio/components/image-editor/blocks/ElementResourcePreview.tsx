import React from 'react';
import { Box, CheckCircle2, FolderHeart, Image as ImageIcon } from 'lucide-react';
import {
  ElementCatalogResource,
} from '../../../types/elementCatalog';
import { isRenderableTraditionalShapeType } from '../../../data/elementPreviewValidation';
import { GeometricShapeGraphic } from './ShapeBlocks';
import {
  WEB_ILLUSTRATION_COMPONENTS,
  WebIllustrationBlock,
} from './WebIllustrationBlock';

const PreviewFallback: React.FC<{ label: string }> = ({ label }) => (
  <div
    className="flex h-16 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-slate-600 text-slate-400"
    data-preview-fallback={label}
    role="img"
    aria-label={`Vista previa no disponible para ${label}`}
  >
    <Box className="size-6" />
    <span className="max-w-full truncate px-1 text-[9px]">{label}</span>
  </div>
);

export const ElementResourcePreview: React.FC<{
  resource: Pick<ElementCatalogResource, 'title' | 'preview'>;
  className?: string;
}> = ({ resource, className = '' }) => {
  const preview = resource.preview;

  if (preview.renderer === 'graphic') {
    if (!isRenderableTraditionalShapeType(preview.shapeType)) {
      return <PreviewFallback label={resource.title} />;
    }
    return (
      <div className={`h-16 w-20 text-brand-cyan ${className}`}>
        <GeometricShapeGraphic
          shapeType={preview.shapeType}
          fill={preview.fill ?? 'currentColor'}
          stroke={preview.stroke ?? 'currentColor'}
          strokeWidth={preview.strokeWidth ?? 0}
          borderRadius={preview.borderRadius}
          sides={preview.sides}
          points={preview.points}
          innerRadius={preview.innerRadius}
        />
      </div>
    );
  }

  if (preview.renderer === 'illustration') {
    const Illustration = WEB_ILLUSTRATION_COMPONENTS[preview.illustrationId];
    if (!Illustration) return <PreviewFallback label={resource.title} />;
    return (
      <div className={`size-20 ${className}`}>
        <WebIllustrationBlock
          layer={{
            id: `preview-${preview.illustrationId}`,
            type: 'block',
            blockType: 'WebIllustration',
            title: resource.title,
            props: { illustrationId: preview.illustrationId },
            position: { x: 50, y: 50 },
            zIndex: 0,
            scale: 1,
          }}
        />
      </div>
    );
  }

  if (preview.renderer === 'label') {
    const badge = preview.variant === 'badge';
    return (
      <span
        className={`flex max-w-full items-center gap-1 truncate px-3 font-bold ${
          badge
            ? 'rounded-full border border-brand-cyan/40 bg-primary/30 py-1.5 text-[10px] text-brand-cyan'
            : 'rounded-lg bg-accent py-2 text-[11px] text-primary-dark'
        } ${className}`}
      >
        {badge && <CheckCircle2 className="size-3 shrink-0" />}
        <span className="truncate">{preview.text}</span>
      </span>
    );
  }

  if (preview.renderer === 'surface') {
    return (
      <div
        className={`h-14 w-full max-w-36 rounded-xl border ${
          preview.variant === 'amber'
            ? 'border-accent/60 bg-accent/15'
            : 'border-brand-cyan/40 bg-primary/30'
        } ${className}`}
      />
    );
  }

  if (preview.renderer === 'saved') {
    return <FolderHeart className={`size-12 text-accent ${className}`} />;
  }

  if (preview.renderer === 'fallback') {
    return <PreviewFallback label={preview.label || resource.title} />;
  }

  return (
    <div className={className}>
      <ImageIcon className="size-12 text-brand-cyan" aria-label="Vista previa genérica" />
    </div>
  );
};
