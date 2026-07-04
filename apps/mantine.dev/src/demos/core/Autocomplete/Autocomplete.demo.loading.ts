import { defineComponent, h } from 'vue'
import { Autocomplete } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Autocomplete } from '@mantine-vue/core'
</script>

<template>
  <Autocomplete
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    loading
  />
</template>
`

const Demo = defineComponent({
  name: 'AutocompleteLoadingDemo',
  setup: () => () =>
    h(Autocomplete, {
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      loading: true,
    }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
