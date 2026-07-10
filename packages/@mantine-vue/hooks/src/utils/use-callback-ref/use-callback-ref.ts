import { ref, toValue, watchEffect, type MaybeRefOrGetter, type Ref } from 'vue'

export function useCallbackRef<T extends (...args: any[]) => any>(
  callback: MaybeRefOrGetter<T | undefined>,
): T {
  const callbackRef: Ref<T | undefined> = ref(toValue(callback)) as Ref<T | undefined>

  watchEffect(() => {
    callbackRef.value = toValue(callback)
  })

  return ((...args: Parameters<T>) => callbackRef.value?.(...args)) as T
}
