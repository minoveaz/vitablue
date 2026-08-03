# AGENTS.md - VitaBlue v2 Development Guidelines

> **Complete guide for coding agents and developers working on VitaBlue v2.**
> This project is a multi-brand white-label insurance comparator built with React, Vite 6, Tailwind CSS, and TypeScript, optimized for high conversion in social media ads and 100% SEO compliance through pre-rendering.

---

## 📱 1. MANDATORY: Mobile-First Responsive Coding Rules

Since 95%+ of advertising traffic comes from mobile devices, the visual layout must be flawless on small screens. You must design and code starting from the smallest device (iPhone SE - 375px) up to desktop (1920px), adhering to these rules:

1.  **Estilos Móviles por Defecto:**
    *   Cualquier clase de Tailwind sin prefijo (ej: `grid-cols-1`, `flex-col`, `p-4`) representa el diseño en móvil.
    *   Los prefijos responsivos como `md:` o `lg:` solo deben utilizarse para adaptar la pantalla a dispositivos medianos/grandes.
    *   *Ejemplo:* `className="grid grid-cols-1 md:grid-cols-3 gap-6"` (1 columna nativa en móvil, 3 columnas en pantallas medianas o escritorio).
2.  **Uso de Anchos Fluidos (No Fixed Widths):**
    *   Queda estrictamente prohibido declarar anchos fijos en contenedores principales (evitar `w-[400px]`, `w-[500px]`, etc., en cajas exteriores).
    *   Utiliza siempre anchos fluidos porcentuales o relativos (`w-full`, `max-w-[1200px]`, `max-w-xl`).
    *   Acompaña siempre los anchos con rellenos laterales responsivos (`px-4 sm:px-6 md:px-8`) para asegurar que el contenido respire en cualquier pantalla y no toque los bordes físicos del teléfono.
3.  **Flexbox y Wrap Automático:**
    *   Para filas de botones, enlaces, menús e ítems pequeños, utiliza siempre Flexbox con propiedad de auto-ajuste (`flex flex-wrap gap-4`).
    *   Esto permite que los elementos que no quepan horizontalmente en pantallas estrechas caigan al siguiente renglón de forma limpia en lugar de generar desbordamiento lateral (overflow-x).
4.  **Meta Viewport (Inyectada):**
    *   El archivo [index.html](file:///Users/minoveaz/Documents/Proyectos/Estar%20Protegidos/vitablue-v2/index.html) contiene la etiqueta `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. No la alteres, ya que es la que indica al navegador que renderice el sitio escalado a la pantalla real del dispositivo móvil y no a una versión escalada de escritorio.

---

## 🎨 2. Visual System & Brand Tokens (Option 3)

We utilize **Option 3** from visual guidelines. Do not use raw hex codes in components; always use Tailwind semantic classes:

### Colors
*   `primary` (`#005F73` / `vb-ocean`): Ocean Teal. Headers, active tabs, highlight borders.
*   `primary-dark` (`#001219` / `vb-midnight`): Midnight Blue. Main body text, dark background overlays, footer background, and card hovers.
*   `accent` (`#EE9B00` / `vb-gold`): Amber Gold. High-converting CTA buttons, conversion outlines, and highlight metrics.
*   `brand-cyan` (`#94D2BD` / `vb-mint`): Mint Green. Secondary badges, success indicators, and soft background alerts.
*   `background-light` (`#f8fafc`): Cool Gray. Main page background.
*   `text-main` (`#001219`): Main typography color.
*   `text-secondary` (`#4a5568`): Secondary muted typography color.

### Typography & Hierarchies
We use Poppins (`font-display`) and Inter (`font-sans`). To maintain visual consistency, **always use the predefined custom Tailwind utility classes** in your React code instead of building inline font sizes:

| Element | Custom Class | Font | Mobile Specs | Desktop Specs | Usage |
|---------|--------------|------|--------------|---------------|-------|
| **Heading 1** | `text-h1` | Poppins Bold (700) | 36px, Leading 1.2, Tracking -0.02em | 48px (3rem), Leading 1.2, Tracking -0.02em | Hero/Page Title |
| **Heading 2** | `text-h2` | Poppins Semibold (600) | 28px, Leading 1.3, Tracking -0.01em | 36px (2.25rem), Leading 1.3, Tracking -0.01em | Section Titles, Cards |
| **Heading 3** | `text-h3` | Poppins Medium (500) | 20px, Leading 1.4, Tracking Normal | 24px (1.5rem), Leading 1.4, Tracking Normal | Card Titles, Subsections |
| **Body Large** | `text-body-lg` | Inter Regular (400) | 16px, Leading 1.6, Tracking Normal | 18px (1.125rem), Leading 1.6, Tracking Normal | Intros, Lead Paragraphs |
| **Body Regular** | `text-body-reg` | Inter Regular (400) | 14px, Leading 1.5, Tracking Normal | 16px (1rem), Leading 1.5, Tracking Normal | Default text, Articles |
| **Caption/Small** | `text-caption` | Inter Medium (500) | 12px (0.75rem), Leading 1.4, Tracking 0.02em | 12px, Leading 1.4, Tracking 0.02em | Helper text, Metadata, Footer |

---

## 🏗️ 3. Project Directory Structure (Atomic Design)

Keep the code modular by placing elements in their correct category folder:

```
vitablue-v2/
├── components/
│   ├── atoms/         # UI Elements: Logo, Button, InputText, InputSelect, Checkbox, Badge
│   ├── molecules/     # Combined Atoms: FormField, Card, Accordion
│   └── organisms/     # Complex structures & Layout: Navbar, Footer, CookieBanner
├── pages/             # Route Views: Home, StudentInsurance, Results, Wizard
├── context/           # State Management: WizardContext
└── utils/             # Helper tools: recommendationEngine, analytics
```

---

## 🛠️ 4. Build & Testing Commands

To test the application locally or run the pre-rendered production build:

```bash
# Start local development server
npm run dev

# Compile production build with Puppeteer prerendering
npm run build

# Preview build output locally
npm run preview
```

---

## 📝 5. Content & Blog Synchronization (SSG Automation)

The blog operates as a static pre-rendered system (SSG) to ensure 100% crawlability by search engine crawlers. When adding or editing content, you must keep all route configurations, pre-rendering targets, and sitemap entries synchronized.

### Automated Sync Flow
We have automated the synchronization of configuration files into a single command. If you add, edit, or delete articles:

1. Update the content database in [utils/blogData.ts](file:///Users/minoveaz/Documents/Proyectos/Estar%20Protegidos/vitablue-v2/utils/blogData.ts).
2. Execute the sync script:
   ```bash
   npm run sync-blog
   ```
   *This automatically extracts the slugs, registers them as pre-rendering routes in `vite.config.ts`, and updates the sitemap entries inside `public/sitemap.xml`.*
3. Rebuild the static HTML pages:
   ```bash
   npm run build
   ```
