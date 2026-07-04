import { defineComponent, h } from 'vue'
import { RangeSlider, Slider } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { RangeSlider, Slider } from '@mantine-vue/core'

function valueLabelFormat(value: number) {
  const units = ['KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let scaledValue = value
  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1
    scaledValue /= 1024
  }
  return \`\${scaledValue} \${units[unitIndex]}\`
}

const getScale = (v: number) => 2 ** v
</script>

<template>
  <Slider
    :scale="getScale"
    :step="1"
    :min="2"
    :max="30"
    label-always-on
    :default-value="10"
    :label="valueLabelFormat"
  />
  <RangeSlider
    :mt="50"
    :scale="getScale"
    :step="1"
    :min="2"
    :max="30"
    label-always-on
    :default-value="[10, 20]"
    :label="valueLabelFormat"
  />
</template>
`

function valueLabelFormat(value: number) {
  const units = ['KB', 'MB', 'GB', 'TB']
  let unitIndex = 0
  let scaledValue = value
  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1
    scaledValue /= 1024
  }
  return `${scaledValue} ${units[unitIndex]}`
}

const getScale = (v: number) => 2 ** v

const Demo = defineComponent({
  name: 'SliderScaleDemo',
  setup: () => () =>
    h('div', null, [
      h(Slider, {
        scale: getScale,
        step: 1,
        min: 2,
        max: 30,
        labelAlwaysOn: true,
        defaultValue: 10,
        label: valueLabelFormat,
      }),
      h(RangeSlider, {
        mt: 50,
        scale: getScale,
        step: 1,
        min: 2,
        max: 30,
        labelAlwaysOn: true,
        defaultValue: [10, 20],
        label: valueLabelFormat,
      }),
    ]),
})

export const scale: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 400,
}
