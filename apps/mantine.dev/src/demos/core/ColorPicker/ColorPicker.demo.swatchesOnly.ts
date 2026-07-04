import { defineComponent, h, ref } from 'vue'
import { ColorPicker, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const redShades = ['#fff5f5', '#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252']
const greenShades = ['#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a', '#69db7c', '#51cf66', '#40c057']
const blueShades = ['#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6']
const swatchColors = [...redShades, ...greenShades, ...blueShades]

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker, Text } from '@mantine-vue/core'

const value = ref('#fff')

const swatches = [
  '#fff5f5', '#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252',
  '#ebfbee', '#d3f9d8', '#b2f2bb', '#8ce99a', '#69db7c', '#51cf66', '#40c057',
  '#e7f5ff', '#d0ebff', '#a5d8ff', '#74c0fc', '#4dabf7', '#339af0', '#228be6',
]
</script>

<template>
  <div>
    <ColorPicker
      format="hex"
      v-model="value"
      :withPicker="false"
      fullWidth
      :swatches="swatches"
    />
    <Text ta="center" :mt="5">{{ value }}</Text>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ColorPickerSwatchesOnlyDemo',
  setup() {
    const value = ref('#fff')
    return () =>
      h('div', null, [
        h(ColorPicker, {
          format: 'hex',
          value: value.value,
          onChange: (v: string) => {
            value.value = v
          },
          withPicker: false,
          fullWidth: true,
          swatches: swatchColors,
        }),
        h(Text, { ta: 'center', mt: 5 }, { default: () => value.value }),
      ])
  },
})

export const swatchesOnly: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 220,
}
