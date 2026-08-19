import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';

export interface SurfaceBlockProps {
  layer: ImageLayer;
}

export const GlassCardSurfaceBlock: React.FC<SurfaceBlockProps> = ({ layer }) => {
  const blockProps = layer.props as Record<string, unknown>;
  return (
    <div
      className="w-full rounded-3xl border border-teal-500/30 bg-[#001219]/90 shadow-2xl backdrop-blur-xl pointer-events-none"
      style={{
        width: '100%',
        height: layer.height ? `${layer.height}px` : `${blockProps.height ?? 380}px`,
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 95, 115, 0.2)',
      }}
    />
  );
};
