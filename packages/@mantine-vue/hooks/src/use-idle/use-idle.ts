import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface UseIdleOptions {
  events?: (keyof DocumentEventMap)[]
  initialState?: boolean
}

const DEFAULT_OPTIONS: Required<UseIdleOptions> = {
  events: ['keydown', 'mousemove', 'touchmove', 'click', 'scroll', 'wheel'],
  initialState: true,
}

export function useIdle(timeout: MaybeRefOrGetter<number>, options?: UseIdleOptions): Ref<boolean> {
  const { events, initialState } = { ...DEFAULT_OPTIONS, ...options }
  const idle = ref(initialState) as Ref<boolean>
  let timer = -1

  const handleEvents = () => {
    idle.value = false

    if (timer) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      idle.value = true
    }, toValue(timeout))
  }

  const bind = () => {
    events.forEach((event) => document.addEventListener(event, handleEvents))

    // Start the timer immediately instead of waiting for the first event to happen
    timer = window.setTimeout(() => {
      idle.value = true
    }, toValue(timeout))
  }

  const cleanup = () => {
    events.forEach((event) => document.removeEventListener(event, handleEvents))
    window.clearTimeout(timer)
    timer = -1
  }

  onMounted(bind)
  onBeforeUnmount(cleanup)

  watch(
    () => toValue(timeout),
    () => {
      cleanup()
      bind()
    },
  )

  return idle
}
