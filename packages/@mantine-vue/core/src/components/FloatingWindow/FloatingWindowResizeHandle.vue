<script lang="ts">
/** Pixels the window grows or shrinks by with each arrow key press. */
const KEYBOARD_STEP = 10

/**
 * Clamps a dimension to the configured bounds and, when the window is constrained, to
 * the space left in the viewport.
 */
function clampDimension(
  value: number,
  min: number | undefined,
  max: number | undefined,
  viewportMax: number | undefined,
) {
  let result = value

  if (min != null) {
    result = Math.max(result, min)
  }

  if (max != null) {
    result = Math.min(result, max)
  }

  if (viewportMax != null) {
    result = Math.min(result, viewportMax)
  }

  return result
}

export { KEYBOARD_STEP, clampDimension }
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, useAttrs } from 'vue'
import { Box } from '../../core'
import { useFloatingWindowContext } from './FloatingWindow.context'
import type {
  FloatingWindowResizeHandleOwnProps,
  FloatingWindowResizeHandleSlots,
} from './FloatingWindowResizeHandle.types'

defineOptions({
  name: 'FloatingWindowResizeHandle',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FloatingWindowResizeHandleOwnProps>(), {
  ariaLabel: 'Resize window',
  tabindex: 0,
})

defineSlots<FloatingWindowResizeHandleSlots>()

const emit = defineEmits<{ keydown: [event: KeyboardEvent] }>()

const attrs = useAttrs()
const ctx = useFloatingWindowContext()

/**
 * Plain locals rather than refs: none of this drives the render, and a resize runs at
 * pointer-move frequency.
 */
let handle: HTMLElement | null = null
let isResizing = false
let startX = 0
let startY = 0
let startWidth = 0
let startHeight = 0

/** An axis is resizable only if some bound was configured for it. */
const hasWidth = () =>
  ctx.dimensions?.initialWidth != null ||
  ctx.dimensions?.minWidth != null ||
  ctx.dimensions?.maxWidth != null

const hasHeight = () =>
  ctx.dimensions?.initialHeight != null ||
  ctx.dimensions?.minHeight != null ||
  ctx.dimensions?.maxHeight != null

/** Writes the size straight to the element: a reactive round-trip would lag the pointer. */
function applySize(width: number | null, height: number | null) {
  const root = ctx.rootRef.value

  if (!root || (width === null && height === null)) {
    return
  }

  const rect = root.getBoundingClientRect()
  const offset = ctx.constrainOffset ?? 0

  // The handle is at the bottom right, so the window can only grow into the space
  // between its top left corner and the viewport edge.
  const maxViewportWidth = ctx.constrainToViewport
    ? window.innerWidth - rect.left - offset
    : undefined
  const maxViewportHeight = ctx.constrainToViewport
    ? window.innerHeight - rect.top - offset
    : undefined

  if (width !== null) {
    root.style.width = `${clampDimension(
      width,
      ctx.dimensions?.minWidth,
      ctx.dimensions?.maxWidth,
      maxViewportWidth,
    )}px`
  }

  if (height !== null) {
    root.style.height = `${clampDimension(
      height,
      ctx.dimensions?.minHeight,
      ctx.dimensions?.maxHeight,
      maxViewportHeight,
    )}px`
  }

  // Read back, so the reported size reflects the clamping.
  const resized = root.getBoundingClientRect()

  if (width !== null) {
    handle?.setAttribute('aria-valuenow', String(Math.round(resized.width)))
  }

  ctx.onSizeChange({ width: resized.width, height: resized.height })
}

function end() {
  if (!isResizing) {
    return
  }

  isResizing = false
  document.body.style.userSelect = ''
  document.body.style.webkitUserSelect = ''
  ctx.onResizeEnd()
  document.removeEventListener('mousemove', move)
  document.removeEventListener('mouseup', end)
  document.removeEventListener('touchmove', move)
  document.removeEventListener('touchend', end)
  document.removeEventListener('touchcancel', end)
}

function move(event: MouseEvent | TouchEvent) {
  if (!isResizing) {
    return
  }

  event.preventDefault()
  const point = 'touches' in event ? event.touches[0] : event

  applySize(
    hasWidth() ? startWidth + point.clientX - startX : null,
    hasHeight() ? startHeight + point.clientY - startY : null,
  )
}

function start(event: MouseEvent | TouchEvent) {
  if ('button' in event && event.button !== 0) {
    return
  }

  // The handle sits inside the window, whose own mousedown starts a drag.
  event.stopPropagation()
  event.preventDefault()

  if (!hasWidth() && !hasHeight()) {
    return
  }

  const root = ctx.rootRef.value

  if (!root) {
    return
  }

  const point = 'touches' in event ? event.touches[0] : event
  const rect = root.getBoundingClientRect()
  startX = point.clientX
  startY = point.clientY
  startWidth = rect.width
  startHeight = rect.height
  isResizing = true
  document.body.style.userSelect = 'none'
  document.body.style.webkitUserSelect = 'none'
  ctx.onResizeStart()

  // Bound on the document so a fast drag that leaves the handle still resizes.
  document.addEventListener('mousemove', move)
  document.addEventListener('mouseup', end)
  document.addEventListener('touchmove', move, { passive: false })
  document.addEventListener('touchend', end)
  document.addEventListener('touchcancel', end)
}

function onKeydown(event: KeyboardEvent) {
  emit('keydown', event)

  if (event.defaultPrevented) {
    return
  }

  const root = ctx.rootRef.value

  if (!root) {
    return
  }

  const rect = root.getBoundingClientRect()
  let width: number | null = null
  let height: number | null = null

  if (event.key === 'ArrowRight' && hasWidth()) {
    width = rect.width + KEYBOARD_STEP
  } else if (event.key === 'ArrowLeft' && hasWidth()) {
    width = rect.width - KEYBOARD_STEP
  } else if (event.key === 'ArrowDown' && hasHeight()) {
    height = rect.height + KEYBOARD_STEP
  } else if (event.key === 'ArrowUp' && hasHeight()) {
    height = rect.height - KEYBOARD_STEP
  } else if (event.key === 'Home') {
    // Home and End jump to the configured extremes on both axes at once.
    if (hasWidth()) {
      width = ctx.dimensions?.minWidth ?? rect.width
    }

    if (hasHeight()) {
      height = ctx.dimensions?.minHeight ?? rect.height
    }
  } else if (event.key === 'End') {
    if (hasWidth()) {
      width = ctx.dimensions?.maxWidth ?? rect.width
    }

    if (hasHeight()) {
      height = ctx.dimensions?.maxHeight ?? rect.height
    }
  }

  if (width !== null || height !== null) {
    event.preventDefault()
    applySize(width, height)
  }
}

onMounted(() => {
  // `applySize` has not run yet, so the initial announced value is set here.
  if (hasWidth() && ctx.dimensions?.initialWidth != null) {
    handle?.setAttribute(
      'aria-valuenow',
      String(
        Math.round(
          clampDimension(
            ctx.dimensions.initialWidth,
            ctx.dimensions.minWidth,
            ctx.dimensions.maxWidth,
            undefined,
          ),
        ),
      ),
    )
  }
})

// A resize in progress when the handle unmounts would leave the document listeners
// and the disabled text selection behind.
onBeforeUnmount(end)

function setHandleRef(node: any) {
  handle = node?.$el ?? node
}

const ariaLabel = computed(() => (attrs as any)['aria-label'] ?? props.ariaLabel)

const handleStyle = computed(() => [{ touchAction: 'none' }, attrs.style])
</script>

<template>
  <Box
    :ref="setHandleRef"
    v-bind="attrs"
    role="separator"
    :aria-label="ariaLabel"
    :aria-valuemin="ctx.dimensions?.minWidth"
    :aria-valuemax="ctx.dimensions?.maxWidth"
    :tabindex="props.tabindex"
    :style="handleStyle"
    @mousedown="start"
    @touchstart="start"
    @keydown="onKeydown"
  >
    <slot />
  </Box>
</template>
