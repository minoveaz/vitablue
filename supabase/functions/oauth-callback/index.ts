// Edge Function boundary for OAuth code exchange.
// Provider-specific token exchanges must remain server-side.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('OAUTH_ALLOWED_ORIGIN') ?? 'http://localhost:5173',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type OAuthProvider = 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'x' | 'tiktok';

interface OAuthRequest {
  provider?: OAuthProvider;
  code?: string;
  redirectUri?: string;
  state?: string;
  scopes?: string[];
}

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

const allowedRedirectUris = () => (Deno.env.get('OAUTH_ALLOWED_REDIRECT_URIS') ?? 'http://localhost:5173/backoffice/marketing-studio/conexiones')
  .split(',')
  .map((uri) => uri.trim())
  .filter(Boolean);

const hashState = async (state: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(state));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const authorization = request.headers.get('Authorization');
  if (!authorization?.startsWith('Bearer ')) {
    return json({ error: 'Authentication required' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !supabaseAnonKey) return json({ error: 'Function is not configured' }, 500);

  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData.user) return json({ error: 'Invalid session' }, 401);

  const { data: role, error: roleError } = await authClient.rpc('get_my_marketing_role');
  if (roleError || !['admin', 'editor'].includes(role)) return json({ error: 'Insufficient role' }, 403);

  let payload: OAuthRequest;
  try {
    payload = await request.json() as OAuthRequest;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  if (!payload.provider || !payload.code || !payload.redirectUri || !payload.state) {
    return json({ error: 'provider, code, redirectUri and state are required' }, 400);
  }

  if (!allowedRedirectUris().includes(payload.redirectUri)) {
    return json({ error: 'Redirect URI is not allowed' }, 400);
  }

  const { data: stateConsumed, error: stateError } = await authClient.rpc('consume_oauth_state', {
    p_provider: payload.provider,
    p_state_hash: await hashState(payload.state),
  });
  if (stateError || stateConsumed !== true) return json({ error: 'Invalid or expired OAuth state' }, 400);

  if (payload.provider !== 'facebook' && payload.provider !== 'instagram') {
    return json({ error: 'Provider exchange not configured', provider: payload.provider }, 501);
  }

  const facebookAppId = Deno.env.get('FACEBOOK_APP_ID');
  const facebookAppSecret = Deno.env.get('FACEBOOK_APP_SECRET');
  const graphVersion = Deno.env.get('META_GRAPH_API_VERSION') ?? 'v22.0';
  if (!facebookAppId || !facebookAppSecret) return json({ error: 'Facebook OAuth is not configured' }, 500);

  const tokenParams = new URLSearchParams({
    client_id: facebookAppId,
    client_secret: facebookAppSecret,
    redirect_uri: payload.redirectUri,
    code: payload.code,
  });
  const tokenResponse = await fetch(`https://graph.facebook.com/${graphVersion}/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams,
  });
  if (!tokenResponse.ok) return json({ error: 'Facebook token exchange failed' }, 502);

  const tokenPayload = await tokenResponse.json() as { access_token?: string; expires_in?: number };
  if (!tokenPayload.access_token) return json({ error: 'Facebook did not return an access token' }, 502);

  const profileResponse = await fetch(`https://graph.facebook.com/${graphVersion}/me?fields=id,name&access_token=${encodeURIComponent(tokenPayload.access_token)}`);
  if (!profileResponse.ok) return json({ error: 'Facebook profile lookup failed' }, 502);
  const profile = await profileResponse.json() as { id?: string; name?: string };
  if (!profile.id) return json({ error: 'Facebook profile did not return an account id' }, 502);

  const expiresAt = tokenPayload.expires_in
    ? new Date(Date.now() + tokenPayload.expires_in * 1000).toISOString()
    : null;
  const { data: connectionId, error: storeError } = await authClient.rpc('store_oauth_connection_secret', {
    p_provider: payload.provider,
    p_external_account_id: profile.id,
    p_display_name: profile.name ?? `Facebook ${profile.id}`,
    p_scopes: payload.scopes ?? [],
    p_access_token: tokenPayload.access_token,
    p_refresh_token: '',
    p_expires_at: expiresAt,
  });
  if (storeError || !connectionId) return json({ error: 'OAuth credential storage failed' }, 500);

  return json({
    provider: payload.provider,
    connectionId,
    accountId: profile.id,
    displayName: profile.name ?? null,
    expiresAt,
  });
});
