import { defineComponent, h } from 'vue'
import { NativeSelect } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NativeSelect } from '@mantine-vue/core'
</script>

<template>
  <NativeSelect
    {{props}}
    :data="['React', 'Angular']"
    label="NativeSelect label"
    description="NativeSelect description"
    error="NativeSelect error"
    withAsterisk
  />
</template>
`

const Wrapper = defineComponent({
  name: 'NativeSelectStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(NativeSelect, {
        data: ['React', 'Angular'],
        label: 'NativeSelect label',
        description: 'NativeSelect description',
        error: 'NativeSelect error',
        withAsterisk: true,
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'label', description: 'Label element' },
      { selector: 'required', description: 'Required asterisk element, rendered inside label' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
      { selector: 'wrapper', description: 'Root element of the Input' },
      { selector: 'input', description: 'Input element (select)' },
      { selector: 'section', description: 'Left and right sections' },
    ],
  },
  component: Wrapper,
  centered: true,
  maxWidth: 340,
  code,
}
