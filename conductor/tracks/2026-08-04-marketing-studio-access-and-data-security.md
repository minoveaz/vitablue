# Track: Acceso seguro y separación del Marketing Studio

## Objetivo

Proteger el Marketing Studio de VitaBlue para que solo usuarios autorizados puedan acceder y modificar datos, sin confiar únicamente en ocultar la ruta en producción. La solución debe cubrir:

- autenticación del equipo;
- autorización por rol;
- políticas RLS de Supabase;
- protección de secretos OAuth;
- separación entre web pública y backoffice;
- validación automatizada y plan de recuperación.

## Decisión arquitectónica

Sí: crear una página de login para Marketing Studio.

No: el login por sí solo no es suficiente. El navegador siempre puede llamar directamente a Supabase, por lo que las tablas deben rechazar operaciones no autorizadas mediante RLS. La UI solo mejora la experiencia y evita mostrar el panel a visitantes; RLS es la barrera real de datos.

Arquitectura objetivo:

```text
Web pública VitaBlue
  └─ Solo datos públicos y operaciones públicas estrictamente necesarias

Marketing Studio
  └─ /marketing-studio/login
      └─ Supabase Auth
          └─ sesión válida + rol admin/editor
              └─ rutas protegidas y operaciones permitidas por RLS

Funciones server-side / Edge Functions
  └─ OAuth, client secrets, tokens y publicación en redes sociales
```

## Estado actual que motiva el track

- `App.tsx` registra Marketing Studio solo en desarrollo, pero no existe autenticación.
- `marketing-studio/utils/supabaseClient.ts` crea el cliente Supabase en frontend.
- `supabase/02_rls_policies.sql` permite `FOR ALL` con `USING (true)` y `WITH CHECK (true)` para todas las personas que tengan acceso al cliente público.
- `VITE_*_CLIENT_SECRET` aparece en `.env.example`; cualquier secreto con prefijo `VITE_` puede acabar en el bundle del navegador.
- Perfiles, campañas y conexiones usan `localStorage` como almacenamiento local auxiliar.

## Progreso inicial

- [x] Añadido `scripts/validate_routes.cjs` como auditoría de solo lectura.
- [x] Añadidos los scripts `npm run validate-routes` y `npm run typecheck`.
- [x] Corregida la configuración de TypeScript para que pueda ejecutarse sin `ignoreDeprecations`.
- [x] Confirmado que el auditor no modifica `App.tsx`, `vite.config.ts`, `public/sitemap.xml` ni el build publicado.
- [x] Resueltas las dos rutas declaradas sin prerender: `/productos/seguro-viaje` y `/productos/seguro-vida`.
- [x] Verificado el build y prerender completo después de añadir esas dos rutas.
- [x] Creado `config/routes.ts` como inventario tipado inicial, todavía sin conectarlo al router ni al generador SEO.
- [x] Conectado el auditor de paridad al inventario tipado para detectar rutas huérfanas en ambos sentidos.
- [x] Añadido `npm run validate-routes:strict` como puerta de paridad para CI.
- [x] `vite.config.ts` consume `prerenderRoutes` del registro tipado y los slugs de `blogData.ts`.
- [x] Build y prerender verificados con la lista generada (53 rutas).
- [x] Añadido `npm run validate-sitemap`, que compara las 32 URLs del sitemap con canonicals y blog.
- [x] Confirmada paridad exacta del sitemap actual con el registro tipado y `blogData.ts`.
- [x] Añadidos `npm run generate-sitemap:check` y `npm run generate-sitemap`; el primero valida sin escribir y el segundo requiere escritura explícita.
- [x] `sync-blog` ahora delega en el generador tipado de sitemap y ejecuta la auditoría estricta de rutas.
- [x] Workflow de deploy protegido con validación estricta de rutas y sitemap antes del build.
- [x] Primera tanda de TypeScript corregida: contratos de formulario, conexiones, perfil del wizard, callback del hero, WhatsApp, traducciones y `hrefLang` SEO.
- [x] Limpiados imports/variables no usados y cerrado el `typecheck` completo.
- [x] Build, prerender, auditoría estricta de rutas y auditoría de sitemap verificados después de la limpieza.
- [x] Eliminada la opción innecesaria `ignoreDeprecations` de `tsconfig.json`; `npm run typecheck` continúa pasando.
- [x] Eliminado `baseUrl`, opción marcada como obsoleta por el TypeScript de VS Code; los alias `@/*` siguen pasando el typecheck mediante `paths`.
- [ ] Clasificar las 21 URLs legacy fuera del sitemap antes de crear canonicals y redirecciones.
- [x] Registrar las rutas dinámicas de blog y la excepción dinámica del panel en el registro tipado.

