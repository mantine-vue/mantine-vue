import { defineComponent, h } from 'vue'
import Autoplay from 'embla-carousel-autoplay'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import Autoplay from 'embla-carousel-autoplay'
import { Carousel } from '@mantine-vue/carousel'

const autoplay = Autoplay({ delay: 1000 })
</script>

<template>
  <Carousel
    withIndicators
    :height="200"
    :plugins="[autoplay]"
    @mouseenter="autoplay.stop"
    @mouseleave="() => autoplay.play()"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselAutoplayDemo',
  setup() {
    const autoplay = Autoplay({ delay: 1000 })

    return () =>
      h(
        Carousel,
        {
          withIndicators: true,
          height: 200,
          plugins: [autoplay],
          onMouseenter: autoplay.stop,
          onMouseleave: () => autoplay.play(),
        },
        () => h(Slides, { count: 5 }),
      )
  },
})

export const autoplay: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
