import { defineConfig } from '@playwright/test';

/**
 * Infraestructura per al QA (arq. §5.1, §11). La web local és a http://localhost:4321/bistrot1954/.
 * Les rutes dels tests s'escriuen sense barra inicial (page.goto('es/')), perquè page.goto('/es/') sortiria de la base.
 */
export default defineConfig({
  testDir: 'tests/qa',
  outputDir: 'test-results',
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321/bistrot1954/',
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321/bistrot1954/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
