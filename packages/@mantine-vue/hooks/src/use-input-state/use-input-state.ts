import { ref, type Ref } from 'vue'

export type UseInputStateReturnValue<T> = [
  Ref<T>,
  (eventOrValue: Event | T | ((current: T) => T)) => void,
]

export function useInputState<T>(initialValue: T): UseInputStateReturnValue<T> {
  const value = ref(initialValue) as Ref<T>
  const setValue = (eventOrValue: Event | T | ((current: T) => T)) => {
    if (eventOrValue instanceof Function) {
      value.value = eventOrValue(value.value)
      return
    }

    if (
      eventOrValue instanceof Event ||
      (eventOrValue &&
        typeof eventOrValue === 'object' &&
        'currentTarget' in (eventOrValue as Record<string, unknown>) &&
        'nativeEvent' in (eventOrValue as Record<string, unknown>))
    ) {
      const target = ((eventOrValue as Event).target ??
        (eventOrValue as unknown as { currentTarget: HTMLInputElement })
          .currentTarget) as HTMLInputElement
      value.value = (target.type === 'checkbox' ? target.checked : target.value) as T
    } else {
      value.value = eventOrValue
    }
  }

  return [value, setValue]
}
