import { onBeforeUnmount } from 'vue'

export type UseLongPressEvent = 'mouse' | 'touch'
export interface UseLongPressOptions {
  threshold?: number
  events?: UseLongPressEvent[]
  cancelOnMove?: boolean | number
  onStart?: (event: MouseEvent | TouchEvent) => void
  onFinish?: (event: MouseEvent | TouchEvent) => void
  onCancel?: (event: MouseEvent | TouchEvent) => void
}
export interface UseLongPressReturnValue {
  onMousedown?: (event: MouseEvent) => void
  onMouseup?: (event: MouseEvent) => void
  onMouseleave?: (event: MouseEvent) => void
  onMousemove?: (event: MouseEvent) => void
  onTouchstart?: (event: TouchEvent) => void
  onTouchend?: (event: TouchEvent) => void
  onTouchcancel?: (event: TouchEvent) => void
  onTouchmove?: (event: TouchEvent) => void
}

const getPosition = (event: MouseEvent | TouchEvent) => {
  if ('touches' in event) {
    const touch = event.touches[0] ?? event.changedTouches[0]
    return touch ? { x: touch.clientX, y: touch.clientY } : null
  }
  return { x: event.clientX, y: event.clientY }
}

export function useLongPress(
  onLongPress: (event: MouseEvent | TouchEvent) => void,
  options: UseLongPressOptions = {},
): UseLongPressReturnValue {
  const events = options.events ?? ['mouse', 'touch']
  const threshold = options.threshold ?? 400
  const moveThreshold =
    options.cancelOnMove === true
      ? 10
      : typeof options.cancelOnMove === 'number'
        ? options.cancelOnMove
        : 0
  let timeout: ReturnType<typeof setTimeout> | undefined
  let active = false
  let pressed = false
  let startPosition: { x: number; y: number } | null = null

  const clear = () => {
    clearTimeout(timeout)
    timeout = undefined
  }
  const start = (event: MouseEvent | TouchEvent) => {
    options.onStart?.(event)
    startPosition = getPosition(event)
    pressed = true
    clear()
    timeout = setTimeout(() => {
      onLongPress(event)
      active = true
    }, threshold)
  }
  const cancel = (event: MouseEvent | TouchEvent) => {
    if (active) options.onFinish?.(event)
    else if (pressed) options.onCancel?.(event)
    active = false
    pressed = false
    startPosition = null
    clear()
  }
  const move = (event: MouseEvent | TouchEvent) => {
    if (!options.cancelOnMove || !pressed || active || !startPosition) return
    const current = getPosition(event)
    if (!current) return
    if (Math.hypot(current.x - startPosition.x, current.y - startPosition.y) > moveThreshold)
      cancel(event)
  }

  onBeforeUnmount(clear)
  return {
    ...(events.includes('mouse')
      ? {
          onMousedown: start,
          onMouseup: cancel,
          onMouseleave: cancel,
          ...(options.cancelOnMove ? { onMousemove: move } : {}),
        }
      : {}),
    ...(events.includes('touch')
      ? {
          onTouchstart: start,
          onTouchend: cancel,
          onTouchcancel: cancel,
          ...(options.cancelOnMove ? { onTouchmove: move } : {}),
        }
      : {}),
  }
}
