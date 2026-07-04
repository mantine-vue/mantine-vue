import { defineComponent, h } from 'vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    {{props}}
    :data="['React', 'Angular', 'Svelte', 'Vue']"
    :dropdown-opened="true"
    :pb="150"
    label="Control check icon"
    placeholder="Pick value"
    :default-value="['React']"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectCheckIconDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(MultiSelect, {
        data: ['React', 'Angular', 'Svelte', 'Vue'],
        dropdownOpened: true,
        pb: 150,
        label: 'Control check icon',
        placeholder: 'Pick value',
        defaultValue: ['React'],
        ...attrs,
      })
  },
})

export const checkIcon: MantineDemo = {
  type: 'configurator',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
  controls: [
    { type: 'boolean', prop: 'withCheckIcon', initialValue: true, libraryValue: true },
    { type: 'boolean', prop: 'withAlignedLabels', initialValue: false, libraryValue: false },
    {
      type: 'segmented',
      prop: 'checkIconPosition',
      initialValue: 'left',
      libraryValue: null,
      data: ['left', 'right'],
    },
  ],
}
