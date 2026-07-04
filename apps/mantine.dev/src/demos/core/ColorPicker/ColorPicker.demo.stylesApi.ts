import { defineComponent, h } from 'vue'
import { ColorPicker } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorPicker } from '@mantine-vue/core'
</script>

<template>
  <ColorPicker
    format="rgba"
    size="lg"
    :swatches="['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5']"
    {{props}}
  />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorPickerStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(ColorPicker, {
        size: 'lg',
        format: 'rgba',
        swatches: ['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5'],
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: [
      { selector: 'wrapper', description: 'Root element' },
      {
        selector: 'preview',
        description: 'Color preview, displayed only when format supports alpha channel',
      },
      { selector: 'body', description: 'Contains alpha/hue sliders and color preview' },
      { selector: 'slider', description: 'Alpha and hue sliders root' },
      {
        selector: 'sliderOverlay',
        description: 'Element used to display various overlays over hue and alpha sliders',
      },
      { selector: 'saturation', description: 'Saturation picker' },
      {
        selector: 'saturationOverlay',
        description: 'Element used to display various overlays over saturation picker',
      },
      { selector: 'sliders', description: 'Contains alpha and hue sliders' },
      { selector: 'thumb', description: 'Thumb of all sliders' },
      { selector: 'swatch', description: 'Color swatch' },
      { selector: 'swatches', description: 'Color swatches list' },
    ],
  },
  component: Wrapper,
  centered: true,
  code,
}
