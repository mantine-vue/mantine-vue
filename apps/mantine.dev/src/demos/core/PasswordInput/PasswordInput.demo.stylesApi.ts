import { defineComponent, h } from 'vue'
import { PhLock } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhLock } from '@phosphor-icons/vue'
import { PasswordInput } from '@mantine-vue/core'
</script>

<template>
  <PasswordInput
    label="Label"
    placeholder="PasswordInput"
    description="Description"
    error="Error"
    withAsterisk
    {{props}}
  >
    <template #leftSection>
      <PhLock :size="18" />
    </template>
  </PasswordInput>
</template>
`

const Wrapper = defineComponent({
  name: 'PasswordInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(PasswordInput, {
        label: 'Label',
        placeholder: 'PasswordInput',
        description: 'Description',
        error: 'Error',
        withAsterisk: true,
        leftSection: h(PhLock, { size: 18 }),
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
      { selector: 'innerInput', description: 'Inner input element (inside wrapper)' },
      { selector: 'section', description: 'Left and right sections' },
      { selector: 'visibilityToggle', description: 'Visibility toggle button' },
    ],
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
