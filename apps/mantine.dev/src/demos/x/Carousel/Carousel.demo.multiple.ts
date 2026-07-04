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
    slideSize="33.333333%"
    slideGap="md"
    :emblaOptions="{ loop: true, align: 'start', slidesToScroll: 3 }"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselMultipleDemo',
  setup() {
    return () =>
      h(
        Carousel,
        {
          withIndicators: true,
          height: 200,
          slideSize: '33.333333%',
          slideGap: 'md',
          emblaOptions: { loop: true, align: 'start', slidesToScroll: 3 },
        },
        () => h(Slides, { count: 12 }),
      )
  },
})

export const multiple: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
