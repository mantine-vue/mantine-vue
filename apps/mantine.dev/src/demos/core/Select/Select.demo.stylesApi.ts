import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { Select } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { Select } from '@mantine-vue/core'
</script>

<template>
  <Select
    {{props}}
    :left-section="h(PhAt, { size: 18 })"
    label="Select"
    description="Description"
    error="Error"
    placeholder="Select"
    :data="['React', 'Angular']"
  />
</template>
`

const Demo = defineComponent({
  name: 'SelectStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Select, {
        dropdownOpened: true,
        leftSection: h(PhAt, { size: 18 }),
        withAsterisk: true,
        label: 'Select',
        description: 'Description',
        placeholder: 'Select',
        comboboxProps: { hideDetached: false },
        data: [
          { group: 'Frontend', items: ['React', 'Angular'] },
          { group: 'Backend', items: ['Node', 'Django'] },
        ],
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      wrapper: 'Input wrapper',
      input: 'Input element',
      section: 'Left and right sections',
      label: 'Label element',
      required: 'Required asterisk',
      description: 'Description element',
      error: 'Error message',
      dropdown: 'Dropdown root element',
      options: 'Options wrapper',
      option: 'Option',
      group: 'Options group wrapper',
      groupLabel: 'Options group label',
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
