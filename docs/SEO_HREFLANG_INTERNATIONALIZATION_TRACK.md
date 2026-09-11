# SEO Track: Internacionalización hreflang — vitablue.es
**Fecha inicio:** 2026-09-11  
**Rama de trabajo:** `fix/robust-meta-descriptions-injection`  
**Estado:** 🔴 Pendiente de implementación técnica

---

## 🎯 Objetivo

Implementar el sistema `hreflang` completo en **todas las páginas del sitio** (~56 URLs) para que Google sirva el contenido correcto según el idioma y origen del usuario:

- `hreflang="es-ES"` → usuarios hispanohablantes en España
- `hreflang="es-419"` → usuarios hispanohablantes en Latinoamérica (ARG, COL, MEX, ECU, VEN, CHL, PER, BOL…)
- `hreflang="en"` → usuarios anglófonos (GBR, USA, IND, PHL, PAK, AUS, ZAF, NGA…)
- `hreflang="x-default"` → fallback para cualquier otro idioma/país → apunta a `/en/`

---

## 📊 Datos GSC que fundamentan la decisión
**Período analizado:** 11 Jun → 9 Sep 2026 (90 días)

### Distribución actual de tráfico por región

| Región | Impressiones | Clics | CTR | Posición media |
|---|---|---|---|---|
| 🇪🇸 España (ESP) | 21,705 | 32 | 0.15% | 42.2 |
| 🇬🇧 UK (GBR) | 786 | 4 | 0.51% | 37.1 |
| 🇺🇸 USA | 598 | 0 | 0.00% | — |
| 🇦🇷 Argentina | 522 | 2 | 0.38% | 42.6 |
| 🇨🇴 Colombia | 271 | 2 | 0.74% | 30.0 |
| 🇨🇱 Chile | 269 | 1 | 0.37% | 40.7 |
| 🇵🇪 Perú | 152 | 1 | 0.66% | 27.0 |
| 🇧🇷 Brasil | 87 | 3 | 3.45% | 13.1 |
| 🇵🇰 Pakistan | 84 | 6 | 7.14% | 15.9 |

### Cluster "estudiantes" por país LATAM

| País | Impr | Clics |
|---|---|---|
| 🇦🇷 ARG | 365 | 0 |
| 🇪🇨 ECU | 246 | 0 |
| 🇨🇱 CHL | 170 | 0 |
| 🇨🇴 COL | 94 | 0 |
| 🇻🇪 VEN | 88 | 0 |
| 🇲🇽 MEX | 57 | 0 |
| 🇵🇪 PER | 52 | 0 |

### Páginas /en/ con mayor tráfico anglófono

| Página | Impr | Países |
|---|---|---|
| `/en/blog/student-visa-spain-health-insurance-requirements/` | 388 | PAK,AUS,GBR,IND,MYS,PHL,SGP,USA,ZAF |
| `/en/health-insurance-expatriates-spain/` | 248 | GBR,IND,PHL,USA,ZAF |
| `/en/health-insurance-student-visa-spain/` | 120 | CAN,GBR,PAK,PHL,USA |
| `/en/digital-nomad-insurance-spain/` | 68 | CAN,GBR,GHA,IND,PAK,PHL,USA,ZAF |

### Señal de confusión detectada — páginas ES sirviendo a anglófonos

| Página ES (debería ser EN) | Impr desde anglófonos | Países |
|---|---|---|
| `/productos/seguro-medico-estudiantes-extranjeros-espana.html` | 104 | CAN,GBR,IND,PHL,USA |
| `/blog/requisitos-seguro-medico-visado-estudiante-espana/` | 33 | GBR,USA |

### Top queries anglófonas sin hreflang que las dirija

| Query | Impr | Países |
|---|---|---|
| "e-residency health insurance" | 45 | CAN,GBR,GHA,IND,PAK,PHL,USA,ZAF |
| "expat insurance in spain" | 30 | GBR,USA,ZAF |
| "expat insurance spain" | 28 | GBR,USA |
| "dnv spain insurance 2026" | 21 | GBR,USA |

---

## 🗺️ Mapa completo ES ↔ EN (Caso 1 — 22 pares bilingües)

Reciben: `es-ES` + `es-419` + `en` + `x-default`

