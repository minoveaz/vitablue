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

    default:
      return null;
  }
};
