# Track: Core Business Logic and SEO Page Assembly

## 🎯 1. Objective
Migrate the core business logic (recommendation engine, WhatsApp redirection flow, global quoter context state) from `protegetusalud` into `vitablue-v2`. Assemble all operational landing, product, and wizard views using the redesigned visual system (Option 3) while **preserving 100% of the legacy SEO URLs** and incorporating the **radical transparency and neutral copywriting style** of `protegetusalud` to maximize conversion and compliance.

---

## 🔗 2. Legacy SEO URLs to Preserve
The following routes must be served, pre-rendered as static HTML, and styled with the new v2 design system:

| Route Path | Component View | Description |
|------------|----------------|-------------|
| `/` | `Home.tsx` | Main comparator landing page. |
| `/productos/seguro-medico-estudiantes-extranjeros-espana.html` | `StudentInsurance.tsx` | Visado-compliant student health insurance page (Spanish). |
| `/productos/international-students.html` | `StudentInsurance.tsx` (Alias) | Visado-compliant student health insurance page (English/Legacy link). |
| `/productos/sanitas-mas-salud.html` | `SanitasMasSalud.tsx` | Complete health insurance with no copays. |
| `/productos/sanitas-mascotas.html` | `SanitasMascotas.tsx` | Pet health insurance (dogs and cats). |
| `/productos/asistencia-familiar-iplus.html` | `AsistenciaFamiliar.tsx` | Family assistance and decesos insurance. |
| `/wizard` (and `/cotizador.html`) | `Wizard.tsx` | Interactive multi-step quoter form. |
| `/resultados` | `Results.tsx` | Comparative multi-brand pricing results sheet. |
| `/privacidad.html` | `Privacy.tsx` | Legal privacy policy. |
| `/politica-cookies.html` | `CookiesPolicy.tsx` | Legal cookies policy. |

---

## ✍️ 3. Copywriting & Tone of Voice Guidelines (Transparency Model)
Every view must strictly implement the communication style defined in `protegetusalud`:

1.  **Neutral Broker Positioning**: Clearly declare *"No somos una aseguradora"* (We are not an insurance company) and state that we compare independently to find the best policy without bias.
2.  **Radical Transparency (Inclusions vs Exclusions)**: Integrate the `TransparencyBlock` component on product pages, displaying what is covered and what is NOT covered with equal visual weight, avoiding hidden clauses.
3.  **The Three Pillars of Trust**: Highlight the badges *"Asesoría Neutral"* (Neutral Advisory), *"Sin Compromiso/100% Gratis"* (Free service funded by insurer commissions), and *"Soporte Humano"* (Real advisors on WhatsApp).
4.  **Consulate & Visa Compliance Translation**: Translate complex health insurance terminology into actionable legal utility (e.g. *"Válido para visado consular de estudios/residencia, sin copagos ni carencias, con repatriación"*).

---

## 🏗️ 4. Implementation Plan

### Phase 1: Hydrating Core Logic & Global State
*   [x] **WizardContext**: Copy `context/WizardContext.tsx` from `protegetusalud` to `vitablue-v2/context/WizardContext.tsx` and adapt it to manage global state.
*   [x] **Recommendation Engine**: Copy `utils/recommendationEngine.ts` to `vitablue-v2/utils/recommendationEngine.ts` to calculate real insurance premium rates based on age, visa, and insurance type.
*   [x] **WhatsApp Redirect Logic**: Copy and adapt `pages/Redirect.tsx` or create a helper utility `utils/whatsappRedirect.ts` to format quote details into WhatsApp links directed to advisors.

### Phase 2: Importing Trust & Conversion UI Cards
*   [x] **Advisor Cards**: Create `components/molecules/AdvisorCard.tsx` and `components/molecules/HeroAdvisor.tsx` based on `protegetusalud` to present expert human advisors.
*   [x] **Transparency Block**: Create `components/molecules/TransparencyBlock.tsx` explaining regulatory broker details (DGSFP compliance, free service, independence).
    *   *Editorial Rule*: Ensure inclusions and exclusions are rendered with equal visual hierarchy and the explicit disclaimer explaining why exclusions are shown.

### Phase 3: Building the Quoter Funnel (Wizard & Results)
*   [x] **Wizard Page (`pages/Wizard.tsx`)**: Build the quoter container hosting the `QuotationWizard` organism and hook it to `WizardContext`.
    *   *Editorial Rule*: Add neutrality banner under the quoter widget (*"Servicio gratuito regulado por la DGSFP"*).
*   [x] **Results Page (`pages/Results.tsx`)**: Build the comparative grid showing cards for eligible insurance products (Sanitas, Adeslas, DKV, Asisa), displaying real prices calculated by `recommendationEngine`, and incorporating direct PDF downloads and WhatsApp advisors CTA.

### Phase 4: Product Pages Assembly & Legacy Routing
*   [x] **Home Landing (`pages/Home.tsx`)**: Assemble the main entry point with the `ConversationalHero`, `InfiniteMarquee`, product cards grid, FAQs, and trust disclaimers.
    *   *Editorial Rule*: Include the three trust badges ("Asesoría Neutral", "Sin Compromiso", "Soporte Humano") and the "No somos una aseguradora" section.
*   [x] **Student Insurance Landing (`pages/StudentInsurance.tsx`)**: Assemble the expat student visa page.
    *   *Editorial Rule*: Integrate a specialized `TransparencyBlock` detailing consular requirements (SÍ incluye: Repatriación ilimitada, Sin copagos, Sin carencias; NO incluye: Tratamientos preexistentes no declarados, Estética).
*   [x] **Sanitas Más Salud Landing (`pages/SanitasMasSalud.tsx`)**: Assemble the complete no-copay insurance product page.
    *   *Editorial Rule*: Detail copay categories honestly (no-copay vs copay options).
*   [x] **Sanitas Mascotas Landing (`pages/SanitasMascotas.tsx`)**: Assemble the pet insurance landing page.
    *   *Editorial Rule*: Display coverage limitations (exclusions on pre-existing veterinary illnesses).
*   [x] **Asistencia Familiar Landing (`pages/AsistenciaFamiliar.tsx`)**: Assemble the family decesos product page.
*   [x] **Legal pages**: Create `pages/Privacy.tsx` and `pages/CookiesPolicy.tsx` incorporating legacy legal disclaimers.
*   [x] **App Routing (`App.tsx`)**: Map all legacy product URLs and aliases inside `react-router-dom` `<Routes>`.

### Phase 5: Prerendering Config & SEO Audit
*   [x] **Vite Config update**: Edit `vitablue-v2/vite.config.ts` to include all legacy routes (like `international-students.html`, `privacidad.html`, etc.) in the `vite-plugin-prerender` static renderer list.
*   [x] **Metadata & Titles**: Inject custom title tags, descriptions, and Open Graph attributes for each product page inside `App.tsx` or using page headers to preserve search engine positions.
*   [x] **Sitemap Update**: Ensure sitemap generator processes the correct canonical routes.
*   [x] **Production Build Audit**: Validate using `npm run build` and check that all routes successfully output `.html` files in `/dist`.
