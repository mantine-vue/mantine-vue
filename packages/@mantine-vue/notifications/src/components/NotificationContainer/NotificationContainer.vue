<script setup lang="ts">
import {
  cloneVNode,
  computed,
  isVNode,
  onBeforeUnmount,
  onMounted,
  ref,
  useAttrs,
  watch,
  type CSSProperties,
} from 'vue'
import { Notification } from '@mantine-vue/core'
import { getAutoClose } from '../../get-auto-close/get-auto-close'
import type {
  NotificationContainerEmits,
  NotificationContainerProps,
} from './NotificationContainer.types'

defineOptions({ name: 'NotificationContainer', inheritAttrs: false })

const props = defineProps<NotificationContainerProps>()
const emit = defineEmits<NotificationContainerEmits>()
const attrs = useAttrs()
const SCROLL_DISMISS_RESET_TIMEOUT = 120
const MAX_VISIBLE_STACK_DEPTH = 4

const notificationRef = ref<HTMLElement | null>(null)
const offset = ref(0)
const dismissed = ref(false)
const dismissDirection = ref<-1 | 1>(1)
const active = ref(false)
const scrollDismissActive = ref(false)
const hovered = ref(false)
const focused = ref(false)
const contributedActive = ref(false)
const startX = ref(0)
const startTime = ref(0)
let autoCloseTimeout = -1
let hideTimeout = -1
let scrollDismissTimeout = -1
let resizeObserver: ResizeObserver | undefined

const autoCloseDuration = computed(() => getAutoClose(props.autoClose, props.data.autoClose))
const isCloseDisabled = computed(() => props.data.allowClose === false)

function normalizeStyle(style: any): Record<string, any> {
  if (!style) return {}
  if (Array.isArray(style)) {
    return style.reduce<Record<string, any>>(
      (accumulator, item) => Object.assign(accumulator, normalizeStyle(item)),
      {},
    )
  }
  return typeof style === 'object' ? style : {}
}

function getNotificationProps() {
  const omittedKeys = new Set([
    'autoClose',
    'message',
    'allowClose',
    'position',
    'style',
    'withCloseButton',
    'onOpen',
    'onClose',
    'id',
    'renderNotification',
    'priority',
    '__sequence',
  ])
  return Object.fromEntries(
    Object.entries(props.data)
      .filter(([key]) => !omittedKeys.has(key))
      .map(([key, value]) => [key, cloneRenderable(value)]),
  )
}

function cloneRenderable(value: any): any {
  if (isVNode(value)) return cloneVNode(value)
  if (Array.isArray(value)) return value.map(cloneRenderable)
  return value
}

const renderMessage = () =>
  cloneRenderable(
    typeof props.data.message === 'function' ? props.data.message() : props.data.message,
  )

const renderCustomNotification = () => cloneRenderable(props.renderNotification?.(props.data))

const notificationStyle = computed<CSSProperties>(() => {
  const baseStyle = { ...normalizeStyle(attrs.style), ...normalizeStyle(props.data.style) }
  const baseOpacity = typeof baseStyle.opacity === 'number' ? baseStyle.opacity : 1
  const swipeOpacity = dismissed.value ? 0 : 1 - Math.min(Math.abs(offset.value) / 200, 1) * 0.6
  const transitionDuration =
    baseStyle.transitionDuration ??
    `${props.transitionDuration}ms, ${props.transitionDuration}ms, ${props.transitionDuration}ms`

  const isStackedLayout = props.layout === 'stacked'
  const isStacked = isStackedLayout && (props.stackIndex ?? 0) > 0
  const isCollapsed = isStacked && !props.stackExpanded
  const isExiting = props.transitionState === 'exiting' || props.transitionState === 'exited'
  const stackDirection = props.stackPosition?.startsWith('top') ? 1 : -1
  const stackDepth = Math.min(props.stackIndex ?? 0, MAX_VISIBLE_STACK_DEPTH)
  const collapsedOffset = isCollapsed ? stackDepth * 10 * stackDirection : 0
  const staggerDelay = isStackedLayout ? (props.stackIndex ?? 0) * 30 : 0
  const isDragging = active.value || scrollDismissActive.value

  let transform =
    'var(--notifications-state-transform) translate3d(var(--notifications-swipe-offset), 0, 0)'

  if (isStackedLayout) {
    if (isExiting) {
      const exitOffset = props.stackExpanded ? (props.stackExpandedOffset ?? 0) : collapsedOffset
      transform = `translateY(${exitOffset}px) ${transform}`
    } else if (props.stackExpanded) {
      transform = `translateY(${props.stackExpandedOffset ?? 0}px) translate3d(var(--notifications-swipe-offset), 0, 0)`
    } else if (isStacked) {
      transform = `scale(${1 - stackDepth * 0.03}) translateY(${collapsedOffset}px)`
    }
  }

  return {
    ...baseStyle,
    ...(isStackedLayout ? { maxHeight: undefined } : {}),
    '--notifications-state-transform':
      typeof baseStyle.transform === 'string' ? baseStyle.transform : 'translateX(0)',
    '--notifications-state-opacity': String(baseOpacity),
    '--notifications-swipe-offset': `${offset.value}px`,
    '--notifications-swipe-opacity': String(swipeOpacity),
    transform,
    opacity: 'calc(var(--notifications-state-opacity) * var(--notifications-swipe-opacity))',
    transitionDuration: isDragging ? '0ms, 0ms, 0ms' : transitionDuration,
    cursor: 'default',
    touchAction: 'pan-y',
    ...(isStackedLayout
      ? {
          gridArea: '1 / 1',
          zIndex: (props.stackSize ?? 5) - (props.stackIndex ?? 0),
          pointerEvents: isCollapsed ? ('none' as const) : undefined,
          alignSelf: stackDirection === 1 ? ('start' as const) : ('end' as const),
          transition: isDragging
            ? 'none'
            : `transform ${props.transitionDuration}ms cubic-bezier(.51,.3,0,1.21), opacity ${props.transitionDuration}ms ease`,
          transitionDelay: isDragging || isExiting ? '0ms' : `${staggerDelay}ms`,
        }
      : {}),
  }
})

