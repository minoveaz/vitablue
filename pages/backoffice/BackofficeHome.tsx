import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BarChart3, Megaphone, PackageSearch, Palette, PlugZap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';

const BackofficeHome: React.FC = () => (
  <>
    <Helmet><title>Backoffice | VitaBlue</title><meta name="robots" content="noindex, nofollow" /></Helmet>
    <BackofficeShell title="Backoffice VitaBlue" eyebrow="Área privada">
      <p className="text-body-lg max-w-2xl text-text-secondary">Gestiona las herramientas internas de VitaBlue desde un único espacio.</p>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/backoffice/marketing-studio" className="group rounded-3xl border border-primary/15 bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><Megaphone /></span><span className="text-caption font-bold uppercase tracking-widest text-brand-cyan">Activo</span></div>
          <h2 className="text-h2 mt-8">Marketing Studio</h2><p className="text-body-reg mt-2 text-white/75">Identidad, perfiles sociales, campañas y conexiones.</p><span className="mt-6 inline-block text-sm font-bold text-brand-cyan">Abrir módulo →</span>
        </Link>
        <Link to="/backoffice/marketing-studio/identidad-de-marca" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"><Palette /></span><h2 className="text-h3 mt-8 text-text-main">Identidad de marca</h2><p className="text-body-reg mt-2 text-text-secondary">Gestiona logos, colores y recursos de VitaBlue.</p><span className="mt-6 inline-block text-sm font-bold text-primary">Gestionar →</span></Link>
        <Link to="/backoffice/marketing-studio/campanas" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex size-12 items-center justify-center rounded-2xl bg-brand-cyan/20 text-primary"><BarChart3 /></span><h2 className="text-h3 mt-8 text-text-main">Campañas</h2><p className="text-body-reg mt-2 text-text-secondary">Crea, organiza y prepara campañas multicanal.</p><span className="mt-6 inline-block text-sm font-bold text-primary">Ver campañas →</span></Link>
        <Link to="/backoffice/marketing-studio/perfiles-sociales" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><ShieldCheck /></span><h2 className="text-h3 mt-8 text-text-main">Perfiles sociales</h2><p className="text-body-reg mt-2 text-text-secondary">Mantén los perfiles oficiales sincronizados.</p><span className="mt-6 inline-block text-sm font-bold text-primary">Gestionar →</span></Link>
        <Link to="/backoffice/marketing-studio/conexiones" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex size-12 items-center justify-center rounded-2xl bg-vb-gold/10 text-accent"><PlugZap /></span><h2 className="text-h3 mt-8 text-text-main">Conexiones</h2><p className="text-body-reg mt-2 text-text-secondary">Revisa las cuentas conectadas y sus permisos.</p><span className="mt-6 inline-block text-sm font-bold text-primary">Configurar →</span></Link>
        <Link to="/backoffice/catalogo" className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"><span className="flex size-12 items-center justify-center rounded-2xl bg-accent/10 text-accent"><PackageSearch /></span><h2 className="text-h3 mt-8 text-text-main">Catálogo de productos</h2><p className="text-body-reg mt-2 text-text-secondary">Consulta productos, variantes y datos pendientes de verificación.</p><span className="mt-6 inline-block text-sm font-bold text-primary">Abrir catálogo →</span></Link>
      </section>
    </BackofficeShell>
  </>
);

export default BackofficeHome;
