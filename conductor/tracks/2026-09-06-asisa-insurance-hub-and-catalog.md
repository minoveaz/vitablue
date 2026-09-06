# Track: Hub Oficial de Seguros Asisa & Catálogo de Pólizas (2026)

> **Contexto & Objetivo**: Crear el Hub Oficial de Seguros Asisa en VitaBlue (`/productos/seguros-salud/seguros-asisa/`), garantizando 100% de paridad y simetría estructural con el Hub de Sanitas (`/productos/seguros-salud/seguros-sanitas/`). Basado en la documentación contractual técnica oficial analizada en `SEO & SEM/Docs asisa` (9 pólizas oficiales con notas informativas previas IPID).

---

## 📌 Metas del Track

1. **Posicionamiento Orgánico de Marca (Asisa)**: Captar búsquedas de alta intención de compra ("seguros asisa", "asisa estudiantes visado", "asisa completa copagos", "asisa cuadro medico").
2. **Paridad de Ecosistema**: Equiparar la oferta multimarca de VitaBlue ofreciendo a los usuarios la comparativa directa entre Sanitas y Asisa con idéntico estándar de calidad visual y conversion rate optimization (CRO).
3. **Conversión Especializada en Visados & NIE**: Posicionar **ASISA Health Students** y **ASISA Health Residents** como las alternativas oficiales más económicas del mercado español (desde 35€/mes frente a los 45€ de otros competidores) con garantía consular total.
4. **Navegación e Interlinking Integral**: Conectar el Hub de Asisa en el menú global de navegación (`Navbar`), pie de página (`Footer`), landing general de salud (`HealthInsurance`) y sitemap estático SSG.

---

## 📋 Inventario de Productos Asisa (Docs Oficiales)

| Código Doc | Producto Oficial | Categoría | Propuesta de Valor & Coberturas Clave |
|---|---|---|---|
| `AFR01S0125.pdf` | **ASISA Health Students** | Visados & Extranjería | Sin copagos, sin carencias, repatriación sanitaria ilimitada, certificado consular en 24h. |
| `AFR01S0128.pdf` | **ASISA Health Residents** | Visados & Extranjería | Póliza para no comunitarios, residencia no lucrativa, nómadas digitales y reagrupación familiar. |
| `AFR01S0015.pdf` | **ASISA Completa +** | Asistencia Completa | Cobertura médica y quirúrgica integral con copago reducido en red Grupo HLA y concertada. |
| `AFR01S0080.pdf` | **ASISA Completa ++** | Asistencia Completa | Asistencia médica completa con copago medio (prima mensual más reducida para familias). |
| `AFR01S0052.pdf` | **ASISA Completa Mutualistas** | Colectivos Públicos | Modalidad complementaria con hospitalización para funcionarios de MUFACE, ISFAS y MUGEJU. |
| `AFR01S0071.pdf` | **ASISA Esencial** | Extra-hospitalario | Especialistas, analíticas y radiología sin hospitalización (acceso directo sin listas de espera). |
| `AFR01S0074.pdf` | **ASISA Esencial +** | Extra-hospitalario | Cobertura ambulatoria con copago ajustado por acto médico. |
| `AFR01S0088.pdf` | **ASISA Esencial Mutualistas**| Colectivos Públicos | Modalidad ambulatoria para mutualistas que requieren cuadro privado de especialistas. |
| `AFR01S0035.pdf` | **ASISA Ya** | Acceso Ágil | Seguro ágil para visitas médicas y chequeos preventivos inmediatos. |

---

## 🗺️ Fases de Ejecución

### Fase 1: Capa de Dominio y Datos del Catálogo (`domain/products/asisaCatalog.ts`)
- [ ] Modelar interfaces tipadas `AsisaCatalogCard`.
- [ ] Configurar `asisaFeaturedProducts` (Health Students, Health Residents, Completa +, Completa ++).
- [ ] Configurar `asisaConsultProducts` (Esencial, Esencial +, Asisa Ya, Mutualistas) con enlaces estructurados a WhatsApp y mensaje personalizado.
- [ ] Tests unitarios de catálogo en `domain/products/asisaCatalog.test.ts`.

### Fase 2: Componente de Autoridad y Respaldo Institucional (`AsisaTrustSection.tsx`)
- [ ] Crear `components/organisms/AsisaTrustSection.tsx` con:
  - Logotipo oficial de Asisa.
  - Estadísticas de autoridad: **40.000+** profesionales, **18 hospitales propios** (Grupo HLA), **36 centros médicos multiespecialidad**, **45+ años de experiencia**.
  - Destacados de valor: *Red Hospitalaria HLA*, *Telemedicina AsisaLIVE 24/7*, *Cooperativa Médica Lavinia (propiedad de médicos)*.

