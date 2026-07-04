import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { TagsInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { TagsInput } from '@mantine-vue/core'
</script>

<template>
  <TagsInput
    {{props}}
    :left-section="h(PhAt, { size: 18 })"
    label="TagsInput"
    description="Description"
    error="Error"
    placeholder="TagsInput"
    :default-value="['First', 'Second']"
    :data="['React', 'Angular']"
  />
</template>
`

const Demo = defineComponent({
  name: 'TagsInputStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(TagsInput, {
        dropdownOpened: true,
        leftSection: h(PhAt, { size: 18 }),
        withAsterisk: true,
        label: 'TagsInput',
        description: 'Description',
        placeholder: 'TagsInput',
        defaultValue: ['First', 'Second'],
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
      pill: 'Pill element',
      pillsList: 'List of pills and input',
      inputField: 'Input field',
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
