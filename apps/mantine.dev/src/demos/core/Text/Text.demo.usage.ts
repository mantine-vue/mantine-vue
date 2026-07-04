import { defineComponent, h } from 'vue'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Text } from '@mantine-vue/core'
</script>

<template>
  <Text size="xs">Extra small text</Text>
  <Text size="sm">Small text</Text>
  <Text size="md">Default text</Text>
  <Text size="lg">Large text</Text>
  <Text size="xl">Extra large text</Text>
  <Text :fw="500">Semibold</Text>
  <Text :fw="700">Bold</Text>
  <Text fs="italic">Italic</Text>
  <Text td="underline">Underlined</Text>
  <Text td="line-through">Strikethrough</Text>
  <Text c="dimmed">Dimmed text</Text>
  <Text c="blue">Blue text</Text>
  <Text c="teal.4">Teal 4 text</Text>
  <Text tt="uppercase">Uppercase</Text>
  <Text tt="capitalize">capitalized text</Text>
  <Text ta="center">Aligned to center</Text>
  <Text ta="right">Aligned to right</Text>
</template>
`

const Demo = defineComponent({
  name: 'TextUsageDemo',
  setup() {
    return () => [
      h(Text, { size: 'xs' }, { default: () => 'Extra small text' }),
      h(Text, { size: 'sm' }, { default: () => 'Small text' }),
      h(Text, { size: 'md' }, { default: () => 'Default text' }),
      h(Text, { size: 'lg' }, { default: () => 'Large text' }),
      h(Text, { size: 'xl' }, { default: () => 'Extra large text' }),
      h(Text, { fw: 500 }, { default: () => 'Semibold' }),
      h(Text, { fw: 700 }, { default: () => 'Bold' }),
      h(Text, { fs: 'italic' }, { default: () => 'Italic' }),
      h(Text, { td: 'underline' }, { default: () => 'Underlined' }),
      h(Text, { td: 'line-through' }, { default: () => 'Strikethrough' }),
      h(Text, { c: 'dimmed' }, { default: () => 'Dimmed text' }),
      h(Text, { c: 'blue' }, { default: () => 'Blue text' }),
      h(Text, { c: 'teal.4' }, { default: () => 'Teal 4 text' }),
      h(Text, { tt: 'uppercase' }, { default: () => 'Uppercase' }),
      h(Text, { tt: 'capitalize' }, { default: () => 'capitalized text' }),
      h(Text, { ta: 'center' }, { default: () => 'Aligned to center' }),
      h(Text, { ta: 'right' }, { default: () => 'Aligned to right' }),
    ]
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
