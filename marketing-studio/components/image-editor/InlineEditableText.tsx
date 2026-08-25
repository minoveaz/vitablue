import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { Highlight } from '@tiptap/extension-highlight';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, Palette } from 'lucide-react';

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
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        codeBlock: false,
        blockquote: false,
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content: text || '',
    editable: isEditing,
    onSelectionUpdate({ editor }) {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setBubbleMenuPos(null);
        setShowColorPicker(false);
        return;
      }

      // Obtener coordenadas de la selección para colocar la barra flotante estilo Canva
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect) {
          setBubbleMenuPos({
            top: Math.max(10, rect.top - 52),
            left: Math.max(10, rect.left + rect.width / 2),
          });
        }
      }
    },
    onBlur({ editor }) {
      const html = editor.getHTML();
      onSave(html);
      setIsEditing(false);
      setBubbleMenuPos(null);
      setShowColorPicker(false);
    },
  });

  useEffect(() => {
    if (editor && text !== editor.getHTML() && !isEditing) {
      editor.commands.setContent(text || '');
    }
  }, [text, editor, isEditing]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
      if (isEditing) {
        editor.commands.focus('end');
      }
    }
  }, [isEditing, editor]);

  if (isEditing && editor) {
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
                editor.chain().focus().toggleBold().run();
              }}
              className={`flex size-7 items-center justify-center rounded-lg border transition-colors ${
                editor.isActive('bold')
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Negrita"
            >
              <Bold className="size-3.5" />
            </button>

            {/* CURSIVA */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
              className={`flex size-7 items-center justify-center rounded-lg border transition-colors ${
                editor.isActive('italic')
                  ? 'border-brand-cyan bg-primary/25 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Cursiva"
            >
              <Italic className="size-3.5" />
            </button>

            {/* SUBRAYADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
              className={`flex size-7 items-center justify-center rounded-lg border transition-colors ${
                editor.isActive('underline')
                  ? 'border-brand-cyan bg-primary/25 text-brand-cyan'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Subrayado"
            >
              <UnderlineIcon className="size-3.5" />
            </button>

            {/* TACHADO */}
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleStrike().run();
              }}
              className={`flex size-7 items-center justify-center rounded-lg border transition-colors ${
                editor.isActive('strike')
                  ? 'border-rose-400 bg-rose-500/20 text-rose-300'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title="Tachado"
            >
              <Strikethrough className="size-3.5" />
            </button>

            <div className="mx-0.5 h-4 w-px bg-slate-800" />

            {/* SELECTOR DE COLOR DE PALABRA / LETRA */}
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
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
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
                        editor.chain().focus().setColor(swatch.hex).run();
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
                      editor.chain().focus().setColor(e.target.value).run();
                    }}
                    className="size-5 rounded-full border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                    title="Color personalizado"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <EditorContent
          editor={editor}
          className={`${className} !cursor-text outline-none ring-2 ring-brand-cyan bg-white/5 rounded-xs p-0.5 select-text`}
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
      title="Doble clic para editar y formatear directamente aquí"
    >
      {children ?? (
        <span dangerouslySetInnerHTML={{ __html: text || '' }} />
      )}
    </Component>
  );
};
