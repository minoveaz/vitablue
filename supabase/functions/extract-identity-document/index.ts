import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('DOCUMENT_INTELLIGENCE_ALLOWED_ORIGIN') ?? 'http://localhost:5173',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

const supportedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = request.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authorization?.startsWith('Bearer ') || !supabaseUrl || !supabaseAnonKey) {
    return json({ error: 'Authentication required' }, 401);
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Invalid session' }, 401);

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) return json({ error: 'Document extraction provider is not configured' }, 503);

  let payload: { fileName?: string; mimeType?: string; documentReference?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!payload.fileName || !payload.mimeType || !payload.documentReference) {
    return json({ error: 'fileName, mimeType and documentReference are required' }, 400);
  }
  if (!supportedMimeTypes.has(payload.mimeType)) return json({ error: 'Unsupported document type' }, 415);

  // The provider call is intentionally kept behind this boundary. The next step
  // will resolve documentReference through private Storage and normalize Gemini's
  // response before returning it to the browser.
  void geminiApiKey;
  return json({ error: 'Document extraction provider is not enabled yet' }, 501);
});