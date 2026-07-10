import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useReducedMotion } from '@mantine-vue/hooks'
import { useMantineTheme } from '../../core'
import type { TransitionStatus } from './get-transition-styles'

export interface UseTransitionInput {
  mounted: () => boolean
  duration: () => number
  exitDuration: () => number
  timingFunction: () => string
  onEnter?: () => void
  onExit?: () => void
  onEntered?: () => void
  onExited?: () => void
  enterDelay?: () => number | undefined
  exitDelay?: () => number | undefined
}

function forceReflow() {
  if (typeof document === 'undefined' || !document.documentElement) return
  void document.documentElement.offsetHeight
}

export function useTransition({
  mounted,
  duration,
  exitDuration,
  timingFunction,
  onEnter,
  onExit,
  onEntered,
  onExited,
  enterDelay,
  exitDelay,
}: UseTransitionInput) {
  const theme = useMantineTheme()
  const shouldReduceMotion = useReducedMotion()
  const reduceMotion = () => Boolean(theme.value.respectReducedMotion && shouldReduceMotion.value)

  const transitionDuration = ref(reduceMotion() ? 0 : duration())
  const transitionStatus = ref<TransitionStatus>(mounted() ? 'entered' : 'exited')

  let transitionTimeout = -1
  let delayTimeout = -1
  let generation = 0

  function clearAllTimeouts() {
    generation += 1
    if (typeof window === 'undefined') return
    window.clearTimeout(transitionTimeout)
    window.clearTimeout(delayTimeout)
  }

  async function handleStateChange(shouldMount: boolean) {
    clearAllTimeouts()
    const runId = generation
    const preHandler = shouldMount ? onEnter : onExit
    const handler = shouldMount ? onEntered : onExited
    const newTransitionDuration = reduceMotion() ? 0 : shouldMount ? duration() : exitDuration()
    transitionDuration.value = newTransitionDuration

    if (typeof window === 'undefined' || newTransitionDuration === 0) {
      preHandler?.()
      handler?.()
      transitionStatus.value = shouldMount ? 'entered' : 'exited'
      return
    }

    if (shouldMount) {
      // Entering: the element doesn't exist yet, so it needs to be painted at the
      // "out" (hidden) style first. Wait for Vue to actually patch the DOM with
      // that style, force a synchronous reflow so the browser commits it, then
      // flip to the target style — the property change now animates via the
      // transition-property/duration that was already declared on this paint.
      transitionStatus.value = 'pre-entering'

      await nextTick()
      if (runId !== generation) return
      forceReflow()
      if (runId !== generation) return
      preHandler?.()
      transitionStatus.value = 'entering'
    } else {
      // Exiting: the element already exists and is currently visible with
      // transition-property already active from the last render, so simply
      // changing the style value is enough to trigger the animation — no
      // baseline frame is needed.
      preHandler?.()
      transitionStatus.value = 'exiting'
    }

    transitionTimeout = window.setTimeout(() => {
      if (runId !== generation) return
      handler?.()
      transitionStatus.value = shouldMount ? 'entered' : 'exited'
    }, newTransitionDuration)
  }

  function handleTransitionWithDelay(shouldMount: boolean) {
    clearAllTimeouts()
    const runId = generation
    const delay = shouldMount ? enterDelay?.() : exitDelay?.()

    if (typeof window === 'undefined' || typeof delay !== 'number') {
      handleStateChange(shouldMount)
      return
    }

    delayTimeout = window.setTimeout(() => {
      if (runId !== generation) return
      handleStateChange(shouldMount)
    }, delay)
  }

  watch(mounted, (value, oldValue) => {
    if (value !== oldValue) handleTransitionWithDelay(value)
  })

  onBeforeUnmount(clearAllTimeouts)

  return {
    transitionDuration,
    transitionStatus,
    transitionTimingFunction: computed(() => timingFunction() || 'ease'),
  }
}
