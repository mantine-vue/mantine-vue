import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Zero padding"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 0 }"
  />
  <TagsInput
    mt="md"
    label="10px padding"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ dropdownPadding: 10 }"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDropdownPaddingDemo',
  setup: () => () =>
    h('div', null, [
      h(TagsInput, {
        label: 'Zero padding',
        placeholder: 'Pick value or enter anything',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
        comboboxProps: { dropdownPadding: 0 },
      }),
      h(TagsInput, {
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
