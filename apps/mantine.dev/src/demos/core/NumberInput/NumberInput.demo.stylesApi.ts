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
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element',
      section: 'Left and right sections',
      controls: 'Increment/decrement controls wrapper',
      control: 'Single increment or decrement control',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
