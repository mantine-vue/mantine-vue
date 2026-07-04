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
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element',
      section: 'Left and right sections',
      placeholder: 'Placeholder text',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
