import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'browser',
    include: [
      'tests/browser/**/*.{test,spec}.{js,jsx}',
      'tests/**/*.browser.{test,spec}.{js,jsx}',
    ],
    setupFiles: ['./tests/setupBrowserTests.js'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        { browser: 'chromium' },
      ],
    },
    environment: 'jsdom',
  },
})
