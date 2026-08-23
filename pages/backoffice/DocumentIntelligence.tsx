import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clipboard,
  FileScan,
  LoaderCircle,
  RotateCcw,
  Scissors,
  Sparkles,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import BackofficeShell from "@/components/layouts/BackofficeShell";
import { extractDocumentWithTimeout } from "@/features/document-intelligence/extraction";
import { uploadAndExtractDocument } from "@/features/document-intelligence/supabase-service";
import {
  emptyIdentityDocumentFields,
  type IdentityDocumentFields,
} from "@/features/document-intelligence/types";
import { validateIdentityDocumentFields } from "@/features/document-intelligence/validation";
import { getDocumentExtractionWarnings } from "@/features/document-intelligence/workflow";
import { supabase } from "@/marketing-studio/utils/supabaseClient";

type Stage = "preparation" | "processing" | "error" | "review" | "review-with-warnings";
type FieldKey = keyof IdentityDocumentFields;
const fieldLabels: Array<{ key: FieldKey; label: string }> = [
  { key: "fullName", label: "Nombre completo" },
  { key: "givenNames", label: "Nombre" },
  { key: "surnames", label: "Apellidos" },
  { key: "documentNumber", label: "Número de documento" },
  { key: "birthDate", label: "Fecha de nacimiento" },
  { key: "nationality", label: "Nacionalidad" },
  { key: "sex", label: "Sexo" },
  { key: "issueDate", label: "Fecha de expedición" },
  { key: "expiryDate", label: "Fecha de caducidad" },
  { key: "birthplace", label: "Lugar de nacimiento" },
  { key: "mrz", label: "MRZ" },
];
const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxDocumentBytes = 10 * 1024 * 1024;
const extractionSessionStorageKey = "vitablue.document-intelligence.session";

type PersistedExtractionSession = {
  stage: "review" | "review-with-warnings";
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  fileName: string | null;
};

const CropEditor: React.FC<{
  image: string;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
}> = ({ image, onCancel, onApply }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const apply = async () => {
    if (!area) return;
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = area.width;
      canvas.height = area.height;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(
        source,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        area.width,
        area.height,
      );
      canvas.toBlob(
        (blob) => {
          if (blob) onApply(blob);
        },
        "image/jpeg",
        0.92,
      );
    };
    source.src = image;
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-base font-black text-slate-900">
            Recortar documento
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Mueve la selección o ajusta sus esquinas para conservar el área
            necesaria.
          </p>
        </div>
        <div className="relative h-[min(62vh,520px)] bg-slate-950">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={undefined}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-5 py-4">
          <label className="flex min-w-52 flex-1 items-center gap-3 text-xs font-bold text-slate-600">
            <ZoomOut className="size-4" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-primary"
            />
            <ZoomIn className="size-4" />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={apply}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-black text-white hover:bg-primary-dark"
            >
              Aplicar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dropzone: React.FC<{
  file: File | null;
  onFile: (file: File) => void;
  onClear: () => void;
}> = ({ file, onFile, onClear }) => {
  const input = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const choose = (candidate?: File) => {
    if (candidate) onFile(candidate);
  };
  if (file)
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <FileScan className="size-6 shrink-0 text-emerald-700" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {file.name}
            </p>
            <p className="mt-1 text-xs text-emerald-700">
              Documento seleccionado
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary"
          >
            <Upload className="size-4" /> Subir otro
          </button>
          <button
            type="button"
            onClick={onClear}
            aria-label="Borrar documento"
            title="Borrar documento"
            className="flex size-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <input
          ref={input}
          className="sr-only"
          type="file"
          accept={acceptedTypes.join(",")}
          onChange={(event) => choose(event.target.files?.[0])}
        />
      </div>
    );
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => input.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") input.current?.click();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        choose(event.dataTransfer.files[0]);
      }}
      className={`flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center ${dragging ? "border-primary bg-primary/5" : "border-slate-300 bg-white hover:border-primary"}`}
    >
      <input
        ref={input}
        className="sr-only"
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={(event) => choose(event.target.files?.[0])}
      />
      <Upload className="size-8 text-primary" />
      <p className="mt-3 text-sm font-bold text-slate-800">
        Arrastra el documento aquí
      </p>
      <p className="mt-1 text-xs text-slate-500">
        o haz clic para seleccionarlo · JPG, PNG o PDF
      </p>
    </div>
  );
};

