import { inject, provide, type InjectionKey } from 'vue'

export interface ShellContextValue {
  navbarOpened: boolean
  toggleNavbar: () => void
  closeNavbar: () => void
}

const ShellContextKey: InjectionKey<ShellContextValue> = Symbol('ShellContext')

export function provideShellContext(value: ShellContextValue) {
  provide(ShellContextKey, value)
}

export function useShellContext(): ShellContextValue {
  const ctx = inject(ShellContextKey, null)

  if (!ctx) {
    throw new Error('ShellProvider was not found in the component tree')
  }

  return ctx
}
