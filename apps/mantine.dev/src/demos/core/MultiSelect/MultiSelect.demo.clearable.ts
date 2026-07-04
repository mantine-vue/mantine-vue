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
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :default-value="['React']"
    clearable
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectClearableDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      defaultValue: ['React'],
      clearable: true,
    }),
})

export const clearable: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
