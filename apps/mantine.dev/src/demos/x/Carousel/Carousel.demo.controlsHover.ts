import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'carousel-controls-hover-demo-styles'
const CONTROLS_CLASS = 'carousel-controls-hover-demo-controls'
const ROOT_CLASS = 'carousel-controls-hover-demo-root'

function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .${CONTROLS_CLASS} {
        transition: opacity 150ms ease;
        opacity: 0;
      }
      .${ROOT_CLASS}:hover .${CONTROLS_CLASS} {
        opacity: 1;
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.controls {
  transition: opacity 150ms ease;
  opacity: 0;
}

.root {
  &:hover {
    .controls {
      opacity: 1;
    }
  }
}`

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
  name: 'CarouselControlsHoverDemo',
  setup() {
    ensureStyles()
    return () =>
      h(Carousel, { height: 200, classNames: { root: ROOT_CLASS, controls: CONTROLS_CLASS } }, () =>
        h(Slides, { count: 5 }),
      )
  },
})

export const controlsHover: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
  centered: true,
  maxWidth: 320,
}
