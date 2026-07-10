import { onBeforeUnmount, ref, type Ref } from 'vue'

export interface UseDebouncedStateOptions {
  leading?: boolean
}

export type UseDebouncedStateReturnValue<T> = [Ref<T>, (nextValue: T | ((value: T) => T)) => void]

export function useDebouncedState<T>(
  initialValue: T,
  wait: number,
  options: UseDebouncedStateOptions = {},
): UseDebouncedStateReturnValue<T> {
  const value = ref(initialValue) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | undefined
  let leadingCalled = false

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  const setValue = (nextValue: T | ((value: T) => T)) => {
    const next = nextValue instanceof Function ? nextValue(value.value) : nextValue

    if (options.leading && !leadingCalled) {
      value.value = next
      leadingCalled = true
    } else {
      clear()
      timeout = setTimeout(() => {
        value.value = next
        leadingCalled = false
      }, wait)
    }
  }

  onBeforeUnmount(clear)

  return [value, setValue]
}
