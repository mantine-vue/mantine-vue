import { inject, type InjectionKey } from 'vue'
import type { RadioGroupContextValue } from './RadioGroup.types'

export const RadioGroupContextKey: InjectionKey<RadioGroupContextValue> =
  Symbol('RadioGroupContext')

/** Returns the enclosing `Radio.Group` context, or `null` when there is none. */
export function useRadioGroupContext(): RadioGroupContextValue | null {
  return inject(RadioGroupContextKey, null)
}