| URL ES | URL EN |
|---|---|
| `https://www.vitablue.es/` | `https://www.vitablue.es/en/` |
| `https://www.vitablue.es/contacto/` | `https://www.vitablue.es/en/contact/` |
| `https://www.vitablue.es/sobre-nosotros/` | `https://www.vitablue.es/en/about-us/` |
| `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/` | `https://www.vitablue.es/en/health-insurance-student-visa-spain/` |
| `https://www.vitablue.es/productos/seguros-salud/seguro-expatriados/` | `https://www.vitablue.es/en/health-insurance-expatriates-spain/` |
| `https://www.vitablue.es/productos/seguros-salud/seguro-nomadas-digitales/` | `https://www.vitablue.es/en/digital-nomad-insurance-spain/` |
| `https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-completa/` | `https://www.vitablue.es/en/health-insurance/asisa-completa/` |
| `https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-esencial/` | `https://www.vitablue.es/en/health-insurance/asisa-esencial/` |
| `https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-residents/` | `https://www.vitablue.es/en/health-insurance/asisa-health-residents/` |
| `https://www.vitablue.es/productos/seguros-salud/seguros-asisa/asisa-health-students/` | `https://www.vitablue.es/en/health-insurance/asisa-health-students/` |
| `https://www.vitablue.es/blog/requisitos-seguro-medico-visado-estudiante-espana/` | `https://www.vitablue.es/en/blog/student-visa-spain-health-insurance-requirements/` |
| `https://www.vitablue.es/blog/precios-seguro-medico-visado-estudiante-espana/` | `https://www.vitablue.es/en/blog/student-visa-spain-health-insurance-prices/` |
| `https://www.vitablue.es/blog/seguro-medico-residencia-no-lucrativa-espana/` | `https://www.vitablue.es/en/blog/health-insurance-spain-non-lucrative-visa-requirements/` |
| `https://www.vitablue.es/blog/seguro-salud-nomadas-digitales-espana-requisitos/` | `https://www.vitablue.es/en/blog/digital-nomad-health-insurance-spain-requirements/` |
| `https://www.vitablue.es/blog/sanitas-vs-adeslas-vs-asisa-vs-dkv-comparativa-seguros-salud/` | `https://www.vitablue.es/en/blog/sanitas-vs-adeslas-vs-asisa-vs-dkv-health-insurance-spain/` |
| `https://www.vitablue.es/blog/periodos-de-carencia-seguro-medico/` | `https://www.vitablue.es/en/blog/waiting-periods-health-insurance-spain-guide/` |
| `https://www.vitablue.es/blog/que-es-el-copago-seguro-salud/` | `https://www.vitablue.es/en/blog/what-is-copay-health-insurance-spain-guide/` |
| `https://www.vitablue.es/blog/periodos-de-carencia-embarazo-parto-seguro-medico/` | `https://www.vitablue.es/en/blog/pregnancy-maternity-waiting-periods-health-insurance-spain/` |
| `https://www.vitablue.es/blog/rechazo-visado-espana-devolucion-seguro-medico/` | `https://www.vitablue.es/en/blog/spain-visa-rejection-health-insurance-refund-guarantee/` |
| `https://www.vitablue.es/blog/asisa-sanitas-adeslas-comparativa-visado-estudiante-espana/` | `https://www.vitablue.es/en/blog/asisa-student-insurance-spain-visa-validity/` |
| `https://www.vitablue.es/blog/certificado-seguro-medico-visado-estudiante-consulado/` | `https://www.vitablue.es/en/blog/consular-health-insurance-certificate-spain-visa/` |
| `https://www.vitablue.es/blog/seguro-salud-mayores-65-anos-espana-precios/` | `https://www.vitablue.es/en/blog/health-insurance-spain-seniors-over-65-prices/` |

---

## 🗺️ Solo ES con es-419 (Caso 2 — 20 URLs)

Reciben: `es-ES` + `es-419` + `x-default` → `https://www.vitablue.es/en/`

