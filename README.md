
# VitaBlue - Prototipo Web Sanitas

VitaBlue es un prototipo de landing page estática desarrollada para agentes exclusivos de Sanitas, orientada a la captación y gestión de leads de seguros de salud internacionales y nacionales. El proyecto está diseñado como ejemplo educativo y demostrativo, mostrando buenas prácticas de desarrollo web moderno, accesibilidad, SEO y analítica, sin depender de frameworks ni backend.

**Características principales:**
- Código 100% HTML5, CSS3 y JavaScript vanilla, fácil de adaptar y desplegar en cualquier hosting estático.
- Integración completa de WhatsApp para contacto directo y seguimiento de formularios.
- Consentimiento de cookies propio, cumpliendo RGPD.
- Preparado para Google Tag Manager (GTM) y eventos personalizados de analítica.
- Estructura modular y reutilizable, con fragmentos HTML y centralización de datos clave (teléfono, enlaces, etc.).
- Optimización para SEO (meta, OpenGraph, JSON-LD, sitemap, robots.txt) y rendimiento (imágenes WebP/JPG, lazy loading).
- Accesibilidad mejorada: roles ARIA, contraste, navegación por teclado.

Este repositorio está listo para ser publicado en GitHub y desplegado en producción, sirviendo como base para proyectos reales o pruebas de concepto en el sector asegurador.

---

## 🚀 Estructura y Tecnologías

- **HTML5 semántico**: Secciones, ARIA, JSON-LD
- **CSS modular**: Mobile-first, variables, BEM-like
- **JS vanilla**: Integración WhatsApp, eventos GTM, phone.js centralizado
- **Consentimiento cookies**: Banner propio, cumplimiento RGPD
- **SEO**: Meta, OpenGraph, JSON-LD, sitemap, robots.txt
- **Imágenes**: WebP/JPG, lazy loading, placeholders optimizados

---

## 📦 Carpetas y Archivos Clave

- `index.html` — Landing principal
- `productos/international-students.html` — Ejemplo de producto
- `assets/css/` — Estilos globales y componentes
- `assets/js/phone.js` — Teléfono centralizado (WhatsApp, display)
- `assets/js/main.js` — Lógica principal, integración GTM/WhatsApp
- `partials/` — Fragmentos HTML reutilizables
- `.gitignore` — Preparado para GitHub
- `PERFORMANCE_ANALYSIS.md` — Checklist de despliegue y validación

---

## 📝 Funcionalidades Implementadas

- Banner de cookies (consentimiento, personalizable)
- Integración WhatsApp en formularios y CTAs
- Evento GTM en envío de formulario
- Teléfono unificado y sincronizado (display, WhatsApp, JSON-LD)
- Fragmentos HTML inyectados dinámicamente
- Accesibilidad: ARIA, roles, contraste, navegación
- SEO básico: meta, OpenGraph, JSON-LD, sitemap, robots.txt
- Responsive: mobile, tablet, desktop

---

## 🛠️ Cómo Probar Localmente

1. Navega a la carpeta del proyecto:
   ```powershell
   cd "c:\Users\o010630\Documents\Formacion\Coding\protege tu salud\vitablue"
   ```
2. Inicia un servidor HTTP:
   ```powershell
   python -m http.server 8080 --bind 127.0.0.1
   ```
3. Abre en navegador:
   - http://127.0.0.1:8080/index.html
   - http://127.0.0.1:8080/productos/international-students.html

> **Nota:** Fragmentos (`partials/`) requieren HTTP, no funcionan con `file://`.

---

## ✅ Checklist de Despliegue

- [x] HTML5 válido y semántico
- [x] SEO básico y OpenGraph
- [x] Banner cookies RGPD
- [x] WhatsApp integrado en CTAs y formularios
- [x] Evento GTM en formularios
- [x] Teléfono centralizado y sincronizado
- [x] Imágenes optimizadas y lazy loading
- [x] Accesibilidad básica (ARIA, roles, contraste)
- [x] Responsive (375px, 768px, 1024px, 1920px)
- [x] `.gitignore` para GitHub
- [x] Documentación actualizada

---

## 🔍 Testing y Validación

- **Consola JS:**
  - `window.VB_PHONE` debe mostrar `{ digits: '34661498600', display: '+34 661 49 86 00' }`
  - Todos los enlaces WhatsApp deben empezar por `https://wa.me/34661498600`
  - Todos los spans `[data-phone-display]` deben mostrar `+34 661 49 86 00`
- **Fragmentos:**
  - `.trust-stat` y `.trust-highlight` deben ser 4 cada uno
- **Responsive:**
  - Probar en 375px, 768px, 1024px, 1920px
- **SEO:**
  - Validar JSON-LD y meta en https://search.google.com/test/rich-results

---

## 📝 Convenciones

- **HTML:** Semántica, ARIA, lazy loading, width/height explícitos
- **CSS:** Mobile-first, variables, BEM-like, modular
- **JS:** Vanilla, ES6+, data attributes, IIFE, event delegation

---

## 📞 Contacto

**VitaBlue - Agente Exclusivo Sanitas**
- Teléfono/WhatsApp: + (centralizado en `assets/js/phone.js`)
- Email: info@vitablue.es
- Web: https://www.vitablue.es (placeholder)

---

## 📄 Licencia

- Marcas Sanitas® y Bupa® pertenecen a sus propietarios
- VitaBlue: agente exclusivo de seguros Sanitas
- Pólizas emitidas por Sanitas, S.A. de Seguros (Reg. DGSFP C0038)

---

**Última actualización:** Diciembre 2025  
**Versión:** 0.0.1  

