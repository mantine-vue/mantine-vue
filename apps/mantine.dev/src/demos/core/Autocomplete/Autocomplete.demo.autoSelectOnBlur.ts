import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    label="Your favorite library"
    placeholder="Pick value or enter anything"
    auto-select-on-blur
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteAutoSelectOnBlurDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      autoSelectOnBlur: true,
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
