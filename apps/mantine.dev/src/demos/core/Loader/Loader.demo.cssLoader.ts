import { defineComponent, h } from 'vue'
import { Loader, MantineThemeProvider, defaultLoaders } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

// CSS-only custom loader using --loader-size and --loader-color CSS variables
const CssLoader = defineComponent({
  name: 'CssLoader',
  props: { size: [String, Number] },
  setup() {
    return () =>
      h('span', {
        style: {
          display: 'inline-block',
          width: 'var(--loader-size)',
          height: 'var(--loader-size)',
          border: '3px solid transparent',
          borderTopColor: 'var(--loader-color)',
          borderRadius: '50%',
          animation: 'loader-spin 0.6s linear infinite',
        },
      })
  },
})

const code = `
<script setup lang="ts">
import { Loader, MantineThemeProvider, defaultLoaders } from '@mantine-vue/core'

// Custom CSS-only loader using --loader-size and --loader-color variables
const CssLoader = defineComponent({
  setup: () => () => h('span', { style: {
    display: 'inline-block',
    width: 'var(--loader-size)',
    height: 'var(--loader-size)',
    border: '3px solid transparent',
    borderTopColor: 'var(--loader-color)',
    borderRadius: '50%',
    animation: 'loader-spin 0.6s linear infinite',
  }}),
})
</script>

<template>
  <Loader :loaders="{ ...defaultLoaders, custom: CssLoader }" type="custom" />
</template>
`

const Demo = defineComponent({
  name: 'LoaderCssLoaderDemo',
  setup() {
    const customLoaders = { ...defaultLoaders, custom: CssLoader }
    return () => h(Loader, { loaders: customLoaders, type: 'custom' as any })
  },
})

export const cssLoader: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
