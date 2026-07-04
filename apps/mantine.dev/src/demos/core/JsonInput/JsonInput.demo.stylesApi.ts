import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { JsonInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { JsonInput } from '@mantine-vue/core'
</script>

<template>
  <JsonInput
    label="Label"
    placeholder="JsonInput"
    description="Description"
    error="Error"
    withAsterisk
    autosize
    {{props}}
  >
    <template #leftSection>
      <PhAt :size="18" />
    </template>
  </JsonInput>
</template>
`

const Wrapper = defineComponent({
  name: 'JsonInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(JsonInput, {
        label: 'Label',
        placeholder: 'JsonInput',
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
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element',
      section: 'Left and right sections',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
