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
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    disabled
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteDisabledDemo',
  setup: () => () =>
    h(Autocomplete, {
      label: 'Your favorite library',
      placeholder: 'Pick value or enter anything',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      disabled: true,
    }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
