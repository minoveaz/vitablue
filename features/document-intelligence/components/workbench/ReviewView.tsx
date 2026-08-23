import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  ClipboardCheck,
  FileScan,
  Plus,
  RefreshCw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { DocumentExtractionResult, IdentityDocumentFields } from '../../types';
import type { FieldKey } from '../../fieldLabels';
import type { ValidationAlert } from '../../rules/types';
import { EXPORT_PROFILES } from '../../exportProfiles';
import { ValidationAlertsCard } from '../ValidationAlertsCard';
import { ExtractedField } from './ExtractedField';

export const TelemetryAccordion: React.FC<{
  usage: DocumentExtractionResult['usage'] | null;
}> = ({ usage }) => {
  const [open, setOpen] = useState(false);
  if (!usage) return null;

  return (
    <div className="border-t border-slate-200 bg-slate-50/70 p-3.5">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-xs font-bold text-slate-600 hover:text-primary transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          Telemetría IA:{' '}
          <span className="font-semibold text-slate-800">
            {usage.totalTokens.toLocaleString('es-ES')} tokens (${usage.estimatedCostUsd.toFixed(5)})
          </span>
        </span>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-200">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens de Entrada</th>
                <td className="py-1 text-right font-bold text-slate-800">
                  {usage.promptTokens.toLocaleString('es-ES')}
                </td>
              </tr>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens de Salida</th>
                <td className="py-1 text-right font-bold text-slate-800">
                  {usage.outputTokens.toLocaleString('es-ES')}
                </td>
              </tr>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens Totales</th>
                <td className="py-1 text-right font-bold text-slate-800">
                  {usage.totalTokens.toLocaleString('es-ES')}
                </td>
              </tr>
              <tr>
                <th className="pt-1.5 text-left font-bold text-slate-600">Coste estimado</th>
                <td className="pt-1.5 text-right font-black text-primary">
                  USD {usage.estimatedCostUsd.toFixed(6)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const ReviewView: React.FC<{
  file: File | null;
  backFile?: File | null;
  documentMode?: 'single' | 'dual';
  activeViewerSide?: 'front' | 'back';
  onToggleViewerSide?: (side: 'front' | 'back') => void;
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  issues: Partial<Record<FieldKey, string>>;
  validationAlerts?: ValidationAlert[];
  usage: DocumentExtractionResult['usage'] | null;
  exportProfile: string;
  isSwitchingProfile?: boolean;
  activeHighlightField?: FieldKey | null;
  onHighlightField?: (key: FieldKey | null) => void;
  onExportProfileChange: (id: string) => void;
  onFieldChange: (key: FieldKey, value: string | null) => void;
  viewer: React.ReactNode;
  copy: (value: string | null | undefined, label: string) => void;
  copyAllAsText: () => void;
  copyAllAsJson: () => void;
  restoreField: (key: FieldKey) => void;
  onApprove: () => void;
  onReject: () => void;
  onNewDocument: () => void;
  warning: boolean;
  issueCount: number;
}> = ({
  file,
  backFile,
  documentMode,
  activeViewerSide = 'front',
  onToggleViewerSide,
  fields,
  rawFields,
  issues,
  validationAlerts,
  usage,
  exportProfile,
  isSwitchingProfile = false,
  activeHighlightField,
  onHighlightField,
  onExportProfileChange,
  onFieldChange,
  viewer,
  copy,
  copyAllAsText,
  copyAllAsJson,
  restoreField,
  onApprove,
  onReject,
  onNewDocument,
  warning,
  issueCount,
}) => (
  <section className="grid h-full min-h-0 flex-1 grid-cols-1 gap-5 overflow-hidden pb-4 lg:grid-cols-2 lg:items-stretch">
    {/* Columna Izquierda: Visor de documento */}
    <div className="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileScan className="size-4 text-primary" />
          <h3 className="text-sm font-black text-slate-800">Documento original</h3>
        </div>
        <div className="flex items-center gap-2">
          {backFile && (
            <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => onToggleViewerSide?.('front')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  activeViewerSide === 'front'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🪪 Anverso
              </button>
              <button
                type="button"
                onClick={() => onToggleViewerSide?.('back')}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  activeViewerSide === 'back'
                    ? 'bg-white text-primary shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔄 Reverso
              </button>
            </div>
          )}
          {file && (
            <span className="max-w-[160px] truncate text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              {activeViewerSide === 'back' && backFile ? backFile.name : file.name}
            </span>
          )}
        </div>
      </div>
      <div className="flex min-h-0 flex-1 bg-slate-50 p-3">{viewer}</div>
    </div>

    {/* Columna Derecha: Formulario estructurado en 3 bloques semánticos */}
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header del formulario con Selector de Perfil y Copia masiva */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3 bg-slate-50/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-800">Datos extraídos</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <Check className="size-3 text-emerald-600" /> OCR: 98%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Revisa, ajusta si es necesario y valida los campos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de Perfil de Destino */}
          <div
            className={`flex items-center gap-1.5 rounded-lg border transition-all duration-200 bg-white px-2.5 py-1 shadow-2xs ${
              isSwitchingProfile
                ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                : 'border-slate-200'
            }`}
          >
            <span className="text-[10px] font-black uppercase text-slate-400">Perfil:</span>
            {isSwitchingProfile && <RefreshCw className="size-3 text-primary animate-spin" />}
            <select
              value={exportProfile}
              onChange={(e) => onExportProfileChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
              title="Selecciona el formato de exportación al copiar"
            >
              {EXPORT_PROFILES.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.icon} {profile.shortLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={copyAllAsText}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary-dark transition-colors"
            title="Copiar todos los campos según el perfil de destino seleccionado"
          >
            <ClipboardCheck className="size-3.5" /> Copiar todo
          </button>
          <button
            type="button"
            onClick={copyAllAsJson}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            title="Copiar en formato JSON"
          >
            JSON
          </button>
        </div>
      </div>

      {/* Diagnóstico de Negocio & Validaciones */}
      {validationAlerts && (
        <div className="px-5 pt-3">
          <ValidationAlertsCard
            alerts={validationAlerts}
            onFieldFocus={(key) => onHighlightField?.(key as FieldKey)}
          />
        </div>
      )}

      {/* Banners de estado / advertencia */}
      {warning && (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs font-bold text-amber-800">
          La extracción requiere revisión. Los datos son editables.
        </div>
      )}
      {issueCount > 0 && (
        <div
          className="border-b border-red-200 bg-red-50 px-5 py-2 text-xs font-bold text-red-800"
          role="alert"
        >
          {issueCount} {issueCount === 1 ? 'campo requiere' : 'campos requieren'} corrección de
          formato.
        </div>
      )}

      {/* Contenedor del Formulario con 3 Secciones Semánticas y Transición con Blur Blanco */}
      <div className="relative overflow-hidden min-h-[420px]">
        {isSwitchingProfile && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/85 backdrop-blur-md transition-all duration-300">
            <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-lg border border-slate-200/80 ring-1 ring-slate-100">
              <RefreshCw className="size-4 animate-spin text-primary" />
              <span className="text-xs font-bold text-slate-800">
                Aplicando formato:{' '}
                {EXPORT_PROFILES.find((p) => p.id === exportProfile)?.shortLabel || 'Aseguradora'}
                ...
              </span>
            </div>
          </div>
        )}
        <div
          className={`flex flex-col gap-4 p-5 overflow-y-auto transition-all duration-300 ease-out ${
            isSwitchingProfile
              ? 'opacity-15 scale-[0.99] filter blur-sm select-none pointer-events-none'
              : 'opacity-100 scale-100 filter blur-0'
          }`}
        >
          {/* Bloque 1: 👤 Identidad Principal (Dinámico según Perfil de Aseguradora/Destino) */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                👤 Identidad Principal
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full transition-all duration-200">
                {isSwitchingProfile ? (
                  <>
                    <RefreshCw className="size-2.5 animate-spin text-primary" />
                    <span>Adaptando esquema...</span>
                  </>
                ) : exportProfile === 'aseguradora-1' ? (
                  'Formato: Apellidos separados (1º y 2º)'
                ) : exportProfile === 'aseguradora-2' ? (
                  'Formato: Apellidos agrupados'
                ) : (
                  'Formato: ICAO Internacional'
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ExtractedField
                label={
                  exportProfile === 'icao-internacional' ? 'Document Number' : 'Número de documento'
                }
                fieldKey="documentNumber"
                value={fields.documentNumber}
                rawVal={rawFields.documentNumber}
                issue={issues.documentNumber}
                isCritical
                isHighlighted={activeHighlightField === 'documentNumber'}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              {fields.documentType === 'spanish-dni' ||
              fields.documentType === 'spanish-nie' ||
              fields.supportNumber ||
              documentMode === 'dual' ? (
                <ExtractedField
                  label="Número de soporte (IDESP)"
                  fieldKey="supportNumber"
                  value={fields.supportNumber}
                  rawVal={rawFields.supportNumber}
                  issue={issues.supportNumber}
                  isHighlighted={activeHighlightField === 'supportNumber'}
                  onHighlight={onHighlightField}
                  onChange={onFieldChange}
                  onCopy={copy}
                  onRestore={restoreField}
                />
              ) : (
                <ExtractedField
                  label={
                    exportProfile === 'icao-internacional'
                      ? 'Nationality / Country'
                      : 'Nacionalidad'
                  }
                  fieldKey="nationality"
                  value={fields.nationality}
                  rawVal={rawFields.nationality}
                  issue={issues.nationality}
                  isHighlighted={activeHighlightField === 'nationality'}
                  onHighlight={onHighlightField}
                  onChange={onFieldChange}
                  onCopy={copy}
                  onRestore={restoreField}
                />
              )}

              {(fields.documentType === 'spanish-dni' ||
                fields.documentType === 'spanish-nie' ||
                fields.supportNumber ||
                documentMode === 'dual') && (
                <ExtractedField
                  label={
                    exportProfile === 'icao-internacional'
                      ? 'Nationality / Country'
                      : 'Nacionalidad'
                  }
                  fieldKey="nationality"
                  value={fields.nationality}
                  rawVal={rawFields.nationality}
                  issue={issues.nationality}
                  isHighlighted={activeHighlightField === 'nationality'}
                  onHighlight={onHighlightField}
                  className="sm:col-span-2"
                  onChange={onFieldChange}
                  onCopy={copy}
                  onRestore={restoreField}
                />
              )}

              {exportProfile === 'aseguradora-1' ? (
                <>
                  <ExtractedField
                    label="Nombre(s)"
                    fieldKey="givenNames"
                    value={fields.givenNames}
                    rawVal={rawFields.givenNames}
                    issue={issues.givenNames}
                    isHighlighted={activeHighlightField === 'givenNames'}
                    onHighlight={onHighlightField}
                    className="sm:col-span-2"
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />

                  <ExtractedField
                    label="Primer apellido"
                    fieldKey="firstSurname"
                    value={fields.firstSurname}
                    rawVal={rawFields.firstSurname}
                    issue={issues.firstSurname}
                    isHighlighted={
                      activeHighlightField === 'firstSurname' || activeHighlightField === 'surnames'
                    }
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />

                  <ExtractedField
                    label="Segundo apellido"
                    fieldKey="secondSurname"
                    value={fields.secondSurname}
                    rawVal={rawFields.secondSurname}
                    issue={issues.secondSurname}
                    isHighlighted={
                      activeHighlightField === 'secondSurname' || activeHighlightField === 'surnames'
                    }
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />
                </>
              ) : exportProfile === 'aseguradora-2' ? (
                <>
                  <ExtractedField
                    label="Nombre(s)"
                    fieldKey="givenNames"
                    value={fields.givenNames}
                    rawVal={rawFields.givenNames}
                    issue={issues.givenNames}
                    isHighlighted={activeHighlightField === 'givenNames'}
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />

                  <ExtractedField
                    label="Apellidos (Completos)"
                    fieldKey="surnames"
                    value={fields.surnames}
                    rawVal={rawFields.surnames}
                    issue={issues.surnames}
                    isHighlighted={
                      activeHighlightField === 'surnames' ||
                      activeHighlightField === 'firstSurname' ||
                      activeHighlightField === 'secondSurname'
                    }
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />
                </>
              ) : (
                <>
                  <ExtractedField
                    label="Given Names"
                    fieldKey="givenNames"
                    value={fields.givenNames}
                    rawVal={rawFields.givenNames}
                    issue={issues.givenNames}
                    isHighlighted={activeHighlightField === 'givenNames'}
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />

                  <ExtractedField
                    label="Surnames"
                    fieldKey="surnames"
                    value={fields.surnames}
                    rawVal={rawFields.surnames}
                    issue={issues.surnames}
                    isHighlighted={
                      activeHighlightField === 'surnames' ||
                      activeHighlightField === 'firstSurname' ||
                      activeHighlightField === 'secondSurname'
                    }
                    onHighlight={onHighlightField}
                    onChange={onFieldChange}
                    onCopy={copy}
                    onRestore={restoreField}
                  />
                </>
              )}
            </div>
          </div>

          {/* Bloque 2: 📅 Fechas, Domicilio y Demografía */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
            <div className="mb-3.5 flex items-center gap-2 border-b border-slate-200/60 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                📅 Fechas, Domicilio y Vigencia
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <ExtractedField
                label="Fecha de nacimiento"
                fieldKey="birthDate"
                value={fields.birthDate}
                rawVal={rawFields.birthDate}
                issue={issues.birthDate}
                isHighlighted={activeHighlightField === 'birthDate'}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              <ExtractedField
                label="Sexo"
                fieldKey="sex"
                value={fields.sex}
                rawVal={rawFields.sex}
                issue={issues.sex}
                isHighlighted={activeHighlightField === 'sex'}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              <ExtractedField
                label="Lugar de nacimiento"
                fieldKey="birthplace"
                value={fields.birthplace}
                rawVal={rawFields.birthplace}
                issue={issues.birthplace}
                isHighlighted={activeHighlightField === 'birthplace'}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              <ExtractedField
                label="Fecha de expedición"
                fieldKey="issueDate"
                value={fields.issueDate}
                rawVal={rawFields.issueDate}
                issue={issues.issueDate}
                isHighlighted={activeHighlightField === 'issueDate'}
                onHighlight={onHighlightField}
                className="sm:col-span-1"
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              <ExtractedField
                label="Fecha de caducidad"
                fieldKey="expiryDate"
                value={fields.expiryDate}
                rawVal={rawFields.expiryDate}
                issue={issues.expiryDate}
                isHighlighted={activeHighlightField === 'expiryDate'}
                onHighlight={onHighlightField}
                className="sm:col-span-2"
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />

              {(fields.address ||
                documentMode === 'dual' ||
                fields.documentType === 'spanish-dni' ||
                fields.documentType === 'spanish-nie') && (
                <ExtractedField
                  label="Domicilio / Dirección"
                  fieldKey="address"
                  value={fields.address}
                  rawVal={rawFields.address}
                  issue={issues.address}
                  isHighlighted={activeHighlightField === 'address'}
                  onHighlight={onHighlightField}
                  className="sm:col-span-3"
                  onChange={onFieldChange}
                  onCopy={copy}
                  onRestore={restoreField}
                />
              )}
            </div>
          </div>

          {/* Bloque 3: 🔏 Control Técnico & Zona MRZ */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4">
            <div className="mb-3.5 flex items-center justify-between border-b border-slate-200/60 pb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                🔏 Datos Técnicos y Zona MRZ (ICAO TD3)
              </span>
              <span className="text-[10px] font-bold text-slate-400">Machine Readable Zone</span>
            </div>

            <div
              className="group relative"
              onMouseEnter={() => onHighlightField?.('mrz')}
              onMouseLeave={() => onHighlightField?.(null)}
            >
              <textarea
                id="field-input-mrz"
                rows={2}
                value={fields.mrz ?? ''}
                onFocus={() => onHighlightField?.('mrz')}
                onBlur={() => onHighlightField?.(null)}
                onChange={(event) => onFieldChange('mrz', event.target.value || null)}
                placeholder="P<ESP..."
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs leading-relaxed outline-none transition-all font-mono tracking-wider resize-none pr-8 ${
                  issues.mrz
                    ? 'border-red-300 bg-red-50/20 focus:border-red-500'
                    : activeHighlightField === 'mrz'
                      ? 'border-cyan-400 bg-cyan-50/30 ring-2 ring-cyan-200 shadow-xs'
                      : fields.mrz !== rawFields.mrz
                        ? 'border-sky-400 bg-sky-50/20 focus:border-sky-500'
                        : 'border-slate-200 hover:border-slate-300 focus:border-primary'
                }`}
                style={{
                  fontFamily: "'SF Mono', 'Roboto Mono', 'Fira Code', ui-monospace, monospace",
                }}
              />
              <button
                type="button"
                aria-label="Copiar código MRZ"
                title="Copiar código MRZ"
                onClick={() => copy(fields.mrz, 'Código MRZ')}
                className="absolute right-2 top-2.5 flex size-7 items-center justify-center rounded text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-slate-100 hover:text-primary transition-all"
              >
                <Clipboard className="size-3.5" />
              </button>
            </div>

            {fields.mrz !== rawFields.mrz && (
              <div className="mt-1 flex items-center justify-between rounded bg-sky-50 px-2 py-0.5 text-[10px] text-slate-600">
                <span className="truncate">
                  ↺ Modificado (Original:{' '}
                  <span className="font-semibold text-slate-800">{rawFields.mrz ?? 'vacío'}</span>)
                </span>
                <button
                  type="button"
                  onClick={() => restoreField('mrz')}
                  className="ml-2 shrink-0 font-bold text-primary hover:text-primary-dark underline"
                >
                  Restaurar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Telemetría IA colapsable */}
      <TelemetryAccordion usage={usage} />

      {/* Barra de Acciones de Decisión (Footer operativo) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
            title="Rechazar y descartar este documento"
          >
            <XCircle className="size-4" /> Rechazar documento
          </button>
          <button
            type="button"
            onClick={onNewDocument}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Plus className="size-4" /> Extraer nuevo
          </button>
        </div>

        <button
          type="button"
          onClick={onApprove}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-black text-white shadow hover:bg-primary-dark transition-colors"
        >
          <CheckCircle2 className="size-4" /> Aprobar extracción{' '}
          <span className="opacity-70 text-[10px] font-normal tracking-wide">(⌘+↵)</span>
        </button>
      </div>
    </div>
  </section>
);
