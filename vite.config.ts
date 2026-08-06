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
        renderAfterTime: 5000,
        ...(prerenderExecutablePath ? { executablePath: prerenderExecutablePath } : {}),
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }),
      routes: prerenderRoutes,
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
