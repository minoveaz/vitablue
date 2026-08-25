import React from 'react';
import {
  MotionAdvisorCard,
  MotionTrustBadge,
  MotionProviderGrid,
  MotionComparisonCard,
} from '../../../../packages/video-studio/src/motion-kit';
import { ImageLayer, ImageProject } from '../../../types/imageStudio';
import { getBlockCatalogItem } from '../../../data/blockCatalog';
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
  TrustHighlightPillBlock,
  TrustBadgeTitleBlock,
  TrustBadgeSubtitleBlock,
  TrustVerifiedPillBlock,
} from './TrustBlocks';
import {
  ComparisonHeaderBlock,
  ComparisonWrongBoxBlock,
  ComparisonCorrectBoxBlock,
} from './ComparisonBlocks';
import { GlassCardSurfaceBlock } from './SurfaceBlocks';
import { GeometricShapeBlock } from './ShapeBlocks';
import { WebIllustrationBlock } from './WebIllustrationBlock';
import { BrandLogoBlock } from './BrandLogoBlock';
import { InstagramHighlightBadge } from './HighlightCoverBlocks';
import { InlineEditableText } from '../InlineEditableText';
import { parseFormattedText, TextHighlightRule } from '../../../utils/textFormatter';
import { MarketingBlockRenderer } from './MarketingBlocks';
import { getBlockDefaultWidth } from '../../../utils/blockGeometry';
import { htmlToPlainText, isTiptapHtml } from '../../../utils/tiptapHtml';

const BlockRenderFallback: React.FC<{ title?: string }> = ({ title }) => (
  <div
    className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-slate-600 bg-slate-900/70 px-4 text-center text-xs text-slate-400"
    data-renderer-fallback="block"
    role="img"
    aria-label={`Vista previa no disponible para ${title || 'este recurso'}`}
  >
    Vista previa no disponible
  </div>
);

