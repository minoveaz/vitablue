# Track: Sistema UI y patrones reutilizables de VitaBlue

**Fecha:** 2026-08-10  
**Estado:** En progreso  
**Objetivo:** convertir los patrones visuales ya presentes en VitaBlue en componentes reutilizables para que las páginas nuevas mantengan la composición, jerarquía y lenguaje de marca.

## Contexto

VitaBlue ya tiene tokens de color, tipografía, botones, tarjetas, ilustraciones y varias páginas de producto con una composición consistente. Sin embargo, muchas páginas todavía construyen su estructura directamente con clases Tailwind. Esto permite que una página use los colores correctos y aun así parezca ajena a VitaBlue.

Este track extrae patrones de composición desde las páginas de producto existentes y establece una base común para páginas comerciales, institucionales y editoriales.

## Principios

- Reutilizar primero los patrones que ya funcionan en producción.
- Separar tokens, componentes, patrones y plantillas de página.
- Mantener accesibilidad, responsive y SEO como requisitos del componente.
- Evitar que cada página invente su propia escala, espaciado o tratamiento de CTA.
- Usar componentes existentes (`Button`, `Card`, `Breadcrumbs`, `Accordion`, `AdvisorCard`) antes de crear duplicados.
- Permitir variantes explícitas sin convertir los componentes en configuraciones difíciles de mantener.

## Patrones a extraer

### Foundation

- `BrandButton`: enlace o acción con las variantes visuales de `Button`.
- `SurfaceCard`: tarjeta basada en `Card` para superficies de confianza y contacto.
- `SectionIntro`: eyebrow, título y descripción con la jerarquía de VitaBlue.
- `BreadcrumbBar`: franja de navegación sobre fondo suave.

### Composición

- `BrandHero`: hero de gradiente VitaBlue con badge, título, descripción, CTA e ilustración o panel opcional.
- `TrustCardGrid`: tarjetas de confianza con icono o ilustración.
- `ProcessSteps`: pasos numerados para explicar el proceso de asesoramiento.
- `ContactChannelCard`: email, teléfono y WhatsApp con iconografía y estados de enlace.
- `CtaBanner`: llamada a la acción final con superficie suave de marca.
- `FaqSection`: composición de título, introducción y `Accordion`.

### Plantillas posteriores

- `ProductPageTemplate` para páginas comerciales.
- `InstitutionalPageTemplate` para About y páginas de confianza.
- `ContactPageTemplate` para contacto, formularios y canales de atención.

## Orden de implementación

1. Consolidar los tokens y estados accesibles.
2. Extraer `SectionIntro`, `BrandHero`, `SurfaceCard` y `CtaBanner`.
3. Extraer `TrustCardGrid`, `ProcessSteps` y `ContactChannelCard`.
4. Migrar About y Contact a estos patrones.
5. Migrar una página de producto como prueba de compatibilidad.
6. Añadir pruebas responsive y una revisión visual de las composiciones.
7. Documentar variantes permitidas en el Styleguide.

## Criterios de aceptación

- [ ] Los patrones extraídos usan tokens y componentes existentes.
- [ ] Los estados hover, focus, disabled y responsive están definidos.
- [ ] About y Contact pueden componerse sin repetir bloques visuales completos.
- [ ] Al menos una página de producto usa los patrones nuevos sin regresión visual.
- [ ] Las páginas mantienen las validaciones de typecheck, build, SEO, accesibilidad y Playwright.
- [ ] El Styleguide documenta los patrones y sus variantes.
- [ ] No se introducen colores o tipografías fuera del sistema sin una decisión explícita.

## Fuera de alcance

- Rediseñar toda la identidad visual.
- Cambiar los tokens globales sin una auditoría de contraste.
- Crear un sistema de diseño separado del repositorio.
- Implementar todavía el dashboard histórico de Lighthouse.
- Fusionar o abrir un pull request durante esta fase de extracción.
