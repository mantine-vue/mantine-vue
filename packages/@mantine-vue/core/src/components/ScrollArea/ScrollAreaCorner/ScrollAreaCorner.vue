<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useAttrs, watch } from 'vue'
import { omitAttrs } from '../../../core'
import { useScrollAreaContext } from '../ScrollArea.context'

defineOptions({ name: 'ScrollAreaCorner', inheritAttrs: false })

const attrs = useAttrs()
const ctx = useScrollAreaContext()
const width = ref(0)
const height = ref(0)
let resizeObserverX: ResizeObserver | null = null
let resizeObserverY: ResizeObserver | null = null

function updateSize() {
  const nextHeight = ctx.scrollbarX.value?.offsetHeight || 0
  const nextWidth = ctx.scrollbarY.value?.offsetWidth || 0

  height.value = nextHeight
  width.value = nextWidth
  ctx.onCornerHeightChange(nextHeight)
  ctx.onCornerWidthChange(nextWidth)
}

function observeScrollbars() {
  resizeObserverX?.disconnect()
  resizeObserverY?.disconnect()
  resizeObserverX = null
  resizeObserverY = null

  if (typeof ResizeObserver !== 'undefined') {
    if (ctx.scrollbarX.value) {
      resizeObserverX = new ResizeObserver(updateSize)
      resizeObserverX.observe(ctx.scrollbarX.value)
    }

    if (ctx.scrollbarY.value) {
      resizeObserverY = new ResizeObserver(updateSize)
      resizeObserverY.observe(ctx.scrollbarY.value)
    }
  }

  updateSize()
}

watch([ctx.scrollbarX, ctx.scrollbarY], observeScrollbars, { immediate: true, flush: 'post' })

onBeforeUnmount(() => {
  resizeObserverX?.disconnect()
  resizeObserverY?.disconnect()
})

const hasCorner = computed(
  () =>
    ctx.type !== 'scroll' &&
    Boolean(ctx.scrollbarX.value && ctx.scrollbarY.value) &&
    Boolean(width.value && height.value),
)
</script>

<template>
  <div
    v-if="hasCorner"
    v-bind="omitAttrs(attrs, ['style'])"
    :style="[{ width, height }, attrs.style]"
  />
</template>
