# Track: Branding & Basic UX Components — Specification & Plan

> **Project:** VitaBlue v2
> **Track ID:** `2026-07-27-branding-and-ux-components`
> **Goal:** Align the visual system with Color Option 3 (Ocean/Cyan/Midnight/Gold) and Poppins+Inter typography, define the exact list of foundational UX components, and outline the phased implementation plan.

---

## 1. Visual Specification (Color Option 3 & Typography)

### A — Color Palette (Tailwind Tokens)
To distance the brand from Sanitas's medical sky-blue (`#00B2E3`) and project an independent, modern, fintech-style insurance broker:

*   **`vb-ocean` (`#005F73`)** $\rightarrow$ `primary`: Deep ocean/teal, conveying premium health and security. Used for active navigation links, headings, primary card highlights, and borders.
*   **`vb-midnight` (`#001219`)** $\rightarrow$ `primary-dark` / `text-main`: Rich, dark midnight blue. Used for main text headings, dark section backgrounds, footers, and cards hover state overlays.
*   **`vb-mint` (`#94D2BD`)** $\rightarrow$ `brand-cyan`: Fresh mint green. Used for subtle background overlays, badges, success flags, and secondary decorative details.
*   **`vb-gold` (`#EE9B00`)** $\rightarrow$ `accent`: Golden amber/yellow. Used exclusively for primary calls to action (CTAs), conversion buttons, highlighted pricing, and important micro-interactions.
*   **`vb-white` (`#ffffff`)** $\rightarrow$ Base background and card fills.
*   **`vb-bg-light` (`#f8fafc`)** $\rightarrow$ Page backgrounds and layout wrappers.

### B — Typography
*   **Display Font (Headings):** **Poppins** (Google Fonts). Set for `h1`, `h2`, `h3`, and big display badges. Promotes a geometric, warm, and highly professional layout.
*   **Body Font (Content):** **Inter** (Google Fonts). Set for body paragraphs, labels, forms, dropdown options, and comparison charts. Optimized for maximum readability on mobile screens.

---

## 2. Information Architecture: UX Components Catalogue

Based on the requirements of a high-converting landing page and comparison tool (modeled from the foundations of `protegetusalud`), we define the list of core UX components to develop:

### 2.1 Foundational UI Atoms (`components/ui/`)
1.  **`Logo` (SVG Graphic):**
    *   **Goal:** A brand new, white-label vector logo combining an organic shield of protection and a checklist checkmark, colored with the `vb-ocean` to `vb-mint` gradient. Includes the text `"VitaBlue"` in Poppins bold.
2.  **`Button` (Action Control):**
    *   **Goal:** Multi-purpose button with flexible sizes (`sm`, `md`, `lg`) and semantic variants:
        *   `primary` (fills: `vb-blue` or `vb-ocean`).
        *   `accent` (fills: `vb-gold` with dark text, for primary conversions).
        *   `outline` (border: `vb-ocean`, hover: subtle background).
        *   `ghost` (borderless, for minor actions).
    *   **Features:** Loading state spinner, slot for Lucide Icons (left/right).
3.  **`InputText` (Form Input):**
    *   **Goal:** Text input field with a floating or aligned label, error text slot, and custom border highlights when focused (`focus:border-vb-ocean focus:ring-2 focus:ring-vb-ocean/25`).
4.  **`InputSelect` (Dropdown Selector):**
    *   **Goal:** Accessible native dropdown or styled options selector styled with the new color system, crucial for selecting nationalities, age ranges, and visa criteria in the form.
5.  **`Checkbox` (Selection Control):**
    *   **Goal:** Styled checkmark box for legal compliance and cookies consent checkboxes, including accessible keyboard states.
6.  **`Badge` (Pill Tag):**
    *   **Goal:** Small colored badges to display tags (e.g. *"Visa Ready"*, *"Más Popular"*, *"Sin Copago"*). Variants: `primary` (ocean), `accent` (gold), `success` (mint).

### 2.2 UI Molecules (`components/ui/` / `components/`)
7.  **`FormField` (Composition):**
    *   **Goal:** Wraps `InputText` or `InputSelect` with a label, description, validation rules, and error messages.
8.  **`Card` (Bento Component):**
    *   **Goal:** Container cards featuring a subtle border (`border-slate-200/80`), rounded corners (`rounded-2xl` or `rounded-3xl`), and soft shadows, supporting hover scaling states.
9.  **`Accordion` (Foldable Component):**
    *   **Goal:** FAQ accordion cards showing details when clicked, featuring smooth height transitions (via CSS or Framer Motion) and robust keyboard/ARIA attributes.

### 2.3 Global Organisms & Layout (`components/`)
10. **`Navbar` (Navigation Bar):**
    *   **Goal:** Responsive header featuring the new `Logo`, quick anchors linking to page sections (Productos, Sobre Nosotros, Contacto), and a prominent `vb-gold` WhatsApp button. Includes mobile toggle button.
11. **`Footer` (Footer Layout):**
    *   **Goal:** Multi-column layout containing legal links, copyright information, independent broker disclaimers, and social icons. Colored in dark `vb-midnight`.
12. **`CookieBanner` (Consent Management):**
    *   **Goal:** Bottom banner asking users to accept/reject cookies tracking, saving selections to `localStorage`.