const DocumentIntelligence: React.FC = () => {
  const [stage, setStage] = useState<Stage>("preparation");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fields, setFields] = useState<IdentityDocumentFields>(
    emptyIdentityDocumentFields,
  );
  const [rawFields, setRawFields] = useState<IdentityDocumentFields>(
    emptyIdentityDocumentFields,
  );
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropOpen, setCropOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FieldKey | null>(null);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(extractionSessionStorageKey);
    if (!saved) return;
    try {
      const session = JSON.parse(saved) as PersistedExtractionSession;
      if (session.stage !== "review" && session.stage !== "review-with-warnings") return;
      setStage(session.stage);
      setFields(session.fields);
      setRawFields(session.rawFields ?? session.fields);
      setNotice("Sesión de revisión restaurada después de recargar la página.");
    } catch {
      sessionStorage.removeItem(extractionSessionStorageKey);
    }
  }, []);

  useEffect(() => {
    if (stage !== "review" && stage !== "review-with-warnings") return;
    sessionStorage.setItem(extractionSessionStorageKey, JSON.stringify({
      stage,
      fields,
      rawFields,
      fileName: file?.name ?? null,
    } satisfies PersistedExtractionSession));
  }, [fields, file, rawFields, stage]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );
  const selectFile = (next: File) => {
    if (!acceptedTypes.includes(next.type)) {
      setNotice("Formato no compatible. Usa un archivo JPG, PNG o PDF.");
      return;
    }
    if (next.size === 0) {
      setNotice("El archivo está vacío. Selecciona un documento válido.");
      return;
    }
    if (next.size > maxDocumentBytes) {
      setNotice("El documento supera el límite de 10 MB. Reduce su tamaño e inténtalo de nuevo.");
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(next);
    setPreviewUrl(
      next.type === "application/pdf" ? null : URL.createObjectURL(next),
    );
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setRotation(0);
    setZoom(1);
    setSelectedField(null);
    setErrorMessage(null);
    setStage("preparation");
    setNotice("Documento cargado. Confirma que está listo para extraer.");
  };
  const crop = () => {
    if (!previewUrl || !file) {
      setNotice("El recorte solo está disponible para imágenes.");
      return;
    }
    setCropOpen(true);
  };
  const applyCrop = (blob: Blob) => {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(new File([blob], file.name, { type: "image/jpeg" }));
    setPreviewUrl(URL.createObjectURL(blob));
    setZoom(1);
    setCropOpen(false);
    setNotice("Documento recortado.");
  };
  const extract = async () => {
    if (!file) return;
    setStage("processing");
    setErrorMessage(null);
    setSelectedField(null);
    setNotice("La IA está leyendo el documento…");
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("AUTHENTICATION_REQUIRED");
      const result = await extractDocumentWithTimeout(
        { extract: (_request) => uploadAndExtractDocument(file, user.id) },
        {
          fileName: file.name,
          mimeType: file.type as "image/jpeg" | "image/png" | "application/pdf",
          documentReference: file.name,
        },
        10000,
      );
      setFields(result.fields);
      setRawFields(result.rawFields ?? result.fields);
      const warnings = getDocumentExtractionWarnings(result);
      setStage(warnings.length ? "review-with-warnings" : "review");
      setNotice(
        result.usage
          ? `Consumo de esta extracción\nEntrada: ${result.usage.promptTokens.toLocaleString("es-ES")} tokens\nSalida: ${result.usage.outputTokens.toLocaleString("es-ES")} tokens\nTotal: ${result.usage.totalTokens.toLocaleString("es-ES")} tokens\nCoste estimado: USD ${result.usage.estimatedCostUsd.toFixed(6)}\n\nCálculo estimado: ((${result.usage.promptTokens.toLocaleString("es-ES")} × USD 0.30) + (${result.usage.outputTokens.toLocaleString("es-ES")} × USD 2.50)) / 1.000.000`
          : warnings.length
            ? "Respuesta recibida con advertencias. Revisa los campos extraídos."
            : "Respuesta recibida. Revisa los campos extraídos.",
      );
    } catch (error) {
      const errorCode = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      const message = errorCode === "AUTHENTICATION_REQUIRED"
        ? "Tu sesión ha caducado. Vuelve a iniciar sesión para continuar."
        : errorCode === "DOCUMENT_EXTRACTION_TIMEOUT"
          ? "La extracción está tardando más de lo esperado. Puedes reintentarlo sin volver a subir el documento."
          : errorCode === "Document upload failed"
            ? "No se pudo subir el documento temporalmente. Comprueba tu conexión e inténtalo de nuevo."
            : errorCode === "Document extraction request failed"
              ? "El servicio de lectura no está disponible en este momento. Inténtalo de nuevo en unos segundos."
              : "No se pudo procesar el documento. Comprueba que sea legible y vuelve a intentarlo.";
      setErrorMessage(message);
      setNotice("");
      setStage("error");
    }
  };
  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setStage("preparation");
    setFile(null);
    setPreviewUrl(null);
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setRotation(0);
    setZoom(1);
    setSelectedField(null);
    setErrorMessage(null);
    setNotice("");
    sessionStorage.removeItem(extractionSessionStorageKey);
  };
  const copy = async (value: string | null, label: string) => {
    if (value) {
      await navigator.clipboard.writeText(value);
      setNotice(`${label} copiado.`);
    }
  };
  const issues = useMemo(
    () =>
      Object.fromEntries(
        validateIdentityDocumentFields(fields).map(({ field, message }) => [
          field,
          message ?? "Valor no válido.",
        ]),
      ) as Partial<Record<FieldKey, string>>,
    [fields],
  );
  const issueCount = Object.keys(issues).length;
  const preview = previewUrl ? (
    <div className="flex min-h-[340px] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-4">
      <img
        src={previewUrl}
        alt="Documento procesado"
        className="max-h-[430px] max-w-full object-contain transition-transform"
        style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
      />
    </div>
  ) : (
    <div className="flex min-h-[340px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-5 text-center text-sm text-slate-500">
      {file?.name}
      <br />
      Vista previa PDF pendiente de soporte del visor.
    </div>
  );
  const header = (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{`{Document workspace}`}</p>
        <h2 className="mt-1 font-display text-2xl font-black text-slate-900">
          {stage === "preparation"
            ? "Preparar documento"
            : stage === "processing"
              ? "Procesando documento"
              : stage === "error"
                ? "No se pudo procesar el documento"
              : "Revisión de identidad"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {stage === "preparation"
            ? "Sube el documento y confirma que está listo para extraer."
            : stage === "processing"
              ? "La inteligencia artificial está analizando el documento."
              : stage === "error"
                ? "El documento sigue seleccionado para que puedas reintentarlo sin empezar de nuevo."
              : "Revisa los campos extraídos y consulta el detalle de cada valor."}
        </p>
      </div>
      <button
        type="button"
        onClick={clear}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-red-200 hover:text-red-600"
      >
        <Trash2 className="size-4" /> Limpiar sesión
      </button>
    </header>
  );
  return (
    <BackofficeShell
      title="Document Intelligence"
      eyebrow="Operaciones documentales"
      breadcrumbs={['Tools', 'Document Intelligence']}
      mode="split"
    >
      <div className="flex h-full min-h-0 flex-col gap-5 overflow-hidden">
        {header}
        {stage === "preparation" && (
          <Preparation
            file={file}
            preview={preview}
            onFile={selectFile}
            onClear={clear}
            onRotate={() => setRotation((value) => (value + 90) % 360)}
            onZoomOut={() => setZoom((value) => Math.max(0.75, value - 0.25))}
            onZoomIn={() => setZoom((value) => Math.min(1.75, value + 0.25))}
            onCrop={crop}
            onExtract={extract}
          />
        )}
        {stage === "processing" && <Processing />}
        {stage === "error" && (
          <ExtractionError
            message={errorMessage ?? "No se pudo procesar el documento."}
            onRetry={extract}
            onClear={clear}
          />
        )}
        {(stage === "review" || stage === "review-with-warnings") && (
          <Review
            fields={fields}
            rawFields={rawFields}
            issues={issues}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            setFields={setFields}
            preview={preview}
            notice={notice}
            copy={copy}
            warning={stage === "review-with-warnings"}
            issueCount={issueCount}
          />
        )}
      </div>
      {cropOpen && previewUrl && (
        <CropEditor
          image={previewUrl}
          onCancel={() => setCropOpen(false)}
          onApply={applyCrop}
        />
      )}
    </BackofficeShell>
  );
};

