import { ImageLayer } from '../types/imageStudio';
import { ElementCatalogMetadata } from '../types/elementCatalog';
import { normalizeEditableVectorGeometry, normalizeGeometricShapeProps } from './vectorGeometry';

export interface SavedCustomElement {
  id: string;
  title: string;
  category: 'text' | 'card' | 'group' | 'shape';
  layer: ImageLayer;
  createdAt: string;
  /** Optional to keep elements saved before the catalog migration readable. */
  catalogMetadata?: Partial<ElementCatalogMetadata>;
}

export const SAVED_ELEMENTS_STORAGE_KEY = 'vitablue_saved_custom_elements';

let inMemoryCustomElements: SavedCustomElement[] = [];

const normalizeSavedLayer = (layer: ImageLayer): ImageLayer => {
  const props = { ...(layer.props ?? {}) };
  if (Array.isArray(props.childrenLayers)) {
    props.childrenLayers = props.childrenLayers.map((child) =>
      normalizeSavedLayer(child as ImageLayer),
    );
  }
  const normalizedProps = layer.blockType === 'GeometricShape'
    ? normalizeGeometricShapeProps(props)
    : props;
  const vectorGeometry = normalizeEditableVectorGeometry(
    layer.vectorGeometry ?? props.vectorGeometry,
  );
  if (vectorGeometry) normalizedProps.vectorGeometry = vectorGeometry;
  else delete normalizedProps.vectorGeometry;
  const { vectorGeometry: _storedVectorGeometry, ...layerWithoutVectorGeometry } = layer;
  return {
    ...layerWithoutVectorGeometry,
    props: normalizedProps,
    ...(vectorGeometry ? { vectorGeometry } : {}),
  };
};

export function getSavedCustomElements(): SavedCustomElement[] {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return inMemoryCustomElements;
  }

  try {
    const raw = localStorage.getItem(SAVED_ELEMENTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const userOnly = parsed
        .filter((e): e is SavedCustomElement => Boolean(e) && !e.id?.startsWith('default-') && e.layer)
        .map((element) => ({
          ...element,
          layer: normalizeSavedLayer(element.layer),
        }));
      inMemoryCustomElements = userOnly;
      return userOnly;
    }
    return [];
  } catch (error) {
    console.error('Error loading saved custom elements from storage:', error);
    return inMemoryCustomElements;
  }
}

export function saveCustomElement(layer: ImageLayer, customTitle?: string): SavedCustomElement {
  const elements = getSavedCustomElements();
  const snapshot = JSON.parse(JSON.stringify(layer)) as ImageLayer;
  const vectorGeometry = normalizeEditableVectorGeometry(
    snapshot.vectorGeometry ?? snapshot.props?.vectorGeometry,
  );
  if (vectorGeometry) {
    snapshot.vectorGeometry = vectorGeometry;
    snapshot.props.vectorGeometry = vectorGeometry;
  } else {
    delete snapshot.vectorGeometry;
    delete snapshot.props.vectorGeometry;
  }
  if (snapshot.blockType === 'GeometricShape') {
    snapshot.props = normalizeGeometricShapeProps(snapshot.props);
  }
  
  let category: SavedCustomElement['category'] = 'card';
  if (layer.type === 'text' || layer.blockType === 'CustomText') {
    category = 'text';
  } else if (layer.blockType === 'CustomGroup') {
    category = 'group';
  } else if (layer.type === 'shape') {
    category = 'shape';
  }

  const newElement: SavedCustomElement = {
    id: `saved-elem-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: customTitle?.trim() || layer.title || 'Elemento Personalizado',
    category,
    layer: snapshot,
    createdAt: new Date().toISOString(),
    catalogMetadata: {
      kind: 'saved_element',
      category: 'saved_elements',
      scope: 'user',
      tags: [category, 'guardado'],
      license: {
        id: 'user-created',
        label: 'Creado por ti',
        allowsCommercialUse: true,
        requiresAttribution: false,
      },
      editableFields: ['*'],
      lockedFields: [],
      supportedFormats: ['image', 'video'],
      version: 1,
      approvalStatus: 'not_required',
      locked: false,
      sourcePackage: 'user',
    },
  };

  const nextElements = [newElement, ...elements];
  inMemoryCustomElements = nextElements;

  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(SAVED_ELEMENTS_STORAGE_KEY, JSON.stringify(nextElements));
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
