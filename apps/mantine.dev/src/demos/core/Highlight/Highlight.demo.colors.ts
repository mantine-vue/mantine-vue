import { defineComponent, h } from 'vue'
import { Highlight } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Highlight } from '@mantine-vue/core'
</script>

<template>
  <Highlight
    :highlight="[
      { text: 'error', color: 'red' },
      { text: 'warning', color: 'yellow' },
      { text: 'success', color: 'green' },
    ]"
  >
    Error: Invalid input. Warning: Check this field. Success: All tests passed.
  </Highlight>
</template>
`

const Demo = defineComponent({
  name: 'HighlightColorsDemo',
  setup() {
    return () =>
      h(
        Highlight,
        {
          highlight: [
            { text: 'error', color: 'red' },
            { text: 'warning', color: 'yellow' },
            { text: 'success', color: 'green' },
          ],
        },
        {
          default: () =>
            'Error: Invalid input. Warning: Check this field. Success: All tests passed.',
        },
      )
  },
})

export const colors: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
