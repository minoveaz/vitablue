import {
  Component,
  Image,
  Layers,
  LayoutTemplate,
  Palette,
  Shapes,
  Type,
  Video,
  Grid3X3,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CreativeResourceBlockId, CreativeResourceDomain } from '../contracts/creativeResource';
import { CREATIVE_RESOURCE_AVAILABILITY } from './creativeResourceAvailability';

export interface CreativeResourceMetadata {
  readonly id: CreativeResourceBlockId;
  readonly label: string;
  readonly order: number;
  readonly icon: LucideIcon;
  readonly availableDomains: readonly CreativeResourceDomain[];
  readonly permissions: readonly string[];
  readonly description: string;
}

export const CREATIVE_RESOURCE_CATALOG: readonly CreativeResourceMetadata[] = [
  { id: 'text', label: 'Texto', order: 10, icon: Type, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.text, permissions: ['insert'], description: 'Tipografías y presets de texto' },
  { id: 'elements', label: 'Elementos', order: 20, icon: Shapes, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.elements, permissions: ['insert'], description: 'Formas y elementos reutilizables' },
  { id: 'media', label: 'Medios', order: 30, icon: Image, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.media, permissions: ['insert', 'remove'], description: 'Imágenes, vídeo y audio' },
  { id: 'layers', label: 'Capas', order: 40, icon: Layers, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.layers, permissions: ['select', 'update', 'remove'], description: 'Orden, visibilidad y bloqueo' },
  { id: 'backgrounds', label: 'Fondos', order: 50, icon: Waves, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.backgrounds, permissions: ['insert', 'update'], description: 'Color, degradados e imágenes' },
  { id: 'layout', label: 'Diseño', order: 60, icon: Grid3X3, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.layout, permissions: ['update'], description: 'Alineación, guías y composición' },
  { id: 'brand', label: 'Kit de Marca', order: 70, icon: Palette, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.brand, permissions: ['insert'], description: 'Activos de marca aprobados' },
  { id: 'blocks', label: 'Bloques', order: 80, icon: Component, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.blocks, permissions: ['insert'], description: 'Bloques visuales reutilizables' },
  { id: 'templates', label: 'Plantillas', order: 90, icon: LayoutTemplate, availableDomains: CREATIVE_RESOURCE_AVAILABILITY.templates, permissions: ['insert'], description: 'Composiciones listas para usar' },
  { id: 'prepare-video', label: 'Preparar para Video', order: 100, icon: Video, availableDomains: CREATIVE_RESOURCE_AVAILABILITY['prepare-video'], permissions: ['insert'], description: 'Entrega al flujo de vídeo' },
];
