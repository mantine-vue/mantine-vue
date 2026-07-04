import { ref } from 'vue'
import { useLongPress } from '@mantine-vue/hooks'

function call(handler: unknown, event: Event) {
  if (Array.isArray(handler)) handler.forEach((item) => typeof item === 'function' && item(event))
  else if (typeof handler === 'function') handler(event)
}

export function useContextMenuHandlers(options: {
  childProps: Record<string, any>
  disabled?: boolean
  opened: boolean
  longPressDelay?: number
  setReference: (node: object) => void
  open: () => void
}) {
  const touchActive = ref(false)
  const gestureHandled = ref(false)
  const touchTarget = ref<EventTarget | null>(null)
  const openAtPoint = (clientX: number, clientY: number, contextElement: object | null) => {
    options.setReference({
      getBoundingClientRect: () => ({
        x: clientX,
        y: clientY,
        width: 0,
        height: 0,
        top: clientY,
        left: clientX,
        right: clientX,
        bottom: clientY,
        toJSON: () => undefined,
      }),
      contextElement,
    })
    options.open()
  }
  const longPress = useLongPress(
    (event) => {
      if (options.disabled || gestureHandled.value || !('touches' in event)) return
      const touch = event.touches[0] ?? event.changedTouches[0]
      if (!touch) return
      openAtPoint(touch.clientX, touch.clientY, touchTarget.value as object | null)
      gestureHandled.value = true
    },
    {
      threshold: options.longPressDelay ?? 500,
      events: ['touch'],
      cancelOnMove: true,
      onStart: (event) => {
        touchActive.value = true
        gestureHandled.value = false
        touchTarget.value = event.currentTarget
      },
      onFinish: (event) => {
        touchActive.value = false
        gestureHandled.value = false
        if (!options.disabled) event.preventDefault()
      },
      onCancel: () => {
        touchActive.value = false
        gestureHandled.value = false
      },
    },
  )
  return {
    onMousedown: (event: MouseEvent) => {
      call(options.childProps.onMousedown ?? options.childProps.onMouseDown, event)
      if (!options.disabled && event.button === 2) event.stopPropagation()
    },
    onContextmenu: (event: MouseEvent) => {
      call(options.childProps.onContextmenu ?? options.childProps.onContextMenu, event)
      if (options.disabled || event.defaultPrevented) return
      event.preventDefault()
      if (gestureHandled.value) return
      openAtPoint(event.clientX, event.clientY, event.currentTarget)
      if (touchActive.value) gestureHandled.value = true
    },
    onTouchstart: (event: TouchEvent) => {
      call(options.childProps.onTouchstart ?? options.childProps.onTouchStart, event)
      longPress.onTouchstart?.(event)
    },
    onTouchend: (event: TouchEvent) => {
      call(options.childProps.onTouchend ?? options.childProps.onTouchEnd, event)
      longPress.onTouchend?.(event)
    },
    onTouchcancel: (event: TouchEvent) => {
      call(options.childProps.onTouchcancel ?? options.childProps.onTouchCancel, event)
      longPress.onTouchcancel?.(event)
    },
    onTouchmove: (event: TouchEvent) => {
      call(options.childProps.onTouchmove ?? options.childProps.onTouchMove, event)
      longPress.onTouchmove?.(event)
    },
    style: options.disabled
      ? options.childProps.style
      : {
          ...options.childProps.style,
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        },
    get 'data-expanded'() {
      return options.opened || undefined
    },
  }
}
