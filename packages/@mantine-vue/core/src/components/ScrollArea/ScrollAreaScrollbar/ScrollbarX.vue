<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { ScrollAreaScrollbarAxisPrivateProps } from '../ScrollArea.types'
import { getThumbSize, isScrollingWithinScrollbarBounds, toInt } from '../utils'
import { Scrollbar } from './Scrollbar'
import type { ScrollbarSlots } from './Scrollbar.types'

defineOptions({
  name: 'ScrollAreaScrollbarX',
  inheritAttrs: false,
})

/**
 * The axis scrollbars take single-number positions, unlike the shared `Scrollbar`
 * shell, which works in `{ x, y }` pairs; this component adapts between the two.
 */
const props = defineProps<ScrollAreaScrollbarAxisPrivateProps>()

defineSlots<ScrollbarSlots>()

const attrs = useAttrs()
const ctx = useScrollAreaContext()
const scrollbar = ref<HTMLDivElement | null>(null)

function setScrollbarRef(node: HTMLDivElement | null) {
  scrollbar.value = node
  ctx.onScrollbarXChange(node)
}

function onWheelScroll(event: WheelEvent, maxScrollPos: number) {
  if (!ctx.viewport.value) {
    return
  }

  const scrollPos = ctx.viewport.value.scrollLeft + event.deltaX
  props.onWheelScroll(scrollPos)

  // Only swallow the wheel event while the scroll stays inside the track, so that
  // reaching either end still scrolls an ancestor.
  if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
    event.preventDefault()
  }
}

function onResize() {
  if (!scrollbar.value || !ctx.viewport.value) {
    return
  }

  const computedStyle = window.getComputedStyle(scrollbar.value)

  props.onSizesChange({
    content: ctx.viewport.value.scrollWidth,
    viewport: ctx.viewport.value.offsetWidth,
    scrollbar: {
      size: scrollbar.value.clientWidth,
      paddingStart: toInt(computedStyle.paddingLeft),
      paddingEnd: toInt(computedStyle.paddingRight),
    },
  })
}

const thumbSizeVar = computed(() => ({ '--sa-thumb-width': `${getThumbSize(props.sizes)}px` }))
</script>

<template>
  <Scrollbar
    v-bind="attrs"
    data-orientation="horizontal"
    :sizes="props.sizes"
    :has-thumb="props.hasThumb"
    :on-thumb-change="props.onThumbChange"
    :on-thumb-pointer-down="(pointerPos: { x: number }) => props.onThumbPointerDown(pointerPos.x)"
    :on-thumb-pointer-up="props.onThumbPointerUp"
    :on-thumb-position-change="props.onThumbPositionChange"
    :on-drag-scroll="(pointerPos: { x: number }) => props.onDragScroll(pointerPos.x)"
    :on-wheel-scroll="onWheelScroll"
    :on-resize="onResize"
    :style="[thumbSizeVar, attrs.style as any]"
    @scrollbar-mounted="setScrollbarRef"
  >
    <slot />
  </Scrollbar>
</template>
