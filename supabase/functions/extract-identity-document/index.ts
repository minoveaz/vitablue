import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4173',
  'https://vitablue.es',
  'https://www.vitablue.es',
  'https://vitablue.com',
  'https://www.vitablue.com',
  'https://estarprotegidos.com',
  'https://www.estarprotegidos.com',
];

const configuredAllowedOrigins = (Deno.env.get('DOCUMENT_INTELLIGENCE_ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const legacyAllowedOrigin = Deno.env.get('DOCUMENT_INTELLIGENCE_ALLOWED_ORIGIN');
const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...configuredAllowedOrigins,
  ...(legacyAllowedOrigin ? [legacyAllowedOrigin] : []),
]);

const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (allowedOrigins.has(origin)) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return true;
  if (/^https:\/\/([a-zA-Z0-9-]+\.)*(vitablue\.(es|com)|estarprotegidos\.(es|com))$/.test(origin)) return true;
  return false;
};

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin! : (origin || '*'),
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

const json = (body: Record<string, unknown>, request: Request, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
});

const supportedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const maxDocumentBytes = 10 * 1024 * 1024;
const bucketName = 'document-intelligence-temp';
const allowedDocumentTypes = ['passport', 'spanish-dni', 'spanish-nie', 'latin-american-national-id', 'unknown'];
type IdentityDocumentType = 'passport' | 'spanish-dni' | 'spanish-nie' | 'latin-american-national-id' | 'unknown';
const allowedFields = ['documentType', 'issuingCountry', 'fullName', 'givenNames', 'surnames', 'firstSurname', 'secondSurname', 'documentNumber', 'supportNumber', 'birthDate', 'nationality', 'sex', 'issueDate', 'expiryDate', 'birthplace', 'address', 'mrz'];

const extractionSchema = {
  type: 'OBJECT',
  properties: {
    documentType: { type: 'STRING', enum: allowedDocumentTypes },
    issuingCountry: { type: 'STRING', nullable: true },
    fullName: { type: 'STRING', nullable: true },
    givenNames: { type: 'STRING', nullable: true },
    surnames: { type: 'STRING', nullable: true },
    firstSurname: { type: 'STRING', nullable: true },
    secondSurname: { type: 'STRING', nullable: true },
    documentNumber: { type: 'STRING', nullable: true },
    supportNumber: { type: 'STRING', nullable: true },
    birthDate: { type: 'STRING', nullable: true },
    nationality: { type: 'STRING', nullable: true },
    sex: { type: 'STRING', nullable: true },
    issueDate: { type: 'STRING', nullable: true },
    expiryDate: { type: 'STRING', nullable: true },
    birthplace: { type: 'STRING', nullable: true },
    address: { type: 'STRING', nullable: true },
    mrz: { type: 'STRING', nullable: true },
  },
  required: ['documentType'],
};

const emptyFields = () => Object.fromEntries(allowedFields.map((field) => [field, null]));

const isSafeDocumentPath = (path: string, userId: string) => (
  path.startsWith(`${userId}/`) && !path.includes('..') && !path.startsWith('/')
);

