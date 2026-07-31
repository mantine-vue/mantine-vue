import { defineComponent, h, ref } from 'vue'
import { AlphaSlider, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { AlphaSlider, Text } from '@mantine-vue/core'

const value = ref(0.55)
</script>

<template>
  <Text>Alpha value: {{ value }}</Text>
  <AlphaSlider v-model="value" color="#1c7ed6" />
</template>
`

const Demo = defineComponent({
  name: 'AlphaSliderDemo',
  setup() {
    const value = ref(0.55)
    return () =>
      h('div', [
        h(Text, {}, { default: () => `Alpha value: ${value.value}` }),
        h(AlphaSlider, {
          color: '#1c7ed6',
          modelValue: value.value,
          'onUpdate:modelValue': (v: number) => {
            value.value = v
          },
        }),
      ])
  },
})

export const alphaSlider: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
