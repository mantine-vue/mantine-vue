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
    auto-select-on-blur
    searchable
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectAutoSelectOnBlurDemo',
  setup: () => () =>
    h(Select, {
      label: 'Your favorite library',
      placeholder: 'Pick value',
      autoSelectOnBlur: true,
      searchable: true,
      data: ['React', 'Angular', 'Vue', 'Svelte'],
    }),
})

export const autoSelectOnBlur: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
