<script setup lang="ts">
import { computed, useAttrs, watch } from 'vue'
import emblaCarouselVue from 'embla-carousel-vue'
import type { EmblaOptionsType } from 'embla-carousel'
import { Collapse, UnstyledButton, useDirection } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
import type { LightboxCustomSlide, LightboxSlideData } from '../types'
defineOptions({ name: 'LightboxThumbnails', inheritAttrs: false })
const attrs = useAttrs()
const ctx = useLightboxContext()
const { dir } = useDirection()
const options = computed<EmblaOptionsType>(() => ({
  containScroll: 'keepSnaps',
  dragFree: true,
  direction: dir.value,
  active: ctx.withThumbnails,
}))
const plugins = computed(() => [])
const [emblaNode, emblaApi] = emblaCarouselVue(options, plugins)

function getThumbnailSource(slide: LightboxSlideData) {
  return (
    slide.thumbSrc ??
    (slide.type === 'video' ? slide.poster : undefined) ??
    (slide.type !== 'custom' ? slide.src : undefined)
  )
}

watch([emblaApi, () => ctx.currentIndex], ([api, index]) => api?.scrollTo(index), {
  immediate: true,
})
</script>
<template>
  <Collapse
    v-if="ctx.withThumbnails"
    :expanded="ctx.thumbnailsVisible"
    :transition-duration="ctx.transitionDuration"
    :keep-mounted="false"
    v-bind="{ ...attrs, ...ctx.getStyles('thumbnails') }"
    ><div ref="emblaNode" v-bind="ctx.getStyles('thumbnailsViewport')">
      <div v-bind="ctx.getStyles('thumbnailsContainer')">
        <UnstyledButton
          v-for="(slide, index) in ctx.slides"
          :key="index"
          v-bind="ctx.getStyles('thumbnail')"
          :data-active="index === ctx.currentIndex || undefined"
          :aria-label="ctx.labels.thumbnailLabel(index + 1, ctx.slides.length)"
          :aria-current="index === ctx.currentIndex || undefined"
          @click="ctx.setIndex(index)"
          ><component
            :is="() => (slide as LightboxCustomSlide).renderThumb?.()"
            v-if="slide.type === 'custom' && slide.renderThumb" /><img
            v-else-if="getThumbnailSource(slide)"
            v-bind="ctx.getStyles('thumbnailImage')"
            :src="getThumbnailSource(slide)"
            alt=""
            loading="lazy"
            draggable="false"
        /></UnstyledButton>
      </div></div
  ></Collapse>
</template>
