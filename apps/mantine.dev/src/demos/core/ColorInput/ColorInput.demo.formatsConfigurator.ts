import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput defaultValue="#C5D899"{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorInputFormatsConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    const format = (attrs as any).format || 'hex'
    return () =>
      h(ColorInput, {
        maw: 320,
        mx: 'auto',
        label: 'Choose color format',
        placeholder: format,
        defaultValue: '#C5D899',
        ...attrs,
      })
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
