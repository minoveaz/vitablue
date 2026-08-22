export type TemplateScope = 'system' | 'organization';

export interface TemplateCatalogItem {
  id: string;
  name: string;
  scope: TemplateScope;
  category: string;
  aspectRatio: string;
}

export const TEMPLATE_SCOPE_OPTIONS = [
  { id: 'system' as const, label: 'Universal' },
  { id: 'organization' as const, label: 'Empresa' },
  { id: 'user' as const, label: 'Míos' },
];

export const TEMPLATE_CATALOG: TemplateCatalogItem[] = [
  { id: 'informative-square', name: 'Post cuadrado informativo', scope: 'system', category: 'Informativo', aspectRatio: '1:1' },
  { id: 'vertical-promo', name: 'Post vertical promocional', scope: 'system', category: 'Promoción', aspectRatio: '4:5' },
  { id: 'announcement-story', name: 'Story de anuncio', scope: 'system', category: 'Stories', aspectRatio: '9:16' },
  { id: 'educational-carousel', name: 'Carrusel educativo', scope: 'system', category: 'Educación', aspectRatio: '1:1' },
  { id: 'video-cover', name: 'Portada de vídeo', scope: 'system', category: 'Vídeo', aspectRatio: '16:9' },
  { id: 'horizontal-banner', name: 'Banner horizontal', scope: 'system', category: 'Banners', aspectRatio: '16:9' },
  { id: 'generic-comparison', name: 'Comparativa', scope: 'system', category: 'Conversión', aspectRatio: '4:5' },
  { id: 'generic-testimonial', name: 'Testimonio', scope: 'system', category: 'Prueba social', aspectRatio: '1:1' },
  { id: 'health-campaign', name: 'Campaña de seguro médico', scope: 'organization', category: 'Seguros', aspectRatio: '4:5' },
  { id: 'travel-campaign', name: 'Campaña de seguro de viaje', scope: 'organization', category: 'Seguros', aspectRatio: '4:5' },
  { id: 'coverage-comparison', name: 'Comparativa de coberturas', scope: 'organization', category: 'Comparación', aspectRatio: '1:1' },
  { id: 'saving-ad', name: 'Anuncio de ahorro', scope: 'organization', category: 'Captación', aspectRatio: '1:1' },
  { id: 'advisor-story', name: 'Story de asesoría', scope: 'organization', category: 'Stories', aspectRatio: '9:16' },
  { id: 'trust-post', name: 'Post de confianza VitaBlue', scope: 'organization', category: 'Confianza', aspectRatio: '1:1' },
  { id: 'providers-carousel', name: 'Carrusel de aseguradoras', scope: 'organization', category: 'Seguros', aspectRatio: '1:1' },
  { id: 'campaign-cover', name: 'Portada de campaña', scope: 'organization', category: 'Campañas', aspectRatio: '16:9' },
];
