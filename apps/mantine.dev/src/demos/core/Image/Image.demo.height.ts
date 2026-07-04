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
    :h="200"
    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png"
  />
</template>
`

const Demo = defineComponent({
  name: 'ImageHeightDemo',
  setup() {
    return () =>
      h(Image, {
        radius: 'md',
        h: 200,
        src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-10.png',
      })
  },
})

export const height: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
