<script setup lang="ts">
import { computed, ref, useAttrs, watch } from 'vue'
import { Box } from '@mantine-vue/core'
import { useLightboxContext } from '../lightbox.context'
import type { LightboxCustomSlide, LightboxImageSlide, LightboxVideoSlide } from '../types'
import type { LightboxSlideProps, LightboxSlideSlots } from './LightboxSlide.types'
defineOptions({ name: 'LightboxSlide', inheritAttrs: false })
const props = defineProps<LightboxSlideProps>()
defineSlots<LightboxSlideSlots>()
const attrs = useAttrs()
const ctx = useLightboxContext()
const active = computed(() => props.index === ctx.currentIndex)
const image = computed(() => props.slide as LightboxImageSlide)
const video = computed(() => props.slide as LightboxVideoSlide)
const custom = computed(() => props.slide as LightboxCustomSlide)
const videoRef = ref<HTMLVideoElement | null>(null)

watch(
  active,
  (isActive) => {
    if (!videoRef.value) {
      return
    }

    if (!isActive) {
      videoRef.value.pause()
    } else if (video.value.autoPlay) {
      videoRef.value.play().catch(() => {})
    }
  },
  { flush: 'post' },
)

function handleClick(event: MouseEvent) {
  if (ctx.closeOnClickOutside && !event.defaultPrevented && event.target === event.currentTarget) {
    ctx.close()
  }
}
</script>
<template>
  <Box
    v-bind="{ ...attrs, ...ctx.getStyles('slide') }"
    role="group"
    aria-roledescription="slide"
    data-lightbox-slide
    :aria-label="ctx.labels.slideLabel(index + 1, ctx.slides.length)"
    :aria-hidden="!active || undefined"
    :inert="!active || undefined"
    @click="handleClick"
  >
    <slot :slide="slide" :active="active">
      <component :is="() => custom.render({ active })" v-if="slide.type === 'custom'" />
      <video
        ref="videoRef"
        v-else-if="slide.type === 'video'"
        v-bind="ctx.getStyles('slideVideo')"
        :src="video.src"
        :poster="video.poster"
        :aria-label="video.label"
        :autoplay="video.autoPlay && active"
        controls
        :tabindex="active ? 0 : -1"
      >
        <track
          v-for="track in video.tracks"
          :key="`${track.src}-${track.srcLang}`"
          :src="track.src"
          :kind="track.kind ?? 'subtitles'"
          :srclang="track.srcLang"
          :label="track.label"
          :default="track.default"
        />
      </video>
      <img
        v-else
        v-bind="{
          ...ctx.getStyles('slideImage'),
          ...(active && ctx.withZoom ? ctx.getImageZoomProps() : {}),
        }"
        :src="image.src"
        :alt="image.alt ?? ''"
        :srcset="image.srcSet"
        :sizes="image.sizes"
        :loading="image.loading ?? (active ? 'eager' : 'lazy')"
        draggable="false"
      />
    </slot>
  </Box>
</template>
