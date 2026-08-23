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
      className={`w-full h-full rounded-3xl border transition-all ${
        isAmber
          ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/20 via-[#001219]/90 to-amber-950/40'
          : 'border-teal-400/40 bg-gradient-to-br from-teal-500/20 via-[#001219]/90 to-[#005F73]/40'
      } backdrop-blur-2xl shadow-2xl`}
      style={{
        boxShadow: isAmber
          ? '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(238, 155, 0, 0.25)'
          : '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 95, 115, 0.35)',
      }}
    />
  );
};
