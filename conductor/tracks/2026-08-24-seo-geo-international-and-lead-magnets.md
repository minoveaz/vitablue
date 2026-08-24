# Track: SEO Geo-Targeting, Páginas Consulares, Blog Internacional & Lead Magnets (2026)

> **Contexto & Objetivo**: Escalar la captación orgánica y conversión de VitaBlue mediante 4 pilares de alta intención:
> 1. **Páginas por Consulado y País** (Colombia, México, Perú, Argentina, Ecuador).
> 2. **Expansión Multilingüe del Blog en Inglés** (6 guías maestras traducidas).
> 3. **Lead Magnet Interactivo: Validador de Requisitos Consulares**.
> 4. **SEO Local por Ciudades Universitarias y Expat Hubs** (Madrid, Barcelona, Valencia, Málaga).

---

## 📌 Metas del Track

1. **Dominar las búsquedas por consulado específico** con contenido adaptado a los requisitos exactos de cada sede consular española en Latinoamérica y el mundo.
2. **Capturar el tráfico internacional angloparlante** (EE.UU., UK, Canadá, Europa del Norte) que busca seguros para visados y nómadas digitales en España.
3. **Generar leads cualificados con un Validador Consular Interactivo** que diagnostique en 30 segundos si la póliza del usuario cumple la normativa de Extranjería.
4. **Posicionar búsquedas locales geolocalizadas** con hospitales y cuadros médicos concertados (Asisa, Sanitas, Adeslas) en las principales capitales españolas.

---

## 🗺️ Fases de Ejecución

### Fase 1: Páginas por Consulado y País de Origen (Long-Tail Consular)
- [ ] **Estructura y Datos Consulares**:
  - Definir la base de datos de consulados y requisitos específicos en `utils/consulatesData.ts`.
  - Crear la plantilla dinámica / componente de página consular `pages/public/ConsulateVisaInsurance.tsx`.
- [ ] **Landings de Consulados Clave**:
  - [ ] *Consulado de España en Bogotá (Colombia)* (`/seguro-medico-visado-espana/colombia-bogota`).
  - [ ] *Consulado de España en Ciudad de México (México)* (`/seguro-medico-visado-espana/mexico-cdmx`).
  - [ ] *Consulado de España en Lima (Perú)* (`/seguro-medico-visado-espana/peru-lima`).
  - [ ] *Consulado de España en Buenos Aires (Argentina)* (`/seguro-medico-visado-espana/argentina-buenos-aires`).
  - [ ] *Consulado de España en Quito y Guayaquil (Ecuador)* (`/seguro-medico-visado-espana/ecuador-quito-guayaquil`).
- [ ] **Metadatos y Schemas**:
  - Inyección de JSON-LD `GovernmentService` / `FAQPage` y `BreadcrumbList`.

---

### Fase 2: Expansión del Topic Cluster en Inglés (`/en/blog/...`)
- [ ] **Traducción y Adaptación Cultural de las 6 Guías**:
  - [ ] *Digital Nomad Health Insurance Spain 2026: UGE & Telework Visa Requirements* (`/en/blog/digital-nomad-health-insurance-spain-requirements`).
  - [ ] *Student Visa Health Insurance Prices in Spain (2026 Official Guide)* (`/en/blog/student-visa-spain-health-insurance-prices`).
  - [ ] *How to Get the Official 24h Consular Health Insurance Certificate* (`/en/blog/consular-health-insurance-certificate-spain-visa`).
  - [ ] *Sanitas vs Adeslas vs Asisa vs DKV: Best Spanish Health Insurance Comparison 2026* (`/en/blog/sanitas-vs-adeslas-vs-asisa-vs-dkv-health-insurance-spain`).
  - [ ] *Health Insurance in Spain for Seniors & Expats Over 65 (Prices & Limits)* (`/en/blog/health-insurance-spain-seniors-over-65-prices`).
  - [ ] *Waiting Periods for Pregnancy & Maternity in Spanish Health Insurance* (`/en/blog/pregnancy-maternity-waiting-periods-health-insurance-spain`).
- [ ] **Sincronización `hreflang` bilingüe** cruzada entre versiones en español e inglés.

---

### Fase 3: Validador Interactivo de Requisitos Consulares (Lead Magnet)
- [ ] **Motor de Diagnóstico (`utils/consularValidator.ts`)**:
  - Validación paso a paso de los 4 pilares legales: Aseguradora autorizada DGSFP, Sin copagos, Sin carencias, Repatriación sanitaria.
- [ ] **Componente Interactivo (`components/molecules/ConsularRequirementsValidator.tsx`)**:
  - UI fluida mobile-first con selección de país/consulado y tipo de trámite.
  - Generación de diagnóstico en pantalla con semáforo (Verde: Cumple / Rojo: En riesgo de denegación).
  - CTA de contacto con asesor de WhatsApp con referencia automática `[Ref: VALIDADOR-PAIS]`.

---

### Fase 4: SEO Local por Ciudades de Destino (Hubs Universitarios & Expat)
- [ ] **Base de Datos de Red Hospitalaria Local (`utils/localHospitalNetworks.ts`)**:
  - Hospitales y clínicas concertadas de Asisa (HLA), Sanitas y Adeslas por ciudad.
- [ ] **Landings Locales Optimizadas**:
  - [ ] *Seguro Médico Estudiantes y Extranjeros en Madrid* (`/seguro-medico-estudiantes/madrid`).
  - [ ] *Seguro Médico Estudiantes y Extranjeros en Barcelona* (`/seguro-medico-estudiantes/barcelona`).
  - [ ] *Seguro Médico Estudiantes y Nómadas en Valencia* (`/seguro-medico-estudiantes/valencia`).
  - [ ] *Seguro Médico Estudiantes y Nómadas en Málaga* (`/seguro-medico-estudiantes/malaga`).

---

### Fase 5: Sincronización SSG, `llms.txt`, Sitemap & Playwright E2E
- [ ] Actualizar rutas en `vite.config.ts`, `public/sitemap.xml` y `public/llms.txt`.
- [ ] Ejecutar suites completas de Playwright (`test:e2e:seo`, `test:e2e:desktop`).
- [ ] Validar compilación SSG con Puppeteer (`npm run build`).

---

## 📈 Métricas de Éxito
- Posicionamiento orgánico en el Top 3 de Google para búsquedas consulares (`seguro visado espana bogota`, `seguro visado espana cdmx`).
- Captura de tráfico angloparlante con >3.000 visitas mensuales adicionales en `/en/blog/`.
- Incremento del 25% en la tasa de conversión web a lead de WhatsApp gracias al Validador Consular.
- Cobertura SEO en las 4 principales capitales de destino en España.