const normalizeDateString = (value: string | null): string | null => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  const ymd = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymd) return `${ymd[3].padStart(2, '0')}/${ymd[2].padStart(2, '0')}/${ymd[1]}`;
  const dmy = trimmed.match(/^(\d{1,2})[-.](\d{1,2})[-.](\d{4})$/);
  if (dmy) return `${dmy[1].padStart(2, '0')}/${dmy[2].padStart(2, '0')}/${dmy[3]}`;
  const dmySlash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (dmySlash) return `${dmySlash[1].padStart(2, '0')}/${dmySlash[2].padStart(2, '0')}/${dmySlash[3]}`;
  const numeric8 = trimmed.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (numeric8) return `${numeric8[3]}/${numeric8[2]}/${numeric8[1]}`;
  const ddmmyyyy = trimmed.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[1]}/${ddmmyyyy[2]}/${ddmmyyyy[3]}`;
  return trimmed;
};

const dateFields = new Set(['birthDate', 'issueDate', 'expiryDate']);

const sanitizeBoundingBoxes = (rawBoxes: unknown): Record<string, [number, number, number, number]> | null => {
  if (!rawBoxes || typeof rawBoxes !== 'object') return null;
  const validBoxes: Record<string, [number, number, number, number]> = {};
  for (const [key, val] of Object.entries(rawBoxes as Record<string, unknown>)) {
    if (Array.isArray(val) && val.length === 4) {
      const nums = val.map((n) => typeof n === 'number' ? Math.round(n) : Number(n));
      if (nums.every((num) => Number.isFinite(num))) {
        const [ymin, xmin, ymax, xmax] = nums as [number, number, number, number];
        const clampedYmin = Math.max(0, Math.min(1000, ymin));
        const clampedXmin = Math.max(0, Math.min(1000, xmin));
        const clampedYmax = Math.max(0, Math.min(1000, ymax));
        const clampedXmax = Math.max(0, Math.min(1000, xmax));
        if (clampedYmax >= clampedYmin && clampedXmax >= clampedXmin) {
          validBoxes[key] = [clampedYmin, clampedXmin, clampedYmax, clampedXmax];
        }
      }
    }
  }
  return Object.keys(validBoxes).length > 0 ? validBoxes : null;
};

const normalizeExtraction = (
  value: Record<string, unknown>,
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number }
) => {
  const fields = emptyFields();
  const rawFields = emptyFields();
  for (const field of allowedFields) {
    const rawVal = value[field];
    if (typeof rawVal === 'string') {
      const trimmed = rawVal.trim();
      rawFields[field] = trimmed || null;
      fields[field] = dateFields.has(field) ? normalizeDateString(trimmed) : (trimmed || null);
    } else {
      rawFields[field] = null;
      fields[field] = null;
    }
  }
  const documentType = allowedDocumentTypes.includes(String(value.documentType))
    ? (value.documentType as IdentityDocumentType)
    : 'unknown';

  const promptTokens = usageMetadata?.promptTokenCount ?? 0;
  const outputTokens = usageMetadata?.candidatesTokenCount ?? 0;
  const totalTokens = usageMetadata?.totalTokenCount ?? (promptTokens + outputTokens);

  return {
    classification: { type: documentType, confidence: null },
    fields,
    rawFields,
    boundingBoxes: sanitizeBoundingBoxes(value.boundingBoxes),
    validations: [],
    provider: 'gemini',
    usage: {
      promptTokens,
      outputTokens,
      totalTokens,
      estimatedCostUsd: Number(((promptTokens * 0.30 + outputTokens * 2.50) / 1_000_000).toFixed(6)),
    },
  };
};

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response(null, { headers: getCorsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, request, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization) return json({ error: 'Unauthorized' }, request, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !supabaseAnonKey) return json({ error: 'Supabase is not configured' }, request, 500);

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Invalid session' }, request, 401);

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) return json({ error: 'Document extraction provider is not configured' }, request, 503);

  let payload: {
    fileName?: string;
    mimeType?: string;
    documentReference?: string;
    backFileName?: string;
    backMimeType?: string;
    backDocumentReference?: string;
  };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, request, 400);
  }

  if (!payload.fileName || !payload.mimeType || !payload.documentReference) {
    return json({ error: 'fileName, mimeType and documentReference are required' }, request, 400);
  }
  if (!supportedMimeTypes.has(payload.mimeType)) return json({ error: 'Unsupported document type' }, request, 415);
  if (!isSafeDocumentPath(payload.documentReference, userData.user.id)) return json({ error: 'Invalid document reference' }, request, 400);

  if (payload.backDocumentReference) {
    if (payload.backMimeType && !supportedMimeTypes.has(payload.backMimeType)) {
      return json({ error: 'Unsupported back document type' }, request, 415);
    }
    if (!isSafeDocumentPath(payload.backDocumentReference, userData.user.id)) {
      return json({ error: 'Invalid back document reference' }, request, 400);
    }
  }

  const pathsToCleanup = [payload.documentReference, ...(payload.backDocumentReference ? [payload.backDocumentReference] : [])];

  try {
    const { data: documentData, error: downloadError } = await client.storage.from(bucketName).download(payload.documentReference);
    if (downloadError || !documentData) return json({ error: 'Document could not be loaded' }, request, 404);
    if (documentData.size > maxDocumentBytes) return json({ error: 'Document exceeds the size limit' }, request, 413);

    const bytes = new Uint8Array(await documentData.arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary);

    const parts: Array<Record<string, unknown>> = [
      { inlineData: { mimeType: payload.mimeType, data: base64 } }
    ];

    if (payload.backDocumentReference) {
      const { data: backData, error: backDownloadError } = await client.storage.from(bucketName).download(payload.backDocumentReference);
      if (!backDownloadError && backData) {
        const backBytes = new Uint8Array(await backData.arrayBuffer());
        let backBinary = '';
        for (const byte of backBytes) backBinary += String.fromCharCode(byte);
        const backBase64 = btoa(backBinary);
        parts.push({
          inlineData: { mimeType: payload.backMimeType || payload.mimeType, data: backBase64 }
        });
      }
    }

    parts.push({
      text: 'Return the identity document extraction as the requested JSON schema. If two images are provided, they represent the Front and Back of the same identity document (such as Spanish DNI/NIE or residence card). Correlate both sides to extract names, numbers, supportNumber (IDESP / Support Number), address, birthplace, issueDate, expiryDate, and MRZ.'
    });

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: 'You are an expert identity document OCR and extraction AI. Extract all visible identity fields (documentType, issuingCountry, documentNumber, supportNumber, fullName, givenNames, surnames, firstSurname, secondSurname, birthDate, nationality, sex, issueDate, expiryDate, birthplace, address, mrz). If an ID card has front and back, extract supportNumber (such as IDESP / Support Number) and address from the appropriate side. Dates must use DD/MM/YYYY format. Never infer absent values, return null for unreadable fields.'
          }]
        },
        contents: [{ parts }],
        generationConfig: { temperature: 0, responseMimeType: 'application/json', responseSchema: extractionSchema },
      }),
    });
    if (!geminiResponse.ok) return json({ error: 'Document extraction provider failed' }, request, 502);

    const providerPayload = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
    };
    const text = providerPayload.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text;
    if (!text) return json({ error: 'Document extraction returned no result' }, request, 502);
    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return json({ error: 'Document extraction returned invalid data' }, request, 502);
    }
    return json(normalizeExtraction(extracted, providerPayload.usageMetadata), request);
  } catch {
    return json({ error: 'Document extraction failed' }, request, 502);
  } finally {
    await client.storage.from(bucketName).remove(pathsToCleanup);
  }
});