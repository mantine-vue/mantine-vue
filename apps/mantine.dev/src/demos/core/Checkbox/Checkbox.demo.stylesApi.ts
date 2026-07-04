import { defineComponent, h } from 'vue'
import { Checkbox } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Checkbox } from '@mantine-vue/core'
</script>

<template>
  <Checkbox
    label="Checkbox"
    description="Checkbox description"
    error="Checkbox error"
    defaultChecked
    {{props}}
  />
</template>
`

const Wrapper = defineComponent({
  name: 'CheckboxStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Checkbox, {
        label: 'Checkbox',
        description: 'Checkbox description',
        error: 'Checkbox error',
        defaultChecked: true,
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'body', description: 'Contains label, description, error and input' },
      { selector: 'inner', description: 'Contains input and icon' },
      { selector: 'input', description: 'Input element' },
      { selector: 'icon', description: 'Check/indeterminate icon' },
      { selector: 'labelWrapper', description: 'Contains label, description and error' },
      { selector: 'label', description: 'Label element' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
}
