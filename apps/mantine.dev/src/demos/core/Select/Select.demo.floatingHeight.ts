import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <Select
    label="Fits viewport height"
    placeholder="Pick value"
    :data="data"
    floating-height="viewport"
  />
</template>
`

const data = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'SelectFloatingHeightDemo',
  setup: () => () =>
    h(Select, {
      label: 'Fits viewport height',
      placeholder: 'Pick value',
      data,
      floatingHeight: 'viewport',
    }),
})

export const floatingHeight: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
