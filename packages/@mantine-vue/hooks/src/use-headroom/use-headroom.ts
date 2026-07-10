import { ref, watch, type Ref } from 'vue'
import { useScrollDirection } from '../use-scroll-direction/use-scroll-direction'
import { useWindowEvent } from '../use-window-event/use-window-event'

export { useScrollDirection } from '../use-scroll-direction/use-scroll-direction'

export const isFixed = (current: number, fixedAt: number) => current <= fixedAt
export const isPinned = (current: number, previous: number) => current <= previous
export const isReleased = (current: number, previous: number, fixedAt: number) =>
  !isPinned(current, previous) && !isFixed(current, fixedAt)

export const isPinnedOrReleased = (
  current: number,
  fixedAt: number,
  isCurrentlyPinnedRef: { value: boolean },
  isScrollingUp: boolean,
  onPin?: () => void,
  onRelease?: () => void,
) => {
  const isInFixedPosition = isFixed(current, fixedAt)
  if (isInFixedPosition && !isCurrentlyPinnedRef.value) {
    isCurrentlyPinnedRef.value = true
    onPin?.()
  } else if (!isInFixedPosition && isScrollingUp && !isCurrentlyPinnedRef.value) {
    isCurrentlyPinnedRef.value = true
    onPin?.()
  } else if (!isInFixedPosition && !isScrollingUp && isCurrentlyPinnedRef.value) {
    isCurrentlyPinnedRef.value = false
    onRelease?.()
  }
}

export interface UseHeadroomInput {
  /** Number in px at which element should be fixed */
  fixedAt?: number

  /** Number of px to scroll to fully reveal or hide the element, 100 by default */
  scrollDistance?: number

  /** Called when element is pinned */
  onPin?: () => void

  /** Called when element is at fixed position */
  onFix?: () => void

  /** Called when element is unpinned */
  onRelease?: () => void
}

export interface UseHeadroomReturnValue {
  /** True when the element is at least partially visible */
  pinned: Ref<boolean>

  /** Reveal progress: 0 = fully hidden, 1 = fully visible */
  scrollProgress: Ref<number>
}

export function useHeadroom({
  fixedAt = 0,
  scrollDistance = 100,
  onPin,
  onFix,
  onRelease,
}: UseHeadroomInput = {}): UseHeadroomReturnValue {
  const scrollDirection = useScrollDirection()
  const scrollY = ref(
    typeof window === 'undefined' ? 0 : window.scrollY || document.documentElement.scrollTop,
  )

  useWindowEvent('scroll', () => {
    scrollY.value = window.scrollY || document.documentElement.scrollTop
  })

  const pinned = ref(false)
  const scrollProgress = ref(0)

  const isCurrentlyPinned = { value: false }
  let wasFixed = isFixed(scrollY.value, fixedAt)
  let prevIsFixed = wasFixed
  let directionChangeScrollY = scrollY.value
  let progressAtDirectionChange = wasFixed ? 1 : 0
  let prevIsScrollingUp = scrollDirection.value === 'up'

  const recalc = () => {
    const current = scrollY.value
    const isScrollingUp = scrollDirection.value === 'up'

    isPinnedOrReleased(current, fixedAt, isCurrentlyPinned, isScrollingUp, onPin, onRelease)

    const currentlyFixed = isFixed(current, fixedAt)
    if (currentlyFixed && !wasFixed) {
      onFix?.()
    }
    wasFixed = currentlyFixed

    // Detect fixed-zone transitions first. When leaving the fixed zone the baseline
    // is anchored at fixedAt (not the current scroll position) so the delta is measured
    // from where the element was last fully visible, regardless of how scroll position
    // was initialised on the first run.
    if (prevIsFixed !== currentlyFixed) {
      prevIsFixed = currentlyFixed
      directionChangeScrollY = currentlyFixed ? current : fixedAt
      progressAtDirectionChange = 1
      prevIsScrollingUp = isScrollingUp
    }

    // When scroll direction changes outside the fixed zone, save the current progress
    // so the next direction accumulates from that point (handles partial reveals).
    if (!currentlyFixed && prevIsScrollingUp !== isScrollingUp) {
      const transitionDelta = Math.abs(current - directionChangeScrollY)
      const transitionProgress = prevIsScrollingUp
        ? Math.min(progressAtDirectionChange + transitionDelta / scrollDistance, 1)
        : Math.max(progressAtDirectionChange - transitionDelta / scrollDistance, 0)

      prevIsScrollingUp = isScrollingUp
      directionChangeScrollY = current
      progressAtDirectionChange = transitionProgress
    }

    let nextScrollProgress: number

    if (currentlyFixed) {
      nextScrollProgress = 1
    } else {
      const scrollDelta = Math.abs(current - directionChangeScrollY)

      nextScrollProgress = isScrollingUp
        ? Math.min(progressAtDirectionChange + scrollDelta / scrollDistance, 1)
        : Math.max(progressAtDirectionChange - scrollDelta / scrollDistance, 0)
    }

    scrollProgress.value = nextScrollProgress
    pinned.value = nextScrollProgress > 0
  }

  watch([scrollY, scrollDirection], recalc, { immediate: true })

  return { pinned, scrollProgress }
}
