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
    :combobox-props="{ transitionProps: { transition: 'pop', duration: 200 } }"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectDropdownAnimationDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick values',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      comboboxProps: { transitionProps: { transition: 'pop', duration: 200 } },
    }),
})

export const dropdownAnimation: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
