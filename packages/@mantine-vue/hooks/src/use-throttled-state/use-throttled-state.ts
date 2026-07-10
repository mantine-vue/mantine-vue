import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useThrottledCallbackWithClearTimeout } from '../use-throttled-callback/use-throttled-callback'

export type UseThrottledStateReturnValue<T> = [Ref<T>, (value: T) => void]

export function useThrottledState<T = any>(
  defaultValue: T,
  wait: number,
): UseThrottledStateReturnValue<T> {
  const value = ref(defaultValue) as Ref<T>

  const [setThrottledValue, clear] = useThrottledCallbackWithClearTimeout((nextValue: T) => {
    value.value = nextValue
  }, wait)

  onBeforeUnmount(clear)

  return [value, setThrottledValue]
}
