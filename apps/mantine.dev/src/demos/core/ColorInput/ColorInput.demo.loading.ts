import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput placeholder="Pick color" loading />
</template>
`

const Demo = defineComponent({
  name: 'ColorInputLoadingDemo',
  setup: () => () => h(ColorInput, { placeholder: 'Pick color', loading: true }),
})

export const loading: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
