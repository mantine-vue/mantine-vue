import { defineComponent, h } from 'vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    label="Opens on focus"
    placeholder="Pick value"
    searchable
    open-on-focus
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
  <Select
    label="Does not open on focus"
    placeholder="Pick value"
    searchable
    :open-on-focus="false"
    :data="['React', 'Angular', 'Vue', 'Svelte']"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectOpenOnFocusDemo',
  setup: () => () =>
    h('div', null, [
      h(Select, {
        label: 'Opens on focus',
        placeholder: 'Pick value',
        searchable: true,
        openOnFocus: true,
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
      h(Select, {
        label: 'Does not open on focus',
        placeholder: 'Pick value',
        searchable: true,
        openOnFocus: false,
        data: ['React', 'Angular', 'Vue', 'Svelte'],
      }),
    ]),
})

export const openOnFocus: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
}
