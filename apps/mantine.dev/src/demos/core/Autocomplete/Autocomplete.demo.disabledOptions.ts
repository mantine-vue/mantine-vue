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
    :data="[
      { value: 'React' },
      { value: 'Angular' },
      { value: 'Vue', disabled: true },
      { value: 'Svelte', disabled: true },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteDisabledOptionsDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      data: [
        { value: 'React' },
        { value: 'Angular' },
        { value: 'Vue', disabled: true },
        { value: 'Svelte', disabled: true },
      ],
    }),
})

export const disabledOptions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
