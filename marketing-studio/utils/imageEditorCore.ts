import { ImageLayer, ImageLayerContent, ImageLayerGeometry, ImageLayerStyle } from '../types/imageStudio';

export type ImageLayerModel = ImageLayerContent & ImageLayerGeometry & ImageLayerStyle & {
  id: ImageLayer['id'];
  zIndex: ImageLayer['zIndex'];
  props: ImageLayer['props'];
};

export const toImageLayerModel = (layer: ImageLayer): ImageLayerModel => layer;

export interface GroupedLayer extends ImageLayer {
  relX: number;
  relY: number;
}

export function createCustomGroup(layers: ImageLayer[], id: string): ImageLayer {
  if (layers.length < 2) throw new Error('A group requires at least two layers.');
  const center = {
    x: Math.round((layers.reduce((sum, layer) => sum + layer.position.x, 0) / layers.length) * 10) / 10,
    y: Math.round((layers.reduce((sum, layer) => sum + layer.position.y, 0) / layers.length) * 10) / 10,
  };
  const children: GroupedLayer[] = layers.map((layer) => ({
    ...layer,
    relX: Math.round((layer.position.x - center.x) * 100) / 100,
    relY: Math.round((layer.position.y - center.y) * 100) / 100,
  }));

  return {
    id,
    type: 'block',
    blockType: 'CustomGroup',
    title: `Grupo (${layers.length} elementos)`,
    props: { childrenLayers: children, initialCentroid: center },
    position: center,
    zIndex: Math.max(...layers.map((layer) => layer.zIndex)),
    scale: 1,
  };
}

export function expandCustomGroup(group: ImageLayer): ImageLayer[] {
  if (group.blockType !== 'CustomGroup') return [];
  const props = group.props as { childrenLayers?: GroupedLayer[]; initialCentroid?: { x: number; y: number } };
  if (!Array.isArray(props.childrenLayers)) return [];
  const centroid = props.initialCentroid ?? group.position;
  const scale = group.scale ?? 1;
  const rotation = group.rotation ?? 0;
  const radians = (rotation * Math.PI) / 180;

  return props.childrenLayers.map((child) => {
    const offsetX = child.relX ?? child.position.x - centroid.x;
    const offsetY = child.relY ?? child.position.y - centroid.y;
    const rotatedX = offsetX * Math.cos(radians) - offsetY * Math.sin(radians);
    const rotatedY = offsetX * Math.sin(radians) + offsetY * Math.cos(radians);
    return {
      ...child,
      position: {
        x: Math.round((group.position.x + rotatedX * scale) * 10) / 10,
        y: Math.round((group.position.y + rotatedY * scale) * 10) / 10,
      },
      scale: Math.round((child.scale ?? 1) * scale * 100) / 100,
      rotation: Math.round(((child.rotation ?? 0) + rotation) % 360),
      zIndex: group.zIndex + (child.zIndex ? child.zIndex / 100 : 0),
    };
  });
}
