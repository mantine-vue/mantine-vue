import {
  onBeforeUnmount,
  readonly,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'

export interface UseDebouncedValueOptions {
  leading?: boolean
}

export type UseDebouncedValueHandlers = {
  cancel: () => void
  flush: () => void
}

export type UseDebouncedValueReturnValue<T> = [
  Readonly<Ref<T>>,
  () => void,
  UseDebouncedValueHandlers,
]

export function useDebouncedValue<T>(
  value: MaybeRefOrGetter<T>,
  wait: number,
  options: UseDebouncedValueOptions = {},
): UseDebouncedValueReturnValue<T> {
  const debounced = ref(toValue(value)) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | undefined
  let cooldown = false
  let latestValue = toValue(value)

  const cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
    cooldown = false
  }

  const flush = () => {
    if (timeout) {
      cancel()
      debounced.value = latestValue
    }
  }

  watch(
    () => toValue(value),
    (nextValue) => {
      latestValue = nextValue

      if (!cooldown && options.leading) {
        cooldown = true
        debounced.value = nextValue
        timeout = setTimeout(() => {
          cooldown = false
          timeout = undefined
        }, wait)
      } else {
        cancel()
        timeout = setTimeout(() => {
          cooldown = false
          timeout = undefined
          debounced.value = nextValue
        }, wait)
      }
    },
  )

  onBeforeUnmount(cancel)

  return [readonly(debounced) as Readonly<Ref<T>>, cancel, { cancel, flush }]
}
