import { ImageLayer } from '../types/imageStudio';

export interface SavedCustomElement {
  id: string;
  title: string;
  category: 'text' | 'card' | 'group' | 'shape';
  layer: ImageLayer;
  createdAt: string;
}

export const SAVED_ELEMENTS_STORAGE_KEY = 'vitablue_saved_custom_elements';

export const INITIAL_SAVED_ELEMENTS: SavedCustomElement[] = [
  {
    id: 'default-advisor-elena',
    title: 'Tarjeta Asesora Elena (WhatsApp Directo)',
    category: 'card',
    createdAt: new Date().toISOString(),
    layer: {
      id: 'saved-advisor-1',
      type: 'block',
      blockType: 'MotionAdvisorCard',
      title: 'Tarjeta de Asesora Elena',
      props: {
        name: 'Elena',
        role: 'Asesora Senior · Visados & Extranjería',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop',
        quote: 'Certificado de seguro médico oficial listo para presentar en el Consulado.',
        badge: 'ASESORA EN DIRECTO',
        whatsappPhone: '+34600000000',
        whatsappMessage: 'Hola Elena, necesito tramitar mi póliza sin copagos para visado.',
        online: true,
      },
      position: { x: 50, y: 50 },
      zIndex: 10,
      scale: 1,
      width: 380,
      height: 390,
    },
  },
  {
    id: 'default-trust-badge',
    title: 'Sello Consular 100% Cumplimiento Extranjería',
    category: 'card',
    createdAt: new Date().toISOString(),
    layer: {
      id: 'saved-trust-1',
      type: 'block',
      blockType: 'MotionTrustBadge',
      title: 'Sello de Garantía Consular',
      props: {
        title: 'CUMPLE REQUISITOS EXTRANJERÍA 2026',
        subtitle: 'Sin copagos · Repatriación ilimitada · Cuadro médico nacional',
        rating: '100% VÁLIDO',
      },
      position: { x: 50, y: 80 },
      zIndex: 12,
      scale: 1,
      width: 440,
    },
  },
  {
    id: 'default-gold-title',
    title: 'Titular Oro CapCut (Sin Copagos)',
    category: 'text',
    createdAt: new Date().toISOString(),
    layer: {
      id: 'saved-text-1',
      type: 'text',
      blockType: 'CustomText',
      title: 'Titular Oro Marcador',
      props: {
        text: 'PÓLIZA DE EXTRANJERÍA SIN COPAGOS',
        tag: 'h2',
      },
      position: { x: 50, y: 30 },
      zIndex: 11,
      scale: 1,
      fontSize: 42,
      fontWeight: '900',
      fontFamily: 'Poppins, sans-serif',
      fill: '#001219',
      align: 'center',
      textEffect: 'box',
      boxColor: '#EE9B00',
      width: 780,
    },
  },
  {
    id: 'default-bullets-consular',
    title: 'Lista de Coberturas Clave Visado',
    category: 'text',
    createdAt: new Date().toISOString(),
    layer: {
      id: 'saved-text-2',
      type: 'text',
      blockType: 'CustomText',
      title: 'Lista de Coberturas Clave',
      props: {
        text: '✅ Sin copagos ni carencias\n✅ Repatriación médica 100% incluida\n✅ Cuadro médico completo en España',
        tag: 'p',
      },
      position: { x: 50, y: 55 },
      zIndex: 13,
      scale: 1,
      fontSize: 26,
      fontWeight: '600',
      fontFamily: 'Inter, sans-serif',
      fill: '#FFFFFF',
      align: 'left',
      lineHeight: 1.6,
      width: 720,
    },
  },
];

let inMemoryCustomElements: SavedCustomElement[] = [...INITIAL_SAVED_ELEMENTS];

export function getSavedCustomElements(): SavedCustomElement[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return inMemoryCustomElements;
  }

  try {
    const raw = localStorage.getItem(SAVED_ELEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_SAVED_ELEMENTS));
      inMemoryCustomElements = [...INITIAL_SAVED_ELEMENTS];
      return INITIAL_SAVED_ELEMENTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      inMemoryCustomElements = parsed;
      return parsed;
    }
    // Si estaba vacío, resembrar con los iniciales
    localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(INITIAL_SAVED_ELEMENTS));
    inMemoryCustomElements = [...INITIAL_SAVED_ELEMENTS];
    return INITIAL_SAVED_ELEMENTS;
  } catch (error) {
    console.error('Error loading saved custom elements from storage:', error);
    return inMemoryCustomElements;
  }
}

export function saveCustomElement(layer: ImageLayer, customTitle?: string): SavedCustomElement {
  const elements = getSavedCustomElements();
  
  let category: SavedCustomElement['category'] = 'card';
  if (layer.type === 'text' || layer.blockType === 'CustomText') {
    category = 'text';
  } else if (layer.blockType === 'CustomGroup') {
    category = 'group';
  } else if (layer.type === 'shape') {
    category = 'shape';
  }

  const newElement: SavedCustomElement = {
    id: `saved-elem-${Date.now()}`,
    title: customTitle?.trim() || layer.title || 'Elemento Personalizado',
    category,
    layer: JSON.parse(JSON.stringify(layer)),
    createdAt: new Date().toISOString(),
  };

  const nextElements = [newElement, ...elements];
  inMemoryCustomElements = nextElements;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(nextElements));
      // Disparar evento personalizado para sincronización reactiva inmediata
      window.dispatchEvent(new Event('vitablue_saved_elements_updated'));
    } catch (error) {
      console.error('Error saving custom element to storage:', error);
    }
  }

  return newElement;
}

export function deleteSavedCustomElement(id: string): void {
  const elements = getSavedCustomElements();
  const filtered = elements.filter((e) => e.id !== id);
  inMemoryCustomElements = filtered;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new Event('vitablue_saved_elements_updated'));
    } catch (error) {
      console.error('Error deleting saved custom element from storage:', error);
    }
  }
}
