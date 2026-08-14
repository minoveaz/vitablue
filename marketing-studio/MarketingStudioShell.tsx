import React from 'react';
import { Check } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Logo from '@/components/atoms/Logo';
import { backofficeNavigation } from '@/components/layouts/BackofficeShell';
import { BackofficeShell } from '@/components/backoffice-shell';
import type { SaaSNavItem } from '@/components/layouts/SaaSShell';

interface MarketingStudioShellProps {
  children: React.ReactNode;
  title: string;
  navigation?: SaaSNavItem[];
  hideNavigation?: boolean;
  hideHeader?: boolean;
}

const MarketingStudioShell: React.FC<MarketingStudioShellProps> = ({ children, title }) => {
  return (
    <BackofficeShell
      mode="standard"
      navigation={(
        <>
          <div className="border-b border-slate-800/60 p-4 text-left">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg font-black tracking-tight text-white">Marketing Studio</p>
                <span className="mt-1 block text-[9px] font-black uppercase tracking-wider text-brand-cyan">Dev Workspace</span>
              </div>
              <Link to="/backoffice" aria-label="Ir al inicio del backoffice">
                <Logo iconSize={28} showText={false} showTagline={false} variant="colored-on-dark" />
              </Link>
            </div>
          </div>
          <nav className="flex flex-col gap-1 p-3" aria-label="Secciones de Marketing Studio">
            {backofficeNavigation.filter((item) => item.to.includes('/marketing-studio/')).map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}>
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </>
      )}
      header={(
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-[10px] font-black uppercase tracking-wider text-primary">Marketing Studio</span>
            </div>
            <h1 className="mt-1 font-display text-xl font-black text-slate-800">{title}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1.5 text-[10px] font-bold text-primary">
            <Check className="size-3" aria-hidden="true" /> Guardado localmente
          </div>
        </div>
      )}
    >
      <div className="h-full overflow-y-auto p-5 lg:p-8">{children}</div>
    </BackofficeShell>
  );
};

export default MarketingStudioShell;
