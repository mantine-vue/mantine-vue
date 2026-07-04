import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
</script>

<template>
  <Carousel orientation="vertical" :height="200" withIndicators>
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselVerticalDemo',
  setup() {
    return () =>
      h(Carousel, { orientation: 'vertical', height: 200, withIndicators: true }, () =>
        h(Slides, { count: 5 }),
      )
  },
})

export const vertical: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
