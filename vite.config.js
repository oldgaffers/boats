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
        functions: 15,
        lines: 20,
        branches: 20,
        statements: 20,
      },            
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
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
            enabled: true,
            provider: playwright(),
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
