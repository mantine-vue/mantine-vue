import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const Wrapper = defineComponent({
  name: 'CarouselEmblaOptionsDemo',
  inheritAttrs: false,
  setup(_props, { attrs }) {
    return () =>
      h(Carousel, { height: 200, slideSize: '70%', slideGap: 'md', emblaOptions: attrs }, () =>
        h(Slides, { count: 5 }),
      )
  },
})

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
</script>

<template>
  <Carousel
    slideSize="70%"
    :height="200"
    :emblaOptions="{ loop: true, dragFree: false, align: 'center' }"
  >
    <!-- ...slides -->
  </Carousel>
</template>
`

export const emblaOptions: MantineDemo = {
  type: 'configurator',
  component: Wrapper,
  code,
  centered: true,
  maxWidth: '100%',
  controls: [
    {
      prop: 'align',
      type: 'segmented',
      initialValue: 'center',
      libraryValue: '__',
      data: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
      ],
    },
    { prop: 'loop', type: 'boolean', initialValue: true, libraryValue: '__' },
    { prop: 'dragFree', type: 'boolean', initialValue: false, libraryValue: '__' },
  ],
}
