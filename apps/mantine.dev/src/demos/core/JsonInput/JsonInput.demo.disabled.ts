import { defineComponent, h } from 'vue'
import { JsonInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { JsonInput } from '@mantine-vue/core'
</script>

<template>
  <JsonInput disabled defaultValue='{ "a": 1, "B": 2 }' label="Disabled" placeholder="Disabled" />
</template>
`

const Demo = defineComponent({
  name: 'JsonInputDisabledDemo',
  setup: () => () =>
    h(JsonInput, {
      disabled: true,
      defaultValue: '{ "a": 1, "B": 2 }',
      label: 'Disabled',
      placeholder: 'Disabled',
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
  centered: true,
  maxWidth: 340,
}
