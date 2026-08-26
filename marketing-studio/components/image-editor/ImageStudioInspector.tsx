import React, { useState } from 'react';
import {
  Sliders,
  Type,
  Maximize2,
  Ungroup,
  Sparkles,
  Sun,
  Moon,
  Crop,
  Shield,
  Smartphone,
  Circle,
  Square as SquareIcon,
  FlipHorizontal,
  FlipVertical,
  Paintbrush,
  Eye,
  BoxSelect,
  Shapes,
  UserCheck,
  Award,
  Layers,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  FolderHeart,
  BookmarkCheck,
  Check,
  Palette,
  Lock,
  Unlock,
} from 'lucide-react';
import { ModuleContextPanel } from '../../../components/backoffice-shell/ModuleContextPanel';
import {
  ImageLayer,
  CanvasBackground,
  ImageProject,
  ImageFormatPreset,
  ImageStyleVariantId,
} from '../../types/imageStudio';
import { ImageCanvasFormatsModal } from './modals/ImageCanvasFormatsModal';
import { SmartCanvasComposerModal } from './modals/SmartCanvasComposerModal';
import { SmartComposerOptions } from '../../utils/smartCanvasComposer';
import { correctSpanishText } from '../../utils/spellingCorrector';
import { stripTextFormatting } from '../../utils/textFormatter';
import { EditorPanelSection } from './EditorPanelSection';
import { getBlockCatalogItem, BlockEditableProp } from '../../data/blockCatalog';
import { InlineTextControls } from './InlineEditableText';
import { useActiveInlineEditor, useInlineTextFormatting } from './InlineEditorContext';
import { htmlToPlainText, isTiptapHtml, normalizeTiptapHtml } from '../../utils/tiptapHtml';

