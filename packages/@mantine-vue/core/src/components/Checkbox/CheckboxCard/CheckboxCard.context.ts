import { inject, type InjectionKey } from 'vue'
import type { CheckboxCardContextValue } from './CheckboxCard.types'

export const CheckboxCardContextKey: InjectionKey<CheckboxCardContextValue> =
  Symbol('CheckboxCardContext')

/** Returns the enclosing `Checkbox.Card` context, or `null` when there is none. */
export function useCheckboxCardContext(): CheckboxCardContextValue | null {
  return inject(CheckboxCardContextKey, null)
}
