import { inject, provide, type InjectionKey } from 'vue'
import type { UseFormReturnType } from './types'

export function createFormContext<Values extends Record<string, any>>() {
  const key = Symbol('MantineVueFormContext') as InjectionKey<UseFormReturnType<Values>>

  const FormProvider = (form: UseFormReturnType<Values>) => provide(key, form)
  const useFormContext = () => {
    const ctx = inject(key, null)

    if (!ctx) {
      throw new Error('[@mantine-vue/form] FormProvider was not found in tree')
    }

    return ctx
  }

  return [FormProvider, useFormContext, key] as const
}
