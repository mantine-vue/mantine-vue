import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useReducedMotion } from '../use-reduced-motion/use-reduced-motion'
import { useWindowEvent } from '../use-window-event/use-window-event'

interface UseScrollIntoViewAnimation {
  /** Target element alignment relatively to parent based on current axis */
  alignment?: 'start' | 'end' | 'center'
}

export interface UseScrollIntoViewOptions {
  /** Callback fired after scroll */
  onScrollFinish?: () => void

  /** Callback fired when scroll animation is canceled by user interaction */
  onScrollCancel?: () => void

  /** Duration of scroll in milliseconds */
  duration?: number

  /** Axis of scroll */
  axis?: 'x' | 'y'

  /** Custom mathematical easing function */
  easing?: (t: number) => number

  /** Additional distance between nearest edge and element */
  offset?: number

  /** Indicator if animation may be interrupted by user scrolling */
  cancelable?: boolean

  /** Prevents content jumping in scrolling lists with multiple targets */
  isList?: boolean
}

export interface UseScrollIntoViewReturnValue<
  Target extends HTMLElement = HTMLElement,
  Parent extends HTMLElement | null = null,
> {
  scrollableRef: Ref<Parent | null>
  targetRef: Ref<Target | null>
  scrollIntoView: (params?: UseScrollIntoViewAnimation) => void
  cancel: () => void
  scrolling: Ref<boolean>
}

export function useScrollIntoView<
  Target extends HTMLElement = HTMLElement,
  Parent extends HTMLElement | null = null,
>(options: UseScrollIntoViewOptions = {}): UseScrollIntoViewReturnValue<Target, Parent> {
  const {
    duration = 1250,
    axis = 'y',
    onScrollFinish,
    onScrollCancel,
    easing = easeInOutQuad,
    offset = 0,
    cancelable = true,
    isList = false,
  } = options

  const frameID = ref(0)
  const startTime = ref(0)
  const shouldStop = ref(false)
  const scrolling = ref(false)

  const scrollableRef = ref<Parent | null>(null) as Ref<Parent | null>
  const targetRef = ref<Target | null>(null) as Ref<Target | null>

  const reducedMotion = useReducedMotion()

  const cancel = (): void => {
    if (frameID.value) {
      cancelAnimationFrame(frameID.value)
      frameID.value = 0
      scrolling.value = false
    }
  }

  const scrollIntoView = ({ alignment = 'start' }: UseScrollIntoViewAnimation = {}): void => {
    shouldStop.value = false

    if (frameID.value) {
      cancel()
    }

    const start = getScrollStart({ parent: scrollableRef.value, axis }) ?? 0

    const change =
      getRelativePosition({
        parent: scrollableRef.value,
        target: targetRef.value,
        axis,
        alignment,
        offset,
        isList,
      }) - (scrollableRef.value ? 0 : start)

    scrolling.value = true

    function animateScroll(): void {
      if (startTime.value === 0) {
        startTime.value = performance.now()
      }

      const now = performance.now()
      const elapsed = now - startTime.value

      // Easing timing progress
      const t = reducedMotion.value || duration === 0 ? 1 : elapsed / duration

      const distance = start + change * easing(t)

      setScrollParam({
        parent: scrollableRef.value,
        axis,
        distance,
      })

      if (!shouldStop.value && t < 1) {
        frameID.value = requestAnimationFrame(animateScroll)
      } else {
        if (shouldStop.value) {
          onScrollCancel?.()
        } else {
          onScrollFinish?.()
        }
        startTime.value = 0
        frameID.value = 0
        scrolling.value = false
        cancel()
      }
    }
    animateScroll()
  }

  const handleStop = (): void => {
    if (cancelable) {
      shouldStop.value = true
    }
  }

  /**
   * Detection of one of these events stops scroll animation
   * wheel - mouse wheel / touch pad
   * touchmove - any touchable device
   */

  useWindowEvent('wheel', handleStop, {
    passive: true,
  })

  useWindowEvent('touchmove', handleStop, {
    passive: true,
  })

  // Cleanup requestAnimationFrame
  onBeforeUnmount(cancel)

  return {
    scrollableRef,
    targetRef,
    scrollIntoView,
    cancel,
    scrolling,
  }
}

// ---------------------------------------------------
// Helpers
// ---------------------------------------------------

function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

interface RelativePositionParams {
  axis: 'x' | 'y'
  target: HTMLElement | null
  parent: HTMLElement | null
  alignment: 'start' | 'end' | 'center'
  offset: number
  isList: boolean
}

function getRelativePosition({
  axis,
  target,
  parent,
  alignment,
  offset,
  isList,
}: RelativePositionParams): number {
  if (!target || (!parent && typeof document === 'undefined')) {
    return 0
  }
  const isCustomParent = !!parent
  const parentElement = parent || document.body
  const parentPosition = parentElement.getBoundingClientRect()
  const targetPosition = target.getBoundingClientRect()

  const getDiff = (property: 'top' | 'left'): number =>
    targetPosition[property] - parentPosition[property]

  if (axis === 'y') {
    const diff = getDiff('top')

    if (diff === 0) {
      return 0
    }

    if (alignment === 'start') {
      const distance = diff - offset
      const shouldScroll = distance <= targetPosition.height * (isList ? 0 : 1) || !isList

      return shouldScroll ? distance : 0
    }

    const parentHeight = isCustomParent ? parentPosition.height : window.innerHeight

    if (alignment === 'end') {
      const distance = diff + offset - parentHeight + targetPosition.height
      const shouldScroll = distance >= -targetPosition.height * (isList ? 0 : 1) || !isList

      return shouldScroll ? distance : 0
    }

    if (alignment === 'center') {
      return diff - parentHeight / 2 + targetPosition.height / 2
    }

    return 0
  }

  if (axis === 'x') {
    const diff = getDiff('left')

    if (diff === 0) {
      return 0
    }

    if (alignment === 'start') {
      const distance = diff - offset
      const shouldScroll = distance <= targetPosition.width || !isList

      return shouldScroll ? distance : 0
    }

    const parentWidth = isCustomParent ? parentPosition.width : window.innerWidth

    if (alignment === 'end') {
      const distance = diff + offset - parentWidth + targetPosition.width
      const shouldScroll = distance >= -targetPosition.width || !isList

      return shouldScroll ? distance : 0
    }

    if (alignment === 'center') {
      return diff - parentWidth / 2 + targetPosition.width / 2
    }

    return 0
  }

  return 0
}

interface ScrollStartParams {
  axis: 'x' | 'y'
  parent: HTMLElement | null
}

function getScrollStart({ axis, parent }: ScrollStartParams): number {
  if (!parent && typeof document === 'undefined') {
    return 0
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft'

  if (parent) {
    return parent[method]
  }

  const { body, documentElement } = document

  // While one of it has a value the second is equal 0
  return body[method] + documentElement[method]
}

interface SetScrollParamParams {
  axis: 'x' | 'y'
  parent: HTMLElement | null
  distance: number
}

function setScrollParam({ axis, parent, distance }: SetScrollParamParams): void {
  if (!parent && typeof document === 'undefined') {
    return
  }

  const method = axis === 'y' ? 'scrollTop' : 'scrollLeft'

  if (parent) {
    parent[method] = distance
  } else {
    const { body, documentElement } = document
    body[method] = distance
    documentElement[method] = distance
  }
}
