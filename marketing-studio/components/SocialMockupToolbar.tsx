import React from 'react';

interface SocialMockupToolbarProps {
  platformName: string;
  theme: 'light' | 'dark';
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const SocialMockupToolbar: React.FC<SocialMockupToolbarProps> = ({ platformName, theme, onThemeChange }) => (
  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">Vista previa contextual real</p>
      <p className="mt-0.5 text-sm font-bold text-slate-700">Canal: {platformName}</p>
    </div>

    <div className="flex items-center gap-1.5 rounded-xl bg-slate-300/50 p-1">
      <button
        type="button"
        onClick={() => onThemeChange('light')}
        className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          theme === 'light' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        Modo Claro
      </button>
      <button
        type="button"
        onClick={() => onThemeChange('dark')}
        className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
          theme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        Modo Oscuro
      </button>
    </div>
  </div>
);

export default SocialMockupToolbar;
