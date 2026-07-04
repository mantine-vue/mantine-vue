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
    slideGap="md"
    :emblaOptions="{ dragFree: true, align: 'start' }"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselDragFreeDemo',
  setup() {
    return () =>
      h(
        Carousel,
        {
          withIndicators: true,
          height: 200,
          slideGap: 'md',
          emblaOptions: { dragFree: true, align: 'start' },
        },
        () => h(Slides, { count: 5 }),
      )
  },
})

export const dragFree: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
