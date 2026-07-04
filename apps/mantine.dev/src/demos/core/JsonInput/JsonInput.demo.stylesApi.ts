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
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'label', description: 'Label element' },
      { selector: 'required', description: 'Required asterisk element, rendered inside label' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
      { selector: 'wrapper', description: 'Root element of the Input' },
      { selector: 'input', description: 'Input element' },
      { selector: 'section', description: 'Left and right sections' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
