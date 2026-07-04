import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'

const data = Array(100)
  .fill(0)
  .map((_, index) => \`Option \${index}\`)
</script>

<template>
  <Autocomplete
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
  name: 'AutocompleteFloatingHeightDemo',
  setup: () => () =>
    h(Autocomplete, {
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
