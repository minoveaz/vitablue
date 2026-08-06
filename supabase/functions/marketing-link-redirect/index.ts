import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = (Deno.env.get('MARKETING_ALLOWED_ORIGINS') ?? 'https://www.vitablue.es,http://localhost:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

const corsHeaders = (origin: string | null) => ({
  'Access-Control-Allow-Origin': origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0],
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

const json = (body: Record<string, unknown>, status: number, origin: string | null) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
});

const getDevice = (userAgent: string) => {
  if (/tablet|ipad/i.test(userAgent)) return 'tablet';
  if (/mobile|android|iphone/i.test(userAgent)) return 'mobile';
  return 'desktop';
};

const getBrowser = (userAgent: string) => {
  if (/edg\//i.test(userAgent)) return 'Edge';
  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) return 'Chrome';
  if (/firefox\//i.test(userAgent)) return 'Firefox';
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) return 'Safari';
  if (/opr\//i.test(userAgent)) return 'Opera';
  return 'Other';
};

const getOperatingSystem = (userAgent: string) => {
  if (/iphone|ipad|ipod/i.test(userAgent)) return 'iOS';
  if (/android/i.test(userAgent)) return 'Android';
  if (/windows/i.test(userAgent)) return 'Windows';
  if (/mac os|macintosh/i.test(userAgent)) return 'macOS';
  if (/linux/i.test(userAgent)) return 'Linux';
  return 'Other';
};

const getCountryCode = (request: Request) => {
  const country = request.headers.get('x-country-code')
    ?? request.headers.get('cf-ipcountry')
    ?? request.headers.get('x-vercel-ip-country');
  return country && /^[A-Za-z]{2}$/.test(country) ? country.toUpperCase() : null;
};

Deno.serve(async (request) => {
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('MARKETING_SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return json({ error: 'Function is not configured' }, 500, origin);

  const payload = await request.json().catch(() => ({})) as { slug?: string; landingUrl?: string };
  const slug = payload.slug?.trim().toLowerCase() ?? '';
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return json({ error: 'Invalid slug' }, 400, origin);

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: link, error: linkError } = await admin
    .from('marketing_links')
    .select('id, phone, message')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle();
  if (linkError) return json({ error: 'Could not resolve link' }, 500, origin);
  if (!link) return json({ error: 'Link not found' }, 404, origin);

  const userAgent = request.headers.get('User-Agent') ?? '';
  const landingUrl = payload.landingUrl?.slice(0, 1000) ?? null;
  const parsedLandingUrl = landingUrl ? new URL(landingUrl) : null;
  await admin.from('marketing_link_clicks').insert({
    link_id: link.id,
    referrer: request.headers.get('Referer'),
    user_agent: userAgent,
    device: getDevice(userAgent),
    country_code: getCountryCode(request),
    language: request.headers.get('Accept-Language')?.split(',')[0]?.trim() ?? null,
    browser: getBrowser(userAgent),
    operating_system: getOperatingSystem(userAgent),
    landing_url: landingUrl,
    utm_source: parsedLandingUrl?.searchParams.get('utm_source'),
    utm_medium: parsedLandingUrl?.searchParams.get('utm_medium'),
    utm_campaign: parsedLandingUrl?.searchParams.get('utm_campaign'),
    utm_content: parsedLandingUrl?.searchParams.get('utm_content'),
    redirect_status: 'success',
  });

  return json({ redirectUrl: `https://wa.me/${link.phone}?text=${encodeURIComponent(link.message)}` }, 200, origin);
});
