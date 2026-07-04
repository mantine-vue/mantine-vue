import { defineComponent, h } from 'vue'
import { TextInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { TextInput } from '@mantine-vue/core'
</script>

<template>
  <TextInput disabled label="Disabled input" placeholder="Disabled input" />
</template>
`

const Demo = defineComponent({
  name: 'TextInputDisabledDemo',
  setup: () => () =>
    h(TextInput, { disabled: true, label: 'Disabled input', placeholder: 'Disabled input' }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
