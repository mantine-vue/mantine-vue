<script setup lang="ts">
import { computed } from 'vue'
import { useId } from '@mantine-vue/hooks'
import { useTourContext } from './Tour.context'
import { getOverlayHitPath } from './get-overlay-hit-path'
import type { TourOverlayProps } from './Tour.types'
const props = defineProps<TourOverlayProps>()
const emit = defineEmits<{ click: [event: MouseEvent] }>()
const ctx = useTourContext()
const maskId = useId()
const interaction = computed(() => props.withInteraction ?? ctx.withOverlayInteraction)
</script>
<template>
  <svg
    v-if="ctx.withOverlay"
    v-bind="ctx.getStyles('overlay')"
    role="presentation"
    width="100%"
    height="100%"
    :data-with-overlay-interaction="interaction || undefined"
    @mousedown.prevent
    @click="
      (e) => {
        if (ctx.closeOnOverlayClick) ctx.close()
        emit('click', e)
      }
    "
  >
    <defs>
      <mask :id="maskId">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <rect
          v-if="props.targetRect"
          :x="props.targetRect.left - ctx.spotlightPadding"
          :y="props.targetRect.top - ctx.spotlightPadding"
          :width="props.targetRect.width + ctx.spotlightPadding * 2"
          :height="props.targetRect.height + ctx.spotlightPadding * 2"
          :rx="ctx.spotlightRadius"
          :ry="ctx.spotlightRadius"
          fill="black"
          v-bind="ctx.getStyles('spotlight')"
        />
      </mask>
    </defs>
    <rect
      x="0"
      y="0"
      width="100%"
      height="100%"
      :style="{ fill: props.color || 'var(--tour-overlay-color)' }"
      :mask="`url(#${maskId})`"
    />
    <path
      v-if="interaction"
      :d="getOverlayHitPath(props.targetRect ?? null, ctx.spotlightPadding)"
      fill-rule="evenodd"
      fill="transparent"
      style="pointer-events: auto"
    />
  </svg>
</template>
