import { defineComponent, h } from 'vue'
import { RangeSlider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider } from '@mantine-vue/core'
</script>

<template>
  <RangeSlider :push-on-overlap="false" :default-value="[25, 65]" :min-range="20" />
</template>
`

const Demo = defineComponent({
  name: 'RangeSliderPushOnOverlapDemo',
  setup: () => () => h(RangeSlider, { pushOnOverlap: false, defaultValue: [25, 65], minRange: 20 }),
})

export const pushOnOverlap: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
