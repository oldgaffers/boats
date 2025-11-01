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
          coverage: {
            provider: 'v8',
            include: ['src/**/*.js'],
            enabled: true,
            thresholds: {
              // Requires 90% function coverage
              functions: 90,
              lines: 0,
              branches: 0,
              statements: 0,
            }
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
            provider: playwright(),
            enabled: true,
            headless: true,
            instances: [
              { browser: 'chromium' },
            ],
          },
          coverage: {
            provider: 'v8',
            include: ['src/**/*.jsx'],
            enabled: true
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
