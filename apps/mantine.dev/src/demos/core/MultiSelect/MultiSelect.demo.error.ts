import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    label="Boolean error"
    placeholder="Boolean error"
    error
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
  <MultiSelect
    mt="md"
    label="With error message"
    placeholder="With error message"
    error="Invalid name"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(MultiSelect, {
        label: 'Boolean error',
        placeholder: 'Boolean error',
        error: true,
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
      h(MultiSelect, {
        mt: 'md',
        label: 'With error message',
        placeholder: 'With error message',
        error: 'Invalid name',
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
