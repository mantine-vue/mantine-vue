import { customRef, type Ref } from 'vue'

export interface UseDebouncedStateOptions {
  leading?: boolean
}

export type UseDebouncedStateReturnValue<T> = [Ref<T>, (nextValue: T) => void]

export function useDebouncedState<T>(
  initialValue: T,
  wait: number,
): UseDebouncedStateReturnValue<T> {
  const value = customRef<T>((track, trigger) => {
    let current = initialValue
    let timeout: ReturnType<typeof setTimeout>
    return {
      get() {
        track()
        return current
      },
      set(nextValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          current = nextValue
          trigger()
        }, wait)
      },
    }
  })

  return [value, (nextValue: T) => (value.value = nextValue)]
}
