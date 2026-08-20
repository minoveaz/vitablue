import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronRight,
  FolderHeart,
  Plus,
} from 'lucide-react';
import { ImageBlockType, ImageLayer } from '../../../types/imageStudio';
import { TraditionalShapeType } from '../blocks/ShapeBlocks';
import { getSavedCustomElements, SavedCustomElement } from '../../../utils/savedElementsStorage';

export interface ImageStudioElementsDrawerProps {
  onAddBlock: (blockType: ImageBlockType, defaultProps?: Record<string, unknown>) => void;
  onInsertSavedLayer?: (layer: ImageLayer) => void;
}

interface ShapeItemConfig {
  id: string;
  name: string;
  shapeType: TraditionalShapeType;
  defaultWidth: number;
  defaultHeight: number;
  defaultFill?: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
  defaultBorderRadius?: number;
}

interface ShapeSectionConfig {
  id: string;
  title: string;
  items: ShapeItemConfig[];
}

const CANVA_SHAPE_SECTIONS: ShapeSectionConfig[] = [
  // 1. LÍNEAS
  {
    id: 'lines',
    title: 'Líneas',
    items: [
      {
        id: 'line-solid',
        name: 'Línea sólida',
        shapeType: 'line',
        defaultWidth: 400,
        defaultHeight: 8,
        defaultFill: '#FFFFFF',
        defaultStrokeWidth: 4,
      },
      {
        id: 'line-dashed',
        name: 'Línea discontinua',
        shapeType: 'line-dashed',
        defaultWidth: 400,
        defaultHeight: 8,
        defaultFill: '#FFFFFF',
        defaultStrokeWidth: 4,
      },
      {
        id: 'line-dotted',
        name: 'Línea punteada',
        shapeType: 'line-dotted',
        defaultWidth: 400,
        defaultHeight: 8,
        defaultFill: '#FFFFFF',
        defaultStrokeWidth: 4,
      },
      {
        id: 'line-arrow-right',
        name: 'Línea con flecha derecha',
        shapeType: 'line-arrow-right',
        defaultWidth: 400,
        defaultHeight: 24,
        defaultFill: '#FFFFFF',
        defaultStrokeWidth: 4,
      },
      {
        id: 'line-arrow-both',
        name: 'Línea con flecha doble',
        shapeType: 'line-arrow-both',
        defaultWidth: 400,
        defaultHeight: 24,
        defaultFill: '#FFFFFF',
        defaultStrokeWidth: 4,
      },
    ],
  },

  // 2. FORMAS BÁSICAS
  {
    id: 'basic_shapes',
    title: 'Formas básicas',
    items: [
      {
        id: 'shape-square',
        name: 'Cuadrado / Rectángulo',
        shapeType: 'rectangle',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-rounded-rect',
        name: 'Rectángulo redondeado',
        shapeType: 'rounded_rect',
        defaultWidth: 240,
        defaultHeight: 160,
        defaultFill: '#005F73',
        defaultBorderRadius: 24,
      },
      {
        id: 'shape-circle',
        name: 'Círculo',
        shapeType: 'circle',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-triangle-up',
        name: 'Triángulo arriba',
        shapeType: 'triangle-up',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-triangle-down',
        name: 'Triángulo abajo',
        shapeType: 'triangle-down',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
    ],
  },

  // 3. POLÍGONOS
  {
    id: 'polygons',
    title: 'Polígonos',
    items: [
      {
        id: 'shape-pentagon',
        name: 'Pentágono',
        shapeType: 'pentagon',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-hexagon',
        name: 'Hexágono',
        shapeType: 'hexagon',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-octagon',
        name: 'Octágono',
        shapeType: 'octagon',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-diamond',
        name: 'Rombo / Diamante',
        shapeType: 'diamond',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
    ],
  },

  // 4. ESTRELLAS
  {
    id: 'stars',
    title: 'Estrellas',
    items: [
      {
        id: 'shape-star-4',
        name: 'Estrella de 4 puntas',
        shapeType: 'star-4',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#EE9B00',
      },
      {
        id: 'shape-star-5',
        name: 'Estrella tradicional (5 puntas)',
        shapeType: 'star-5',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#EE9B00',
      },
      {
        id: 'shape-star-6',
        name: 'Estrella de 6 puntas',
        shapeType: 'star-6',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#EE9B00',
      },
      {
        id: 'shape-star-8',
        name: 'Estrella de 8 puntas',
        shapeType: 'star-8',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#EE9B00',
      },
      {
        id: 'shape-burst-12',
        name: 'Sello / Burst de 12 puntas',
        shapeType: 'burst-12',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#EE9B00',
      },
    ],
  },

  // 5. FLECHAS
  {
    id: 'arrows',
    title: 'Flechas',
    items: [
      {
        id: 'shape-arrow-right',
        name: 'Flecha derecha',
        shapeType: 'arrow-right',
        defaultWidth: 220,
        defaultHeight: 120,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-arrow-left',
        name: 'Flecha izquierda',
        shapeType: 'arrow-left',
        defaultWidth: 220,
        defaultHeight: 120,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-arrow-up',
        name: 'Flecha arriba',
        shapeType: 'arrow-up',
        defaultWidth: 120,
        defaultHeight: 220,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-arrow-down',
        name: 'Flecha abajo',
        shapeType: 'arrow-down',
        defaultWidth: 120,
        defaultHeight: 220,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-arrow-both',
        name: 'Flecha bidireccional',
        shapeType: 'arrow-both',
        defaultWidth: 240,
        defaultHeight: 120,
        defaultFill: '#005F73',
      },
    ],
  },

  // 6. SÍMBOLOS & DIÁLOGO
  {
    id: 'symbols',
    title: 'Símbolos & Diálogo',
    items: [
      {
        id: 'shape-speech-bubble',
        name: 'Bocadillo de diálogo',
        shapeType: 'speech_bubble',
        defaultWidth: 220,
        defaultHeight: 180,
        defaultFill: '#005F73',
      },
      {
        id: 'shape-heart',
        name: 'Corazón',
        shapeType: 'heart',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#E63946',
      },
      {
        id: 'shape-shield',
        name: 'Escudo protector',
        shapeType: 'shield',
        defaultWidth: 200,
        defaultHeight: 200,
        defaultFill: '#005F73',
      },
    ],
  },
];

export const ImageStudioElementsDrawer: React.FC<ImageStudioElementsDrawerProps> = ({
  onAddBlock,
  onInsertSavedLayer,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectionView, setActiveSectionView] = useState<string | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<ShapeItemConfig[]>([
    CANVA_SHAPE_SECTIONS[1].items[2], // circle
    CANVA_SHAPE_SECTIONS[1].items[0], // square
    CANVA_SHAPE_SECTIONS[0].items[0], // line
    CANVA_SHAPE_SECTIONS[3].items[1], // star-5
  ]);

  const savedElements = useMemo<SavedCustomElement[]>(() => {
    return getSavedCustomElements().filter(
      (e) => e.category === 'shape' || e.category === 'card' || e.category === 'group'
    );
  }, []);

  const handleInsertShape = (item: ShapeItemConfig) => {
    // Añadir a recientemente usados
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      return [item, ...filtered].slice(0, 6);
    });

    onAddBlock('GeometricShape', {
      shapeType: item.shapeType,
      fill: item.defaultFill ?? '#005F73',
      stroke: item.defaultStroke ?? 'transparent',
      strokeWidth: item.defaultStrokeWidth ?? 0,
      borderRadius: item.defaultBorderRadius ?? (item.shapeType === 'rounded_rect' ? 24 : 0),
      width: item.defaultWidth,
      height: item.defaultHeight,
    });
  };

  // Renderizador vectorial iconográfico limpio (Canva-Style silhouette)
  const renderShapeIcon = (shapeType: TraditionalShapeType) => {
    switch (shapeType) {
      // Líneas
      case 'line':
        return <div className="w-full h-1 bg-current rounded-full" />;
      case 'line-dashed':
        return (
          <div
            className="w-full h-1"
            style={{
              backgroundImage: 'linear-gradient(to right, currentColor 60%, transparent 40%)',
              backgroundSize: '8px 100%',
            }}
          />
        );
      case 'line-dotted':
        return (
          <div
            className="w-full h-1"
            style={{
              backgroundImage: 'radial-gradient(circle, currentColor 40%, transparent 50%)',
              backgroundSize: '6px 100%',
            }}
          />
        );
      case 'line-arrow-right':
        return (
          <svg viewBox="0 0 100 24" className="w-full h-4" preserveAspectRatio="none">
            <line x1="0" y1="12" x2="82" y2="12" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <polygon points="80,3 100,12 80,21" fill="currentColor" />
          </svg>
        );
      case 'line-arrow-both':
        return (
          <svg viewBox="0 0 100 24" className="w-full h-4" preserveAspectRatio="none">
            <polygon points="20,3 0,12 20,21" fill="currentColor" />
            <line x1="16" y1="12" x2="84" y2="12" stroke="currentColor" strokeWidth="6" />
            <polygon points="80,3 100,12 80,21" fill="currentColor" />
          </svg>
        );

      // Formas básicas
      case 'square':
      case 'rectangle':
        return <div className="size-7 bg-current rounded-none" />;
      case 'rounded_rect':
        return <div className="size-7 bg-current rounded-lg" />;
      case 'circle':
        return <div className="size-7 bg-current rounded-full" />;
      case 'triangle':
      case 'triangle-up':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,95 5,95" fill="currentColor" />
          </svg>
        );
      case 'triangle-down':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,95 95,5 5,5" fill="currentColor" />
          </svg>
        );

      // Polígonos
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,50 50,95 5,50" fill="currentColor" />
          </svg>
        );
      case 'pentagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,38 78,92 22,92 5,38" fill="currentColor" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="currentColor" />
          </svg>
        );
      case 'octagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="currentColor" />
          </svg>
        );

      // Estrellas
      case 'star-4':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="currentColor" />
          </svg>
        );
      case 'star':
      case 'star-5':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 64,36 98,38 72,61 80,95 50,77 20,95 28,61 2,38 36,36" fill="currentColor" />
          </svg>
        );
      case 'star-6':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 62,30 90,25 75,50 90,75 62,70 50,95 38,70 10,75 25,50 10,25 38,30" fill="currentColor" />
          </svg>
        );
      case 'star-8':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 62,25 85,15 75,38 95,50 75,62 85,85 62,75 50,95 38,75 15,85 25,62 5,50 25,38 15,15 38,25" fill="currentColor" />
          </svg>
        );
      case 'burst-12':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 58,18 73,12 77,27 92,27 88,42 98,50 88,58 92,73 77,73 73,88 58,82 50,95 42,82 27,88 23,73 8,73 12,58 2,50 12,42 8,27 23,27 27,12 42,18" fill="currentColor" />
          </svg>
        );

      // Flechas
      case 'arrow':
      case 'arrow-right':
        return (
          <svg viewBox="0 0 100 70" className="size-7" preserveAspectRatio="none">
            <polygon points="0,22 55,22 55,5 100,35 55,65 55,48 0,48" fill="currentColor" />
          </svg>
        );
      case 'arrow-left':
        return (
          <svg viewBox="0 0 100 70" className="size-7" preserveAspectRatio="none">
            <polygon points="100,22 45,22 45,5 0,35 45,65 45,48 100,48" fill="currentColor" />
          </svg>
        );
      case 'arrow-up':
        return (
          <svg viewBox="0 0 70 100" className="size-7" preserveAspectRatio="none">
            <polygon points="22,100 22,45 5,45 35,0 65,45 48,45 48,100" fill="currentColor" />
          </svg>
        );
      case 'arrow-down':
        return (
          <svg viewBox="0 0 70 100" className="size-7" preserveAspectRatio="none">
            <polygon points="22,0 22,55 5,55 35,100 65,55 48,55 48,0" fill="currentColor" />
          </svg>
        );
      case 'arrow-both':
        return (
          <svg viewBox="0 0 100 60" className="size-7" preserveAspectRatio="none">
            <polygon points="25,10 0,30 25,50 25,38 75,38 75,50 100,30 75,10 75,22 25,22" fill="currentColor" />
          </svg>
        );

      // Símbolos
      case 'speech_bubble':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <path d="M 10 15 C 10 10 15 5 25 5 L 75 5 C 85 5 90 10 90 15 L 90 65 C 90 70 85 75 75 75 L 45 75 L 20 95 L 25 75 L 25 75 C 15 75 10 70 10 65 Z" fill="currentColor" />
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 100 100" className="size-7 text-rose-500" preserveAspectRatio="none">
            <path d="M 50 88 C 20 65 5 45 5 28 C 5 15 15 5 28 5 C 37 5 45 10 50 18 C 55 10 63 5 72 5 C 85 5 95 15 95 28 C 95 45 80 65 50 88 Z" fill="currentColor" />
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 100 100" className="size-7 text-amber-400" preserveAspectRatio="none">
            <path d="M 50 5 L 90 20 L 90 55 C 90 78 50 95 50 95 C 50 95 10 78 10 55 L 10 20 Z" fill="currentColor" />
          </svg>
        );

      default:
        return <div className="size-7 bg-current rounded-md" />;
    }
  };

  // Filtrado por búsqueda
  const matchingShapes = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const result: ShapeItemConfig[] = [];
    CANVA_SHAPE_SECTIONS.forEach((sec) => {
      sec.items.forEach((item) => {
        if (item.name.toLowerCase().includes(query) || sec.title.toLowerCase().includes(query)) {
          result.push(item);
        }
      });
    });
    return result;
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col bg-slate-900 text-slate-100 select-none">
      {/* 1. BUSCADOR SUPERIOR AL ESTILO CANVA */}
      <div className="p-3 border-b border-slate-800 shrink-0 bg-slate-950">
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe o busca tu elemento (ej: círculo, flecha, estrella...)"
            className="w-full rounded-2xl border border-slate-800 bg-slate-900 pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL: CATEGORÍAS & FORMAS COMPACTAS (CANVA-STYLE) */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        {/* CASO A: RESULTADOS DE BÚSQUEDA */}
        {matchingShapes !== null ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Resultados ({matchingShapes.length})
              </span>
            </div>
            {matchingShapes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No se encontraron formas con "{searchQuery}"
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-2">
                {matchingShapes.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInsertShape(item)}
                    title={item.name}
                    className="flex size-12 items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-100 hover:bg-slate-800 hover:border-brand-cyan hover:scale-105 active:scale-95 transition-all shadow-xs"
                  >
                    {renderShapeIcon(item.shapeType)}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : activeSectionView ? (
          /* VISTA EXTENDIDA "VER TODO" DE UNA SECCIÓN */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSectionView(null)}
                className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>← Volver a Formas</span>
              </button>
              <span className="text-xs font-bold text-slate-300">
                {CANVA_SHAPE_SECTIONS.find((s) => s.id === activeSectionView)?.title}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {CANVA_SHAPE_SECTIONS.find((s) => s.id === activeSectionView)?.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleInsertShape(item)}
                  title={item.name}
                  className="flex size-12 items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-100 hover:bg-slate-800 hover:border-brand-cyan hover:scale-105 active:scale-95 transition-all shadow-xs"
                >
                  {renderShapeIcon(item.shapeType)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* VISTA PRINCIPAL POR SECCIONES (CANVA-STYLE GRID) */
          <>
            {/* SECCIÓN 1: UTILIZADO RECIENTEMENTE */}
            {recentlyUsed.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-tight text-slate-200">
                    Utilizado recientemente
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {recentlyUsed.map((item) => (
                    <button
                      key={`recent-${item.id}`}
                      type="button"
                      onClick={() => handleInsertShape(item)}
                      title={item.name}
                      className="flex size-12 items-center justify-center rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-brand-cyan hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      {renderShapeIcon(item.shapeType)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECCIONES: LÍNEAS, FORMAS BÁSICAS, POLÍGONOS, ESTRELLAS, FLECHAS, SÍMBOLOS */}
            {CANVA_SHAPE_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-tight text-slate-200">
                    {section.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSectionView(section.id)}
                    className="text-[11px] font-bold text-slate-400 hover:text-brand-cyan flex items-center gap-0.5 transition-colors"
                  >
                    <span>Ver todo</span>
                    <ChevronRight className="size-3" />
                  </button>
                </div>

                {/* FILA COMPACTA DE FORMAS (ICONOS MINIMALISTAS EN GRIS / BLANCO) */}
                <div className="grid grid-cols-5 gap-2">
                  {section.items.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInsertShape(item)}
                      title={item.name}
                      className="flex size-12 items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800/80 text-slate-200 hover:bg-slate-800 hover:text-white hover:border-brand-cyan hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      {renderShapeIcon(item.shapeType)}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* SECCIÓN ADICIONAL: MIS ELEMENTOS GUARDADOS (SI EXISTEN) */}
            {savedElements.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-tight text-amber-300 flex items-center gap-1.5">
                    <FolderHeart className="size-3.5" />
                    <span>Mis Elementos Guardados ({savedElements.length})</span>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {savedElements.slice(0, 4).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onInsertSavedLayer?.(item.layer)}
                      className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-amber-400 hover:bg-slate-900 transition-all text-left text-xs text-slate-300 hover:text-white"
                    >
                      <span className="truncate">{item.title}</span>
                      <Plus className="size-3.5 text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
