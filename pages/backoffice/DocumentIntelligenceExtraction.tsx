import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import BackofficeShell from '@/components/layouts/BackofficeShell';
import { extractDocumentWithTimeout } from '@/features/document-intelligence/extraction';
import { uploadAndExtractDualDocument } from '@/features/document-intelligence/supabase-service';
import {
  emptyIdentityDocumentFields,
  type DocumentExtractionResult,
  type IdentityDocumentFields,
  type DocumentBoundingBoxes,
} from '@/features/document-intelligence/types';
import {
  normalizeIdentityDocumentDates,
  validateIdentityDocumentFields,
} from '@/features/document-intelligence/validation';
import {
  EXPORT_PROFILES,
  DEFAULT_EXPORT_PROFILE_ID,
  formatFieldsForProfile,
  splitSurnames,
  buildSurnames,
} from '@/features/document-intelligence/exportProfiles';
import { getDocumentExtractionWarnings } from '@/features/document-intelligence/workflow';
import { supabase } from '@/marketing-studio/utils/supabaseClient';
import { evaluateRules } from '@/features/document-intelligence/rules/engine';
import { useRulesConfig } from '@/features/document-intelligence/rules/rulesStore';
import { getFieldLabel, type FieldKey } from '@/features/document-intelligence/fieldLabels';
import { getExtractionHistoryRecord, saveExtractionHistory } from '@/features/document-intelligence/history';

// Componentes modulares
import { DocumentViewer } from '@/features/document-intelligence/components/workbench/DocumentViewer';
import { CropEditorModal } from '@/features/document-intelligence/components/workbench/CropEditorModal';
import { PreparationView } from '@/features/document-intelligence/components/workbench/PreparationView';
import { ProcessingView } from '@/features/document-intelligence/components/workbench/ProcessingView';
import { ExtractionErrorView } from '@/features/document-intelligence/components/workbench/ExtractionErrorView';
import { ReviewView } from '@/features/document-intelligence/components/workbench/ReviewView';

const maxDocumentBytes = 10 * 1024 * 1024; // 10MB
const acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

type Stage = 'preparation' | 'processing' | 'error' | 'review' | 'review-with-warnings';

