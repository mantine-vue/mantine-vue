<script setup lang="ts">
import { onBeforeUnmount, useAttrs, watch } from 'vue'
import { omitAttrs } from '../../../core'
import { useScrollAreaContext } from '../ScrollArea.context'
import { useScrollbarContext } from '../ScrollAreaScrollbar/Scrollbar.context'
import type { ScrollAreaThumbOwnProps } from './ScrollAreaThumb.types'
import { addUnlinkedScrollListener } from '../utils'

defineOptions({ name: 'ScrollAreaThumb', inheritAttrs: false })
const props = withDefaults(defineProps<ScrollAreaThumbOwnProps>(), {
  forceMount: undefined,
})

const attrs = useAttrs()
const scrollAreaContext = useScrollAreaContext()
const scrollbarContext = useScrollbarContext()
let removeUnlinkedScrollListener: (() => void) | undefined
let debounceTimer = 0

function call(handler: unknown, event: Event) {
  if (Array.isArray(handler)) handler.forEach((fn) => fn?.(event))
  else if (typeof handler === 'function') handler(event)
}

function removeScrollListener() {
  removeUnlinkedScrollListener?.()
  removeUnlinkedScrollListener = undefined
}

function debounceScrollEnd() {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(removeScrollListener, 100)
}

function handleScroll() {
  debounceScrollEnd()

  if (!removeUnlinkedScrollListener && scrollAreaContext.viewport.value) {
    removeUnlinkedScrollListener = addUnlinkedScrollListener(
      scrollAreaContext.viewport.value,
      scrollbarContext.onThumbPositionChange,
    )
    scrollbarContext.onThumbPositionChange()
  }
}

watch(
  scrollAreaContext.viewport,
  (viewport, _, onCleanup) => {
    scrollbarContext.onThumbPositionChange()
    viewport?.addEventListener('scroll', handleScroll)
    onCleanup(() => viewport?.removeEventListener('scroll', handleScroll))
  },
  { immediate: true, flush: 'post' },
)

onBeforeUnmount(() => {
  window.clearTimeout(debounceTimer)
  removeScrollListener()
})

function setThumb(node: any) {
  scrollbarContext.onThumbChange(node?.$el ?? node ?? null)
}

function handlePointerdown(event: PointerEvent) {
  call(attrs.onPointerdownCapture ?? attrs.onPointerDownCapture, event)
  const thumb = event.target as HTMLElement
  const thumbRect = thumb.getBoundingClientRect()
  scrollbarContext.onThumbPointerDown({
    x: event.clientX - thumbRect.left,
    y: event.clientY - thumbRect.top,
  })
}

function handlePointerup(event: PointerEvent) {
  call(attrs.onPointerup ?? attrs.onPointerUp, event)
  scrollbarContext.onThumbPointerUp()
}
</script>

<template>
  <div
    v-if="props.forceMount || scrollbarContext.hasThumb"
    v-bind="
      omitAttrs(attrs, [
        'style',
        'onPointerdownCapture',
        'onPointerDownCapture',
        'onPointerup',
        'onPointerUp',
      ])
    "
    :ref="setThumb"
    :data-state="scrollbarContext.hasThumb ? 'visible' : 'hidden'"
    :style="[{ width: 'var(--sa-thumb-width)', height: 'var(--sa-thumb-height)' }, attrs.style]"
    @pointerdown.capture="handlePointerdown"
    @pointerup="handlePointerup"
  />
</template>
