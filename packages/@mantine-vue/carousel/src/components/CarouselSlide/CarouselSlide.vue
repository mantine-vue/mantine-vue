<script setup lang="ts">
import { useAttrs } from 'vue'
import { Box } from '@mantine-vue/core'
import { useCarouselContext } from '../../Carousel.context'
import type { CarouselSlideProps } from './CarouselSlide.types'

defineOptions({ name: 'CarouselSlide', inheritAttrs: false })
const props = defineProps<CarouselSlideProps>()
const attrs = useAttrs()
const context = useCarouselContext()
</script>

<template>
  <Box
    v-bind="{
      ...attrs,
      ...context.getStyles('slide', {
        className: attrs.class,
        style: attrs.style,
        classNames: props.classNames,
        styles: props.styles,
      }),
    }"
    :mod="[{ orientation: context.orientation }, props.mod]"
    role="group"
    aria-roledescription="slide"
    aria-label="Carousel slide"
  >
    <slot />
  </Box>
</template>
