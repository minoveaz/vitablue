import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../atoms/Logo';

export interface PlatformHeaderProps {
  suiteTitle?: string;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  profileSlot?: React.ReactNode;
  onOpenMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  suiteTitle,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  onOpenMobileNav,
  isMobileNavOpen,
}) => {
  return (
    <header
      className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-3 text-white md:px-5"
      aria-label="Platform header"
    >
      <div className="flex min-w-0 items-center gap-3">
        {onOpenMobileNav && (
          <button
            type="button"
            className="flex size-9 shrink-0 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Abrir navegación del backoffice"
            aria-expanded={isMobileNavOpen}
            onClick={onOpenMobileNav}
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        )}
        <Link to="/backoffice" className="flex items-center gap-3" aria-label="Ir al inicio del backoffice">
          <Logo iconSize={26} showText={false} showTagline={false} variant="colored-on-dark" />
          <span className="font-display text-sm font-black tracking-tight text-white hidden sm:inline">VitaBlue OS</span>
        </Link>
        {leftSlot}
      </div>

      <div className="hidden min-w-0 flex-1 items-center justify-center md:flex" aria-label="Contexto de plataforma">
        {centerSlot ?? (
          <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            {suiteTitle ?? 'Suite de Operaciones'}
          </span>
        )}
      </div>

      <div className="flex min-w-0 items-center justify-end gap-2 md:gap-3">
        {rightSlot}
        {profileSlot ?? (
          <div className="flex items-center gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 px-2.5 py-1 text-[10px] font-bold text-brand-cyan">
            <span className="size-1.5 rounded-full bg-brand-cyan animate-pulse" />
            <span className="hidden sm:inline">Sesión activa</span>
          </div>
        )}
      </div>
    </header>
  );
};
