import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Megaphone, Wrench } from 'lucide-react';
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
        <Link to="/backoffice/tools" className="group rounded-3xl border border-brand-cyan/20 bg-gradient-to-br from-[#075985] to-primary p-6 text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/15"><Wrench /></span><span className="text-caption font-bold uppercase tracking-widest text-brand-cyan">Transversal</span></div>
          <h2 className="text-h2 mt-8">Tools</h2><p className="text-body-reg mt-2 text-white/75">Capacidades compartidas como Document Intelligence y futuras herramientas operativas.</p><span className="mt-6 inline-block text-sm font-bold text-brand-cyan">Abrir suite →</span>
        </Link>
      </section>
    </BackofficeShell>
  </>
);

export default BackofficeHome;
