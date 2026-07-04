import { computed } from 'vue'
import { filterProps } from '@mantine-vue/utils'
import {
  useMantineClassNamesPrefix,
  useMantineTheme,
  useMantineWithStaticClasses,
} from '../MantineProvider'
import type { UseStylesInput } from './styles-api.types'

function mergeVars(sources: Array<Record<string, any> | undefined>): Record<string, any> {
  return sources.reduce<Record<string, any>>((acc, current) => {
    if (current) {
      Object.keys(current).forEach((key) => {
        acc[key] = { ...acc[key], ...filterProps(current[key] ?? {}) }
      })
    }
    return acc
  }, {})
}

function normalizeStyle(style: any): Record<string, any> {
  if (!style) return {}
  if (Array.isArray(style)) {
    return style.reduce<Record<string, any>>((acc, s) => Object.assign(acc, normalizeStyle(s)), {})
  }
  if (typeof style === 'object') return style
  return {}
}

function resolveRecord<T>(
  value: T | ((theme: any, payload: any) => T) | undefined,
  theme: any,
  payload: any,
) {
  return typeof value === 'function'
    ? (value as (theme: any, payload: any) => T)(theme, payload)
    : (value ?? {})
}

const FOCUS_CLASS_NAMES = {
  always: 'mantine-focus-always',
  auto: 'mantine-focus-auto',
  never: 'mantine-focus-never',
} as const

export function useStyles<Payload = any>(input: UseStylesInput<Payload>) {
  const theme = useMantineTheme()
  const classNamesPrefix = useMantineClassNamesPrefix()
  const withStaticClasses = useMantineWithStaticClasses()

  const themeNames = computed(
    () => (Array.isArray(input.name) ? input.name : [input.name]).filter(Boolean) as string[],
  )
  const componentThemes = computed(() =>
    themeNames.value.map((name) => theme.value.components[name] ?? {}),
  )

  const getResolvedClassNames = () => ({
    ...componentThemes.value.reduce<Record<string, any>>(
      (acc, componentTheme) => ({
        ...acc,
        ...resolveRecord(componentTheme.classNames, theme.value, input.props),
      }),
      {},
    ),
    ...resolveRecord(input.classNames, theme.value, input.props),
  })
  const getResolvedStyles = () => ({
    ...componentThemes.value.reduce<Record<string, any>>(
      (acc, componentTheme) => ({
        ...acc,
        ...resolveRecord(componentTheme.styles, theme.value, input.props),
      }),
      {},
    ),
    ...resolveRecord(input.styles, theme.value, input.props),
  })
  const getResolvedVars = () =>
    mergeVars([
      input.varsResolver?.(theme.value, input.props ?? {}, input.stylesCtx ?? {}),
      ...componentThemes.value.map((componentTheme) =>
        resolveRecord(componentTheme.vars, theme.value, input.props),
      ),
      resolveRecord(input.vars, theme.value, input.props),
    ])

  return (
    selector: string,
    options: {
      active?: boolean
      focusable?: boolean
      className?: any
      style?: any
      classNames?: UseStylesInput<Payload>['classNames']
      styles?: UseStylesInput<Payload>['styles']
      props?: Record<string, any>
      variant?: string
    } = {},
  ) => {
    const rootSelector = input.rootSelector ?? 'root'
    const staticClasses = withStaticClasses
      ? themeNames.value.map((name) => `${classNamesPrefix}-${name}-${selector}`)
      : []
    const optionsProps = options.props ?? input.props
    const resolvedClassNames = {
      ...getResolvedClassNames(),
      ...resolveRecord(options.classNames, theme.value, optionsProps),
    }
    const resolvedStyles = {
      ...getResolvedStyles(),
      ...resolveRecord(options.styles, theme.value, optionsProps),
    }
    const resolvedVars = getResolvedVars()

    return {
      ...input.attributes?.[selector],
      class: [
        input.unstyled ? null : input.classes?.[selector],
        input.unstyled || !options.variant
          ? null
          : input.classes?.[`${selector}--${options.variant}`],
        ...staticClasses,
        resolvedClassNames[selector],
        selector === rootSelector ? input.className : null,
        options.active && !input.unstyled ? theme.value.activeClassName : null,
        options.focusable && !input.unstyled
          ? theme.value.focusClassName ||
            FOCUS_CLASS_NAMES[theme.value.focusRing as keyof typeof FOCUS_CLASS_NAMES]
          : null,
        options.className,
      ].filter(Boolean),
      style: {
        ...resolvedStyles[selector],
        ...resolvedVars[selector],
        ...(selector === rootSelector ? normalizeStyle(input.style) : {}),
        ...normalizeStyle(options.style),
      },
    }
  }
}
