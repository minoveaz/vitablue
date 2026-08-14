import React, { useEffect, useMemo, useState } from 'react';
import { Check, Clipboard, FileScan, RefreshCcw, Sparkles, Trash2, Upload, X } from 'lucide-react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { passportExtractionFixture } from '@/features/document-intelligence/fixtures';
import { emptyIdentityDocumentFields, type IdentityDocumentFields } from '@/features/document-intelligence/types';

const fieldLabels: Array<{ key: keyof IdentityDocumentFields; label: string }> = [
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
  const [isExtracting, setIsExtracting] = useState(false);
  const [hasExtracted, setHasExtracted] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const validationIssues = useMemo(() => {
    const issues: string[] = [];
    if (fields.documentNumber && !/^[A-Z0-9-]{5,20}$/i.test(fields.documentNumber)) issues.push('Revisa el formato del número de documento.');
    if (fields.birthDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.birthDate)) issues.push('La fecha de nacimiento debe usar AAAA-MM-DD.');
    if (fields.expiryDate && !/^\d{4}-\d{2}-\d{2}$/.test(fields.expiryDate)) issues.push('La fecha de caducidad debe usar AAAA-MM-DD.');
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
    setHasExtracted(false);
    setNotice('Documento cargado en la sesión temporal.');
  };

  const extractFixture = () => {
    setIsExtracting(true);
    setNotice('Preparando extracción…');
    window.setTimeout(() => {
      setFields({ ...passportExtractionFixture.fields });
      setHasExtracted(true);
      setIsExtracting(false);
      setNotice('Extracción completada. Revisa y corrige los campos antes de copiarlos.');
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
    setHasExtracted(false);
    setNotice('Sesión documental limpiada.');
  };

  return (
    <BackofficeShell title="Document Intelligence" eyebrow="Operaciones documentales">
      <div className="flex min-h-full flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{`{Split workspace}`}</p>
            <h2 className="mt-1 font-display text-2xl font-black text-slate-900">Revisión de identidad</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">Extrae datos de un documento, revisa los valores y prepara una copia para el sistema de gestión.</p>
          </div>
          <button type="button" onClick={clearSession} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600"><Trash2 className="size-4" /> Limpiar sesión</button>
        </div>

        <div className="grid min-h-[620px] flex-1 gap-4 xl:grid-cols-[minmax(220px,0.7fr)_minmax(420px,1.6fr)_minmax(230px,0.7fr)]">
          <aside className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><h3 className="text-sm font-black text-slate-800">Documento fuente</h3><FileScan className="size-4 text-primary" /></div>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-primary/35 bg-white p-5 text-center transition hover:border-primary hover:bg-primary/[0.03]">
                <Upload className="size-7 text-primary" />
                <span className="mt-3 text-sm font-bold text-slate-800">Subir documento</span>
                <span className="mt-1 text-xs text-slate-500">JPG, PNG o PDF de una página</span>
                <input type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only" onChange={(event) => handleFile(event.target.files?.[0] ?? null)} />
              </label>
              {previewUrl ? <img src={previewUrl} alt="Vista previa del documento cargado" className="max-h-72 w-full rounded-lg border border-slate-200 bg-white object-contain p-2" /> : file ? <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600">Vista previa PDF pendiente de soporte del visor.<br /><strong className="mt-1 block break-all text-slate-800">{file.name}</strong></div> : <div className="flex flex-1 items-center justify-center text-center text-xs text-slate-400">La vista previa aparecerá aquí durante toda la revisión.</div>}
              {file && <button type="button" onClick={extractFixture} disabled={isExtracting} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-black text-white transition hover:bg-primary-dark disabled:cursor-wait disabled:opacity-60"><Sparkles className="size-4" /> {isExtracting ? 'Extrayendo…' : 'Probar extracción'}</button>}
              <p className="text-[11px] leading-relaxed text-slate-400">La extracción de esta POC no verifica autenticidad. Los datos permanecen en la sesión local.</p>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3"><div><h3 className="text-sm font-black text-slate-800">Campos extraídos</h3><p className="text-xs text-slate-500">Edita cualquier valor antes de copiarlo.</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${hasExtracted ? 'bg-brand-cyan/20 text-primary' : 'bg-slate-100 text-slate-500'}`}>{hasExtracted ? 'Revisión' : 'Esperando documento'}</span></div>
            <div className="grid flex-1 content-start gap-4 overflow-y-auto p-5 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">Tipo de documento<input value={fields.documentType ?? ''} readOnly className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-700" /></label>
              <label className="text-xs font-bold text-slate-600">País emisor<input value={fields.issuingCountry ?? ''} onChange={(e) => setFields((current) => ({ ...current, issuingCountry: e.target.value || null }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" /></label>
              {fieldLabels.map(({ key, label }) => <label key={key} className={`text-xs font-bold text-slate-600 ${key === 'mrz' ? 'sm:col-span-2' : ''}`}>{label}<div className="mt-1 flex gap-2"><input value={fields[key] ?? ''} onChange={(e) => setFields((current) => ({ ...current, [key]: e.target.value || null }))} className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-normal text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" /><button type="button" aria-label={`Copiar ${label}`} title={`Copiar ${label}`} onClick={() => copyValue(fields[key], label)} className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-primary hover:text-primary"><Clipboard className="size-4" /></button></div></label>)}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3"><span className="text-xs text-slate-500">{notice || 'Los campos ausentes se conservan como null.'}</span><button type="button" onClick={() => copyValue(JSON.stringify(fields, null, 2), 'Todos los campos')} disabled={!hasExtracted} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-40"><Clipboard className="size-4" /> Copiar todo</button></div>
          </section>

          <aside className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3"><h3 className="text-sm font-black text-slate-800">Validación</h3>{validationIssues.length ? <X className="size-4 text-red-500" /> : <Check className="size-4 text-emerald-600" />}</div>
            <div className="flex flex-1 flex-col gap-4 p-4"><div className={`rounded-lg border p-3 text-xs leading-relaxed ${validationIssues.length ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{validationIssues.length ? validationIssues.join(' ') : hasExtracted ? 'No se han detectado errores de formato en los campos revisados.' : 'La validación se activará cuando exista una extracción.'}</div><div className="rounded-lg border border-slate-200 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Estado de confianza</p><p className="mt-2 text-sm font-bold text-slate-800">{hasExtracted ? 'Revisión humana requerida' : 'Sin resultado'}</p><p className="mt-1 text-xs leading-relaxed text-slate-500">La confianza orienta la revisión, pero no demuestra autenticidad.</p></div><div className="mt-auto border-t border-slate-200 pt-4 text-xs leading-relaxed text-slate-500"><RefreshCcw className="mb-2 size-4 text-primary" />El endpoint Gemini se conectará después detrás del backend, sin exponer credenciales en el navegador.</div></div>
          </aside>
        </div>
      </div>
    </BackofficeShell>
  );
};

export default DocumentIntelligence;