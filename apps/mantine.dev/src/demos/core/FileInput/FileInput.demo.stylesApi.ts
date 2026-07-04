import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput
    label="Label"
    placeholder="FileInput"
    description="Description"
    error="Error"
    withAsterisk
    {{props}}
  >
    <template #leftSection>
      <PhAt :size="18" />
    </template>
  </FileInput>
</template>
`

const Wrapper = defineComponent({
  name: 'FileInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(FileInput, {
        label: 'Label',
        placeholder: 'FileInput',
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
    selectors: [
      { selector: 'root', description: 'Root element' },
      { selector: 'label', description: 'Label element' },
      { selector: 'required', description: 'Required asterisk element, rendered inside label' },
      { selector: 'description', description: 'Description element' },
      { selector: 'error', description: 'Error element' },
      { selector: 'wrapper', description: 'Root element of the Input' },
      { selector: 'input', description: 'Input element' },
      { selector: 'section', description: 'Left and right sections' },
      { selector: 'placeholder', description: 'Placeholder text' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
