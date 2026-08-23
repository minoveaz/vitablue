import React from 'react';
import { Group, Rect, Text } from 'react-konva';
import { ImageLayer } from '../../../types/imageStudio';

interface KonvaMotionCardNodeProps {
  layer: ImageLayer;
  isSelected: boolean;
  onSelect: () => void;
}

export const KonvaMotionCardNode: React.FC<KonvaMotionCardNodeProps> = ({
  layer,
  onSelect,
}) => {
  const width = layer.width ?? 440;
  const height = layer.height ?? 380;
  const blockProps = layer.props as Record<string, unknown>;

  // 1. Fondo de Cristal (GlassCardSurface)
  if (layer.blockType === 'GlassCardSurface') {
    return (
      <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
        <Rect
          width={width}
          height={height}
          cornerRadius={24}
          fill="#001219"
          stroke="#005F73"
          strokeWidth={1.5}
          shadowColor="rgba(0, 95, 115, 0.35)"
          shadowBlur={30}
          shadowOffsetY={10}
          opacity={0.92}
        />
      </Group>
    );
  }

  // 2. Cabecera de Parrilla de Aseguradoras (ProviderGridHeader)
  if (layer.blockType === 'ProviderGridHeader') {
    return (
      <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
        <Text
          text={String(blockProps.title ?? 'COMPAÑÍAS LÍDERES AUTORIZADAS')}
          fontSize={16}
          fontFamily="Poppins, Inter, sans-serif"
          fontStyle="bold"
          fill="#FFFFFF"
          align="center"
          width={width}
        />
        <Text
          y={26}
          text={String(blockProps.subtitle ?? 'Aceptadas oficialmente por Extranjería y Consulados')}
          fontSize={11}
          fontFamily="Inter, sans-serif"
          fill="#94D2BD"
          align="center"
          width={width}
        />
      </Group>
    );
  }

  // 3. Insignia de Aseguradora (ProviderBadge)
  if (layer.blockType === 'ProviderBadge') {
    const isHighlight = blockProps.color === '#EE9B00' || Boolean(blockProps.highlight);
    return (
      <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
        <Rect
          width={width}
          height={height || 64}
          cornerRadius={14}
          fill={isHighlight ? 'rgba(238, 155, 0, 0.15)' : 'rgba(255, 255, 255, 0.05)'}
          stroke={isHighlight ? '#EE9B00' : 'rgba(255, 255, 255, 0.15)'}
          strokeWidth={1}
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={10}
        />
        <Text
          y={14}
          text={String(blockProps.name ?? 'ASEGURADORA')}
          fontSize={13}
          fontFamily="Poppins, Inter, sans-serif"
          fontStyle="bold"
          fill={isHighlight ? '#EE9B00' : '#FFFFFF'}
          align="center"
          width={width}
        />
        {Boolean(blockProps.badge) && (
          <Text
            y={34}
            text={`✓ ${String(blockProps.badge)}`}
            fontSize={9}
            fontFamily="Inter, sans-serif"
            fontStyle="bold"
            fill={isHighlight ? '#EE9B00' : '#94D2BD'}
            align="center"
            width={width}
          />
        )}
      </Group>
    );
  }

  // 4. Hook Alert Badge
  if (layer.blockType === 'HookAlertBadge') {
    return (
      <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
        <Rect
          width={width}
          height={height || 36}
          cornerRadius={18}
          fill="rgba(0, 95, 115, 0.4)"
          stroke="#94D2BD"
          strokeWidth={1}
        />
        <Text
          y={10}
          text={`● ${String(blockProps.badge ?? 'ASESORA ASIGNADA · EN DIRECTO')}`}
          fontSize={10}
          fontFamily="Poppins, Inter, sans-serif"
          fontStyle="bold"
          fill="#94D2BD"
          align="center"
          width={width}
        />
      </Group>
    );
  }

  // 5. Fallback Tarjeta Vectorial
  return (
    <Group id={layer.id} onClick={onSelect} onTap={onSelect} draggable={!layer.locked}>
      <Rect
        width={width}
        height={height}
        cornerRadius={20}
        fill="#001219"
        stroke="#005F73"
        strokeWidth={1}
        shadowColor="rgba(0,0,0,0.6)"
        shadowBlur={20}
      />
      <Text
        y={20}
        text={layer.title}
        fontSize={14}
        fontFamily="Poppins, Inter, sans-serif"
        fontStyle="bold"
        fill="#FFFFFF"
        align="center"
        width={width}
      />
    </Group>
  );
};
