import React from 'react';
import { FileScan, Wrench } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';

const ToolsHome: React.FC = () => (
  <>
    <Helmet>
      <title>Tools | VitaBlue</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <BackofficeShell title="Tools" eyebrow="Capacidades transversales">
      <div className="mx-auto w-full max-w-5xl">
        <div className="max-w-2xl">
          <p className="text-body-lg text-text-secondary">
            Herramientas compartidas por las distintas áreas del backoffice.
          </p>
        </div>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/backoffice/tools/document-intelligence"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileScan />
            </span>
            <div className="mt-6 flex items-center gap-2">
              <h2 className="text-h3 text-text-main">Document Intelligence</h2>
              <span className="rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-primary">
                POC
              </span>
            </div>
            <p className="text-body-reg mt-2 text-text-secondary">
              Extrae y revisa datos de documentos de identidad con asistencia de IA.
            </p>
            <span className="mt-6 inline-block text-sm font-bold text-primary">
              Abrir herramienta →
            </span>
          </Link>
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-400">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
              <Wrench />
            </span>
            <h2 className="text-h3 mt-6 text-slate-500">Más herramientas</h2>
            <p className="text-body-reg mt-2">
              Este espacio crecerá con capacidades transversales del backoffice.
            </p>
          </div>
        </section>
      </div>
    </BackofficeShell>
  </>
);

export default ToolsHome;
