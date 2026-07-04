import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider :default-value="[20, 60]" disabled />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderDisabledDemo',
  setup: () => () => h(RangeSlider, { defaultValue: [20, 60], disabled: true }),
})

export const disabled: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 340,
}
