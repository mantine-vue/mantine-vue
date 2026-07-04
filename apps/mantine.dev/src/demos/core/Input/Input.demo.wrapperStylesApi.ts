import { defineComponent, h } from 'vue'
import { Input, InputWrapper } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Input, InputWrapper } from '@mantine-vue/core'
</script>

<template>
  <InputWrapper
    {{props}}
    label="Input label"
    description="Input description"
    error="Input error"
    withAsterisk
  >
    <Input placeholder="Input" />
  </InputWrapper>
</template>
`

const Wrapper = defineComponent({
  name: 'InputWrapperStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(
        InputWrapper,
        {
          label: 'Input label',
          description: 'Input description',
          error: 'Input error',
          withAsterisk: true,
          ...attrs,
        },
        {
          default: () => h(Input, { placeholder: 'Input' }),
        },
      )
  },
})

export const wrapperStylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'label', description: 'Label element' },
      { selector: 'required', description: 'Required asterisk element, rendered inside label' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
