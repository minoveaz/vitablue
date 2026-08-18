import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftRight,
  Building2,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clipboard,
  ClipboardCheck,
  ExternalLink,
  FileCheck,
  FileScan,
  Globe,
  Info,
  LoaderCircle,
  Move,
  Plus,
  RefreshCw,
  RotateCcw,
  Scissors,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  Upload,
  UploadCloud,
  X,
  XCircle,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import BackofficeShell from "@/components/layouts/BackofficeShell";
import { extractDocumentWithTimeout } from "@/features/document-intelligence/extraction";
import { uploadAndExtractDualDocument } from "@/features/document-intelligence/supabase-service";
import {
  emptyIdentityDocumentFields,
  type DocumentExtractionResult,
  type IdentityDocumentFields,
  type DocumentBoundingBoxes,
} from "@/features/document-intelligence/types";
import {
  clearDocumentFromStorage,
  loadDocumentFromStorage,
  saveDocumentToStorage,
} from "@/features/document-intelligence/storage";
import {
  normalizeIdentityDocumentDates,
  validateIdentityDocumentFields,
} from "@/features/document-intelligence/validation";
import {
  EXPORT_PROFILES,
  DEFAULT_EXPORT_PROFILE_ID,
  formatFieldsForProfile,
  splitSurnames,
  buildSurnames,
} from "@/features/document-intelligence/exportProfiles";
import { getDocumentExtractionWarnings } from "@/features/document-intelligence/workflow";
import { supabase } from "@/marketing-studio/utils/supabaseClient";
import { evaluateRules } from "@/features/document-intelligence/rules/engine";
import { useRulesConfig } from "@/features/document-intelligence/rules/rulesStore";
import type { ValidationAlert } from "@/features/document-intelligence/rules/types";
import { RulesConfigPanel } from "@/features/document-intelligence/components/RulesConfigPanel";
import { ValidationAlertsCard } from "@/features/document-intelligence/components/ValidationAlertsCard";
import { ProfilesConfigPanel } from "@/features/document-intelligence/components/ProfilesConfigPanel";

type Stage = "preparation" | "processing" | "error" | "review" | "review-with-warnings";
type FieldKey = keyof IdentityDocumentFields;
const fieldLabels: Array<{ key: FieldKey; label: string; fullWidth?: boolean; isMonospace?: boolean }> = [
  { key: "fullName", label: "Nombre completo", fullWidth: true },
  { key: "givenNames", label: "Nombre(s)" },
  { key: "firstSurname", label: "Primer apellido" },
  { key: "secondSurname", label: "Segundo apellido" },
  { key: "surnames", label: "Apellidos (Completo)" },
  { key: "documentNumber", label: "Número de documento" },
  { key: "supportNumber", label: "Número de soporte (IDESP)" },
  { key: "birthDate", label: "Fecha de nacimiento" },
  { key: "nationality", label: "Nacionalidad" },
  { key: "sex", label: "Sexo" },
  { key: "issueDate", label: "Fecha de expedición" },
  { key: "expiryDate", label: "Fecha de caducidad" },
  { key: "birthplace", label: "Lugar de nacimiento" },
  { key: "address", label: "Domicilio / Dirección", fullWidth: true },
  { key: "mrz", label: "Código MRZ (Machine Readable Zone)", fullWidth: true, isMonospace: true },
];
const acceptedTypes = ["image/jpeg", "image/png", "application/pdf"];
const maxDocumentBytes = 10 * 1024 * 1024;
const extractionSessionStorageKey = "vitablue.document-intelligence.session";

type PersistedExtractionSession = {
  stage: "review" | "review-with-warnings";
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  boundingBoxes?: DocumentBoundingBoxes | null;
  fileName: string | null;
  usage?: DocumentExtractionResult["usage"] | null;
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
  onFiles: (files: File[]) => void;
  onDemo?: () => void;
}> = ({
  onFiles,
  onDemo,
}) => {
  const input = useRef<HTMLInputElement>(null);
  const cameraInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="flex flex-col gap-2.5">
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
        onDrop={handleDrop}
        className={`group flex min-h-56 p-6 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition-all ${
          dragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-slate-300 bg-white hover:border-primary hover:bg-slate-50/50 shadow-sm"
        }`}
      >
        <input
          ref={input}
          className="sr-only"
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleChange}
        />
        <input
          ref={cameraInput}
          className="sr-only"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChange}
        />

        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <UploadCloud className="size-8" />
        </div>

        <p className="mt-4 text-base font-black text-slate-900">
          Arrastra tu documento aquí (1 o 2 caras)
        </p>
        <p className="mt-1.5 max-w-md text-xs text-slate-500 leading-relaxed">
          Suelta 1 archivo (Pasaporte) o 2 archivos a la vez (Anverso y Reverso), o <span className="font-bold text-primary underline">haz clic para explorar</span>.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">Soporta 1 o 2 archivos</span>
          <span>·</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-600">PDF, JPG, PNG</span>
          <span>·</span>
          <span>Máx. 10 MB</span>
          <span>·</span>
          <span>⌘+V para pegar</span>
        </div>
      </div>

      {/* Opciones de entrada secundarias */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => cameraInput.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
        >
          <Camera className="size-3.5 text-slate-500" /> Cámara
        </button>
        {onDemo && (
          <button
            type="button"
            onClick={onDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
          >
            <Sparkles className="size-3.5 text-primary" /> Documento demo
          </button>
        )}
      </div>
    </div>
  );
};

