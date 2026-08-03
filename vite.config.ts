import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const prerender = require('vite-plugin-prerender');
const Renderer = prerender.PuppeteerRenderer;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    prerender({
      staticDir: path.join(__dirname, 'dist'),
      renderer: new Renderer({
        renderAfterTime: 5000,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
      routes: [
        '/',
        '/en',
        '/en/health-insurance-student-visa-spain',
        '/en/health-insurance-expatriates-spain',
        '/en/digital-nomad-insurance-spain',
        '/en/blog',
        '/en/blog/student-visa-spain-health-insurance-requirements',
        '/en/blog/health-insurance-spain-non-lucrative-visa-requirements',
        '/productos/seguro-medico-estudiantes-extranjeros-espana.html',
        '/productos/international-students.html',
        '/productos/sanitas-mas-salud.html',
        '/productos/sanitas-mascotas.html',
        '/productos/asistencia-familiar-iplus.html',
        '/productos/seguro-para-decesos/asistencia-familiar',
        '/seguros-salud',
        '/productos/seguro-de-salud.html',
        '/seguro-expatriados',
        '/productos/seguro-medico-expatriados.html',
        '/seguro-nomadas',
        '/productos/seguro-nomadas-digitales.html',
        '/productos/seguros-salud',
        '/productos/seguros-salud/seguro-medico-estudiantes',
        '/productos/seguros-salud/seguro-expatriados',
        '/productos/seguros-salud/seguro-nomadas-digitales',
        '/productos/seguros-salud/seguro-salud-extranjeros',
        '/productos/seguros-salud/sanitas-mas-salud',
        '/productos/seguros-salud/seguros-sanitas',
        '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud',
        '/productos/seguros-salud/seguros-sanitas/international-students',
        '/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud.html',
        '/productos/seguros-salud/seguros-sanitas/sanitas-mascotas.html',
        '/productos/seguros-salud/seguros-sanitas/asistencia-familiar-iplus.html',
        '/productos/seguros-salud/seguros-sanitas/seguro-medico-estudiantes-extranjeros-espana.html',
        '/productos/seguro-mascotas/sanitas-mascotas',
        '/politica-privacidad',
        '/politica-cookies',
        '/privacidad.html',
        '/politica-cookies.html',
        '/aviso-legal',
        '/cotizador.html',
        '/wizard',
        '/resultados',
        '/privacidad',
        '/cookies',
        '/blog',
        '/blog/requisitos-seguro-medico-visado-estudiante-espana',
        '/blog/seguro-medico-residencia-no-lucrativa-espana',
        '/blog/seguro-de-salud-pareja-de-hecho-nie',
        '/blog/que-es-el-copago-seguro-salud',
        '/blog/periodos-de-carencia-seguro-medico',
        '/blog/preexistencias-medicas-seguro-salud',
      
      
      
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api/linkedin': {
        target: 'https://api.linkedin.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/linkedin/, ''),
      },
      '/api/facebook': {
        target: 'https://graph.facebook.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/facebook/, ''),
      },
      '/api/twitter': {
        target: 'https://api.twitter.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/twitter/, ''),
      },
      '/api/google': {
        target: 'https://www.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/google/, ''),
      },
    },
  },
  build: {
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom', 'framer-motion'],
          'ui-icons': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
