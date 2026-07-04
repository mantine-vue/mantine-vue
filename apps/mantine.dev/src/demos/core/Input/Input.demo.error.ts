import { defineComponent, h } from 'vue'
import { PhWarningCircle } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { PhWarningCircle } from '@phosphor-icons/vue'
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <div>
    <TextInput placeholder="Error as boolean" label="Error as boolean" error />
    <TextInput
      mt="md"
      placeholder="Error as node"
      label="Error as node"
      error="Something went wrong"
    />
    <TextInput
      mt="md"
      placeholder="Without error styles on input"
      label="Without error styles on input"
      error="Something went wrong"
      :withErrorStyles="false"
      rightSectionPointerEvents="none"
    >
      <template #rightSection>
        <PhWarningCircle :size="20" color="var(--mantine-color-error)" />
      </template>
    </TextInput>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'InputErrorDemo',
  setup: () => () =>
    h('div', null, [
      h(TextInput, { placeholder: 'Error as boolean', label: 'Error as boolean', error: true }),
      h(TextInput, {
        mt: 'md',
        placeholder: 'Error as node',
        label: 'Error as node',
        error: 'Something went wrong',
      }),
      h(TextInput, {
        mt: 'md',
        placeholder: 'Without error styles on input',
        label: 'Without error styles on input',
        error: 'Something went wrong',
        withErrorStyles: false,
        rightSectionPointerEvents: 'none',
        rightSection: h(PhWarningCircle, { size: 20, color: 'var(--mantine-color-error)' }),
      }),
    ]),
})

export const error: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 340,
  centered: true,
}
