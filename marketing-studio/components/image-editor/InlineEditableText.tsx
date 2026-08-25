import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Palette } from 'lucide-react';
import { stripTextFormatting } from '../../utils/textFormatter';

interface InlineEditableTextProps {
  text: string;
  children?: React.ReactNode;
  onSave: (newHtmlOrText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'strong' | 'div';
}

const BRAND_PALETTE = [
  { label: 'Amber Gold', hex: '#EE9B00' },
  { label: 'Mint Green', hex: '#94D2BD' },
  { label: 'Ocean Teal', hex: '#005F73' },
  { label: 'Clean White', hex: '#FFFFFF' },
  { label: 'Coral Red', hex: '#F43F5E' },
  { label: 'Midnight Blue', hex: '#001219' },
  { label: 'Sky Blue', hex: '#38BDF8' },
  { label: 'Emerald Green', hex: '#10B981' },
];

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  children,
  onSave,
  className = '',
  style,
  as: Component = 'div',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [bubbleMenuPos, setBubbleMenuPos] = useState<{ top: number; left: number } | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isEditing]);

  const updateSelectionBubble = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setBubbleMenuPos(null);
      setShowColorPicker(false);
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect && rect.width > 0) {
      // Posicionar la barra flotante exactamente centrada encima de la palabra seleccionada
      setBubbleMenuPos({
        top: Math.max(12, rect.top - 60),
        left: Math.max(120, rect.left + rect.width / 2),
      });
    }
  };

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
    updateSelectionBubble();
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Si el clic fue en la barra flotante o paleta, no salir de edición
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }
    if (editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
    setIsEditing(false);
    setBubbleMenuPos(null);
    setShowColorPicker(false);
  };

  if (isEditing) {
    return (
      <div
        ref={containerRef}
        className="relative inline-block w-full"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* BARRA FLOTANTE DE TIPOGRAFÍA PROFESIONAL ESTILO CANVA (BUBBLE MENU) */}
        {bubbleMenuPos && (
          <div
            className="fixed z-[999999] flex -translate-x-1/2 items-center gap-1.5 rounded-2xl border border-slate-700/90 bg-slate-950/98 px-2.5 py-1.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl animate-fadeIn select-none pointer-events-auto"
            style={{
              top: `${bubbleMenuPos.top}px`,
              left: `${bubbleMenuPos.left}px`,
            }}
            onMouseDown={(e) => e.preventDefault()}
          >
            {/* NEGRITA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('bold');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-all shadow-xs"
              title="Negrita (B)"
            >
              <Bold className="size-4" />
            </button>

            {/* CURSIVA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('italic');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-all shadow-xs"
              title="Cursiva (I)"
            >
              <Italic className="size-4" />
            </button>

            {/* SUBRAYADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('underline');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-all shadow-xs"
              title="Subrayado (U)"
            >
              <UnderlineIcon className="size-4" />
            </button>

            {/* TACHADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('strikeThrough');
              }}
              className="flex size-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 hover:border-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-all shadow-xs"
              title="Tachado (S)"
            >
              <Strikethrough className="size-4" />
            </button>

            <div className="mx-1 h-5 w-px bg-slate-800" />

            {/* SELECTOR DE COLOR POR PALABRA - TAMAÑO CÓMODO & CLARO */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowColorPicker(!showColorPicker);
                }}
                className={`flex h-8 items-center gap-1.5 px-2.5 rounded-xl border transition-all shadow-xs ${
                  showColorPicker
                    ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900/90 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
                title="Cambiar color del texto seleccionado"
              >
                <Palette className="size-4 text-amber-400" />
                <span className="text-[11px] font-bold">Color</span>
              </button>

              {/* PALETA POPUP GRANDE Y NÍTIDA */}
              {showColorPicker && (
                <div
                  className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-fadeIn z-50 min-w-[280px]"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Paleta:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {BRAND_PALETTE.map((swatch) => (
                      <button
                        key={swatch.hex}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat('foreColor', swatch.hex);
                          setShowColorPicker(false);
                        }}
                        className="size-6 rounded-full border-2 border-slate-700 hover:scale-125 hover:border-white transition-transform shadow-xs"
                        style={{ backgroundColor: swatch.hex }}
                        title={swatch.label}
                      />
                    ))}
                    {/* INPUT COLOR NATIVO CON PREVIEW */}
                    <label className="size-6 rounded-full border-2 border-dashed border-slate-500 hover:border-brand-cyan flex items-center justify-center cursor-pointer hover:scale-110 transition-transform relative overflow-hidden">
                      <input
                        type="color"
                        onChange={(e) => {
                          applyFormat('foreColor', e.target.value);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        title="Elegir cualquier color personalizado"
                      />
                      <span className="text-[10px] text-brand-cyan font-black">+</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onMouseUp={updateSelectionBubble}
          onKeyUp={updateSelectionBubble}
          onBlur={handleBlur}
          dangerouslySetInnerHTML={{ __html: text || '' }}
          className={`${className} !cursor-text outline-none ring-2 ring-brand-cyan bg-white/10 rounded-xs p-1 select-text`}
          style={style}
        />
      </div>
    );
  }

  return (
    <Component
      onClick={(e) => {
        // Clic directo activa el modo de edición y selección de palabras
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${className} cursor-text hover:outline-dashed hover:outline-1 hover:outline-brand-cyan/60 rounded-xs transition-all`}
      style={style}
      title="Haz clic para seleccionar y formatear palabras"
    >
      {children ?? (
        <span dangerouslySetInnerHTML={{ __html: text || '' }} />
      )}
    </Component>
  );
};
