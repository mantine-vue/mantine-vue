import {
  onBeforeUnmount,
  onMounted,
  readonly,
  ref,
  type ComponentPublicInstance,
  type Ref,
} from 'vue'

export interface FloatingWindowPositionConfig {
  top?: number
  left?: number
  right?: number
  bottom?: number
}

export interface FloatingWindowPosition {
  x: number
  y: number
}

export interface UseFloatingWindowOptions {
  enabled?: boolean
  constrainToViewport?: boolean
  constrainOffset?: number
  dragHandleSelector?: string
  excludeDragHandleSelector?: string
  axis?: 'x' | 'y'
  initialPosition?: FloatingWindowPositionConfig
  onPositionChange?: (position: FloatingWindowPosition) => void
  onDragStart?: () => void
  onDragEnd?: () => void
}

export type SetFloatingWindowPosition = (position: FloatingWindowPositionConfig) => void

function px(value: string) {
  return value.endsWith('px') ? parseFloat(value) : 0
}

function clampToViewport(x: number, y: number, element: HTMLElement, offset = 0) {
  const rect = element.getBoundingClientRect()
  return {
    x: Math.min(Math.max(offset, x), Math.max(offset, window.innerWidth - rect.width - offset)),
    y: Math.min(Math.max(offset, y), Math.max(offset, window.innerHeight - rect.height - offset)),
  }
}

function constrain(
  element: HTMLElement,
  position: FloatingWindowPosition,
  options: UseFloatingWindowOptions,
) {
  return options.constrainToViewport
    ? clampToViewport(position.x, position.y, element, options.constrainOffset)
    : position
}

function calculateInitialPosition(element: HTMLElement, options: UseFloatingWindowOptions) {
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const offset = options.constrainOffset ?? 0
  const initial = options.initialPosition ?? {}
  const x =
    initial.left ??
    (initial.right !== undefined
      ? window.innerWidth - rect.width - initial.right
      : px(style.left) || window.innerWidth - rect.width - px(style.right) || offset)
  const y =
    initial.top ??
    (initial.bottom !== undefined
      ? window.innerHeight - rect.height - initial.bottom
      : px(style.top) || window.innerHeight - rect.height - px(style.bottom) || offset)
  return constrain(element, { x, y }, options)
}

function excluded(target: Node, selector?: string) {
  return Boolean(selector && target instanceof Element && target.closest(selector))
}

function isHandle(
  element: HTMLElement,
  target: EventTarget | null,
  options: UseFloatingWindowOptions,
) {
  if (!(target instanceof Node) || excluded(target, options.excludeDragHandleSelector)) return false
  if (!options.dragHandleSelector) return true
  return Array.from(element.querySelectorAll(options.dragHandleSelector)).some((item) =>
    item.contains(target),
  )
}

export function useFloatingWindow<T extends HTMLElement>(options: UseFloatingWindowOptions = {}) {
  const element = ref<T | null>(null) as Ref<T | null>
  const isDragging = ref(false)
  let position = { x: 0, y: 0 }
  let pointerOffset = { x: 0, y: 0 }
  let observer: ResizeObserver | undefined

  const applyPosition = (next: FloatingWindowPosition, notify = true) => {
    if (!element.value) return
    position = constrain(element.value, next, options)
    element.value.style.left = `${position.x}px`
    element.value.style.top = `${position.y}px`
    element.value.style.right = 'unset'
    element.value.style.bottom = 'unset'
    if (notify) options.onPositionChange?.(position)
  }

  const setPosition: SetFloatingWindowPosition = (next) => {
    const node = element.value
    if (!node) return
    const rect = node.getBoundingClientRect()
    applyPosition({
      x:
        next.left ??
        (next.right !== undefined ? window.innerWidth - rect.width - next.right : position.x),
      y:
        next.top ??
        (next.bottom !== undefined ? window.innerHeight - rect.height - next.bottom : position.y),
    })
  }

  const end = () => {
    if (!isDragging.value) return
    isDragging.value = false
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    options.onDragEnd?.()
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', end)
    document.removeEventListener('touchmove', move)
    document.removeEventListener('touchend', end)
  }

  const move = (event: MouseEvent | TouchEvent) => {
    if (!isDragging.value || !element.value) return
    const point = 'touches' in event ? event.touches[0] : event
    event.preventDefault()
    const next = constrain(
      element.value,
      { x: point.clientX - pointerOffset.x, y: point.clientY - pointerOffset.y },
      options,
    )
    applyPosition({
      x: options.axis === 'y' ? position.x : next.x,
      y: options.axis === 'x' ? position.y : next.y,
    })
  }

  const start = (event: MouseEvent | TouchEvent) => {
    const node = element.value
    if (!node || options.enabled === false || !isHandle(node, event.target, options)) return
    if ('button' in event && event.button !== 0) return
    const point = 'touches' in event ? event.touches[0] : event
    const rect = node.getBoundingClientRect()
    pointerOffset = { x: point.clientX - rect.left, y: point.clientY - rect.top }
    isDragging.value = true
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
    options.onDragStart?.()
    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', end)
    document.addEventListener('touchmove', move, { passive: false })
    document.addEventListener('touchend', end)
  }

  const setRef = (node: Element | ComponentPublicInstance | null) => {
    const safeNode = node instanceof Element ? (node as T) : null

    if (safeNode === element.value) {
      return
    }

    if (element.value) {
      element.value.removeEventListener('mousedown', start)
      element.value.removeEventListener('touchstart', start)
    }
    observer?.disconnect()
    observer = undefined
    element.value = safeNode
    if (safeNode) {
      safeNode.addEventListener('mousedown', start)
      safeNode.addEventListener('touchstart', start, { passive: false })
      position = calculateInitialPosition(safeNode, options)
      applyPosition(position, false)
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => applyPosition(position, false))
        observer.observe(safeNode)
      }
    }
  }

  onMounted(
    () => element.value && applyPosition(calculateInitialPosition(element.value, options), false),
  )
  onBeforeUnmount(() => {
    end()
    observer?.disconnect()
    element.value?.removeEventListener('mousedown', start)
    element.value?.removeEventListener('touchstart', start)
  })

  return { ref: setRef, element: readonly(element), isDragging: readonly(isDragging), setPosition }
}
