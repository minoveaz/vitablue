# Automated role and RLS testing

`npm run test:rls` runs a non-destructive matrix against Supabase using real
viewer, editor and admin sessions plus an anonymous client.

The test creates only records prefixed with `rls-test-` and removes them using
the admin session, including best-effort cleanup when an assertion fails.

Required environment variables (never commit these values):

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITABLUE_RLS_VIEWER_EMAIL / VITABLUE_RLS_VIEWER_PASSWORD
VITABLUE_RLS_EDITOR_EMAIL / VITABLUE_RLS_EDITOR_PASSWORD
VITABLUE_RLS_ADMIN_EMAIL / VITABLUE_RLS_ADMIN_PASSWORD
```

The manual GitHub Actions workflow `VitaBlue RLS matrix` runs the same script
with repository secrets. Passwords and service-role keys are not required.
