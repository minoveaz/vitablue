import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';

export type TraditionalShapeType =
  | 'rectangle'
  | 'rounded_rect'
  | 'circle'
  | 'triangle'
  | 'star'
  | 'diamond'
  | 'hexagon'
  | 'line'
  | 'arrow'
  | 'speech_bubble'
  | 'heart';

export interface GeometricShapeBlockProps {
  layer: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

export const GeometricShapeBlock: React.FC<GeometricShapeBlockProps> = ({ layer }) => {
  const blockProps = (layer.props ?? {}) as Record<string, unknown>;
  const shapeType = (blockProps.shapeType as TraditionalShapeType) ?? 'rectangle';
  const fill = (layer.fill as string) || (blockProps.fill as string) || '#005F73';
  const stroke = (layer.borderColor as string) || (blockProps.stroke as string) || 'transparent';
  const strokeWidth = layer.borderWidth ?? (blockProps.strokeWidth as number) ?? 0;
  const borderRadius = layer.borderRadius ?? (blockProps.borderRadius as number) ?? 16;

  switch (shapeType) {
    case 'circle':
      return (
        <div
          className="w-full h-full rounded-full transition-all flex items-center justify-center select-none"
          style={{
            backgroundColor: fill,
            borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
            borderColor: strokeWidth ? stroke : undefined,
            borderStyle: strokeWidth ? 'solid' : undefined,
          }}
        />
      );

    case 'rounded_rect':
      return (
        <div
          className="w-full h-full transition-all flex items-center justify-center select-none"
          style={{
            backgroundColor: fill,
            borderRadius: `${borderRadius}px`,
            borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
            borderColor: strokeWidth ? stroke : undefined,
            borderStyle: strokeWidth ? 'solid' : undefined,
          }}
        />
      );

    case 'rectangle':
      return (
        <div
          className="w-full h-full transition-all flex items-center justify-center select-none"
          style={{
            backgroundColor: fill,
            borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : '0px',
            borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
            borderColor: strokeWidth ? stroke : undefined,
            borderStyle: strokeWidth ? 'solid' : undefined,
          }}
        />
      );

    case 'line':
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <div
            className="w-full transition-all"
            style={{
              height: `${Math.max(2, strokeWidth || 4)}px`,
              backgroundColor: fill,
              borderRadius: '9999px',
            }}
          />
        </div>
      );

    case 'triangle':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="50,5 95,95 5,95"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'star':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="50,5 64,36 98,38 72,61 80,95 50,77 20,95 28,61 2,38 36,36"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'diamond':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="50,5 95,50 50,95 5,50"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'hexagon':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="25,5 75,5 95,50 75,95 25,95 5,50"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'arrow':
      return (
        <svg
          viewBox="0 0 100 60"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <polygon
            points="0,20 60,20 60,5 100,30 60,55 60,40 0,40"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'speech_bubble':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 10 15 C 10 10 15 5 25 5 L 75 5 C 85 5 90 10 90 15 L 90 65 C 90 70 85 75 75 75 L 45 75 L 20 95 L 25 75 L 25 75 C 15 75 10 70 10 65 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'heart':
      return (
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          <path
            d="M 50 88 C 20 65 5 45 5 28 C 5 15 15 5 28 5 C 37 5 45 10 50 18 C 55 10 63 5 72 5 C 85 5 95 15 95 28 C 95 45 80 65 50 88 Z"
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return (
        <div
          className="w-full h-full select-none"
          style={{
            backgroundColor: fill,
            borderRadius: `${borderRadius}px`,
          }}
        />
      );
  }
};