const Preparation: React.FC<{
  file: File | null;
  preview: React.ReactNode;
  onFile: (file: File) => void;
  onClear: () => void;
  onRotate: () => void;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCrop: () => void;
  onExtract: () => void;
}> = ({
  file,
  preview,
  onFile,
  onClear,
  onRotate,
  onZoomOut,
  onZoomIn,
  onCrop,
  onExtract,
}) => (
  <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-5">
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileScan className="size-4 text-primary" />
        <h3 className="text-sm font-black text-slate-800">Documento fuente</h3>
      </div>
      <Dropzone file={file} onFile={onFile} onClear={onClear} />
      {file && (
        <>
          <div className="mt-3">{preview}</div>
          <div className="mt-2 flex items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            <button
              type="button"
              title="Alejar"
              aria-label="Alejar"
              onClick={onZoomOut}
              className="flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary"
            >
              <ZoomOut className="size-4" />
            </button>
            <button
              type="button"
              title="Acercar"
              aria-label="Acercar"
              onClick={onZoomIn}
              className="flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              type="button"
              title="Rotar documento"
              aria-label="Rotar documento"
              onClick={onRotate}
              className="flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              title="Recortar documento"
              aria-label="Recortar documento"
              onClick={onCrop}
              className="flex size-9 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-primary"
            >
              <Scissors className="size-4" />
            </button>
          </div>
        </>
      )}
    </div>
    {file && (
      <button
        type="button"
        onClick={onExtract}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-black text-white hover:bg-primary-dark"
      >
        <Sparkles className="size-4" /> Extraer y validar
      </button>
    )}
    <p className="text-center text-[11px] text-slate-400">
      La extracción no verifica autenticidad. Los datos permanecen en la sesión
      local.
    </p>
  </section>
);
const Processing: React.FC = () => (
  <section className="flex flex-1 items-center justify-center">
    <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <LoaderCircle className="mx-auto size-12 animate-spin text-primary" />
      <h3 className="mt-6 text-xl font-black text-slate-900">
        Analizando tu documento
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        Estamos identificando el tipo de documento, extrayendo sus campos y
        preparando la validación.
      </p>
      <p className="mt-8 text-xs font-bold text-primary">
        No cierres esta ventana
      </p>
    </div>
  </section>
);

