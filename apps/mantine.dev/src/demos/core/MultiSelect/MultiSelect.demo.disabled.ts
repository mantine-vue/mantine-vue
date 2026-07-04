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
    disabled
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectDisabledDemo',
  setup: () => () =>
    h(MultiSelect, {
      label: 'Your favorite libraries',
      placeholder: 'Pick value',
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
