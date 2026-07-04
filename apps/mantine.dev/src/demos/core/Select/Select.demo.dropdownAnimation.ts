import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Your favorite library"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ transitionProps: { transition: 'pop', duration: 200 } }"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectDropdownAnimationDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
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