### 2.4 Advanced Components (Inspired by `labdev` & `Marketing-Studio-` Libraries)
To elevate the user experience of the multi-step quoter (Wizard) and landing pages, we will adapt the following structures from the [labdev](file:///Users/minoveaz/Documents/Proyectos/labdev) and [Marketing-Studio-](file:///Users/minoveaz/Documents/Proyectos/Marketing-Studio-) codebases:
13. **`Autocomplete` (Functional Input - labdev):**
    *   **Goal:** Real-time search/input selector with keyboard navigation (Arrows/Enter/Esc) and text highlight match matching. Ideal for searching and filtering cities of study or nationalities inside the forms.
14. **`Stepper` (Functional Navigation - labdev):**
    *   **Goal:** Multi-step horizontal status indicator showing the progress of the quoter wizard (e.g. *"Datos"* $\rightarrow$ *"Seguro"* $\rightarrow$ *"WhatsApp"*).
15. **`Drawer` (Functional Surface - labdev):**
    *   **Goal:** Mobile-friendly side-sliding panel used to show detailed insurance coverage sheets or terms and conditions without taking the user away from their current page.
16. **`InfiniteMarquee` (Visual Slider - Marketing-Studio):**
    *   **Goal:** Continuous, smooth horizontal scrolling marquee displaying partner brand logos (Sanitas, Adeslas, DKV, etc.) to establish immediate broker trust.
17. **`ReviewWall` (Social Proof - Marketing-Studio):**
    *   **Goal:** Dual vertical columns of reviews scrolling in opposite directions to form a rich testimonials wall.
18. **`ReimbursementCalculator` (Pricing Tool - Marketing-Studio):**
    *   **Goal:** Interactive calculator where users input invoice amounts to see how much their refund-based policy covers.
19. **`QuotationWizard` (Form Flow - Marketing-Studio):**
    *   **Goal:** Complete multi-step quote form router with progress bar tracking, step state checks, back/forward history, and checkout/summary layouts.

---

## 3. Implementation Plan

### Phase 1: Setup & CSS Tokens Injection
*   [x] Inject Option 3 colors and typography mappings into `vitablue-v2/tailwind.config.js` (Done).
*   [x] Verify the Google Fonts stylesheet link in `vitablue-v2/index.html` loads Poppins (400-800) and Inter (300-700) (Done).
*   [x] Set up global style baseline inside `vitablue-v2/index.css` incorporating the core `@layer base` defaults.

### Phase 2: Coding Foundational UX Components (Atoms)
*   [x] **Logo component:** Write `components/atoms/Logo.tsx` rendering the new SVG logo.
*   [x] **Button component:** Write `components/atoms/Button.tsx` with tailwind semantic variants.
*   [x] **Input & Form Atoms:** Write `components/atoms/InputText.tsx`, `components/atoms/InputSelect.tsx`, `components/atoms/Checkbox.tsx`.
*   [x] **Badge component:** Write `components/atoms/Badge.tsx`.

### Phase 3: Coding Layout & Structural Components (Molecules & Organisms)
*   [x] **Card, Accordion & FormField:** Write `components/molecules/Card.tsx`, `Accordion.tsx` and `FormField.tsx`.
*   [x] **Navbar & Footer:** Write `components/organisms/Navbar.tsx` and `Footer.tsx` integrating the new colors.
*   [x] **CookieBanner:** Write `components/organisms/CookieBanner.tsx` for RGPD compliance.
*   [x] **Breadcrumbs, ProductPromoCard, TestimonialCard & FloatingWhatsApp:** Write marketing, conversion and navigation components.

### Phase 4: UI Showcase & Validation View
*   [x] Create a playground page at `/styleguide` inside `App.tsx` displaying all components styled with Option 3 side-by-side to visually audit their accessibility and padding before mounting the final views.

### Phase 5: Advanced Functional UI Components (Source: `labdev` & `Marketing-Studio-`)
*   [x] **Autocomplete component:** Adapt `labdev/components/functional/Autocomplete` into `components/molecules/Autocomplete.tsx` for smart inputs. (Done)
*   [x] **Stepper component:** Adapt `labdev/components/functional/Stepper` into `components/molecules/Stepper.tsx`. (Done)
*   [x] **Drawer component:** Adapt `labdev/components/functional/Drawer` into `components/molecules/Drawer.tsx`. (Done)
*   [x] **InfiniteMarquee component:** Adapt `Marketing-Studio-/components/snippets/sliders/InfiniteMarqueeSnippet` into `components/molecules/InfiniteMarquee.tsx`. (Done)
*   [x] **ReviewWall component:** Adapt `Marketing-Studio-/components/snippets/sliders/ReviewWallSnippet` into `components/molecules/ReviewWall.tsx`. (Done)
*   [x] **ReimbursementCalculator component:** Adapt `Marketing-Studio-/components/snippets/fintech/ReimbursementCalculator` into `components/molecules/ReimbursementCalculator.tsx`. (Done)
*   [x] **QuotationWizard structure:** Adapt `Marketing-Studio-/components/snippets/forms/QuotationWizard` as the base of our multi-step cotizador. (Done)
