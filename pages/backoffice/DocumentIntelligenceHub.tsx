import React from 'react';
import { Building2, FileScan, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';

const cards = [
  {
    to: '/backoffice/tools/document-intelligence/reglas',
    title: 'Reglas y validación',
    description: 'Configura las comprobaciones de identidad, póliza y requisitos de visado.',
    icon: SlidersHorizontal,
    tone: 'bg-primary/10 text-primary',
  },
  {
    to: '/backoffice/tools/document-intelligence/perfiles',
    title: 'Perfiles de aseguradora',
    description: 'Define el formato de exportación y el mapeo de campos para cada aseguradora.',
    icon: Building2,
    tone: 'bg-brand-cyan/20 text-primary',
  },
  {
    to: '/backoffice/tools/document-intelligence/extraccion',
    title: 'Extracciones',
    description: 'Consulta el historial de documentos procesados o inicia una extracción nueva.',
    icon: FileScan,
    tone: 'bg-accent/15 text-accent',
  },
];

const DocumentIntelligenceHub: React.FC = () => (
  <>
    <Helmet>
      <title>Document Intelligence | VitaBlue</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <BackofficeShell
      title="Document Intelligence"
      eyebrow="Herramientas IA"
      breadcrumbs={['Tools', 'Document Intelligence']}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-body-lg text-text-secondary">
            Centraliza la configuración y operación de lectura inteligente de documentos.
          </p>
        </div>
        <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3" aria-label="Módulos de Document Intelligence">
          {cards.map(({ to, title, description, icon: Icon, tone }) => (
            <Link
              key={to}
              to={to}
              className="group flex min-h-64 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <span className={`flex size-12 items-center justify-center rounded-2xl ${tone}`}>
                <Icon aria-hidden="true" />
              </span>
              <h2 className="text-h3 mt-6 text-text-main">{title}</h2>
              <p className="text-body-reg mt-2 flex-1 text-text-secondary">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Abrir módulo <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </section>
      </div>
    </BackofficeShell>
  </>
);

export default DocumentIntelligenceHub;
