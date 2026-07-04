import { defineComponent, h } from 'vue'
import { Radio } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Radio } from '@mantine-vue/core'
</script>

<template>
  <Radio
    label="Radio"
    description="Radio description"
    error="Radio error"
    default-checked
    {{props}}
  />
</template>
`

const Demo = defineComponent({
  name: 'RadioStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Radio, {
        label: 'Radio',
        description: 'Radio description',
        error: 'Radio error',
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
      radio: 'Input element (input[type="radio"])',
      icon: 'Radio icon, used to display checked icon',
      inner: 'Wrapper for icon and input',
      body: 'Input body, contains all other elements',
      labelWrapper: 'Contains label, description and error',
      label: 'Label element',
      description: 'Description displayed below the label',
      error: 'Error message displayed below the label',
    },
  },
  component: Demo,
  code,
  centered: true,
}
