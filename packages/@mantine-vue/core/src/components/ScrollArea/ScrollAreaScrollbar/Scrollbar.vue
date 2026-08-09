<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { useScrollAreaContext } from '../ScrollArea.context'
import { provideScrollbarContext } from './Scrollbar.context'
import type { ScrollbarEmits, ScrollbarPrivateProps, ScrollbarSlots } from './Scrollbar.types'

defineOptions({
  name: 'ScrollAreaScrollbarInternal',
  inheritAttrs: false,
})

const props = defineProps<ScrollbarPrivateProps>()

const emit = defineEmits<ScrollbarEmits>()

defineSlots<ScrollbarSlots>()

const attrs = useAttrs()
const context = useScrollAreaContext()

const scrollbar = ref<HTMLDivElement | null>(null)
const rect = ref<DOMRect | null>(null)
const prevWebkitUserSelect = ref('')

let resizeObserver: ResizeObserver | null = null
let resizeFrame = 0

/** Getters keep the provided object reactive without changing the shape the thumb reads. */
provideScrollbarContext({
  get hasThumb() {
    return props.hasThumb
  },
  get scrollbar() {
    return scrollbar.value
  },
  onThumbChange: props.onThumbChange,
  onThumbPointerUp: props.onThumbPointerUp,
  onThumbPointerDown: props.onThumbPointerDown,
  onThumbPositionChange: props.onThumbPositionChange,
})

/** Coalesced into one frame: a resize observer can fire many times per layout pass. */
function handleResize() {
  window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(() => props.onResize())
}

function observeResize() {
  resizeObserver?.disconnect()
  resizeObserver = null

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(handleResize)

    if (scrollbar.value) {
      resizeObserver.observe(scrollbar.value)
    }

    if (context.content.value) {
      resizeObserver.observe(context.content.value)
    }
  }

  props.onResize()
}

function handleDragScroll(event: PointerEvent) {
  if (rect.value) {
    props.onDragScroll({
      x: event.clientX - rect.value.left,
      y: event.clientY - rect.value.top,
    })
  }
}

/**
 * Bound on `document` rather than the element so a wheel over the scrollbar scrolls the
 * viewport, and registered non-passive so the default scroll can be prevented.
 */
function handleWheel(event: WheelEvent) {
  const target = event.target as HTMLElement

  if (scrollbar.value?.contains(target)) {
    props.onWheelScroll(event, props.sizes.content - props.sizes.viewport)
  }
}

onMounted(() => {
  document.addEventListener('wheel', handleWheel, { passive: false })
  observeResize()
  props.onThumbPositionChange()
})

watch([scrollbar, context.content], observeResize, { flush: 'post' })

watch(
  () => props.sizes,
  () => props.onThumbPositionChange(),
  { deep: true },
)

onBeforeUnmount(() => {
  document.removeEventListener('wheel', handleWheel)
  resizeObserver?.disconnect()
  window.cancelAnimationFrame(resizeFrame)
})

function setScrollbarRef(node: any) {
  const element = node?.$el ?? node ?? null
  scrollbar.value = element
  emit('scrollbar-mounted', element)
}

function onPointerdown(event: PointerEvent) {
  ;(attrs.onPointerdown as ((event: PointerEvent) => void) | undefined)?.(event)
  event.preventDefault()

  if (event.button === 0) {
    const element = event.target as HTMLElement
    element.setPointerCapture(event.pointerId)
    rect.value = scrollbar.value?.getBoundingClientRect() ?? null
    // Dragging the track would otherwise select the surrounding text.
    prevWebkitUserSelect.value = document.body.style.webkitUserSelect
    document.body.style.webkitUserSelect = 'none'
    handleDragScroll(event)
  }
}

function onPointermove(event: PointerEvent) {
  ;(attrs.onPointermove as ((event: PointerEvent) => void) | undefined)?.(event)
  handleDragScroll(event)
}

function onPointerup(event: PointerEvent) {
  ;(attrs.onPointerup as ((event: PointerEvent) => void) | undefined)?.(event)

  const element = event.target as HTMLElement

  if (element.hasPointerCapture(event.pointerId)) {
    event.preventDefault()
    element.releasePointerCapture(event.pointerId)
  }
}

function onLostpointercapture() {
  document.body.style.webkitUserSelect = prevWebkitUserSelect.value
  rect.value = null
}
</script>

<template>
  <div
    :ref="setScrollbarRef"
    v-bind="attrs"
    :data-mantine-scrollbar="true"
    :style="[{ position: 'absolute' }, attrs.style as any]"
    @pointerdown="onPointerdown"
    @pointermove="onPointermove"
    @pointerup="onPointerup"
    @lostpointercapture="onLostpointercapture"
  >
    <slot />
  </div>
</template>
