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
    w="auto"
    fit="contain"
    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png"
  />
</template>
`

const Demo = defineComponent({
  name: 'ImageContainDemo',
  setup() {
    return () =>
      h(Image, {
        radius: 'md',
        h: 200,
        w: 'auto',
        fit: 'contain',
        src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-9.png',
      })
  },
})

export const contain: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
