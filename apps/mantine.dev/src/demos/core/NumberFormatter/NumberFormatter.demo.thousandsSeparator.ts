import { defineComponent, h } from 'vue'
import { NumberFormatter } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { NumberFormatter } from '@mantine-vue/core'
</script>

<template>
  <div>
    <div>With default separator: <NumberFormatter thousandSeparator :value="1000000" /></div>
    <div>
      With custom separator:
      <NumberFormatter thousandSeparator="." decimalSeparator="," :value="1000000" />
    </div>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'NumberFormatterThousandsSeparatorDemo',
  setup() {
    return () =>
      h('div', [
        h('div', [
          'With default separator: ',
          h(NumberFormatter, { thousandSeparator: true, value: 1000000 }),
        ]),
        h('div', [
          'With custom separator: ',
          h(NumberFormatter, { thousandSeparator: '.', decimalSeparator: ',', value: 1000000 }),
        ]),
      ])
  },
})

export const thousandsSeparator: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
