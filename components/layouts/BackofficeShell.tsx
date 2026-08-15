import React from 'react';
import { BarChart3, Boxes, Globe, Image, LayoutDashboard, Link2, Palette, Sparkles, Wrench, Check } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { BackofficeShell as PlatformBackofficeShell } from '@/components/backoffice-shell';

export const backofficeNavigation = [
  { to: '/backoffice', label: 'Inicio del backoffice', icon: LayoutDashboard, end: true },
  { to: '/backoffice/catalogo', label: 'Catálogo de productos', icon: Boxes, end: true },
  { to: '/backoffice/tools', label: 'Tools', icon: Wrench, end: true },
  { to: '/backoffice/marketing-studio/identidad-de-marca', label: 'Identidad de marca', icon: Palette },
  { to: '/backoffice/marketing-studio/perfiles-sociales', label: 'Perfiles sociales', icon: Image },
  { to: '/backoffice/marketing-studio/campanas', label: 'Gestión de campañas', icon: BarChart3 },
  { to: '/backoffice/marketing-studio/enlaces', label: 'Enlaces de campaña', icon: Link2 },
  { to: '/backoffice/marketing-studio/conexiones', label: 'Conexiones API', icon: Globe },
  { to: '/backoffice/marketing-studio/generador-contenido', label: 'Generador de contenido', icon: Sparkles },
];

interface BackofficeShellProps { children: React.ReactNode; title?: string; eyebrow?: string; }

const BackofficeShell: React.FC<BackofficeShellProps> = ({ children, title = 'Backoffice VitaBlue', eyebrow = 'Panel de Administración' }) => {
  return (
    <PlatformBackofficeShell
      mode="standard"
      navigation={(
        <nav className="flex flex-col gap-1 p-3" aria-label="Navegación del backoffice">
            {backofficeNavigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold transition-colors ${isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><Icon className="size-4 shrink-0" aria-hidden="true" /><span>{label}</span></NavLink>)}
          </nav>
      )}
      header={(
        <div className="flex min-h-16 items-center justify-between gap-4 px-5 py-3">
          <div><div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /><span className="text-[10px] font-black uppercase tracking-wider text-primary">{eyebrow}</span></div><h1 className="mt-1 font-display text-xl font-black text-slate-800">{title}</h1></div>
          <div className="flex items-center gap-2 rounded-lg border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1.5 text-[10px] font-bold text-primary"><Check className="size-3" aria-hidden="true" /> Sesión activa</div>
        </div>
      )}
    >
      <div className="h-full overflow-y-auto p-5 lg:p-8">{children}</div>
    </PlatformBackofficeShell>
  );
};

export default BackofficeShell;
