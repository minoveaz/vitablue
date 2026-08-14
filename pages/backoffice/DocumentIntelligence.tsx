import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, Crop, FileScan, RotateCcw, Sparkles, Trash2, Upload, X } from 'lucide-react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { passportExtractionFixture } from '@/features/document-intelligence/fixtures';
import { emptyIdentityDocumentFields, type IdentityDocumentFields } from '@/features/document-intelligence/types';

type WorkspaceState = 'preparation' | 'processing' | 'review' | 'review-with-warnings';
type FieldKey = keyof IdentityDocumentFields;

const fieldLabels: Array<{ key: FieldKey; label: string }> = [
  { key: 'fullName', label: 'Nombre completo' },
  { key: 'givenNames', label: 'Nombre' },
  { key: 'surnames', label: 'Apellidos' },
  { key: 'documentNumber', label: 'Número de documento' },
  { key: 'birthDate', label: 'Fecha de nacimiento' },
  { key: 'nationality', label: 'Nacionalidad' },
  { key: 'sex', label: 'Sexo' },
  { key: 'issueDate', label: 'Fecha de expedición' },
  { key: 'expiryDate', label: 'Fecha de caducidad' },
  { key: 'birthplace', label: 'Lugar de nacimiento' },
  { key: 'mrz', label: 'MRZ' },
];