const isCollapsed = computed(
  () => props.layout === 'stacked' && (props.stackIndex ?? 0) > 0 && !props.stackExpanded,
)

const cancelAutoClose = () => window.clearTimeout(autoCloseTimeout)
const cancelHide = () => window.clearTimeout(hideTimeout)
const cancelScrollDismissReset = () => window.clearTimeout(scrollDismissTimeout)

function handleHide() {
  emit('hide', props.data.id!)
  cancelAutoClose()
  cancelHide()
  cancelScrollDismissReset()
}

function handleAutoClose() {
  if (
    typeof window === 'undefined' ||
    dismissed.value ||
    active.value ||
    props.paused ||
    hovered.value ||
    focused.value ||
    typeof autoCloseDuration.value !== 'number'
  )
    return

  cancelAutoClose()
  autoCloseTimeout = window.setTimeout(handleHide, autoCloseDuration.value)
}

function getExitOffset(direction: -1 | 1) {
  return direction * ((notificationRef.value?.offsetWidth ?? 440) + 40)
}

function shouldDismiss(movement: number, velocity: number) {
  return Math.abs(movement) > (notificationRef.value?.offsetWidth ?? 440) * 0.35 || velocity > 0.5
}

function resetSwipe() {
  cancelScrollDismissReset()
  scrollDismissActive.value = false
  offset.value = 0
}

function dismissNotification(direction: -1 | 1) {
  dismissDirection.value = direction
  dismissed.value = true
  scrollDismissActive.value = false
  offset.value = getExitOffset(direction)
  cancelAutoClose()
  cancelHide()
  cancelScrollDismissReset()
  hideTimeout = window.setTimeout(handleHide, props.transitionDuration)
}

function scheduleScrollDismissReset() {
  cancelScrollDismissReset()
  scrollDismissTimeout = window.setTimeout(() => {
    scrollDismissActive.value = false
    offset.value = 0
    handleAutoClose()
  }, SCROLL_DISMISS_RESET_TIMEOUT)
}

function handlePointerMove(event: PointerEvent) {
  if (active.value && !dismissed.value) offset.value = event.clientX - startX.value
}

function finishPointerDrag(event: PointerEvent) {
  if (!active.value) return
  active.value = false
  removePointerListeners()
  const movement = event.clientX - startX.value
  const velocity = Math.abs(movement) / Math.max(Date.now() - startTime.value, 1)
  if (shouldDismiss(movement, velocity)) dismissNotification(movement >= 0 ? 1 : -1)
  else {
    offset.value = 0
    handleAutoClose()
  }
}

function removePointerListeners() {
  window.removeEventListener('pointermove', handlePointerMove)
  window.removeEventListener('pointerup', finishPointerDrag)
  window.removeEventListener('pointercancel', cancelPointerDragEvent)
}

function cancelPointerDrag(restartAutoClose = true) {
  active.value = false
  removePointerListeners()
  offset.value = 0
  if (restartAutoClose) handleAutoClose()
}

const cancelPointerDragEvent = () => cancelPointerDrag()

