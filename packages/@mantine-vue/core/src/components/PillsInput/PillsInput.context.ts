import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { InputVariant } from '../Input'

export interface PillsInputContextValue {
  fieldRef: Ref<HTMLInputElement | null>
  size?: string | number
  disabled?: boolean
  hasError?: boolean
  variant?: InputVariant | (string & {})
}

const PillsInputContextKey: InjectionKey<PillsInputContextValue> = Symbol('PillsInputContext')

export function providePillsInputContext(value: PillsInputContextValue) {
  provide(PillsInputContextKey, value)
}

export function usePillsInputContext() {
  return inject(PillsInputContextKey, null)
}
