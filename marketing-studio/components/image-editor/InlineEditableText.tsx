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
      setBubbleMenuPos({
        top: Math.max(10, rect.top - 48),
        left: Math.max(10, rect.left + rect.width / 2),
      });
    }
  };

  const applyFormat = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value ?? undefined);
    updateSelectionBubble();
    if (editorRef.current) {
      onSave(editorRef.current.innerHTML);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Si el clic fue en la barra flotante, no salir de edición
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
        {/* BARRA FLOTANTE DE TIPOGRAFÍA ESTILO CANVA (BUBBLE MENU) */}
        {bubbleMenuPos && (
          <div
            className="fixed z-[99999] flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950/95 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-fadeIn select-none pointer-events-auto"
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
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-amber-400 hover:text-amber-300 transition-colors"
              title="Negrita"
            >
              <Bold className="size-3.5" />
            </button>

            {/* CURSIVA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('italic');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
              title="Cursiva"
            >
              <Italic className="size-3.5" />
            </button>

            {/* SUBRAYADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('underline');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan transition-colors"
              title="Subrayado"
            >
              <UnderlineIcon className="size-3.5" />
            </button>

            {/* TACHADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                applyFormat('strikeThrough');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-rose-400 hover:text-rose-300 transition-colors"
              title="Tachado"
            >
              <Strikethrough className="size-3.5" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-slate-800" />

            {/* SELECTOR DE COLOR POR PALABRA */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowColorPicker(!showColorPicker);
                }}
                className={`flex size-7 items-center justify-center rounded-lg border transition-colors ${
                  showColorPicker
                    ? 'border-brand-cyan bg-primary/30 text-brand-cyan'
                    : 'border-slate-800 bg-slate-900 text-slate-200 hover:text-white'
                }`}
                title="Cambiar color del texto seleccionado"
              >
                <Palette className="size-3.5" />
              </button>

              {/* PALETA POPUP */}
              {showColorPicker && (
                <div
                  className="absolute top-9 left-0 flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 p-2 shadow-2xl backdrop-blur-xl animate-fadeIn"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {BRAND_PALETTE.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyFormat('foreColor', swatch.hex);
                        setShowColorPicker(false);
                      }}
                      className="size-5 rounded-full border border-slate-600 hover:scale-125 transition-transform"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.label}
                    />
                  ))}
                  {/* INPUT COLOR NATIVO */}
                  <input
                    type="color"
                    onChange={(e) => {
                      applyFormat('foreColor', e.target.value);
                    }}
                    className="size-5 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                    title="Color personalizado"
                  />
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
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${className} cursor-inherit hover:outline-dashed hover:outline-1 hover:outline-brand-cyan/60 rounded-xs transition-all`}
      style={style}
      title="Doble clic para editar y colorear directamente aquí"
    >
      {children ?? (
        <span dangerouslySetInnerHTML={{ __html: text || '' }} />
      )}
    </Component>
  );
};