const DocumentIntelligence: React.FC = () => {
  const [mainTab, setMainTab] = useState<"workbench" | "rules" | "profiles">("workbench");
  const { config: rulesConfig } = useRulesConfig();
  const [stage, setStage] = useState<Stage>("preparation");
  const [file, setFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const documentMode: "single" | "dual" = backFile ? "dual" : "single";
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] = useState<string | null>(null);
  const [activeViewerSide, setActiveViewerSide] = useState<"front" | "back">("front");
  const [fields, setFields] = useState<IdentityDocumentFields>(
    emptyIdentityDocumentFields,
  );
  const [rawFields, setRawFields] = useState<IdentityDocumentFields>(
    emptyIdentityDocumentFields,
  );
  const [boundingBoxes, setBoundingBoxes] = useState<DocumentBoundingBoxes | null>(null);
  const [activeHighlightField, setActiveHighlightField] = useState<FieldKey | null>(null);
  const [usage, setUsage] = useState<DocumentExtractionResult["usage"] | null>(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [cropOpen, setCropOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [exportProfile, setExportProfile] = useState<string>(() => {
    return localStorage.getItem("vitablue.export-profile") || DEFAULT_EXPORT_PROFILE_ID;
  });
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  const validationAlerts = useMemo(
    () => evaluateRules(fields, rulesConfig),
    [fields, rulesConfig],
  );

  const handleExportProfileChange = (profileId: string) => {
    if (profileId === exportProfile) return;
    setIsSwitchingProfile(true);
    setExportProfile(profileId);
    localStorage.setItem("vitablue.export-profile", profileId);
    setTimeout(() => {
      setIsSwitchingProfile(false);
    }, 450);
  };

  useEffect(() => {
    let active = true;
    const restore = async () => {
      const savedDoc = await loadDocumentFromStorage();
      if (!active) return;
      if (savedDoc) {
        setFile(savedDoc);
        setPreviewUrl(URL.createObjectURL(savedDoc));
      }

      const saved = sessionStorage.getItem(extractionSessionStorageKey);
      if (!saved) return;
      try {
        const session = JSON.parse(saved) as PersistedExtractionSession;
        if (session.stage !== "review" && session.stage !== "review-with-warnings") return;
        setStage(session.stage);
        setFields(normalizeIdentityDocumentDates(session.fields));
        setRawFields(normalizeIdentityDocumentDates(session.rawFields ?? session.fields));
        if (session.boundingBoxes) setBoundingBoxes(session.boundingBoxes);
        if (session.usage) setUsage(session.usage);
      } catch {
        sessionStorage.removeItem(extractionSessionStorageKey);
      }
    };
    restore();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (stage !== "review" && stage !== "review-with-warnings") return;
    sessionStorage.setItem(extractionSessionStorageKey, JSON.stringify({
      stage,
      fields,
      rawFields,
      boundingBoxes,
      fileName: file?.name ?? null,
      usage,
    } satisfies PersistedExtractionSession));
  }, [boundingBoxes, fields, file, rawFields, stage, usage]);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    },
    [previewUrl, backPreviewUrl],
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
    setPreviewUrl(URL.createObjectURL(next));
    saveDocumentToStorage(next);
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setBoundingBoxes(null);
    setActiveHighlightField(null);
    setActiveViewerSide("front");
    setUsage(null);
    setRotation(0);
    setZoom(1);
    setErrorMessage(null);
    setStage("preparation");
  };

  const selectBackFile = (next: File) => {
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
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    setBackFile(next);
    setBackPreviewUrl(URL.createObjectURL(next));
    setNotice("Reverso del documento añadido.");
  };

  const clearBackFile = () => {
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    setBackFile(null);
    setBackPreviewUrl(null);
    setActiveViewerSide("front");
  };

  const handleFilesSelected = (incoming: File[]) => {
    if (!incoming.length) return;
    const valid = incoming.filter(
      (f) => acceptedTypes.includes(f.type) && f.size > 0 && f.size <= maxDocumentBytes,
    );
    if (!valid.length) {
      setNotice("Formato no compatible o archivo demasiado grande (máx. 10 MB).");
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
      setNotice("✓ 2 caras detectadas y vinculadas.");
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
    saveDocumentToStorage(backFile);
    setNotice("Caras invertidas: Anverso ⇄ Reverso.");
  };

  // Clipboard Paste Support (Cmd/Ctrl + V)
  useEffect(() => {
    if (stage !== "preparation") return;
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === "file") {
          const pastedFile = item.getAsFile();
          if (pastedFile && acceptedTypes.includes(pastedFile.type)) {
            event.preventDefault();
            if (!file) {
              selectFile(pastedFile);
              setNotice("Documento (Anverso) pegado desde el portapapeles.");
            } else if (!backFile) {
              selectBackFile(pastedFile);
              setNotice("Reverso pegado desde el portapapeles.");
            }
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [stage, file, backFile]);

  const clear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
    clearDocumentFromStorage();
    setStage("preparation");
    setFile(null);
    setBackFile(null);
    setPreviewUrl(null);
    setBackPreviewUrl(null);
    setActiveViewerSide("front");
    setFields(emptyIdentityDocumentFields());
    setRawFields(emptyIdentityDocumentFields());
    setBoundingBoxes(null);
    setActiveHighlightField(null);
    setUsage(null);
    setRotation(0);
    setZoom(1);
    setErrorMessage(null);
    setNotice("");
    sessionStorage.removeItem(extractionSessionStorageKey);
  };

  const loadDemoDocument = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 650;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background & borders
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 1000, 650);
    ctx.fillStyle = "#005F73";
    ctx.fillRect(30, 30, 940, 90);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText("REINO DE ESPAÑA · PASAPORTE / PASSPORT", 60, 85);

    // Photo Box
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(60, 160, 220, 290);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("FOTO MUESTRA", 100, 310);

    // Field texts
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("Pasaporte / Passport No: P00000000", 320, 145);
    ctx.fillText("Apellidos / Surname: SAMPLE", 320, 190);
    ctx.fillText("Nombre / Given names: MARIA", 320, 235);
    ctx.fillText("Nacionalidad / Nationality: ESPAÑOLA", 320, 280);
    ctx.fillText("Fecha de nacimiento / Date of birth: 12/04/1988", 320, 325);
    ctx.fillText("Sexo / Sex: F", 320, 370);
    ctx.fillText("Fecha de caducidad / Date of expiry: 11/04/2030", 320, 415);

    // MRZ Zone
    ctx.fillStyle = "#001219";
    ctx.font = "bold 20px monospace";
    ctx.fillText("P<ESPSAMPLE<<MARIA<<<<<<<<<<<<<<<<<<<<<<<<<<<", 60, 520);
    ctx.fillText("P000000000ESP8804128F3004118<<<<<<<<<<<<<<<04", 60, 570);

    canvas.toBlob((blob) => {
      if (blob) {
        const demoFile = new File([blob], "pasaporte-ejemplo-demo.jpg", { type: "image/jpeg" });
        selectFile(demoFile);
        setNotice("Documento de prueba cargado. Listo para extraer.");
      }
    }, "image/jpeg", 0.95);
  };

  const crop = () => {
    const targetUrl = activeViewerSide === "back" && backPreviewUrl ? backPreviewUrl : previewUrl;
    const targetFile = activeViewerSide === "back" && backFile ? backFile : file;
    if (!targetUrl || !targetFile) {
      setNotice("El recorte solo está disponible para imágenes.");
      return;
    }
    setCropOpen(true);
  };

  const applyCrop = (blob: Blob) => {
    if (activeViewerSide === "back" && backFile) {
      if (backPreviewUrl) URL.revokeObjectURL(backPreviewUrl);
      const croppedBack = new File([blob], backFile.name, { type: "image/jpeg" });
      setBackFile(croppedBack);
      setBackPreviewUrl(URL.createObjectURL(blob));
    } else if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const croppedFile = new File([blob], file.name, { type: "image/jpeg" });
      setFile(croppedFile);
      setPreviewUrl(URL.createObjectURL(blob));
      saveDocumentToStorage(croppedFile);
    }
    setZoom(1);
    setCropOpen(false);
    setNotice("Documento recortado.");
  };

  const extract = async () => {
    if (!file) return;
    setStage("processing");
    setErrorMessage(null);
    setNotice("");
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("AUTHENTICATION_REQUIRED");
      const result = await extractDocumentWithTimeout(
        { extract: (_request) => uploadAndExtractDualDocument(file, backFile, user.id) },
        {
          fileName: file.name,
          mimeType: file.type as "image/jpeg" | "image/png" | "application/pdf",
          documentReference: file.name,
          ...(backFile
            ? {
                backFileName: backFile.name,
                backMimeType: backFile.type as "image/jpeg" | "image/png" | "application/pdf",
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
      setStage(warnings.length ? "review-with-warnings" : "review");
      if (warnings.length) {
        setNotice("Respuesta recibida con advertencias. Revisa los campos extraídos.");
      }
    } catch (error) {
      console.error("[DocumentIntelligence] Full extraction error:", error);
      const errorCode = error instanceof Error ? error.message : "UNKNOWN_ERROR";
      let message = "No se pudo procesar el documento. Comprueba que sea legible y vuelve a intentarlo.";

      if (errorCode === "AUTHENTICATION_REQUIRED" || errorCode === "Invalid session" || errorCode.toLowerCase().includes("session") || errorCode.toLowerCase().includes("unauthorized")) {
        message = "Tu sesión ha caducado o no está autenticada. Vuelve a iniciar sesión para continuar.";
      } else if (errorCode === "DOCUMENT_EXTRACTION_TIMEOUT") {
        message = "La extracción está tardando más de lo esperado. Puedes reintentarlo sin volver a subir el documento.";
      } else if (errorCode === "Document upload failed") {
        message = "No se pudo subir el documento al almacenamiento temporal. Comprueba los permisos de Storage (bucket: document-intelligence-temp).";
      } else if (errorCode === "Document extraction provider is not configured") {
        message = "El proveedor de IA no está configurado (falta GEMINI_API_KEY en Supabase Secrets).";
      } else if (errorCode === "Document could not be loaded") {
        message = "No se pudo recuperar el documento temporal desde Supabase Storage.";
      } else if (errorCode === "Document extraction provider failed") {
        message = "La API de Gemini rechazó la petición o la clave de API no es válida.";
      } else if (errorCode !== "UNKNOWN_ERROR" && errorCode !== "Document extraction request failed") {
        message = `Error en el servicio: ${errorCode}`;
      } else {
        message = "El servicio de lectura no está disponible en este momento. Revisa la consola para más detalles.";
      }

      setErrorMessage(message);
      setNotice("");
      setStage("error");
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
    setNotice(`✓ Todos los campos copiados según perfil: ${profileObj?.shortLabel ?? "Aseguradora 1"}.`);
  };

  const copyAllAsJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(fields, null, 2));
    setNotice("Datos del documento copiados en formato JSON.");
  };

  const handleApprove = async () => {
    await copyAllAsText();
    setNotice("✓ Extracción aprobada. Datos copiados al portapapeles.");
  };

  const handleReject = () => {
    clear();
    setNotice("Documento descartado. Listo para procesar uno nuevo.");
  };

  const restoreField = (key: FieldKey) => {
    setFields((current) => ({
      ...current,
      [key]: rawFields[key],
    }));
    const label = fieldLabels.find((f) => f.key === key)?.label ?? key;
    setNotice(`Valor original de ${label} restaurado.`);
  };

  const handleHighlightField = (fieldKey: FieldKey | null) => {
    setActiveHighlightField(fieldKey);
    if (!fieldKey) return;
    if (backFile && (fieldKey === "address" || fieldKey === "mrz" || fieldKey === "birthplace")) {
      setActiveViewerSide("back");
    } else if (backFile && (fieldKey === "documentNumber" || fieldKey === "givenNames" || fieldKey === "firstSurname" || fieldKey === "secondSurname" || fieldKey === "supportNumber")) {
      setActiveViewerSide("front");
    }
  };

  const handleSelectBoxField = (fieldKey: FieldKey) => {
    setActiveHighlightField(fieldKey);
    const inputElement = document.getElementById(`field-input-${fieldKey}`);
    if (inputElement) {
      inputElement.focus();
      inputElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleFieldChange = (key: FieldKey, value: string | null) => {
    if (key === "firstSurname") {
      const newSurnames = buildSurnames(value, fields.secondSurname);
      setFields((current) => ({
        ...current,
        firstSurname: value,
        surnames: newSurnames,
      }));
    } else if (key === "secondSurname") {
      const newSurnames = buildSurnames(fields.firstSurname, value);
      setFields((current) => ({
        ...current,
        secondSurname: value,
        surnames: newSurnames,
      }));
    } else if (key === "surnames") {
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
      if (stage === "preparation" && file && event.key === "Enter") {
        event.preventDefault();
        extract();
      } else if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        if (stage === "review" || stage === "review-with-warnings") {
          event.preventDefault();
          handleApprove();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [stage, file, fields]);

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
  const currentViewerFile = activeViewerSide === "back" && backFile ? backFile : file;
  const currentViewerUrl = activeViewerSide === "back" && backPreviewUrl ? backPreviewUrl : previewUrl;
  const isPdf = currentViewerFile?.type === "application/pdf";

  const openDocumentInNewTab = () => {
    if (currentViewerUrl) {
      window.open(currentViewerUrl, "_blank", "noopener,noreferrer");
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

  const isSessionActive = Boolean(file || stage !== "preparation");

  const header = (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-3.5">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">{`{Document workspace}`}</p>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
            {stage === "preparation"
              ? "Paso 1 de 2: Carga y Preparación"
              : stage === "processing"
                ? "Procesando con IA..."
                : "Paso 2 de 2: Revisión y Validación"}
          </span>
          {usage && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              <Zap className="size-3" /> {usage.totalTokens.toLocaleString("es-ES")} tokens · ${usage.estimatedCostUsd.toFixed(4)}
            </span>
          )}
        </div>
        <h2 className="mt-1 font-display text-h2 font-black text-slate-900">
          {stage === "preparation"
            ? "Preparar documento"
            : stage === "processing"
              ? "Procesando documento"
              : stage === "error"
                ? "No se pudo procesar el documento"
              : "Revisión y validación de identidad"}
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {stage !== "preparation" && stage !== "processing" && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-black text-white shadow-sm transition-colors hover:bg-primary-dark"
          >
            <Plus className="size-4" /> Extraer nuevo documento
          </button>
        )}
        {isSessionActive && stage !== "processing" && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
          >
            <Trash2 className="size-4" /> Limpiar sesión
          </button>
        )}
      </div>
    </header>
  );

  return (
    <BackofficeShell
      title="Document Intelligence"
      eyebrow="Operaciones documentales"
    >
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
        {/* Sub-navegación de Módulo: Workbench vs Reglas vs Perfiles */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMainTab("workbench")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === "workbench"
                  ? "bg-white text-primary shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Zap className="size-3.5" /> <span>Workbench de Extracción</span>
            </button>
            <button
              type="button"
              onClick={() => setMainTab("rules")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === "rules"
                  ? "bg-white text-primary shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sliders className="size-3.5" /> <span>Reglas & Validación de Negocio</span>
            </button>
            <button
              type="button"
              onClick={() => setMainTab("profiles")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mainTab === "profiles"
                  ? "bg-white text-primary shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="size-3.5" /> <span>Perfiles de Aseguradora</span>
            </button>
          </div>

          {mainTab === "workbench" && isSessionActive && (
            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              Sesión activa: {file?.name ?? "Documento"}
            </span>
          )}
        </div>

        {mainTab === "rules" ? (
          <div className="flex-1 overflow-y-auto pt-2">
            <RulesConfigPanel />
          </div>
        ) : mainTab === "profiles" ? (
          <div className="flex-1 overflow-y-auto pt-2">
            <ProfilesConfigPanel
              activeProfileId={exportProfile}
              onSelectProfile={handleExportProfileChange}
            />
          </div>
        ) : (
          <>
            {header}
            {notice && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-medium text-slate-800">
                <span className="truncate">{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  className="text-slate-400 hover:text-slate-600"
                  aria-label="Cerrar notificación"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            )}
            {stage === "preparation" && (
              <Preparation
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
            {stage === "processing" && (
              <ProcessingView
                file={file}
                previewUrl={previewUrl}
                isPdf={isPdf}
              />
            )}
            {stage === "error" && (
              <ExtractionError
                message={errorMessage ?? "No se pudo procesar el documento."}
                onRetry={extract}
                onClear={clear}
              />
            )}
            {(stage === "review" || stage === "review-with-warnings") && (
              <Review
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
                onNewDocument={clear}
                warning={stage === "review-with-warnings"}
                issueCount={issueCount}
              />
            )}
          </>
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

const BoundingBoxOverlay: React.FC<{
  boundingBoxes?: DocumentBoundingBoxes | null;
  activeField?: FieldKey | null;
  onBoxClick?: (fieldKey: FieldKey) => void;
}> = ({ boundingBoxes, activeField, onBoxClick }) => {
  if (!boundingBoxes || Object.keys(boundingBoxes).length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
      {Object.entries(boundingBoxes).map(([key, box]) => {
        if (!box) return null;
        const [ymin, xmin, ymax, xmax] = box;
        const fieldKey = key as FieldKey;
        const isActive = activeField === fieldKey;
        const top = ymin / 10;
        const left = xmin / 10;
        const width = (xmax - xmin) / 10;
        const height = (ymax - ymin) / 10;

        return (
          <div
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              onBoxClick?.(fieldKey);
            }}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
            className={`absolute transition-all duration-150 rounded pointer-events-auto cursor-pointer ${
              isActive
                ? "border-2 border-amber-400 bg-amber-400/30 shadow-[0_0_25px_#f59e0b] ring-4 ring-amber-300/80 z-30 scale-[1.03]"
                : "border border-sky-400/60 bg-sky-400/10 hover:border-amber-400 hover:bg-amber-400/20 z-10"
            }`}
            title={`Campo: ${fieldLabels.find((f) => f.key === fieldKey)?.label ?? key}`}
          >
            {isActive && (
              <span className="absolute -top-7 left-0 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-black text-amber-300 shadow-xl border border-amber-400/80 whitespace-nowrap z-40 flex items-center gap-1">
                <span>📍</span> {fieldLabels.find((f) => f.key === fieldKey)?.label ?? key}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

const DocumentViewer: React.FC<{
  file: File | null;
  previewUrl: string | null;
  isPdf: boolean;
  zoom: number;
  rotation: number;
  boundingBoxes?: DocumentBoundingBoxes | null;
  activeField?: FieldKey | null;
  onSelectField?: (fieldKey: FieldKey) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onRotate: () => void;
  onCrop?: () => void;
  onOpenInTab: () => void;
}> = ({
  file,
  previewUrl,
  isPdf,
  zoom,
  rotation,
  boundingBoxes,
  activeField,
  onSelectField,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onRotate,
  onCrop,
  onOpenInTab,
}) => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOrigin = useRef({ startX: 0, startY: 0, panX: 0, panY: 0 });

  // Reset pan when resetting zoom or changing file
  const handleFullReset = () => {
    setPan({ x: 0, y: 0 });
    onResetZoom();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragOrigin.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragOrigin.current.startX;
    const dy = e.clientY - dragOrigin.current.startY;
    setPan({
      x: dragOrigin.current.panX + dx,
      y: dragOrigin.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragOrigin.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragOrigin.current.startX;
    const dy = e.touches[0].clientY - dragOrigin.current.startY;
    setPan({
      x: dragOrigin.current.panX + dx,
      y: dragOrigin.current.panY + dy,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const effectiveBoundingBoxes = boundingBoxes ?? null;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100 select-none">
      {/* Toolbar Superior Unificado */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Alejar (Zoom -)"
            aria-label="Alejar"
            onClick={onZoomOut}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <ZoomOut className="size-3.5" />
          </button>

          <button
            type="button"
            title="Restablecer zoom y posición al 100%"
            onClick={handleFullReset}
            className="rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            title="Acercar (Zoom +)"
            aria-label="Acercar"
            onClick={onZoomIn}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <ZoomIn className="size-3.5" />
          </button>

          <div className="mx-1 h-3.5 w-px bg-slate-200" />

          <button
            type="button"
            title="Girar 90°"
            aria-label="Girar 90°"
            onClick={onRotate}
            className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <RotateCcw className="size-3.5" />
            {rotation !== 0 && (
              <span className="ml-1 text-[10px] font-semibold text-primary">{rotation}°</span>
            )}
          </button>

          {(pan.x !== 0 || pan.y !== 0 || zoom !== 1 || rotation !== 0) && (
            <button
              type="button"
              title="Centrar y restablecer posición"
              onClick={handleFullReset}
              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:bg-slate-200 transition-colors ml-1"
            >
              <Move className="size-3 text-primary" /> Centrar
            </button>
          )}

          {onCrop && !isPdf && (
            <button
              type="button"
              title="Recortar documento"
              aria-label="Recortar documento"
              onClick={onCrop}
              className="flex size-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100 hover:text-primary transition-colors ml-1"
            >
              <Scissors className="size-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onOpenInTab}
          className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
          title="Abrir en pestaña nueva"
        >
          <ExternalLink className="size-3.5" /> Abrir pestaña
        </button>
      </div>

      {/* Canvas del Documento con Soporte de Arrastre (Mouse Drag / Pan) */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex flex-1 min-h-[380px] max-h-[520px] w-full items-center justify-center overflow-hidden bg-slate-100 p-4 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        {/* Badge indicador de arrastre */}
        <div className="pointer-events-none absolute bottom-2 right-3 z-20 flex items-center gap-1 rounded-md bg-white/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-slate-500 shadow-xs border border-slate-200/60">
          <Move className="size-2.5 text-primary" /> Arrastra para mover
        </div>

        {previewUrl ? (
          <div
            className={`flex items-center justify-center origin-center transition-transform ${
              isDragging ? "transition-none" : "duration-150"
            }`}
            style={{
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0px) rotate(${rotation}deg) scale(${zoom})`,
            }}
          >
            {/* Si estamos arrastrando, evitamos interferencias del iframe con pointer-events */}
            {isDragging && <div className="absolute inset-0 z-30" />}

            <div className="relative inline-block">
              {isPdf ? (
                <iframe
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  title={file?.name ?? "Documento PDF"}
                  className={`h-[460px] w-[340px] sm:w-[480px] md:w-[560px] border-0 rounded-lg bg-white shadow-sm ${
                    isDragging ? "pointer-events-none" : "pointer-events-auto"
                  }`}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={file?.name ?? "Documento"}
                  draggable={false}
                  className="max-h-[460px] max-w-full object-contain rounded-lg shadow-sm pointer-events-none select-none block"
                />
              )}
              <BoundingBoxOverlay
                boundingBoxes={effectiveBoundingBoxes}
                activeField={activeField}
                onBoxClick={onSelectField}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-sm text-slate-400">
            Ningún documento seleccionado
          </div>
        )}
      </div>
    </div>
  );
};

const Preparation: React.FC<{
  file: File | null;
  backFile: File | null;
  activeViewerSide: "front" | "back";
  onToggleViewerSide: (side: "front" | "back") => void;
  viewer: React.ReactNode;
  onFiles: (files: File[]) => void;
  onSelectFront: (file: File) => void;
  onSelectBack: (file: File) => void;
  onClear: () => void;
  onClearBack: () => void;
  onSwap: () => void;
  onDemo: () => void;
  onExtract: () => void;
}> = ({
  file,
  backFile,
  activeViewerSide,
  onToggleViewerSide,
  viewer,
  onFiles,
  onSelectFront,
  onSelectBack,
  onClear,
  onClearBack,
  onSwap,
  onDemo,
  onExtract,
}) => {
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  return (
    <section className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-6 overflow-y-auto pb-4 lg:grid-cols-12">
      {/* Columna Principal: Carga / Visor Unificado */}
      <div className="flex flex-col gap-4 lg:col-span-8">
        {!file && !backFile ? (
          /* Estado 1: Dropzone Inteligente Universal (1 o 2 archivos) */
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileScan className="size-4 text-primary" />
                <h3 className="text-sm font-black text-slate-900">Documento fuente</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">Paso 1 de 2</span>
            </div>

            <Dropzone onFiles={onFiles} onDemo={onDemo} />
          </div>
        ) : (
          /* Estado 2: Tarjeta de Archivos Cargados y Visor Interactivo */
          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Header con resumen de archivos y acciones rápidas */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {file && (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-black text-primary">
                      1
                    </span>
                    <div className="min-w-0">
                      <p className="max-w-[140px] truncate text-xs font-bold text-slate-800" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(0)} KB · Anverso</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => frontInputRef.current?.click()}
                      className="ml-1 text-[11px] font-bold text-slate-400 hover:text-primary"
                      title="Cambiar archivo anverso"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={onClear}
                      className="text-slate-400 hover:text-red-600"
                      title="Quitar anverso"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                )}

                {backFile ? (
                  <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-2xs">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded bg-accent/20 text-[11px] font-black text-accent">
                      2
                    </span>
                    <div className="min-w-0">
                      <p className="max-w-[140px] truncate text-xs font-bold text-slate-800" title={backFile.name}>
                        {backFile.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{(backFile.size / 1024).toFixed(0)} KB · Reverso</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => backInputRef.current?.click()}
                      className="ml-1 text-[11px] font-bold text-slate-400 hover:text-primary"
                      title="Cambiar archivo reverso"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={onClearBack}
                      className="text-slate-400 hover:text-red-600"
                      title="Quitar reverso"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => backInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Plus className="size-3.5" /> Añadir reverso (opcional)
                  </button>
                )}

                {/* Inputs ocultos para reemplazar o añadir individualmente */}
                <input
                  ref={frontInputRef}
                  className="sr-only"
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={(e) => {
                    if (e.target.files?.[0]) onSelectFront(e.target.files[0]);
                  }}
                />
                <input
                  ref={backInputRef}
                  className="sr-only"
                  type="file"
                  accept={acceptedTypes.join(",")}
                  onChange={(e) => {
                    if (e.target.files?.[0]) onSelectBack(e.target.files[0]);
                  }}
                />
              </div>

              <div className="flex items-center gap-2">
                {file && backFile && (
                  <button
                    type="button"
                    onClick={onSwap}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors"
                    title="Invertir cuál es el anverso y el reverso"
                  >
                    <ArrowLeftRight className="size-3.5" /> Invertir caras
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClear}
                  aria-label="Eliminar todo"
                  title="Eliminar todo y empezar de nuevo"
                  className="flex size-8 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Pestañas de previsualización de cara activa si hay 2 archivos */}
            {backFile && (
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
                <span className="text-[11px] font-bold text-slate-500">Vista previa activa:</span>
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => onToggleViewerSide("front")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeViewerSide === "front"
                        ? "bg-white text-primary shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🪪 Cara 1 (Anverso)
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleViewerSide("back")}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      activeViewerSide === "back"
                        ? "bg-white text-primary shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    🔄 Cara 2 (Reverso)
                  </button>
                </div>
              </div>
            )}

            {/* Visor interactivo */}
            <div className="p-3 bg-slate-50">
              {viewer}
            </div>

            {/* CTA Primario */}
            <div className="border-t border-slate-200 bg-white p-4">
              <button
                type="button"
                onClick={onExtract}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-6 text-sm font-black text-white shadow-md hover:bg-primary-dark transition-all"
              >
                <Sparkles className="size-4.5" />
                {backFile
                  ? "Extraer y correlacionar ambas caras con IA (2 Caras listas)"
                  : "Extraer y validar campos con IA"}
                <span className="opacity-70 text-xs font-normal">(↵ Enter)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Columna Lateral (35%): Guía Inicial o Metadata Predictiva tras la subida */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        {file ? (
          /* Estado Activo: Metadata predictiva y Checklist de pre-vuelo */
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                <FileCheck className="size-4 text-emerald-600" /> Pre-validación de archivo
              </h4>

              <div className="mt-3.5 space-y-3 text-xs">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Modalidad</p>
                  <p className="mt-0.5 font-bold text-slate-800">
                    {backFile ? "Documento de 2 Caras (Anverso + Reverso)" : "Documento de 1 Cara / Pasaporte"}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Especificaciones técnicas</p>
                  <p className="mt-0.5 font-bold text-slate-800">
                    {file.type === "application/pdf" ? "PDF Multipágina" : "Imagen de alta resolución"} · {(file.size / 1024).toFixed(0)} KB
                  </p>
                  <p className="mt-0.5 text-[11px] text-emerald-700 font-medium">✓ Tamaño óptimo para OCR multimodal</p>
                </div>

                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Motor de extracción</p>
                  <p className="mt-0.5 font-bold text-slate-800">Gemini 2.5 Flash Vision</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">Lectura de campos visuales + parseo MRZ</p>
                </div>
              </div>
            </div>

            {/* Privacidad & RGPD */}
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
              <ShieldCheck className="size-5 shrink-0 text-emerald-700 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Procesamiento seguro</p>
                <p className="mt-0.5 text-[11px] text-emerald-700 leading-relaxed">
                  Extracción efímera en memoria. Los datos no se almacenan para entrenamiento.
                </p>
              </div>
            </div>
          </>
        ) : (
          /* Estado Inicial: Documentos compatibles y Consejos */
          <>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-500">
                <Globe className="size-4 text-primary" /> Documentos compatibles
              </h4>
              <ul className="mt-3.5 space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">✓</span>
                  <div>
                    <p className="font-bold text-slate-800">Pasaportes ICAO (TD3)</p>
                    <p className="text-[11px] text-slate-500">Zona visual y lectura óptica de MRZ de 44 caracteres.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">✓</span>
                  <div>
                    <p className="font-bold text-slate-800">DNI / NIE / 2 Caras</p>
                    <p className="text-[11px] text-slate-500">Arrastra ambas fotos a la vez o añádelas sucesivamente.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded bg-primary/10 text-[11px] font-bold text-primary">✓</span>
                  <div>
                    <p className="font-bold text-slate-800">Licencias de conducir</p>
                    <p className="text-[11px] text-slate-500">Permisos oficiales con fotografía.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4.5">
              <h4 className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Info className="size-4 text-sky-600" /> Para una extracción 100% precisa
              </h4>
              <ul className="mt-2.5 space-y-1.5 text-[11px] text-slate-500">
                <li>• Puedes soltar los 2 archivos de golpe (Anverso y Reverso).</li>
                <li>• Asegúrate de que los bordes del documento sean visibles.</li>
                <li>• Evita reflejos de luz o flash sobre el documento.</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4">
              <ShieldCheck className="size-5 shrink-0 text-emerald-700 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-900">Privacidad garantizada</p>
                <p className="mt-0.5 text-[11px] text-emerald-700 leading-relaxed">
                  Procesamiento efímero en memoria local conforme a RGPD.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

const ProcessingView: React.FC<{
  file: File | null;
  previewUrl: string | null;
  isPdf: boolean;
}> = ({ file, previewUrl, isPdf }) => (
  <section className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 items-start gap-6 overflow-y-auto pb-4 lg:grid-cols-12">
    {/* Columna Izquierda: Visor del documento con escáner láser animado */}
    <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-6">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileScan className="size-4 text-primary" />
          <span className="truncate text-xs font-bold text-slate-800">{file?.name ?? "Documento"}</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          <span className="size-1.5 rounded-full bg-primary animate-ping" />
          Escaneando con IA
        </span>
      </div>

      <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-slate-100 p-4">
        {/* Línea de escaneo láser animada */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#38bdf8] animate-bounce z-10" />

        {isPdf && previewUrl ? (
          <iframe
            src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
            title={file?.name ?? "PDF"}
            className="h-full min-h-[400px] w-full border-0 pointer-events-none opacity-80"
          />
        ) : previewUrl ? (
          <img
            src={previewUrl}
            alt="Escaneando documento"
            className="max-h-[440px] max-w-full object-contain opacity-90"
          />
        ) : null}
      </div>
    </div>

    {/* Columna Derecha: Indicador de Etapas y Skeleton Loaders */}
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-6">
      <div className="border-b border-slate-200 pb-3.5">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          <LoaderCircle className="size-4.5 animate-spin text-primary" /> Analizando documento
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Gemini 2.5 Flash está interpretando los campos visuales y la zona ICAO.
        </p>

        {/* Pasos en tiempo real */}
        <div className="mt-3.5 space-y-2 rounded-xl bg-slate-50 p-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-700">
            <Check className="size-3.5 text-emerald-600" />
            <span>1. Preprocesamiento y orientación de imagen</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-primary animate-pulse">
            <LoaderCircle className="size-3.5 animate-spin text-primary" />
            <span>2. Reconocimiento óptico y lectura de zona MRZ...</span>
          </div>
          <div className="flex items-center gap-2 font-medium text-slate-400">
            <span className="size-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px]">3</span>
            <span>3. Estructurando campos de identidad y validación</span>
          </div>
        </div>
      </div>

      {/* Skeletons de los campos */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="col-span-2 space-y-1">
          <div className="h-3 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-16 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-9 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="col-span-2 space-y-1">
          <div className="h-3 w-36 bg-slate-200 rounded animate-pulse" />
          <div className="h-14 w-full bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </div>
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
      <h3 className="mt-5 text-h3 font-black text-red-950">
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

const TelemetryAccordion: React.FC<{ usage: DocumentExtractionResult["usage"] | null }> = ({ usage }) => {
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
          Telemetría IA: <span className="font-semibold text-slate-800">{usage.totalTokens.toLocaleString("es-ES")} tokens (${usage.estimatedCostUsd.toFixed(5)})</span>
        </span>
        {open ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-200">
          <table className="w-full text-xs">
            <tbody>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens de Entrada</th>
                <td className="py-1 text-right font-bold text-slate-800">{usage.promptTokens.toLocaleString("es-ES")}</td>
              </tr>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens de Salida</th>
                <td className="py-1 text-right font-bold text-slate-800">{usage.outputTokens.toLocaleString("es-ES")}</td>
              </tr>
              <tr className="border-b border-slate-200/60">
                <th className="py-1 text-left font-medium text-slate-500">Tokens Totales</th>
                <td className="py-1 text-right font-bold text-slate-800">{usage.totalTokens.toLocaleString("es-ES")}</td>
              </tr>
              <tr>
                <th className="pt-1.5 text-left font-bold text-slate-600">Coste estimado</th>
                <td className="pt-1.5 text-right font-black text-primary">USD {usage.estimatedCostUsd.toFixed(6)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ExtractedField: React.FC<{
  label: string;
  fieldKey: FieldKey;
  value: string | null | undefined;
  rawVal: string | null | undefined;
  issue?: string;
  isMonospace?: boolean;
  isCritical?: boolean;
  placeholder?: string;
  isHighlighted?: boolean;
  onHighlight?: (key: FieldKey | null) => void;
  onChange: (key: FieldKey, value: string | null) => void;
  onCopy: (value: string | null | undefined, label: string) => void;
  onRestore: (key: FieldKey) => void;
  className?: string;
}> = ({
  label,
  fieldKey,
  value,
  rawVal,
  issue,
  isMonospace,
  isCritical,
  placeholder,
  isHighlighted,
  onHighlight,
  onChange,
  onCopy,
  onRestore,
  className = "",
}) => {
  const isModified = value !== rawVal;
  const hasIssue = Boolean(issue);

  return (
    <div
      className={`min-w-0 flex flex-col transition-all duration-150 ${className}`}
      onMouseEnter={() => onHighlight?.(fieldKey)}
      onMouseLeave={() => onHighlight?.(null)}
    >
      <div className="flex items-center justify-between pb-1">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
            isHighlighted ? "text-cyan-600 font-black" : "text-slate-500"
          }`}
        >
          {label}
        </span>
        {hasIssue ? (
          <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold">
            <X className="size-3" /> Formato no válido
          </span>
        ) : null}
      </div>

      <div className="group relative flex min-w-0 items-center">
        <input
          id={`field-input-${fieldKey}`}
          value={value ?? ""}
          placeholder={
            placeholder ??
            (["birthDate", "issueDate", "expiryDate"].includes(fieldKey)
              ? "DD/MM/AAAA"
              : undefined)
          }
          onFocus={() => onHighlight?.(fieldKey)}
          onBlur={() => onHighlight?.(null)}
          onChange={(event) => onChange(fieldKey, event.target.value || null)}
          className={`w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-sm outline-none transition-all pr-8 ${
            isCritical
              ? "font-mono font-bold text-slate-900 bg-slate-50/50 text-[15px]"
              : isMonospace
                ? "font-mono text-xs tracking-wider"
                : "text-slate-800"
          } ${
            hasIssue
              ? "border-red-300 bg-red-50/20 focus:border-red-500 focus:ring-2 focus:ring-red-200"
              : isHighlighted
                ? "border-cyan-400 bg-cyan-50/30 ring-2 ring-cyan-200 shadow-xs"
                : isModified
                  ? "border-sky-400 bg-sky-50/20 focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                  : "border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20"
          }`}
        />

        <button
          type="button"
          aria-label={`Copiar ${label}`}
          title={`Copiar ${label}`}
          onClick={() => onCopy(value, label)}
          className="absolute right-1.5 flex size-7 items-center justify-center rounded text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-slate-100 hover:text-primary transition-all"
        >
          <Clipboard className="size-3.5" />
        </button>
      </div>

      {isModified && (
        <div className="mt-1 flex items-center justify-between rounded bg-sky-50 px-2 py-0.5 text-[10px] text-slate-600">
          <span className="truncate">
            ↺ Modificado (Original: <span className="font-semibold text-slate-800">{rawVal ?? "vacío"}</span>)
          </span>
          <button
            type="button"
            onClick={() => onRestore(fieldKey)}
            className="ml-2 shrink-0 font-bold text-primary hover:text-primary-dark underline"
          >
            Restaurar
          </button>
        </div>
      )}
    </div>
  );
};

const Review: React.FC<{
  file: File | null;
  backFile?: File | null;
  documentMode?: "single" | "dual";
  activeViewerSide?: "front" | "back";
  onToggleViewerSide?: (side: "front" | "back") => void;
  fields: IdentityDocumentFields;
  rawFields: IdentityDocumentFields;
  issues: Partial<Record<FieldKey, string>>;
  validationAlerts?: ValidationAlert[];
  usage: DocumentExtractionResult["usage"] | null;
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
  activeViewerSide = "front",
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
  <section className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-2 gap-5 items-start overflow-y-auto pb-4">
    {/* Columna Izquierda: Visor de documento */}
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
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
                onClick={() => onToggleViewerSide?.("front")}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  activeViewerSide === "front"
                    ? "bg-white text-primary shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🪪 Anverso
              </button>
              <button
                type="button"
                onClick={() => onToggleViewerSide?.("back")}
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-all ${
                  activeViewerSide === "back"
                    ? "bg-white text-primary shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🔄 Reverso
              </button>
            </div>
          )}
          {file && (
            <span className="max-w-[160px] truncate text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
              {activeViewerSide === "back" && backFile ? backFile.name : file.name}
            </span>
          )}
        </div>
      </div>
      <div className="p-3 bg-slate-50">
        {viewer}
      </div>
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
          <div className={`flex items-center gap-1.5 rounded-lg border transition-all duration-200 bg-white px-2.5 py-1 shadow-2xs ${
            isSwitchingProfile ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "border-slate-200"
          }`}>
            <span className="text-[10px] font-black uppercase text-slate-400">Perfil:</span>
            {isSwitchingProfile && (
              <RefreshCw className="size-3 text-primary animate-spin" />
            )}
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
        <div className="border-b border-red-200 bg-red-50 px-5 py-2 text-xs font-bold text-red-800" role="alert">
          {issueCount} {issueCount === 1 ? "campo requiere" : "campos requieren"} corrección de formato.
        </div>
      )}

      {/* Contenedor del Formulario con 3 Secciones Semánticas y Transición con Blur Blanco */}
      <div className="relative overflow-hidden min-h-[420px]">
        {isSwitchingProfile && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/85 backdrop-blur-md transition-all duration-300">
            <div className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2 shadow-lg border border-slate-200/80 ring-1 ring-slate-100">
              <RefreshCw className="size-4 animate-spin text-primary" />
              <span className="text-xs font-bold text-slate-800">
                Aplicando formato: {EXPORT_PROFILES.find((p) => p.id === exportProfile)?.shortLabel || "Aseguradora"}...
              </span>
            </div>
          </div>
        )}
        <div className={`flex flex-col gap-4 p-5 overflow-y-auto transition-all duration-300 ease-out ${
          isSwitchingProfile
            ? "opacity-15 scale-[0.99] filter blur-sm select-none pointer-events-none"
            : "opacity-100 scale-100 filter blur-0"
        }`}>
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
                ) : (
                  exportProfile === "aseguradora-1"
                    ? "Formato: Apellidos separados (1º y 2º)"
                    : exportProfile === "aseguradora-2"
                      ? "Formato: Apellidos agrupados"
                      : "Formato: ICAO Internacional"
                )}
              </span>
            </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ExtractedField
              label={exportProfile === "icao-internacional" ? "Document Number" : "Número de documento"}
              fieldKey="documentNumber"
              value={fields.documentNumber}
              rawVal={rawFields.documentNumber}
              issue={issues.documentNumber}
              isCritical
              isHighlighted={activeHighlightField === "documentNumber"}
              onHighlight={onHighlightField}
              onChange={onFieldChange}
              onCopy={copy}
              onRestore={restoreField}
            />

            {(fields.documentType === "spanish-dni" || fields.documentType === "spanish-nie" || fields.supportNumber || documentMode === "dual") ? (
              <ExtractedField
                label="Número de soporte (IDESP)"
                fieldKey="supportNumber"
                value={fields.supportNumber}
                rawVal={rawFields.supportNumber}
                issue={issues.supportNumber}
                isHighlighted={activeHighlightField === "supportNumber"}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />
            ) : (
              <ExtractedField
                label={exportProfile === "icao-internacional" ? "Nationality / Country" : "Nacionalidad"}
                fieldKey="nationality"
                value={fields.nationality}
                rawVal={rawFields.nationality}
                issue={issues.nationality}
                isHighlighted={activeHighlightField === "nationality"}
                onHighlight={onHighlightField}
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />
            )}

            {(fields.documentType === "spanish-dni" || fields.documentType === "spanish-nie" || fields.supportNumber || documentMode === "dual") && (
              <ExtractedField
                label={exportProfile === "icao-internacional" ? "Nationality / Country" : "Nacionalidad"}
                fieldKey="nationality"
                value={fields.nationality}
                rawVal={rawFields.nationality}
                issue={issues.nationality}
                isHighlighted={activeHighlightField === "nationality"}
                onHighlight={onHighlightField}
                className="sm:col-span-2"
                onChange={onFieldChange}
                onCopy={copy}
                onRestore={restoreField}
              />
            )}

            {exportProfile === "aseguradora-1" ? (
              <>
                <ExtractedField
                  label="Nombre(s)"
                  fieldKey="givenNames"
                  value={fields.givenNames}
                  rawVal={rawFields.givenNames}
                  issue={issues.givenNames}
                  isHighlighted={activeHighlightField === "givenNames"}
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
                  isHighlighted={activeHighlightField === "firstSurname" || activeHighlightField === "surnames"}
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
                  isHighlighted={activeHighlightField === "secondSurname" || activeHighlightField === "surnames"}
                  onHighlight={onHighlightField}
                  onChange={onFieldChange}
                  onCopy={copy}
                  onRestore={restoreField}
                />
              </>
            ) : exportProfile === "aseguradora-2" ? (
              <>
                <ExtractedField
                  label="Nombre(s)"
                  fieldKey="givenNames"
                  value={fields.givenNames}
                  rawVal={rawFields.givenNames}
                  issue={issues.givenNames}
                  isHighlighted={activeHighlightField === "givenNames"}
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
                  isHighlighted={activeHighlightField === "surnames" || activeHighlightField === "firstSurname" || activeHighlightField === "secondSurname"}
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
                  isHighlighted={activeHighlightField === "givenNames"}
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
                  isHighlighted={activeHighlightField === "surnames" || activeHighlightField === "firstSurname" || activeHighlightField === "secondSurname"}
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
              isHighlighted={activeHighlightField === "birthDate"}
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
              isHighlighted={activeHighlightField === "sex"}
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
              isHighlighted={activeHighlightField === "birthplace"}
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
              isHighlighted={activeHighlightField === "issueDate"}
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
              isHighlighted={activeHighlightField === "expiryDate"}
              onHighlight={onHighlightField}
              className="sm:col-span-2"
              onChange={onFieldChange}
              onCopy={copy}
              onRestore={restoreField}
            />

            {(fields.address || documentMode === "dual" || fields.documentType === "spanish-dni" || fields.documentType === "spanish-nie") && (
              <ExtractedField
                label="Domicilio / Dirección"
                fieldKey="address"
                value={fields.address}
                rawVal={rawFields.address}
                issue={issues.address}
                isHighlighted={activeHighlightField === "address"}
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
            onMouseEnter={() => onHighlightField?.("mrz")}
            onMouseLeave={() => onHighlightField?.(null)}
          >
            <textarea
              id="field-input-mrz"
              rows={2}
              value={fields.mrz ?? ""}
              onFocus={() => onHighlightField?.("mrz")}
              onBlur={() => onHighlightField?.(null)}
              onChange={(event) => onFieldChange("mrz", event.target.value || null)}
              placeholder="P<ESP..."
              className={`w-full rounded-lg border bg-white px-3 py-2.5 text-xs leading-relaxed outline-none transition-all font-mono tracking-wider resize-none pr-8 ${
                issues.mrz
                  ? "border-red-300 bg-red-50/20 focus:border-red-500"
                  : activeHighlightField === "mrz"
                    ? "border-cyan-400 bg-cyan-50/30 ring-2 ring-cyan-200 shadow-xs"
                    : fields.mrz !== rawFields.mrz
                      ? "border-sky-400 bg-sky-50/20 focus:border-sky-500"
                      : "border-slate-200 hover:border-slate-300 focus:border-primary"
              }`}
              style={{ fontFamily: "'SF Mono', 'Roboto Mono', 'Fira Code', ui-monospace, monospace" }}
            />
            <button
              type="button"
              aria-label="Copiar código MRZ"
              title="Copiar código MRZ"
              onClick={() => copy(fields.mrz, "Código MRZ")}
              className="absolute right-2 top-2.5 flex size-7 items-center justify-center rounded text-slate-400 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-slate-100 hover:text-primary transition-all"
            >
              <Clipboard className="size-3.5" />
            </button>
          </div>

          {fields.mrz !== rawFields.mrz && (
            <div className="mt-1 flex items-center justify-between rounded bg-sky-50 px-2 py-0.5 text-[10px] text-slate-600">
              <span className="truncate">
                ↺ Modificado (Original: <span className="font-semibold text-slate-800">{rawFields.mrz ?? "vacío"}</span>)
              </span>
              <button
                type="button"
                onClick={() => restoreField("mrz")}
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
          <CheckCircle2 className="size-4" /> Aprobar extracción <span className="opacity-70 text-[10px] font-normal tracking-wide">(⌘+↵)</span>
        </button>
      </div>
    </div>
  </section>
);

export default DocumentIntelligence;
