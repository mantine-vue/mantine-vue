import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput disallowInput placeholder="Pick color" label="Your favorite color" />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputDisallowInputDemo',
  setup: () => () =>
    h(ColorInput, {
      maw: 320,
      mx: 'auto',
      disallowInput: true,
      placeholder: 'Pick color',
      label: 'Your favorite color',
    }),
})

export const disallowInput: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
