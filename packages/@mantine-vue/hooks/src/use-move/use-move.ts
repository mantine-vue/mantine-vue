import { onBeforeUnmount, onMounted, readonly, ref, type ComponentPublicInstance } from 'vue'

export interface UseMovePosition {
  x: number
  y: number
}
export interface UseMoveHandlers {
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function clampUseMovePosition(position: UseMovePosition) {
  return { x: clamp(position.x, 0, 1), y: clamp(position.y, 0, 1) }
}

export function useMove<T extends HTMLElement = HTMLElement>(
  onChange: (position: UseMovePosition) => void,
  handlers: UseMoveHandlers = {},
  dir: 'ltr' | 'rtl' = 'ltr',
) {
  const active = ref(false)
  let element: T | null = null
  let mounted = false
  let frame = 0

  const scrub = (x: number, y: number) => {
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(() => {
      if (!mounted || !element) return
      const rect = element.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const positionX = clamp((x - rect.left) / rect.width, 0, 1)
      onChange({
        x: dir === 'ltr' ? positionX : 1 - positionX,
        y: clamp((y - rect.top) / rect.height, 0, 1),
      })
    })
  }
  const mouseMove = (event: MouseEvent) => scrub(event.clientX, event.clientY)
  const touchMove = (event: TouchEvent) => {
    if (event.cancelable) event.preventDefault()
    const touch = event.changedTouches[0]
    if (touch) scrub(touch.clientX, touch.clientY)
  }
  const unbind = () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', stop)
    document.removeEventListener('touchmove', touchMove)
    document.removeEventListener('touchend', stop)
  }
  const stop = () => {
    if (!active.value) return
    active.value = false
    unbind()
    setTimeout(() => handlers.onScrubEnd?.(), 0)
  }
  const start = (event: MouseEvent | TouchEvent) => {
    if (!mounted) return
    if ('button' in event && event.button !== 0) return
    if (event.cancelable) event.preventDefault()
    active.value = true
    handlers.onScrubStart?.()
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', stop)
    document.addEventListener('touchmove', touchMove, { passive: false })
    document.addEventListener('touchend', stop)
    if ('changedTouches' in event) touchMove(event)
    else mouseMove(event)
  }
  const setRef = (node: Element | ComponentPublicInstance | null) => {
    const safeNode = node instanceof HTMLElement ? (node as T) : null
    element?.removeEventListener('mousedown', start)
    element?.removeEventListener('touchstart', start)
    element = safeNode
    element?.addEventListener('mousedown', start)
    element?.addEventListener('touchstart', start, { passive: false })
  }

  onMounted(() => {
    mounted = true
  })
  onBeforeUnmount(() => {
    mounted = false
    unbind()
    cancelAnimationFrame(frame)
    element?.removeEventListener('mousedown', start)
    element?.removeEventListener('touchstart', start)
  })
  return { ref: setRef, active: readonly(active) }
}
