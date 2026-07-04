import { onBeforeUnmount, ref, type Ref } from 'vue'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function radiansToDegrees(radians: number) {
  return radians * (180 / Math.PI)
}

function getElementCenter(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  return [rect.left + rect.width / 2, rect.top + rect.height / 2] as const
}

function getAngle(coordinates: [number, number], element: HTMLElement) {
  const center = getElementCenter(element)
  const x = coordinates[0] - center[0]
  const y = coordinates[1] - center[1]
  const deg = radiansToDegrees(Math.atan2(x, y)) + 180

  return 360 - deg
}

function toFixed(value: number, digits: number) {
  return Number.parseFloat(value.toFixed(digits))
}

function getDigitsAfterDot(value: number) {
  return value.toString().split('.')[1]?.length || 0
}

export function normalizeRadialValue(degree: number, step: number) {
  const clamped = clamp(degree, 0, 360)
  const high = Math.ceil(clamped / step)
  const low = Math.round(clamped / step)

  return toFixed(
    high >= clamped / step ? (high * step === 360 ? 0 : high * step) : low * step,
    getDigitsAfterDot(step),
  )
}

export interface UseRadialMoveOptions {
  step?: number
  onChangeEnd?: (value: number) => void
  onScrubStart?: () => void
  onScrubEnd?: () => void
}

export interface UseRadialMoveReturnValue<T extends HTMLElement = HTMLElement> {
  ref: (node: T | null) => void
  active: Ref<boolean>
}

export function useRadialMove<T extends HTMLElement = HTMLElement>(
  onChange: (value: number) => void,
  { step = 0.01, onChangeEnd, onScrubStart, onScrubEnd }: UseRadialMoveOptions = {},
): UseRadialMoveReturnValue<T> {
  const active = ref(false)
  let nodeRef: T | null = null
  let cleanupNode: (() => void) | undefined

  const update = (event: Pick<MouseEvent, 'clientX' | 'clientY'>, done = false) => {
    if (!nodeRef) {
      return
    }

    nodeRef.style.userSelect = 'none'
    const deg = getAngle([event.clientX, event.clientY], nodeRef)
    const nextValue = normalizeRadialValue(deg, step || 1)

    onChange(nextValue)

    if (done) {
      onChangeEnd?.(nextValue)
    }
  }

  const handleMouseMove = (event: MouseEvent) => update(event)
  const handleMouseUp = (event: MouseEvent) => {
    update(event, true)
    endTracking()
  }
  const handleTouchMove = (event: TouchEvent) => {
    event.preventDefault()
    update(event.touches[0] as any)
  }
  const handleTouchEnd = (event: TouchEvent) => {
    update(event.changedTouches[0] as any, true)
    endTracking()
  }

  function beginTracking() {
    onScrubStart?.()
    active.value = true
    document.addEventListener('mousemove', handleMouseMove, false)
    document.addEventListener('mouseup', handleMouseUp, false)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, false)
  }

  function endTracking() {
    onScrubEnd?.()
    active.value = false
    document.removeEventListener('mousemove', handleMouseMove, false)
    document.removeEventListener('mouseup', handleMouseUp, false)
    document.removeEventListener('touchmove', handleTouchMove, false)
    document.removeEventListener('touchend', handleTouchEnd, false)
  }

  const handleMouseDown = (event: MouseEvent) => {
    beginTracking()
    update(event)
  }

  const handleTouchStart = (event: TouchEvent) => {
    event.preventDefault()
    beginTracking()
    update(event.touches[0] as any)
  }

  const setRef = (node: T | null) => {
    cleanupNode?.()
    nodeRef = node

    if (!node) {
      cleanupNode = undefined
      return
    }

    node.addEventListener('mousedown', handleMouseDown)
    node.addEventListener('touchstart', handleTouchStart, { passive: false })
    cleanupNode = () => {
      node.removeEventListener('mousedown', handleMouseDown)
      node.removeEventListener('touchstart', handleTouchStart)
    }
  }

  onBeforeUnmount(() => {
    cleanupNode?.()
    endTracking()
  })

  return { ref: setRef, active }
}