- `https://www.vitablue.es/productos/seguros-salud/seguro-salud-extranjeros/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/argentina/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/colombia/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/mexico/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/ecuador/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/peru/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/chile/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/madrid/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/barcelona/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/valencia/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/malaga/`
- `https://www.vitablue.es/productos/seguros-salud/seguro-medico-estudiantes/estados-unidos/`
- `https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/international-students/`
- `https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud/`
- `https://www.vitablue.es/productos/seguros-salud/seguros-asisa/`
- `https://www.vitablue.es/productos/seguros-salud/seguros-sanitas/`
- `https://www.vitablue.es/productos/seguros-salud/`
- `https://www.vitablue.es/validador-visado/`
- `https://www.vitablue.es/blog/preexistencias-medicas-seguro-salud/`
- `https://www.vitablue.es/blog/seguro-de-salud-pareja-de-hecho-nie/`

---

## 🗺️ Solo España (Caso 3 — 4 URLs)

Reciben: `es-ES` + `x-default` → `https://www.vitablue.es/en/`

- `https://www.vitablue.es/productos/seguro-mascotas/sanitas-mascotas/`
- `https://www.vitablue.es/productos/seguro-vida/`
- `https://www.vitablue.es/productos/seguro-viaje/`
- `https://www.vitablue.es/productos/seguro-para-decesos/asistencia-familiar/`

---

## 🔧 Plan de implementación técnica

### Archivo a modificar
`post_build_cleanup.cjs` — misma función que inyecta metas, schemas y canonicals.

### Función helper

```javascript
function injectHreflangTags(html, alternates) {
  // Eliminar hreflang existentes para evitar duplicados
  html = html.replace(/<link[^>]+rel="alternate"[^>]+hreflang[^>]+>\s*/gi, '');
  const tags = alternates
    .map(({ hreflang, href }) => `  <link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join('\n');
  return html.replace('</head>', `${tags}\n</head>`);
}
```

### Lógica por caso

```javascript
function buildAlternates(entry) {
  const alternates = [];
  alternates.push({ hreflang: 'es-ES', href: entry.es });
  if (entry.latam) alternates.push({ hreflang: 'es-419', href: entry.es });
  if (entry.en) alternates.push({ hreflang: 'en', href: entry.en });
  const xDefault = entry.en || 'https://www.vitablue.es/en/';
  alternates.push({ hreflang: 'x-default', href: xDefault });
  return alternates;
}
```

### Integración en main()
Nueva llamada `await injectHreflangAllPages()` después de `injectCorporateSchemas()`.

---

## ✅ Checklist de implementación

- [ ] Crear función `injectHreflangTags(html, alternates)`
- [ ] Crear constante `HREFLANG_MAP` con los 56 URLs mapeados (3 casos)
- [ ] Crear función `buildAlternates(entry)` para construir tags por caso
- [ ] Crear función `injectHreflangAllPages()` que itera el mapa
- [ ] Inyectar también en páginas `/en/` sus alternates bidireccionales
- [ ] Fix meta descriptions robustas (pendiente sesión anterior)
- [ ] Añadir `validate-static-seo` a `deploy.yml` (pendiente sesión anterior)
- [ ] Run `npm run build` local y verificar hreflang en 5 páginas muestra
- [ ] Commit y PR a `develop`

---

## 📋 Tareas pendientes de sesiones anteriores (mismo PR)

### Fix meta descriptions
- **Problema:** regex frágil en líneas 1374-1380 de `post_build_cleanup.cjs` falla silenciosamente cuando Puppeteer elimina `<meta name="description">`
- **Fix:** función `setMetaTag(html, name, isProperty, value)` con fallback de inyección antes de `</head>`
- **Estado:** ❌ Sin implementar

### validate-static-seo en deploy.yml
- **Problema:** CI valida SEO pero `deploy.yml` no — permite desplegar con metas rotas
- **Fix:** Añadir step `node scripts/validate_static_seo.cjs` en `.github/workflows/deploy.yml` post-build
- **Estado:** ❌ Sin implementar

---

## 🔗 Referencias

- Datos GSC: extraídos el 2026-09-11 via `scripts/gsc_audit.cjs` + scripts ad-hoc
- Período: 2026-06-11 → 2026-09-09 (90 días)
- Documentación Google hreflang: https://developers.google.com/search/docs/specialty/international/localization-with-hreflang
- Código IANA para LATAM: `es-419` (Latin America and Caribbean)
