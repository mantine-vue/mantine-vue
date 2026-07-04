import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
</script>

<template>
  <!-- Wrapper div is added for demonstration purposes only, -->
  <!-- It is not required in real projects -->
  <div :style="{ resize: 'horizontal', overflow: 'hidden', maxWidth: '100%', minWidth: '250px', padding: '10px' }">
    <Carousel
      withIndicators
      :height="200"
      type="container"
      :slideSize="{ base: '100%', '300px': '50%', '500px': '33.333333%' }"
      :slideGap="{ base: 0, '300px': 'md', '500px': 'lg' }"
      :emblaOptions="{ loop: true, align: 'start' }"
    >
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
      <!-- ...other slides -->
    </Carousel>
  </div>
</template>
`

const Demo = defineComponent({
  name: 'CarouselContainerDemo',
  setup() {
    return () =>
      h(
        'div',
        {
          style: {
            resize: 'horizontal',
            overflow: 'hidden',
            maxWidth: '100%',
            minWidth: '250px',
            padding: '10px',
          },
        },
        [
          h(
            Carousel,
            {
              withIndicators: true,
              height: 200,
              type: 'container',
              slideSize: { base: '100%', '300px': '50%', '500px': '33.333333%' },
              slideGap: { base: 0, '300px': 'md', '500px': 'lg' },
              emblaOptions: { loop: true, align: 'start' },
            },
            () => h(Slides, { count: 6 }),
          ),
        ],
      )
  },
})

export const container: MantineDemo = {
  type: 'code',
  component: Demo,
  code,
}
