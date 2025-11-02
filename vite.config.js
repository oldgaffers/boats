import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      enabled: true,
      thresholds: {
        functions: 29,
        lines: 30,
        branches: 30,
        statements: 30,
      },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: [
            'tests/unit/**/*.{test,spec}.{js,jsx}',
            'tests/**/*.unit.{test,spec}.{js,jsx}',
          ],
          coverage: {
            provider: 'v8',
            include: ['src/**/*.js'],
          },
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
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
          coverage: {
            provider: 'v8',
            include: ['src/**/*.jsx'],
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
