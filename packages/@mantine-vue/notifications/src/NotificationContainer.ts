import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
  type CSSProperties,
  type PropType,
} from 'vue'
import { Notification } from '@mantine-vue/core'
import { getAutoClose } from './get-auto-close/get-auto-close'
import type { NotificationData } from './notifications.store'

const SCROLL_DISMISS_RESET_TIMEOUT = 120

function normalizeStyle(style: any): Record<string, any> {
  if (!style) return {}
  if (Array.isArray(style)) {
    return style.reduce<Record<string, any>>(
      (acc, item) => Object.assign(acc, normalizeStyle(item)),
      {},
    )
  }
  return typeof style === 'object' ? style : {}
}

function renderContent(value: any) {
  return typeof value === 'function' ? value() : value
}

function getNotificationProps(data: NotificationData) {
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
  ])

  return Object.entries(data).reduce<Record<string, any>>((acc, [key, value]) => {
    if (!omittedKeys.has(key)) {
      acc[key] = value
    }

    return acc
  }, {})
}

export const NotificationContainer = defineComponent({
  name: 'NotificationContainer',
  inheritAttrs: false,
  props: {
    data: { type: Object as PropType<NotificationData>, required: true },
    autoClose: { type: [Boolean, Number] as PropType<number | false>, required: true },
    transitionDuration: { type: Number, required: true },
    allowDragDismiss: { type: Boolean, required: true },
    allowScrollDismiss: { type: Boolean, required: true },
    paused: { type: Boolean, required: true },
    onHide: { type: Function as PropType<(id: string) => void>, required: true },
    onHoverStart: { type: Function as PropType<() => void>, default: undefined },
    onHoverEnd: { type: Function as PropType<() => void>, default: undefined },
  },
  setup(props, { attrs }) {
    const notificationRef = ref<HTMLElement | null>(null)
    const offset = ref(0)
    const dismissed = ref(false)
    const dismissDirection = ref<-1 | 1>(1)
    const active = ref(false)
    const scrollDismissActive = ref(false)
    const hovered = ref(false)
    const startX = ref(0)
    const startTime = ref(0)
    let autoCloseTimeout = -1
    let hideTimeout = -1
    let scrollDismissTimeout = -1

    const autoCloseDuration = computed(() => getAutoClose(props.autoClose, props.data.autoClose))
    const isCloseDisabled = computed(() => props.data.allowClose === false)

    const cancelAutoClose = () => window.clearTimeout(autoCloseTimeout)
    const cancelHide = () => window.clearTimeout(hideTimeout)
    const cancelScrollDismissReset = () => window.clearTimeout(scrollDismissTimeout)

    const setSwipeOffset = (value: number) => {
      offset.value = value
    }

    const handleHide = () => {
      props.onHide(props.data.id!)
      cancelAutoClose()
      cancelHide()
      cancelScrollDismissReset()
    }

    const handleAutoClose = () => {
      if (
        typeof window === 'undefined' ||
        dismissed.value ||
        active.value ||
        props.paused ||
        hovered.value ||
        typeof autoCloseDuration.value !== 'number'
      ) {
        return
      }

      cancelAutoClose()
      autoCloseTimeout = window.setTimeout(handleHide, autoCloseDuration.value)
    }

    const getExitOffset = (direction: -1 | 1) => {
      const width = notificationRef.value?.offsetWidth ?? 440
      return direction * (width + 40)
    }

    const shouldDismiss = (movement: number, velocity: number) => {
      const width = notificationRef.value?.offsetWidth ?? 440
      return Math.abs(movement) > width * 0.35 || velocity > 0.5
    }

    const resetSwipe = () => {
      cancelScrollDismissReset()
      scrollDismissActive.value = false
      setSwipeOffset(0)
    }

    const dismissNotification = (direction: -1 | 1) => {
      dismissDirection.value = direction
      dismissed.value = true
      scrollDismissActive.value = false
      setSwipeOffset(getExitOffset(direction))
      cancelAutoClose()
      cancelHide()
      cancelScrollDismissReset()
      hideTimeout = window.setTimeout(handleHide, props.transitionDuration)
    }

    const scheduleScrollDismissReset = () => {
      cancelScrollDismissReset()
      scrollDismissTimeout = window.setTimeout(() => {
        scrollDismissActive.value = false
        setSwipeOffset(0)
        handleAutoClose()
      }, SCROLL_DISMISS_RESET_TIMEOUT)
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (!active.value || dismissed.value) {
        return
      }

      setSwipeOffset(event.clientX - startX.value)
    }

    const finishPointerDrag = (event: PointerEvent) => {
      if (!active.value) {
        return
      }

      active.value = false
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', finishPointerDrag)
      window.removeEventListener('pointercancel', cancelPointerDragEvent)

      const movement = event.clientX - startX.value
      const elapsed = Math.max(Date.now() - startTime.value, 1)
      const velocity = Math.abs(movement) / elapsed
      const direction = movement === 0 ? 1 : movement > 0 ? 1 : -1

      if (shouldDismiss(movement, velocity)) {
        dismissNotification(direction)
      } else {
        setSwipeOffset(0)
        handleAutoClose()
      }
    }

    function cancelPointerDrag(shouldRestartAutoClose = true) {
      active.value = false
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', finishPointerDrag)
      window.removeEventListener('pointercancel', cancelPointerDragEvent)
      setSwipeOffset(0)
      if (shouldRestartAutoClose) {
        handleAutoClose()
      }
    }

    const cancelPointerDragEvent = () => cancelPointerDrag()

    const handlePointerDown = (event: PointerEvent) => {
      if (
        !props.allowDragDismiss ||
        isCloseDisabled.value ||
        dismissed.value ||
        event.button !== 0
      ) {
        return
      }

      cancelAutoClose()
      active.value = true
      startX.value = event.clientX
      startTime.value = Date.now()
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', finishPointerDrag)
      window.addEventListener('pointercancel', cancelPointerDragEvent)
    }

    const handleWheel = (event: WheelEvent) => {
      if (dismissed.value || active.value) {
        return
      }

      const isDocumentEvent = event.currentTarget === document
      if (!isDocumentEvent && !hovered.value) {
        return
      }

      const { deltaX, deltaY } = event
      if (Math.abs(deltaX) <= Math.abs(deltaY) || deltaX === 0) {
        return
      }

      if (!props.allowScrollDismiss || isCloseDisabled.value) {
        return
      }

      if (!isDocumentEvent) {
        event.preventDefault()
        event.stopPropagation()
      }

      cancelAutoClose()
      scrollDismissActive.value = true

      const nextOffset = offset.value - deltaX
      const direction = nextOffset > 0 ? 1 : -1

      if (shouldDismiss(nextOffset, 0)) {
        dismissNotification(direction)
        return
      }

      setSwipeOffset(nextOffset)
      scheduleScrollDismissReset()
    }

    const handleMouseEnter = () => {
      hovered.value = true
      cancelAutoClose()
      props.onHoverStart?.()
    }

    const handleMouseLeave = () => {
      hovered.value = false

      if (!scrollDismissActive.value) {
        resetSwipe()
        handleAutoClose()
      }

      props.onHoverEnd?.()
    }

    const handleResize = () => {
      if (dismissed.value) {
        setSwipeOffset(getExitOffset(dismissDirection.value))
      }
    }

    watch(
      () => scrollDismissActive.value,
      (value, _, onCleanup) => {
        if (!value) {
          return
        }

        document.addEventListener('wheel', handleWheel, { passive: false })
        onCleanup(() => document.removeEventListener('wheel', handleWheel))
      },
    )

    watch(
      [autoCloseDuration, active, dismissed, () => props.paused],
      () => {
        if (props.paused) {
          cancelAutoClose()
        } else {
          handleAutoClose()
        }
      },
      { immediate: true },
    )

    onMounted(() => {
      props.data.onOpen?.(props.data)
      notificationRef.value?.addEventListener('wheel', handleWheel, { passive: false })
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      cancelAutoClose()
      cancelHide()
      cancelScrollDismissReset()
      cancelPointerDrag(false)
      notificationRef.value?.removeEventListener('wheel', handleWheel)
      window.removeEventListener('resize', handleResize)
    })

    return () => {
      const resolvedAttrsStyle = normalizeStyle(attrs.style)
      const resolvedDataStyle = normalizeStyle(props.data.style)
      const baseStyle = { ...resolvedAttrsStyle, ...resolvedDataStyle }
      const baseOpacity = typeof baseStyle.opacity === 'number' ? baseStyle.opacity : 1
      const swipeOpacity = dismissed.value ? 0 : 1 - Math.min(Math.abs(offset.value) / 200, 1) * 0.6
      const resolvedTransitionDuration =
        baseStyle.transitionDuration ??
        `${props.transitionDuration}ms, ${props.transitionDuration}ms, ${props.transitionDuration}ms`
      const notificationStyle: CSSProperties = {
        ...baseStyle,
        '--notifications-state-transform':
          typeof baseStyle.transform === 'string' ? baseStyle.transform : 'translateX(0)',
        '--notifications-state-opacity': String(baseOpacity),
        '--notifications-swipe-offset': `${offset.value}px`,
        '--notifications-swipe-opacity': String(swipeOpacity),
        transform:
          'var(--notifications-state-transform) translate3d(var(--notifications-swipe-offset), 0, 0)',
        opacity: 'calc(var(--notifications-state-opacity) * var(--notifications-swipe-opacity))',
        transitionDuration:
          active.value || scrollDismissActive.value ? '0ms, 0ms, 0ms' : resolvedTransitionDuration,
        cursor: 'default',
        touchAction: 'pan-y',
      } as CSSProperties

      return h(
        Notification,
        {
          ...attrs,
          ...getNotificationProps(props.data),
          ref: (node: any) => {
            notificationRef.value = node?.$el ?? node
          },
          style: notificationStyle,
          withCloseButton: isCloseDisabled.value ? false : props.data.withCloseButton,
          onClose: handleHide,
          onMouseenter: handleMouseEnter,
          onMouseleave: handleMouseLeave,
          onPointerdown: handlePointerDown,
        },
        () => renderContent(props.data.message),
      )
    }
  },
})
