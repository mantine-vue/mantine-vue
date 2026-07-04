import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    label="Your favorite libraries"
    placeholder="Select up to 2 libraries"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :max-values="2"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectMaxValuesDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Select up to 2 libraries',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      maxValues: 2,
    }),
})

export const maxValues: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
