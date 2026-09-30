import { defineConfig } from '@playwright/test';
import fs from 'node:fs';

const defaultChromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const discoveredChrome = defaultChromePaths.find(p => fs.existsSync(p));

export default defineConfig({
  testDir: './browser-tests',
  timeout: 90000,
  expect: { timeout: 10000 },
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
    launchOptions: (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || discoveredChrome) ? {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || discoveredChrome,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
    } : {},
  },
  projects: [
    { name: 'desktop', use: { browserName: 'chromium', viewport: { width: 1365, height: 900 } } },
    { name: 'mobile', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI,
  },
});
