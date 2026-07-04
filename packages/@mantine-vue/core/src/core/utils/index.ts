import { inject, provide, type InjectionKey } from 'vue'

export * from '@mantine-vue/utils'

export function createSafeInjectionContext<T>(errorMessage: string) {
  const key = Symbol(errorMessage) as InjectionKey<T>

  const useSafeContext = () => {
    const ctx = inject(key, null)

    if (ctx === null) {
      throw new Error(errorMessage)
    }

    return ctx
  }

  const provideSafeContext = (value: T) => provide(key, value)

  return [provideSafeContext, useSafeContext, key] as const
}

export const createSafeContext = createSafeInjectionContext
