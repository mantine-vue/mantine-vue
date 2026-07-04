import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { MultiSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { MultiSelect } from '@mantine-vue/core'
</script>

<template>
  <MultiSelect
    {{props}}
    :left-section="h(PhAt, { size: 18 })"
    label="MultiSelect"
    description="Description"
    error="Error"
    placeholder="MultiSelect"
    :default-value="['React', 'Angular']"
    :data="[
      { group: 'Frontend', items: ['React', 'Angular'] },
      { group: 'Backend', items: ['Node', 'Django'] },
    ]"
  />
</template>
`

const Demo = defineComponent({
  name: 'MultiSelectStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(MultiSelect, {
        dropdownOpened: true,
        leftSection: h(PhAt, { size: 18 }),
        withAsterisk: true,
        label: 'MultiSelect',
        description: 'Description',
        placeholder: 'MultiSelect',
        defaultValue: ['React', 'Angular'],
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
      pill: 'Value pill',
      inputField: 'Input field',
      pillsList: 'List of pills, also contains input field',
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
