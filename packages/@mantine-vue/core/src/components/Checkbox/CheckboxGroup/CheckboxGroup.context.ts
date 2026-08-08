import { inject, type InjectionKey } from 'vue'
import type { CheckboxGroupContextValue } from './CheckboxGroup.types'

export const CheckboxGroupContextKey: InjectionKey<CheckboxGroupContextValue> =
  Symbol('CheckboxGroupContext')

/** Returns the enclosing `Checkbox.Group` context, or `null` when there is none. */
export function useCheckboxGroupContext(): CheckboxGroupContextValue | null {
  return inject(CheckboxGroupContextKey, null)
}
