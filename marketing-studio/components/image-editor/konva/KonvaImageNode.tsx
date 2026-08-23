import React, { useEffect, useState } from 'react';
import { Image as KonvaImage, Group } from 'react-konva';
import { ImageLayer } from '../../../types/imageStudio';

interface KonvaImageNodeProps {
  layer: ImageLayer;
  isSelected: boolean;
  onSelect: () => void;
}

export const KonvaImageNode: React.FC<KonvaImageNodeProps> = ({
  layer,
  onSelect,
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const src = layer.src ?? String(layer.props.src ?? layer.props.avatarUrl ?? '');
  const width = layer.width ?? 300;
  const height = layer.height ?? 300;
  const cornerRadius = (layer.cornerRadius ?? Number(layer.props.borderRadius ?? 0)) as number;

  useEffect(() => {
    if (!src) return;
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      setImage(img);
    };
  }, [src]);

  return (
    <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
      {image && (
        <KonvaImage
          image={image}
          width={width}
          height={height}
          cornerRadius={cornerRadius}
          shadowColor={layer.shadowColor ?? 'rgba(0,0,0,0.5)'}
          shadowBlur={layer.shadowBlur ?? 20}
          shadowOffsetY={layer.shadowOffsetY ?? 8}
          opacity={layer.opacity ?? 1}
        />
      )}
    </Group>
  );
};
