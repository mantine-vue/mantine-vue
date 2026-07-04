import { defineComponent, h } from 'vue'
import { ColorPicker } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const themeSwatches = [
  '#2e2e2e',
  '#868e96',
  '#fa5252',
  '#e64980',
  '#be4bdb',
  '#7950f2',
  '#4c6ef5',
  '#228be6',
  '#15aabf',
  '#12b886',
  '#40c057',
  '#82c91e',
  '#fab005',
  '#fd7e14',
]

const code = `
<script setup lang="ts">
import { ColorPicker } from '@mantine-vue/core'
</script>

<template>
  <ColorPicker{{props}} />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorPickerSizeConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(ColorPicker, {
        mx: 'auto',
        format: 'rgba',
        defaultValue: 'rgba(50, 151, 194, 1)',
        swatches: themeSwatches,
        ...attrs,
      })
  },
})

export const sizeConfigurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  controls: [{ prop: 'size', type: 'size', initialValue: 'sm', libraryValue: 'sm' }],
}
