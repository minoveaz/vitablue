import type { ReactNode } from 'react';

export type ResourceScope = 'system' | 'organization' | 'user';

export interface CoreResourceItem {
  id: string;
  label: string;
  description?: string;
  preview?: string;
  src?: string;
  kind?: string;
  category?: string;
  scope?: ResourceScope;
  payload?: unknown;
  locked?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  visible?: boolean;
  icon?: ReactNode;
  metadata?: readonly string[];
}

export interface CoreResourceData {
  items?: readonly CoreResourceItem[];
  categories?: readonly { id: string; label: string; count?: number }[];
  tabs?: readonly { id: string; label: string }[];
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export const getCoreResourceData = (value: unknown): CoreResourceData => {
  if (!value || typeof value !== 'object') return {};
  const data = value as CoreResourceData;
  return {
    items: Array.isArray(data.items) ? data.items : undefined,
    categories: Array.isArray(data.categories) ? data.categories : undefined,
    tabs: Array.isArray(data.tabs) ? data.tabs : undefined,
    searchPlaceholder: data.searchPlaceholder,
    emptyTitle: data.emptyTitle,
    emptyDescription: data.emptyDescription,
  };
};

export const defaultTextItems: readonly CoreResourceItem[] = [
  { id: 'text-title', label: 'Título principal', preview: 'Tu mensaje empieza aquí', description: 'H1 · Titular de conversión', kind: 'h1', scope: 'system', payload: 'Tu mensaje empieza aquí' },
  { id: 'text-subtitle', label: 'Subtítulo', preview: 'Aclara el beneficio en una frase', description: 'H2 · Apoyo visual', kind: 'h2', scope: 'organization', payload: 'Aclara el beneficio en una frase' },
  { id: 'text-heading', label: 'Encabezado H3', preview: 'Una idea, fácil de recordar', description: 'H3 · Sección', kind: 'h3', scope: 'organization', payload: 'Una idea, fácil de recordar' },
  { id: 'text-hook', label: 'Hook de conversión', preview: 'Descubre la diferencia hoy', description: 'Hook · Llamada a la acción', kind: 'hook', scope: 'system', payload: 'Descubre la diferencia hoy' },
];

export const defaultElementItems: readonly CoreResourceItem[] = [
  { id: 'element-circle', label: 'Círculo', description: 'Forma geométrica editable', category: 'forms', kind: 'shape', scope: 'system', payload: 'circle' },
  { id: 'element-rounded', label: 'Rectángulo redondeado', description: 'Contenedor para destacar contenido', category: 'forms', kind: 'shape', scope: 'system', payload: 'rounded-rect' },
  { id: 'element-line', label: 'Línea', description: 'Separador y guía visual', category: 'lines', kind: 'shape', scope: 'organization', payload: 'line' },
  { id: 'element-star', label: 'Estrella', description: 'Acento visual para beneficios', category: 'icons', kind: 'shape', scope: 'system', payload: 'star' },
];

export const defaultMediaItems: readonly CoreResourceItem[] = [
  { id: 'media-image', label: 'Imagen', description: 'Añadir una imagen al lienzo', kind: 'image', scope: 'system', payload: 'image' },
  { id: 'media-video', label: 'Vídeo', description: 'Añadir vídeo a la escena', kind: 'video', scope: 'organization', payload: 'video' },
  { id: 'media-audio', label: 'Audio', description: 'Añadir música o voz en off', kind: 'audio', scope: 'organization', payload: 'audio' },
];

export const defaultBackgroundItems: readonly CoreResourceItem[] = [
  { id: 'background-ocean', label: 'Ocean Teal', description: 'Fondo de marca principal', category: 'brand', payload: { variant: 'ocean' } },
  { id: 'background-midnight', label: 'Midnight', description: 'Fondo oscuro de alto contraste', category: 'brand', payload: { variant: 'midnight' } },
  { id: 'background-light', label: 'Blanco editorial', description: 'Superficie clara y limpia', category: 'editorial', payload: { variant: 'white-editorial' } },
];

export const defaultBrandItems: readonly CoreResourceItem[] = [
  { id: 'brand-logo', label: 'Logotipo oficial', description: 'Activo aprobado de identidad', kind: 'logo', scope: 'organization', payload: 'logo' },
  { id: 'brand-colors', label: 'Colores VitaBlue', description: 'Ocean, Midnight, Gold y Mint', kind: 'color', scope: 'organization', payload: 'colors' },
  { id: 'brand-type', label: 'Tipografías oficiales', description: 'Poppins para títulos · Inter para lectura', kind: 'font', scope: 'organization', payload: 'fonts' },
  { id: 'brand-component', label: 'Componente de confianza', description: 'Badge o tarjeta de marca reutilizable', kind: 'component', scope: 'organization', payload: 'component' },
];
