import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { User } from '@supabase/supabase-js';
import Logo from '../atoms/Logo';
import { useAuth } from '@/context/AuthContext';
import { getPlatformUserInitials, getPlatformUserName } from './platformProfile';

export interface PlatformHeaderProps {
  suiteTitle?: string;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  profileSlot?: React.ReactNode;
  onOpenMobileNav?: () => void;
  isMobileNavOpen?: boolean;
}

interface PlatformProfileMenuProps {
  user: User | null;
  onSignOut: () => Promise<void>;
}

export const PlatformProfileMenu: React.FC<PlatformProfileMenuProps> = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const signOutRef = useRef<HTMLButtonElement>(null);
  const name = getPlatformUserName(user);
  const email = user?.email ?? 'Sesión autenticada';
  const initials = getPlatformUserInitials(name);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) signOutRef.current?.focus();
  }, [isOpen]);

  const handleSignOut = () => {
    setIsOpen(false);
    void onSignOut();
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        className="group flex min-h-9 items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900/80 px-1.5 text-left transition-colors hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        aria-label={`Abrir menú de cuenta de ${name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="platform-profile-menu"
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span
          className="flex size-7 items-center justify-center rounded-md bg-primary text-[10px] font-black uppercase tracking-wide text-white"
          aria-hidden="true"
        >
          {initials}
        </span>
        <ChevronDown className={`mr-0.5 size-3.5 text-slate-400 transition-transform group-hover:text-slate-200 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          id="platform-profile-menu"
          role="menu"
          aria-label="Menú de cuenta"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-white shadow-2xl shadow-slate-950/40"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-brand-cyan">Cuenta</p>
            <p className="mt-2 truncate text-sm font-bold text-white" title={name}>{name}</p>
            <p className="mt-0.5 truncate text-xs text-slate-400" title={email}>{email}</p>
          </div>
          <div className="p-1.5">
            <button
              ref={signOutRef}
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2.5 text-left text-sm font-semibold text-slate-300 transition-colors hover:bg-slate-800 hover:text-white focus-visible:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/70"
              onClick={handleSignOut}
            >
              <LogOut className="size-4 text-slate-400" aria-hidden="true" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({
  suiteTitle,
  leftSlot,
  centerSlot,
  rightSlot,
  profileSlot,
  onOpenMobileNav,
  isMobileNavOpen,
}) => {
  const { user, signOut } = useAuth();

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
        {profileSlot ?? <PlatformProfileMenu user={user} onSignOut={signOut} />}
      </div>
    </header>
  );
};
