<script lang="ts">
import { createVarsResolver, rem } from '../../core'
import type { ScrollAreaOwnProps } from './ScrollArea.props.types'

const defaultProps = {
  scrollHideDelay: 1000,
  type: 'hover',
  scrollbars: 'xy',
} as const

/** Module scope: created once, not per component instance. */
const varsResolver = createVarsResolver<any>(
  (_, { scrollbarSize, overscrollBehavior, scrollbars }) => {
    let overrideOverscrollBehavior = overscrollBehavior

    // A single-axis scroll area must leave the other axis alone, or it would trap
    // scrolling that belongs to an ancestor.
    if (overscrollBehavior && scrollbars) {
      if (scrollbars === 'x') {
        overrideOverscrollBehavior = `${overscrollBehavior} auto`
      } else if (scrollbars === 'y') {
        overrideOverscrollBehavior = `auto ${overscrollBehavior}`
      }
    }

    return {
      root: {
        '--scrollarea-scrollbar-size': rem(scrollbarSize),
        '--scrollarea-over-scroll-behavior': overrideOverscrollBehavior,
      },
    }
  },
)

function toOffsetScrollbars(value: ScrollAreaOwnProps['offsetScrollbars']) {
  return value === true ? 'xy' : value || undefined
}

export { defaultProps, varsResolver, toOffsetScrollbars }
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import { useProps, useStyles } from '../../core'
import { ScrollAreaCorner } from './ScrollAreaCorner/ScrollAreaCorner'
import { ScrollAreaRoot } from './ScrollAreaRoot/ScrollAreaRoot'
import { ScrollAreaScrollbar } from './ScrollAreaScrollbar/ScrollAreaScrollbar'
import { ScrollAreaThumb } from './ScrollAreaThumb/ScrollAreaThumb'
import { ScrollAreaViewport } from './ScrollAreaViewport/ScrollAreaViewport'
import type { ScrollAreaEmits, ScrollAreaSlots } from './ScrollArea.props.types'
import classes from './ScrollArea.module.css'

defineOptions({
  name: 'ScrollArea',
  inheritAttrs: false,
})

/**
Intentionally undefined to preserve downstream defaults
 */
const rawProps = withDefaults(defineProps<ScrollAreaOwnProps>(), {
  scrollbars: undefined,
  offsetScrollbars: undefined,
  unstyled: false,
})

defineSlots<ScrollAreaSlots>()

const emit = defineEmits<ScrollAreaEmits>()

const attrs = useAttrs()
const props = useProps('ScrollArea', defaultProps, rawProps)

const viewport = ref<HTMLDivElement | null>(null)
const content = ref<HTMLDivElement | null>(null)
const hovered = ref(false)
const scrollingX = ref(false)
const scrollingY = ref(false)
const overflowX = ref(false)
const overflowY = ref(false)

/** Edge flags, so `onBottomReached` and friends fire once per arrival. */
const prevAtTop = ref(true)
const prevAtBottom = ref(false)
const prevAtLeft = ref(true)
const prevAtRight = ref(false)
const prevScrollTop = ref(0)
const prevScrollLeft = ref(0)

let resizeObserver: ResizeObserver | null = null
let scrollTimerX: number | null = null
let scrollTimerY: number | null = null
let hoverHideTimer: number | null = null

const getStyles = useStyles({
  name: 'ScrollArea',
  props,
  classes,
  className: attrs.class,
  style: attrs.style as any,
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
  varsResolver,
})

function updateOverflow() {
  if (!viewport.value) {
    overflowX.value = false
    overflowY.value = false
    return
  }

  overflowX.value = viewport.value.offsetWidth < viewport.value.scrollWidth
  overflowY.value = viewport.value.offsetHeight < viewport.value.scrollHeight
}

function observeOverflow() {
  resizeObserver?.disconnect()
  resizeObserver = null

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateOverflow)

    if (viewport.value) {
      resizeObserver.observe(viewport.value)
    }

    if (content.value) {
      resizeObserver.observe(content.value)
    }
  }

  updateOverflow()
}

/** `type: 'scroll'` shows a scrollbar only while that axis is actually moving. */
function setScrolling(axis: 'x' | 'y') {
  const current = axis === 'x' ? scrollingX : scrollingY
  const currentTimer = axis === 'x' ? scrollTimerX : scrollTimerY

  current.value = true

  if (currentTimer) {
    window.clearTimeout(currentTimer)
  }

  const nextTimer = window.setTimeout(() => {
    current.value = false
  }, props.scrollHideDelay)

  if (axis === 'x') {
    scrollTimerX = nextTimer
  } else {
    scrollTimerY = nextTimer
  }
}

function getScrollbarState(orientation: 'horizontal' | 'vertical') {
  const isHorizontal = orientation === 'horizontal'
  const hasOverflow = isHorizontal ? overflowX.value : overflowY.value

  if (props.type === 'always') {
    return 'visible'
  }

  if (props.type === 'auto') {
    return hasOverflow ? 'visible' : 'hidden'
  }

  if (props.type === 'hover') {
    return hovered.value && hasOverflow ? 'visible' : 'hidden'
  }

  if (props.type === 'scroll') {
    return (isHorizontal ? scrollingX.value : scrollingY.value) && hasOverflow
      ? 'visible'
      : 'hidden'
  }

  return 'hidden'
}

