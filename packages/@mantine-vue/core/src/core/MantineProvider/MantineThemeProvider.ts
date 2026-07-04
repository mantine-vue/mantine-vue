import { computed, defineComponent, inject, provide, type PropType } from 'vue'
import { DEFAULT_THEME } from './default-theme'
import { MantineThemeKey } from './Mantine.context'
import { mergeMantineTheme } from './merge-mantine-theme'
import type { MantineTheme, MantineThemeOverride } from './theme.types'

export function useMantineTheme() {
  const ctx = inject(MantineThemeKey, null)
  if (!ctx) {
    throw new Error(
      '@mantine-vue/core: MantineProvider was not found in component tree, make sure you have it in your app',
    )
  }

  return ctx
}

export function useSafeMantineTheme() {
  return inject(
    MantineThemeKey,
    computed<MantineTheme>(() => DEFAULT_THEME),
  )
}

export const MantineThemeProvider = defineComponent({
  name: 'MantineThemeProvider',
  props: {
    inherit: { type: Boolean, default: true },
    theme: { type: Object as PropType<MantineThemeOverride>, default: undefined },
  },
  setup(props, { slots }) {
    const parentTheme = useSafeMantineTheme()
    const mergedTheme = computed(() =>
      mergeMantineTheme(props.inherit ? parentTheme.value : DEFAULT_THEME, props.theme),
    )

    provide(MantineThemeKey, mergedTheme)
    return () => slots.default?.()
  },
})
