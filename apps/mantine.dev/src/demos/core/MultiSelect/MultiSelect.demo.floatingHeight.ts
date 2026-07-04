import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <MultiSelect
    label="Fits viewport height"
    placeholder="Pick values"
    :data="data"
    floating-height="viewport"
  />
</template>
`

const data = Array(100)
  .fill(0)
  .map((_, index) => `Option ${index}`)

const Demo = defineComponent({
  name: 'MultiSelectFloatingHeightDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Fits viewport height',
      placeholder: 'Pick values',
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
