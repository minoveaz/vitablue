import React from 'react';
import {
  FileText,
  Sparkles,
  Type,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

export type ImageRailTab = 'templates' | 'blocks' | 'text' | 'brand' | 'media';

interface ImageEditorRailProps {
  activeTab: ImageRailTab;
  onSelectTab: (tab: ImageRailTab) => void;
}

export const ImageEditorRail: React.FC<ImageEditorRailProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'templates' as ImageRailTab, label: 'Plantillas', icon: FileText },
    { id: 'blocks' as ImageRailTab, label: 'Bloques', icon: Sparkles },
    { id: 'text' as ImageRailTab, label: 'Texto', icon: Type },
    { id: 'brand' as ImageRailTab, label: 'Brand Kit', icon: Palette },
    { id: 'media' as ImageRailTab, label: 'Medios', icon: ImageIcon },
  ];

  return (
    <aside className="flex h-full w-18 flex-col items-center border-r border-slate-200 bg-white py-3 shadow-xs select-none shrink-0 z-30">
      <div className="flex flex-col gap-1.5 w-full px-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl p-2.5 transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-bold shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`size-5 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
