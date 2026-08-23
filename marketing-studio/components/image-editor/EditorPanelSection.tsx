import React from 'react';

interface EditorPanelSectionProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  tone?: 'muted' | 'cyan' | 'gold';
}

const toneClass = {
  muted: 'text-slate-400',
  cyan: 'text-brand-cyan',
  gold: 'text-amber-300',
};

export const EditorPanelSection: React.FC<EditorPanelSectionProps> = ({
  title,
  children,
  tone = 'muted',
}) => (
  <section className="space-y-3">
    <h3 className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider ${toneClass[tone]}`}>
      {title}
    </h3>
    {children}
  </section>
);
