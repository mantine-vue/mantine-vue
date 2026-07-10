import { computed, ref, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

export interface UseUncontrolledOptions<T> {
  value?: MaybeRefOrGetter<T | undefined>
  defaultValue?: T
  finalValue?: T
  onChange?: (value: T, ...payload: any[]) => void
}

export type UseUncontrolledReturnValue<T> = [
  Ref<T>,
  (value: T, ...payload: any[]) => void,
  Ref<boolean>,
]

export function useUncontrolled<T>({
  value,
  defaultValue,
  finalValue,
  onChange = () => {},
}: UseUncontrolledOptions<T>): UseUncontrolledReturnValue<T> {
  const uncontrolledValue = ref(defaultValue !== undefined ? defaultValue : finalValue) as Ref<T>
  const isControlled = computed(() => toValue(value) !== undefined)
  const currentValue = computed({
    get: () => (isControlled.value ? (toValue(value) as T) : uncontrolledValue.value),
    set: (nextValue) => {
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue
      }

      onChange(nextValue)
    },
  })

  return [
    currentValue,
    (nextValue, ...payload) => {
      if (!isControlled.value) {
        uncontrolledValue.value = nextValue
      }
      onChange(nextValue, ...payload)
    },
    isControlled,
  ]
}
