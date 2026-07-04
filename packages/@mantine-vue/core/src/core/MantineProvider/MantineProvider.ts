import './baseline.css'
import './global.css'
import './default-css-variables.css'
import { em, keys, px } from '@mantine-vue/utils'
import { computed, defineComponent, h, onMounted, onUnmounted, watch, type PropType } from 'vue'
import { convertCssVariables, getMergedVariables, type CSSVariablesResolver } from './css-variables'
import {
  createProviderColorScheme,
  provideMantineContext,
  resolveColorScheme,
  useMantineContext,
  type MantineStylesTransform,
} from './Mantine.context'
import { MantineThemeProvider, useMantineTheme, useSafeMantineTheme } from './MantineThemeProvider'
import type { MantineColorScheme, MantineThemeOverride } from './theme.types'

export interface MantineProviderProps {
  theme?: MantineThemeOverride
  defaultColorScheme?: MantineColorScheme
  forceColorScheme?: 'light' | 'dark'
  cssVariablesSelector?: string
  withCssVariables?: boolean
  deduplicateCssVariables?: boolean
  getRootElement?: () => HTMLElement | undefined
  classNamesPrefix?: string
  getStyleNonce?: () => string
  cssVariablesResolver?: CSSVariablesResolver
  withStaticClasses?: boolean
  withGlobalClasses?: boolean
  stylesTransform?: MantineStylesTransform
  deduplicateInlineStyles?: boolean
  env?: 'default' | 'test'
}

function defaultRootElement() {
  return typeof document === 'undefined' ? undefined : document.documentElement
}

export const MantineProvider = defineComponent({
  name: 'MantineProvider',
  props: {
    theme: { type: Object as PropType<MantineThemeOverride>, default: undefined },
    defaultColorScheme: { type: String as PropType<MantineColorScheme>, default: 'light' },
    forceColorScheme: { type: String as PropType<'light' | 'dark'>, default: undefined },
    cssVariablesSelector: { type: String, default: ':root' },
    withCssVariables: { type: Boolean, default: true },
    deduplicateCssVariables: { type: Boolean, default: true },
    getRootElement: {
      type: Function as PropType<() => HTMLElement | undefined>,
      default: defaultRootElement,
    },
    classNamesPrefix: { type: String, default: 'mantine' },
    getStyleNonce: { type: Function as PropType<() => string>, default: undefined },
    cssVariablesResolver: { type: Function as PropType<CSSVariablesResolver>, default: undefined },
    withStaticClasses: { type: Boolean, default: true },
    withGlobalClasses: { type: Boolean, default: true },
    stylesTransform: { type: Object as PropType<MantineStylesTransform>, default: undefined },
    deduplicateInlineStyles: { type: Boolean, default: false },
    env: { type: String as PropType<'default' | 'test'>, default: 'default' },
  },
  setup(props, { slots }) {
    const providerColorScheme = createProviderColorScheme(
      props.forceColorScheme ?? props.defaultColorScheme,
    )

    const setColorScheme = (value: MantineColorScheme) => {
      if (!props.forceColorScheme) {
        providerColorScheme.setColorScheme(value)
      }
    }

    provideMantineContext({
      colorScheme: providerColorScheme.colorScheme,
      setColorScheme,
      clearColorScheme: providerColorScheme.clearColorScheme,
      getRootElement: props.getRootElement,
      classNamesPrefix: props.classNamesPrefix,
      getStyleNonce: props.getStyleNonce,
      cssVariablesResolver: props.cssVariablesResolver,
      cssVariablesSelector: props.cssVariablesSelector,
      withStaticClasses: props.withStaticClasses,
      stylesTransform: props.stylesTransform,
      env: props.env,
      deduplicateInlineStyles: props.deduplicateInlineStyles,
    })

    const updateRootColorScheme = () =>
      props
        .getRootElement()
        ?.setAttribute(
          'data-mantine-color-scheme',
          resolveColorScheme(props.forceColorScheme ?? providerColorScheme.colorScheme.value),
        )

    onMounted(updateRootColorScheme)
    watch(providerColorScheme.colorScheme, updateRootColorScheme)

    let media: MediaQueryList | undefined
    onMounted(() => {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        media = window.matchMedia('(prefers-color-scheme: dark)')
        media.addEventListener('change', updateRootColorScheme)
      }
    })
    onUnmounted(() => media?.removeEventListener('change', updateRootColorScheme))

    return () =>
      h(MantineThemeProvider, { theme: props.theme }, () => [
        props.withCssVariables ? h(MantineCssVariables) : null,
        props.withGlobalClasses ? h(MantineClasses) : null,
        slots.default?.(),
      ])
  },
})

export const HeadlessMantineProvider = defineComponent({
  name: 'HeadlessMantineProvider',
  props: {
    theme: { type: Object as PropType<MantineThemeOverride>, default: undefined },
    env: { type: String as PropType<'default' | 'test'>, default: 'default' },
  },
  setup(props, { slots }) {
    const colorScheme = createProviderColorScheme('auto')
    provideMantineContext({
      colorScheme: colorScheme.colorScheme,
      setColorScheme: colorScheme.setColorScheme,
      clearColorScheme: colorScheme.clearColorScheme,
      getRootElement: defaultRootElement,
      classNamesPrefix: 'mantine',
      cssVariablesSelector: ':root',
      withStaticClasses: false,
      headless: true,
      env: props.env,
    })

    return () => h(MantineThemeProvider, { theme: props.theme }, slots.default)
  },
})

export const MantineCssVariables = defineComponent({
  name: 'MantineCssVariables',
  setup() {
    const theme = useSafeMantineTheme()
    const ctx = useMantineContext()
    const styles = computed(() =>
      convertCssVariables(
        getMergedVariables({ theme: theme.value, generator: ctx.cssVariablesResolver }),
        ctx.cssVariablesSelector,
      ),
    )

    return () => h('style', { 'data-mantine-styles': true, innerHTML: styles.value })
  },
})

export const MantineClasses = defineComponent({
  name: 'MantineClasses',
  setup() {
    const theme = useMantineTheme()

    const classes = computed(() =>
      keys(theme.value.breakpoints).reduce<string>((acc, breakpoint) => {
        const isPxBreakpoint = theme.value.breakpoints[breakpoint].includes('px')
        const pxValue = px(theme.value.breakpoints[breakpoint]) as number
        const maxWidthBreakpoint = isPxBreakpoint ? `${pxValue - 0.1}px` : em(pxValue - 0.1)
        const minWidthBreakpoint = isPxBreakpoint ? `${pxValue}px` : em(pxValue)

        return `${acc}@media (max-width: ${maxWidthBreakpoint}) {.mantine-visible-from-${breakpoint} {display: none !important;}}@media (min-width: ${minWidthBreakpoint}) {.mantine-hidden-from-${breakpoint} {display: none !important;}}`
      }, ''),
    )

    return () => h('style', { 'data-mantine-styles': 'classes', innerHTML: classes.value })
  },
})
