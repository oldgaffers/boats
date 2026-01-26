import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // common setup file for both unit and browser tests to filter/handle
    // non-fatal console warnings emitted by third-party libs (MUI, React)
    // and to provide any small global shims needed for tests.
    setupFiles: ['./tests/setupTests.js'],
    coverage: {
      enabled: true,
      thresholds: {
        functions: 27,
        lines: 33,
        branches: 29,
        statements: 32,
      },            
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
    },
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
