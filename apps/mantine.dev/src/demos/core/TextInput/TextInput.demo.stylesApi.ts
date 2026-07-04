import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <TextInput
    label="Label"
    placeholder="TextInput"
    description="Description"
    error="Error"
    with-asterisk
    :left-section="h(PhAt, { size: 18 })"
    {{props}}
  />
</template>
`

const Demo = defineComponent({
  name: 'TextInputStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(TextInput, {
        label: 'Label',
        placeholder: 'TextInput',
        description: 'Description',
        error: 'Error',
        withAsterisk: true,
        leftSection: h(PhAt, { size: 18 }),
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
    },
  },
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