interface NumberInputProps {
  value?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  onChange: (val: number | undefined) => void;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  min = 0,
  max = 9999,
  placeholder = 'Auto',
  className = '',
  onChange,
}) => {
  const [textVal, setTextVal] = useState<string>(value !== undefined ? String(value) : '');

  React.useEffect(() => {
    setTextVal(value !== undefined ? String(value) : '');
  }, [value]);

  const handleBlur = () => {
    if (textVal.trim() === '') {
      onChange(undefined);
      return;
    }
    const num = parseInt(textVal, 10);
    if (!isNaN(num)) {
      const clamped = Math.max(min, Math.min(max, num));
      setTextVal(String(clamped));
      onChange(clamped);
    } else {
      setTextVal(value !== undefined ? String(value) : '');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={textVal}
      placeholder={placeholder}
      onChange={(e) => {
        const raw = e.target.value;
        setTextVal(raw);
        if (raw.trim() !== '') {
          const parsed = parseInt(raw, 10);
          if (!isNaN(parsed)) {
            onChange(parsed);
          }
        }
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
};

interface HexColorPickerFieldProps {
  label: string;
  value?: string;
  allowTransparent?: boolean;
  onChange: (hex: string) => void;
}

const HexColorPickerField: React.FC<HexColorPickerFieldProps> = ({
  label,
  value = '#FFFFFF',
  allowTransparent = true,
  onChange,
}) => {
  const [localHex, setLocalHex] = useState(value);

  React.useEffect(() => {
    setLocalHex(value);
  }, [value]);

  const safeHexForInput =
    value.startsWith('#') && (value.length === 7 || value.length === 4)
      ? value
      : '#005F73';

  const brandSwatches = [
    { label: 'Ocean Teal', hex: '#005F73' },
    { label: 'Midnight Blue', hex: '#001219' },
    { label: 'Amber Gold', hex: '#EE9B00' },
    { label: 'Mint Green', hex: '#94D2BD' },
    { label: 'Clean White', hex: '#FFFFFF' },
    { label: 'Coral Red', hex: '#F43F5E' },
    { label: 'Slate Muted', hex: '#94A3B8' },
    ...(allowTransparent ? [{ label: 'Transparente', hex: 'transparent' }] : []),
  ];

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value;
    setLocalHex(raw);
    if (!raw.startsWith('#') && raw !== 'transparent') {
      raw = '#' + raw;
    }
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(raw) || raw === 'transparent') {
      onChange(raw);
    }
  };

  const handleBlur = () => {
    let clean = localHex.trim();
    if (!clean.startsWith('#') && clean !== 'transparent') {
      clean = '#' + clean;
    }
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(clean) || clean === 'transparent') {
      setLocalHex(clean.toUpperCase());
      onChange(clean);
    } else {
      setLocalHex(value);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </label>
        <span className="font-mono text-[10px] text-brand-cyan uppercase">
          {value === 'transparent' ? 'Transparente' : value}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative size-7 rounded-lg border border-slate-700 overflow-hidden shrink-0 shadow-xs cursor-pointer hover:border-brand-cyan transition-colors">
          <input
            type="color"
            value={safeHexForInput}
            onChange={(e) => {
              setLocalHex(e.target.value.toUpperCase());
              onChange(e.target.value);
            }}
            className="absolute -top-2 -left-2 w-12 h-12 cursor-pointer border-0 p-0"
          />
        </div>

        <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 focus-within:border-brand-cyan rounded-xl px-2 py-1">
          <span className="text-[11px] font-mono text-slate-500 mr-1 select-none">#</span>
          <input
            type="text"
            value={localHex.replace(/^#/, '')}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder="005F73"
            maxLength={7}
            className="w-full bg-transparent font-mono text-xs text-white uppercase focus:outline-none placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
        {brandSwatches.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            title={swatch.label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              setLocalHex(swatch.hex.toUpperCase());
              onChange(swatch.hex);
            }}
            className={`size-5 rounded-md border transition-transform shrink-0 ${
              value.toLowerCase() === swatch.hex.toLowerCase()
                ? 'border-brand-cyan ring-2 ring-brand-cyan/40 scale-110'
                : 'border-slate-700 hover:scale-110'
            }`}
            style={{
              backgroundColor: swatch.hex === 'transparent' ? '#1E293B' : swatch.hex,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const CatalogBlockPropsEditor: React.FC<{
  layer: ImageLayer;
  onUpdate: (patch: Record<string, unknown>) => void;
}> = ({ layer, onUpdate }) => {
  const definition = layer.blockType ? getBlockCatalogItem(layer.blockType) : undefined;
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  React.useEffect(() => setDrafts({}), [layer.id]);
  if (!definition?.editableProps?.length) return null;

  const props = layer.props as Record<string, unknown>;
  const collectionKeys = new Set(['items', 'plans', 'features', 'inclusions', 'exclusions', 'providers', 'badges', 'highlights']);
  const formatValue = (control: BlockEditableProp) => {
    const value = props[control.key];
    if (Array.isArray(value) || (value && typeof value === 'object')) return JSON.stringify(value, null, 2);
    return value === undefined ? '' : String(value);
  };
  const commitValue = (control: BlockEditableProp, raw: string) => {
    if (control.type === 'number') {
      const parsed = Number(raw);
      if (Number.isFinite(parsed)) onUpdate({ [control.key]: Math.max(control.min ?? -Infinity, Math.min(control.max ?? Infinity, parsed)) });
      return;
    }
    if (control.type === 'textarea' && collectionKeys.has(control.key)) {
      try {
        onUpdate({ [control.key]: JSON.parse(raw) });
      } catch {
        onUpdate({ [control.key]: raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean) });
      }
      return;
    }
    onUpdate({ [control.key]: raw });
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-brand-cyan">
        <Sliders className="size-3.5" />
        <span>Contenido del bloque</span>
      </div>
      {definition.editableProps.map((control) => (
        <div key={control.key}>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">{control.label}</label>
          {control.type === 'select' ? (
            <div className="flex flex-wrap gap-1.5">
              {control.options?.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onUpdate({ [control.key]: option.value })}
                  className={`rounded-lg border px-2 py-1 text-[10px] font-bold ${
                    String(props[control.key] ?? '') === option.value
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : control.type === 'textarea' ? (
            <textarea
              value={drafts[control.key] ?? formatValue(control)}
              placeholder={control.placeholder}
              rows={Array.isArray(props[control.key]) || (props[control.key] && typeof props[control.key] === 'object') ? 4 : 3}
              onChange={(event) => {
                setDrafts((current) => ({ ...current, [control.key]: event.target.value }));
                if (!collectionKeys.has(control.key)) commitValue(control, event.target.value);
              }}
              onBlur={() => {
                if (collectionKeys.has(control.key)) {
                  commitValue(control, drafts[control.key] ?? formatValue(control));
                  setDrafts((current) => {
                    const next = { ...current };
                    delete next[control.key];
                    return next;
                  });
                }
              }}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs leading-relaxed text-white focus:border-brand-cyan focus:outline-none"
            />
          ) : (
            <input
              type={control.type === 'number' ? 'number' : 'text'}
              value={formatValue(control)}
              min={control.min}
              max={control.max}
              placeholder={control.placeholder}
              onChange={(event) => commitValue(control, event.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export interface ImageStudioInspectorProps {
  project: ImageProject;
  selectedLayer: ImageLayer | null;
  onUpdateLayerProps: (id: string, props: Record<string, unknown>) => void;
  onReplaceLayerContent?: (id: string, replacement: { text?: string; imageUrl?: string }) => void;
  onApplyStyleVariant?: (variant: ImageStyleVariantId) => void;
  onToggleLayerLock?: (id: string) => void;
  onUpdateLayerScale?: (id: string, scale: number) => void;
  onUpdateLayerWidth?: (id: string, width?: number) => void;
  onUpdateLayerHeight?: (id: string, height?: number) => void;
  onUpdateLayerRotation?: (id: string, rotation: number) => void;
  onUpdateLayerPosition?: (id: string, position: { x: number; y: number }) => void;
  onUpdateLayerFilter?: (id: string, filter: ImageLayer['filter']) => void;
  onUpdateLayerAdjustments?: (id: string, adjustments: { brightness?: number; contrast?: number; blur?: number }) => void;
  onUpdateLayerClipShape?: (id: string, clipShape: ImageLayer['clipShape']) => void;
  onToggleFlipHorizontal?: (id: string) => void;
  onToggleFlipVertical?: (id: string) => void;
  onFitToActiveSlide?: (id: string, slideIndex: number) => void;
  onResetAdjustments?: (id: string) => void;
  activeSlideIndex?: number;
  onUpdateLayerOpacity?: (id: string, opacity: number) => void;
  onUpdateLayerShadowPreset?: (id: string, preset: ImageLayer['shadowPreset']) => void;
  onUpdateLayerBorder?: (id: string, border: { borderWidth?: number; borderColor?: string; borderRadius?: number }) => void;
  onCopyStyle?: (id: string) => void;
  onPasteStyle?: (id: string) => void;
  onFitToCanvas?: (id: string) => void;
  onUngroupLayer?: (id: string) => void;
  onSaveToMyDesigns?: (id: string, customTitle?: string) => void;
  onSetPreset?: (preset: ImageFormatPreset) => void;
  onComposeSmartCanvas?: (options: SmartComposerOptions) => void;
  onClearCanvas?: () => void;
  onUpdateBackground: (patch: Partial<CanvasBackground>) => void;
  onClose?: () => void;
}

export const ImageStudioInspector: React.FC<ImageStudioInspectorProps> = ({
  project,
  selectedLayer,
  onUpdateLayerProps,
  onReplaceLayerContent,
  onApplyStyleVariant,
  onToggleLayerLock,
  onUpdateLayerScale,
  onUpdateLayerWidth,
  onUpdateLayerHeight,
  onUpdateLayerRotation,
  onUpdateLayerPosition,
  onUpdateLayerFilter,
  onUpdateLayerAdjustments,
  onUpdateLayerClipShape,
  onToggleFlipHorizontal,
  onToggleFlipVertical,
  onFitToActiveSlide,
  onResetAdjustments,
  activeSlideIndex = 0,
  onUpdateLayerOpacity,
  onUpdateLayerShadowPreset,
  onUpdateLayerBorder,
  onCopyStyle,
  onPasteStyle,
  onFitToCanvas,
  onUngroupLayer,
  onSaveToMyDesigns,
  onSetPreset,
  onComposeSmartCanvas,
  onClearCanvas,
  onUpdateBackground,
  onClose,
}) => {
  const activeInlineEditor = useActiveInlineEditor();
  const formatting = useInlineTextFormatting();
  const avatarOptions = [
    { name: 'Sofía', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop' },
    { name: 'Elena', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=256&auto=format&fit=crop' },
    { name: 'Carlos', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop' },
  ];

  const [isFormatsModalOpen, setIsFormatsModalOpen] = useState(false);
  const [isComposerModalOpen, setIsComposerModalOpen] = useState(false);
  const [isSavedToDesigns, setIsSavedToDesigns] = useState(false);
  const [gradientTheme, setGradientTheme] = useState<'light' | 'dark'>('light');
  const [spellingFeedback, setSpellingFeedback] = useState<string | null>(null);
  const [replacementImageUrl, setReplacementImageUrl] = useState('');

  React.useEffect(() => {
    setReplacementImageUrl(
      selectedLayer && (selectedLayer.type === 'image' || selectedLayer.props.imageUrl || selectedLayer.src)
        ? String(selectedLayer.props.imageUrl ?? selectedLayer.src ?? '')
        : ''
    );
  }, [
    selectedLayer?.id,
    selectedLayer?.type,
    selectedLayer?.props.imageUrl,
    selectedLayer?.src,
  ]);

  const currentPreset = project?.preset ?? {
    id: 'instagram-portrait',
    name: 'Post de Instagram (4:5)',
    width: 1080,
    height: 1350,
    aspectRatio: '4:5',
    category: 'instagram',
    description: '',
    iconName: 'Instagram',
    recommendedFor: '',
  };

  const currentBackground = project?.background ?? {
    color: '#001219',
    gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
  };

  const lightGradients = [
    {
      name: 'Ocean Breeze (Oficial Claro)',
      gradient: 'radial-gradient(circle at 50% 15%, rgba(148, 210, 189, 0.45) 0%, rgba(240, 249, 250, 0.95) 55%, #FFFFFF 100%)',
      color: '#F0F9FA',
    },
    {
      name: 'Amber Sunrise (Cálido Trust)',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(238, 155, 0, 0.22) 0%, rgba(255, 251, 242, 0.95) 55%, #FFFFFF 100%)',
      color: '#FFFBF2',
    },
    {
      name: 'Mint Clean (Extranjería & Salud)',
      gradient: 'radial-gradient(circle at 50% 15%, rgba(148, 210, 189, 0.35) 0%, #F0FDF4 50%, #FFFFFF 100%)',
      color: '#F0FDF4',
    },
    {
      name: 'Studio Soft Gray (Editorial)',
      gradient: 'radial-gradient(circle at 50% 25%, #FFFFFF 0%, #F1F5F9 70%, #E2E8F0 100%)',
      color: '#F8FAFC',
    },
  ];

  const darkGradients = [
    {
      name: 'Ocean Mesh (Oficial Oscuro)',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 95, 115, 0.75) 0%, #001219 80%)',
      color: '#005F73',
    },
    {
      name: 'Amber Trust Mesh',
      gradient: 'radial-gradient(circle at 50% 25%, rgba(238, 155, 0, 0.45) 0%, #001219 80%)',
      color: '#EE9B00',
    },
    {
      name: 'Mint Glow Mesh',
      gradient: 'radial-gradient(circle at 50% 25%, rgba(148, 210, 189, 0.45) 0%, #001219 80%)',
      color: '#94D2BD',
    },
    {
      name: 'Midnight Deep',
      gradient: 'radial-gradient(circle at 50% 20%, rgba(0, 18, 25, 0.95) 0%, #00080C 85%)',
      color: '#001219',
    },
  ];

  // 1. ESTADO VACÍO: PROPIEDADES DEL LIENZO (CENTRO DE CONTROL CENTRALIZADO)
  if (!selectedLayer) {
    const activeGradientList = gradientTheme === 'light' ? lightGradients : darkGradients;

    return (
      <>
        <ModuleContextPanel
          label="Propiedades del Lienzo"
          width="standard"
          variant="dark"
          onClose={onClose}
        >
          <div className="space-y-4">
            {/* FORMATO ACTUAL Y BOTÓN VER MÁS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Formato del Lienzo
                </label>
                <span className="text-[10px] font-mono font-bold text-brand-cyan">
                  {currentPreset.aspectRatio}
                </span>
              </div>

              {/* TARJETA DEL FORMATO ELEGIDO ACTUAL */}
              <div
                onClick={() => setIsFormatsModalOpen(true)}
                className="flex items-center justify-between p-3 rounded-2xl border border-primary/50 bg-primary/20 text-white shadow-md cursor-pointer hover:border-brand-cyan hover:bg-primary/30 transition-all group"
                title="Hacer clic para cambiar formato"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xl">
                    {currentPreset.aspectRatio === '9:16' ? '📱' : currentPreset.aspectRatio === '4:5' ? '📸' : currentPreset.aspectRatio === '1:1' ? '🟦' : '🖥️'}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-brand-cyan transition-colors truncate">
                      {currentPreset.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currentPreset.width} × {currentPreset.height} px ({currentPreset.aspectRatio})
                    </span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-[10px] font-bold bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan px-2 py-0.5 rounded-full shrink-0">
                  <Check className="size-3" />
                  <span>Activo</span>
                </span>
              </div>

              {/* BOTÓN VER MÁS / EXPLORAR CATÁLOGO */}
              <button
                type="button"
                onClick={() => setIsFormatsModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-950/90 hover:border-brand-cyan hover:bg-slate-900 p-2.5 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-xs"
              >
                <Sliders className="size-3.5 text-brand-cyan" />
                <span>Cambiar Formato / Ver Catálogo...</span>
              </button>
            </div>

            {/* COLORES PLANOS DEL LIENZO */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <HexColorPickerField
                label="Color Sólido de Fondo"
                value={currentBackground.color || '#001219'}
                allowTransparent={false}
                onChange={(hex) => onUpdateBackground({ gradient: undefined, color: hex })}
              />
            </div>

            {/* GRADIENTES MESH OFICIALES CON SELECTOR CLARO / OSCURO */}
            <div className="space-y-2.5 pt-2 border-t border-slate-900">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Gradientes VitaBlue
                </label>

                {/* SELECTOR MODO CLARO / OSCURO */}
                <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setGradientTheme('light')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      gradientTheme === 'light'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="size-3" />
                    <span>Claro</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setGradientTheme('dark')}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all ${
                      gradientTheme === 'dark'
                        ? 'bg-primary/30 text-brand-cyan border border-brand-cyan/40 shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Moon className="size-3" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                {activeGradientList.map((g) => {
                  const isActive = currentBackground.gradient === g.gradient;
                  return (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => onUpdateBackground({ gradient: g.gradient, color: g.color })}
                      className={`flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-all text-xs font-bold ${
                        isActive
                          ? 'border-brand-cyan bg-primary/20 text-white shadow-xs'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div
                        className="size-6 rounded-lg shrink-0 border border-slate-700/60 shadow-xs"
                        style={{ background: g.gradient }}
                      />
                      <span className="truncate">{g.name}</span>
                    </button>
                  );
                })}

                {/* FONDO TRANSPARENTE */}
                <button
                  type="button"
                  onClick={() => onUpdateBackground({ gradient: undefined, color: 'transparent' })}
                  className={`flex w-full items-center gap-2.5 rounded-xl border p-2 text-left transition-all text-xs font-bold ${
                    currentBackground.color === 'transparent' && !currentBackground.gradient
                      ? 'border-brand-cyan bg-primary/20 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="size-6 rounded-lg shrink-0 border border-slate-700 bg-[linear-gradient(45deg,#1e293b_25%,transparent_25%),linear-gradient(-45deg,#1e293b_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e293b_75%),linear-gradient(-45deg,transparent_75%,#1e293b_75%)] bg-[size:8px_8px]" />
                  <span>Transparente (PNG sin fondo)</span>
                </button>
              </div>
            </div>

            {/* GENERADOR MÁGICO DE LIENZO POR OBJETIVO */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Generador Automático de Lienzo</span>
              </label>

              <button
                type="button"
                onClick={() => setIsComposerModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-accent text-slate-950 p-3 text-xs font-black shadow-md hover:brightness-110 active:scale-95 transition-all"
              >
                <Sparkles className="size-4" />
                <span>✨ Asistente Generador Mágico...</span>
              </button>
            </div>

            {/* ACCIONES RÁPIDAS DEL LIENZO */}
            <div className="space-y-2 pt-2 border-t border-slate-900">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Acciones de Lienzo
              </label>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas vaciar el lienzo en blanco? Se eliminarán todas las capas actuales.')) {
                    onClearCanvas?.();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-900/60 bg-rose-950/30 p-2.5 text-xs font-bold text-rose-300 hover:bg-rose-900/50 hover:text-white transition-all shadow-xs"
              >
                <span>Vaciar Lienzo en Blanco</span>
                <span className="text-[10px] text-rose-400/80 font-mono">({project?.layers?.length ?? 0} capas)</span>
              </button>
            </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs text-slate-400 leading-relaxed">
            💡 <strong>Tip:</strong> Haz clic en cualquier texto o tarjeta en el lienzo para editar sus propiedades específicas.
          </div>
        </div>
      </ModuleContextPanel>

      <ImageCanvasFormatsModal
        isOpen={isFormatsModalOpen}
        currentPreset={currentPreset}
        onSelectPreset={(preset) => onSetPreset?.(preset)}
        onClose={() => setIsFormatsModalOpen(false)}
      />

      <SmartCanvasComposerModal
        isOpen={isComposerModalOpen}
        currentPreset={currentPreset}
        onCompose={(options) => onComposeSmartCanvas?.(options)}
        onClose={() => setIsComposerModalOpen(false)}
      />
    </>
  );
}

  const props = selectedLayer.props as Record<string, unknown>;
  const activeEditor = activeInlineEditor?.editor;
  const activeTextStyle = activeEditor?.getAttributes('textStyle') as {
    color?: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
  } | undefined;
  const activeBlockName = activeEditor?.state.selection.$from.parent.type.name === 'heading' ? 'heading' : 'paragraph';
  const activeBlockAttributes = activeEditor && activeBlockName
    ? activeEditor.getAttributes(activeBlockName) as { textAlign?: string; lineHeight?: string }
    : undefined;
  const applyTextStyle = formatting.applyTextStyle;
  const canUngroup = ['MotionAdvisorCard', 'MotionProviderGrid', 'MotionTrustBadge', 'MotionComparisonCard', 'CustomGroup'].includes(selectedLayer.blockType ?? '');
  const textBearingBlockTypes = [
    'CustomText',
    'WhatsAppCtaButton',
    'TrustVerifiedPill',
    'TrustHighlightPill',
    'HookAlertBadge',
    'TrustBadgeTitle',
    'TrustBadgeSubtitle',
    'AdvisorTitleBadge',
    'AdvisorSubline',
    'ComparisonWrongBox',
    'ComparisonCorrectBox',
    'InsuranceProductHero',
    'InsuranceCoverageGrid',
    'InsurancePlanComparison',
    'InsuranceTrustBar',
    'InsuranceAdvisorCta',
    'MotionAdvisorCard',
    'MotionTrustBadge',
    'MotionComparisonCard',
    'MotionProviderGrid',
  ];
  const isTextType = selectedLayer.type === 'text' || textBearingBlockTypes.includes(selectedLayer.blockType ?? '') || Boolean(props.text || props.title || props.subtitle || props.description || props.badge || props.ctaText);
  const isImageType = selectedLayer.type === 'image' || Boolean(props.imageUrl || selectedLayer.src);

  const handleSaveCurrentLayer = () => {
    onSaveToMyDesigns?.(selectedLayer.id);
    setIsSavedToDesigns(true);
    setTimeout(() => setIsSavedToDesigns(false), 2500);
  };

  const handleAutoSpellcheck = () => {
    if (activeInlineEditor) {
      const currentText = htmlToPlainText(activeInlineEditor.editor.getHTML());
      const { correctedText, changesCount } = correctSpanishText(currentText);
      if (changesCount > 0) {
        activeInlineEditor.editor.commands.setContent(normalizeTiptapHtml(correctedText), { emitUpdate: false });
        activeInlineEditor.save();
        setSpellingFeedback(`✓ ${changesCount} ${changesCount === 1 ? 'corrección aplicada' : 'correcciones aplicadas'}`);
      } else {
        setSpellingFeedback('✓ Ortografía y gramática impecables');
      }
      setTimeout(() => setSpellingFeedback(null), 3000);
      return;
    }
    const currentText = String(
      props.text ??
      props.ctaText ??
      props.whatsAppText ??
      props.verifiedLabel ??
      props.highlight ??
      props.badge ??
      props.title ??
      selectedLayer.title ??
      ''
    );
    const { correctedText, changesCount } = correctSpanishText(isTiptapHtml(currentText) ? htmlToPlainText(currentText) : currentText);
    if (changesCount > 0) {
      onUpdateLayerProps(selectedLayer.id, {
        text: correctedText,
        ctaText: correctedText,
        whatsAppText: correctedText,
        verifiedLabel: correctedText,
        highlight: correctedText,
        badge: correctedText,
        title: correctedText,
        buttonText: correctedText,
      });
      setSpellingFeedback(`✓ ${changesCount} ${changesCount === 1 ? 'corrección aplicada' : 'correcciones aplicadas'}`);
    } else {
      setSpellingFeedback('✓ Ortografía y gramática impecables');
    }
    setTimeout(() => setSpellingFeedback(null), 3000);
  };

  return (
    <div data-inline-editor-inspector="true">
    <ModuleContextPanel
      label={`Bloque: ${selectedLayer.title}`}
      width="standard"
      variant="dark"
      onClose={onClose}
    >
      <div className="space-y-4">
        {/* 1. HEADER LIMPIO + Z-INDEX + GUARDAR EN MIS DISEÑOS */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2 truncate">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/20 text-brand-cyan text-xs font-bold">
              {isTextType ? <Type className="size-3.5" /> : <Sliders className="size-3.5" />}
            </span>
            <strong className="text-xs text-slate-200 truncate">{selectedLayer.title}</strong>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleLayerLock && (
              <button
                type="button"
                aria-pressed={Boolean(selectedLayer.locked)}
                onClick={() => onToggleLayerLock(selectedLayer.id)}
                className={`flex size-7 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  selectedLayer.locked
                    ? 'border-amber-500/40 bg-amber-500/15 text-amber-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
                title={selectedLayer.locked ? 'Desbloquear componente' : 'Bloquear componente'}
              >
                {selectedLayer.locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={handleSaveCurrentLayer}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold border transition-all ${
                isSavedToDesigns
                  ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-400/60 hover:text-amber-300 hover:bg-slate-800'
              }`}
              title="Guardar este elemento en Mis Diseños para reutilizarlo"
            >
              {isSavedToDesigns ? (
                <>
                  <BookmarkCheck className="size-3 text-emerald-400" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <FolderHeart className="size-3 text-amber-400" />
                  <span>Guardar</span>
                </>
              )}
            </button>
            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
              Z: {selectedLayer.zIndex}
            </span>
          </div>
        </div>

          {selectedLayer.locked && (
            <div role="status" className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[10px] leading-4 text-amber-200">
              <Lock className="mt-0.5 size-3.5 shrink-0" />
              <span>Componente protegido. Desbloquéalo para cambiar composición, contenido o estilo.</span>
            </div>
          )}

          {onApplyStyleVariant && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-2.5">
              <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <Palette className="size-3.5 text-brand-cyan" />
                Variante de color y estilo
              </span>
              <div className="grid grid-cols-4 gap-1">
                {([
                  ['ocean', 'Ocean', 'bg-primary'],
                  ['gold', 'Gold', 'bg-accent'],
                  ['mint', 'Mint', 'bg-brand-cyan'],
                  ['midnight', 'Noche', 'bg-primary-dark'],
                ] as const).map(([id, label, color]) => (
                  <button
                    key={id}
                    type="button"
                    disabled={selectedLayer.locked}
                    onClick={() => onApplyStyleVariant(id)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[9px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40 ${
                      selectedLayer.styleVariant === id
                        ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`size-3 rounded-full ${color}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* 2. BARRA DE GEOMETRÍA COMPACTA (FIGMA STYLE: 1 SOLA FILA) */}
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-2">
          <div className="grid grid-cols-5 gap-1.5 text-center font-mono text-[10px]">
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-brand-cyan"
              title="Posición X en el lienzo"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: selectedLayer.position.y })}
            >
              <span className="text-slate-500 mr-1">X</span>
              <span className="text-brand-cyan">{Math.round(selectedLayer.position.x)}%</span>
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-brand-cyan"
              title="Posición Y en el lienzo"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: selectedLayer.position.x, y: 50 })}
            >
              <span className="text-slate-500 mr-1">Y</span>
              <span className="text-brand-cyan">{Math.round(selectedLayer.position.y)}%</span>
            </div>
            <div className="flex items-center rounded bg-slate-900/90 py-0.5 px-1 border border-slate-800 focus-within:border-brand-cyan" title="Ancho en px">
              <span className="text-slate-500 mr-0.5 text-[9px]">W</span>
              <NumberInput
                value={selectedLayer.width}
                min={40}
                max={2400}
                placeholder="Auto"
                onChange={(val) => onUpdateLayerWidth?.(selectedLayer.id, val)}
                className="w-full bg-transparent text-slate-200 text-[10px] font-mono outline-none text-center p-0"
              />
            </div>
            <div className="flex items-center rounded bg-slate-900/90 py-0.5 px-1 border border-slate-800 focus-within:border-brand-cyan" title="Alto en px">
              <span className="text-slate-500 mr-0.5 text-[9px]">H</span>
              <NumberInput
                value={selectedLayer.height}
                min={20}
                max={2400}
                placeholder="Auto"
                onChange={(val) => onUpdateLayerHeight?.(selectedLayer.id, val)}
                className="w-full bg-transparent text-slate-200 text-[10px] font-mono outline-none text-center p-0"
              />
            </div>
            <div
              className="rounded bg-slate-900/90 py-1 px-1 border border-slate-800 text-slate-300 cursor-pointer hover:border-amber-400"
              title="Haz clic para rotar +90°"
              onClick={() => onUpdateLayerRotation?.(selectedLayer.id, ((selectedLayer.rotation ?? 0) + 90) % 360)}
            >
              <span className="text-slate-500 mr-1">∡</span>
              <span className="text-amber-400">{Math.round(selectedLayer.rotation ?? 0)}°</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-1.5 pt-2 mt-2 border-t border-slate-900">
            <button
              type="button"
              onClick={() => onUpdateLayerPosition?.(selectedLayer.id, { x: 50, y: 50 })}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-colors text-center"
              title="Centrar en el lienzo (50%, 50%)"
            >
              Centrar
            </button>
            <button
              type="button"
              onClick={() => onFitToCanvas?.(selectedLayer.id)}
              className="flex-1 py-1 px-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/30 text-[10px] font-bold text-brand-cyan transition-colors flex items-center justify-center gap-1"
              title="Auto-ajustar al tamaño del lienzo"
            >
              <Maximize2 className="size-3" />
              <span>Ajustar</span>
            </button>
            <button
              type="button"
              onClick={() => onUpdateLayerScale?.(selectedLayer.id, 1)}
              className="flex-1 py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white transition-colors text-center"
              title="Escala 100%"
            >
              {Math.round((selectedLayer.scale ?? 1) * 100)}%
            </button>
            {canUngroup && onUngroupLayer && (
              <button
                type="button"
                onClick={() => onUngroupLayer(selectedLayer.id)}
                className="flex-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 transition-colors flex items-center justify-center gap-1"
                title="Desagrupar en capas independientes"
              >
                <Ungroup className="size-3" />
                <span>Desagrupar</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. CONTENIDO ESPECÍFICO DEL ELEMENTO (EL PROTAGONISTA EN PRIMER PLANO) */}
        
        {/* A. FORMA GEOMÉTRICA TRADICIONAL */}
        {selectedLayer.blockType === 'GeometricShape' && (
          <div className="space-y-3 rounded-2xl border border-brand-cyan/20 bg-slate-950 p-3 shadow-xs">
            <EditorPanelSection title={<><Shapes className="size-3.5" /> Propiedades de Forma Geométrica</>} tone="cyan" />

            {/* TIPO DE FORMA */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tipo de Geometría
              </label>
              <select
                value={String(props.shapeType ?? 'rectangle')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { shapeType: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
              >
                <option value="rounded_rect">🔲 Rectángulo Redondeado</option>
                <option value="rectangle">⬛ Rectángulo / Cuadrado</option>
                <option value="circle">⚪ Círculo / Elipse</option>
                <option value="star">⭐ Estrella (5 Puntas)</option>
                <option value="triangle">🔺 Triángulo</option>
                <option value="diamond">💎 Rombo / Diamante</option>
                <option value="hexagon">⬡ Hexágono</option>
                <option value="line">➖ Línea Divisoria</option>
                <option value="arrow">➡️ Flecha Indicadora</option>
                <option value="speech_bubble">💬 Bocadillo de Diálogo</option>
                <option value="heart">❤️ Corazón</option>
              </select>
            </div>

            {/* COLOR DE RELLENO */}
            <HexColorPickerField
              label="Color de Relleno (Fill)"
              value={String(selectedLayer.fill || props.fill || '#005F73')}
              onChange={(hex) => onUpdateLayerProps(selectedLayer.id, { fill: hex })}
            />

            {/* BORDE / STROKE */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <HexColorPickerField
                  label="Color Borde"
                  value={String(selectedLayer.borderColor || props.stroke || '#94D2BD')}
                  onChange={(hex) => onUpdateLayerProps(selectedLayer.id, { stroke: hex, borderColor: hex })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Grosor Borde ({String(selectedLayer.borderWidth ?? props.strokeWidth ?? 0)}px)
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  value={Number(selectedLayer.borderWidth ?? props.strokeWidth ?? 0)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateLayerProps(selectedLayer.id, { strokeWidth: val, borderWidth: val });
                  }}
                  className="w-full accent-brand-cyan"
                />
              </div>
            </div>

            {/* RADIO DE ESQUINAS (PARA RECTÁNGULOS) */}
            {(props.shapeType === 'rounded_rect' || props.shapeType === 'rectangle' || !props.shapeType) && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Radio de Esquinas ({String(selectedLayer.borderRadius ?? props.borderRadius ?? 16)}px)
                </label>
                <input
                  type="range"
                  min={0}
                  max={60}
                  value={Number(selectedLayer.borderRadius ?? props.borderRadius ?? 16)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    onUpdateLayerProps(selectedLayer.id, { borderRadius: val });
                  }}
                  className="w-full accent-brand-cyan"
                />
              </div>
            )}
          </div>
        )}

        {/* B. ILUSTRACIÓN VECTORIAL WEB */}
        {selectedLayer.blockType === 'WebIllustration' && (
          <div className="space-y-3 rounded-2xl border border-brand-cyan/20 bg-slate-950 p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
                <Palette className="size-3.5" />
                <span>Ilustración Web Vectorial</span>
              </span>
            </div>
            <InlineTextControls compact />

            {/* SELECTOR DE ILUSTRACIÓN */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Ilustración Seleccionada
              </label>
              <select
                value={String(props.illustrationId ?? 'medical-attention')}
                onChange={(e) => {
                  onUpdateLayerProps(selectedLayer.id, { illustrationId: e.target.value });
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
              >
                <optgroup label="Salud & Visados">
                  <option value="medical-attention">🩺 Atención Médica & Reembolso</option>
                  <option value="student">🎓 Estudiantes & Visados</option>
                  <option value="prevention">🩺 Prevención & Chequeos</option>
                  <option value="dental">🦷 Salud Dental</option>
                  <option value="health-consultation">📱 Consulta Médica Online</option>
                  <option value="mental-health">🧠 Salud Mental & Bienestar</option>
                </optgroup>
                <optgroup label="Viajes & Extranjería">
                  <option value="passport">🛂 Pasaporte & Visado</option>
                  <option value="assistance">🌍 Asistencia en Viaje</option>
                  <option value="destination">📍 Destino España</option>
                  <option value="boarding-pass">🎫 Tarjeta de Embarque</option>
                  <option value="adventure">⛰️ Aventura & Deportes</option>
                </optgroup>
                <optgroup label="Finanzas & Pólizas">
                  <option value="piggy-bank">🐷 Hucha & Ahorro</option>
                  <option value="policy">📄 Póliza & Contrato</option>
                  <option value="vault">🔒 Caja Fuerte & Seguridad</option>
                  <option value="wallet">👛 Billetera & Reembolsos</option>
                  <option value="life">🌱 Seguro de Vida</option>
                  <option value="market">📈 Mercado & Comparativa</option>
                </optgroup>
                <optgroup label="Hogar & Familia">
                  <option value="family">👨‍👩‍👧 Familia Protegida</option>
                  <option value="home-cover">🏠 Cobertura de Hogar</option>
                  <option value="pet">🐾 Seguro para Mascotas</option>
                  <option value="moving">📦 Mudanza & Traslados</option>
                  <option value="smart-home">💡 Hogar Conectado</option>
                </optgroup>
                <optgroup label="Confianza & Alianzas">
                  <option value="deal">🤝 Aprobación de Visado</option>
                  <option value="accompaniment">👥 Acompañamiento Experto</option>
                  <option value="support">🎧 Soporte 24/7</option>
                  <option value="target">🎯 Objetivo & Metas</option>
                  <option value="coverage">🛡️ Cobertura Completa</option>
                  <option value="partners">🏢 Aseguradoras Aliadas</option>
                </optgroup>
                <optgroup label="Auto & Movilidad">
                  <option value="car">🚗 Seguro de Coche</option>
                  <option value="bike">🚲 Bicicleta & Movilidad</option>
                  <option value="accident">⚠️ Asistencia en Carretera</option>
                  <option value="tow-truck">🚛 Grúa</option>
                  <option value="keys">🔑 Llaves de Coche</option>
                </optgroup>
                <optgroup label="Siniestros">
                  <option value="theft">🚨 Protección contra Robo</option>
                  <option value="water-leak">💧 Fugas de Agua</option>
                  <option value="broken-glass">🔨 Rotura de Cristales</option>
                  <option value="storm">⛈️ Fenómenos Meteorológicos</option>
                </optgroup>
              </select>
            </div>

            {/* COLOR PRINCIPAL */}
            <HexColorPickerField
              label="Color Principal de la Ilustración"
              value={String(props.colorPrimary || selectedLayer.fill || '#005F73')}
              allowTransparent={false}
              onChange={(hex) => onUpdateLayerProps(selectedLayer.id, { colorPrimary: hex, fill: hex })}
            />
          </div>
        )}

        {/* 1.5. CONTROL DE PORTADA / SELLO DE DESTACADOS INSTAGRAM */}
        {selectedLayer.blockType === 'InstagramHighlightBadge' && (
          <div className="space-y-3 rounded-2xl border border-amber-500/30 bg-slate-950 p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-300 font-black">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>Destacado de Instagram</span>
              </span>
              <span className="text-[10px] font-mono text-amber-200/80 font-bold">
                {String(props.iconKey ?? 'approved').toUpperCase()}
              </span>
            </div>

            {/* SELECTOR DE ICONO */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Icono del Destacado
              </label>
              <select
                value={String(props.iconKey ?? 'approved')}
                onChange={(e) => {
                  const key = e.target.value;
                  const defaultLabelMap: Record<string, string> = {
                    approved: 'Aprobados',
                    visa: 'Visados',
                    process: 'Paso a Paso',
                    faq: 'Dudas & FAQ',
                    contact: 'Contacto',
                  };
                  onUpdateLayerProps(selectedLayer.id, {
                    iconKey: key,
                    label: defaultLabelMap[key] || 'Destacado',
                  });
                }}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-amber-400 focus:outline-none transition-colors"
              >
                <option value="approved">🎓 Aprobados (Birrete + Check)</option>
                <option value="visa">🛡️ Visados (Pasaporte + Cruz Médica)</option>
                <option value="process">⚡ Paso a Paso (Ruta de 3 Nodos)</option>
                <option value="faq">❓ Dudas & FAQs (Bocadillo + ?)</option>
                <option value="contact">📱 Contacto (Smartphone + Chat WhatsApp)</option>
              </select>
            </div>

            {/* TEXTO DE ETIQUETA */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Etiqueta / Nombre
                </label>
                <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={props.showLabel !== false}
                    onChange={(e) => onUpdateLayerProps(selectedLayer.id, { showLabel: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0"
                  />
                  <span>Mostrar texto</span>
                </label>
              </div>
              <input
                type="text"
                value={String(props.label ?? 'Aprobados')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { label: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-amber-400 focus:outline-none transition-colors"
                placeholder="Ej: Aprobados"
              />
            </div>

            {/* COLOR DEL ARO NEÓN */}
            <HexColorPickerField
              label="Color del Aro Neón (Ring Glow)"
              value={String(props.ringColor ?? '#EE9B00')}
              allowTransparent={false}
              onChange={(hex) =>
                onUpdateLayerProps(selectedLayer.id, {
                  ringColor: hex,
                  glowColor: `${hex}80`,
                })
              }
            />

            {/* COLOR DE ACENTO DE DETALLES */}
            <HexColorPickerField
              label="Color de Acento (Checks / Puntos)"
              value={String(props.accentColor ?? props.ringColor ?? '#EE9B00')}
              allowTransparent={false}
              onChange={(hex) => onUpdateLayerProps(selectedLayer.id, { accentColor: hex })}
            />

            {/* MODO PORTADA COMPLETA O SELLO */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-slate-300">Modo Portada Completa</span>
              <button
                type="button"
                onClick={() =>
                  onUpdateLayerProps(selectedLayer.id, {
                    isFullCover: !props.isFullCover,
                  })
                }
                className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition-all ${
                  props.isFullCover
                    ? 'bg-amber-500 text-primary-dark shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {props.isFullCover ? '✓ Portada 1080p' : 'Sello Aislado'}
              </button>
            </div>
          </div>
        )}

        {/* 2. TEXTO Y TIPOGRAFÍA (PANEL UNIVERSAL PARA TODOS LOS TEXTOS, BOTONES Y BADGES) */}
        {isTextType && (
          <div className="space-y-3 rounded-2xl border border-brand-cyan/20 bg-slate-950 p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
                <Type className="size-3.5" />
                <span>Texto y Tipografía</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                {selectedLayer.fontSize ?? 24}px
              </span>
            </div>

            {/* CONTENIDO DEL TEXTO CON ASISTENTE DE ORTOGRAFÍA */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Contenido
                </label>
                <button
                  type="button"
                  onClick={handleAutoSpellcheck}
                  className="flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg hover:bg-amber-500/20 shadow-xs"
                  title="Corregir tildes, signos ¿? y mayúsculas según la RAE y el sector asegurador"
                >
                  <Sparkles className="size-3 text-amber-400" />
                  <span>Corregir Ortografía (RAE)</span>
                </button>
              </div>

              {spellingFeedback && (
                <div className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-1 rounded-lg animate-fadeIn flex items-center gap-1.5">
                  <Check className="size-3" />
                  <span>{spellingFeedback}</span>
                </div>
              )}

              <textarea
                value={activeEditor
                  ? activeEditor.getText({ blockSeparator: '\n' })
                  : stripTextFormatting(String(props.text ?? props.ctaText ?? props.whatsAppText ?? props.verifiedLabel ?? props.highlight ?? props.badge ?? props.title ?? selectedLayer.title ?? ''))}
                onChange={(e) => {
                  const val = e.target.value;
                  if (onReplaceLayerContent) {
                    onReplaceLayerContent(selectedLayer.id, { text: val });
                  } else {
                    onUpdateLayerProps(selectedLayer.id, {
                      text: val,
                      ctaText: val,
                      whatsAppText: val,
                      verifiedLabel: val,
                      highlight: val,
                      badge: val,
                      title: val,
                      buttonText: val,
                    });
                  }
                }}
                readOnly={Boolean(activeEditor)}
                disabled={selectedLayer.locked}
                rows={2}
                placeholder={activeEditor ? 'Edita el texto directamente en el lienzo…' : 'Escribe el texto aquí...'}
                spellCheck={true}
                lang="es"
                className={`w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white placeholder:text-slate-600 focus:border-brand-cyan focus:outline-none leading-relaxed ${activeEditor ? 'cursor-not-allowed opacity-70' : ''}`}
              />
              {activeEditor && (
                <div className="mt-1 rounded-lg border border-brand-cyan/30 bg-primary/10 px-2 py-1 text-[10px] font-medium text-brand-cyan">
                  Edita y selecciona texto en el lienzo para aplicar formato sin perder la selección.
                </div>
              )}
            </div>

            {/* FUENTE Y PESO */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Fuente
                </label>
                <select
                  value={activeEditor ? String(activeTextStyle?.fontFamily ?? '') : (selectedLayer.fontFamily ?? 'Poppins, sans-serif')}
                  onChange={(e) => {
                    if (activeInlineEditor) {
                      applyTextStyle({ fontFamily: e.target.value || null });
                      return;
                    }
                    onUpdateLayerProps(selectedLayer.id, { fontFamily: e.target.value });
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="">Fuente (mixta)</option>
                  <option value="Poppins, sans-serif">Poppins (Display)</option>
                  <option value="Inter, sans-serif">Inter (Sans)</option>
                  <option value="Montserrat, sans-serif">Montserrat (Bold)</option>
                  <option value="Oswald, sans-serif">Oswald (Condensada)</option>
                  <option value="Playfair Display, serif">Playfair (Serif)</option>
                  <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                  <option value="Outfit, sans-serif">Outfit (Geométrica)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Grosor
                </label>
                <select
                  value={activeEditor ? String(activeTextStyle?.fontWeight ?? '') : (selectedLayer.fontWeight ?? '700')}
                  onChange={(e) => {
                    if (activeInlineEditor) {
                      applyTextStyle({ fontWeight: e.target.value || null });
                      return;
                    }
                    onUpdateLayerProps(selectedLayer.id, { fontWeight: e.target.value });
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-2 py-1.5 text-xs text-white focus:border-brand-cyan focus:outline-none"
                >
                  <option value="">Grosor (mixto)</option>
                  <option value="400">Regular (400)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">ExtraBold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>
            </div>

            {/* TAMAÑO Y ALINEACIÓN */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>Tamaño</span>
                  <div className="flex items-center gap-1">
                    <NumberInput
                      min={10}
                      max={200}
                      value={activeEditor
                        ? (parseInt(String(activeTextStyle?.fontSize ?? '').replace('px', ''), 10) || undefined)
                        : (selectedLayer.fontSize ?? 24)}
                      placeholder={activeEditor ? 'Mixto' : '24'}
                      onChange={(val) => {
                        if (activeInlineEditor) {
                          const fontSize = val === undefined ? null : `${val}px`;
                          applyTextStyle({ fontSize });
                          return;
                        }
                        onUpdateLayerProps(selectedLayer.id, { fontSize: val ?? 24 });
                      }}
                      className="w-11 bg-slate-900 border border-slate-700 rounded text-center text-[10px] font-mono text-brand-cyan px-1 py-0.5 focus:outline-none focus:border-brand-cyan"
                    />
                    <span className="text-[9px] text-slate-500">px</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={12}
                  max={120}
                  step={1}
                  value={activeEditor
                    ? (parseInt(String(activeTextStyle?.fontSize ?? '').replace('px', ''), 10) || 24)
                    : (selectedLayer.fontSize ?? 24)}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (activeInlineEditor) {
                      applyTextStyle({ fontSize: `${value}px` });
                      return;
                    }
                    onUpdateLayerProps(selectedLayer.id, { fontSize: value });
                  }}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Alineación & Formato</span>
                <div className="flex items-center gap-1">
                  {[
                    { id: 'left', icon: AlignLeft, title: 'Alinear a la izquierda' },
                    { id: 'center', icon: AlignCenter, title: 'Centrar' },
                    { id: 'right', icon: AlignRight, title: 'Alinear a la derecha' },
                  ].map((al) => {
                    const Icon = al.icon;
                    return (
                      <button
                        key={al.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (activeInlineEditor) {
                            formatting.updateBlockAttributes({ textAlign: al.id });
                            return;
                          }
                          onUpdateLayerProps(selectedLayer.id, { textAlign: al.id, align: al.id });
                        }}
                        title={al.title}
                        className={`flex-1 h-7 items-center justify-center rounded-lg border text-xs transition-colors flex ${
                          (activeEditor ? activeBlockAttributes?.textAlign : (selectedLayer.align ?? String(props.textAlign ?? 'center'))) === al.id
                            ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="size-3.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ESTILOS RÁPIDOS: LOS COMANDOS SIEMPRE USAN LA SELECCIÓN TIPTAP ACTIVA */}
            <div className="pt-1.5 border-t border-slate-900">
              <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1.5">
                Estilo de texto
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (activeInlineEditor) {
                      formatting.toggleMark('bold');
                      return;
                    }
                    const currentWeight = selectedLayer.fontWeight ?? '700';
                    const nextWeight = currentWeight === '700' || currentWeight === '800' || currentWeight === '900' ? '400' : '700';
                    onUpdateLayerProps(selectedLayer.id, { fontWeight: nextWeight });
                  }}
                  className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[11px] font-bold transition-all ${
                    (activeEditor ? activeEditor.isActive('bold') : ((selectedLayer.fontWeight ?? '700') === '700' || (selectedLayer.fontWeight ?? '700') === '800' || (selectedLayer.fontWeight ?? '700') === '900'))
                      ? 'border-amber-400/50 bg-amber-500/20 text-amber-300 shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                  title="Aplicar negrita a la selección activa"
                >
                  <Bold className="size-3.5" />
                  <span>Negrita</span>
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (activeInlineEditor) {
                      formatting.toggleMark('italic');
                      return;
                    }
                    onUpdateLayerProps(selectedLayer.id, {
                      fontStyle: selectedLayer.fontStyle === 'italic' ? 'normal' : 'italic',
                    });
                  }}
                  className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[11px] font-bold transition-all ${activeEditor?.isActive('italic') ? 'border-brand-cyan bg-primary/30 text-brand-cyan' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800'}`}
                  title="Aplicar cursiva a la selección activa"
                >
                  <Italic className="size-3.5" />
                  <span>Cursiva</span>
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (activeInlineEditor) {
                      formatting.toggleMark('underline');
                      return;
                    }
                    const current = String(props.textDecoration ?? '');
                    onUpdateLayerProps(selectedLayer.id, {
                      textDecoration: current.includes('underline')
                        ? current.replace(/\s*underline/, '').trim() || 'none'
                        : `${current === 'none' ? '' : current} underline`.trim(),
                    });
                  }}
                  className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[11px] font-bold transition-all ${activeEditor?.isActive('underline') ? 'border-brand-cyan bg-primary/30 text-brand-cyan' : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800'}`}
                  title="Aplicar subrayado a la selección activa"
                >
                  <UnderlineIcon className="size-3.5" />
                  <span>Subrayar</span>
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    if (activeInlineEditor) {
                      formatting.toggleMark('strike');
                      return;
                    }
                    const current = String(props.textDecoration ?? '');
                    onUpdateLayerProps(selectedLayer.id, {
                      textDecoration: current.includes('line-through')
                        ? current.replace(/\s*line-through/, '').trim() || 'none'
                        : `${current === 'none' ? '' : current} line-through`.trim(),
                    });
                  }}
                  className={`flex h-8 items-center justify-center gap-1 rounded-xl border text-[11px] font-bold transition-all ${activeEditor?.isActive('strike') ? 'border-rose-400 bg-rose-500/20 text-rose-300' : 'border-slate-800 bg-slate-900 text-white hover:border-rose-400 hover:text-rose-300 hover:bg-slate-800'}`}
                  title="Aplicar tachado a la selección activa"
                >
                  <Strikethrough className="size-3.5" />
                  <span>Tachar</span>
                </button>
              </div>
            </div>

            {/* DISPOSICIÓN: 1 SOLA LÍNEA VS MULTILÍNEA */}
            <div className="pt-2 border-t border-slate-900 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Disposición
                </label>
                <span className="text-[9px] font-mono text-brand-cyan">
                  {props.nowrap || props.singleLine ? '1 Sola Línea' : 'Multilínea'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const textContent = String(props.text ?? selectedLayer.title ?? '');
                    const currentFont = selectedLayer.fontSize ?? 36;
                    const estimatedWidth = Math.max(320, Math.min(2200, Math.round(textContent.length * currentFont * 0.65 + 60)));
                    onUpdateLayerProps(selectedLayer.id, { nowrap: true, singleLine: true });
                    if (onUpdateLayerWidth) {
                      onUpdateLayerWidth(selectedLayer.id, estimatedWidth);
                    }
                  }}
                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    props.nowrap || props.singleLine
                      ? 'border-brand-cyan bg-primary/30 text-brand-cyan shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  title="Mantener todo el texto en una sola línea horizontal sin cortes"
                >
                  <span>📏 1 Sola Línea</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateLayerProps(selectedLayer.id, { nowrap: false, singleLine: false })}
                  className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                    !props.nowrap && !props.singleLine
                      ? 'border-brand-cyan bg-primary/30 text-brand-cyan shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  title="Permitir salto de línea automático"
                >
                  <span>📄 Multilínea</span>
                </button>
              </div>
            </div>

            {/* COLOR DE LETRA PRINCIPAL */}
            <div className="pt-2 border-t border-slate-900">
              <HexColorPickerField
                label={activeEditor ? 'Color de la selección' : 'Color de Letra'}
                value={activeEditor
                  ? String(activeTextStyle?.color ?? '#FFFFFF')
                  : String(selectedLayer.fill ?? props.color ?? props.textColor ?? '#FFFFFF')}
                allowTransparent={false}
                onChange={(hex) => {
                  if (activeInlineEditor) {
                    formatting.setColor(hex);
                    return;
                  }
                  onUpdateLayerProps(selectedLayer.id, { fill: hex, color: hex, textColor: hex });
                }}
              />
            </div>

            {/* RESALTADO TIPTAP: NO SE CREA ESTADO PARA PALABRAS LEGACY */}
            {activeEditor ? (
              <HexColorPickerField
                label="Resaltado de la selección"
                value={String(activeEditor.getAttributes('highlight').color ?? '#fff3a3')}
                allowTransparent={false}
                onChange={(hex) => {
                  if (activeInlineEditor) formatting.setHighlight(hex);
                }}
              />
            ) : (
              <p className="border-t border-slate-900 pt-2 text-[10px] text-slate-500">
                El resaltado parcial está disponible al editar y seleccionar texto en el lienzo.
              </p>
            )}

            {/* ESPACIADO & INTERLINEADO */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900">
              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>Espaciado</span>
                  <span className="font-mono text-slate-300">{selectedLayer.letterSpacing ?? 0}px</span>
                </div>
                <input
                  type="range"
                  min={-2}
                  max={8}
                  step={0.5}
                  value={selectedLayer.letterSpacing ?? 0}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { letterSpacing: parseFloat(e.target.value) })}
                  className="w-full accent-teal-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                  <span>Interlineado</span>
                  <span className="font-mono text-slate-300">{activeEditor ? (activeBlockAttributes?.lineHeight ?? 'Mixto') : (selectedLayer.lineHeight ?? 1.25)}</span>
                </div>
                <input
                  type="range"
                  min={0.9}
                  max={2.0}
                  step={0.05}
                  value={activeEditor ? (parseFloat(String(activeBlockAttributes?.lineHeight ?? '')) || 1.25) : (selectedLayer.lineHeight ?? 1.25)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (activeInlineEditor) {
                      formatting.updateBlockAttributes({ lineHeight: String(value) });
                      return;
                    }
                    onUpdateLayerProps(selectedLayer.id, { lineHeight: value });
                  }}
                  className="w-full accent-teal-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. CAJA, FONDO Y FORMA (CONTENEDOR UNIFICADO) */}
        {isTextType && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-accent font-black">
                <BoxSelect className="size-3.5" />
                <span>Fondo y Caja del Elemento</span>
              </span>
            </div>

            {/* COLOR DE FONDO DE LA CAJA / BOTÓN */}
            <HexColorPickerField
              label="Color de Fondo"
              value={String(selectedLayer.boxColor ?? props.primaryColor ?? props.backgroundColor ?? (selectedLayer.textEffect === 'box' ? '#EE9B00' : 'transparent'))}
              allowTransparent={true}
              onChange={(hex) => {
                onUpdateLayerProps(selectedLayer.id, {
                  boxColor: hex,
                  primaryColor: hex,
                  backgroundColor: hex,
                  textEffect: hex === 'transparent' ? 'none' : 'box',
                });
              }}
            />

            {/* RADIO DE ESQUINA */}
            <div className="flex items-center justify-between gap-1 text-[10px] pt-1 border-t border-slate-900">
              <span className="text-slate-400 font-bold uppercase shrink-0">Esquinas</span>
              <div className="grid grid-cols-5 gap-1 flex-1">
                {[0, 8, 16, 24, 9999].map((rad) => {
                  const currentRad = Number(selectedLayer.borderRadius ?? props.borderRadius ?? 0);
                  return (
                    <button
                      key={rad}
                      type="button"
                      onClick={() => {
                        onUpdateLayerBorder?.(selectedLayer.id, { borderRadius: rad });
                        onUpdateLayerProps(selectedLayer.id, { borderRadius: rad });
                      }}
                      className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                        currentRad === rad
                          ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rad === 9999 ? 'Pill' : `${rad}px`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* GROSOR Y COLOR DE BORDE */}
            <div className="space-y-2 pt-1 border-t border-slate-900">
              <div className="flex items-center justify-between gap-1 text-[10px]">
                <span className="text-slate-400 font-bold uppercase shrink-0">Borde</span>
                <div className="grid grid-cols-4 gap-1 flex-1">
                  {[0, 1, 2, 4].map((bw) => {
                    const currentBw = Number(selectedLayer.borderWidth ?? props.borderWidth ?? props.strokeWidth ?? 0);
                    return (
                      <button
                        key={bw}
                        type="button"
                        onClick={() => {
                          const borderClr = selectedLayer.borderColor ?? (typeof props.borderColor === 'string' ? props.borderColor : '#94D2BD');
                          onUpdateLayerBorder?.(selectedLayer.id, { borderWidth: bw, borderColor: borderClr });
                          onUpdateLayerProps(selectedLayer.id, { borderWidth: bw, strokeWidth: bw });
                        }}
                        className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                          currentBw === bw
                            ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {bw === 0 ? '0px' : `${bw}px`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {(Number(selectedLayer.borderWidth ?? props.borderWidth ?? props.strokeWidth ?? 0)) > 0 && (
                <HexColorPickerField
                  label="Color de Borde"
                  value={String(selectedLayer.borderColor ?? props.borderColor ?? props.accentColor ?? '#94D2BD')}
                  allowTransparent={false}
                  onChange={(hex) => {
                    onUpdateLayerBorder?.(selectedLayer.id, { borderColor: hex, borderWidth: selectedLayer.borderWidth || 1 });
                    onUpdateLayerProps(selectedLayer.id, { borderColor: hex, accentColor: hex });
                  }}
                />
              )}
            </div>

            {/* OPCIÓN DE ICONO SOLO SI ES UN BOTÓN CTA */}
            {selectedLayer.blockType === 'WhatsAppCtaButton' && (
              <div className="pt-2 border-t border-slate-900 space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Icono del Botón
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { id: 'arrow', label: '👉 Flecha' },
                    { id: 'whatsapp', label: '💬 WhatsApp' },
                    { id: 'bolt', label: '⚡ Rayo' },
                    { id: 'check', label: '✓ Check' },
                    { id: 'none', label: 'Ninguno' },
                  ].map((ic) => (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => onUpdateLayerProps(selectedLayer.id, { icon: ic.id })}
                      className={`py-1 px-1 rounded-lg border text-[9px] font-bold transition-all text-center ${
                        (props.icon ?? (String(props.ctaText ?? '').toLowerCase().includes('whatsapp') ? 'whatsapp' : 'arrow')) === ic.id
                          ? 'border-accent bg-accent/20 text-amber-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {ic.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. BLOQUES COMPUESTOS ESPECIALES */}
        
        {/* A. ASESOR / TARJETA ASESORA (MOTIONADVISORCARD O ADVISOR SUBLAYERS) */}
        {(selectedLayer.blockType === 'MotionAdvisorCard' || selectedLayer.blockType === 'AdvisorAvatarBadge') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <UserCheck className="size-3.5" />
              <span>Datos del Asesor</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={String(props.name ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { name: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cargo</label>
                <input
                  type="text"
                  value={String(props.role ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { role: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>
            </div>

            {/* AVATAR SELECTOR RÁPIDO */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Foto de Perfil</label>
              <div className="grid grid-cols-3 gap-1.5">
                {avatarOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => onUpdateLayerProps(selectedLayer.id, { avatarUrl: opt.url, name: opt.name })}
                    className={`flex items-center gap-2 rounded-xl border p-1.5 transition-all text-left ${
                      props.avatarUrl === opt.url
                        ? 'border-brand-cyan bg-primary/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={opt.url} alt={opt.name} className="size-7 rounded-full object-cover shrink-0" />
                    <span className="text-[10px] font-bold truncate">{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {props.message !== undefined && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cita / Mensaje</label>
                <textarea
                  value={String(props.message ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { message: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none leading-relaxed"
                />
              </div>
            )}
          </div>
        )}

        {/* B. SELLO DE GARANTÍA (MOTIONTRUSTBADGE) */}
        {(selectedLayer.blockType === 'MotionTrustBadge' || selectedLayer.blockType === 'TrustBadgeTitle') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-amber-400 font-black">
              <Award className="size-3.5" />
              <span>Garantía y Confianza</span>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subtítulo</label>
              <textarea
                value={String(props.subtitle ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { subtitle: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* C. COMPARATIVA (MOTIONCOMPARISONCARD) */}
        {(selectedLayer.blockType === 'MotionComparisonCard' || selectedLayer.blockType === 'ComparisonWrongBox' || selectedLayer.blockType === 'ComparisonCorrectBox') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Sliders className="size-3.5" />
              <span>Textos de Comparativa</span>
            </div>

            <div className="space-y-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">Opción Incorrecta (❌)</label>
                <input
                  type="text"
                  value={String(props.wrongOptionTitle ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { wrongOptionTitle: e.target.value })}
                  className="w-full rounded-xl border border-rose-900/50 bg-rose-950/30 p-2 text-xs text-rose-200 focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">Opción VitaBlue (✅)</label>
                <input
                  type="text"
                  value={String(props.correctOptionTitle ?? '')}
                  onChange={(e) => onUpdateLayerProps(selectedLayer.id, { correctOptionTitle: e.target.value })}
                  className="w-full rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-2 text-xs text-emerald-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* D. PARRILLA DE ASEGURADORAS (MOTIONPROVIDERGRID) */}
        {(selectedLayer.blockType === 'MotionProviderGrid' || selectedLayer.blockType === 'ProviderGridHeader') && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Layers className="size-3.5" />
              <span>Parrilla de Proveedores</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Título de Parrilla</label>
              <input
                type="text"
                value={String(props.title ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* H. SUPERFICIE GLASS */}
        {selectedLayer.blockType === 'GlassCardSurface' && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Layers className="size-3.5" />
              <span>Superficie Glassmorphism</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUpdateLayerProps(selectedLayer.id, { variant: 'teal' })}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                  props.variant !== 'amber'
                    ? 'border-teal-400 bg-teal-950/60 text-teal-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Teal Oscuro
              </button>
              <button
                type="button"
                onClick={() => onUpdateLayerProps(selectedLayer.id, { variant: 'amber' })}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                  props.variant === 'amber'
                    ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Oro / Ámbar
              </button>
            </div>
          </div>
        )}

        {/* I. HOOK ALERT BADGE */}
        {selectedLayer.blockType === 'HookAlertBadge' && (
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-3">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-brand-cyan font-black">
              <Sparkles className="size-3.5" />
              <span>Texto del Badge</span>
            </div>
            <div>
              <input
                type="text"
                value={String(props.badge ?? props.text ?? '')}
                onChange={(e) => onUpdateLayerProps(selectedLayer.id, { badge: e.target.value, text: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:border-brand-cyan focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 4. ESTILO VISUAL & ACABADO (COMPACTO Y ELEGANTE) */}
        <CatalogBlockPropsEditor
          layer={selectedLayer}
          onUpdate={(patch) => onUpdateLayerProps(selectedLayer.id, patch)}
        />
        
        {/* A. OPACIDAD Y ACCIONES RÁPIDAS DE ESTILO */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Eye className="size-3.5 text-brand-cyan" />
              <span>Opacidad & Transformación</span>
            </span>
            <span className="font-mono text-brand-cyan text-[11px]">
              {Math.round((selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={selectedLayer.opacity !== undefined ? selectedLayer.opacity : 1}
              onChange={(e) => onUpdateLayerOpacity?.(selectedLayer.id, parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <button
              type="button"
              onClick={() => onUpdateLayerOpacity?.(selectedLayer.id, 1)}
              className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              100%
            </button>
          </div>

          {/* BRILLO */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900 text-[10px]">
            <span className="flex items-center gap-1 text-slate-400 font-bold uppercase shrink-0">
              <Sun className="size-3 text-amber-400" />
              <span>Brillo</span>
            </span>
            <input
              type="range"
              min={60}
              max={140}
              step={5}
              value={selectedLayer.brightness ?? 100}
              onChange={(e) => onUpdateLayerAdjustments?.(selectedLayer.id, { brightness: parseInt(e.target.value, 10) })}
              className="flex-1 accent-amber-400"
            />
            <span className="font-mono text-slate-300 min-w-[28px] text-right">{selectedLayer.brightness ?? 100}%</span>
          </div>

          {/* BOTONES RÁPIDOS: FLIP H, FLIP V, COPIAR/PEGAR ESTILO */}
          <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-900">
            <button
              type="button"
              onClick={() => onToggleFlipHorizontal?.(selectedLayer.id)}
              className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                selectedLayer.flipHorizontal
                  ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Voltear horizontalmente"
            >
              <FlipHorizontal className="size-3" />
              <span>Flip H</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleFlipVertical?.(selectedLayer.id)}
              className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-colors ${
                selectedLayer.flipVertical
                  ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
              title="Voltear verticalmente"
            >
              <FlipVertical className="size-3" />
              <span>Flip V</span>
            </button>

            <button
              type="button"
              onClick={() => onCopyStyle?.(selectedLayer.id)}
              className="flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-400 hover:text-brand-cyan transition-colors"
              title="Copiar Estilo (⌥⌘C)"
            >
              <Paintbrush className="size-3 text-brand-cyan" />
              <span>Copiar</span>
            </button>

            <button
              type="button"
              onClick={() => onPasteStyle?.(selectedLayer.id)}
              className="flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border border-slate-800 bg-slate-900 text-slate-400 hover:text-amber-300 transition-colors"
              title="Pegar Estilo (⌥⌘V)"
            >
              <Paintbrush className="size-3 text-amber-400" />
              <span>Pegar</span>
            </button>
          </div>
        </div>

        {/* B. SOMBRAS Y RESPLANDORES (SHADOW PRESETS) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Sombras & Glow</span>
            </span>
            <span className="font-mono text-brand-cyan text-[10px] capitalize">
              {selectedLayer.shadowPreset ?? 'Ninguna'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Ninguna' },
              { id: 'soft', label: 'Suave' },
              { id: 'deep', label: 'Profunda' },
              { id: 'glow_teal', label: 'Glow Teal' },
              { id: 'glow_gold', label: 'Glow Gold' },
              { id: 'neon', label: 'Neón Cyber' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onUpdateLayerShadowPreset?.(selectedLayer.id, s.id as ImageLayer['shadowPreset'])}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-all ${
                  (selectedLayer.shadowPreset ?? 'none') === s.id
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* C. BORDES Y ESQUINAS (CORNER RADIUS & STROKE) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <BoxSelect className="size-3.5 text-brand-cyan" />
              <span>Bordes y Esquinas</span>
            </span>
          </div>

          {/* RADIO DE ESQUINA */}
          <div className="flex items-center justify-between gap-1 text-[10px]">
            <span className="text-slate-400 font-bold uppercase shrink-0">Radio</span>
            <div className="grid grid-cols-5 gap-1 flex-1">
              {[0, 8, 16, 24, 9999].map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderRadius: rad })}
                  className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                    (selectedLayer.borderRadius ?? 0) === rad
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {rad === 9999 ? 'Pill' : `${rad}`}
                </button>
              ))}
            </div>
          </div>

          {/* GROSOR DE BORDE */}
          <div className="flex items-center justify-between gap-1 text-[10px] pt-1 border-t border-slate-900">
            <span className="text-slate-400 font-bold uppercase shrink-0">Grosor</span>
            <div className="grid grid-cols-4 gap-1 flex-1">
              {[0, 1, 2, 4].map((bw) => (
                <button
                  key={bw}
                  type="button"
                  onClick={() => onUpdateLayerBorder?.(selectedLayer.id, { borderWidth: bw, borderColor: selectedLayer.borderColor ?? '#94D2BD' })}
                  className={`rounded-md py-0.5 text-[9px] font-bold border transition-colors ${
                    (selectedLayer.borderWidth ?? 0) === bw
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {bw === 0 ? '0px' : `${bw}px`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isImageType && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Crop className="size-3.5 text-brand-cyan" />
              <span>Encuadre inteligente</span>
            </div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Reemplazar contenido
              <span className="mt-1 flex gap-1.5">
                <input
                  type="url"
                  value={replacementImageUrl}
                  disabled={selectedLayer.locked}
                  onChange={(event) => setReplacementImageUrl(event.target.value)}
                  placeholder="https://…"
                  className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1.5 text-[10px] font-normal normal-case tracking-normal text-white placeholder:text-slate-600 focus:border-brand-cyan focus:outline-none disabled:opacity-40"
                />
                <button
                  type="button"
                  disabled={selectedLayer.locked || !replacementImageUrl.trim()}
                  onClick={() =>
                    onReplaceLayerContent?.(selectedLayer.id, {
                      imageUrl: replacementImageUrl.trim(),
                    })
                  }
                  className="rounded-lg border border-primary/40 bg-primary/20 px-2 py-1 text-[10px] font-bold normal-case tracking-normal text-brand-cyan transition-colors hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Reemplazar
                </button>
              </span>
              <span className="mt-1 block text-[9px] font-normal normal-case tracking-normal text-slate-500">
                Conserva posición, tamaño, máscara y punto focal.
              </span>
            </label>
            <div className="grid grid-cols-3 gap-1">
              {(['cover', 'contain', 'fill'] as const).map((fit) => (
                <button
                  key={fit}
                  type="button"
                  disabled={selectedLayer.locked}
                  onClick={() => onUpdateLayerProps(selectedLayer.id, { objectFit: fit })}
                  className={`rounded-lg border py-1 text-[10px] font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                    ((props.objectFit as string) ?? 'cover') === fit
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {fit === 'cover' ? 'Rellenar' : fit === 'contain' ? 'Contener' : 'Estirar'}
                </button>
              ))}
            </div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Punto focal horizontal
              <input
                type="range"
                min="0"
                max="100"
                value={Number((props.focalPoint as { x?: number } | undefined)?.x ?? 50)}
                disabled={selectedLayer.locked}
                onChange={(e) =>
                  onUpdateLayerProps(selectedLayer.id, {
                    focalPoint: {
                      x: Number(e.target.value),
                      y: Number((props.focalPoint as { y?: number } | undefined)?.y ?? 50),
                    },
                  })
                }
                className="mt-1 w-full accent-brand-cyan"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Punto focal vertical
              <input
                type="range"
                min="0"
                max="100"
                value={Number((props.focalPoint as { y?: number } | undefined)?.y ?? 50)}
                disabled={selectedLayer.locked}
                onChange={(e) =>
                  onUpdateLayerProps(selectedLayer.id, {
                    focalPoint: {
                      x: Number((props.focalPoint as { x?: number } | undefined)?.x ?? 50),
                      y: Number(e.target.value),
                    },
                  })
                }
                className="mt-1 w-full accent-brand-cyan"
              />
            </label>
            <div className="flex flex-wrap gap-1.5 border-t border-slate-800/80 pt-2">
              {onFitToActiveSlide && (
                <button
                  type="button"
                  disabled={selectedLayer.locked}
                  onClick={() => onFitToActiveSlide(selectedLayer.id, activeSlideIndex)}
                  className="flex-1 rounded-lg border border-primary/40 bg-primary/20 px-2 py-1.5 text-[10px] font-bold text-brand-cyan transition-colors hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ajustar al slide activo
                </button>
              )}
              {onResetAdjustments && (
                <button
                  type="button"
                  disabled={selectedLayer.locked}
                  onClick={() => onResetAdjustments(selectedLayer.id)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-bold text-slate-300 transition-colors hover:border-amber-400/50 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Restablecer ajustes
                </button>
              )}
            </div>
          </div>
        )}

        {/* D. MÁSCARA Y SILUETA (CLIPPING SHAPES) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Crop className="size-3.5 text-brand-cyan" />
              <span>Máscara y Silueta</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Sin recorte', icon: SquareIcon },
              { id: 'circle', label: 'Círculo', icon: Circle },
              { id: 'squircle', label: 'Squircle', icon: SquareIcon },
              { id: 'pill', label: 'Píldora', icon: SquareIcon },
              { id: 'phone_mockup', label: 'Móvil', icon: Smartphone },
              { id: 'shield', label: 'Escudo', icon: Shield },
            ].map((shape) => {
              const Icon = shape.icon;
              const isSelected = (selectedLayer.clipShape ?? 'none') === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => onUpdateLayerClipShape?.(selectedLayer.id, shape.id as ImageLayer['clipShape'])}
                  className={`flex items-center justify-center gap-1 rounded-lg py-1 text-[10px] font-bold border transition-all ${
                    isSelected
                      ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="size-3" />
                  <span>{shape.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* E. FILTROS VISUALES */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-slate-400">
              <Sparkles className="size-3.5 text-accent" />
              <span>Filtros de Color</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'none', label: 'Normal' },
              { id: 'teal_tint', label: 'Teal Brand' },
              { id: 'gold_tint', label: 'Gold Trust' },
              { id: 'grayscale', label: 'B&W' },
              { id: 'sepia', label: 'Sepia' },
              { id: 'contrast', label: 'Contraste' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onUpdateLayerFilter?.(selectedLayer.id, f.id as ImageLayer['filter'])}
                className={`rounded-lg py-1 text-[10px] font-bold border transition-all ${
                  (selectedLayer.filter ?? 'none') === f.id
                    ? 'border-brand-cyan bg-primary/20 text-brand-cyan shadow-xs'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ModuleContextPanel>
    </div>
  );
};
