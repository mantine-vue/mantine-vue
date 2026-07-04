import { defineComponent, h } from 'vue'
import { Image } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'
import { images as _images } from './_images'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
import { Image } from '@mantine-vue/core'

const images = [
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-1.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-2.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-3.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-4.png',
  'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-5.png',
]
</script>

<template>
  <Carousel withIndicators :height="200">
    <Carousel.Slide v-for="url in images" :key="url">
      <Image :src="url" />
    </Carousel.Slide>
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselImagesDemo',
  setup() {
    return () =>
      h(Carousel, { withIndicators: true, height: 200 }, () =>
        _images.map((url) => h(Carousel.Slide, { key: url }, () => h(Image, { src: url }))),
      )
  },
})

export const images: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
  maxWidth: 380,
  centered: true,
}
