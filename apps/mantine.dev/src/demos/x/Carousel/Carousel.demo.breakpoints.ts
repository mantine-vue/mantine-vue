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
    :slideSize="{ base: '100%', sm: '50%', md: '33.333333%' }"
    :slideGap="{ base: 0, sm: 'md' }"
    :emblaOptions="{ loop: true, align: 'start' }"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselBreakpointsDemo',
  setup() {
    return () =>
      h(
        Carousel,
        {
          withIndicators: true,
          height: 200,
          slideSize: { base: '100%', sm: '50%', md: '33.333333%' },
          slideGap: { base: 0, sm: 'md' },
          emblaOptions: { loop: true, align: 'start' },
        },
        () => h(Slides, { count: 6 }),
      )
  },
})

export const breakpoints: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
