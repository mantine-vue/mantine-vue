import { inject, type InjectionKey } from 'vue'
import type { PillGroupContextValue } from './PillGroup.types'

export const PillGroupContextKey: InjectionKey<PillGroupContextValue> = Symbol('PillGroupContext')

export function usePillGroupContext() {
  return inject(PillGroupContextKey, null)
}
