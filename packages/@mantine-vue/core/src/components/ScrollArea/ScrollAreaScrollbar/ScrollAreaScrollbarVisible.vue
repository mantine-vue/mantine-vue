<script setup lang="ts">
import { computed, nextTick, ref, useAttrs } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import type { Sizes } from '../ScrollArea.types'
import { getScrollPositionFromPointer, getThumbOffsetFromScroll, getThumbRatio } from '../utils'
import { ScrollAreaScrollbarX } from './ScrollbarX'
import { ScrollAreaScrollbarY } from './ScrollbarY'
import type {
  ScrollAreaScrollbarSlots,
  ScrollAreaScrollbarVisibleProps,
} from './ScrollAreaScrollbar.types'

defineOptions({
  name: 'ScrollAreaScrollbarVisible',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ScrollAreaScrollbarVisibleProps>(), {
  orientation: 'vertical',
})

defineSlots<ScrollAreaScrollbarSlots>()

const attrs = useAttrs()
const context = useScrollAreaContext()

const thumb = ref<HTMLDivElement | null>(null)
const pointerOffset = ref(0)
const sizes = ref<Sizes>({
  content: 0,
  viewport: 0,
  scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 },
})

const isHorizontal = computed(() => props.orientation === 'horizontal')

/** A thumb only exists while the content overflows but does not fill the whole track. */
const hasThumb = computed(() => {
  const ratio = getThumbRatio(sizes.value.viewport, sizes.value.content)
  return Boolean(ratio > 0 && ratio < 1)
})

function getScrollPosition(pointerPos: number, direction?: 'ltr' | 'rtl') {
  return getScrollPositionFromPointer(pointerPos, pointerOffset.value, sizes.value, direction)
}

/**
 * The thumb is positioned imperatively rather than through a reactive style, so that
 * scrolling does not queue a component update for every frame.
 */
function syncThumbPosition() {
  const viewport = context.viewport.value

  if (!viewport || !thumb.value) {
    return
  }

  if (isHorizontal.value) {
    const offset = getThumbOffsetFromScroll(viewport.scrollLeft, sizes.value)
    thumb.value.style.transform = `translate3d(${offset}px, 0, 0)`
    return
  }

  const offset = getThumbOffsetFromScroll(viewport.scrollTop, sizes.value)

  // A zero-height track means there is nothing to drag, so the thumb is hidden.
  thumb.value.style.setProperty('--thumb-opacity', sizes.value.scrollbar.size === 0 ? '0' : '1')
  thumb.value.style.transform = `translate3d(0, ${offset}px, 0)`
}

function onSizesChange(nextSizes: Sizes) {
  sizes.value = nextSizes
  // The thumb element is measured after the new sizes have been applied.
  nextTick(syncThumbPosition)
}

function onWheelScroll(scrollPos: number) {
  const viewport = context.viewport.value

  if (!viewport) {
    return
  }

  if (isHorizontal.value) {
    viewport.scrollLeft = scrollPos
  } else {
    viewport.scrollTop = scrollPos
  }
}

function onDragScroll(pointerPos: number) {
  const viewport = context.viewport.value

  if (!viewport) {
    return
  }

  if (isHorizontal.value) {
    viewport.scrollLeft = getScrollPosition(pointerPos)
  } else {
    viewport.scrollTop = getScrollPosition(pointerPos)
  }
}

const scrollbarProps = computed(() => ({
  ...attrs,
  sizes: sizes.value,
  onSizesChange,
  hasThumb: hasThumb.value,
  onThumbChange: (node: HTMLDivElement | null) => {
    thumb.value = node
  },
  onThumbPointerUp: () => {
    pointerOffset.value = 0
  },
  onThumbPointerDown: (pointerPos: number) => {
    pointerOffset.value = pointerPos
  },
  onThumbPositionChange: syncThumbPosition,
  onWheelScroll,
  onDragScroll,
}))
</script>

<template>
  <ScrollAreaScrollbarX v-if="isHorizontal" v-bind="scrollbarProps">
    <slot />
  </ScrollAreaScrollbarX>

  <ScrollAreaScrollbarY v-else v-bind="scrollbarProps">
    <slot />
  </ScrollAreaScrollbarY>
</template>
