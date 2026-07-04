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
    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png"
  />
</template>
`

const Demo = defineComponent({
  name: 'ImageUsageDemo',
  setup() {
    return () =>
      h(Image, {
        radius: 'md',
        src: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-7.png',
      })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
