# Despliegue VitaBlue en Hostinger

## Variables públicas del build

Configurar en el panel de Hostinger únicamente variables públicas:

```env
VITE_SUPABASE_URL=https://sukjcsylkljiyvfklxvj.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-or-anon-key>
VITE_FACEBOOK_APP_ID=1054025863996280
```

No configurar en Hostinger:

- `FACEBOOK_APP_SECRET`;
- tokens OAuth;
- refresh tokens;
- claves `service_role` o `sb_secret_*`.

## URLs de producción

Dominio de producción actual: `https://vitablue.es`

```text
https://vitablue.es/backoffice/marketing-studio/conexiones
```

Debe añadirse exactamente en:

1. Supabase → Edge Functions → Secrets → `OAUTH_ALLOWED_REDIRECT_URIS`.
2. Meta Developers → Facebook Login → Valid OAuth Redirect URIs.

Para conservar desarrollo local, separar ambas URLs con coma:

```text
http://localhost:5173/backoffice/marketing-studio/conexiones,https://vitablue.es/backoffice/marketing-studio/conexiones
```

## Comprobación posterior

- `/login` funciona en el dominio público.
- Un usuario anónimo es redirigido al login.
- `admin`/`editor` pueden acceder al backoffice.
- Facebook conecta y vuelve al dominio público.
- La conexión aparece después de una recarga en otro navegador.
- Desconectar elimina la fila y el secreto server-side.
