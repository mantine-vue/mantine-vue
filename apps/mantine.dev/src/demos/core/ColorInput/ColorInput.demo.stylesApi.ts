import { defineComponent, h } from 'vue'
import { ColorInput } from '@mantine-vue/core'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { ColorInput } from '@mantine-vue/core'
</script>

<template>
  <ColorInput
    label="Label"
    placeholder="ColorInput"
    description="Description"
    error="Error"
    withAsterisk
    :swatches="['#000', '#fff', '#f00', '#0f0', '#00f']"
    format="rgba"
    {{props}}
  />
</template>
`

const Wrapper = defineComponent({
  name: 'ColorInputStylesApiDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(ColorInput, {
        label: 'Label',
        placeholder: 'ColorInput',
        description: 'Description',
        error: 'Error',
        withAsterisk: true,
        swatches: ['#000', '#fff', '#f00', '#0f0', '#00f'],
        format: 'rgba',
        ...attrs,
      })
  },
})

export const stylesApi: MantineDemo = {
  type: 'styles-api',
  data: {
    selectors: {
      root: 'Root element',
      label: 'Label element',
      required: 'Required asterisk element, rendered inside label',
      description: 'Description element',
      error: 'Error element',
      wrapper: 'Root element of the Input',
      input: 'Input element',
      section: 'Left and right sections',
      dropdown: 'Popover dropdown',
      colorPreview: 'Color swatch preview in input left section',
      eyeDropperButton: 'Eye dropper button',
      eyeDropperIcon: 'Default eye dropper icon',
      saturation: 'Saturation picker',
      saturationOverlay: 'Element used to display overlays over saturation picker',
      sliders: 'Contains alpha and hue sliders',
      slider: 'Alpha and hue sliders root',
      sliderOverlay: 'Element used to display overlays over hue and alpha sliders',
      thumb: 'Thumb of all sliders',
      swatch: 'Color swatch',
      swatches: 'Color swatches list',
    },
  },
  component: Wrapper,
  code,
  centered: true,
  maxWidth: 340,
}
