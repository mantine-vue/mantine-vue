import { defineComponent, h } from 'vue'
import { JsonInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { JsonInput } from '@mantine-vue/core'
</script>

<template>
  <JsonInput placeholder="Enter JSON" formatOnBlur autosize :minRows="4" loading />
</template>
`

const Demo = defineComponent({
  name: 'JsonInputLoadingDemo',
  setup: () => () =>
    h(JsonInput, {
      placeholder: 'Enter JSON',
      formatOnBlur: true,
      autosize: true,
      minRows: 4,
      loading: true,
    }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
