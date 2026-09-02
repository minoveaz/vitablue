import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration — VitaBlue v2
 *
 * Cubre Mobile-First (iPhone SE 375px) hasta Desktop (1440px).
 * En CI, usa el servidor estático pre-renderizado (npm run build + preview).
 * En local, reutiliza el servidor si ya está activo.
 *
 * Proyectos:
 *  - desktop         : Chrome 1440×900 (viewport escritorio)
 *  - mobile          : iPhone 13 (390×844, deviceScaleFactor 3)
 *  - mobile-compact  : iPhone SE (375×667, deviceScaleFactor 2) — caso crítico 375 px
 */

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // Un reintento cubre fallos transitorios sin triplicar el coste de un fallo determinista.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    // --host 127.0.0.1 es necesario para que vite preview escuche en 127.0.0.1
    // (por defecto escucha en localhost que puede resolver a ::1 en macOS)
    command: 'npm run preview -- --host 127.0.0.1',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  // Snapshot dir separado por proyecto para evitar colisiones en visual tests
  snapshotPathTemplate: '{testDir}/__snapshots__/{projectName}/{testFilePath}/{arg}{ext}',
  projects: [
    {
      name: 'desktop',
      testMatch: ['**/smoke.public.spec.ts', '**/functional.blog.spec.ts', '**/functional.wizard.spec.ts', '**/accessibility.public.spec.ts', '**/visual.public.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
      testIgnore: ['**/video-studio.visual.spec.ts'],
    },
    {
      name: 'mobile',
      testMatch: ['**/functional.mobile-public.spec.ts'],
      use: {
        ...devices['iPhone 13'],
        browserName: 'chromium',
      },
      testIgnore: ['**/video-studio.visual.spec.ts'],
    },
    {
      name: 'mobile-compact',
      testMatch: ['**/responsive.public.spec.ts', '**/functional.mobile-public.spec.ts', '**/visual.public.spec.ts'],
      use: {
        ...devices['iPhone SE'],
        browserName: 'chromium',
        // Forzar 375px (caso crítico según AGENTS.md)
        viewport: { width: 375, height: 667 },
      },
      testIgnore: ['**/video-studio.visual.spec.ts'],
    },
  ],
});
