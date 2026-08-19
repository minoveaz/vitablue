import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';

export interface SurfaceBlockProps {
  layer: ImageLayer;
}

export const GlassCardSurfaceBlock: React.FC<SurfaceBlockProps> = ({ layer }) => {
  const blockProps = (layer.props ?? {}) as Record<string, unknown>;
  const isAmber = blockProps.variant === 'amber';

  return (
    <div
      className={`w-full h-full rounded-3xl border ${
        isAmber ? 'border-amber-500/40' : 'border-teal-500/30'
      } bg-[#001219]/90 shadow-2xl backdrop-blur-xl pointer-events-none transition-all`}
      style={{
        boxShadow: isAmber
          ? '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(238, 155, 0, 0.15)'
          : '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 95, 115, 0.2)',
      }}
    />
  );
};