const DocumentIntelligence: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<IdentityDocumentFields>(emptyIdentityDocumentFields);
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>('preparation');
  const [rotation, setRotation] = useState(0);
  const [isCropMode, setIsCropMode] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldKey | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const validationIssues = useMemo(() => {
    const issues: Partial<Record<FieldKey, string>> = {};
    if (fields.documentNumber && !/^[A-Z0-9-]{5,20}$/i.test(fields.documentNumber)) issues.documentNumber = 'Revisa el formato del número de documento.';
    if (fields.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.birthDate)) issues.birthDate = 'Usa el formato AAAA-MM-DD.';
    if (fields.expiryDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.expiryDate)) issues.expiryDate = 'Usa el formato AAAA-MM-DD.';
    return issues;
  }, [fields]);

  const handleFile = (nextFile: File | null) => {
    if (!nextFile) return;
    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(nextFile.type)) {
      setNotice('Formato no compatible. Usa JPG, PNG o PDF.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(nextFile);
    setPreviewUrl(nextFile.type === 'application/pdf' ? null : URL.createObjectURL(nextFile));
    setFields(emptyIdentityDocumentFields());
    setWorkspaceState('preparation');
    setSelectedField(null);
    setRotation(0);
    setNotice('Documento listo para preparar.');
  };

  const extractFixture = () => {
    if (!file || workspaceState === 'processing') return;
    setWorkspaceState('processing');
    setSelectedField(null);
    setNotice('Extrayendo y validando el documento…');
    window.setTimeout(() => {
      setFields({ ...passportExtractionFixture.fields });
      setWorkspaceState('review');
      setNotice('Extracción completada. Revisa los campos antes de copiarlos.');
    }, 450);
  };

  const copyValue = async (value: string | null, label: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setNotice(`${label} copiado.`);
  };

  const clearSession = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setFields(emptyIdentityDocumentFields());
    setWorkspaceState('preparation');
    setSelectedField(null);
    setRotation(0);
    setNotice('Sesión documental limpiada.');
  };

  const selectedLabel = fieldLabels.find(({ key }) => key === selectedField)?.label;
  const selectedIssue = selectedField ? validationIssues[selectedField] : null;
  const isReview = workspaceState === 'review' || workspaceState === 'review-with-warnings';

  return (
    <BackofficeShell title="Document Intelligence" eyebrow="Operaciones documentales">
      <div className="flex min-h-full flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{`{Document workspace}`}</p>
            <h2 className="mt-1 font-display text-2xl font-black text-slate-900">{isReview ? 'Revisión de identidad' : 'Preparar documento'}</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">{isReview ? 'Revisa los valores extraídos y corrige cualquier campo antes de copiarlo.' : 'Prepara el documento antes de enviarlo a extracción y validación.'}</p>
          </div>
          <button type="button" onClick={clearSession} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"><Trash2 className="size-4" /> Limpiar sesión</button>
        </div>

        <div className="grid min-h-[620px] flex-1 gap-4 xl:grid-cols-[minmax(260px,0.8fr)_minmax(420px,1.6fr)_minmax(250px,0.75fr)]">
          <aside className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><h3 className="text-sm font-black text-slate-800">Documento fuente</h3><FileScan className="size-4 text-primary" /></div>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/35 bg-white p-5 text-center transition hover:border-primary hover:bg-primary/[0.03]"><Upload className="size-7 text-primary" /><span className="mt-3 text-sm font-bold text-slate-800">{file ? 'Reemplazar documento' : 'Subir documento'}</span><span className="mt-1 text-xs text-slate-500">JPG, PNG o PDF de una página</span><input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} /></label>
              {previewUrl ? <div className={`flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-2 ${isCropMode ? 'ring-2 ring-primary ring-offset-2' : ''}`}><img src={previewUrl} alt="Vista previa del documento cargado" className="max-h-72 w-full object-contain transition-transform" style={{ transform: `rotate(${rotation}deg)` }} /></div> : file ? <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600">Vista previa PDF pendiente de soporte del visor.<br /><strong className="mt-1 block break-all text-slate-800">{file.name}</strong></div> : <div className="flex flex-1 items-center justify-center text-center text-xs text-slate-400">La vista previa aparecerá aquí.</div>}
              {file && <div className="flex gap-2"><button type="button" title="Rotar documento" aria-label="Rotar documento" onClick={() => setRotation((value) => (value + 90) % 360)} className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-primary hover:text-primary"><RotateCcw className="size-4" /></button><button type="button" title="Activar recorte" aria-label="Activar recorte" onClick={() => setIsCropMode((value) => !value)} className={`flex size-10 items-center justify-center rounded-lg border bg-white ${isCropMode ? 'border-primary text-primary' : 'border-slate-200 text-slate-500 hover:border-primary hover:text-primary'}`}><Crop className="size-4" /></button></div>}
              {file && !isReview && <button type="button" onClick={extractFixture} disabled={workspaceState === 'processing'} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-black text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"><Sparkles className="size-4" /> {workspaceState === 'processing' ? 'Procesando…' : 'Extraer y validar'}</button>}
              <p className="text-[11px] leading-relaxed text-slate-400">La extracción no verifica autenticidad. Los datos permanecen en la sesión local.</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3"><div><h3 className="text-sm font-black text-slate-800">{isReview ? 'Campos extraídos' : 'Documento preparado'}</h3><p className="text-xs text-slate-500">{isReview ? 'Selecciona un campo para ver su validación contextual.' : 'Comprueba el documento y continúa cuando esté listo.'}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${workspaceState === 'processing' ? 'bg-amber-100 text-amber-700' : isReview ? 'bg-brand-cyan/20 text-primary' : 'bg-slate-100 text-slate-500'}`}>{workspaceState === 'processing' ? 'Procesando' : workspaceState === 'preparation' ? 'Preparación' : workspaceState === 'review-with-warnings' ? 'Revisión con avisos' : 'Revisión'}</span></div>
            {!isReview ? <div className="flex flex-1 items-center justify-center p-8 text-center text-sm text-slate-500">{workspaceState === 'processing' ? <div><Sparkles className="mx-auto mb-3 size-8 animate-pulse text-primary" /><p className="font-bold text-slate-800">Extrayendo y validando</p><p className="mt-1 text-xs">La vista preparada se conservará durante el procesamiento.</p></div> : <div><FileScan className="mx-auto mb-3 size-10 text-slate-300" /><p className="font-bold text-slate-800">Listo para extraer</p><p className="mt-1 text-xs">La respuesta aparecerá aquí para revisión humana.</p></div>}</div> : <div className="grid flex-1 content-start gap-4 overflow-y-auto p-5 sm:grid-cols-2">{(['documentType', 'issuingCountry'] as FieldKey[]).map((key) => <label key={key} className="text-xs font-bold text-slate-600">{key === 'documentType' ? 'Tipo de documento' : 'País emisor'}<input value={fields[key] ?? ''} readOnly={key === 'documentType'} onFocus={() => setSelectedField(key)} onChange={(e) => setFields((current) => ({ ...current, [key]: e.target.value || null }))} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-700" /></label>)}{fieldLabels.map(({ key, label }) => <label key={key} className={`text-xs font-bold text-slate-600 ${key === 'mrz' ? 'sm:col-span-2' : ''}`} onClick={() => setSelectedField(key)}>{label}<div className="mt-1 flex gap-2"><input value={fields[key] ?? ''} onFocus={() => setSelectedField(key)} onChange={(e) => setFields((current) => ({ ...current, [key]: e.target.value || null }))} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" /><button type="button" aria-label={`Copiar ${label}`} title={`Copiar ${label}`} onClick={() => copyValue(fields[key], label)} className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-primary hover:text-primary"><Clipboard className="size-4" /></button></div></label>)}</div>}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-500">{notice || 'Los campos ausentes se conservan como null.'}</span><button type="button" onClick={() => copyValue(JSON.stringify(fields, null, 2), 'Todos los campos')} disabled={!isReview} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"><Clipboard className="size-4" /> Copiar todo</button></div>
          </section>

          {isReview && selectedField ? <aside className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50"><div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><h3 className="text-sm font-black text-slate-800">Validación de campo</h3>{selectedIssue ? <X className="size-4 text-red-500" /> : <Check className="size-4 text-emerald-600" />}</div><div className="flex flex-1 flex-col gap-4 p-4"><div className={`rounded-lg border p-3 text-xs leading-relaxed ${selectedIssue ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{selectedIssue ?? 'No se han detectado errores de formato en este campo.'}</div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Campo seleccionado</p><p className="mt-2 text-sm font-bold text-slate-800">{selectedLabel}</p><p className="mt-1 break-words text-xs text-slate-500">{fields[selectedField] ?? 'null'}</p></div><p className="mt-auto text-xs leading-relaxed text-slate-500">La validación orienta la revisión, pero no demuestra autenticidad.</p></div></aside> : <aside className="flex flex-col justify-end rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4"><p className="text-xs leading-relaxed text-slate-500">Selecciona un campo para consultar su validación, valor detectado y confianza.</p></aside>}
        </div>
      </div>
    </BackofficeShell>
  );
};

export default DocumentIntelligence;
