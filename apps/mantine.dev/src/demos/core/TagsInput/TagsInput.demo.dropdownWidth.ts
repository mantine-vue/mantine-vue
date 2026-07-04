import { defineComponent, h } from 'vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    :combobox-props="{ width: 200, position: 'bottom-start' }"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputDropdownWidthDemo',
  setup: () => () =>
    h(TagsInput, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      comboboxProps: { width: 200, position: 'bottom-start' },
    }),
})

export const dropdownWidth: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