export interface ImageLayerBlockRendererProps {
  layer: ImageLayer;
  brandTokens?: ImageProject['brandTokens'];
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const ImageLayerBlockRenderer: React.FC<ImageLayerBlockRendererProps> = ({
  layer,
  brandTokens,
  onUpdateLayerProps,
}) => {
  const displayText = (value: unknown, fallback = '') => {
    const text = String(value ?? fallback);
    return isTiptapHtml(text) ? htmlToPlainText(text) : text;
  };
  const blockProps = {
    ...(layer.blockType ? getBlockCatalogItem(layer.blockType)?.defaultProps : {}),
    ...((layer.props ?? {}) as Record<string, unknown>),
  };
  const effectiveBrandTokens = brandTokens
    ? {
        ...brandTokens,
        primaryColor: String(blockProps.primaryColor ?? brandTokens.primaryColor),
        accentColor: String(blockProps.accentColor ?? brandTokens.accentColor),
        mintColor: String(blockProps.accentColor ?? brandTokens.mintColor),
        textColor: String(blockProps.textColor ?? brandTokens.textColor),
        surfaceBg: String(blockProps.surfaceColor ?? brandTokens.surfaceBg),
        cardBg: String(blockProps.surfaceColor ?? brandTokens.cardBg),
      }
    : brandTokens;

  switch (layer.blockType) {
    // 0. GRUPOS PERSONALIZADOS MULTI-CAPA
    case 'CustomGroup': {
      const children = (blockProps.childrenLayers ?? []) as (ImageLayer & { relX?: number; relY?: number })[];
      const initialCentroid = (blockProps.initialCentroid as { x: number; y: number } | undefined);
      const baseWidth = Number(blockProps.baseWidth ?? layer.width ?? 420);
      const baseHeight = Number(blockProps.baseHeight ?? layer.height ?? 280);
      const widthScale = Number(layer.width ?? baseWidth) / baseWidth;
      const heightScale = Number(layer.height ?? baseHeight) / baseHeight;

      return (
        <div className="relative h-full w-full pointer-events-none overflow-visible">
          {children.map((child) => {
            const relX = child.relX !== undefined ? child.relX : (initialCentroid ? child.position.x - initialCentroid.x : 0);
            const relY = child.relY !== undefined ? child.relY : (initialCentroid ? child.position.y - initialCentroid.y : 0);
            const isBackground = (child.props as Record<string, unknown> | undefined)?.part === 'background';
            const childScale = isBackground ? 1 : (child.scale ?? 1) * Math.min(widthScale, heightScale);

            return (
              <div
                key={child.id}
                className="absolute pointer-events-auto"
                style={{
                  left: `calc(50% + ${relX}%)`,
                  top: `calc(50% + ${relY}%)`,
                  transform: `translate(-50%, -50%) rotate(${child.rotation ?? 0}deg) scale(${childScale})`,
                  zIndex: child.zIndex,
                  width: isBackground ? `${layer.width ?? baseWidth}px` : getBlockDefaultWidth(child.blockType, child.width, child.props as Record<string, unknown>),
                  height: isBackground ? `${layer.height ?? baseHeight}px` : (child.height ? `${child.height}px` : 'auto'),
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
          name={displayText(blockProps.name, 'Sofía')}
          role={displayText(blockProps.role, 'Asesora')}
          badge={displayText(blockProps.badge, 'EN DIRECTO')}
          message={displayText(blockProps.message)}
          avatarUrl={blockProps.avatarUrl ? String(blockProps.avatarUrl) : undefined}
          whatsAppText={displayText(blockProps.whatsAppText, 'WhatsApp')}
          tokens={effectiveBrandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionTrustBadge':
      return (
        <MotionTrustBadge
          title={displayText(blockProps.title, 'PÓLIZA 100% VÁLIDA PARA VISADO')}
          subtitle={displayText(blockProps.subtitle, 'Sin Copagos · Cobertura Completa')}
          highlight={displayText(blockProps.highlight, 'GARANTÍA CONSULAR')}
          verifiedLabel={displayText(blockProps.verifiedLabel, 'VERIFICADO')}
          tokens={effectiveBrandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionProviderGrid':
      return (
        <MotionProviderGrid
          title={displayText(blockProps.title, 'Aseguradoras Líderes')}
          subtitle={blockProps.subtitle ? displayText(blockProps.subtitle) : undefined}
          tokens={effectiveBrandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    case 'MotionComparisonCard':
      return (
        <MotionComparisonCard
          title={displayText(blockProps.title)}
          wrongOptionTitle={displayText(blockProps.wrongOptionTitle)}
          wrongOptionDesc={displayText(blockProps.wrongOptionDesc)}
          correctOptionTitle={displayText(blockProps.correctOptionTitle)}
          correctOptionDesc={displayText(blockProps.correctOptionDesc)}
          tokens={effectiveBrandTokens}
          className="!max-w-none !w-full !h-full"
          style={{ maxWidth: 'none', width: '100%', height: '100%' }}
        />
      );

    // 1b. COMPOSICIONES LOCALES BASADAS EN PATRONES DEL STYLEGUIDE
    case 'MarketingBrandHero':
    case 'MarketingBlockPart':
    case 'MarketingSectionIntro':
    case 'MarketingTestimonial':
    case 'MarketingFeatureGrid':
    case 'MarketingPromoCard':
    case 'InsuranceProductHero':
    case 'InsuranceCoverageGrid':
    case 'InsuranceTestimonialGrid':
    case 'InsurancePlanComparison':
    case 'InsuranceProductCard':
    case 'InsuranceTrustBar':
    case 'InsuranceProviderBar':
    case 'InsuranceTransparency':
    case 'InsuranceFaq':
    case 'InsuranceAdvisorCta':
      return <MarketingBlockRenderer blockType={layer.blockType} props={blockProps} layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;

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
    case 'TrustHighlightPill':
      return <TrustHighlightPillBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'TrustBadgeTitle':
      return <TrustBadgeTitleBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'TrustBadgeSubtitle':
      return <TrustBadgeSubtitleBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'TrustVerifiedPill':
      return <TrustVerifiedPillBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 5. SUB-BLOQUES DE COMPARATIVA
    case 'ComparisonHeader':
      return <ComparisonHeaderBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'ComparisonWrongBox':
      return <ComparisonWrongBoxBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;
    case 'ComparisonCorrectBox':
      return <ComparisonCorrectBoxBlock layerId={layer.id} props={blockProps} onUpdateProps={onUpdateLayerProps} />;

    // 6. SUPERFICIES, ILUSTRACIONES Y FORMAS GEOMÉTRICAS
    case 'GlassCardSurface':
      return <GlassCardSurfaceBlock layer={layer} />;
    case 'GeometricShape':
      return <GeometricShapeBlock layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;
    case 'WebIllustration':
      return <WebIllustrationBlock layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;
    case 'BrandLogo':
      return <BrandLogoBlock layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;
    case 'InstagramHighlightBadge':
      return <InstagramHighlightBadge layer={layer} onUpdateLayerProps={onUpdateLayerProps} />;

    // 7. CAPAS DE IMAGEN & FOTOS DE STOCK
    default:
      if (layer.type === 'image' || blockProps.imageUrl) {
        const imageUrl = String(blockProps.imageUrl ?? layer.src ?? '');
        const objectFit = (blockProps.objectFit as 'cover' | 'contain' | 'fill') ?? 'cover';
        const focalPoint = blockProps.focalPoint as { x?: number; y?: number } | undefined;
        const clipShape = layer.clipShape ?? 'rounded-2xl';

        let clipStyle: React.CSSProperties = {};
        if (clipShape === 'circle') {
          clipStyle = { borderRadius: '9999px' };
        } else if (clipShape === 'squircle' || clipShape === 'rounded-2xl') {
          clipStyle = { borderRadius: '24px' };
        } else if (clipShape === 'pill') {
          clipStyle = { borderRadius: '9999px' };
        } else if (clipShape === 'shield') {
          clipStyle = { clipPath: 'polygon(50% 0%, 100% 15%, 100% 65%, 50% 100%, 0% 65%, 0% 15%)' };
        } else if (clipShape === 'hexagon') {
          clipStyle = { clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' };
        }

        return (
          <div
            className="w-full h-full overflow-hidden select-none flex items-center justify-center relative shadow-lg"
            style={{
              ...clipStyle,
              border: layer.borderWidth ? `${layer.borderWidth}px solid ${layer.borderColor || '#005F73'}` : undefined,
              filter: layer.filter ? `${layer.filter}` : undefined,
            }}
          >
            <img
              src={imageUrl}
              alt={String(blockProps.alt ?? layer.title ?? 'Image')}
              className="w-full h-full pointer-events-none"
              style={{
                objectFit,
                objectPosition: `${focalPoint?.x ?? 50}% ${focalPoint?.y ?? 50}%`,
              }}
              loading="lazy"
            />
          </div>
        );
      }

      // 8. CAPAS DE TEXTO PERSONALIZADO (H1, H2, H3, P, BADGES)
      if (layer.type === 'text' || layer.blockType === 'CustomText') {
        const textTag = (blockProps.tag as 'h1' | 'h2' | 'h3' | 'p' | 'span') ?? 'p';
        const isBadge = blockProps.tag === 'badge';
        const rawText = String(blockProps.text ?? layer.title ?? 'Texto');
        const legacyTextPreview = parseFormattedText(
          rawText,
          (blockProps.highlightWords as TextHighlightRule[]) ?? [],
          String(layer.fill ?? blockProps.color ?? '#FFFFFF')
        );

        if (isBadge) {
          const badgeVariant = String(blockProps.badgeVariant ?? 'pill');
          const badgeClasses = {
            pill: 'rounded-full border border-teal-400/40 bg-teal-950/90',
            outline: 'rounded-lg border border-current bg-transparent',
            solid: 'rounded-lg bg-primary',
            ribbon: 'rounded-none border-y-2 border-accent bg-accent/20',
            stamp: 'rounded-full border-2 border-current',
          }[badgeVariant as 'pill' | 'outline' | 'solid' | 'ribbon' | 'stamp'] ?? 'rounded-full border border-teal-400/40 bg-teal-950/90';
          return (
            <div
              className={`inline-flex items-center justify-center gap-1.5 px-4 py-1.5 shadow-lg backdrop-blur-md w-full h-full ${badgeClasses}`}
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

        const hasBoxEffect = layer.textEffect === 'box';
        const hasStrokeEffect = layer.textEffect === 'stroke';
        const hasGlowEffect = layer.textEffect === 'glow';
        const isNoWrap = Boolean(blockProps.nowrap ?? blockProps.singleLine ?? false);
        const baseFontSize = layer.fontSize ?? (blockProps.fontSize as number) ?? 24;
        const textFit = blockProps.textFit as { mode?: 'auto' | 'fixed'; maxLines?: number } | undefined;
        const maxLines = Math.max(1, textFit?.maxLines ?? 3);

        return (
          <div
            className={`w-full h-full flex flex-col justify-center select-text ${
              hasBoxEffect ? 'p-3 rounded-2xl shadow-xl' : ''
            }`}
            style={{
              containerType: 'inline-size',
              fontFamily: layer.fontFamily ?? (blockProps.fontFamily as string) ?? 'Poppins, sans-serif',
              fontSize: `min(${baseFontSize}px, 12cqw)`,
              fontWeight: layer.fontWeight ?? (blockProps.fontWeight as any) ?? '700',
              color: hasStrokeEffect ? 'transparent' : (layer.fill ?? (blockProps.color as string) ?? '#FFFFFF'),
              fontStyle: (layer.fontStyle ?? blockProps.fontStyle) as React.CSSProperties['fontStyle'],
              textDecoration: (blockProps.textDecoration as React.CSSProperties['textDecoration']) ?? undefined,
              backgroundColor: hasBoxEffect ? (layer.boxColor ?? '#EE9B00') : undefined,
              textAlign: layer.align ?? (blockProps.textAlign as any) ?? 'center',
              letterSpacing: layer.letterSpacing ? `${layer.letterSpacing}px` : 'normal',
              lineHeight: layer.lineHeight ?? 1.25,
              overflowWrap: 'anywhere',
              overflow: 'hidden',
              textShadow: hasGlowEffect ? '0 0 20px rgba(148, 210, 189, 0.9), 0 0 40px rgba(0, 95, 115, 0.8)' : undefined,
              WebkitTextStroke: hasStrokeEffect ? `2px ${layer.fill ?? (blockProps.color as string) ?? '#FFFFFF'}` : undefined,
            }}
          >
            <InlineEditableText
              text={rawText}
              onSave={(newVal) => onUpdateLayerProps?.(layer.id, { text: newVal })}
              className={`w-full ${isNoWrap ? 'block whitespace-nowrap' : 'line-clamp-[var(--text-fit-lines)] whitespace-pre-line'}`}
              style={{ '--text-fit-lines': maxLines } as React.CSSProperties}
              as={textTag}
            >
              {isTiptapHtml(rawText) ? undefined : legacyTextPreview}
            </InlineEditableText>
          </div>
        );
      }
      return <BlockRenderFallback title={layer.title} />;
  }
};
