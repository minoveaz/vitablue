import React from 'react';
import {
  MotionAdvisorCard,
  MotionTrustBadge,
  MotionProviderGrid,
  MotionComparisonCard,
} from '../../../../packages/video-studio/src/motion-kit';
import { ImageLayer, ImageProject } from '../../../types/imageStudio';
import {
  HookAlertBadgeBlock,
  AdvisorAvatarBadgeBlock,
  AdvisorQuoteBoxBlock,
  WhatsAppCtaButtonBlock,
} from './AdvisorBlocks';
import {
  ProviderGridHeaderBlock,
  ProviderBadgeBlock,
} from './ProviderBlocks';
import {
  TrustShieldIconBlock,
  TrustBadgeTitleBlock,
  TrustBadgeSubtitleBlock,
} from './TrustBlocks';
import {
  ComparisonHeaderBlock,
  ComparisonWrongBoxBlock,
  ComparisonCorrectBoxBlock,
} from './ComparisonBlocks';
import { GlassCardSurfaceBlock } from './SurfaceBlocks';
import { InlineEditableText } from '../InlineEditableText';

export interface ImageLayerBlockRendererProps {
  layer: ImageLayer;
  brandTokens?: ImageProject['brandTokens'];
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const getBlockDefaultWidth = (blockType?: string, customWidth?: number, blockProps?: Record<string, unknown>): string => {
  if (customWidth) return `${customWidth}px`;
  switch (blockType) {
    case 'MotionAdvisorCard':
      return '380px';
    case 'GlassCardSurface':
      return blockProps?.width ? `${blockProps.width}px` : '440px';
    case 'MotionTrustBadge':
      return '420px';
    case 'MotionComparisonCard':
    case 'MotionProviderGrid':
      return '440px';
    case 'HookAlertBadge':
      return 'auto';
    case 'AdvisorAvatarBadge':
      return '340px';
    case 'AdvisorQuoteBox':
      return '340px';
    case 'WhatsAppCtaButton':
      return '340px';
    case 'ProviderGridHeader':
      return '380px';
    case 'ProviderBadge':
      return '185px';
    case 'TrustShieldIcon':
      return 'auto';
    case 'TrustBadgeTitle':
      return '380px';
    case 'TrustBadgeSubtitle':
      return '380px';
    case 'ComparisonHeader':
      return '380px';
    case 'ComparisonWrongBox':
    case 'ComparisonCorrectBox':
      return '380px';
    case 'CustomText':
      return blockProps?.tag === 'badge' ? 'auto' : '420px';
    default:
      return '420px';
  }
};

export const ImageLayerBlockRenderer: React.FC<ImageLayerBlockRendererProps> = ({
  layer,
  brandTokens,
  onUpdateLayerProps,
}) => {
  const blockProps = (layer.props ?? {}) as Record<string, unknown>;

  switch (layer.blockType) {
    // 0. GRUPOS PERSONALIZADOS MULTI-CAPA
    case 'CustomGroup': {
      const children = (blockProps.childrenLayers ?? []) as (ImageLayer & { relX?: number; relY?: number })[];
      const initialCentroid = (blockProps.initialCentroid as { x: number; y: number } | undefined);

      return (
        <div className="relative w-full h-full pointer-events-none">
          {children.map((child) => {
            const relX = child.relX !== undefined ? child.relX : (initialCentroid ? child.position.x - initialCentroid.x : 0);
            const relY = child.relY !== undefined ? child.relY : (initialCentroid ? child.position.y - initialCentroid.y : 0);

            return (
              <div
                key={child.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `calc(50% + ${relX}%)`,
                  top: `calc(50% + ${relY}%)`,
                  transform: `translate(-50%, -50%) rotate(${child.rotation ?? 0}deg) scale(${child.scale ?? 1})`,
                  zIndex: child.zIndex,
                  width: getBlockDefaultWidth(child.blockType, child.width, child.props as Record<string, unknown>),
                  height: child.height ? `${child.height}px` : 'auto',
                }}
              >
                <ImageLayerBlockRenderer
                  layer={child}
                  brandTokens={brandTokens}
                  onUpdateLayerProps={onUpdateLayerProps}
                />
              </div>
            );
          })}
        </div>
      );
    }

    // 1. COMPONENTES MAESTROS MOTION KIT (AGRUPADOS)
    case 'MotionAdvisorCard':
      return (
        <MotionAdvisorCard
          name={String(blockProps.name ?? 'Sofía')}
          role={String(blockProps.role ?? 'Asesora')}
          badge={String(blockProps.badge ?? 'EN DIRECTO')}
          message={String(blockProps.message ?? '')}
          avatarUrl={blockProps.avatarUrl ? String(blockProps.avatarUrl) : undefined}
          whatsAppText={String(blockProps.whatsAppText ?? 'WhatsApp')}
          tokens={brandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionTrustBadge':
      return (
        <MotionTrustBadge
          title={String(blockProps.title ?? 'PÓLIZA 100% VÁLIDA PARA VISADO')}
          subtitle={String(blockProps.subtitle ?? 'Sin Copagos · Cobertura Completa')}
          highlight={String(blockProps.highlight ?? 'GARANTÍA CONSULAR')}
          verifiedLabel={String(blockProps.verifiedLabel ?? 'VERIFICADO')}
          tokens={brandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionProviderGrid':
      return (
        <MotionProviderGrid
          title={String(blockProps.title ?? 'Aseguradoras Líderes')}
          subtitle={blockProps.subtitle ? String(blockProps.subtitle) : undefined}
          tokens={brandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionComparisonCard':
      return (
        <MotionComparisonCard
          title={String(blockProps.title ?? '')}
          wrongOptionTitle={String(blockProps.wrongOptionTitle ?? '')}
          wrongOptionDesc={String(blockProps.wrongOptionDesc ?? '')}
          correctOptionTitle={String(blockProps.correctOptionTitle ?? '')}
          correctOptionDesc={String(blockProps.correctOptionDesc ?? '')}
          tokens={brandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    // 2. SUB-BLOQUES DE ASESORA
    case 'HookAlertBadge':
      return <HookAlertBadgeBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'AdvisorAvatarBadge':
      return <AdvisorAvatarBadgeBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'AdvisorQuoteBox':
      return <AdvisorQuoteBoxBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'WhatsAppCtaButton':
      return <WhatsAppCtaButtonBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 3. SUB-BLOQUES DE ASEGURADORAS
    case 'ProviderGridHeader':
      return <ProviderGridHeaderBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'ProviderBadge':
      return <ProviderBadgeBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 4. SUB-BLOQUES DE GARANTÍA
    case 'TrustShieldIcon':
      return <TrustShieldIconBlock />;
    case 'TrustBadgeTitle':
      return <TrustBadgeTitleBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'TrustBadgeSubtitle':
      return <TrustBadgeSubtitleBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 5. SUB-BLOQUES DE COMPARATIVA
    case 'ComparisonHeader':
      return <ComparisonHeaderBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'ComparisonWrongBox':
      return <ComparisonWrongBoxBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'ComparisonCorrectBox':
      return <ComparisonCorrectBoxBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 6. SUPERFICIES Y FONDOS
    case 'GlassCardSurface':
      return <GlassCardSurfaceBlock layer={layer} />;

    // 7. CAPAS DE TEXTO PERSONALIZADO (H1, H2, H3, P, BADGES)
    case 'CustomText':
    default:
      if (layer.type === 'text' || layer.blockType === 'CustomText') {
        const textTag = (blockProps.tag as 'h1' | 'h2' | 'h3' | 'p' | 'span') ?? 'p';
        const isBadge = blockProps.tag === 'badge';

        if (isBadge) {
          return (
            <div
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-950/90 px-4 py-1.5 shadow-lg backdrop-blur-md w-full h-full"
              style={{
                fontFamily: layer.fontFamily ?? 'Poppins, sans-serif',
                fontSize: layer.fontSize ? `${layer.fontSize}px` : '13px',
                fontWeight: layer.fontWeight ?? '800',
                color: layer.fill ?? '#94D2BD',
                textAlign: layer.align ?? 'center',
                letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : '0.5px',
              }}
            >
              <InlineEditableText
                text={String(blockProps.text ?? layer.title ?? 'Badge')}
                onSave={(newVal) => onUpdateLayerProps?.(layer.id, { text: newVal })}
                as="span"
              />
            </div>
          );
        }

        return (
          <div
            className="w-full h-full flex flex-col justify-center select-none"
            style={{
              fontFamily: layer.fontFamily ?? 'Poppins, sans-serif',
              fontSize: layer.fontSize ? `${layer.fontSize}px` : '24px',
              fontWeight: layer.fontWeight ?? '700',
              color: layer.fill ?? '#FFFFFF',
              textAlign: layer.align ?? 'center',
              letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : 'normal',
              lineHeight: layer.lineHeight ?? 1.25,
            }}
          >
            <InlineEditableText
              text={String(blockProps.text ?? layer.title ?? 'Texto')}
              onSave={(newVal) => onUpdateLayerProps?.(layer.id, { text: newVal })}
              className="w-full block"
              as={textTag}
            />
          </div>
        );
      }
      return null;
  }
};
