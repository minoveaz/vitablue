import React, { useEffect, useState } from 'react';
import { ArrowRight, FileScan, Plus, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import {
  getExtractionHistory,
  removeExtractionHistory,
  type ExtractionHistoryRecord,
} from '@/features/document-intelligence/history';

const DocumentIntelligenceExtractions: React.FC = () => {
  const [records, setRecords] = useState<ExtractionHistoryRecord[]>([]);

  useEffect(() => {
    setRecords(getExtractionHistory());
  }, []);

  const handleRemove = (id: string) => {
    removeExtractionHistory(id);
    setRecords((current) => current.filter((record) => record.id !== id));
  };

  return (
    <>
      <Helmet>
        <title>Extracciones | Document Intelligence</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <BackofficeShell
        title="Extracciones"
        eyebrow="Document Intelligence"
        breadcrumbs={['Document Intelligence', 'Extracciones']}
        actionsSlot={
          <Link
            to="/backoffice/tools/document-intelligence/extraccion/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Plus className="size-4" /> Iniciar extracción
          </Link>
        }
      >
        <div className="mx-auto w-full max-w-6xl">
          {records.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <FileScan aria-hidden="true" />
              </span>
              <h2 className="text-h3 mt-5 text-slate-900">Aún no hay extracciones</h2>
              <p className="text-body-reg mt-2 max-w-md text-slate-500">
                Procesa un documento para ver aquí su resultado y poder revisarlo más tarde.
              </p>
              <Link
                to="/backoffice/tools/document-intelligence/extraccion/new"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary-dark"
              >
                <Plus className="size-4" /> Iniciar extracción
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {records.map((record) => (
                  <div key={record.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FileScan className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/backoffice/tools/document-intelligence/extraccion/${record.id}`}
                        className="truncate text-sm font-black text-slate-800 hover:text-primary"
                      >
                        {record.fileName}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(record.createdAt).toLocaleString('es-ES')}
                        {record.hasWarnings && <span className="ml-2 font-bold text-amber-700">· Con advertencias</span>}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/backoffice/tools/document-intelligence/extraccion/${record.id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-primary/30 hover:text-primary"
                      >
                        Revisar <ArrowRight className="size-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRemove(record.id)}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-600"
                        aria-label={`Eliminar extracción ${record.fileName}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </BackofficeShell>
    </>
  );
};

export default DocumentIntelligenceExtractions;
