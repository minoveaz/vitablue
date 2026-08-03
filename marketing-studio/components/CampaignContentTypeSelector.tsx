import React from 'react';
import { FileText, Video } from 'lucide-react';
import { CampaignContentType } from '@/marketing-studio/utils/campaigns';

interface CampaignContentTypeSelectorProps {
  value: CampaignContentType[];
  onChange: (value: CampaignContentType[]) => void;
}

const options: Array<{ id: CampaignContentType; label: string; description: string; icon: React.ReactNode }> = [
  { id: 'text', label: 'Texto', description: 'Copies, anuncios y publicaciones escritas', icon: <FileText size={16} /> },
  { id: 'video', label: 'Vídeo', description: 'Reels, Shorts, Stories y piezas audiovisuales', icon: <Video size={16} /> },
];

export const CampaignContentTypeSelector: React.FC<CampaignContentTypeSelectorProps> = ({ value, onChange }) => (
  <div className="space-y-3">
    <div>
      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tipo de contenido</span>
      <p className="mt-1 text-xs text-slate-500">Define qué piezas vas a preparar para esta campaña. Puedes seleccionar una o ambas.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = value.includes(option.id);
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(isSelected ? value.filter((type) => type !== option.id) : [...value, option.id])}
            aria-pressed={isSelected}
            className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition-all ${isSelected ? 'border-[#005F73] bg-[#EBF7F4]/60 text-[#005F73]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
          >
            <span className={`mt-0.5 rounded-lg p-2 ${isSelected ? 'bg-[#005F73] text-white' : 'bg-slate-100 text-slate-400'}`}>
              {option.icon}
            </span>
            <span>
              <span className="block text-xs font-black">{option.label}</span>
              <span className="mt-1 block text-[10px] font-semibold leading-relaxed text-slate-400">{option.description}</span>
            </span>
          </button>
        );
      })}
    </div>
    {value.length === 0 && <p className="text-[10px] font-bold text-amber-600">Selecciona al menos un tipo de contenido.</p>}
  </div>
);
