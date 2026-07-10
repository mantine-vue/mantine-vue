import {
  onBeforeUnmount,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface UseIntervalOptions {
  /** If set, the interval will start automatically when the component is mounted, `false` by default */
  autoInvoke?: boolean
}

export interface UseIntervalReturnValue {
  /** Starts the interval */
  start: () => void

  /** Stops the interval */
  stop: () => void

  /** Toggles the interval */
  toggle: () => void

  /** Indicates if the interval is active */
  active: Ref<boolean>
}

export function useInterval(
  fn: () => void,
  interval: MaybeRefOrGetter<number>,
  options: UseIntervalOptions = {},
): UseIntervalReturnValue {
  const { autoInvoke = false } = options
  const active = ref(false) as Ref<boolean>
  let intervalId: number | null = null

  const start = () => {
    if (!active.value && !intervalId) {
      intervalId = window.setInterval(fn, toValue(interval))
    }
    active.value = true
  }

  const stop = () => {
    active.value = false
    if (intervalId) {
      window.clearInterval(intervalId)
    }
    intervalId = null
  }

  const toggle = () => {
    if (active.value) {
      stop()
    } else {
      start()
    }
  }

  watch(
    () => toValue(interval),
    () => {
      if (active.value) {
        stop()
        start()
      }
    },
  )

  onMounted(() => {
    if (autoInvoke) {
      start()
    }
  })

  onBeforeUnmount(stop)

  return { start, stop, toggle, active }
}
