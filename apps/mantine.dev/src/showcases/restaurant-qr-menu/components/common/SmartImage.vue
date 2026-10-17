<script setup lang="ts">
import { computed } from 'vue'
import { Image } from '@mantine-vue/core'
import { useQrMenu } from '../../app/use-qr-menu'
import type { ImageAsset } from '../../domain/types'
import { IMAGE_FALLBACK, imageSrc, imageSrcSet } from '../../utils/images'

/**
 * Responsive, lazy-loaded image with an aspect-ratio box (prevents layout shift)
 * and a neutral fallback when the image is missing or fails.
 */
const props = withDefaults(
  defineProps<{
    asset?: ImageAsset
    /** Rendered CSS width in px, used to request an appropriately sized file. */
    width: number
    ratio?: number
    radius?: string | number
    alt?: string
    eager?: boolean
    grayscale?: boolean
  }>(),
  { ratio: 1, radius: 0, alt: undefined, asset: undefined, eager: false, grayscale: false },
)

const { localize } = useQrMenu()
const altText = computed(() => props.alt ?? localize(props.asset?.alt))
</script>

<template>
  <div
    :class="$style.box"
    :style="{ aspectRatio: String(ratio) }"
    :data-grayscale="grayscale || undefined"
  >
    <Image
      :src="imageSrc(asset, width)"
      :srcset="imageSrcSet(asset, width)"
      :fallback-src="IMAGE_FALLBACK"
      :alt="altText"
      :radius="radius"
      :loading="eager ? 'eager' : 'lazy'"
      :fetchpriority="eager ? 'high' : undefined"
      decoding="async"
      h="100%"
      w="100%"
      fit="cover"
      :class="$style.image"
    />
  </div>
</template>

<style module>
.box {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--mantine-color-gray-1);

  @mixin dark {
    background-color: var(--mantine-color-dark-5);
  }

  &[data-grayscale] .image {
    filter: grayscale(1);
    opacity: 0.6;
  }
}

.image {
  transition:
    transform 300ms ease,
    filter 200ms ease;
}
</style>
