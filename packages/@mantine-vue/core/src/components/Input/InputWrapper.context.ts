import { inject, provide, type InjectionKey } from 'vue'

export interface InputWrapperContextValue {
  offsetTop: boolean
  offsetBottom: boolean
  describedBy?: string
  inputId?: string
  labelId?: string
  getStyles:
    | ((selector: string, options?: { className?: any; style?: any; props?: any }) => any)
    | null
}

export const InputWrapperContextKey = Symbol(
  'InputWrapperContext',
) as InjectionKey<InputWrapperContextValue>

export function provideInputWrapperContext(value: InputWrapperContextValue) {
  provide(InputWrapperContextKey, value)
}

export function useInputWrapperContext() {
  return inject(InputWrapperContextKey, {
    offsetBottom: false,
    offsetTop: false,
    describedBy: undefined,
    getStyles: null,
    inputId: undefined,
    labelId: undefined,
  })
}
