import { defineComponent, h } from 'vue'
import { AngleSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AngleSlider } from '@mantine-vue/core'
</script>

<template>
  <AngleSlider aria-label="Angle slider" :format-label="(value) => \`\${value}°\`" />
</template>
`

const Demo = defineComponent({
  name: 'AngleSliderFormatLabelDemo',
  setup: () => () =>
    h(AngleSlider, {
      'aria-label': 'Angle slider',
      formatLabel: (value: number) => `${value}°`,
    }),
})

export const formatLabel: MantineDemo = { type: 'code', component: Demo, code, centered: true }
