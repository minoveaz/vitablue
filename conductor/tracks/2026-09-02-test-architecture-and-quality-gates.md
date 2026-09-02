# Track: Test architecture and quality gates

## Objective

Reorganize VitaBlue's validation model using Loopdev as a reference, keeping
the checks deterministic, understandable, and appropriate for a Vite static
site with prerendered public pages.

## Scope

### 1. Establish a deterministic quality job

- Always run lint, typecheck, route and sitemap validators, unit tests, and the
  SSG build.
- Make this job the required `Quality Gate` for pull requests.
- Remove dependencies on Supabase or external services from static validation.

### 2. Separate frontend E2E execution

- Run Playwright only when frontend, route, styling, or E2E surfaces change.
- Build the application before starting browser tests.
- Keep desktop, mobile, and compact-mobile projects explicit.
- Ensure skipped optional suites do not prevent the required quality check from
  reporting a result.

### 3. Split suites by responsibility

- `smoke`: public routes load and return usable content.
- `functional`: wizard, blog, and navigation flows.
- `accessibility`: Axe violations.
- `responsive`: overflow and geometry.
- `visual`: screenshot regression, initially informative.

### 4. Add deterministic static SEO validation

- Validate generated `dist` files rather than relying only on browser timing.
- Verify sitemap URLs have corresponding HTML and exact canonicals.
- Verify reciprocal hreflang links, one H1, title, and meta description.
- Verify non-indexable wizard, results, legal, and backoffice routes are
  excluded according to the route registry.

### 5. Isolate link and external-service checks

- Validate internal links against the route registry and sitemap.
- Exclude `mailto:`, `tel:`, WhatsApp, analytics, and other external protocols
  from internal HTTP checks.
- Keep external link monitoring informational and non-blocking.
- Add explicit redirect assertions for legacy URLs separately from page tests.

## Delivery order

1. Inventory current scripts and workflows.
2. Implement the deterministic quality job and repair the required check.
3. Add static SEO validation.
4. Split and retarget Playwright suites.
5. Isolate internal/external link checks and re-enable the global audit.
6. Run the complete validation model before merging SEO changes.

## Acceptance criteria

- Every pull request receives a reported, reliable `Quality Gate` check.
- A failing static SEO rule identifies the exact URL and violated rule.
- Browser tests do not fail because of external links or unavailable Supabase.
- Visual snapshots are not the sole evidence for layout correctness.
- The complete test model is documented in the repository and reproducible
  locally and in CI.
