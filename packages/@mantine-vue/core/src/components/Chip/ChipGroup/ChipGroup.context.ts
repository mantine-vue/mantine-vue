import { inject, type InjectionKey } from 'vue'
import type { ChipGroupContextValue } from './ChipGroup.types'

export const ChipGroupContextKey: InjectionKey<ChipGroupContextValue> = Symbol('ChipGroupContext')

/** Returns the enclosing `Chip.Group` context, or `null` when there is none. */
export function useChipGroupContext(): ChipGroupContextValue | null {
  return inject(ChipGroupContextKey, null)
}
