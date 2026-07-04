import { defineComponent, h } from 'vue'
import { Image } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Image } from '@mantine-vue/core'
</script>

<template>
  <Image
    radius="md"
    :src="null"
    :h="200"
    fallbackSrc="https://placehold.co/600x400?text=Placeholder"
  />
</template>
`

const Demo = defineComponent({
  name: 'ImageFallbackDemo',
  setup() {
    return () =>
      h(Image, {
        radius: 'md',
        src: null,
        h: 200,
        fallbackSrc: 'https://placehold.co/600x400?text=Placeholder',
      })
  },
})

export const fallback: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
