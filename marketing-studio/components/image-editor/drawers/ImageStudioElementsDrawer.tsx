import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Shapes,
  ShieldCheck,
  MousePointerClick,
  Layers,
  FolderHeart,
  Plus,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { ImageBlockType, ImageLayer } from '../../../types/imageStudio';
import { TraditionalShapeType } from '../blocks/ShapeBlocks';
import { getSavedCustomElements, SavedCustomElement } from '../../../utils/savedElementsStorage';
import {
  ELEMENT_PRESETS,
  ElementPresetItem,
} from '../../../data/elementsPresets';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSectionView, setActiveSectionView] = useState<string | null>(null);
  const [recentlyUsed, setRecentlyUsed] = useState<ShapeItemConfig[]>([
    CANVA_SHAPE_SECTIONS[1].items[2], // circle
    CANVA_SHAPE_SECTIONS[1].items[0], // square
    CANVA_SHAPE_SECTIONS[0].items[0], // line
    CANVA_SHAPE_SECTIONS[3].items[1], // star-5
    CANVA_SHAPE_SECTIONS[5].items[1], // heart
  ]);

  const savedElements = useMemo<SavedCustomElement[]>(() => {
    return getSavedCustomElements().filter(
      (e) => e.category === 'shape' || e.category === 'card' || e.category === 'group'
    );
  }, []);

  const categories = useMemo(() => {
    const base = [
      { id: 'all', name: '✨ Todos', icon: <Sparkles className="size-3.5" /> },
      { id: 'shapes', name: '📐 Formas & Geometría', icon: <Shapes className="size-3.5" /> },
      { id: 'trust_stamps', name: '🛡️ Sellos Consulares', icon: <ShieldCheck className="size-3.5" /> },
      { id: 'ctas', name: '💬 Botones & CTAs', icon: <MousePointerClick className="size-3.5" /> },
      { id: 'surfaces', name: '🪟 Superficies Glass', icon: <Layers className="size-3.5" /> },
    ];
    if (savedElements.length > 0) {
      base.push({ id: 'saved', name: `⭐ Mis Elementos (${savedElements.length})`, icon: <FolderHeart className="size-3.5 text-amber-400" /> });
    }
    return base;
  }, [savedElements]);

  const handleInsertShape = (item: ShapeItemConfig) => {
    setRecentlyUsed((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      return [item, ...filtered].slice(0, 5);
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

  const handleInsertPreset = (preset: ElementPresetItem) => {
    onAddBlock(preset.blockType, preset.defaultProps);
  };

  // Renderizador vectorial iconográfico limpio (Canva-Style silhouette)
  const renderShapeIcon = (shapeType: TraditionalShapeType) => {
    switch (shapeType) {
      // Líneas
      case 'line':
        return <div className="w-8 h-1 bg-white rounded-full" />;
      case 'line-dashed':
        return (
          <div
            className="w-8 h-1"
            style={{
              backgroundImage: 'linear-gradient(to right, #FFFFFF 60%, transparent 40%)',
              backgroundSize: '8px 100%',
            }}
          />
        );
      case 'line-dotted':
        return (
          <div
            className="w-8 h-1"
            style={{
              backgroundImage: 'radial-gradient(circle, #FFFFFF 40%, transparent 50%)',
              backgroundSize: '6px 100%',
            }}
          />
        );
      case 'line-arrow-right':
        return (
          <svg viewBox="0 0 100 24" className="w-8 h-4" preserveAspectRatio="none">
            <line x1="0" y1="12" x2="80" y2="12" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
            <polygon points="76,3 100,12 76,21" fill="#FFFFFF" />
          </svg>
        );
      case 'line-arrow-both':
        return (
          <svg viewBox="0 0 100 24" className="w-8 h-4" preserveAspectRatio="none">
            <polygon points="24,3 0,12 24,21" fill="#FFFFFF" />
            <line x1="20" y1="12" x2="80" y2="12" stroke="#FFFFFF" strokeWidth="6" />
            <polygon points="76,3 100,12 76,21" fill="#FFFFFF" />
          </svg>
        );

      // Formas básicas
      case 'square':
      case 'rectangle':
        return <div className="size-7 bg-white rounded-xs" />;
      case 'rounded_rect':
        return <div className="size-7 bg-white rounded-lg" />;
      case 'circle':
        return <div className="size-7 bg-white rounded-full" />;
      case 'triangle':
      case 'triangle-up':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,95 5,95" fill="#FFFFFF" />
          </svg>
        );
      case 'triangle-down':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,95 95,5 5,5" fill="#FFFFFF" />
          </svg>
        );

      // Polígonos
      case 'diamond':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,50 50,95 5,50" fill="#FFFFFF" />
          </svg>
        );
      case 'pentagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 95,38 78,92 22,92 5,38" fill="#FFFFFF" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill="#FFFFFF" />
          </svg>
        );
      case 'octagon':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="#FFFFFF" />
          </svg>
        );

      // Estrellas
      case 'star-4':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 60,40 95,50 60,60 50,95 40,60 5,50 40,40" fill="#FFFFFF" />
          </svg>
        );
      case 'star':
      case 'star-5':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 64,36 98,38 72,61 80,95 50,77 20,95 28,61 2,38 36,36" fill="#FFFFFF" />
          </svg>
        );
      case 'star-6':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 62,30 90,25 75,50 90,75 62,70 50,95 38,70 10,75 25,50 10,25 38,30" fill="#FFFFFF" />
          </svg>
        );
      case 'star-8':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 62,25 85,15 75,38 95,50 75,62 85,85 62,75 50,95 38,75 15,85 25,62 5,50 25,38 15,15 38,25" fill="#FFFFFF" />
          </svg>
        );
      case 'burst-12':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <polygon points="50,5 58,18 73,12 77,27 92,27 88,42 98,50 88,58 92,73 77,73 73,88 58,82 50,95 42,82 27,88 23,73 8,73 12,58 2,50 12,42 8,27 23,27 27,12 42,18" fill="#FFFFFF" />
          </svg>
        );

      // Flechas
      case 'arrow':
      case 'arrow-right':
        return (
          <svg viewBox="0 0 100 70" className="size-7" preserveAspectRatio="none">
            <polygon points="0,22 55,22 55,5 100,35 55,65 55,48 0,48" fill="#FFFFFF" />
          </svg>
        );
      case 'arrow-left':
        return (
          <svg viewBox="0 0 100 70" className="size-7" preserveAspectRatio="none">
            <polygon points="100,22 45,22 45,5 0,35 45,65 45,48 100,48" fill="#FFFFFF" />
          </svg>
        );
      case 'arrow-up':
        return (
          <svg viewBox="0 0 70 100" className="size-7" preserveAspectRatio="none">
            <polygon points="22,100 22,45 5,45 35,0 65,45 48,45 48,100" fill="#FFFFFF" />
          </svg>
        );
      case 'arrow-down':
        return (
          <svg viewBox="0 0 70 100" className="size-7" preserveAspectRatio="none">
            <polygon points="22,0 22,55 5,55 35,100 65,55 48,55 48,0" fill="#FFFFFF" />
          </svg>
        );
      case 'arrow-both':
        return (
          <svg viewBox="0 0 100 60" className="size-7" preserveAspectRatio="none">
            <polygon points="25,10 0,30 25,50 25,38 75,38 75,50 100,30 75,10 75,22 25,22" fill="#FFFFFF" />
          </svg>
        );

      // Símbolos
      case 'speech_bubble':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <path d="M 10 15 C 10 10 15 5 25 5 L 75 5 C 85 5 90 10 90 15 L 90 65 C 90 70 85 75 75 75 L 45 75 L 20 95 L 25 75 L 25 75 C 15 75 10 70 10 65 Z" fill="#FFFFFF" />
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <path d="M 50 88 C 20 65 5 45 5 28 C 5 15 15 5 28 5 C 37 5 45 10 50 18 C 55 10 63 5 72 5 C 85 5 95 15 95 28 C 95 45 80 65 50 88 Z" fill="#E63946" />
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 100 100" className="size-7" preserveAspectRatio="none">
            <path d="M 50 5 L 90 20 L 90 55 C 90 78 50 95 50 95 C 50 95 10 78 10 55 L 10 20 Z" fill="#EE9B00" />
          </svg>
        );

      default:
        return <div className="size-7 bg-white rounded-xs" />;
    }
  };

  const trustPresets = useMemo(() => {
    return ELEMENT_PRESETS.filter((p) => p.category === 'trust_stamps');
  }, []);

  const ctaPresets = useMemo(() => {
    return ELEMENT_PRESETS.filter((p) => p.category === 'ctas');
  }, []);

  const surfacePresets = useMemo(() => {
    return ELEMENT_PRESETS.filter((p) => p.category === 'surfaces');
  }, []);

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

  const matchingPresets = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    return ELEMENT_PRESETS.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.badge && p.badge.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col bg-[#070e17] text-slate-100 select-none">
      {/* 1. BUSCADOR SUPERIOR */}
      <div className="p-3 border-b border-slate-800/80 shrink-0 bg-[#050b12]">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 size-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Describe o busca tu elemento (ej: círculo, WhatsApp, sello...)"
            className="w-full rounded-2xl border border-slate-800 bg-[#0d1624] pl-9 pr-8 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-brand-cyan focus:bg-[#111c2e] focus:outline-none focus:ring-1 focus:ring-brand-cyan/40 transition-colors shadow-inner"
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

      {/* 2. CHIPS DE NAVEGACIÓN POR CATEGORÍAS (TODOS, FORMAS, SELLOS, CTAS, SUPERFICIES, MIS ELEMENTOS) */}
      <div className="flex items-center gap-1.5 p-2.5 border-b border-slate-800/80 bg-[#070e17] overflow-x-auto no-scrollbar shrink-0">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveSectionView(null);
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-primary/40 text-brand-cyan border border-brand-cyan/50 shadow-xs'
                  : 'bg-slate-900/90 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.icon}
              <span className="truncate">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 3. CONTENIDO PRINCIPAL SEGÚN PESTAÑA */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
        {/* CASO A: RESULTADOS DE BÚSQUEDA */}
        {searchQuery.trim() !== '' ? (
          <div className="space-y-4">
            <span className="text-xs font-semibold text-slate-300">
              Resultados para "{searchQuery}"
            </span>

            {/* FORMAS COINCIDENTES */}
            {matchingShapes && matchingShapes.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">Formas ({matchingShapes.length})</span>
                <div className="grid grid-cols-5 gap-1">
                  {matchingShapes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInsertShape(item)}
                      title={item.name}
                      className="flex size-12 items-center justify-center rounded-xl hover:bg-slate-800/80 active:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      {renderShapeIcon(item.shapeType)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRESETS COINCIDENTES (SELLOS / CTAS / GLASS) */}
            {matchingPresets && matchingPresets.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400">Componentes de Marca ({matchingPresets.length})</span>
                <div className="space-y-2">
                  {matchingPresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => handleInsertPreset(preset)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#0d1624] hover:border-brand-cyan hover:bg-slate-900 transition-all cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2">
                        <strong className="block text-xs font-bold text-slate-200 group-hover:text-brand-cyan truncate">
                          {preset.title}
                        </strong>
                        <span className="text-[10px] text-slate-400 truncate block">{preset.description}</span>
                      </div>
                      <span className="text-[11px] font-bold text-brand-cyan shrink-0">+ Añadir</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : activeSectionView ? (
          /* VISTA EXTENDIDA "VER TODO" DE UNA SUB-SECCIÓN DE FORMAS */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveSectionView(null)}
                className="text-xs font-semibold text-brand-cyan hover:underline flex items-center gap-1"
              >
                <span>← Volver a Formas</span>
              </button>
              <span className="text-xs font-semibold text-slate-300">
                {CANVA_SHAPE_SECTIONS.find((s) => s.id === activeSectionView)?.title}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 pt-1">
              {CANVA_SHAPE_SECTIONS.find((s) => s.id === activeSectionView)?.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleInsertShape(item)}
                  title={item.name}
                  className="flex size-12 items-center justify-center rounded-xl hover:bg-slate-800/80 active:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  {renderShapeIcon(item.shapeType)}
                </button>
              ))}
            </div>
          </div>
        ) : selectedCategory === 'shapes' ? (
          /* PESTAÑA DEDICADA: 📐 FORMAS & GEOMETRÍA (CANVA GRID COMPLETO) */
          <>
            {CANVA_SHAPE_SECTIONS.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-300">
                    {section.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSectionView(section.id)}
                    className="text-[11px] font-medium text-slate-400 hover:text-brand-cyan flex items-center gap-0.5 transition-colors"
                  >
                    <span>Ver todo</span>
                    <ChevronRight className="size-3" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {section.items.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleInsertShape(item)}
                      title={item.name}
                      className="flex size-12 items-center justify-center rounded-xl hover:bg-slate-800/80 active:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      {renderShapeIcon(item.shapeType)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : selectedCategory === 'trust_stamps' ? (
          /* PESTAÑA DEDICADA: 🛡️ SELLOS CONSULARES & INSIGNIAS */
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block px-1">
              Insignias Oficiales de Homologación
            </span>
            {trustPresets.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInsertPreset(item)}
                className="group flex flex-col p-3 rounded-2xl border border-slate-800 bg-[#0d1624] hover:border-brand-cyan hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-200 group-hover:text-brand-cyan transition-colors">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-slate-400">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-md bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-400 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* PREVIEW INTERACTIVO */}
                <div className="my-1 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800/80 p-2.5 overflow-hidden">
                  {item.blockType === 'TrustVerifiedPill' && (
                    <div className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                      <CheckCircle2 className="size-3" />
                      <span>{String(item.defaultProps.verifiedLabel)}</span>
                    </div>
                  )}

                  {item.blockType === 'TrustHighlightPill' && (
                    <div className="rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 text-[10px] font-black tracking-wider text-amber-300">
                      {String(item.defaultProps.highlight)}
                    </div>
                  )}

                  {item.blockType === 'HookAlertBadge' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/40 bg-teal-950/90 px-3 py-0.5 text-[10px] font-black uppercase text-brand-cyan">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{String(item.defaultProps.badge)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-brand-cyan transition-colors">
                    <Plus className="size-3.5" />
                    <span>Añadir al Lienzo</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : selectedCategory === 'ctas' ? (
          /* PESTAÑA DEDICADA: 💬 BOTONES & LLAMADAS A LA ACCIÓN */
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block px-1">
              Botones de Conversión y Contacto
            </span>
            {ctaPresets.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInsertPreset(item)}
                className="group flex flex-col p-3 rounded-2xl border border-slate-800 bg-[#0d1624] hover:border-accent hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-200 group-hover:text-accent transition-colors">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-slate-400">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-md bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-300 shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* PREVIEW BOTÓN */}
                <div className="my-1 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800/80 p-2.5 overflow-hidden">
                  <div
                    className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold shadow-xs"
                    style={{
                      backgroundColor: String(item.defaultProps.primaryColor ?? '#005F73'),
                      color: String(item.defaultProps.textColor ?? '#FFFFFF'),
                      border: `1px solid ${String(item.defaultProps.accentColor ?? '#EE9B00')}`,
                    }}
                  >
                    <span>{String(item.defaultProps.ctaText)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-accent transition-colors">
                    <Plus className="size-3.5" />
                    <span>Añadir al Lienzo</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : selectedCategory === 'surfaces' ? (
          /* PESTAÑA DEDICADA: 🪟 SUPERFICIES GLASS */
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-300 block px-1">
              Contenedores Translúcidos Glassmorphism
            </span>
            {surfacePresets.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInsertPreset(item)}
                className="group flex flex-col p-3 rounded-2xl border border-slate-800 bg-[#0d1624] hover:border-brand-cyan hover:bg-slate-900 transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <strong className="block text-xs font-bold text-slate-200 group-hover:text-brand-cyan transition-colors">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-slate-400">{item.description}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-md bg-slate-950 border border-slate-800 px-1.5 py-0.5 text-[9px] font-mono font-bold text-brand-cyan shrink-0">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="my-1 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800/80 p-3 overflow-hidden">
                  <div
                    className={`h-12 w-full rounded-2xl border ${
                      item.defaultProps.variant === 'amber'
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : 'border-teal-500/40 bg-teal-950/40'
                    }`}
                  />
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 group-hover:text-brand-cyan transition-colors">
                    <Plus className="size-3.5" />
                    <span>Añadir al Lienzo</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : selectedCategory === 'saved' ? (
          /* PESTAÑA DEDICADA: ⭐ MIS ELEMENTOS */
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-amber-300 block px-1">
              Mis Elementos Personalizados ({savedElements.length})
            </span>
            {savedElements.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <FolderHeart className="size-8 mx-auto text-slate-600" />
                <p className="text-xs font-bold text-slate-400">No hay elementos guardados</p>
                <p className="text-[11px] text-slate-500">
                  Selecciona cualquier elemento en el lienzo y pulsa "⭐ Guardar en Mis Diseños".
                </p>
              </div>
            ) : (
              savedElements.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onInsertSavedLayer?.(item.layer)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-amber-500/30 bg-[#0d1624] hover:border-amber-400 hover:bg-slate-900 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                      <FolderHeart className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 truncate block">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ⭐ Elemento Personalizado
                      </span>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-300/80 group-hover:text-amber-300 shrink-0">
                    <Plus className="size-3.5" />
                    <span>Añadir</span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          /* PESTAÑA: ✨ TODOS (VISTA GLOBAL UNIFICADA) */
          <>
            {/* 1. UTILIZADO RECIENTEMENTE */}
            {recentlyUsed.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-300">
                    Utilizado recientemente
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {recentlyUsed.map((item) => (
                    <button
                      key={`recent-${item.id}`}
                      type="button"
                      onClick={() => handleInsertShape(item)}
                      title={item.name}
                      className="flex size-12 items-center justify-center rounded-xl hover:bg-slate-800/80 active:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                    >
                      {renderShapeIcon(item.shapeType)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. FORMAS BÁSICAS (PREVIEW DE FILA) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300">
                  Formas básicas
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('shapes')}
                  className="text-[11px] font-medium text-slate-400 hover:text-brand-cyan flex items-center gap-0.5 transition-colors"
                >
                  <span>Ver todo</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {CANVA_SHAPE_SECTIONS[1].items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInsertShape(item)}
                    title={item.name}
                    className="flex size-12 items-center justify-center rounded-xl hover:bg-slate-800/80 active:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                  >
                    {renderShapeIcon(item.shapeType)}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. SELLOS CONSULARES (PREVIEW) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300">
                  🛡️ Sellos Consulares & Insignias
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('trust_stamps')}
                  className="text-[11px] font-medium text-slate-400 hover:text-brand-cyan flex items-center gap-0.5 transition-colors"
                >
                  <span>Ver todo ({trustPresets.length})</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {trustPresets.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInsertPreset(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#0d1624] hover:border-brand-cyan hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <strong className="block text-xs font-bold text-slate-200 group-hover:text-brand-cyan truncate">
                        {item.title}
                      </strong>
                      <span className="text-[10px] text-slate-400 truncate block">{item.description}</span>
                    </div>
                    <Plus className="size-3.5 text-brand-cyan shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* 4. BOTONES & CTAs (PREVIEW) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300">
                  💬 Botones & CTAs
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('ctas')}
                  className="text-[11px] font-medium text-slate-400 hover:text-accent flex items-center gap-0.5 transition-colors"
                >
                  <span>Ver todo ({ctaPresets.length})</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="space-y-1.5">
                {ctaPresets.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInsertPreset(item)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#0d1624] hover:border-accent hover:bg-slate-800/60 transition-all text-left group"
                  >
                    <div className="min-w-0 pr-2">
                      <strong className="block text-xs font-bold text-slate-200 group-hover:text-accent truncate">
                        {item.title}
                      </strong>
                      <span className="text-[10px] text-slate-400 truncate block">{item.description}</span>
                    </div>
                    <Plus className="size-3.5 text-accent shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* 5. SUPERFICIES GLASS (PREVIEW) */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300">
                  🪟 Superficies Glass
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('surfaces')}
                  className="text-[11px] font-medium text-slate-400 hover:text-brand-cyan flex items-center gap-0.5 transition-colors"
                >
                  <span>Ver todo ({surfacePresets.length})</span>
                  <ChevronRight className="size-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {surfacePresets.slice(0, 2).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleInsertPreset(item)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                      item.defaultProps.variant === 'amber'
                        ? 'border-amber-500/30 bg-amber-500/10 hover:border-amber-400'
                        : 'border-teal-500/30 bg-teal-950/40 hover:border-teal-400'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-200">{item.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">+ Añadir</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
