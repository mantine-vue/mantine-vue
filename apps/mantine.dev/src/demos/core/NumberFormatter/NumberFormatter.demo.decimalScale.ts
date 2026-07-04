import { defineComponent, h } from 'vue'
import { NumberFormatter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberFormatter } from '@mantine-vue/core'
</script>

<template>
  <NumberFormatter :value="5 / 3" :decimalScale="2" />
</template>
`

const Demo = defineComponent({
  name: 'NumberFormatterDecimalScaleDemo',
  setup() {
    return () => h(NumberFormatter, { value: 5 / 3, decimalScale: 2 })
  },
})

export const decimalScale: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
