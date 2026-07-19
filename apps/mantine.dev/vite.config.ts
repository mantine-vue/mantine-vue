import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mdx from '@mdx-js/rollup'
import rehypeSlug from 'rehype-slug'

const alias = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [
    // MDX must run before the Vue plugin. `jsxImportSource: 'vue'` makes MDX emit
    // calls to `vue/jsx-runtime`, so .mdx files compile straight to Vue components.
    {
      enforce: 'pre',
      ...mdx({
        jsxImportSource: 'vue',
        rehypePlugins: [rehypeSlug],
      }),
    },
    vue(),
  ],
  resolve: {
    alias: {
      '@': alias('./src'),
      // More specific subpath alias must come before the package alias below.
      '@mantine-vue/core/styles.css': alias('../../packages/@mantine-vue/core/src/styles.css'),
      '@mantine-vue/core': alias('../../packages/@mantine-vue/core/src/index.ts'),
      '@mantine-vue/code-highlight': alias(
        '../../packages/@mantine-vue/code-highlight/src/index.ts',
      ),
      '@mantine-vue/dates': alias('../../packages/@mantine-vue/dates/src/index.ts'),
      '@mantine-vue/colors-generator': alias(
        '../../packages/@mantine-vue/colors-generator/src/index.ts',
      ),
      '@mantine-vue/hooks': alias('../../packages/@mantine-vue/hooks/src/index.ts'),
      '@mantine-vue/mantine-header': alias(
        '../../packages/@mantine-vue/mantine-header/src/index.ts',
      ),
      '@mantine-vue/utils': alias('../../packages/@mantine-vue/utils/src/index.ts'),
      '@mantine-vue/store': alias('../../packages/@mantine-vue/store/src/index.ts'),
      '@mantine-vue/form': alias('../../packages/@mantine-vue/form/src/index.ts'),
      '@mantine-vue/dropzone': alias('../../packages/@mantine-vue/dropzone/src/index.ts'),
      '@mantine-vue/carousel': alias('../../packages/@mantine-vue/carousel/src/index.ts'),
      '@mantine-vue/schedule': alias('../../packages/@mantine-vue/schedule/src/index.ts'),
      '@mantine-vue/charts/styles.css': alias('../../packages/@mantine-vue/charts/src/styles.css'),
      '@mantine-vue/charts': alias('../../packages/@mantine-vue/charts/src/index.ts'),
      '@mantine-vue/modals': alias('../../packages/@mantine-vue/modals/src/index.ts'),
      '@mantine-vue/notifications': alias('../../packages/@mantine-vue/notifications/src/index.ts'),
      '@mantine-vue/nprogress': alias('../../packages/@mantine-vue/nprogress/src/index.ts'),
      '@mantine-vue/spotlight': alias('../../packages/@mantine-vue/spotlight/src/index.ts'),
      '@mantine-vue/table/styles.css': alias('../../packages/@mantine-vue/table/styles.css'),
      '@mantine-vue/table': alias('../../packages/@mantine-vue/table/src/index.ts'),
      '@mantine-vue/tiptap': alias('../../packages/@mantine-vue/tiptap/src/index.ts'),
      'vue/jsx-runtime': alias('./src/mdx-jsx-runtime.ts'),
      'vue/jsx-dev-runtime': alias('./src/mdx-jsx-runtime.ts'),
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
  server: { port: 4174, strictPort: true },
  preview: { port: 4174, strictPort: true },
})
