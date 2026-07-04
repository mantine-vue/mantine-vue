import { defineComponent, h } from 'vue'
import { Carousel } from '@mantine-vue/carousel'
import { Slides } from './_slides'
import type { MantineDemo } from '@/demo'

const STYLE_ID = 'carousel-indicator-styles-demo-styles'
const INDICATOR_CLASS = 'carousel-indicator-styles-demo-indicator'

function ensureStyles() {
  if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = `
      .${INDICATOR_CLASS} {
        width: 12px;
        height: 4px;
        transition: width 250ms ease;
      }
      .${INDICATOR_CLASS}[data-active] {
        width: 40px;
      }
    `
    document.head.appendChild(style)
  }
}

const cssCode = `.indicator {
  width: 12px;
  height: 4px;
  transition: width 250ms ease;

  &[data-active] {
    width: 40px;
  }
}`

const code = `
<script setup lang="ts">
import { Carousel } from '@mantine-vue/carousel'
import classes from './Demo.module.css'
</script>

<template>
  <Carousel withIndicators :height="200" :classNames="classes">
    <Carousel.Slide>1</Carousel.Slide>
    <Carousel.Slide>2</Carousel.Slide>
    <Carousel.Slide>3</Carousel.Slide>
    <!-- ...other slides -->
  </Carousel>
</template>
`

const Demo = defineComponent({
  name: 'CarouselIndicatorStylesDemo',
  setup() {
    ensureStyles()
    return () =>
      h(
        Carousel,
        { withIndicators: true, height: 200, classNames: { indicator: INDICATOR_CLASS } },
        () => h(Slides, { count: 5 }),
      )
  },
})

export const indicatorStyles: MantineDemo = {
  type: 'code',
  component: Demo,
  code: [
    { fileName: 'Demo.vue', language: 'html', code },
    { fileName: 'Demo.module.css', language: 'scss', code: cssCode },
  ],
  centered: true,
  maxWidth: 320,
}
