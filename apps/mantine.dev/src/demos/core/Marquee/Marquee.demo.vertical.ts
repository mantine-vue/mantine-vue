import { defineComponent, h } from 'vue'
import { Badge, Marquee } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Marquee } from '@mantine-vue/core'
</script>

<template>
  <Marquee orientation="vertical" :h="300" gap="lg">
    <Badge color="blue" size="xl" radius="sm">Blue</Badge>
    <Badge color="cyan" size="xl" radius="sm">Cyan</Badge>
    <Badge color="teal" size="xl" radius="sm">Teal</Badge>
    <Badge color="green" size="xl" radius="sm">Green</Badge>
    <Badge color="lime" size="xl" radius="sm">Lime</Badge>
    <Badge color="yellow" size="xl" radius="sm">Yellow</Badge>
    <Badge color="orange" size="xl" radius="sm">Orange</Badge>
    <Badge color="red" size="xl" radius="sm">Red</Badge>
  </Marquee>
</template>
`

const colors = ['blue', 'cyan', 'teal', 'green', 'lime', 'yellow', 'orange', 'red']

const Demo = defineComponent({
  name: 'MarqueeVerticalDemo',
  setup() {
    return () =>
      h(
        Marquee,
        { orientation: 'vertical', h: 300, gap: 'lg' },
        {
          default: () =>
            colors.map((color) =>
              h(
                Badge,
                { key: color, color, size: 'xl', radius: 'sm' },
                { default: () => color.charAt(0).toUpperCase() + color.slice(1) },
              ),
            ),
        },
      )
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
