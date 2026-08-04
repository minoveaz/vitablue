import React from 'react';
import { Check, LogOut } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import Logo from '@/components/atoms/Logo';
import { useAuth } from '@/context/AuthContext';

export interface SaaSNavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
}

interface SaaSShellProps {
  children: React.ReactNode;
  navigation: SaaSNavItem[];
  title: string;
  eyebrow?: string;
  productName?: string;
  workspaceLabel?: string;
}

const SaaSShell: React.FC<SaaSShellProps> = ({ children, navigation, title, eyebrow = 'Panel de Administración', productName = 'Marketing Studio', workspaceLabel = 'Dev Workspace' }) => {
  const { user, role, signOut } = useAuth();

  return (
    <div className="flex min-h-screen flex-row bg-slate-100 text-slate-800 max-md:flex-col">
      <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between bg-slate-900 text-white max-md:min-h-0 max-md:w-full" aria-label={`${productName} navegación`}>
        <div className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between border-b border-slate-800/60 pb-4 text-left">
            <div><p className="font-display text-xl font-black tracking-tight text-white">{productName}</p><span className="mt-1 block text-[9px] font-black uppercase tracking-wider text-brand-cyan">{workspaceLabel}</span></div>
            <Link to="/backoffice" aria-label="Ir al inicio del backoffice"><Logo iconSize={28} showText={false} showTagline={false} variant="colored-on-dark" /></Link>
          </div>
          <nav className="flex flex-wrap gap-1.5 lg:flex-col" aria-label="Secciones del workspace">
            {navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'}`}><Icon className="size-4 shrink-0" aria-hidden="true" /><span>{label}</span></NavLink>)}
          </nav>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60 p-4 sm:p-6 lg:block lg:space-y-4">
          <div className="rounded-xl border border-brand-cyan/20 bg-brand-cyan/5 px-3.5 py-2.5 text-center text-[10px] font-semibold leading-relaxed text-brand-cyan">{user?.email ?? 'Usuario autenticado'} · {role ?? 'sin rol'}</div>
          <div className="flex flex-wrap items-center gap-3 lg:block lg:space-y-3"><Link to="/" className="flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-white">Salir al sitio <span aria-hidden="true">↗</span></Link><Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => { void signOut(); }}><LogOut className="mr-1.5 size-3.5" aria-hidden="true" />Cerrar sesión</Button></div>
        </div>
      </aside>
      <main className="h-screen min-w-0 flex-grow overflow-y-auto p-4 sm:p-6 md:p-10"><div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8"><header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 text-left sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-primary" /><span className="text-[10px] font-black uppercase tracking-wider text-primary">{eyebrow}</span></div><h1 className="mt-1 font-display text-xl font-black text-slate-800">{title}</h1></div><div className="flex flex-wrap items-center gap-2.5"><div className="flex items-center gap-1.5 rounded-xl border border-brand-cyan/20 bg-brand-cyan/10 px-3 py-1.5 text-[10px] font-bold text-primary"><Check className="size-3" aria-hidden="true" />Base de Datos Sincronizada</div><div className="rounded-xl border border-slate-200/60 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-500">Entorno Local: Activo</div></div></header>{children}</div></main>
    </div>
  );
};

export default SaaSShell;
