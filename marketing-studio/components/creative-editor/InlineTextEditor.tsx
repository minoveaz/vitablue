import React, { useState, useEffect, useRef } from 'react';
import type { TextLayer, SubtitleLayer } from '../../../packages/video-studio/src/domain/videoProject';

export interface InlineTextEditorProps {
  layer: TextLayer | SubtitleLayer;
  onSave: (newText: string) => void;
  onCancel: () => void;
}

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  layer,
  onSave,
  onCancel,
}) => {
  const [text, setText] = useState(layer.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(text);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onSave(text);
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border-2 border-primary bg-slate-900/95 p-3 shadow-2xl animate-in zoom-in-95 duration-100">
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan">Edición Rápida</span>
          <span className="text-[9px] text-slate-400">Presiona Enter para guardar · Esc para cancelar</span>
        </div>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onSave(text)}
          rows={3}
          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-sm font-bold text-white placeholder-slate-500 focus:border-primary focus:outline-none resize-none"
        />
      </div>
    </div>
  );
};
