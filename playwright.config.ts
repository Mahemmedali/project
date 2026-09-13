import { defineConfig, devices } from '@playwright/test'

/**
 * E2E — mock rejimində (DATABASE_URI boş) build edilmiş sayt üzərində.
 * Lokal: `pnpm build && pnpm test:e2e`. CI: .github/workflows/ci.yml
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3100',
    trace: 'on-first-retry',
    locale: 'az-AZ',
  },
  webServer: {
    command: 'pnpm start -p 3100',
    url: 'http://localhost:3100/az',
    reuseExistingServer: !process.env.CI,
    env: { DATABASE_URI: '', NODE_OPTIONS: '--no-deprecation' },
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...(process.env.PW_CHROMIUM ? { launchOptions: { executablePath: process.env.PW_CHROMIUM } } : {}) } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...(process.env.PW_CHROMIUM ? { launchOptions: { executablePath: process.env.PW_CHROMIUM } } : {}) } },
  ],
})
