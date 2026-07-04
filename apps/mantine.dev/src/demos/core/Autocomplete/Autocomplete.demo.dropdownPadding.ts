import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    label="Zero padding"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 0 }"
  />
  <Autocomplete
    mt="md"
    label="10px padding"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 10 }"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteDropdownPaddingDemo',
  setup: () => () =>
    h('div', null, [
      h(Autocomplete, {
        label: 'Zero padding',
        placeholder: 'Pick value or enter anything',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        comboboxProps: { dropdownPadding: 0 },
      }),
      h(Autocomplete, {
        mt: 'md',
        label: '10px padding',
        placeholder: 'Pick value or enter anything',
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
