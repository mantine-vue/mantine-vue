import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'
import type { CSSVariablesResolver } from './css-variables'
import type { MantineColorScheme, MantineTheme } from './theme.types'

export interface MantineStylesTransform {
  sx?: () => (sx: any) => string
  styles?: () => (styles: any, payload: any) => Record<string, string>
}

export interface MantineContextValue {
  colorScheme: Ref<MantineColorScheme>
  setColorScheme: (colorScheme: MantineColorScheme) => void
  clearColorScheme: () => void
  getRootElement: () => HTMLElement | undefined
  classNamesPrefix: string
  getStyleNonce?: () => string | undefined
  cssVariablesResolver?: CSSVariablesResolver
  cssVariablesSelector: string
  withStaticClasses: boolean
  headless?: boolean
  stylesTransform?: MantineStylesTransform
  env?: 'default' | 'test'
  deduplicateInlineStyles?: boolean
}

export const MantineContextKey = Symbol('MantineContext') as InjectionKey<MantineContextValue>
export const MantineThemeKey = Symbol('MantineTheme') as InjectionKey<ComputedRef<MantineTheme>>

export function provideMantineContext(value: MantineContextValue) {
  provide(MantineContextKey, value)
}

export function useMantineContext() {
  const ctx = inject(MantineContextKey, null)

  if (!ctx) {
    throw new Error('[@mantine-vue/core] MantineProvider was not found in tree')
  }

  return ctx
}

export function useMantineCssVariablesResolver() {
  return useMantineContext().cssVariablesResolver
}

export function useMantineClassNamesPrefix() {
  return useMantineContext().classNamesPrefix
}

export function useMantineStyleNonce() {
  return useMantineContext().getStyleNonce
}

export function useMantineWithStaticClasses() {
  return useMantineContext().withStaticClasses
}

export function useMantineIsHeadless() {
  return useMantineContext().headless
}

export function useMantineEnv() {
  return useMantineContext().env || 'default'
}

export function useMantineDeduplicateInlineStyles() {
  return useMantineContext().deduplicateInlineStyles || false
}

export function createProviderColorScheme(defaultColorScheme: MantineColorScheme) {
  const colorScheme = ref(defaultColorScheme)
  return {
    colorScheme,
    setColorScheme: (value: MantineColorScheme) => {
      colorScheme.value = value
    },
    clearColorScheme: () => {
      colorScheme.value = defaultColorScheme
    },
  }
}

export function provideMantineTheme(theme: ComputedRef<MantineTheme>) {
  provide(MantineThemeKey, theme)
}

export function resolveColorScheme(colorScheme: 'light' | 'dark' | 'auto'): 'light' | 'dark' {
  if (colorScheme !== 'auto') {
    return colorScheme
  }

  const prefersDark =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  return prefersDark ? 'dark' : 'light'
}

// Vue equivalent of @mantine/core's useMantineColorScheme hook: exposes the
// current (possibly 'auto') color scheme plus setters, backed by the nearest
// MantineProvider's context.
export function useMantineColorScheme() {
  const ctx = useMantineContext()
  return {
    colorScheme: ctx.colorScheme,
    setColorScheme: ctx.setColorScheme,
    clearColorScheme: ctx.clearColorScheme,
  }
}

export interface UseComputedColorSchemeOptions {
  getInitialValueInEffect?: boolean
}

// Vue equivalent of @mantine/core's useComputedColorScheme hook: resolves
// 'auto' to a concrete 'light' | 'dark' based on the OS color scheme media
// query, matching the same resolution MantineProvider itself uses to set
// `data-mantine-color-scheme` on the root element.
export function useComputedColorScheme(
  defaultValue: 'light' | 'dark' = 'light',
  options: UseComputedColorSchemeOptions = {},
) {
  const ctx = useMantineContext()
  const getSystemPreference = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : defaultValue

  const systemColorScheme = shallowRef<'light' | 'dark'>(
    options.getInitialValueInEffect ? defaultValue : getSystemPreference(),
  )

  let media: MediaQueryList | undefined
  const update = () => {
    systemColorScheme.value = media?.matches ? 'dark' : 'light'
  }

  onMounted(() => {
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      media = window.matchMedia('(prefers-color-scheme: dark)')
      update()
      media.addEventListener('change', update)
    }
  })
  onUnmounted(() => media?.removeEventListener('change', update))

  return computed(() =>
    ctx.colorScheme.value === 'auto' ? systemColorScheme.value : ctx.colorScheme.value,
  )
}
