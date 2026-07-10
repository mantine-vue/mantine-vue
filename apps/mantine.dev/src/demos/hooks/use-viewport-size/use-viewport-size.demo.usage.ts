import { defineComponent, h } from 'vue'
import { useViewportSize } from '@mantine-vue/hooks'
import { Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { useViewportSize } from '@mantine-vue/hooks'

const { width, height } = useViewportSize()
</script>

<template>
  <p style="text-align: center;">Width: {{ width }}, height: {{ height }}</p>
</template>
`

const Demo = defineComponent({
  name: 'UseViewportSizeUsageDemo',
  setup() {
    const { width, height } = useViewportSize()

    return () =>
      h(Text, { ta: 'center' }, { default: () => `Width: ${width.value}, height: ${height.value}` })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  code,
  component: Demo,
}
