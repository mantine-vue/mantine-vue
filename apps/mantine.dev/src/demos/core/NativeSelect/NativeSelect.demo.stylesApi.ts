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
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element (select)',
      section: 'Left and right sections',
    },
  },
  component: Wrapper,
  centered: true,
  maxWidth: 340,
  code,
}
