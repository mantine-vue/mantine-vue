import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/*.test.ts', 'packages/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@mantine-vue/utils': r('./packages/@mantine-vue/utils/src'),
      '@mantine-vue/hooks': r('./packages/@mantine-vue/hooks/src'),
      '@mantine-vue/core': r('./packages/@mantine-vue/core/src'),
      '@mantine-vue/form': r('./packages/@mantine-vue/form/src'),
      '@mantine-vue/store': r('./packages/@mantine-vue/store/src'),
    },
  },
})
