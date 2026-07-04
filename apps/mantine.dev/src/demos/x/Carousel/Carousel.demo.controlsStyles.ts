import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'carousel-controls-styles-demo-styles'
const CONTROL_CLASS = 'carousel-controls-styles-demo-control'

function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .${CONTROL_CLASS}[data-inactive] {
        opacity: 0;
        cursor: default;
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.control {
  &[data-inactive] {
    opacity: 0;
    cursor: default;
  }
}
`

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
import classes from './Demo.module.css'
</script>

<template>
  <Carousel :height="200" :classNames="classes">
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselControlsStylesDemo',
  setup() {
    ensureStyles()
    return () =>
      h(Carousel, { height: 200, classNames: { control: CONTROL_CLASS } }, () =>
        h(Slides, { count: 5 }),
      )
  },
})

export const controlsStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
  centered: true,
  maxWidth: 320,
}
