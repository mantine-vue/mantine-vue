import { inject, provide, type InjectionKey } from 'vue'

export interface InputContextValue {
  size: string | number
}

export const InputContextKey = Symbol('InputContext') as InjectionKey<InputContextValue>

export function provideInputContext(value: InputContextValue) {
  provide(InputContextKey, value)
}

export function useInputContext() {
  return inject(InputContextKey, { size: 'sm' })
}
