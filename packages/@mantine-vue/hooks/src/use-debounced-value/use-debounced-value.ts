import { readonly, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'
import { useDebouncedCallback } from '../use-debounced-callback/use-debounced-callback'
import { useDidUpdate } from '../use-did-update/use-did-update'

export interface UseDebouncedValueOptions {
  leading?: boolean
}

export type UseDebouncedValueHandlers = {
  cancel: () => void
}

export type UseDebouncedValueReturnValue<T> = [Readonly<Ref<T>>, () => void]

export function useDebouncedValue<T>(
  value: MaybeRefOrGetter<T>,
  wait: number,
): UseDebouncedValueReturnValue<T> {
  const debounced = ref(toValue(value)) as Ref<T>
  const update = useDebouncedCallback((nextValue: T) => {
    debounced.value = nextValue
  }, wait)

  useDidUpdate(() => update(toValue(value)), [() => toValue(value)])

  return [readonly(debounced) as Readonly<Ref<T>>, update.cancel]
}
