import { onBeforeUnmount, ref, type Ref } from 'vue'

type Vector2 = [number, number]

export interface UseDragState {
  /** Current pointer position [x, y] */
  xy: Vector2

  /** Position where the gesture started [x, y] */
  initial: Vector2

  /** Displacement from start [x, y], respects axis constraint */
  movement: Vector2

  /** Change since previous event [x, y] */
  delta: Vector2

  /** Absolute distance per axis [x, y] */
  distance: Vector2

  /** Movement direction per axis: -1, 0, or 1 */
  direction: Vector2

  /** Speed per axis in px/ms */
  velocity: Vector2

  /** Time since drag started in ms */
  elapsedTime: number

  /** `true` on the first handler call after the threshold is met */
  first: boolean

  /** `true` on the last handler call (pointer released or canceled) */
  last: boolean

  /** `true` while the gesture is ongoing */
  active: boolean

  /** `true` when the gesture qualifies as a tap (requires `filterTaps: true`) */
  tap: boolean

  /** `true` when the gesture was interrupted by a `pointercancel` event */
  canceled: boolean

  /** Function to programmatically cancel the current gesture */
  cancel: () => void

  /** The source `PointerEvent` */
  event: PointerEvent
}

export interface UseDragOptions {
  /** Constrain movement to a specific axis. `'lock'` locks to whichever axis has more movement after `axisThreshold` is exceeded. */
  axis?: 'x' | 'y' | 'lock'

  /** Movement in px required to determine axis when `axis` is `'lock'`, `1` by default */
  axisThreshold?: number

  /** When `true`, the last state includes `tap: true` when total distance is below `tapThreshold`, `false` by default */
  filterTaps?: boolean

  /** Max displacement in px to still be considered a tap, `3` by default */
  tapThreshold?: number

  /** Minimum displacement in px before the drag activates. Can be a number (both axes) or `[x, y]`. `0` by default */
  threshold?: number | Vector2

  /** Enable or disable the hook, `true` by default */
  enabled?: boolean
}

export interface UseDragReturnValue<T extends HTMLElement = any> {
  /** Ref callback to attach to the draggable element */
  ref: (node: T | null) => void

  /** `true` while the element is being dragged */
  active: Ref<boolean>
}

const VELOCITY_DECAY_MS = 100

function sign(n: number): -1 | 0 | 1 {
  if (n > 0) {
    return 1
  }
  if (n < 0) {
    return -1
  }
  return 0
}

function getThresholdVector(threshold: number | Vector2 | undefined): Vector2 {
  const t = threshold ?? 0
  if (typeof t === 'number') {
    return [t, t]
  }
  return t
}

interface DragInternalState {
  isActive: boolean
  pointerId: number
  startXY: Vector2
  prevXY: Vector2
  startTimestamp: number
  prevTimestamp: number
  thresholdMet: boolean
  firstFired: boolean
  lockedAxis: 'x' | 'y' | null
  canceled: boolean
  lastVelocity: Vector2
}

function createInitialState(): DragInternalState {
  return {
    isActive: false,
    pointerId: -1,
    startXY: [0, 0],
    prevXY: [0, 0],
    startTimestamp: 0,
    prevTimestamp: 0,
    thresholdMet: false,
    firstFired: false,
    lockedAxis: null,
    canceled: false,
    lastVelocity: [0, 0],
  }
}

