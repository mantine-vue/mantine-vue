import { defineComponent, h } from 'vue'
import { NumberFormatter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberFormatter } from '@mantine-vue/core'
</script>

<template>
  <div>
    <div>With prefix: <NumberFormatter prefix="$ " :value="100" /></div>
    <div>With suffix: <NumberFormatter :value="100" suffix=" RUB" /></div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'NumberFormatterPrefixSuffixDemo',
  setup() {
    return () =>
      h('div', [
        h('div', ['With prefix: ', h(NumberFormatter, { prefix: '$ ', value: 100 })]),
        h('div', ['With suffix: ', h(NumberFormatter, { value: 100, suffix: ' RUB' })]),
      ])
  },
})

export const prefixSuffix: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
