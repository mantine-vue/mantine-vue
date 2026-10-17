<script setup lang="ts">
import { computed, ref } from 'vue'
import { UnstyledButton } from '@mantine-vue/core'
import { Carousel } from '@mantine-vue/carousel'
import { Lightbox, type LightboxSlideData } from '@mantine-vue/lightbox'
import { useQrMenu } from '../../app/use-qr-menu'
import { useIsMobile } from '../../composables/use-is-mobile'
import type { Product } from '../../domain/types'
import { imageSrc } from '../../utils/images'
import SmartImage from '../common/SmartImage.vue'

/** Swipeable image gallery; tapping a photo opens a zoomable full-screen lightbox. */
const props = defineProps<{ product: Product }>()
const { t, localize, i18n } = useQrMenu()
const isMobile = useIsMobile()

const opened = ref(false)
const index = ref(0)
const name = computed(() => localize(props.product.name))

const slides = computed<LightboxSlideData[]>(() =>
  props.product.images.map((image, position) => ({
    src: imageSrc(image, 1600),
    thumbSrc: imageSrc(image, 160),
    alt: localize(image.alt) || name.value,
    caption: `${name.value} · ${t('details.photo', { index: position + 1, total: props.product.images.length })}`,
  })),
)

const labels = computed(() => ({
  lightboxLabel: t('details.openGallery'),
  slideLabel: (current: number, total: number) => t('details.photo', { index: current, total }),
  closeLabel: t('app.close'),
  slidesLabel: t('details.photos'),
  previousSlideLabel: t('details.previousPhoto'),
  nextSlideLabel: t('details.nextPhoto'),
  thumbnailLabel: (current: number, total: number) => t('details.photo', { index: current, total }),
  showThumbnailsLabel: t('details.showThumbnails'),
  hideThumbnailsLabel: t('details.hideThumbnails'),
}))

const open = (position: number) => {
  index.value = position
  opened.value = true
}
</script>

<template>
  <div :class="$style.gallery">
    <Carousel
      v-if="product.images.length > 1"
      :key="i18n.dir.value"
      withIndicators
      :withControls="!isMobile"
      :controlSize="30"
      :emblaOptions="{ loop: true }"
      :class="$style.carousel"
      @slide-change="(position: number) => (index = position)"
    >
      <Carousel.Slide v-for="(image, position) in product.images" :key="image.url">
        <UnstyledButton
          :class="$style.photo"
          :aria-label="`${t('details.openGallery')} – ${t('details.photo', { index: position + 1, total: product.images.length })}`"
          @click="open(position)"
        >
          <SmartImage
            :asset="image"
            :width="720"
            :ratio="4 / 3"
            :alt="name"
            :eager="position === 0"
            :grayscale="!product.available"
          />
        </UnstyledButton>
      </Carousel.Slide>
    </Carousel>
    <UnstyledButton
      v-else
      :class="$style.photo"
      :aria-label="t('details.openGallery')"
      @click="open(0)"
    >
      <SmartImage
        :asset="product.images[0]"
        :width="720"
        :ratio="4 / 3"
        :alt="name"
        eager
        :grayscale="!product.available"
      />
    </UnstyledButton>

    <slot />

    <Lightbox
      v-model:opened="opened"
      v-model:current-index="index"
      :slides="slides"
      :labels="labels"
      withZoom
      :withThumbnails="slides.length > 1"
      :loop="slides.length > 1"
      closeOnClickOutside
    />
  </div>
</template>

<style module>
.gallery {
  position: relative;
}

.carousel {
  overflow: hidden;
}

.photo {
  display: block;
  width: 100%;
  cursor: zoom-in;
}
</style>
