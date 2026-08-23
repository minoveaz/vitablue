import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { RulesConfigPanel } from '@/features/document-intelligence/components/RulesConfigPanel';

const DocumentIntelligenceRules: React.FC = () => (
  <>
    <Helmet>
      <title>Reglas y validación | Document Intelligence</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <BackofficeShell
      title="Reglas y validación"
      eyebrow="Document Intelligence"
      breadcrumbs={['Document Intelligence', 'Reglas y validación']}
      actionsSlot={
        <Link
          to="/backoffice/tools/document-intelligence"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-primary/30 hover:text-primary"
        >
          <ArrowLeft className="size-4" /> Volver al hub
        </Link>
      }
    >
      <RulesConfigPanel />
    </BackofficeShell>
  </>
);

export default DocumentIntelligenceRules;
