import { defineComponent, h } from 'vue'
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { PhArrowRight, PhArrowLeft } from '@phosphor-icons/vue'
</script>

<template>
  <Carousel
    :height="180"
    :next-control-icon="h(PhArrowRight, { size: 16 })"
    :previous-control-icon="h(PhArrowLeft, { size: 16 })"
  >
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselIconsDemo',
  setup() {
    return () =>
      h(
        Carousel,
        {
          height: 180,
          nextControlIcon: h(PhArrowRight, { size: 16 }),
          previousControlIcon: h(PhArrowLeft, { size: 16 }),
        },
        () => h(Slides, { count: 5 }),
      )
  },
})

export const icons: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  centered: true,
  maxWidth: 320,
}
