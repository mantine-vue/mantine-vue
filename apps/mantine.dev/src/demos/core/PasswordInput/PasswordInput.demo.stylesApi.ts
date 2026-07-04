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
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element',
      innerInput: 'Inner input element (inside wrapper)',
      section: 'Left and right sections',
      visibilityToggle: 'Visibility toggle button',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