const DocumentIntelligence: React.FC = () => {
  const { extractionId } = useParams<{ extractionId: string }>();
  const navigate = useNavigate();
  const isNewExtraction = !extractionId || extractionId === 'new';
  const { config: rulesConfig } = useRulesConfig();
  const [stage, setStage] = useState<Stage>('preparation');
  const [file, setFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const documentMode: 'single' | 'dual' = backFile ? 'dual' : 'single';
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [activeViewerSide, setActiveViewerSide] = useState<'front' | 'back'>('front');
  const [fields, setFields] = useState<IdentityDocumentFields>(emptyIdentityDocumentFields);
  const [rawFields, setRawFields] = useState<IdentityDocumentFields>(emptyIdentityDocumentFields);
  const [boundingBoxes, setBoundingBoxes] = useState<DocumentBoundingBoxes | null>(null);
  const [activeHighlightField, setActiveHighlightField] = useState<FieldKey | null>(null);
  const [usage, setUsage] = useState<DocumentExtractionResult['usage'] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropOpen, setCropOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportProfile, setExportProfile] = useState<string>(() => {
    return localStorage.getItem('vitablue.export-profile') || DEFAULT_EXPORT_PROFILE_ID;
  });
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const validationAlerts = useMemo(
    () => evaluateRules(fields, rulesConfig),
    [fields, rulesConfig],
  );

  const handleExportProfileChange = (profileId: string) => {
    if (profileId === exportProfile) return;
    setIsSwitchingProfile(true);
    setExportProfile(profileId);
    localStorage.setItem('vitablue.export-profile', profileId);
    setTimeout(() => {
      setIsSwitchingProfile(false);
    }, 450);
  };

  useEffect(() => {
    if (!isNewExtraction) {
      const historyRecord = getExtractionHistoryRecord(extractionId);
      if (!historyRecord) {
        setNotFound(true);
        return;
      }
      setNotFound(false);
      setStage(historyRecord.hasWarnings ? 'review-with-warnings' : 'review');
      setFields(normalizeIdentityDocumentDates(historyRecord.fields));
      setRawFields(normalizeIdentityDocumentDates(historyRecord.rawFields));
      setBoundingBoxes(historyRecord.boundingBoxes ?? null);
      setUsage(historyRecord.usage ?? null);
    }
  }, [extractionId, isNewExtraction]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    },
    [previewUrl, backPreviewUrl],
  );

  const selectFile = (next: File) => {
    if (!acceptedTypes.includes(next.type)) {
      setNotice('Formato no compatible. Usa un archivo JPG, PNG o PDF.');
      return;
    }
    if (next.size === 0) {
      setNotice('El archivo está vacío. Selecciona un documento válido.');
      return;
    }
    if (next.size > maxDocumentBytes) {
      setNotice('El documento supera el límite de 10 MB. Reduce su tamaño e inténtalo de nuevo.');
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(URL.createObjectURL(next));
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setBoundingBoxes(null);
    setActiveHighlightField(null);
    setActiveViewerSide('front');
    setUsage(null);
    setRotation(0);
    setZoom(1);
    setErrorMessage(null);
    setStage('preparation');
  };

  const selectBackFile = (next: File) => {
    if (!acceptedTypes.includes(next.type)) {
      setNotice('Formato no compatible. Usa un archivo JPG, PNG o PDF.');
      return;
    }
    if (next.size === 0) {
      setNotice('El archivo está vacío. Selecciona un documento válido.');
      return;
    }
    if (next.size > maxDocumentBytes) {
      setNotice('El documento supera el límite de 10 MB. Reduce su tamaño e inténtalo de nuevo.');
      return;
    }
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    setBackFile(next);
    setBackPreviewUrl(URL.createObjectURL(next));
    setNotice('Reverso del documento añadido.');
  };

  const clearBackFile = () => {
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    setBackFile(null);
    setBackPreviewUrl(null);
    setActiveViewerSide('front');
  };

  const handleFilesSelected = (incoming: File[]) => {
    if (!incoming.length) return;
    const valid = incoming.filter(
      (f) => acceptedTypes.includes(f.type) && f.size > 0 && f.size <= maxDocumentBytes,
    );
    if (!valid.length) {
      setNotice('Formato no compatible o archivo demasiado grande (máx. 10 MB).');
      return;
    }

    if (valid.length === 1) {
      if (!file) {
        selectFile(valid[0]);
      } else {
        selectBackFile(valid[0]);
      }
    } else {
      selectFile(valid[0]);
      selectBackFile(valid[1]);
      setNotice('✓ 2 caras detectadas y vinculadas.');
    }
  };

  const handleSwapSides = () => {
    if (!file || !backFile) return;
    const tempFile = file;
    const tempUrl = previewUrl;
    setFile(backFile);
    setPreviewUrl(backPreviewUrl);
    setBackFile(tempFile);
    setBackPreviewUrl(tempUrl);
    setNotice('Caras invertidas: Anverso ⇄ Reverso.');
  };

  // Clipboard Paste Support (Cmd/Ctrl + V)
  useEffect(() => {
    if (stage !== 'preparation') return;
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const pastedFile = item.getAsFile();
          if (pastedFile && acceptedTypes.includes(pastedFile.type)) {
            event.preventDefault();
            if (!file) {
              selectFile(pastedFile);
              setNotice('Documento (Anverso) pegado desde el portapapeles.');
            } else if (!backFile) {
              selectBackFile(pastedFile);
              setNotice('Reverso pegado desde el portapapeles.');
            }
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [stage, file, backFile]);

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    setStage('preparation');
    setFile(null);
    setBackFile(null);
    setPreviewUrl(null);
    setBackPreviewUrl(null);
    setActiveViewerSide('front');
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setBoundingBoxes(null);
    setActiveHighlightField(null);
    setUsage(null);
    setRotation(0);
    setZoom(1);
    setErrorMessage(null);
    setNotice('');
  };

  const loadDemoDocument = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 1000, 650);
    ctx.fillStyle = '#005F73';
    ctx.fillRect(30, 30, 940, 90);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('REINO DE ESPAÑA · PASAPORTE / PASSPORT', 60, 85);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(60, 160, 220, 290);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('FOTO MUESTRA', 100, 310);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Pasaporte / Passport No: P00000000', 320, 145);
    ctx.fillText('Apellidos / Surname: SAMPLE', 320, 190);
    ctx.fillText('Nombre / Given names: MARIA', 320, 235);
    ctx.fillText('Nacionalidad / Nationality: ESPAÑOLA', 320, 280);
    ctx.fillText('Fecha de nacimiento / Date of birth: 12/04/1988', 320, 325);
    ctx.fillText('Sexo / Sex: F', 320, 370);
    ctx.fillText('Fecha de caducidad / Date of expiry: 11/04/2030', 320, 415);

    ctx.fillStyle = '#001219';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<<<<', 60, 520);
    ctx.fillText('P000000000ESP8804128F3004118<<<<<<<<<<<<<<<04', 60, 570);

    canvas.toBlob((blob) => {
      if (blob) {
        const demoFile = new File([blob], 'pasaporte-ejemplo-demo.jpg', { type: 'image/jpeg' });
        selectFile(demoFile);
        setNotice('Documento de prueba cargado. Listo para extraer.');
      }
    }, 'image/jpeg', 0.95);
  };

  const crop = () => {
    const targetUrl = activeViewerSide === 'back' && backPreviewUrl ? backPreviewUrl : previewUrl;
    const targetFile = activeViewerSide === 'back' && backFile ? backFile : file;
    if (!targetUrl || !targetFile) {
      setNotice('El recorte solo está disponible para imágenes.');
      return;
    }
    setCropOpen(true);
  };

  const applyCrop = (blob: Blob) => {
    if (activeViewerSide === 'back' && backFile) {
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
      const croppedBack = new File([blob], backFile.name, { type: 'image/jpeg' });
      setBackFile(croppedBack);
      setBackPreviewUrl(URL.createObjectURL(blob));
    } else if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const croppedFile = new File([blob], file.name, { type: 'image/jpeg' });
      setFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(blob));
    }
    setZoom(1);
    setCropOpen(false);
    setNotice('Documento recortado.');
  };

  const extract = async () => {
    if (!file) return;
    setStage('processing');
    setErrorMessage(null);
    setNotice('');
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('AUTHENTICATION_REQUIRED');
      const result = await extractDocumentWithTimeout(
        { extract: (_request) => uploadAndExtractDualDocument(file, backFile, user.id) },
        {
          fileName: file.name,
          mimeType: file.type as 'image/jpeg' | 'image/png' | 'application/pdf',
          documentReference: file.name,
          ...(backFile
            ? {
                backFileName: backFile.name,
                backMimeType: backFile.type as 'image/jpeg' | 'image/png' | 'application/pdf',
                backDocumentReference: backFile.name,
              }
            : {}),
        },
        45000,
      );
      const normalizedFields = normalizeIdentityDocumentDates(result.fields);
      const normalizedRaw = normalizeIdentityDocumentDates(result.rawFields ?? result.fields);
      setFields(normalizedFields);
      setRawFields(normalizedRaw);
      if (result.boundingBoxes && Object.keys(result.boundingBoxes).length > 0) {
        setBoundingBoxes(result.boundingBoxes);
      }
      if (result.usage) setUsage(result.usage);
      const warnings = getDocumentExtractionWarnings({
        ...result,
        fields: normalizedFields,
      });
      saveExtractionHistory({
        fileName: file.name,
        fields: normalizedFields,
        rawFields: normalizedRaw,
        boundingBoxes: result.boundingBoxes ?? null,
        usage: result.usage ?? null,
        hasWarnings: warnings.length > 0,
      });
      setStage(warnings.length ? 'review-with-warnings' : 'review');
      if (warnings.length) {
        setNotice('Respuesta recibida con advertencias. Revisa los campos extraídos.');
      }
    } catch (error) {
      console.error('[DocumentIntelligence] Full extraction error:', error);
      const errorCode = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      let message = 'No se pudo procesar el documento. Comprueba que sea legible y vuelve a intentarlo.';

      if (
        errorCode === 'AUTHENTICATION_REQUIRED' ||
        errorCode === 'Invalid session' ||
        errorCode.toLowerCase().includes('session') ||
        errorCode.toLowerCase().includes('unauthorized')
      ) {
        message = 'Tu sesión ha caducado o no está autenticada. Vuelve a iniciar sesión para continuar.';
      } else if (errorCode === 'DOCUMENT_EXTRACTION_TIMEOUT') {
        message = 'La extracción está tardando más de lo esperado. Puedes reintentarlo sin volver a subir el documento.';
      } else if (errorCode === 'Document upload failed') {
        message = 'No se pudo subir el documento al almacenamiento temporal. Comprueba los permisos de Storage (bucket: document-intelligence-temp).';
      } else if (errorCode === 'Document extraction provider is not configured') {
        message = 'El proveedor de IA no está configurado (falta GEMINI_API_KEY en Supabase Secrets).';
      } else if (errorCode === 'Document could not be loaded') {
        message = 'No se pudo recuperar el documento temporal desde Supabase Storage.';
      } else if (errorCode === 'Document extraction provider failed') {
        message = 'La API de Gemini rechazó la petición o la clave de API no es válida.';
      } else if (errorCode !== 'UNKNOWN_ERROR' && errorCode !== 'Document extraction request failed') {
        message = `Error en el servicio: ${errorCode}`;
      } else {
        message = 'El servicio de lectura no está disponible en este momento. Revisa la consola para más detalles.';
      }

      setErrorMessage(message);
      setNotice('');
      setStage('error');
    }
  };

  const copy = async (value: string | null | undefined, label: string) => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copiado.`);
    }
  };

  const copyAllAsText = async () => {
    const text = formatFieldsForProfile(fields, exportProfile);
    await navigator.clipboard.writeText(text);
    const profileObj = EXPORT_PROFILES.find((p) => p.id === exportProfile);
    setNotice(`✓ Todos los campos copiados según perfil: ${profileObj?.shortLabel ?? 'Aseguradora 1'}.`);
  };

  const copyAllAsJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(fields, null, 2));
    setNotice('Datos del documento copiados en formato JSON.');
  };

  const handleApprove = async () => {
    await copyAllAsText();
    setNotice('✓ Extracción aprobada. Datos copiados al portapapeles.');
  };

  const handleReject = () => {
    clear();
    setNotice('Documento descartado. Listo para procesar uno nuevo.');
  };

  const startNewExtraction = () => {
    clear();
    navigate('/backoffice/tools/document-intelligence/extraccion/new');
  };

  const restoreField = (key: FieldKey) => {
    setFields((current) => ({
      ...current,
      [key]: rawFields[key],
    }));
    const label = getFieldLabel(key);
    setNotice(`Valor original de ${label} restaurado.`);
  };

  const handleHighlightField = (fieldKey: FieldKey | null) => {
    setActiveHighlightField(fieldKey);
    if (!fieldKey) return;
    if (backFile && (fieldKey === 'address' || fieldKey === 'mrz' || fieldKey === 'birthplace')) {
      setActiveViewerSide('back');
    } else if (
      backFile &&
      (fieldKey === 'documentNumber' ||
        fieldKey === 'givenNames' ||
        fieldKey === 'firstSurname' ||
        fieldKey === 'secondSurname' ||
        fieldKey === 'supportNumber')
    ) {
      setActiveViewerSide('front');
    }
  };

  const handleSelectBoxField = (fieldKey: FieldKey) => {
    setActiveHighlightField(fieldKey);
    const inputElement = document.getElementById(`field-input-${fieldKey}`);
    if (inputElement) {
      inputElement.focus();
      inputElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFieldChange = (key: FieldKey, value: string | null) => {
    if (key === 'firstSurname') {
      const newSurnames = buildSurnames(value, fields.secondSurname);
      setFields((current) => ({
        ...current,
        firstSurname: value,
        surnames: newSurnames,
      }));
    } else if (key === 'secondSurname') {
      const newSurnames = buildSurnames(fields.firstSurname, value);
      setFields((current) => ({
        ...current,
        secondSurname: value,
        surnames: newSurnames,
      }));
    } else if (key === 'surnames') {
      const { firstSurname, secondSurname } = splitSurnames(value);
      setFields((current) => ({
        ...current,
        surnames: value,
        firstSurname,
        secondSurname,
      }));
    } else {
      setFields((current) => ({
        ...current,
        [key]: value,
      }));
    }
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (stage === 'preparation' && file && event.key === 'Enter') {
        event.preventDefault();
        extract();
      } else if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        if (stage === 'review' || stage === 'review-with-warnings') {
          event.preventDefault();
          handleApprove();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [stage, file, fields]);

  const issues = useMemo(
    () =>
      Object.fromEntries(
        validateIdentityDocumentFields(fields).map(({ field, message }) => [
          field,
          message ?? 'Valor no válido.',
        ]),
      ) as Partial<Record<FieldKey, string>>,
    [fields],
  );
  const issueCount = Object.keys(issues).length;
  const currentViewerFile = activeViewerSide === 'back' && backFile ? backFile : file;
  const currentViewerUrl =
    activeViewerSide === 'back' && backPreviewUrl ? backPreviewUrl : previewUrl;
  const isPdf = currentViewerFile?.type === 'application/pdf';

  const openDocumentInNewTab = () => {
    if (currentViewerUrl) {
      window.open(currentViewerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleZoomIn = () => setZoom((v) => Math.min(3, +(v + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((v) => Math.max(0.5, +(v - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setRotation(0);
  };
  const handleRotate = () => setRotation((v) => (v + 90) % 360);

  const documentViewer = (
    <DocumentViewer
      file={currentViewerFile}
      previewUrl={currentViewerUrl}
      isPdf={isPdf}
      zoom={zoom}
      rotation={rotation}
      boundingBoxes={boundingBoxes}
      activeField={activeHighlightField}
      onSelectField={handleSelectBoxField}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
      onResetZoom={handleResetZoom}
      onRotate={handleRotate}
      onCrop={crop}
      onOpenInTab={openDocumentInNewTab}
    />
  );

  return (
    <BackofficeShell
      title="Document Intelligence"
      eyebrow="Operaciones documentales"
      breadcrumbs={['Tools', 'Document Intelligence']}
      mode="workspace"
      showState={false}
      actionsSlot={
        <Link
          to="/backoffice/tools/document-intelligence/extraccion"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-primary hover:text-primary"
        >
          ← Historial de extracciones
        </Link>
      }
    >
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
        {notFound ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <h2 className="text-h3 text-slate-900">Extracción no encontrada</h2>
            <p className="text-body-reg mt-2 text-slate-500">El resultado puede haber sido eliminado del historial local.</p>
            <Link
              to="/backoffice/tools/document-intelligence/extraccion"
              className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary-dark"
            >
              Volver al historial
            </Link>
          </div>
        ) : (
          <>
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-medium text-slate-800">
                <span className="truncate">{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice('')}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Cerrar notificación"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            {stage === 'preparation' && (
              <PreparationView
                file={file}
                backFile={backFile}
                activeViewerSide={activeViewerSide}
                onToggleViewerSide={setActiveViewerSide}
                viewer={documentViewer}
                onFiles={handleFilesSelected}
                onSelectFront={selectFile}
                onSelectBack={selectBackFile}
                onClear={clear}
                onClearBack={clearBackFile}
                onSwap={handleSwapSides}
                onDemo={loadDemoDocument}
                onExtract={extract}
              />
            )}
            {stage === 'processing' && (
              <ProcessingView file={file} previewUrl={previewUrl} isPdf={isPdf} />
            )}
            {stage === 'error' && (
              <ExtractionErrorView
                message={errorMessage ?? 'No se pudo procesar el documento.'}
                onRetry={extract}
                onClear={clear}
              />
            )}
            {(stage === 'review' || stage === 'review-with-warnings') && (
              <ReviewView
                file={file}
                backFile={backFile}
                documentMode={documentMode}
                activeViewerSide={activeViewerSide}
                onToggleViewerSide={setActiveViewerSide}
                fields={fields}
                rawFields={rawFields}
                issues={issues}
                validationAlerts={validationAlerts}
                usage={usage}
                exportProfile={exportProfile}
                isSwitchingProfile={isSwitchingProfile}
                activeHighlightField={activeHighlightField}
                onHighlightField={handleHighlightField}
                onExportProfileChange={handleExportProfileChange}
                onFieldChange={handleFieldChange}
                viewer={documentViewer}
                copy={copy}
                copyAllAsText={copyAllAsText}
                copyAllAsJson={copyAllAsJson}
                restoreField={restoreField}
                onApprove={handleApprove}
                onReject={handleReject}
                onNewDocument={startNewExtraction}
                warning={stage === 'review-with-warnings'}
                issueCount={issueCount}
              />
            )}
          </>
        )}
      </div>
      {cropOpen && previewUrl && (
        <CropEditorModal
          image={previewUrl}
          onCancel={() => setCropOpen(false)}
          onApply={applyCrop}
        />
      )}
    </BackofficeShell>
  );
};

export default DocumentIntelligence;
