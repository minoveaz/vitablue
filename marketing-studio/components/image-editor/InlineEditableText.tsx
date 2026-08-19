import React, { useState, useRef, useEffect } from 'react';

interface InlineEditableTextProps {
  text: string;
  onSave: (newText: string) => void;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'strong' | 'div';
}

export const InlineEditableText: React.FC<InlineEditableTextProps> = ({
  text,
  onSave,
  className = '',
  as: Component = 'span',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      // Mover el cursor al final del texto
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
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
    }
  };

  if (isEditing) {
    return (
      <Component
        ref={ref as unknown as React.RefObject<any>}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        className={`${className} cursor-text outline-none ring-1 ring-brand-cyan/80 bg-white/10 rounded-xs px-1 select-text transition-all`}
      >
        {text}
      </Component>
    );
  }

  return (
    <Component
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`${className} cursor-text hover:outline-dashed hover:outline-1 hover:outline-brand-cyan/60 rounded-xs transition-all`}
      title="Doble clic para editar texto directamente"
    >
      {text}
    </Component>
  );
};
