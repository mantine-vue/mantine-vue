import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { Textarea } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { Textarea } from '@mantine-vue/core'
</script>

<template>
  <Textarea
    label="Label"
    placeholder="Textarea"
    description="Description"
    error="Error"
    with-asterisk
    :left-section="h(PhAt, { size: 18 })"
    autosize
    {{props}}
  />
</template>
`

const Demo = defineComponent({
  name: 'TextareaStylesApiDemo',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(Textarea, {
        label: 'Label',
        placeholder: 'Textarea',
        description: 'Description',
        error: 'Error',
        withAsterisk: true,
        leftSection: h(PhAt, { size: 18 }),
        autosize: true,
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
