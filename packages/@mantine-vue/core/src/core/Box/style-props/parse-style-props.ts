import { camelToKebabCase, getBreakpointValue, rem } from '@mantine-vue/utils'
import { parseThemeColor, type MantineTheme } from '../../MantineProvider'
import type { StyleProp } from './style-props.types'
import type { StylePropType, SystemPropData } from './style-props-data'

export interface ParseStylePropsInput {
  styleProps: Record<string, StyleProp<any> | undefined>
  theme: MantineTheme
  data: Record<string, SystemPropData>
}

function colorResolver(value: unknown, theme: MantineTheme, text: boolean) {
  const parsed = parseThemeColor({ color: value, theme })
  if (text && parsed.isThemeColor && parsed.shade === undefined) {
    return `var(--mantine-color-${parsed.color}-text)`
  }
  return parsed.variable ? `var(${parsed.variable})` : parsed.color
}

function resolveValue(value: unknown, type: StylePropType, theme: MantineTheme): unknown {
  if (value === undefined) return undefined
  if (type === 'identity') return value
  if (type === 'size') return typeof value === 'number' ? rem(value) : value
  if (type === 'color') return colorResolver(value, theme, false)
  if (type === 'textColor') return colorResolver(value, theme, true)
  if (type === 'fontFamily') {
    const families: Record<string, string> = {
      text: 'var(--mantine-font-family)',
      mono: 'var(--mantine-font-family-monospace)',
      monospace: 'var(--mantine-font-family-monospace)',
      heading: 'var(--mantine-font-family-headings)',
      headings: 'var(--mantine-font-family-headings)',
    }
    return typeof value === 'string' ? (families[value] ?? value) : value
  }
  if (type === 'fontSize') {
    if (typeof value === 'string' && value in theme.fontSizes) {
      return `var(--mantine-font-size-${value})`
    }
    if (typeof value === 'string' && /^h[1-6]$/.test(value)) {
      return `var(--mantine-${value}-font-size)`
    }
    return rem(value)
  }
  if (type === 'lineHeight') {
    if (typeof value === 'string' && value in theme.lineHeights) {
      return `var(--mantine-line-height-${value})`
    }
    return typeof value === 'string' && /^h[1-6]$/.test(value)
      ? `var(--mantine-${value}-line-height)`
      : value
  }
  if (type === 'radius') {
    return typeof value === 'string' && value in theme.radius
      ? `var(--mantine-radius-${value})`
      : rem(value)
  }
  if (type === 'spacing') {
    if (typeof value === 'string') {
      const key = value.replace('-', '')
      if (key in theme.spacing) {
        const variable = `--mantine-spacing-${key}`
        return value.startsWith('-') ? `calc(var(${variable}) * -1)` : `var(${variable})`
      }
    }
    return rem(value)
  }
  if (type === 'border') {
    if (typeof value === 'number') return rem(value)
    if (typeof value !== 'string') return value
    const [size, style, ...color] = value.split(' ').filter(Boolean)
    return [rem(size), style, color.length ? colorResolver(color.join(' '), theme, false) : null]
      .filter(Boolean)
      .join(' ')
  }
  return value
}

export function parseStyleProps({ styleProps, theme, data }: ParseStylePropsInput) {
  const inlineStyles: Record<string, string | number> = {}
  const styles: Record<string, string | number> = {}
  const media: Record<string, Record<string, string | number>> = {}

  Object.entries(styleProps).forEach(([prop, value]) => {
    const propData = data[prop]

    if (!propData || value === undefined) {
      return
    }

    const cssProperty = camelToKebabCase(propData.property)

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const breakpoints = Object.keys(value).filter((breakpoint) => breakpoint !== 'base')
      if (breakpoints.length === 0) {
        const resolved = resolveValue(value.base, propData.type, theme)
        if (resolved !== undefined) inlineStyles[cssProperty] = resolved as string | number
        return
      }

      Object.entries(value).forEach(([breakpoint, breakpointValue]) => {
        const resolved = resolveValue(breakpointValue, propData.type, theme)

        if (resolved === undefined) {
          return
        }

        if (breakpoint === 'base') {
          styles[cssProperty] = resolved as string | number
          return
        }

        const breakpointSize = theme.breakpoints[breakpoint] ?? breakpoint
        const query = `(min-width: ${getBreakpointValue(breakpointSize) / 16}em)`
        media[query] = media[query] ?? {}
        media[query][cssProperty] = resolved as string | number
      })
    } else {
      const resolved = resolveValue(value, propData.type, theme)
      if (resolved !== undefined) inlineStyles[cssProperty] = resolved as string | number
    }
  })

  const sortedMedia = Object.fromEntries(
    Object.entries(media).sort(([a], [b]) => {
      const aValue = getBreakpointValue(a.replace('(min-width:', '').replace(')', '').trim())
      const bValue = getBreakpointValue(b.replace('(min-width:', '').replace(')', '').trim())
      return aValue - bValue
    }),
  )

  return {
    inlineStyles,
    styles,
    media: sortedMedia,
    hasResponsiveStyles: Object.keys(styles).length > 0 || Object.keys(media).length > 0,
  }
}

export function hashStyleProps(styles: Record<string, any>, media: Record<string, any>) {
  const input = JSON.stringify({ styles, media })
  let hash = 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index)
    hash |= 0
  }

  return `mantine-vue-${Math.abs(hash).toString(36)}`
}

export function useRandomClassName() {
  return `mantine-vue-${Math.random().toString(36).slice(2, 9)}`
}
