import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['packages/**/*.test.ts', 'packages/**/*.test.tsx', 'apps/*/src/**/*.test.ts'],
    execArgv: ['--no-experimental-webstorage'],
  },
  resolve: {
    alias: {
      '@mantine-vue/utils': r('./packages/@mantine-vue/utils/src'),
      '@mantine-vue/hooks': r('./packages/@mantine-vue/hooks/src'),
      '@mantine-vue/core': r('./packages/@mantine-vue/core/src'),
      '@mantine-vue/code-highlight': r('./packages/@mantine-vue/code-highlight/src'),
      '@mantine-vue/contextmenu': r('./packages/@mantine-vue/contextmenu/src'),
      '@mantine-vue/dates': r('./packages/@mantine-vue/dates/src'),
      '@mantine-vue/dropzone': r('./packages/@mantine-vue/dropzone/src'),
      '@mantine-vue/form': r('./packages/@mantine-vue/form/src'),
      '@mantine-vue/carousel': r('./packages/@mantine-vue/carousel/src'),
      '@mantine-vue/charts': r('./packages/@mantine-vue/charts/src'),
      '@mantine-vue/colors-generator': r('./packages/@mantine-vue/colors-generator/src'),
      '@mantine-vue/lightbox': r('./packages/@mantine-vue/lightbox/src'),
      '@mantine-vue/mantine-header': r('./packages/@mantine-vue/mantine-header/src'),
      '@mantine-vue/modals': r('./packages/@mantine-vue/modals/src'),
      '@mantine-vue/notifications': r('./packages/@mantine-vue/notifications/src'),
      '@mantine-vue/nprogress': r('./packages/@mantine-vue/nprogress/src'),
      '@mantine-vue/schedule': r('./packages/@mantine-vue/schedule/src'),
      '@mantine-vue/store': r('./packages/@mantine-vue/store/src'),
      '@mantine-vue/spotlight': r('./packages/@mantine-vue/spotlight/src'),
      '@mantine-vue/table': r('./packages/@mantine-vue/table/src'),
      '@mantine-vue/tiptap': r('./packages/@mantine-vue/tiptap/src'),
      '@mantine-vue/whatsapp-inbox': r('./packages/@mantine-vue/whatsapp-inbox/src'),
    },
  },
})
