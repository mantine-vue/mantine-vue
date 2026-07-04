import { defineComponent, h } from 'vue'
import { Badge, Marquee, Stack } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Marquee, Stack } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <Marquee>
      <Badge color="blue" size="lg" radius="sm">Blue</Badge>
      <Badge color="cyan" size="lg" radius="sm">Cyan</Badge>
      <Badge color="teal" size="lg" radius="sm">Teal</Badge>
      <Badge color="green" size="lg" radius="sm">Green</Badge>
    </Marquee>
    <Marquee reverse>
      <Badge color="lime" size="lg" radius="sm">Lime</Badge>
      <Badge color="yellow" size="lg" radius="sm">Yellow</Badge>
      <Badge color="orange" size="lg" radius="sm">Orange</Badge>
      <Badge color="red" size="lg" radius="sm">Red</Badge>
    </Marquee>
  </Stack>
</template>
`

const colorsA = ['blue', 'cyan', 'teal', 'green']
const colorsB = ['lime', 'yellow', 'orange', 'red']

const Demo = defineComponent({
  name: 'MarqueeMultipleRowsDemo',
  setup() {
    return () =>
      h(
        Stack,
        {},
        {
          default: () => [
            h(
              Marquee,
              {},
              {
                default: () =>
                  colorsA.map((color) =>
                    h(
                      Badge,
                      { key: color, color, size: 'lg', radius: 'sm' },
                      { default: () => color.charAt(0).toUpperCase() + color.slice(1) },
                    ),
                  ),
              },
            ),
            h(
              Marquee,
              { reverse: true },
              {
                default: () =>
                  colorsB.map((color) =>
                    h(
                      Badge,
                      { key: color, color, size: 'lg', radius: 'sm' },
                      { default: () => color.charAt(0).toUpperCase() + color.slice(1) },
                    ),
                  ),
              },
            ),
          ],
        },
      )
  },
})

export const multipleRows: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: '100%',
}
