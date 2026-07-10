import { ref, type Ref } from 'vue'

export type UseInputStateReturnValue<T> = [Ref<T>, (eventOrValue: Event | T) => void]

export function useInputState<T>(initialValue: T): UseInputStateReturnValue<T> {
  const value = ref(initialValue) as Ref<T>
  const setValue = (eventOrValue: Event | T) => {
    if (eventOrValue instanceof Event) {
      const target = eventOrValue.target as HTMLInputElement
      value.value = (target.type === 'checkbox' ? target.checked : target.value) as T
    } else {
      value.value = eventOrValue
    }
  }

  return [value, setValue]
}
