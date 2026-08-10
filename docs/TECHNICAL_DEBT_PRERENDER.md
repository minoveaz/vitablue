# Deuda tecnica: migracion del prerender

## Estado

Pendiente. VitaBlue mantiene `vite-plugin-prerender@1.0.8` porque el build SSG
actual genera correctamente las rutas publicas y supera los checks de CI.

## Motivo

El plugin no tiene una version nueva disponible y arrastra dependencias antiguas
del pipeline de build, incluyendo `puppeteer@1.20.0` y
`html-minifier@3.5.21`. La auditoria de npm mantiene vulnerabilidades altas
transitivas asociadas a esta cadena.

## Alcance de la futura migracion

- Evaluar `vite-react-ssg` u otra alternativa mantenida para React + Vite.
- Mantener las 54 rutas prerenderizadas actuales.
- Conservar React Router, hidratacion y navegacion cliente.
- Conservar titulos, descriptions, canonicals, Open Graph y sitemap.
- Mantener la conversion post-build de rutas `index.html` cuando sea necesaria.

## Criterios de aceptacion

- Home, una pagina de producto y un articulo de blog generan HTML prerenderizado.
- Las 54 rutas actuales se generan sin errores.
- `npm run build` y `npm run generate-sitemap:check` pasan.
- Los tests responsive, navegacion movil y SEO pasan completos.
- La auditoria de npm elimina las vulnerabilidades asociadas al prerender o deja
  documentado cualquier riesgo residual.
- La migracion se valida en CI y en un deploy de prueba antes de tocar produccion.

## Restriccion operativa

No sustituir el plugin directamente en `main`. La migracion debe hacerse en un
commit o rama aislada y compararse contra el HTML generado actualmente.