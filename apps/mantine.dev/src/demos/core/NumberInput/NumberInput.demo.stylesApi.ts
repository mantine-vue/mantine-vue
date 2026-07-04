import { defineComponent, h } from 'vue'
import { PhAt } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhAt } from '@phosphor-icons/vue'
import { NumberInput } from '@mantine-vue/core'
</script>

<template>
  <NumberInput
    label="Label"
    placeholder="NumberInput"
    description="Description"
    error="Error"
    withAsterisk
    {{props}}
  >
    <template #leftSection>
      <PhAt :size="18" />
    </template>
  </NumberInput>
</template>
`

const Wrapper = defineComponent({
  name: 'NumberInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(NumberInput, {
        label: 'Label',
        placeholder: 'NumberInput',
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
      { selector: 'controls', description: 'Increment/decrement controls wrapper' },
      { selector: 'control', description: 'Single increment or decrement control' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
