import type { CarouselLayout } from '../types/imageStudio';

export const CAROUSEL_LAYOUT_CATALOG: CarouselLayout[] = [
  {
    id: 'educational-flow',
    name: 'Flujo educativo',
    description: 'Narrativa progresiva para explicar un tema y cerrar con una accion.',
    category: 'educational',
    minSlides: 3,
    maxSlides: 10,
    recommendedSlides: [5, 7],
    supportedPlatforms: ['instagram', 'tiktok', 'linkedin', 'facebook', 'twitter'],
    slides: [
      {
        id: 'hook',
        role: 'hook',
        label: 'Portada / Hook',
        slots: [
          { id: 'hook-title', type: 'title', required: true, maxLines: 3 },
          { id: 'hook-eyebrow', type: 'eyebrow', maxLines: 1 },
          { id: 'hook-media', type: 'media', continuity: 'start' },
        ],
      },
      {
        id: 'content',
        role: 'content',
        label: 'Contenido',
        slots: [
          { id: 'content-title', type: 'title', required: true, maxLines: 2 },
          { id: 'content-body', type: 'body', maxLines: 6 },
          { id: 'content-media', type: 'media', continuity: 'middle' },
        ],
      },
      {
        id: 'proof',
        role: 'proof',
        label: 'Prueba o beneficio',
        slots: [
          { id: 'proof-title', type: 'title', required: true, maxLines: 2 },
          { id: 'proof-metric', type: 'metric' },
          { id: 'proof-media', type: 'media', continuity: 'middle' },
        ],
      },
      {
        id: 'cta',
        role: 'cta',
        label: 'Cierre / CTA',
        slots: [
          { id: 'cta-title', type: 'title', required: true, maxLines: 2 },
          { id: 'cta-body', type: 'body', maxLines: 4 },
          { id: 'cta-action', type: 'cta', required: true },
          { id: 'cta-media', type: 'media', continuity: 'end' },
        ],
      },
    ],
  },
];

export const getCarouselLayout = (layoutId: string): CarouselLayout | undefined =>
  CAROUSEL_LAYOUT_CATALOG.find((layout) => layout.id === layoutId);
