import { defineComponent, h } from 'vue'
import { AspectRatio, Overlay } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AspectRatio, Overlay } from '@mantine-vue/core'
</script>

<template>
  <AspectRatio :ratio="16 / 9" :maw="400" mx="auto" pos="relative">
    <img
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png"
      alt="Demo"
    />
    <Overlay color="#000" :background-opacity="0.35"{{props}} />
  </AspectRatio>
</template>
`

const Wrapper = defineComponent({
  name: 'OverlayBlurDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        AspectRatio,
        { ratio: 16 / 9, maw: 400, mx: 'auto', pos: 'relative' },
        {
          default: () => [
            h('img', {
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
              alt: 'Demo',
            }),
            h(Overlay, { color: '#000', backgroundOpacity: 0.35, ...(attrs as any) }),
          ],
        },
      )
  },
})

export const blur: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  controls: [
    { type: 'number', prop: 'blur', initialValue: 15, libraryValue: null as any, min: 0, max: 30 },
  ],
}
