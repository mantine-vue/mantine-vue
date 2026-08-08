import { inject, type InjectionKey } from 'vue'
import type { SwitchGroupContextValue } from './SwitchGroup.types'

export const SwitchGroupContextKey: InjectionKey<SwitchGroupContextValue> =
  Symbol('SwitchGroupContext')

/** Returns the enclosing `Switch.Group` context, or `null` when there is none. */
export function useSwitchGroupContext(): SwitchGroupContextValue | null {
  return inject(SwitchGroupContextKey, null)
}
