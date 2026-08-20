import { ImageLayer } from '../types/imageStudio';

export interface SavedCustomElement {
  id: string;
  title: string;
  category: 'text' | 'card' | 'group' | 'shape';
  layer: ImageLayer;
  createdAt: string;
}

export const SAVED_ELEMENTS_STORAGE_KEY = 'vitablue_saved_custom_elements';

let inMemoryCustomElements: SavedCustomElement[] = [
  {
    id: 'default-advisor-elena',
    title: 'Tarjeta Asesora Elena (WhatsApp)',
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
        quote: 'Certificado de seguro médico listo para presentar en el Consulado.',
        badge: 'ASESORA EN DIRECTO',
        whatsappPhone: '+34600000000',
        whatsappMessage: 'Hola Elena, necesito tramitar mi póliza sin copagos.',
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
      position: { x: 50, y: 35 },
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
];

export function getSavedCustomElements(): SavedCustomElement[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return inMemoryCustomElements;
  }

  try {
    const raw = localStorage.getItem(SAVED_ELEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(inMemoryCustomElements));
      return inMemoryCustomElements;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      inMemoryCustomElements = parsed;
      return parsed;
    }
    return inMemoryCustomElements;
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
    } catch (error) {
      console.error('Error deleting saved custom element from storage:', error);
    }
  }
}
