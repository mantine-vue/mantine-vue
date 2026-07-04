import { defineComponent, h } from 'vue'
import { Code, Group } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Code, Group } from '@mantine-vue/core'
</script>

<template>
  <Group justify="center">
    <Code color="blue.9" c="white">h('div', {}, 'Hello')</Code>
    <Code color="var(--mantine-color-blue-light)">h('div', {}, 'Hello')</Code>
  </Group>
</template>
`

const Demo = defineComponent({
  name: 'CodeColorsDemo',
  setup() {
    return () =>
      h(
        Group,
        { justify: 'center' },
        {
          default: () => [
            h(Code, { color: 'blue.9', c: 'white' }, { default: () => "h('div', {}, 'Hello')" }),
            h(
              Code,
              { color: 'var(--mantine-color-blue-light)' },
              { default: () => "h('div', {}, 'Hello')" },
            ),
          ],
        },
      )
  },
})

export const colors: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
