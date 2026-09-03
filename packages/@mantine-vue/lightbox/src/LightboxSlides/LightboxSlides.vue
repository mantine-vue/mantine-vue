<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import { Box, useDirection } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'

defineOptions({ name: 'LightboxSlides', inheritAttrs: false })

const attrs = useAttrs()
const ctx = useLightboxContext()
const { dir } = useDirection()
const swipeStart = ref<{ x: number; y: number } | null>(null)
const startIndex = ctx.currentIndex

const options = computed<EmblaOptionsType>(() => {
  const userWatchDrag = ctx.emblaOptions?.watchDrag

  return {
    align: 'center',
    containScroll: false,
    direction: dir.value,
    ...ctx.emblaOptions,
    axis: 'x',
    loop: ctx.loop,
    startIndex,
    watchDrag: (api, event) => {
      if (ctx.zoomed) return false
      return typeof userWatchDrag === 'function'
        ? userWatchDrag(api, event)
        : (userWatchDrag ?? true)
    },
  }
})
const plugins = computed(() => [])
const [emblaNode, emblaApi] = emblaCarouselVue(options, plugins)

function handleSelect(api: EmblaCarouselType) {
  const index = api.selectedScrollSnap()
  if (index !== ctx.currentIndex) ctx.setIndex(index)
}

watch(
  emblaApi,
  (api, previousApi) => {
    previousApi?.off('select', handleSelect)
    api?.on('select', handleSelect)
  },
  { immediate: true },
)

watch(
  () => ctx.currentIndex,
  (index) => {
    const api = emblaApi.value
    if (api && api.selectedScrollSnap() !== index) {
      api.scrollTo(index, !ctx.withSlideTransition)
    }
  },
)

function handlePointerDown(event: PointerEvent) {
  swipeStart.value = { x: event.clientX, y: event.clientY }
}

function handlePointerUp(event: PointerEvent) {
  if (!swipeStart.value || !ctx.closeOnSwipeDown || ctx.zoomed) return
  const x = event.clientX - swipeStart.value.x
  const y = event.clientY - swipeStart.value.y
  swipeStart.value = null
  if (y > 80 && y > Math.abs(x)) ctx.close()
}

onBeforeUnmount(() => emblaApi.value?.off('select', handleSelect))
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...ctx.getStyles('slides') }"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ctx.labels.slidesLabel"
  >
    <div
      ref="emblaNode"
      v-bind="ctx.getStyles('slidesViewport')"
      @pointerdown="handlePointerDown"
      @pointerup="handlePointerUp"
      @pointercancel="swipeStart = null"
    >
      <div v-bind="ctx.getStyles('slidesContainer')"><slot /></div>
    </div>
  </Box>
</template>
