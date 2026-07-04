import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider inverted :default-value="[20, 60]" />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderInvertedDemo',
  setup: () => () => h(RangeSlider, { inverted: true, defaultValue: [20, 60] }),
})

export const inverted: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
