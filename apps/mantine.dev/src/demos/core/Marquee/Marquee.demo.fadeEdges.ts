import { defineComponent, h } from 'vue'
import { Badge, Marquee, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Badge, Marquee, Stack, Text } from '@mantine-vue/core'
</script>

<template>
  <Stack>
    <div>
      <Text size="sm" mb="xs">Default fade (5%)</Text>
      <Marquee>
        <Badge color="blue" size="xl" radius="sm">Blue</Badge>
        <Badge color="cyan" size="xl" radius="sm">Cyan</Badge>
        <Badge color="teal" size="xl" radius="sm">Teal</Badge>
        <Badge color="green" size="xl" radius="sm">Green</Badge>
      </Marquee>
    </div>

    <div>
      <Text size="sm" mb="xs">Larger fade (15%)</Text>
      <Marquee fadeEdgeSize="15%">
        <Badge color="lime" size="xl" radius="sm">Lime</Badge>
        <Badge color="yellow" size="xl" radius="sm">Yellow</Badge>
        <Badge color="orange" size="xl" radius="sm">Orange</Badge>
        <Badge color="red" size="xl" radius="sm">Red</Badge>
      </Marquee>
    </div>

    <div>
      <Text size="sm" mb="xs">Custom fade color</Text>
      <Marquee fadeEdgeColor="var(--mantine-color-blue-light)">
        <Badge color="violet" size="xl" radius="sm">Violet</Badge>
        <Badge color="grape" size="xl" radius="sm">Grape</Badge>
        <Badge color="pink" size="xl" radius="sm">Pink</Badge>
        <Badge color="red" size="xl" radius="sm">Red</Badge>
      </Marquee>
    </div>

    <div>
      <Text size="sm" mb="xs">No fade</Text>
      <Marquee :fadeEdges="false">
        <Badge color="blue" size="xl" radius="sm">Blue</Badge>
        <Badge color="teal" size="xl" radius="sm">Teal</Badge>
        <Badge color="green" size="xl" radius="sm">Green</Badge>
        <Badge color="yellow" size="xl" radius="sm">Yellow</Badge>
      </Marquee>
    </div>
  </Stack>
</template>
`

const Demo = defineComponent({
  name: 'MarqueeFadeEdgesDemo',
  setup() {
    const section = (label: string, colors: string[], props: Record<string, any> = {}) =>
      h('div', {}, [
        h(Text, { size: 'sm', mb: 'xs' }, { default: () => label }),
        h(Marquee, props, {
          default: () =>
            colors.map((color) =>
              h(
                Badge,
                { key: color, color, size: 'xl', radius: 'sm' },
                { default: () => color.charAt(0).toUpperCase() + color.slice(1) },
              ),
            ),
        }),
      ])

    return () =>
      h(
        Stack,
        {},
        {
          default: () => [
            section('Default fade (5%)', ['blue', 'cyan', 'teal', 'green']),
            section('Larger fade (15%)', ['lime', 'yellow', 'orange', 'red'], {
              fadeEdgeSize: '15%',
            }),
            section('Custom fade color', ['violet', 'grape', 'pink', 'red'], {
              fadeEdgeColor: 'var(--mantine-color-blue-light)',
            }),
            section('No fade', ['blue', 'teal', 'green', 'yellow'], { fadeEdges: false }),
          ],
        },
      )
  },
})

export const fadeEdges: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
