import { em, getBreakpointValue, getSpacing, rem, type MantineTheme } from '../../../core'
import type {
  AppShellAsideConfiguration,
  AppShellFooterConfiguration,
  AppShellHeaderConfiguration,
  AppShellNavbarConfiguration,
  AppShellResponsiveSize,
  AppShellSize,
} from '../AppShell.types'
export type CSSVariables = Record<`--${string}`, string | undefined>
export type MediaQueryVariables = Record<string, CSSVariables>

const isResponsive = (value: unknown): value is AppShellResponsiveSize =>
  Boolean(value && typeof value === 'object')
const size = (value: AppShellSize | undefined) => (value === undefined ? undefined : rem(value))
const paddingValue = (value: AppShellSize | undefined) =>
  Number(value) === 0 ? '0px' : getSpacing(value)
function breakpointPx(value: string | number, theme: MantineTheme) {
  return typeof value === 'string' && value in theme.breakpoints
    ? getBreakpointValue(theme.breakpoints[value])
    : getBreakpointValue(value)
}
function media(styles: MediaQueryVariables, query: string, values: CSSVariables) {
  styles[query] = { ...styles[query], ...values }
}
function responsive(
  value: AppShellSize | AppShellResponsiveSize | undefined,
  property: `--${string}`,
  base: CSSVariables,
  min: MediaQueryVariables,
  theme: MantineTheme,
  transform = size,
) {
  if (isResponsive(value)) {
    if (value.base !== undefined) base[property] = transform(value.base)
    Object.entries(value).forEach(([key, item]) => {
      if (key !== 'base' && item !== undefined)
        media(min, `(min-width: ${em(breakpointPx(key, theme))})`, { [property]: transform(item) })
    })
  } else if (value !== undefined) base[property] = transform(value)
}

