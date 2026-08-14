# Supabase Edge Functions

`oauth-callback` is the server-side boundary for exchanging OAuth authorization
codes. It currently validates the Supabase session, requires `admin` or `editor`,
and checks an allowlist of redirect URIs. It is intentionally a safe scaffold
until each provider is configured.

Before enabling a provider:

1. Configure its client secret with `supabase secrets set`, never with `VITE_`.
2. Validate the authenticated Supabase user and required role.
3. Verify `state`, redirect URI and PKCE where supported (the current provider branch still requires this before production use).
4. Exchange the code server-side and store refresh tokens outside the browser.
5. Return only non-sensitive connection metadata to the client.

## Document intelligence

`extract-identity-document` is the authenticated server-side boundary for identity-document extraction.
Configure `GEMINI_API_KEY` with `supabase secrets set GEMINI_API_KEY=...`; never expose it through `VITE_*` variables.
The function validates the session and accepted MIME types. It must resolve only private temporary Storage references and
return the normalized `DocumentExtractionResult`; it must not log document bytes, MRZ values, prompts, or raw provider responses.
