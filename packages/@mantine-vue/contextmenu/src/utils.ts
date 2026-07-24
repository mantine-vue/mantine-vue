import type { ContextMenuStyle, ContextMenuStyles } from './types'
import type { MantineStyle, MantineTheme } from '@mantine-vue/core'

/** Returns a humanized version of a string, for example "camelCase" becomes "Camel Case". */
export function humanize(value: string) {
  const str = value
    .replace(/([a-z\d])([A-Z]+)/g, '$1 $2')
    .replace(/\W|_/g, ' ')
    .trim()
    .toLowerCase()

  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export function resolveContextMenuStyle(
  style: ContextMenuStyle | undefined,
  theme: MantineTheme,
): MantineStyle | undefined {
  return typeof style === 'function' ? style(theme) : style
}

export function resolveContextMenuStyles(
  styles: ContextMenuStyles | ((theme: MantineTheme) => ContextMenuStyles) | undefined,
  theme: MantineTheme,
) {
  return typeof styles === 'function' ? styles(theme) : styles
}
