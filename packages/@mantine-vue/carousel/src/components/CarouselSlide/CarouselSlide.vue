<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { assignRef } from '@mantine-vue/hooks'
import { Box } from '@mantine-vue/core'
import { useCarouselContext } from '../../Carousel.context'
import type { CarouselSlideProps } from './CarouselSlide.types'

defineOptions({ name: 'CarouselSlide', inheritAttrs: false })
const props = defineProps<CarouselSlideProps>()
const attrs = useAttrs()
const context = useCarouselContext()

const rootElement = ref<Element | null>(null)

const setRootRef = (node: Element | null) => {
  rootElement.value = node
  assignRef(props.rootRef, node)
}

defineExpose({ rootElement })
</script>

<template>
  <Box
    :rootRef="setRootRef"
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
