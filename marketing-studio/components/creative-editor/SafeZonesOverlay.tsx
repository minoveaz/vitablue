import React from 'react';
import { Heart, MessageCircle, Send, Music2 } from 'lucide-react';

export interface SafeZonesOverlayProps {
  visible: boolean;
  platform?: 'tiktok' | 'reels';
}

export const SafeZonesOverlay: React.FC<SafeZonesOverlayProps> = ({
  visible,
  platform = 'reels',
}) => {
  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-6 select-none"
      aria-hidden="true"
    >
      {/* Top Header Safe Zone */}
      <div className="flex items-center justify-between border-b border-dashed border-red-400/40 pb-2 text-[10px] font-bold uppercase tracking-wider text-red-400">
        <span>Zona de Cabecera {platform === 'reels' ? 'Reels' : 'TikTok'}</span>
        <span>No colocar texto</span>
      </div>

      {/* Center Safe Canvas */}
      <div className="flex-1 border-2 border-dashed border-emerald-400/40 rounded-2xl flex items-center justify-center m-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/60 bg-slate-950/60 px-3 py-1 rounded-full">
          Área Segura Principal
        </span>
      </div>

      {/* Right Social Action Buttons Overlay */}
      <div className="absolute right-4 bottom-28 flex flex-col items-center gap-4 text-white/50">
        <div className="flex flex-col items-center">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-900/60 border border-white/20">
            <Heart className="size-4 text-red-400" />
          </div>
          <span className="text-[9px] mt-0.5">8.4k</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex size-9 items-center justify-center rounded-full bg-slate-900/60 border border-white/20">
            <MessageCircle className="size-4" />
          </div>
          <span className="text-[9px] mt-0.5">142</span>
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-slate-900/60 border border-white/20">
          <Send className="size-4" />
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-slate-900/60 border border-white/20 animate-spin">
          <Music2 className="size-4 text-emerald-400" />
        </div>
      </div>

      {/* Bottom Caption & Audio Safe Zone */}
      <div className="border-t border-dashed border-red-400/40 pt-2 text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center justify-between">
        <span>Zona de Copy y Botón de Audio</span>
        <span>Mantener libre de CTAs</span>
      </div>
    </div>
  );
};
