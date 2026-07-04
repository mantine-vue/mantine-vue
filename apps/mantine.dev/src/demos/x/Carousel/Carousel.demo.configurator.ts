import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
</script>

<template>
  <Carousel
    slideSize="70%"
    :height="200"
    {{props}}
  >
    <!-- ...slides -->
  </Carousel>
</template>
`

const Wrapper = defineComponent({
  name: 'CarouselConfiguratorDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Carousel, { height: 200, slideSize: '70%', ...attrs }, () => h(Slides, { count: 5 }))
  },
})

export const configurator: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    {
      prop: 'orientation',
      type: 'segmented',
      initialValue: 'horizontal',
      libraryValue: 'horizontal',
      data: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
    },
    { prop: 'slideGap', type: 'size', initialValue: 'md', libraryValue: '__' },
    { prop: 'controlsOffset', type: 'size', initialValue: 'sm', libraryValue: '__' },
    { prop: 'controlSize', type: 'number', min: 14, max: 40, initialValue: 26, libraryValue: '__' },
    { prop: 'withControls', type: 'boolean', initialValue: true, libraryValue: '__' },
    { prop: 'withIndicators', type: 'boolean', initialValue: false, libraryValue: '__' },
  ],
}
