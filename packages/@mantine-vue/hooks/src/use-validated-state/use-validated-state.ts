import { readonly, ref, type Ref } from 'vue'

export interface UseValidatedStateValue<T> {
  /** Current value */
  value: T

  /** Last valid value */
  lastValidValue: T | undefined

  /** True if the current value is valid, false otherwise */
  valid: boolean
}

export type UseValidatedStateReturnValue<T> = [
  /** Current value */
  Readonly<Ref<UseValidatedStateValue<T>>>,
  /** Handler to update the state, passes `value` and `payload` to `onChange` */
  (value: T) => void,
]

export function useValidatedState<T>(
  initialValue: T,
  validate: (value: T) => boolean,
  initialValidationState?: boolean,
): UseValidatedStateReturnValue<T> {
  const state = ref<UseValidatedStateValue<T>>({
    value: initialValue,
    lastValidValue: validate(initialValue) ? initialValue : undefined,
    valid:
      typeof initialValidationState === 'boolean' ? initialValidationState : validate(initialValue),
  }) as Ref<UseValidatedStateValue<T>>

  const onChange = (val: T) => {
    const isValid = validate(val)
    state.value = {
      value: val,
      lastValidValue: isValid ? val : state.value.lastValidValue,
      valid: isValid,
    }
  }

  return [readonly(state) as Readonly<Ref<UseValidatedStateValue<T>>>, onChange]
}
