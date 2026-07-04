import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Zero padding"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 0 }"
  />
  <Select
    mt="md"
    label="10px padding"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 10 }"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectDropdownPaddingDemo',
  setup: () => () =>
    h('div', null, [
      h(Select, {
        label: 'Zero padding',
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        comboboxProps: { dropdownPadding: 0 },
      }),
      h(Select, {
        mt: 'md',
        label: '10px padding',
        placeholder: 'Pick value',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        comboboxProps: { dropdownPadding: 10 },
      }),
    ]),
})

export const dropdownPadding: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
