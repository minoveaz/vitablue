import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';

export type TraditionalShapeType =
  // Líneas
  | 'line'
  | 'line-dashed'
  | 'line-dotted'
  | 'line-arrow-right'
  | 'line-arrow-both'
  // Formas básicas
  | 'rectangle'
  | 'square'
  | 'rounded_rect'
  | 'circle'
  | 'triangle'
  | 'triangle-up'
  | 'triangle-down'
  // Polígonos
  | 'diamond'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  // Estrellas
  | 'star'
  | 'star-4'
  | 'star-5'
  | 'star-6'
  | 'star-8'
  | 'burst-12'
  // Flechas
  | 'arrow'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-both'
  // Símbolos
  | 'speech_bubble'
  | 'heart'
  | 'shield';

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

  const svgStroke = strokeWidth > 0 ? stroke : 'none';
  const svgStrokeWidth = strokeWidth > 0 ? strokeWidth : 0;

  switch (shapeType) {
    // 1. LÍNEAS
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

    case 'line-dashed':
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <div
            className="w-full transition-all"
            style={{
              height: `${Math.max(2, strokeWidth || 4)}px`,
              backgroundImage: `linear-gradient(to right, ${fill} 60%, transparent 40%)`,
              backgroundSize: '16px 100%',
            }}
          />
        </div>
      );

    case 'line-dotted':
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <div
            className="w-full transition-all"
            style={{
              height: `${Math.max(2, strokeWidth || 4)}px`,
              backgroundImage: `radial-gradient(circle, ${fill} 40%, transparent 50%)`,
              backgroundSize: '10px 100%',
            }}
          />
        </div>
      );

    case 'line-arrow-right':
      return (
        <svg viewBox="0 0 100 24" className="w-full h-full select-none" preserveAspectRatio="none">
          <line x1="0" y1="12" x2="84" y2="12" stroke={fill} strokeWidth={Math.max(3, strokeWidth || 4)} strokeLinecap="round" />
          <polygon points="80,3 100,12 80,21" fill={fill} />
        </svg>
      );

    case 'line-arrow-both':
      return (
        <svg viewBox="0 0 100 24" className="w-full h-full select-none" preserveAspectRatio="none">
          <polygon points="20,3 0,12 20,21" fill={fill} />
          <line x1="16" y1="12" x2="84" y2="12" stroke={fill} strokeWidth={Math.max(3, strokeWidth || 4)} />
          <polygon points="80,3 100,12 80,21" fill={fill} />
        </svg>
      );

    // 2. FORMAS BÁSICAS
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

    case 'square':
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

    case 'triangle':
    case 'triangle-up':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 95,95 5,95" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'triangle-down':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,95 95,5 5,5" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    // 3. POLÍGONOS
    case 'diamond':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 95,50 50,95 5,50" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'pentagon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 95,38 78,92 22,92 5,38" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'hexagon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'octagon':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    // 4. ESTRELLAS & BURSTS
    case 'star-4':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'star':
    case 'star-5':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 64,36 98,38 72,61 80,95 50,77 20,95 28,61 2,38 36,36" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'star-6':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 62,30 90,25 75,50 90,75 62,70 50,95 38,70 10,75 25,50 10,25 38,30" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'star-8':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 62,25 85,15 75,38 95,50 75,62 85,85 62,75 50,95 38,75 15,85 25,62 5,50 25,38 15,15 38,25" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'burst-12':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="50,5 58,18 73,12 77,27 92,27 88,42 98,50 88,58 92,73 77,73 73,88 58,82 50,95 42,82 27,88 23,73 8,73 12,58 2,50 12,42 8,27 23,27 27,12 42,18" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    // 5. FLECHAS GRUESAS
    case 'arrow':
    case 'arrow-right':
      return (
        <svg viewBox="0 0 100 70" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="0,22 55,22 55,5 100,35 55,65 55,48 0,48" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-left':
      return (
        <svg viewBox="0 0 100 70" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="100,22 45,22 45,5 0,35 45,65 45,48 100,48" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-up':
      return (
        <svg viewBox="0 0 70 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="22,100 22,45 5,45 35,0 65,45 48,45 48,100" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-down':
      return (
        <svg viewBox="0 0 70 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="22,0 22,55 5,55 35,100 65,55 48,55 48,0" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'arrow-both':
      return (
        <svg viewBox="0 0 100 60" className="w-full h-full select-none block" preserveAspectRatio="none">
          <polygon points="25,10 0,30 25,50 25,38 75,38 75,50 100,30 75,10 75,22 25,22" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    // 6. SÍMBOLOS & DIÁLOGO
    case 'speech_bubble':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <path d="M 10 15 C 10 10 15 5 25 5 L 75 5 C 85 5 90 10 90 15 L 90 65 C 90 70 85 75 75 75 L 45 75 L 20 95 L 25 75 L 25 75 C 15 75 10 70 10 65 Z" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <path d="M 50 88 C 20 65 5 45 5 28 C 5 15 15 5 28 5 C 37 5 45 10 50 18 C 55 10 63 5 72 5 C 85 5 95 15 95 28 C 95 45 80 65 50 88 Z" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case 'shield':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full select-none block" preserveAspectRatio="none">
          <path d="M 50 5 L 90 20 L 90 55 C 90 78 50 95 50 95 C 50 95 10 78 10 55 L 10 20 Z" fill={fill} stroke={svgStroke} strokeWidth={svgStrokeWidth} strokeLinejoin="round" />
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
