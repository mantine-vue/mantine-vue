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
    :combobox-props="{ position: 'top', middlewares: { flip: false, shift: false } }"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectDropdownPositionDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      comboboxProps: { position: 'top', middlewares: { flip: false, shift: false } },
    }),
})

export const dropdownPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
