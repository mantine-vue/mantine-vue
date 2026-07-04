import { defineComponent, h } from 'vue'
import { Loader, defaultLoaders } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

// SVG ring loader using --loader-size and --loader-color CSS variables
const RingLoader = defineComponent({
  name: 'RingLoader',
  props: { size: [String, Number] },
  setup() {
    return () =>
      h(
        'svg',
        {
          style: {
            width: 'var(--loader-size)',
            height: 'var(--loader-size)',
            animation: 'loader-spin 0.8s linear infinite',
          },
          viewBox: '0 0 45 45',
          xmlns: 'http://www.w3.org/2000/svg',
          stroke: 'var(--loader-color)',
        },
        [
          h(
            'g',
            {
              fill: 'none',
              'fill-rule': 'evenodd',
              transform: 'translate(1 1)',
              'stroke-width': '2',
            },
            [
              h('circle', { cx: '22', cy: '22', r: '6', 'stroke-opacity': '.5' }),
              h('path', { d: 'M22 16c0-3.314-2.686-6-6-6' }),
            ],
          ),
        ],
      )
  },
})

const code = `
<script setup lang="ts">
import { Loader, defaultLoaders } from '@mantine-vue/core'

// Custom SVG ring loader using --loader-size and --loader-color variables
const RingLoader = defineComponent({
  setup: () => () => h('svg', {
    style: { width: 'var(--loader-size)', height: 'var(--loader-size)', animation: 'loader-spin 0.8s linear infinite' },
    viewBox: '0 0 45 45', xmlns: 'http://www.w3.org/2000/svg', stroke: 'var(--loader-color)',
  }, [...]),
})
</script>

<template>
  <Loader :loaders="{ ...defaultLoaders, ring: RingLoader }" type="ring" />
</template>
`

const Demo = defineComponent({
  name: 'LoaderCustomTypeDemo',
  setup() {
    const customLoaders = { ...defaultLoaders, ring: RingLoader }
    return () => h(Loader, { loaders: customLoaders, type: 'ring' as any })
  },
})

export const customType: MantineDemo = {
  type: 'code',
  component: Demo,
  centered: true,
  code,
}
