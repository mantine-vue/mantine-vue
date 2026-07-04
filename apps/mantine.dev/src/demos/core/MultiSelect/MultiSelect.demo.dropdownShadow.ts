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
    placeholder="Pick values"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ shadow: 'md' }"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectDropdownShadowDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick values',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      comboboxProps: { shadow: 'md' },
    }),
})

export const dropdownShadow: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
