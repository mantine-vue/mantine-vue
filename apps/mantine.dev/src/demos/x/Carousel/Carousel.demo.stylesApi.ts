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
    withIndicators
    :height="200"
    :styles="{
      indicator: { width: 12, height: 4 },
      control: { borderRadius: 4 },
    }"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselStylesApiDemo',
  setup() {
    return () =>
      h(
        Carousel,
        {
          withIndicators: true,
          height: 200,
          styles: {
            indicator: { width: '12px', height: '4px' },
            control: { borderRadius: '4px' },
          },
        },
        () => h(Slides, { count: 2 }),
      )
  },
})

export const stylesApi: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
