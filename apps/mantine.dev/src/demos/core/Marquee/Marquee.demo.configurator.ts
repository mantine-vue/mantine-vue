import { defineComponent, h } from 'vue'
import { Badge, Marquee } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Marquee } from '@mantine-vue/core'
</script>

<template>
  <Marquee{{props}} :mah="200" :maw="400">
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

const Wrapper = defineComponent({
  name: 'MarqueeConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        Marquee,
        { mah: 200, maw: 400, ...(attrs as any) },
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

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 400,
  controls: [
    { prop: 'reverse', type: 'boolean', initialValue: false, libraryValue: false },
    { prop: 'pauseOnHover', type: 'boolean', initialValue: false, libraryValue: false },
    {
      prop: 'orientation',
      type: 'segmented',
      data: ['horizontal', 'vertical'],
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
    },
    { prop: 'repeat', type: 'number', min: 1, max: 10, initialValue: 4, libraryValue: 4 },
    {
      prop: 'duration',
      type: 'number',
      min: 5000,
      max: 100000,
      step: 1000,
      initialValue: 40000,
      libraryValue: 40000,
    },
    { prop: 'gap', type: 'size', initialValue: 'md', libraryValue: 'md' },
    { prop: 'fadeEdges', type: 'boolean', initialValue: true, libraryValue: true },
  ],
}
