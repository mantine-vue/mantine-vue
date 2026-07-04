import { defineComponent, h } from 'vue'
import { AngleSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { AngleSlider } from '@mantine-vue/core'
</script>

<template>
  <AngleSlider aria-label="Angle slider" disabled />
</template>
`

const Demo = defineComponent({
  name: 'AngleSliderDisabledDemo',
  setup: () => () => h(AngleSlider, { 'aria-label': 'Angle slider', disabled: true }),
})

export const disabled: MantineDemo = { type: 'code', component: Demo, code, centered: true }
