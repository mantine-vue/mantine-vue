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
    selectors: {
      root: 'Root element',
      body: 'Contains label, description, error and input',
      inner: 'Contains input and icon',
      input: 'Input element',
      icon: 'Check/indeterminate icon',
      labelWrapper: 'Contains label, description and error',
      label: 'Label element',
      description: 'Description element',
      error: 'Error element',
    },
  },
  component: Wrapper,
  code,
  centered: true,
}
