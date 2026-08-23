import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';
import Logo from '../../../../components/atoms/Logo';

export interface BrandLogoBlockProps {
  layer: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const BrandLogoBlock: React.FC<BrandLogoBlockProps> = ({ layer }) => {
  const blockProps = (layer.props ?? {}) as Record<string, unknown>;
  const variant = (blockProps.variant as 'default' | 'white' | 'dark' | 'colored-on-dark') ?? 'colored-on-dark';
  const showText = Boolean(blockProps.showText ?? true);
  const showTagline = Boolean(blockProps.showTagline ?? false);
  const orientation = (blockProps.orientation as 'horizontal' | 'vertical') ?? 'horizontal';

  // Calcular tamaño del icono según las dimensiones de la capa
  const layerW = layer.width ?? 240;
  const layerH = layer.height ?? 60;
  const iconSize = showText
    ? Math.max(28, Math.min(Math.round(layerH * 0.8), Math.round(layerW * 0.35)))
    : Math.max(32, Math.min(layerW, layerH));

  return (
    <div className="w-full h-full flex items-center justify-center select-none pointer-events-none">
      <Logo
        variant={variant}
        showText={showText}
        showTagline={showTagline}
        orientation={orientation}
        iconSize={iconSize}
        disableTransition={true}
        className="!cursor-default"
      />
    </div>
  );
};
