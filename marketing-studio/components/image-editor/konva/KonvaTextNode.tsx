import React, { useRef } from 'react';
import { Text, Group } from 'react-konva';
import Konva from 'konva';
import { ImageLayer } from '../../../types/imageStudio';

interface KonvaTextNodeProps {
  layer: ImageLayer;
  isSelected?: boolean;
  onSelect: () => void;
  onChange?: (patch: Partial<ImageLayer>) => void;
}

export const KonvaTextNode: React.FC<KonvaTextNodeProps> = ({
  layer,
  onSelect,
}) => {
  const textRef = useRef<Konva.Text>(null);

  const textContent = String(layer.props.text ?? layer.title ?? 'Texto');
  const fontSize = layer.fontSize ?? Number(layer.props.fontSize ?? 28);
  const fontFamily = layer.fontFamily ?? 'Poppins, Inter, sans-serif';
  const fill = layer.fill ?? String(layer.props.color ?? '#FFFFFF');
  const align = layer.align ?? (layer.props.align as 'left' | 'center' | 'right' | undefined) ?? 'center';
  const fontStyle = layer.fontWeight ?? (layer.props.fontWeight as string ?? 'bold');
  const letterSpacing = layer.letterSpacing ?? Number(layer.props.letterSpacing ?? 0);
  const lineHeight = layer.lineHeight ?? Number(layer.props.lineHeight ?? 1.2);
  const width = layer.width ?? 380;

  return (
    <Group
      id={layer.id}
      onClick={onSelect}
      onTap={onSelect}
      draggable={!layer.locked}
    >
      <Text
        ref={textRef}
        text={textContent}
        fontSize={fontSize}
        fontFamily={fontFamily}
        fontStyle={fontStyle}
        fill={fill}
        align={align}
        width={width}
        letterSpacing={letterSpacing}
        lineHeight={lineHeight}
        wrap="word"
        shadowColor={layer.shadowColor ?? 'rgba(0,0,0,0.5)'}
        shadowBlur={layer.shadowBlur ?? 10}
        shadowOffsetY={layer.shadowOffsetY ?? 4}
        shadowOpacity={layer.shadowOpacity ?? 0.6}
      />
    </Group>
  );
};
