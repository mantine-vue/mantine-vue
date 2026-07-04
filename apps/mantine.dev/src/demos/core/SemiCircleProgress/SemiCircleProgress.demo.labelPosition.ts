import { defineComponent, h } from 'vue'
import { SemiCircleProgress } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { SemiCircleProgress } from '@mantine-vue/core'
</script>

<template>
  <SemiCircleProgress :value="30" label="Bottom" mb="xl" />
  <SemiCircleProgress :value="30" label="Center" labelPosition="center" />
</template>
`

const Demo = defineComponent({
  name: 'SemiCircleProgressLabelPositionDemo',
  setup() {
    return () =>
      h('div', [
        h(SemiCircleProgress, { value: 30, label: 'Bottom', mb: 'xl' }),
        h(SemiCircleProgress, { value: 30, label: 'Center', labelPosition: 'center' }),
      ])
  },
})

export const labelPosition: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