### Fase 3: Ensamblaje de la Vista Principal (`pages/public/AsisaInsurances.tsx`)
- [ ] Estructurar la página respetando los mismos bloques que `SanitasInsurances.tsx`:
  - [ ] **SEO & Schema.org**: `title`, `meta description`, `canonical` e inyección de JSON-LD (`Organization`, `BreadcrumbList`, `FAQPage`).
  - [ ] **ProductBreadcrumbBar**: `Inicio > Seguros de Salud > Seguros Asisa`.
  - [ ] **Hero Header**: Gradiente VitaBlue/Asisa, propuesta de valor, CTA cotizador `/wizard/` y CTA WhatsApp + micro-stats widget.
  - [ ] **ProductTrustBar**: 3 pilares de confianza (Asesoría autorizada, Alta rápida 24h, Soporte continuo VitaBlue).
  - [ ] **Sección 1 (Pólizas Destacadas)**: Grid con `InsuranceProductCard` de productos destacados.
  - [ ] **Sección 2 (Coberturas Especiales)**: Notice Box de WhatsApp + Bento Grid de pólizas ambulatorias y colectivos.
  - [ ] **ProductProcessSection**: Timeline de 4 pasos para contratación oficial y digital.
  - [ ] **AsisaTrustSection**: Bloque de garantía Grupo HLA.
  - [ ] **TestimonialGrid**: Opiniones reales de clientes de Asisa en VitaBlue.
  - [ ] **FaqSection**: Acordeón con dudas sobre copagos (+/++), carencias, red HLA y Extranjería.
  - [ ] **AdvisorHelpSection**: Bloque de cierre hacia WhatsApp y teléfono.

### Fase 4: Enrutamiento, Navegación y Ecosistema Global
- [x] Registrar ruta `/productos/seguros-salud/seguros-asisa` en `App.tsx` y `config/routes.ts`.
- [x] **Navbar**: Añadir enlace "Seguros Asisa" en la columna de Especialidades junto a Sanitas.
- [x] **Footer**: Añadir "Catálogo Seguros Asisa" en la columna de Seguros de Salud.
- [x] **Landing Seguros de Salud (`HealthInsurance.tsx`)**: Incorporar sección/banner gemelo de Seguros Asisa.
- [x] **Sitemap & SSG**: Sincronizar en `public/sitemap.xml` y en la lista de rutas pre-renderizadas de `vite.config.ts`.

### Fase 5: Páginas Detalladas de Producto Asisa (4 Pólizas Oficiales)
- [x] `AsisaHealthStudents.tsx`: Póliza médica para visados y estancias de estudios.
- [x] `AsisaHealthResidents.tsx`: Póliza sin copagos para residencia no lucrativa y nómadas digitales.
- [x] `AsisaCompleta.tsx`: Asistencia completa con hospitalización médica y quirúrgica.
- [x] `AsisaEsencial.tsx`: Póliza ambulatoria extrahospitalaria con especialistas y telemedicina.

### Fase 6: Versión en Inglés & Emparejamiento Hreflang Recíproco (#180)
- [x] Catálogo en inglés en `domain/products/asisaCatalog.ts` y tests unitarios.
- [x] Versión bilingüe en Hub `/en/health-insurance/asisa-insurance/`.
- [x] Versión bilingüe en `/en/health-insurance/asisa-health-students/`.
- [x] Versión bilingüe en `/en/health-insurance/asisa-health-residents/`.
- [x] Versión bilingüe en `/en/health-insurance/asisa-completa/`.
- [x] Versión bilingüe en `/en/health-insurance/asisa-esencial/`.
- [x] Emparejamiento hreflang recíproco (`es`, `en`, `x-default`) en cabeceras y `public/sitemap.xml`.
- [x] Inyección de rutas en `config/routes.ts` y `App.tsx`.
- [x] Pre-renderizado SSG completo con Puppeteer sin fallos.

### Fase 7: Verificación, Quality Gate y Despliegue
- [x] `npm run typecheck` (0 errores de TypeScript).
- [x] `npm test` (255 pruebas unitarias aprobadas).
- [x] `npm run validate` (auditorías de rutas y sitemap en verde).
- [x] `npm run build` (pre-renderizado SSG completo de todas las rutas con Puppeteer).
- [ ] Pull Request a `develop`, Quality Gate en verde y promoción a `main`.

---

## 📈 Métricas de Éxito
- Cobertura 100% de los 9 productos oficiales identificados en `Docs asisa`.
- Paridad estética y funcional total con el hub de Sanitas existente.
- Cobertura bilingüe integral (ES / EN) con 100% de enlaces de conversión contextuales a WhatsApp.
- Aumento de conversiones para perfiles de visado con presupuesto ajustado gracias a la tarifa de Asisa Students (desde 35€/mes).
- 100% SSG pre-renderizado e indexable por motores de búsqueda.
