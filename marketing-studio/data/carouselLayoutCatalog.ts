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
  {
    id: 'conversion-ladder',
    name: 'Escalera de conversión',
    description: 'Presenta una promesa, sus beneficios y un cierre accionable.',
    category: 'conversion',
    minSlides: 3,
    maxSlides: 10,
    recommendedSlides: [3, 5],
    supportedPlatforms: ['instagram', 'tiktok', 'linkedin', 'facebook', 'twitter'],
    slides: [
      {
        id: 'conversion-hook',
        role: 'hook',
        label: 'Promesa principal',
        slots: [
          { id: 'conversion-title', type: 'title', required: true, maxLines: 3 },
          { id: 'conversion-eyebrow', type: 'eyebrow', maxLines: 1 },
          { id: 'conversion-media', type: 'media', continuity: 'start' },
        ],
      },
      {
        id: 'conversion-benefit',
        role: 'content',
        label: 'Beneficio',
        slots: [
          { id: 'benefit-title', type: 'title', required: true, maxLines: 2 },
          { id: 'benefit-body', type: 'body', maxLines: 5 },
          { id: 'benefit-badge', type: 'badge', maxLines: 1 },
        ],
      },
      {
        id: 'conversion-proof',
        role: 'proof',
        label: 'Prueba social',
        slots: [
          { id: 'proof-title', type: 'title', required: true, maxLines: 2 },
          { id: 'proof-metric', type: 'metric' },
          { id: 'proof-media', type: 'media', continuity: 'middle' },
        ],
      },
      {
        id: 'conversion-close',
        role: 'cta',
        label: 'Llamada a la acción',
        slots: [
          { id: 'close-title', type: 'title', required: true, maxLines: 2 },
          { id: 'close-body', type: 'body', maxLines: 4 },
          { id: 'close-cta', type: 'cta', required: true },
        ],
      },
    ],
  },
  {
    id: 'educational-five-step',
    name: 'Guía educativa en 5 pasos',
    description: 'Secuencia editorial de cinco slides para enseñar, demostrar y convertir.',
    category: 'educational',
    minSlides: 5,
    maxSlides: 5,
    recommendedSlides: [5],
    supportedPlatforms: ['instagram', 'tiktok', 'linkedin', 'facebook', 'twitter'],
    slides: [
      {
        id: 'five-step-hook',
        role: 'hook',
        label: 'Portada / Hook',
        slots: [
          { id: 'five-step-hook-eyebrow', type: 'eyebrow', maxLines: 1 },
          { id: 'five-step-hook-title', type: 'title', required: true, maxLines: 3 },
          { id: 'five-step-hook-body', type: 'body', maxLines: 3 },
        ],
      },
      {
        id: 'five-step-context',
        role: 'content',
        label: 'Contexto',
        slots: [
          { id: 'five-step-context-title', type: 'title', required: true, maxLines: 2 },
          { id: 'five-step-context-body', type: 'body', maxLines: 5 },
          { id: 'five-step-context-media', type: 'media', continuity: 'middle' },
        ],
      },
      {
        id: 'five-step-comparison',
        role: 'comparison',
        label: 'Comparativa',
        slots: [
          { id: 'five-step-comparison-title', type: 'title', required: true, maxLines: 2 },
          { id: 'five-step-comparison-body', type: 'body', maxLines: 4 },
        ],
      },
      {
        id: 'five-step-proof',
        role: 'proof',
        label: 'Prueba / Beneficio',
        slots: [
          { id: 'five-step-proof-title', type: 'title', required: true, maxLines: 2 },
          { id: 'five-step-proof-metric', type: 'metric' },
          { id: 'five-step-proof-body', type: 'body', maxLines: 3 },
        ],
      },
      {
        id: 'five-step-cta',
        role: 'cta',
        label: 'Cierre / CTA',
        slots: [
          { id: 'five-step-cta-title', type: 'title', required: true, maxLines: 2 },
          { id: 'five-step-cta-body', type: 'body', maxLines: 3 },
          { id: 'five-step-cta-action', type: 'cta', required: true },
        ],
      },
    ],
  },
];

export const getCarouselLayout = (layoutId: string): CarouselLayout | undefined =>
  CAROUSEL_LAYOUT_CATALOG.find((layout) => layout.id === layoutId);
