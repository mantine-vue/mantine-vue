import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const alias = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/showcase/' : '/',
  build: {
    outDir: '../mantine.dev/dist/showcase',
    emptyOutDir: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': alias('./src'),
      '@mantine-vue/core/styles.css': alias('../../packages/@mantine-vue/core/src/styles.css'),
      '@mantine-vue/core': alias('../../packages/@mantine-vue/core/src/index.ts'),
      '@mantine-vue/code-highlight': alias(
        '../../packages/@mantine-vue/code-highlight/src/index.ts',
      ),
      '@mantine-vue/dates': alias('../../packages/@mantine-vue/dates/src/index.ts'),
      '@mantine-vue/hooks': alias('../../packages/@mantine-vue/hooks/src/index.ts'),
      '@mantine-vue/utils': alias('../../packages/@mantine-vue/utils/src/index.ts'),
      '@mantine-vue/store': alias('../../packages/@mantine-vue/store/src/index.ts'),
      '@mantine-vue/form': alias('../../packages/@mantine-vue/form/src/index.ts'),
      '@mantine-vue/dropzone': alias('../../packages/@mantine-vue/dropzone/src/index.ts'),
      '@mantine-vue/carousel': alias('../../packages/@mantine-vue/carousel/src/index.ts'),
      '@mantine-vue/charts/styles.css': alias('../../packages/@mantine-vue/charts/src/styles.css'),
      '@mantine-vue/charts': alias('../../packages/@mantine-vue/charts/src/index.ts'),
      '@mantine-vue/modals': alias('../../packages/@mantine-vue/modals/src/index.ts'),
      '@mantine-vue/notifications': alias('../../packages/@mantine-vue/notifications/src/index.ts'),
      '@mantine-vue/nprogress': alias('../../packages/@mantine-vue/nprogress/src/index.ts'),
      '@mantine-vue/schedule/styles.css': alias('../../packages/@mantine-vue/schedule/styles.css'),
      '@mantine-vue/schedule': alias('../../packages/@mantine-vue/schedule/src/index.ts'),
      '@mantine-vue/spotlight': alias('../../packages/@mantine-vue/spotlight/src/index.ts'),
      '@mantine-vue/tiptap': alias('../../packages/@mantine-vue/tiptap/src/index.ts'),
    },
  },
  optimizeDeps: {
    include: [
      'echarts/core',
      'echarts/charts',
      'echarts/components',
      'echarts/renderers',
      'vue-echarts',
    ],
  },
  server: { port: 4180, strictPort: true },
  preview: { port: 4180, strictPort: true },
}))
