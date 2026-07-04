import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'

const largeData = Array(100_000)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <Select
    label="100 000 options autocomplete"
    placeholder="Use limit to optimize performance"
    :limit="5"
    :data="largeData"
    searchable
  />
</template>
`

const largeData = Array(100_000)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'SelectLimitDemo',
  setup: () => () =>
    h(Select, {
      label: '100 000 options autocomplete',
      placeholder: 'Use limit to optimize performance',
      limit: 5,
      data: largeData,
      searchable: true,
    }),
})

export const limit: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
