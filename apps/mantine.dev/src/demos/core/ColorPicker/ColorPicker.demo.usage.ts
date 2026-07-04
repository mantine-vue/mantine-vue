import { defineComponent, h, ref } from 'vue'
import { ColorPicker, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ref } from 'vue'
import { ColorPicker, Text } from '@mantine-vue/core'

const value = ref('rgba(47, 119, 150, 0.7)')
</script>

<template>
  <div>
    <ColorPicker format="rgba" v-model="value" />
    <Text mt="md">{{ value }}</Text>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'ColorPickerUsageDemo',
  setup() {
    const value = ref('rgba(47, 119, 150, 0.7)')
    return () =>
      h('div', null, [
        h(ColorPicker, {
          format: 'rgba',
          value: value.value,
          onChange: (v: string) => {
            value.value = v
          },
        }),
        h(Text, { mt: 'md' }, { default: () => value.value }),
      ])
  },
})

export const usage: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
}
