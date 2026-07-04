import { defineComponent, h } from 'vue'
import { Divider, Group, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<template>
  <Group>
    <Text>Label</Text>
    <Divider orientation="vertical" />
    <Text>Label</Text>
    <Divider size="sm" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="md" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="lg" orientation="vertical" />
    <Text>Label</Text>
    <Divider size="xl" orientation="vertical" />
    <Text>Label</Text>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'DividerVerticalDemo',
  setup() {
    return () =>
      h(
        Group,
        {},
        {
          default: () => [
            h(Text, {}, { default: () => 'Label' }),
            h(Divider, { orientation: 'vertical' }),
            h(Text, {}, { default: () => 'Label' }),
            h(Divider, { size: 'sm', orientation: 'vertical' }),
            h(Text, {}, { default: () => 'Label' }),
            h(Divider, { size: 'md', orientation: 'vertical' }),
            h(Text, {}, { default: () => 'Label' }),
            h(Divider, { size: 'lg', orientation: 'vertical' }),
            h(Text, {}, { default: () => 'Label' }),
            h(Divider, { size: 'xl', orientation: 'vertical' }),
            h(Text, {}, { default: () => 'Label' }),
          ],
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
