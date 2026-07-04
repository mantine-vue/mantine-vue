import { defineComponent, h } from 'vue'
import { JsonInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { JsonInput } from '@mantine-vue/core'
</script>

<template>
  <JsonInput
    label="Your package.json"
    placeholder="Textarea will autosize to fit the content"
    validationError="Invalid JSON"
    formatOnBlur
    autosize
    :minRows="4"
  />
</template>
`

const Demo = defineComponent({
  name: 'JsonInputUsageDemo',
  setup: () => () =>
    h(JsonInput, {
      maw: 400,
      mx: 'auto',
      label: 'Your package.json',
      placeholder: 'Textarea will autosize to fit the content',
      validationError: 'Invalid JSON',
      formatOnBlur: true,
      autosize: true,
      minRows: 4,
    }),
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
