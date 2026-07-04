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
    selectors: {
      wrapper: 'Root element',
      preview: 'Color preview, displayed only when format supports alpha channel',
      body: 'Contains alpha/hue sliders and color preview',
      slider: 'Alpha and hue sliders root',
      sliderOverlay: 'Element used to display various overlays over hue and alpha sliders',
      saturation: 'Saturation picker',
      saturationOverlay: 'Element used to display various overlays over saturation picker',
      sliders: 'Contains alpha and hue sliders',
      thumb: 'Thumb of all sliders',
      swatch: 'Color swatch',
      swatches: 'Color swatches list',
    },
  },
  component: Wrapper,
  centered: true,
  code,
}