export function useDrag<T extends HTMLElement = any>(
  handler: (state: UseDragState) => void,
  options: UseDragOptions = {},
): UseDragReturnValue<T> {
  const active = ref(false) as Ref<boolean>

  const state = createInitialState()
  let node: T | null = null
  let documentController: AbortController | null = null
  let cleanupNode: (() => void) | undefined

  const applyAxisConstraint = (v: Vector2): Vector2 => {
    if (options.axis === 'x') {
      return [v[0], 0]
    }
    if (options.axis === 'y') {
      return [0, v[1]]
    }
    if (options.axis === 'lock') {
      if (state.lockedAxis === null) {
        const t = options.axisThreshold ?? 1
        if (Math.abs(v[0]) > t || Math.abs(v[1]) > t) {
          state.lockedAxis = Math.abs(v[0]) >= Math.abs(v[1]) ? 'x' : 'y'
        }
      }
      if (state.lockedAxis === 'x') {
        return [v[0], 0]
      }
      if (state.lockedAxis === 'y') {
        return [0, v[1]]
      }
    }
    return v
  }

  const resetDrag = () => {
    state.isActive = false
    state.pointerId = -1
    state.thresholdMet = false
    state.firstFired = false
    state.lockedAxis = null
    state.canceled = false
    active.value = false
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    documentController?.abort()
    documentController = null
  }

  const cancel = () => {
    if (state.isActive) {
      state.canceled = true
      resetDrag()
    }
  }

  const activateDrag = () => {
    active.value = true
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'
  }

  const onPointerDown = (event: PointerEvent) => {
    if (options.enabled === false) {
      return
    }
    if (event.button !== 0) {
      return
    }
    if (state.isActive) {
      return
    }

    state.isActive = true
    state.pointerId = event.pointerId
    state.startXY = [event.clientX, event.clientY]
    state.prevXY = [event.clientX, event.clientY]
    state.startTimestamp = event.timeStamp
    state.prevTimestamp = event.timeStamp
    state.thresholdMet = false
    state.firstFired = false
    state.lockedAxis = null
    state.canceled = false
    state.lastVelocity = [0, 0]

    const [tx, ty] = getThresholdVector(options.threshold)
    if (tx === 0 && ty === 0) {
      state.thresholdMet = true
      state.firstFired = true
      activateDrag()

      handler({
        xy: [event.clientX, event.clientY],
        initial: [event.clientX, event.clientY],
        movement: [0, 0],
        delta: [0, 0],
        distance: [0, 0],
        direction: [0, 0],
        velocity: [0, 0],
        elapsedTime: 0,
        first: true,
        last: false,
        active: true,
        tap: false,
        canceled: false,
        cancel,
        event,
      })
    }

    documentController?.abort()
    documentController = new AbortController()
    const sig = documentController.signal

    document.addEventListener('pointermove', onPointerMove, { signal: sig })
    document.addEventListener('pointerup', onPointerUp, { signal: sig })
    document.addEventListener('pointercancel', onPointerCancel, { signal: sig })
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!state.isActive || event.pointerId !== state.pointerId) {
      return
    }

    const rawMovement: Vector2 = [
      event.clientX - state.startXY[0],
      event.clientY - state.startXY[1],
    ]

    if (!state.thresholdMet) {
      const [tx, ty] = getThresholdVector(options.threshold)
      if (Math.abs(rawMovement[0]) < tx && Math.abs(rawMovement[1]) < ty) {
        state.prevXY = [event.clientX, event.clientY]
        state.prevTimestamp = event.timeStamp
        return
      }
      state.thresholdMet = true
      activateDrag()
    }

    const movement = applyAxisConstraint(rawMovement)
    const rawDelta: Vector2 = [event.clientX - state.prevXY[0], event.clientY - state.prevXY[1]]
    const delta = applyAxisConstraint(rawDelta)
    const timeDelta = event.timeStamp - state.prevTimestamp
    const velocity: Vector2 =
      timeDelta > 0
        ? [Math.abs(delta[0]) / timeDelta, Math.abs(delta[1]) / timeDelta]
        : state.lastVelocity

    state.lastVelocity = velocity
    const isFirst = !state.firstFired
    state.firstFired = true
    state.prevXY = [event.clientX, event.clientY]
    state.prevTimestamp = event.timeStamp

    handler({
      xy: [event.clientX, event.clientY],
      initial: [...state.startXY],
      movement,
      delta,
      distance: [Math.abs(movement[0]), Math.abs(movement[1])],
      direction: [sign(delta[0]), sign(delta[1])],
      velocity,
      elapsedTime: event.timeStamp - state.startTimestamp,
      first: isFirst,
      last: false,
      active: true,
      tap: false,
      canceled: false,
      cancel,
      event,
    })
  }

  const onPointerUp = (event: PointerEvent) => {
    if (!state.isActive || event.pointerId !== state.pointerId) {
      return
    }

    if (!state.thresholdMet) {
      if (options.filterTaps) {
        const rawMov: Vector2 = [event.clientX - state.startXY[0], event.clientY - state.startXY[1]]
        const mov = applyAxisConstraint(rawMov)
        const dist: Vector2 = [Math.abs(mov[0]), Math.abs(mov[1])]
        const maxDist = Math.max(dist[0], dist[1])
        const isTap = maxDist < (options.tapThreshold ?? 3)

        handler({
          xy: [event.clientX, event.clientY],
          initial: [...state.startXY],
          movement: mov,
          delta: mov,
          distance: dist,
          direction: [sign(mov[0]), sign(mov[1])],
          velocity: [0, 0],
          elapsedTime: event.timeStamp - state.startTimestamp,
          first: true,
          last: true,
          active: false,
          tap: isTap,
          canceled: false,
          cancel,
          event,
        })
      }
      resetDrag()
      return
    }

    const rawMovement: Vector2 = [
      event.clientX - state.startXY[0],
      event.clientY - state.startXY[1],
    ]
    const movement = applyAxisConstraint(rawMovement)
    const distance: Vector2 = [Math.abs(movement[0]), Math.abs(movement[1])]
    const rawDelta: Vector2 = [event.clientX - state.prevXY[0], event.clientY - state.prevXY[1]]
    const delta = applyAxisConstraint(rawDelta)

    const timeSinceLastMove = event.timeStamp - state.prevTimestamp
    const velocity: Vector2 = timeSinceLastMove > VELOCITY_DECAY_MS ? [0, 0] : state.lastVelocity

    const maxDistance = Math.max(distance[0], distance[1])
    const tap = options.filterTaps === true && maxDistance < (options.tapThreshold ?? 3)

    handler({
      xy: [event.clientX, event.clientY],
      initial: [...state.startXY],
      movement,
      delta,
      distance,
      direction: [sign(delta[0]), sign(delta[1])],
      velocity,
      elapsedTime: event.timeStamp - state.startTimestamp,
      first: !state.firstFired,
      last: true,
      active: false,
      tap,
      canceled: false,
      cancel,
      event,
    })

    resetDrag()
  }

  const onPointerCancel = (event: PointerEvent) => {
    if (!state.isActive || event.pointerId !== state.pointerId) {
      return
    }

    const rawMovement: Vector2 = [
      event.clientX - state.startXY[0],
      event.clientY - state.startXY[1],
    ]
    const movement = applyAxisConstraint(rawMovement)

    handler({
      xy: [event.clientX, event.clientY],
      initial: [...state.startXY],
      movement,
      delta: [0, 0],
      distance: [Math.abs(movement[0]), Math.abs(movement[1])],
      direction: [0, 0],
      velocity: [0, 0],
      elapsedTime: event.timeStamp - state.startTimestamp,
      first: !state.firstFired,
      last: true,
      active: false,
      tap: false,
      canceled: true,
      cancel,
      event,
    })

    resetDrag()
  }

  const refCallback = (newNode: T | null) => {
    cleanupNode?.()
    cleanupNode = undefined
    node = newNode

    if (!node) {
      return
    }

    const elementController = new AbortController()
    node.addEventListener('pointerdown', onPointerDown, { signal: elementController.signal })

    cleanupNode = () => {
      elementController.abort()
      documentController?.abort()
      documentController = null
      if (state.isActive) {
        state.isActive = false
        active.value = false
        document.body.style.userSelect = ''
        document.body.style.webkitUserSelect = ''
      }
    }
  }

  onBeforeUnmount(() => {
    cleanupNode?.()
  })

  return { ref: refCallback, active }
}