watch([viewport, content], observeOverflow, { flush: 'post' })

onMounted(async () => {
  await nextTick()
  observeOverflow()

  if (props.startScrollPosition && viewport.value) {
    viewport.value.scrollTo({
      left: props.startScrollPosition.x ?? 0,
      top: props.startScrollPosition.y ?? 0,
    })
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()

  if (scrollTimerX) window.clearTimeout(scrollTimerX)
  if (scrollTimerY) window.clearTimeout(scrollTimerY)
  if (hoverHideTimer) window.clearTimeout(hoverHideTimer)
})

function handleScroll(event: Event) {
  props.viewportProps?.onScroll?.(event)

  const node = event.currentTarget as HTMLDivElement
  emit('scroll-position-change', { x: node.scrollLeft, y: node.scrollTop })

  // Sub-pixel tolerance: fractional layout sizes keep the exact equality from holding.
  const isAtBottom = node.scrollTop - (node.scrollHeight - node.clientHeight) >= -0.8
  const isAtTop = node.scrollTop === 0
  const isAtRight = node.scrollLeft - (node.scrollWidth - node.clientWidth) >= -0.8
  const isAtLeft = node.scrollLeft === 0

  if (node.scrollLeft !== prevScrollLeft.value) setScrolling('x')
  if (node.scrollTop !== prevScrollTop.value) setScrolling('y')

  updateOverflow()

  if (isAtBottom && !prevAtBottom.value) emit('bottom-reached')
  if (isAtTop && !prevAtTop.value) emit('top-reached')
  if (isAtRight && !prevAtRight.value) emit('right-reached')
  if (isAtLeft && !prevAtLeft.value) emit('left-reached')

  prevAtBottom.value = isAtBottom
  prevAtTop.value = isAtTop
  prevAtRight.value = isAtRight
  prevAtLeft.value = isAtLeft
  prevScrollTop.value = node.scrollTop
  prevScrollLeft.value = node.scrollLeft
}

function onPointerenter(event: PointerEvent) {
  ;(attrs.onPointerenter as ((event: PointerEvent) => void) | undefined)?.(event)

  if (hoverHideTimer) {
    window.clearTimeout(hoverHideTimer)
  }

  hovered.value = true
}

function onPointerleave(event: PointerEvent) {
  ;(attrs.onPointerleave as ((event: PointerEvent) => void) | undefined)?.(event)

  hoverHideTimer = window.setTimeout(() => {
    hovered.value = false
  }, props.scrollHideDelay)
}

/**
 * `never` still mounts the scrollbars – they are hidden with `data-hidden` – so the
 * root is told `always` and the visibility is decided per scrollbar.
 */
const rootType = computed(() => (props.type === 'never' ? 'always' : props.type))

const showX = computed(() => props.scrollbars === 'xy' || props.scrollbars === 'x')
const showY = computed(() => props.scrollbars === 'xy' || props.scrollbars === 'y')
const hidden = computed(() => (props.type === 'never' ? true : undefined))

const viewportBindings = computed(() => ({
  ...props.viewportProps,
  ...getStyles('viewport', { style: props.viewportProps?.style }),
  'data-offset-scrollbars': toOffsetScrollbars(props.offsetScrollbars),
  'data-scrollbars': props.scrollbars || undefined,
  'data-vertical-scrollbar-position': props.verticalScrollbarPosition,
}))
</script>

<template>
  <ScrollAreaRoot
    v-bind="{ ...attrs, ...getStyles('root') }"
    :get-styles="getStyles"
    :type="rootType"
    :scroll-hide-delay="props.scrollHideDelay"
    :scrollbars="props.scrollbars"
    :mod="{ autosize: attrs['data-autosize'] === 'true' || attrs['data-autosize'] === true }"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
  >
    <ScrollAreaViewport
      v-bind="viewportBindings"
      @viewport-mounted="(node: HTMLDivElement | null) => (viewport = node)"
      @content-mounted="(node: HTMLDivElement | null) => (content = node)"
      @scroll="handleScroll"
    >
      <slot />
    </ScrollAreaViewport>

    <ScrollAreaScrollbar
      v-if="showX"
      v-bind="getStyles('scrollbar')"
      orientation="horizontal"
      :data-vertical-scrollbar-position="props.verticalScrollbarPosition"
      :data-hidden="hidden"
      :data-state="getScrollbarState('horizontal')"
      :force-mount="true"
    >
      <ScrollAreaThumb v-bind="getStyles('thumb')" />
    </ScrollAreaScrollbar>

    <ScrollAreaScrollbar
      v-if="showY"
      v-bind="getStyles('scrollbar')"
      orientation="vertical"
      :data-vertical-scrollbar-position="props.verticalScrollbarPosition"
      :data-hidden="hidden"
      :data-state="getScrollbarState('vertical')"
      :force-mount="true"
    >
      <ScrollAreaThumb v-bind="getStyles('thumb')" />
    </ScrollAreaScrollbar>

    <ScrollAreaCorner
      v-bind="getStyles('corner')"
      :data-vertical-scrollbar-position="props.verticalScrollbarPosition"
      :data-hidden="hidden"
    />
  </ScrollAreaRoot>
</template>
