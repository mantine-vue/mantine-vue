import { inject, type InjectionKey } from 'vue'
import type { RadioCardContextValue } from './RadioCard.types'

export const RadioCardContextKey: InjectionKey<RadioCardContextValue> = Symbol('RadioCardContext')

/** Returns the enclosing `Radio.Card` context, or `null` when there is none. */
export function useRadioCardContext(): RadioCardContextValue | null {
  return inject(RadioCardContextKey, null)
}
