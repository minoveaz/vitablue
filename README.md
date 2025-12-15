# VitaBlue - Prototipo Web Sanitas

> **Landing page estática para agentes exclusivos Sanitas.**
>
> - HTML5, CSS3, JS Vanilla (sin frameworks)
> - Optimizada para SEO, accesibilidad y rendimiento
> - Integración WhatsApp, Google Tag Manager (GTM), consentimiento cookies
> - Prototipo educativo/demostrativo, listo para despliegue y GitHub

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


---

## 🆕 Novedades en la versión 1.1.0 (Diciembre 2025)

- **Mejoras de rendimiento:**
  - Google Tag Manager y Google Analytics ahora se cargan solo tras el primer scroll (no en el head), reduciendo el tiempo de carga y el uso de JS innecesario.
- **Imágenes responsivas:**
  - Todas las imágenes principales de productos usan `<picture>` y sirven versiones `-400.webp` en móviles (≤600px), optimizando la experiencia y el peso en dispositivos pequeños.
- **Botón de WhatsApp accesible:**
  - El botón de WhatsApp es más visible, tiene mensaje predefinido y ahora incluye `aria-label` para accesibilidad.
- **Accesibilidad y estructura:**
  - Se mantienen atributos `alt`, `loading`, `width`, `height` en imágenes y overlays visuales.
  - Patrón de imagen responsiva y botón WhatsApp unificados en toda la web.

---

**Última actualización:** Diciembre 2025  
**Versión:** 1.1.0  

