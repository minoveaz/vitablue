import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface TocItem {
  text: string;
  id: string;
}

const cleanTocTitle = (text: string): string => {
  return text.replace(/^\d+[.)-]\s*/, '').trim();
};

const ArticleToc: React.FC<{ items: TocItem[]; isEnglish: boolean }> = ({ items, isEnglish }) => {
  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm p-6 text-left">
      <h3 className="text-xs font-black text-text-main uppercase tracking-widest border-b border-slate-100 pb-3 flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-primary" />
        {isEnglish ? 'Article Index' : 'Índice del artículo'}
      </h3>
      <nav className="mt-4">
        <ul className="space-y-3">
          {items.map((item, index) => {
            const displayTitle = cleanTocTitle(item.text);
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-xs font-semibold text-text-secondary hover:text-primary flex items-start gap-2 leading-snug group transition-colors"
                >
                  <span className="text-[11px] text-primary/70 font-black group-hover:text-primary transition-colors shrink-0 mt-0.5">
                    {index + 1}.
                  </span>
                  <span>{displayTitle}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default ArticleToc;

