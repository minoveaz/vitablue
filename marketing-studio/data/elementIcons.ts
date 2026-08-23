import { UniversalIconId } from '../types/elementCatalog';

export interface UniversalIconCatalogItem {
  id: string;
  name: string;
  iconId: UniversalIconId;
  section: 'navigation' | 'communication' | 'people' | 'media' | 'commerce' | 'status';
  tags: string[];
}

const icon = (
  iconId: UniversalIconId,
  name: string,
  section: UniversalIconCatalogItem['section'],
  tags: string[] = [],
): UniversalIconCatalogItem => ({
  id: `icon-${iconId}`,
  name,
  iconId,
  section,
  tags,
});

export const UNIVERSAL_ICON_CATALOG: UniversalIconCatalogItem[] = [
  icon('home', 'Inicio', 'navigation'),
  icon('menu', 'Menú', 'navigation'),
  icon('search', 'Buscar', 'navigation'),
  icon('settings', 'Ajustes', 'navigation'),
  icon('chevron-up', 'Chevron arriba', 'navigation'),
  icon('chevron-down', 'Chevron abajo', 'navigation'),
  icon('chevron-left', 'Chevron izquierda', 'navigation'),
  icon('chevron-right', 'Chevron derecha', 'navigation'),
  icon('arrow-up', 'Flecha arriba', 'navigation'),
  icon('arrow-down', 'Flecha abajo', 'navigation'),
  icon('arrow-left', 'Flecha izquierda', 'navigation'),
  icon('arrow-right', 'Flecha derecha', 'navigation'),
  icon('plus', 'Añadir', 'navigation'),
  icon('minus', 'Quitar', 'navigation'),
  icon('x', 'Cerrar', 'navigation'),
  icon('mail', 'Correo', 'communication'),
  icon('phone', 'Teléfono', 'communication'),
  icon('message', 'Mensaje', 'communication'),
  icon('bell', 'Notificación', 'communication'),
  icon('share', 'Compartir', 'communication'),
  icon('link', 'Enlace', 'communication'),
  icon('wifi', 'Conexión', 'communication'),
  icon('globe', 'Globo', 'communication'),
  icon('map-pin', 'Ubicación', 'communication'),
  icon('user', 'Usuario', 'people'),
  icon('users', 'Usuarios', 'people'),
  icon('heart', 'Favorito', 'people'),
  icon('thumbs-up', 'Me gusta', 'people'),
  icon('briefcase', 'Trabajo', 'people'),
  icon('graduation-cap', 'Educación', 'people'),
  icon('stethoscope', 'Salud', 'people'),
  icon('camera', 'Cámara', 'media'),
  icon('image', 'Imagen', 'media'),
  icon('play', 'Reproducir', 'media'),
  icon('pause', 'Pausa', 'media'),
  icon('file', 'Archivo', 'media'),
  icon('copy', 'Copiar', 'media'),
  icon('edit', 'Editar', 'media'),
  icon('trash', 'Eliminar', 'media'),
  icon('download', 'Descargar', 'media'),
  icon('upload', 'Subir', 'media'),
  icon('eye', 'Ver', 'media'),
  icon('shopping-cart', 'Carrito', 'commerce'),
  icon('credit-card', 'Tarjeta', 'commerce'),
  icon('car', 'Coche', 'commerce'),
  icon('plane', 'Avión', 'commerce'),
  icon('calendar', 'Calendario', 'commerce'),
  icon('clock', 'Reloj', 'commerce'),
  icon('lock', 'Bloqueado', 'status'),
  icon('unlock', 'Desbloqueado', 'status'),
  icon('shield', 'Protección', 'status'),
  icon('check', 'Correcto', 'status'),
  icon('alert', 'Alerta', 'status'),
  icon('info', 'Información', 'status'),
  icon('help', 'Ayuda', 'status'),
  icon('star', 'Estrella', 'status'),
  icon('zap', 'Energía', 'status'),
  icon('activity', 'Actividad', 'status'),
];
