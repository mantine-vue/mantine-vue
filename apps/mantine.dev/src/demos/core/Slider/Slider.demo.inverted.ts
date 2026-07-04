import { defineComponent, h } from 'vue'
import { Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Slider } from '@mantine-vue/core'
</script>

<template>
  <Slider inverted :default-value="80" />
</template>
`

const Demo = defineComponent({
  name: 'SliderInvertedDemo',
  setup: () => () => h(Slider, { inverted: true, defaultValue: 80 }),
})

export const inverted: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
