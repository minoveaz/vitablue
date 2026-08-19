import React from 'react';
import { Rect, Circle, Group } from 'react-konva';
import { ImageLayer } from '../../../types/imageStudio';

interface KonvaShapeNodeProps {
  layer: ImageLayer;
  isSelected: boolean;
  onSelect: () => void;
}

export const KonvaShapeNode: React.FC<KonvaShapeNodeProps> = ({
  layer,
  onSelect,
}) => {
  const width = layer.width ?? 300;
  const height = layer.height ?? 100;
  const cornerRadius = layer.cornerRadius ?? Number(layer.props.borderRadius ?? 16);
  const fill = layer.fill ?? String(layer.props.fill ?? '#005F73');
  const stroke = layer.stroke ?? String(layer.props.stroke ?? '#94D2BD');
  const strokeWidth = layer.strokeWidth ?? Number(layer.props.strokeWidth ?? 0);

  const shapeType = String(layer.props.shapeType ?? 'rect');

  if (shapeType === 'circle') {
    const radius = Math.min(width, height) / 2;
    return (
      <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
        <Circle
          radius={radius}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          shadowColor={layer.shadowColor ?? 'rgba(0,0,0,0.4)'}
          shadowBlur={layer.shadowBlur ?? 15}
          shadowOffsetY={layer.shadowOffsetY ?? 6}
          opacity={layer.opacity ?? 1}
        />
      </Group>
    );
  }

  return (
    <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
      <Rect
        width={width}
        height={height}
        cornerRadius={cornerRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        shadowColor={layer.shadowColor ?? 'rgba(0,0,0,0.4)'}
        shadowBlur={layer.shadowBlur ?? 15}
        shadowOffsetY={layer.shadowOffsetY ?? 6}
        opacity={layer.opacity ?? 1}
      />
    </Group>
  );
};
