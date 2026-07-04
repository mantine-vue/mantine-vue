import { defineComponent, h } from 'vue'
import { AspectRatio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AspectRatio } from '@mantine-vue/core'
</script>

<template>
  <AspectRatio :ratio="1080 / 720" maw="300" mx="auto">
    <img
      src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png"
      alt="Panda"
    />
  </AspectRatio>
</template>
`

const Demo = defineComponent({
  name: 'AspectRatioImageDemo',
  setup() {
    return () =>
      h(
        AspectRatio,
        { ratio: 1080 / 720, maw: 300, mx: 'auto' },
        {
          default: () =>
            h('img', {
              src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
              alt: 'Panda',
            }),
        },
      )
  },
})

export const image: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
