import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    label="Your favorite libraries"
    placeholder="Pick value"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
    hide-picked-options
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectHidePickedOptionsDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick value',
      data: ['React', 'Angular', 'Vue', 'Svelte'],
      hidePickedOptions: true,
    }),
})

export const hidePickedOptions: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
