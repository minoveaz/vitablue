import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:4173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:4173',
  'https://vitablue.com',
  'https://www.vitablue.com',
  'https://vitablue.es',
  'https://www.vitablue.es',
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

const getCorsHeaders = (request: Request) => ({
  'Access-Control-Allow-Origin': allowedOrigins.has(request.headers.get('Origin') ?? '')
    ? request.headers.get('Origin')!
    : 'null',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});

const json = (body: Record<string, unknown>, request: Request, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...getCorsHeaders(request), 'Content-Type': 'application/json' },
});

const supportedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);
const maxDocumentBytes = 10 * 1024 * 1024;
const bucketName = 'document-intelligence-temp';
const allowedDocumentTypes = ['passport', 'spanish-dni', 'spanish-nie', 'latin-american-national-id', 'unknown'];
const allowedFields = ['documentType', 'issuingCountry', 'fullName', 'givenNames', 'surnames', 'documentNumber', 'birthDate', 'nationality', 'sex', 'issueDate', 'expiryDate', 'birthplace', 'mrz'];

const extractionSchema = {
  type: 'OBJECT',
  properties: {
    documentType: { type: 'STRING', enum: allowedDocumentTypes },
    issuingCountry: { type: 'STRING', nullable: true },
    fullName: { type: 'STRING', nullable: true },
    givenNames: { type: 'STRING', nullable: true },
    surnames: { type: 'STRING', nullable: true },
    documentNumber: { type: 'STRING', nullable: true },
    birthDate: { type: 'STRING', nullable: true },
    nationality: { type: 'STRING', nullable: true },
    sex: { type: 'STRING', nullable: true },
    issueDate: { type: 'STRING', nullable: true },
    expiryDate: { type: 'STRING', nullable: true },
    birthplace: { type: 'STRING', nullable: true },
    mrz: { type: 'STRING', nullable: true },
  },
  required: ['documentType'],
};

const emptyFields = () => Object.fromEntries(allowedFields.map((field) => [field, null]));

const isSafeDocumentPath = (path: string, userId: string) => (
  path.startsWith(`${userId}/`) && !path.includes('..') && !path.startsWith('/')
);

const normalizeExtraction = (value: Record<string, unknown>, usage?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number }) => {
  const documentType = typeof value.documentType === 'string' && allowedDocumentTypes.includes(value.documentType)
    ? value.documentType
    : 'unknown';
  const fields = emptyFields();
  const rawFields = emptyFields();
  for (const field of allowedFields) {
    if (field === 'documentType') {
      fields[field] = documentType;
      rawFields[field] = typeof value[field] === 'string' && value[field].trim() ? value[field].trim() : null;
    }
    else if (typeof value[field] === 'string' && value[field].trim()) {
      rawFields[field] = value[field];
      fields[field] = value[field].trim();
    }
  }
  const promptTokens = usage?.promptTokenCount ?? 0;
  const outputTokens = usage?.candidatesTokenCount ?? 0;
  const totalTokens = usage?.totalTokenCount ?? promptTokens + outputTokens;
  return {
    classification: { type: documentType, confidence: null },
    fields,
    rawFields,
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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: getCorsHeaders(request) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, request, 405);

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !supabaseAnonKey) {
    return json({ error: 'Authentication required' }, request, 401);
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Invalid session' }, request, 401);

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) return json({ error: 'Document extraction provider is not configured' }, request, 503);

  let payload: { fileName?: string; mimeType?: string; documentReference?: string };
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

  try {
    const { data: documentData, error: downloadError } = await client.storage.from(bucketName).download(payload.documentReference);
    if (downloadError || !documentData) return json({ error: 'Document could not be loaded' }, request, 404);
    if (documentData.size > maxDocumentBytes) return json({ error: 'Document exceeds the size limit' }, request, 413);

    const bytes = new Uint8Array(await documentData.arrayBuffer());
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    const base64 = btoa(binary);
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: 'Extract only identity document fields. Never infer missing values. Return null for absent or unreadable fields. Dates must use YYYY-MM-DD when legible.' }] },
        contents: [{ parts: [{ inlineData: { mimeType: payload.mimeType, data: base64 } }, { text: 'Return the identity document extraction as the requested JSON schema.' }] }],
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
    await client.storage.from(bucketName).remove([payload.documentReference]);
  }
});