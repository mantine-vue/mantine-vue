import { shallowRef, toValue, watch, type MaybeRefOrGetter, type ShallowRef } from 'vue'

export function usePrevious<T>(value: MaybeRefOrGetter<T>): ShallowRef<T | undefined> {
  const previous = shallowRef<T>()
  watch(
    () => toValue(value),
    (_, oldValue) => {
      previous.value = oldValue
    },
  )
  return previous
}
