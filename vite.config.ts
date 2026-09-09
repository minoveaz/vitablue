import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { prerenderRoutes } from './config/routes';

const require = createRequire(import.meta.url);
const prerender = require('vite-plugin-prerender');
const Renderer = prerender.PuppeteerRenderer;
const localChromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const prerenderExecutablePath = process.platform === 'darwin' && fs.existsSync(localChromePath)
  ? localChromePath
  : undefined;

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    prerender({
      staticDir: path.join(__dirname, 'dist'),
      renderer: new Renderer({
        // Event-driven: wait for React to signal it has fully mounted.
        // App.tsx dispatches 'app-prerendered' after all components render.
        // Falls back to timeout if the event never fires (e.g. runtime error).
        renderAfterDocumentEvent: 'app-prerendered',
        renderAfterTime: 12000,
        ...(prerenderExecutablePath ? { executablePath: prerenderExecutablePath } : {}),
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
      routes: prerenderRoutes,
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      'remotion': path.resolve(__dirname, './node_modules/remotion')
    },
  },
  server: {
    port: 5174,
    strictPort: true,
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
      '/render-jobs': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2018',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-motion';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
