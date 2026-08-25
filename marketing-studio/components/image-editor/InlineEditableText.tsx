import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Palette } from 'lucide-react';

interface InlineEditableTextProps {
  text: string;
  children?: React.ReactNode;
  onSave: (newText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'strong' | 'div';
}

const SWATCH_COLORS = [
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
  as: Component = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ text: string; start: number; end: number } | null>(null);
  const [floatingMenuPos, setFloatingMenuPos] = useState<{ top: number; left: number } | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleSelectionChange = () => {
    if (!isEditing || !ref.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setSelectedRange(null);
      setFloatingMenuPos(null);
      return;
    }

    const selectedText = sel.toString();
    if (!selectedText || selectedText.trim().length === 0) {
      setSelectedRange(null);
      setFloatingMenuPos(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect) {
      setFloatingMenuPos({
        top: Math.max(10, rect.top - 48),
        left: Math.max(10, rect.left + rect.width / 2),
      });
      setSelectedRange({
        text: selectedText,
        start: 0,
        end: selectedText.length,
      });
    }
  };

  const wrapSelectedText = (prefix: string, suffix: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const selectedText = sel.toString();
    if (!selectedText) return;

    const formatted = `${prefix}${selectedText}${suffix}`;
    range.deleteContents();
    const textNode = document.createTextNode(formatted);
    range.insertNode(textNode);

    // Actualizar texto y guardar
    if (ref.current) {
      const fullText = ref.current.innerText;
      onSave(fullText);
    }

    // Reset selección y menú
    sel.removeAllRanges();
    setSelectedRange(null);
    setFloatingMenuPos(null);
    setShowColorPicker(false);
  };

  const applyColorToSelection = (colorHex: string) => {
    wrapSelectedText(`[`, `](${colorHex})`);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Si el clic fue dentro del menú flotante, no cerrar la edición
    if (containerRef.current?.contains(e.relatedTarget as Node)) {
      return;
    }

    setIsEditing(false);
    setSelectedRange(null);
    setFloatingMenuPos(null);
    setShowColorPicker(false);

    if (ref.current) {
      const updated = ref.current.innerText.trim();
      if (updated !== text && updated.length > 0) {
        onSave(updated);
      } else {
        ref.current.innerText = text;
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ref.current?.blur();
    } else if (e.key === 'Escape') {
      if (ref.current) {
        ref.current.innerText = text;
      }
      setIsEditing(false);
      setSelectedRange(null);
      setFloatingMenuPos(null);
    }
  };

  if (isEditing) {
    return (
      <div ref={containerRef} className="relative inline-block w-full">
        {/* MENÚ FLOTANTE DE FORMATO DE TEXTO EN SELECCIÓN */}
        {floatingMenuPos && selectedRange && (
          <div
            className="fixed z-[9999] flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950/95 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-fadeIn select-none pointer-events-auto"
            style={{
              top: `${floatingMenuPos.top}px`,
              left: `${floatingMenuPos.left}px`,
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            {/* NEGRITA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                wrapSelectedText('**', '**');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-amber-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
              title="Negrita (**Palabra**)"
            >
              <Bold className="size-3.5" />
            </button>

            {/* CURSIVA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                wrapSelectedText('*', '*');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-colors"
              title="Cursiva (*Palabra*)"
            >
              <Italic className="size-3.5" />
            </button>

            {/* SUBRAYADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                wrapSelectedText('__', '__');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan hover:bg-slate-800 transition-colors"
              title="Subrayado (__Palabra__)"
            >
              <UnderlineIcon className="size-3.5" />
            </button>

            {/* TACHADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                wrapSelectedText('~~', '~~');
              }}
              className="flex size-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-200 hover:border-rose-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
              title="Tachado (~~Palabra~~)"
            >
              <Strikethrough className="size-3.5" />
            </button>

            {/* DIVISOR */}
            <div className="mx-0.5 h-4 w-px bg-slate-800" />

            {/* BOTÓN SELECTOR DE COLOR */}
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
                    : 'border-slate-800 bg-slate-900 text-slate-200 hover:border-brand-cyan hover:text-brand-cyan'
                }`}
                title="Colorear solo esta palabra"
              >
                <Palette className="size-3.5" />
              </button>

              {/* POPUP DE COLORES RÁPIDOS */}
              {showColorPicker && (
                <div className="absolute top-9 left-0 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl backdrop-blur-xl">
                  {SWATCH_COLORS.map((swatch) => (
                    <button
                      key={swatch.hex}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyColorToSelection(swatch.hex);
                      }}
                      className="size-5 rounded-full border border-slate-700 hover:scale-125 transition-transform"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.label}
                    />
                  ))}
                  {/* COLOR PERSONALIZADO INPUT */}
                  <input
                    type="color"
                    onChange={(e) => applyColorToSelection(e.target.value)}
                    className="size-5 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                    title="Elegir otro color"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <Component
          ref={ref as unknown as React.RefObject<any>}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleSelectionChange}
          onMouseUp={handleSelectionChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className={`${className} !cursor-text outline-none ring-1 ring-brand-cyan/80 bg-white/10 rounded-xs px-1 select-text transition-all`}
          style={style}
        >
          {text}
        </Component>
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
      title="Doble clic para editar y formatear texto"
    >
      {children ?? text}
    </Component>
  );
};
