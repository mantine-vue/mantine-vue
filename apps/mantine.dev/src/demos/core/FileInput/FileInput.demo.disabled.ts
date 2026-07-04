import { defineComponent, h } from 'vue'
import { FileInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { FileInput } from '@mantine-vue/core'
</script>

<template>
  <FileInput disabled label="Disabled input" placeholder="Disabled input" />
</template>
`

const Demo = defineComponent({
  name: 'FileInputDisabledDemo',
  setup: () => () =>
    h(FileInput, { disabled: true, label: 'Disabled input', placeholder: 'Disabled input' }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  maxWidth: 340,
  centered: true,
  code,
}
