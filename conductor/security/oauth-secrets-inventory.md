# Inventario seguro de credenciales OAuth

Fecha de revisión: 2026-08-04

Este documento no contiene valores de secretos. Sirve como respaldo operativo
de nombres, ubicación prevista y estado de migración.

## Estado actual

- No existe un archivo `.env` local visible en el repositorio de trabajo.
- `.env` y `.env.*` están ignorados por Git; únicamente `.env.example` está versionado.
- No se ha encontrado ningún `CLIENT_SECRET`, `API_SECRET` o token privado versionado.
- `VITE_SUPABASE_ANON_KEY` es una clave pública para el navegador, no un secreto privado; debe seguir limitada por RLS.
- Las conexiones sociales todavía usan un flujo simulado y guardan estado en `localStorage`.

## Variables OAuth detectadas

| Proveedor | Identificador público actual | Secreto detectado | Destino previsto |
| --- | --- | --- | --- |
| LinkedIn | `VITE_LINKEDIN_CLIENT_ID` | `VITE_LINKEDIN_CLIENT_SECRET` | Edge Function / secreto Supabase |
| Meta | `VITE_FACEBOOK_APP_ID` | `VITE_FACEBOOK_APP_SECRET` | Edge Function / secreto Supabase |
| X | `VITE_X_API_KEY` | `VITE_X_API_SECRET` | Edge Function / secreto Supabase |
| Google/YouTube | `VITE_GOOGLE_CLIENT_ID` | `VITE_GOOGLE_CLIENT_SECRET` | Edge Function / secreto Supabase |
| TikTok | `VITE_TIKTOK_CLIENT_KEY` | No declarado | Edge Function si requiere intercambio privado |

## Procedimiento de respaldo y rotación

1. Exportar los secretos desde cada proveedor OAuth a un gestor seguro de la organización.
2. No pegarlos en Git, `.env.example`, tickets ni conversaciones.
3. Registrar en el gestor el proveedor, entorno, fecha de creación, fecha de rotación y responsable.
4. Crear los secretos equivalentes en Supabase Edge Functions.
5. Rotar cualquier secreto que haya sido usado con prefijo `VITE_` o expuesto en un bundle.
6. Verificar el bundle de producción para confirmar que no contiene secretos privados.

## Criterio de cierre

El frontend solo recibe identificadores públicos. El intercambio OAuth, refresh tokens
y publicación se ejecutan en una función server-side con secretos gestionados fuera del repositorio.
