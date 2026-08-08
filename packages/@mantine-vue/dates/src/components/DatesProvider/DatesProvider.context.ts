import { inject, type InjectionKey } from 'vue'
import type { DatesProviderSettings } from '../../types'

export const DATES_PROVIDER_DEFAULT_SETTINGS: Required<DatesProviderSettings> = {
  locale: 'en',
  firstDayOfWeek: 1,
  weekendDays: [0, 6],
  timezone: 'UTC',
  consistentWeeks: false,
}

export const DatesContextKey: InjectionKey<Required<DatesProviderSettings>> = Symbol('DatesContext')

/** Returns the nearest reactive dates provider settings. */
export function useDatesContext() {
  return inject(DatesContextKey, DATES_PROVIDER_DEFAULT_SETTINGS)
}
