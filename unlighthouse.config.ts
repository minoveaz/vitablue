import { defineConfig } from 'unlighthouse'

export default defineConfig({
  // Host target for local audit running over vite preview
  site: 'http://localhost:4173',
  scanner: {
    // Escanea las páginas indexables estáticas pre-renderizadas en dist/
    device: 'mobile',
    throttle: true,
    exclude: [
      '/aviso-legal',
      '/politica-privacidad',
      '/politica-cookies',
      '/privacidad',
      '/cookies',
      '/styleguide'
    ]
  },
  ci: {
    budget: {
      performance: 70,
      accessibility: 90,
      'best-practices': 90,
      seo: 90,
    }
  },
  debug: false,
})