const ExtractionError: React.FC<{
  message: string;
  onRetry: () => void;
  onClear: () => void;
}> = ({ message, onRetry, onClear }) => (
  <section className="flex flex-1 items-center justify-center">
    <div className="w-full max-w-xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-xl font-black text-red-700" aria-hidden="true">
        !
      </div>
      <h3 className="mt-5 text-xl font-black text-red-950">
        No hemos podido completar la extracción
      </h3>
      <p role="alert" className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-red-800">
        {message}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-black text-white hover:bg-primary-dark"
        >
          <RotateCcw className="size-4" /> Reintentar
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-800 hover:bg-red-100"
        >
          <Upload className="size-4" /> Cambiar documento
        </button>
      </div>
    </div>
  </section>
);

const ExtractionUsageTable: React.FC<{ notice: string }> = ({ notice }) => {
  const lines = notice.split("\n");
  const value = (label: string) =>
    lines
      .find((line) => line.startsWith(label))
      ?.replace(label, "")
      .trim() ?? "—";
  if (!notice.startsWith("Consumo de esta extracción"))
    return (
      <p className="mt-auto text-xs text-slate-500">
        Selecciona un campo para ver su valor, validación y detalle.
      </p>
    );
  return (
    <div className="mt-auto">
      <h3 className="text-sm font-black text-slate-800">
        Consumo de esta extracción
      </h3>
      <table className="mt-4 w-full text-xs">
        <tbody>
          {[
            ["Entrada", "Entrada:"],
            ["Salida", "Salida:"],
            ["Total", "Total:"],
          ].map(([label, key]) => (
            <tr key={key} className="border-b border-slate-200">
              <th className="py-2 text-left font-bold text-slate-500">
                {label}
              </th>
              <td className="py-2 text-right font-black text-slate-800">
                {value(key)}
              </td>
            </tr>
          ))}
          <tr>
            <th className="pt-3 text-left font-bold text-slate-500">
              Coste estimado
            </th>
            <td className="pt-3 text-right font-black text-primary">
              {value("Coste estimado:")}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">
        Entrada: USD 0.30 por millón. Salida: USD 2.50 por millón.
      </p>
    </div>
  );
};
const Review: React.FC<{
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  issues: Partial<Record<FieldKey, string>>;
  selectedField: FieldKey | null;
  setSelectedField: (field: FieldKey) => void;
  setFields: React.Dispatch<React.SetStateAction<IdentityDocumentFields>>;
  preview: React.ReactNode;
  notice: string;
  copy: (value: string | null, label: string) => void;
  warning: boolean;
  issueCount: number;
}> = ({
  fields,
  rawFields,
  issues,
  selectedField,
  setSelectedField,
  setFields,
  preview,
  notice,
  copy,
  warning,
  issueCount,
}) => (
  <section className="grid min-h-0 flex-1 items-start gap-4 overflow-y-auto xl:min-h-[620px] xl:overflow-visible xl:grid-cols-[minmax(280px,0.9fr)_minmax(420px,1.5fr)_minmax(260px,0.75fr)]">
    <aside className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-800">
          Documento procesado
        </h3>
        <FileScan className="size-4 text-primary" />
      </div>
      {preview}
    </aside>
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      {warning && (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-xs font-bold text-amber-800">
          La extracción requiere revisión. Los datos son editables y no
          constituyen una verificación de identidad.
        </div>
      )}
      {issueCount > 0 && (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-xs font-bold text-red-800" role="alert">
          {issueCount} {issueCount === 1 ? "campo requiere" : "campos requieren"} revisión antes de continuar.
        </div>
      )}
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-black text-slate-800">Campos extraídos</h3>
        <p className="mt-1 text-xs text-slate-500">
          Selecciona un campo para consultar su detalle.
        </p>
      </div>
      <div className="grid content-start gap-4 p-5 sm:grid-cols-2">
        {fieldLabels.map(({ key, label }) => (
          <label key={key} className="min-w-0 text-xs font-bold text-slate-600">
            <span
              className="flex cursor-pointer justify-between"
              onClick={() => setSelectedField(key)}
            >
              {label}
              {issues[key] && <X className="size-3 text-red-500" />}
            </span>
            <div className="mt-1 flex min-w-0 gap-2">
              <input
                value={fields[key] ?? ""}
                onFocus={() => setSelectedField(key)}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    [key]: event.target.value || null,
                  }))
                }
                className="w-full min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                aria-label={`Copiar ${label}`}
                onClick={() => copy(fields[key] ?? null, label)}
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-primary"
              >
                <Clipboard className="size-4" />
              </button>
            </div>
            <p className="mt-1 truncate text-[10px] font-normal text-slate-400" title={rawFields[key] ?? "Sin valor bruto"}>
              Extraído: {rawFields[key] ?? "null"}
            </p>
          </label>
        ))}
      </div>
    </section>
    <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {selectedField ? (
        <>
          <div className="flex justify-between border-b border-slate-200 pb-3">
            <h3 className="text-sm font-black text-slate-800">
              Detalle del campo
            </h3>
            {issues[selectedField] ? (
              <X className="size-4 text-red-500" />
            ) : (
              <Check className="size-4 text-emerald-600" />
            )}
          </div>
          <p className="mt-4 text-[10px] font-black uppercase tracking-wider text-slate-400">
            {fieldLabels.find(({ key }) => key === selectedField)?.label}
          </p>
          <p className="mt-2 break-words text-sm font-bold text-slate-800">
            {fields[selectedField] ?? "null"}
          </p>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
            {issues[selectedField] ??
              "Formato correcto. Revisa el valor con el documento original."}
          </div>
        </>
      ) : (
        <ExtractionUsageTable notice={notice} />
      )}
    </aside>
  </section>
);

export default DocumentIntelligence;