Resultado de la primera auditoría: `App.tsx` contiene 56 rutas (3 dinámicas), `vite.config.ts` contiene 53 rutas prerenderizadas tras corregir viaje/vida y `sitemap.xml` contiene 32 URLs.

### Política provisional de URLs legacy

Esta clasificación es deliberadamente documental. No activa todavía redirecciones ni cambia el router público.

| URL actual | Tratamiento previsto | URL canónica / motivo |
| --- | --- | --- |
| `/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud.html` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud` |
| `/productos/seguros-salud/seguros-sanitas/sanitas-mascotas.html` | Redirección permanente | `/productos/seguro-mascotas/sanitas-mascotas` |
| `/productos/seguros-salud/seguros-sanitas/asistencia-familiar-iplus.html` | Redirección permanente | `/productos/seguro-para-decesos/asistencia-familiar` |
| `/productos/seguros-salud/seguros-sanitas/seguro-medico-estudiantes-extranjeros-espana.html` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/international-students` |
| `/productos/seguros-salud/sanitas-mas-salud` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud` |
| `/productos/seguro-medico-estudiantes-extranjeros-espana.html` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/international-students` |
| `/productos/international-students.html` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/international-students` |
| `/seguros-salud` | Redirección permanente | `/productos/seguros-salud` |
| `/productos/seguro-de-salud.html` | Redirección permanente | `/productos/seguros-salud` |
| `/seguro-expatriados` | Redirección permanente | `/productos/seguros-salud/seguro-expatriados` |
| `/productos/seguro-medico-expatriados.html` | Redirección permanente | `/productos/seguros-salud/seguro-expatriados` |
| `/seguro-nomadas` | Redirección permanente | `/productos/seguros-salud/seguro-nomadas-digitales` |
| `/productos/seguro-nomadas-digitales.html` | Redirección permanente | `/productos/seguros-salud/seguro-nomadas-digitales` |
| `/productos/sanitas-mas-salud.html` | Redirección permanente | `/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud` |
| `/productos/sanitas-mascotas.html` | Redirección permanente | `/productos/seguro-mascotas/sanitas-mascotas` |
| `/productos/asistencia-familiar-iplus.html` | Redirección permanente | `/productos/seguro-para-decesos/asistencia-familiar` |
| `/privacidad.html` | Redirección permanente | `/privacidad` o la política canónica que se confirme legalmente |
| `/politica-cookies.html` | Redirección permanente | `/politica-cookies` |
| `/cotizador.html` | Alias funcional no indexable | Mantener acceso al funnel; `noindex`, sin sitemap |
| `/wizard` | Alias funcional no indexable | Mantener acceso al funnel; `noindex`, sin sitemap |
| `/resultados` | Ruta funcional no indexable | Mantener acceso al resultado; `noindex`, sin sitemap |

- [x] Clasificación inicial de las 21 URLs completada.
- [ ] Confirmar con negocio/legal la canonical de privacidad antes de aplicar redirects.
- [ ] Implementar redirects en la infraestructura de hosting, no como duplicados de React Router.
- [ ] Mantener los aliases funcionales del funnel hasta confirmar que no existen enlaces o campañas activas que dependan de ellos.

## Fases de implementación

### Fase 0 — Inventario y respaldo

- [ ] Confirmar el proyecto y entorno Supabase utilizado por VitaBlue.
- [ ] Exportar un respaldo de `social_profiles` y `marketing_campaigns`.
- [ ] Documentar quién necesita acceso y qué acciones necesita cada persona.
- [ ] Clasificar acciones: lectura, creación, edición, borrado, conexión OAuth y publicación.
- [ ] No revocar todavía las políticas actuales hasta tener usuarios administradores creados y una ruta de recuperación.

**Salida:** inventario de usuarios/acciones y respaldo verificable.

### Fase 0B — Fuente única de verdad para rutas, SEO y SSG

Actualmente existen inventarios independientes de rutas:

- 56 rutas declaradas en `App.tsx`;
- 54 rutas prerenderizadas en `vite.config.ts`;
- 32 URLs publicadas en `public/sitemap.xml`.

Esto permite que una página sea navegable pero no prerenderizada, tenga canonical incorrecto o no aparezca en el sitemap.

- [ ] Crear un registro tipado de rutas canónicas, por ejemplo `config/routes.ts` o `domain/routing/routes.ts`.
- [ ] Definir por ruta: `path`, componente, idioma, canonical, `hreflang`, indexabilidad, prioridad SEO y si es legacy.
- [ ] Generar desde ese registro las rutas de React Router.
- [ ] Generar desde el mismo registro las rutas de `vite-plugin-prerender`.
- [ ] Generar `sitemap.xml` y, si aplica, `robots.txt` desde el mismo registro.
- [ ] Generar los enlaces `canonical`, `alternate` y `x-default` sin duplicarlos manualmente en cada página.
- [ ] Declarar redirecciones legacy separadas de las rutas canónicas.
- [ ] Implementar las URLs legacy como redirecciones permanentes en infraestructura/hosting, no como otra renderización del mismo componente.
- [ ] Sustituir el script de blog basado en regex por una generación estructurada y validable.
- [ ] Añadir una validación que falle si una ruta indexable no tiene prerender, canonical o sitemap cuando corresponda.
- [ ] Añadir una validación inversa que detecte URLs del sitemap sin ruta real.

**Criterio:** el número de rutas React, prerenderizadas y URLs SEO debe ser explicable desde un único registro, con excepciones legacy documentadas.

### Fase 1 — Modelo de identidad y roles

- [ ] Activar Supabase Auth con email/password o magic link según la política del equipo.
- [ ] Crear una tabla `public.user_roles` con `user_id`, `role`, `created_at` y una restricción de roles válidos (`admin`, `editor`, opcionalmente `viewer`).
- [ ] Crear una función SQL segura, por ejemplo `has_role(required_role)`, que consulte `auth.uid()` y nunca acepte el rol desde datos controlados por el cliente.
- [ ] Crear el primer usuario administrador desde el panel de Supabase o un procedimiento operativo seguro.
- [ ] Definir recuperación de contraseña, cierre de sesión y expiración/refresco de sesión.

**Regla:** el rol no debe guardarse solo en `localStorage`, en una variable React ni en una URL.

### Fase 2 — Página y guardas de login

- [ ] Crear `pages/MarketingLogin.tsx` como ruta `/marketing-studio/login`.
- [ ] Crear un hook/contexto de sesión (`useAuth` o `AuthProvider`) que escuche cambios de sesión de Supabase.
- [ ] Crear un `ProtectedRoute` que:
  - redirija a `/marketing-studio/login` si no hay sesión;
  - muestre estado de carga mientras se resuelve la sesión;
  - redirija a una pantalla de “sin permisos” si el usuario no tiene rol válido.
- [ ] Envolver todas las rutas `/marketing-studio/*` con esa guarda.
- [ ] Mantener el Marketing Studio fuera de la navegación pública.
- [ ] No ocultar el panel únicamente con `import.meta.env.DEV`; la protección debe existir también en producción.
- [ ] Añadir una acción visible de cerrar sesión.

**Criterio:** un visitante no autenticado nunca debe ver el panel ni sus datos, incluso si escribe directamente la URL.

### Fase 3 — RLS real en Supabase

- [ ] Eliminar las políticas públicas `FOR ALL` de `social_profiles` y `marketing_campaigns`.
- [ ] Mantener `SELECT` público solo si se demuestra que la web pública lo necesita; si no, hacerlo privado.
- [ ] Crear políticas explícitas por operación:
  - `SELECT`: `admin`, `editor` o `viewer` según necesidad;
  - `INSERT` y `UPDATE`: `admin` y `editor`;
  - `DELETE`: solo `admin`;
  - operaciones de administración de usuarios: solo fuera del cliente normal y solo `admin`.
- [ ] Asociar campañas y perfiles a un propietario/equipo si el modelo va a admitir más de una marca.
- [ ] Añadir constraints de validación para estados, plataformas y tipos de contenido.
- [ ] Probar cada política con usuarios autenticados, usuarios sin rol y usuario anónimo.
- [ ] Ejecutar pruebas negativas: intentar leer, modificar y borrar con la clave pública sin sesión válida.

**Criterio:** una llamada directa a Supabase con sesión anónima o rol insuficiente debe devolver error de autorización, aunque se construya manualmente fuera de la UI.

### Fase 4 — Secretos y OAuth fuera del navegador

- [ ] Eliminar secretos OAuth del conjunto `VITE_*`.
- [ ] Mantener en frontend únicamente identificadores públicos que el proveedor permita exponer.
- [ ] Mover intercambio de `code` por tokens, refresh tokens y client secrets a Supabase Edge Functions o backend privado.
- [ ] Guardar secretos en variables protegidas del entorno de Supabase/CI, nunca en el repositorio.
- [ ] Revisar los tokens actualmente guardados en `localStorage`; migrarlos a almacenamiento server-side o a una estrategia de sesión segura.
- [ ] Rotar cualquier secreto que haya sido usado previamente con prefijo `VITE_` o haya estado en código/versiones públicas.
- [ ] Configurar allowlists de redirect URI por entorno y validar `state`/PKCE en OAuth.

**Criterio:** inspeccionar el bundle de producción y confirmar que no contiene client secrets, refresh tokens ni credenciales privadas.

### Fase 4B — Separar composición de aplicación y catálogo de páginas

`App.tsx` mezcla actualmente routing, layout global, styleguide y lógica de desarrollo. Varias páginas de negocio son monolitos de 35–50 KB.

- [ ] Reducir `App.tsx` a composición de providers, router, layout global y registro de rutas.
- [ ] Mover el styleguide a `pages/dev/` o a una entrada de desarrollo separada.
- [ ] Mantener styleguide y Marketing Studio fuera del bundle público cuando no sean necesarios.
- [ ] Crear layouts explícitos para web pública, funnel del cotizador y backoffice.
- [ ] Dividir landings grandes por secciones reutilizables: hero, beneficios, cobertura, exclusiones, FAQ, prueba social y CTA.
- [ ] Extraer contenido repetido a datos tipados, sin duplicar JSX entre variantes de salud.
- [ ] Definir límites claros entre `pages`, `components`, `domain`, `services` y `utils`.
- [ ] Añadir pruebas de que cada layout conserva navegación, footer, consentimiento y metadatos esperados.

**Criterio:** `App.tsx` no contiene contenido de negocio ni el styleguide; las páginas se pueden modificar por secciones sin duplicación masiva.

### Fase 4C — Consolidar el modelo de dominio y el catálogo de productos

Las coberturas, precios, proveedores, copy, URLs y recomendaciones están distribuidos entre páginas y `utils/recommendationEngine.ts`. El motor actual maneja solo dos productos y contiene un destino `example.com`.

- [ ] Crear `domain/products/` con tipos para proveedor, producto, cobertura, exclusión, precio, documento, URL canónica y versión de catálogo.
- [ ] Convertir el catálogo de productos en una fuente de verdad única.
- [ ] Añadir estado de publicación, fecha de vigencia y fuente de cada precio/cobertura.
- [ ] Modelar explícitamente elegibilidad por perfil, visado, duración, residencia, edad, movilidad y territorios.
- [ ] Separar reglas de elegibilidad, ranking/recomendación y presentación de UI.
- [ ] Hacer que el motor devuelva decisiones explicables: producto, puntuación/razones, restricciones y disclaimers.
- [ ] Sustituir enlaces placeholder por destinos reales validados; fallar el build si aparece `example.com` en el catálogo productivo.
- [ ] Añadir pruebas de casos límite: criterios incompletos, perfiles incompatibles, USA/Norteamérica y productos no elegibles.
- [ ] Versionar cambios de precio y cobertura para evitar que una landing histórica pierda coherencia.

**Criterio:** ninguna página define por su cuenta precio, proveedor, cobertura o URL canónica que también exista en el catálogo.

### Fase 4D — Gobernanza del sistema de diseño y white-label

Hay tokens semánticos y utilidades tipográficas, pero todavía existen hexadecimales y valores visuales directos en componentes como `Button.tsx` y `Navbar.tsx`.

- [ ] Ampliar tokens para estados, superficies, bordes, foco, sombras, ilustraciones y estados de error/éxito.
- [ ] Sustituir hexadecimales de componentes por clases semánticas o tokens del sistema.
- [ ] Eliminar tamaños y anchos fijos en contenedores principales; conservar únicamente límites fluidos responsive.
- [ ] Formalizar variantes y estados de átomos (`Button`, inputs, badges, cards) con APIs tipadas.
- [ ] Asegurar foco visible, labels, navegación por teclado y nombres accesibles.
- [ ] Convertir el styleguide en una página de desarrollo aislada y verificable contra los tokens.
- [ ] Documentar qué valores pueden ser específicos de una marca y cuáles pertenecen al sistema compartido.

**Criterio:** una segunda marca puede cambiar tokens sin editar cada landing ni buscar colores raw en todo el código.

### Fase 6B — Calidad automatizada y puertas de CI

Actualmente no existen scripts de lint ni test formales. El typecheck ya está disponible y pasa; Vite transpila sin comprobar tipos por separado.

- [x] Corregir `tsconfig.json` y fijar una versión compatible de TypeScript.
- [ ] Añadir scripts `typecheck`, `lint`, `test` y, si procede, `test:e2e`.
- [ ] Instalar y configurar ESLint para TypeScript/React/hooks.
- [ ] Añadir pruebas unitarias del motor de recomendación y del catálogo.
- [ ] Añadir pruebas de rutas, canónicos, `hreflang`, prerender y sitemap.
- [ ] Añadir pruebas de login, logout, roles, `ProtectedRoute` y estados de sesión.
- [ ] Añadir pruebas de RLS con usuario anónimo, viewer, editor y admin.
- [ ] Ejecutar typecheck, lint, tests y build en GitHub Actions antes de publicar `deploy`.
- [ ] Hacer que el pipeline falle ante `example.com`, secretos en bundle, rutas SEO huérfanas o warnings críticos.

**Criterio:** ningún commit llega a deploy sin pasar typecheck, lint, tests, build y validación de rutas SEO.

### Fase 6C — Consentimiento, cookies y analítica

El banner actual guarda una decisión en `localStorage`, pero no existe una capa central que condicione la carga de analítica y marketing.

- [ ] Crear `ConsentProvider` con categorías mínimas: necesarias, analítica, marketing y preferencias.
- [ ] Definir el estado inicial como no consentido para categorías no necesarias.
- [ ] Centralizar lectura, escritura, expiración y actualización del consentimiento.
- [ ] Cargar Google Analytics, Ads y cualquier píxel solo después del consentimiento correspondiente.
- [ ] Permitir cambiar o retirar el consentimiento desde la política de cookies.
- [ ] Evitar que componentes individuales llamen directamente a `localStorage` para decisiones de privacidad.
- [ ] Documentar proveedores, finalidad, duración y base legal de cada cookie/tag.
- [ ] Probar aceptación, rechazo, retirada, navegación entre rutas y ausencia de tags antes del consentimiento.

**Criterio:** ningún script de analítica o marketing se ejecuta antes del consentimiento aplicable, incluso en una navegación directa a una landing.

### Fase 7 — Separación del backoffice

Evaluar dos opciones:

1. **Opción inicial:** mantenerlo en este proyecto, pero con rutas protegidas, lazy loading independiente y políticas RLS.
2. **Opción recomendada a medio plazo:** extraer Marketing Studio a una aplicación privada separada, con su propio deploy, dominio/subdominio y pipeline.

La separación reduce el riesgo de mezclar código comercial, SEO, datos internos y permisos. No es un requisito para iniciar la protección, pero sí una buena frontera de arquitectura.

### Fase 8 — Calidad, observabilidad y operación

- [ ] Añadir scripts `typecheck`, `lint` y pruebas automatizadas.
- [ ] Añadir pruebas de `ProtectedRoute`, login/logout, roles y estados de sesión.
- [ ] Añadir pruebas SQL/RLS para cada tabla y cada operación.
- [ ] Registrar errores de autenticación y fallos de sincronización sin escribir secretos en logs.
- [ ] Configurar alertas para cambios de políticas RLS y accesos fallidos repetidos.
- [ ] Revisar periódicamente usuarios, roles, OAuth connections y sesiones activas.

## Orden recomendado de entregas

1. Inventario, respaldo y registro único de rutas.
2. Auth + primer administrador.
3. Login, logout y `ProtectedRoute`.
4. RLS restrictivo probado en staging.
5. Migración de OAuth/secretos a funciones server-side.
6. Separación de `App`, styleguide y layouts.
7. Catálogo tipado y motor de recomendaciones explicable.
8. Tokens y gobernanza del sistema de diseño.
9. Consentimiento centralizado y carga condicional de analítica.
10. CI, pruebas y documentación operativa.
11. Decisión final sobre extracción a aplicación separada.

## Criterios de aceptación finales

- Un visitante anónimo no puede abrir el Marketing Studio ni consultar sus campañas.
- Un usuario autenticado sin rol no puede leer ni modificar datos internos.
- Un editor puede hacer solo las operaciones acordadas.
- Solo un administrador puede borrar campañas o gestionar permisos.
- La API rechaza operaciones no autorizadas aunque se llamen manualmente.
- Ningún secreto privado aparece en el bundle, HTML, repositorio o logs.
- El login, logout, recuperación y refresco de sesión funcionan en producción.
- El registro de rutas genera de forma consistente React Router, prerender, sitemap, canonicals y `hreflang`.
- `App.tsx` contiene solo composición y no contenido de negocio.
- El catálogo de productos es la fuente única para precios, coberturas, proveedores y URLs.
- Los componentes usan tokens semánticos y pasan las comprobaciones de accesibilidad básicas.
- No se cargan tags no necesarios antes del consentimiento.
- El build, typecheck, lint y pruebas pasan en CI antes del deploy.

## Riesgos y decisiones pendientes

- Decidir si el panel debe estar bajo el mismo dominio o un subdominio privado.
- Confirmar si existe un único equipo/marca o si el modelo debe ser multi-tenant.
- Determinar si la web pública necesita leer perfiles sociales desde Supabase o puede usar contenido publicado estático.
- Elegir magic link frente a contraseña y definir si se requiere MFA.
- Confirmar qué proveedores OAuth se integrarán realmente antes de implementar cada Edge Function.
