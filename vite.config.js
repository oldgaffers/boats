import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  projects: [
    {
      name: 'browser',
      test: {
        include: ['*.test.jsx'],
        browser: {
          provider: playwright(),
          enabled: true,
          instances: [
            { browser: 'chromium' },
          ],
        },
      },
    },
    {
      name: 'unit',
      test: {
        environment: 'node',
        include: ['*.test.js'],
      },
    },
  ],
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
