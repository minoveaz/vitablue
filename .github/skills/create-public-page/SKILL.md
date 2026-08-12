---
name: create-public-page
description: "Use when creating or redesigning a public VitaBlue page, such as About Us, Contact, product, landing, or blog pages. Covers route registration, reusable Atomic Design components, bilingual SEO, prerendering, responsive behavior, accessibility, visual regression, and CI validation."
---

# Create a VitaBlue public page

Use this workflow for every new or substantially redesigned public page in `vitablue-v2`.

## Goal

Deliver a complete public route, not only a JSX screen. The page must be discoverable, prerenderable, responsive, accessible, visually tested, and composed from reusable components when a local pattern exists.

## 1. Establish the contract before editing

Read the nearest existing page with the same intent and inspect:

- `config/routes.ts`: canonical route, locale, alternate route, indexability, prerender and sitemap flags.
- `App.tsx` and the router surface: how the page is selected and where layouts are applied.
- `components/layouts/PublicLayout.tsx`: shared navbar, footer, canonical handling and public shell.
- `e2e/fixtures/publicRoutes.ts`: the route inventory consumed by audits.
- `pages/public/` and the closest existing organisms/molecules.
- `tailwind.config.js`, `index.css` and nearby pages for tokens, typography and responsive conventions.

Before the first edit, state one local hypothesis about the owning pattern and one cheap check that could disconfirm it. Prefer an existing component over a new abstraction.

## 2. Design the page as a composition

Classify the page content before writing JSX:

- Atoms: controls, labels, badges and small visual primitives (e.g. `Logo`, `Button`, `InputText`, `Checkbox`, `WhatsAppIcon`).
- Molecules: cards, section intros, breadcrumbs, process steps and repeated content blocks (e.g. `ContactChannelCard`, `FormField`, `TrustCardGrid`, `SectionIntro`).
- Organisms: heroes, grids, trust sections, FAQ sections, transparency panels and major page bands (e.g. `BrandHero`, `FaqSection`, `TestimonialGrid`, `AdvisorHelpSection`).
- Page-only inline markup: only genuinely unique editorial content, data tables, calculations or one-off interactions.

Search for equivalent structures in at least two nearby public pages. If the structure is repeated, reuse or extract a component with a small, typed API. Do not duplicate a complete hero or section wrapper in a second page.

Keep page files responsible for content composition and page-specific data. Keep reusable components responsible for structure, layout and behavior. Avoid broad refactors unrelated to the new page.

**Mandatory Rule for Forms and Inputs:**
Never use raw HTML inputs or direct styling for labels. Wrap form fields in the `<FormField>` molecule to guarantee the exact styling, font hierarchies, transformations (`uppercase`), and accessible focus states defined in the Styleguide.

## 3. Register and implement the route

Update every required route surface consistently:

1. Add the canonical Spanish or English route to `canonicalRoutes` in `config/routes.ts`.
2. Add its translated alternate route when the page is bilingual.
3. Set `indexable`, `prerender` and `sitemap` intentionally; do not guess.
4. Add legacy aliases only when there is an existing production URL to preserve.
5. Add or connect the page in the application router.
6. Verify `publicRoutes.ts` derives the route correctly; do not maintain a second hand-written inventory.
7. Place the page under `pages/public/` and wrap it in the existing public layout.

The route registry is the source of truth. A new indexable page must appear in the generated prerender output and sitemap.

## 4. Implement SEO and content

Every indexable page must include:

- One meaningful `<title>` between 10 and 80 characters where practical.
- One meta description between 50 and 200 characters where practical.
- Exactly one semantic `<h1>` (usually inside `BrandHero`).
- A canonical URL supplied by the shared public SEO layer.
- `og:title`, `og:description` and `og:image`.
- Structured data only when it accurately describes the page.
- Visible content in the prerendered HTML; do not make the initial page depend on client-only data for its main content.

For bilingual pages, keep language, copy, title, description, canonical and alternate route aligned. Reuse the existing social image convention unless a page-specific image is required and available.

## 5. Validate incrementally

After each substantive edit, run the narrowest relevant check before continuing:

```bash
npm run typecheck
npm run build
npm run --silent audit:components:ci
```

For a route-specific change, run focused Playwright tests first. Use the project configuration from `vitablue-v2`; do not run Playwright from the workspace parent:

```bash
# Verify SEO, canonical tags, og metadatas, and single H1 on desktop
npm exec -- playwright test e2e/seo.audit.spec.ts --project=desktop --grep='<route-or-test-name>' --reporter=line

# Verify WCAG2.1 AAA Accessibility constraints (contrast, focus, etc.)
npm exec -- playwright test e2e/accessibility.audit.spec.ts --project=desktop --grep='<route-or-test-name>' --reporter=line

# Validate there is no horizontal layout overflow on mobile (375px)
npm exec -- playwright test e2e/responsive.diagnostic.spec.ts --project=mobile --grep='<route-or-test-name>' --reporter=line
```

Run the visual test for the affected route and viewport. Update snapshots only after inspecting that the difference is an intentional result of the change. Never use snapshot updates to hide a layout regression.

## 6. Definition of done

Do not report completion until all applicable checks pass:

- TypeScript typecheck.
- Production build and prerender.
- Route resolves at the intended URL and its alternate URL when applicable.
- SEO audit for the new route.
- Axe accessibility audit with no critical or serious violations.
- Mobile overflow/responsive audit.
- Focused visual regression, with snapshots updated only when expected.
- `npm run --silent audit:components:ci` with no unjustified candidate blocks (requires >=90% score).
- `git diff --check`.

Also inspect the final diff for duplicated sections, missing route metadata, accidental private/indexable flags, incorrect language strings, and unrelated changes.

## Failure handling

- If a check fails, fix the owning abstraction or route contract first; do not weaken the test.
- If a repeated inline block appears, compare its normalized structure and JSX children before extracting it.
- If a visual snapshot differs, inspect the screenshot and diff image before updating it.
- If the requested design conflicts with an existing shared component, extend that component with a narrow variant rather than copying it.
- Keep unrelated pre-existing worktree changes intact. Do not stage, commit or push unless explicitly requested.

## Final report

Summarize:

- Files and route surfaces changed.
- Components reused or newly extracted and why.
- SEO/locale decisions.
- Commands run and pass counts.
- Any remaining risk or intentionally deferred work.
