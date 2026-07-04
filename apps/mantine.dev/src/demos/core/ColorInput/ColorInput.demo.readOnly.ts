import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput readOnly label="Cannot modify value" defaultValue="#F0FCFE" />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputReadOnlyDemo',
  setup: () => () =>
    h(ColorInput, { readOnly: true, label: 'Cannot modify value', defaultValue: '#F0FCFE' }),
})

export const readOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
