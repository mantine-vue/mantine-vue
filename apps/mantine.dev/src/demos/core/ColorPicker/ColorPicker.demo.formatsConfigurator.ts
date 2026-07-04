import { defineComponent, h, ref, watch } from 'vue'
import { ColorPicker, Stack, Text } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorPicker } from '@mantine-vue/core'
</script>

<template>
  <ColorPicker{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorPickerFormatsConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const value = ref('#C5D899')
    watch(
      () => (attrs as any).format,
      () => {
        value.value = '#C5D899'
      },
    )
    return () =>
      h(
        Stack,
        { align: 'center' },
        {
          default: () => [
            h(ColorPicker, {
              value: value.value,
              onChange: (v: string) => {
                value.value = v
              },
              ...attrs,
            }),
            h(Text, {}, { default: () => value.value }),
          ],
        },
      )
  },
})

export const formatsConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [
    {
      prop: 'format',
      type: 'select',
      initialValue: 'hex',
      libraryValue: 'hex',
      data: [
        { value: 'hex', label: 'HEX' },
        { value: 'hexa', label: 'HEXA' },
        { value: 'rgb', label: 'RGB' },
        { value: 'rgba', label: 'RGBA' },
        { value: 'hsl', label: 'HSL' },
        { value: 'hsla', label: 'HSLA' },
      ],
    },
  ],
}
