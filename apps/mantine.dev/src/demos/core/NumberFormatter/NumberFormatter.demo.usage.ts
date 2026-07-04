import { defineComponent, h } from 'vue'
import { NumberFormatter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberFormatter } from '@mantine-vue/core'
</script>

<template>
  <NumberFormatter prefix="$ " :value="1000000" thousandSeparator />
</template>
`

const Demo = defineComponent({
  name: 'NumberFormatterUsageDemo',
  setup() {
    return () => h(NumberFormatter, { prefix: '$ ', value: 1000000, thousandSeparator: true })
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
