import type { InjectionKey } from 'vue'
import { inject, provide } from 'vue'
import type { SpotlightStore } from './spotlight.store'

export interface SpotlightContextValue {
  query: string
  setQuery: (query: string) => void
  getStyles: (selector: string, options?: Record<string, any>) => Record<string, any>
  store: SpotlightStore
  closeOnActionTrigger: boolean | undefined
}

const SpotlightContextKey = Symbol('SpotlightContext') as InjectionKey<SpotlightContextValue>

export function provideSpotlightContext(value: SpotlightContextValue) {
  provide(SpotlightContextKey, value)
}

export function useSpotlightContext() {
  const ctx = inject(SpotlightContextKey, null)

  if (ctx === null) {
    throw new Error('Spotlight component was not found in tree')
  }

  return ctx
}