function handlePointerDown(event: PointerEvent) {
  if (!props.allowDragDismiss || isCloseDisabled.value || dismissed.value || event.button !== 0)
    return
  cancelAutoClose()
  active.value = true
  startX.value = event.clientX
  startTime.value = Date.now()
  window.addEventListener('pointermove', handlePointerMove)
  window.addEventListener('pointerup', finishPointerDrag)
  window.addEventListener('pointercancel', cancelPointerDragEvent)
}

function handleWheel(event: WheelEvent) {
  if (dismissed.value || active.value) return
  const documentEvent = event.currentTarget === document
  if ((!documentEvent && !hovered.value) || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
  if (!props.allowScrollDismiss || isCloseDisabled.value) return
  if (!documentEvent) {
    event.preventDefault()
    event.stopPropagation()
  }
  cancelAutoClose()
  scrollDismissActive.value = true
  const nextOffset = offset.value - event.deltaX
  if (shouldDismiss(nextOffset, 0)) dismissNotification(nextOffset > 0 ? 1 : -1)
  else {
    offset.value = nextOffset
    scheduleScrollDismissReset()
  }
}

function handleMouseEnter() {
  hovered.value = true
  cancelAutoClose()
  syncActiveContribution()
}

function syncActiveContribution() {
  const isActive = hovered.value || focused.value
  if (isActive && !contributedActive.value) {
    contributedActive.value = true
    emit('hoverStart')
  } else if (!isActive && contributedActive.value) {
    contributedActive.value = false
    emit('hoverEnd')
  }
}

function handleFocusIn() {
  if (props.layout !== 'stacked') return
  focused.value = true
  cancelAutoClose()
  syncActiveContribution()
}

function handleFocusOut(event: FocusEvent) {
  if (props.layout !== 'stacked') return
  const next = event.relatedTarget as Node | null
  if (next && notificationRef.value?.contains(next)) return
  focused.value = false
  if (!scrollDismissActive.value) handleAutoClose()
  syncActiveContribution()
}

function handlePointerDownCapture(event: PointerEvent) {
  if (
    props.layout === 'stacked' &&
    (event.pointerType === 'touch' || event.pointerType === 'pen')
  ) {
    emit('expandRequest')
  }
}

function handleMouseLeave() {
  hovered.value = false
  if (!scrollDismissActive.value) {
    resetSwipe()
    handleAutoClose()
  }
  syncActiveContribution()
}

watch(scrollDismissActive, (enabled, _, onCleanup) => {
  if (!enabled) return
  document.addEventListener('wheel', handleWheel, { passive: false })
  onCleanup(() => document.removeEventListener('wheel', handleWheel))
})

watch(
  [autoCloseDuration, active, dismissed, () => props.paused],
  () => {
    if (props.paused) cancelAutoClose()
    else handleAutoClose()
  },
  { immediate: true },
)

onMounted(() => {
  props.data.onOpen?.(props.data)
  notificationRef.value?.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('resize', handleResize)
  if (notificationRef.value) {
    emit('heightChange', notificationRef.value.offsetHeight)
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        if (notificationRef.value) emit('heightChange', notificationRef.value.offsetHeight)
      })
      resizeObserver.observe(notificationRef.value)
    }
  }
})

function handleResize() {
  if (dismissed.value) offset.value = getExitOffset(dismissDirection.value)
}

onBeforeUnmount(() => {
  hovered.value = false
  focused.value = false
  syncActiveContribution()
  cancelAutoClose()
  cancelHide()
  cancelScrollDismissReset()
  cancelPointerDrag(false)
  notificationRef.value?.removeEventListener('wheel', handleWheel)
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
})

function setNotificationRef(node: any) {
  notificationRef.value = node?.$el ?? node ?? null
}
</script>

<template>
  <div
    v-if="props.renderNotification"
    v-bind="attrs"
    :ref="setNotificationRef"
    :style="notificationStyle"
    :role="(attrs.role as string) || 'alert'"
    :inert="isCollapsed || undefined"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @pointerdown.capture="handlePointerDownCapture"
    @pointerdown="handlePointerDown"
  >
    <component :is="renderCustomNotification" />
  </div>
  <Notification
    v-else
    v-bind="{ ...attrs, ...getNotificationProps() }"
    :ref="setNotificationRef"
    :style="notificationStyle"
    :inert="isCollapsed || undefined"
    :with-close-button="isCloseDisabled ? false : props.data.withCloseButton"
    @close="handleHide"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
    @pointerdown.capture="handlePointerDownCapture"
    @pointerdown="handlePointerDown"
  >
    <component :is="renderMessage" />
  </Notification>
</template>
