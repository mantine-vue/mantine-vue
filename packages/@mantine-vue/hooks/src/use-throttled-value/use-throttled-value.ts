import {
  onBeforeUnmount,
  readonly,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
  type Ref,
} from 'vue'
import { useThrottledCallbackWithClearTimeout } from '../use-throttled-callback/use-throttled-callback'

export function useThrottledValue<T>(value: MaybeRefOrGetter<T>, wait: number): Readonly<Ref<T>> {
  const throttledValue = ref(toValue(value)) as Ref<T>

  const [throttledSetValue, clear] = useThrottledCallbackWithClearTimeout((nextValue: T) => {
    throttledValue.value = nextValue
  }, wait)

  watch(
    () => toValue(value),
    (nextValue) => throttledSetValue(nextValue),
  )

  onBeforeUnmount(clear)

  return readonly(throttledValue) as Readonly<Ref<T>>
}