export function getVariables({
  navbar,
  aside,
  header,
  footer,
  padding,
  theme,
  mode,
}: {
  navbar?: AppShellNavbarConfiguration
  aside?: AppShellAsideConfiguration
  header?: AppShellHeaderConfiguration
  footer?: AppShellFooterConfiguration
  padding?: AppShellSize | AppShellResponsiveSize
  theme: MantineTheme
  mode: 'fixed' | 'static'
}) {
  const baseStyles: CSSVariables = {}
  const minMediaStyles: MediaQueryVariables = {}
  const maxMediaStyles: MediaQueryVariables = {}
  responsive(padding, '--app-shell-padding', baseStyles, minMediaStyles, theme, paddingValue)
  const assignVertical = (
    config: AppShellHeaderConfiguration | AppShellFooterConfiguration | undefined,
    name: 'header' | 'footer',
  ) => {
    if (!config) return
    const property = `--app-shell-${name}-height` as const
    responsive(config.height, property, baseStyles, minMediaStyles, theme)
    const shouldOffset = mode === 'static' || config.offset !== false
    if (shouldOffset)
      responsive(config.height, `--app-shell-${name}-offset`, baseStyles, minMediaStyles, theme)
    if (config.collapsed) {
      baseStyles[`--app-shell-${name}-transform`] =
        name === 'header'
          ? 'translateY(calc(var(--app-shell-header-height) * -1))'
          : 'translateY(var(--app-shell-footer-height))'
      if (mode === 'fixed') baseStyles[`--app-shell-${name}-offset`] = '0px !important'
    }
    if (mode === 'static') {
      baseStyles[`--app-shell-${name}-position`] = 'sticky'
      baseStyles[`--app-shell-${name}-grid-column`] = '1 / -1'
      baseStyles[`--app-shell-${name}-grid-row`] = name === 'header' ? '1' : '3'
    }
  }
  assignVertical(header, 'header')
  assignVertical(footer, 'footer')
  const assignNavbarVariables = (config: AppShellNavbarConfiguration | undefined) => {
    if (!config) return
    responsive(config.width, '--app-shell-navbar-width', baseStyles, minMediaStyles, theme)
    responsive(config.width, '--app-shell-navbar-offset', baseStyles, minMediaStyles, theme)
    if (mode === 'static') {
      responsive(config.width, '--app-shell-navbar-grid-width', baseStyles, minMediaStyles, theme)
    }

    const bp = breakpointPx(config.breakpoint, theme)
    const minQuery = `(min-width: ${em(bp)})`
    const maxQuery = `(max-width: ${em(bp - 0.1)})`

    if (!config.collapsed?.mobile) {
      media(maxMediaStyles, maxQuery, {
        '--app-shell-navbar-offset': '0px',
        '--app-shell-navbar-width': '100%',
        ...(mode === 'static' ? { '--app-shell-navbar-grid-width': '0px' } : {}),
      })
    }

    if (mode === 'static') {
      media(minMediaStyles, minQuery, {
        '--app-shell-navbar-position': 'sticky',
        '--app-shell-navbar-grid-row': '2',
        '--app-shell-navbar-grid-column': '1',
        '--app-shell-main-column-start': '2',
      })
    }

    if (config.collapsed?.desktop) {
      media(minMediaStyles, minQuery, {
        '--app-shell-navbar-transform': 'translateX(calc(var(--app-shell-navbar-width) * -1))',
        '--app-shell-navbar-transform-rtl': 'translateX(var(--app-shell-navbar-width))',
        ...(mode === 'fixed'
          ? { '--app-shell-navbar-offset': '0px !important' }
          : {
              '--app-shell-navbar-width': '0px',
              '--app-shell-navbar-display': 'none',
              '--app-shell-main-column-start': '1',
            }),
      })
    }

    if (config.collapsed?.mobile) {
      media(maxMediaStyles, maxQuery, {
        '--app-shell-navbar-width': '100%',
        '--app-shell-navbar-offset': '0px',
        ...(mode === 'static' ? { '--app-shell-navbar-grid-width': '0px' } : {}),
        '--app-shell-navbar-transform': 'translateX(calc(var(--app-shell-navbar-width) * -1))',
        '--app-shell-navbar-transform-rtl': 'translateX(var(--app-shell-navbar-width))',
      })
    }
  }

  const assignAsideVariables = (config: AppShellAsideConfiguration | undefined) => {
    if (!config) return
    responsive(config.width, '--app-shell-aside-width', baseStyles, minMediaStyles, theme)
    responsive(config.width, '--app-shell-aside-offset', baseStyles, minMediaStyles, theme)

    const bp = breakpointPx(config.breakpoint, theme)
    const minQuery = `(min-width: ${em(bp)})`
    const maxQuery = `(max-width: ${em(bp - 0.1)})`

    if (!config.collapsed?.mobile) {
      media(
        maxMediaStyles,
        maxQuery,
        mode === 'fixed'
          ? { '--app-shell-aside-width': '100%', '--app-shell-aside-offset': '0px' }
          : { '--app-shell-aside-width': '0px', '--app-shell-aside-offset': '0px' },
      )
    }

    if (mode === 'static') {
      media(minMediaStyles, minQuery, {
        '--app-shell-aside-position': 'sticky',
        '--app-shell-aside-grid-row': '2',
        '--app-shell-aside-grid-column': '3',
        '--app-shell-main-column-end': '3',
      })
    }

    if (config.collapsed?.desktop) {
      media(minMediaStyles, minQuery, {
        '--app-shell-aside-transform': 'translateX(var(--app-shell-aside-width))',
        '--app-shell-aside-transform-rtl': 'translateX(calc(var(--app-shell-aside-width) * -1))',
        '--app-shell-aside-scroll-locked-visibility': 'hidden',
        ...(mode === 'fixed'
          ? { '--app-shell-aside-offset': '0px !important' }
          : {
              '--app-shell-aside-width': '0px',
              '--app-shell-aside-display': 'none',
              '--app-shell-main-column-end': '-1',
            }),
      })
    }

    if (config.collapsed?.mobile) {
      media(maxMediaStyles, maxQuery, {
        ...(mode === 'fixed'
          ? { '--app-shell-aside-width': '100%', '--app-shell-aside-offset': '0px' }
          : { '--app-shell-aside-width': '0px' }),
        '--app-shell-aside-transform': 'translateX(var(--app-shell-aside-width))',
        '--app-shell-aside-transform-rtl': 'translateX(calc(var(--app-shell-aside-width) * -1))',
        '--app-shell-aside-scroll-locked-visibility': 'hidden',
      })
    }
  }

  assignNavbarVariables(navbar)
  assignAsideVariables(aside)
  if (mode === 'static') {
    baseStyles['--app-shell-main-grid-column'] = '1 / -1'
    baseStyles['--app-shell-main-grid-row'] = '2'
  }
  return { baseStyles, media: { ...minMediaStyles, ...maxMediaStyles } }
}
