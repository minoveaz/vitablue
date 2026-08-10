# Reusable Components Matrix

Updated: 2026-08-10
Scope: `components/` and `pages/dev/Styleguide.tsx`

## Status legend

- **Stable**: component has a dedicated file, props/API, and is consumed outside Styleguide.
- **Reusable**: component has a dedicated file and props/API, but adoption or visual validation is incomplete.
- **Inline gap**: important visual composition is still written directly in a page.

## Component matrix

| Component | File | In Styleguide | Used outside Styleguide | Tokens | Responsive/visual tests | Status |
|---|---|---:|---:|---:|---:|---|
| Logo | `components/atoms/Logo.tsx` | Yes | Yes | Partial | No | Stable |
| Button | `components/atoms/Button.tsx` | Yes | Yes | Partial | No | Stable |
| InputText | `components/atoms/InputText.tsx` | Yes | Yes | Partial | No | Stable |
| InputSelect | `components/atoms/InputSelect.tsx` | Yes | Yes | Partial | No | Stable |
| Checkbox | `components/atoms/Checkbox.tsx` | Yes | Yes | Partial | No | Stable |
| Badge | `components/atoms/Badge.tsx` | Yes | Yes | Partial | No | Stable |
| WhatsAppIcon | `components/atoms/WhatsAppIcon.tsx` | No | Yes | Yes | No | Stable |
| Card | `components/molecules/Card.tsx` | Yes | Yes | Partial | No | Stable |
| Accordion | `components/molecules/Accordion.tsx` | Yes | Yes | Partial | No | Stable |
| FormField | `components/molecules/FormField.tsx` | Yes | Yes | Partial | No | Stable |
| Breadcrumbs | `components/molecules/Breadcrumbs.tsx` | Yes | Yes | Partial | No | Stable |
| ProductPromoCard | `components/molecules/ProductPromoCard.tsx` | Yes | Limited | Partial | No | Reusable |
| TestimonialCard | `components/molecules/TestimonialCard.tsx` | Yes | Yes | Partial | No | Stable |
| InfiniteMarquee | `components/molecules/InfiniteMarquee.tsx` | Yes | Yes | Partial | No | Stable |
| ReviewWall | `components/molecules/ReviewWall.tsx` | Yes | Limited | Partial | No | Reusable |
| ReimbursementCalculator | `components/molecules/ReimbursementCalculator.tsx` | Yes | Limited | Partial | No | Reusable |
| Autocomplete | `components/molecules/Autocomplete.tsx` | Yes | Limited | Partial | No | Reusable |
| Drawer | `components/molecules/Drawer.tsx` | Yes | Limited | Partial | No | Reusable |
| QuotationWizard | `components/organisms/QuotationWizard.tsx` | Yes | Yes | Partial | No | Stable |
| ConversationalHero | `components/organisms/ConversationalHero.tsx` | Yes | Yes | Partial | No | Stable |
| ProductCard | `components/molecules/ProductCard.tsx` | Yes | Product pages | Partial | No | Stable |
| TransparencyBlock | `components/molecules/TransparencyBlock.tsx` | Yes | Product pages | Partial | No | Stable |
| AdvisorCard | `components/molecules/AdvisorCard.tsx` | Yes | Product pages | Partial | No | Stable |
| ProductCategoryCard | `components/molecules/ProductCategoryCard.tsx` | Yes | Home | Yes | No | Reusable |
| TrustCardGrid | `components/molecules/TrustCardGrid.tsx` | Yes | Home | Yes | No | Reusable |
| SectionIntro | `components/molecules/SectionIntro.tsx` | Yes | Limited | Yes | No | Reusable |
| BrandHero | `components/organisms/BrandHero.tsx` | Yes | Limited | Partial | No | Reusable |
| ProcessSteps | `components/molecules/ProcessSteps.tsx` | Yes | Limited | Yes | No | Reusable |
| ContactChannelCard | `components/molecules/ContactChannelCard.tsx` | Yes | Limited | Yes | No | Reusable |
| CtaBanner | `components/molecules/CtaBanner.tsx` | Yes | Limited | Yes | No | Reusable |

## Important inline gaps

These are not missing low-level components, but page compositions that still duplicate visual markup:

| Composition | Current location | Recommended action |
|---|---|---|
| Home trust cards | `pages/public/Home.tsx` | Already migrated to `TrustCardGrid`; add visual tests. |
| Home product categories | `pages/public/Home.tsx` | Already migrated to `ProductCategoryCard`; add visual tests. |
| About page sections | `pages/public/AboutUs.tsx` | Migrate to `BrandHero`, `SectionIntro`, `TrustCardGrid`, `ProcessSteps`, `CtaBanner`. |
| Contact page sections | `pages/public/Contact.tsx` | Migrate to `BrandHero`, `SectionIntro`, `ContactChannelCard`, `CtaBanner`. |
| Product page process blocks | Product pages | Evaluate migration to `ProcessSteps` where composition matches. |
| Product page feature cards | Product pages | Evaluate `Card` or a dedicated product feature pattern. |
| Navbar/Footer internals | `components/organisms/Navbar.tsx`, `Footer.tsx` | Keep as organisms; audit direct colors and repeated subpatterns. |

## What is still missing

1. Visual regression tests for every Styleguide pattern at desktop, tablet, and mobile widths.
2. Overflow and bounding-box assertions for cards, buttons, forms, and heroes.
3. Complete migration of `AboutUs` and `Contact` to the new patterns.
4. Token migration in shared legacy components (`InputText`, `InputSelect`, `Checkbox`, `Footer`, `Navbar`, `AdvisorCard`, `ProductCard`, `TransparencyBlock`).
5. A shared test fixture with short, normal, and deliberately long copy.
6. A documented policy for when a page composition deserves a new component instead of inline markup.

## Recommended order

1. Add Playwright visual coverage for `/styleguide` and `/`.
2. Add stable selectors to the new patterns (`data-testid` only at component boundaries).
3. Migrate About and Contact.
4. Run the token audit against `atoms`, `molecules`, and `organisms`.
5. Promote the remaining reusable components from Reusable to Stable after visual validation.
