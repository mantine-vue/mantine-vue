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
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
