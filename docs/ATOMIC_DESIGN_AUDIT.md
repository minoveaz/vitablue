# Auditoría de Atomic Design

**Fecha:** 2026-08-11  
**Ámbito:** `pages/public`, `pages/funnel` y `pages/dev/Styleguide.tsx` de `vitablue-v2`.

## Resultado

El auditor automático actual registra **72 componentes reutilizables, 28 bloques inline legítimos y 0 candidatos reales a reutilización**. La cobertura funcional resultante es **100%**. Esta cifra es reproducible con `npm run audit:components`.

La revisión excluye HTML estructural inevitable, `Helmet`, JSON-LD/schema, copy editorial único, tablas únicas, widgets hero específicos y demos del Styleguide. Tras unificar `BrandHero` y `ProductTransparencyPanel`, no quedan firmas repetidas pendientes.

Método:

1. Se inventariaron 21 archivos de `pages/public` y 3 de `pages/funnel` mediante `rg --files`.
2. Se marcaron como reutilizables las instancias de componentes importados desde `components/atoms`, `components/molecules` y `components/organisms`, incluyendo composiciones repetidas ya consolidadas.
3. Se marcaron como inline aceptado los bloques únicos de contenido o interacción que no tienen una segunda estructura equivalente.
4. Un bloque solo es candidato cuando su etiqueta y firma de clases normalizada se repiten en al menos dos archivos de página. La clasificación es conservadora: los bloques no repetidos quedan como inline legítimo.

## Candidatos actuales

No quedan candidatos reales. Los heroes editoriales usan `BrandHero` y los wrappers de transparencia usan `ProductTransparencyPanel`; las variantes restantes son estructuralmente únicas.

## Inventario reutilizable

### Átomos y moléculas

`Logo`, `Button`, `InputText`, `InputSelect`, `Checkbox`, `Badge`, `Card`, `Accordion`, `FormField`, `Breadcrumbs`, `ProductPromoCard`, `TestimonialCard`, `ProductCard`, `TransparencyBlock`, `AdvisorCard`, `ProductCategoryCard`, `TrustCardGrid`, `SectionIntro`, `ProcessSteps`, `ContactChannelCard`, `CtaBanner`, `CoverageCard`, `InsuranceProductCard`, `PlanCard`, `QuoteEstimator`, `InfiniteMarquee`, `ReviewWall`, `ReimbursementCalculator`, `Autocomplete` y `Drawer`.

### Organismos

`ConversationalHero`, `BrandHero`, `ProductHero`, `ProductBreadcrumbBar`, `ProductTrustBar`, `ProviderLogoBar`, `CoverageGrid`, `ProductTransparencySection`, `PlanComparisonSection`, `ProductProcessSection`, `ProductRequirementsSection`, `ProductPromotionSection`, `TestimonialGrid`, `FaqSection`, `SanitasTrustSection`, `AdvisorHelpSection`, `RequirementsComparisonTable`, `QuotationWizard`, `IllustrationGallery` y el nuevo `DigitalServicesSection`.

## Decisiones de la fase B

- **Heroes legacy:** `ForeignerInsurance` y `SanitasInsurances` permanecen inline. Sus heroes tienen composición propia y contenido/ilustración específicos; la API actual de `ProductHero` no permite conservar esa estructura sin pérdida. `HealthInsurance` también conserva su hero porque usa una tarjeta de ilustración propia y no necesita un widget de producto. No se creó `LegacyProductHero`.
- **Secciones digitales:** `SanitasMasSalud` se migró a `DigitalServicesSection`, conservando el mockup de teléfono, textos y beneficios. `HealthInsurance` no tiene una segunda sección digital equivalente: su contenido relacionado con salud digital aparece como datos de producto, no como una sección visual de servicios. Por ello no se fabricó una migración artificial.
- **Casos únicos:** `WhatsAppAdvisorNotice`, `MicroStatsGrid`, la tabla editorial de `BlogPost` y `ContactHeroForm` se mantienen inline cuando aparecen. No hay una segunda estructura equivalente que justifique extraerlos.
- **Styleguide:** se añadió una demo explícita de `DigitalServicesSection`. Los organismos y moléculas creados en esta línea que ya estaban presentes mantienen sus demos existentes.

## Páginas revisadas

`AboutUs`, `AsistenciaFamiliar`, `AvisoLegal`, `BlogList`, `BlogPost`, `Contact`, `CookiesPolicy`, `ExpatInsurance`, `ForeignerInsurance`, `HealthInsurance`, `Home`, `LifeInsurance`, `MarketingRedirect`, `NomadInsurance`, `Privacy`, `SanitasInsurances`, `SanitasMasSalud`, `SanitasMascotas`, `StudentInsurance`, `TravelInsurance`, `Results`, `Wizard` y las demos de `Styleguide`.

## Bloques inline aceptados

Se aceptan como inline los layouts estructurales de cada página, copy bilingüe editorial, metadatos y schema, tablas con modelo de datos único, calculadoras o selectores específicos de una página, hero widgets particulares y visualizaciones/mockups que no se repiten. Estos bloques no computan como deuda de reutilización en la métrica.

## Comprobaciones de duplicación

Se revisaron imports y usos directos de `ProductHero`, `ProductBreadcrumbBar`, `ProductTrustBar`, `ProviderLogoBar`, `CoverageGrid`, `ProductTransparencySection`, `PlanComparisonSection`, `ProductProcessSection`, `ProductRequirementsSection` y `ProductPromotionSection`. También se buscó la repetición de `WhatsAppAdvisorNotice`, `MicroStatsGrid`, `ContactHeroForm` y `DigitalServicesSection`. No queda un import antiguo evidente que deba abstraerse tras esta línea de trabajo.