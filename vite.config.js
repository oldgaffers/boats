import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'tests/unit/**/*.{test,spec}.{js,jsx}',
            'tests/**/*.unit.{test,spec}.{js,jsx}',
          ],
        },
      },
      {
        test: {
          name: 'browser',
          include: [
            'tests/browser/**/*.{test,spec}.{js,jsx}',
            'tests/**/*.browser.{test,spec}.{js,jsx}',
          ],
          browser: {
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: () => 'main.js',
      },
    },
  },
  output: { inlineDynamicImports: true, },
  base: 'https://oldgaffers.github.io/boats/',
})
