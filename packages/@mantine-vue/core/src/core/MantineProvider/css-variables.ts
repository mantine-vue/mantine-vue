import { deepMerge, keys, rem } from '@mantine-vue/utils'
import {
  alpha,
  darken,
  getPrimaryContrastColor,
  getPrimaryShade,
  isVirtualColor,
} from './color-functions'
import type { MantineColorShade, MantineTheme } from './theme.types'

export interface ConvertCSSVariablesInput {
  variables: Record<string, string>
  light?: Record<string, string>
  dark?: Record<string, string>
}

export type CSSVariablesResolver = (theme: MantineTheme) => ConvertCSSVariablesInput

function assignSizeVariables(
  variables: Record<string, string>,
  sizes: Record<string, string>,
  name: string,
) {
  keys(sizes).forEach((size) => {
    variables[`--mantine-${name}-${size}`] = sizes[size]
  })
}

function getCSSColorVariables({
  theme,
  color,
  colorScheme,
  name = color,
  withColorValues = true,
}: {
  theme: MantineTheme
  color: string
  colorScheme: 'light' | 'dark'
  name?: string
  withColorValues?: boolean
}) {
  const primaryShade = getPrimaryShade(theme, colorScheme)
  const colorValues = theme.colors[color]
  const result: Record<string, string> = {}

  if (colorScheme === 'light') {
    result[`--mantine-color-${name}-text`] = `var(--mantine-color-${name}-filled)`
    result[`--mantine-color-${name}-filled`] = `var(--mantine-color-${name}-${primaryShade})`
    result[`--mantine-color-${name}-filled-hover`] =
      `var(--mantine-color-${name}-${primaryShade === 9 ? 8 : primaryShade + 1})`
    result[`--mantine-color-${name}-light`] = `var(--mantine-color-${name}-1)`
    result[`--mantine-color-${name}-light-hover`] = `var(--mantine-color-${name}-2)`
    result[`--mantine-color-${name}-light-color`] = `var(--mantine-color-${name}-9)`
    result[`--mantine-color-${name}-outline`] = `var(--mantine-color-${name}-${primaryShade})`
    result[`--mantine-color-${name}-outline-hover`] = alpha(colorValues[primaryShade], 0.05)
  } else {
    result[`--mantine-color-${name}-text`] = `var(--mantine-color-${name}-4)`
    result[`--mantine-color-${name}-filled`] = `var(--mantine-color-${name}-${primaryShade})`
    result[`--mantine-color-${name}-filled-hover`] =
      `var(--mantine-color-${name}-${primaryShade === 9 ? 8 : primaryShade + 1})`
    result[`--mantine-color-${name}-light`] = darken(colorValues[9], 0.5)
    result[`--mantine-color-${name}-light-hover`] = darken(colorValues[9], 0.3)
    result[`--mantine-color-${name}-light-color`] = `var(--mantine-color-${name}-0)`
    const outlineShade = Math.max(primaryShade - 4, 0) as MantineColorShade
    result[`--mantine-color-${name}-outline`] = `var(--mantine-color-${name}-${outlineShade})`
    result[`--mantine-color-${name}-outline-hover`] = alpha(colorValues[outlineShade], 0.05)
  }

  if (withColorValues) {
    colorValues.forEach((value, index) => {
      result[`--mantine-color-${name}-${index}`] = value
    })
  }

  return result
}

export const defaultCssVariablesResolver: CSSVariablesResolver = (theme) => {
  const lightPrimaryShade = getPrimaryShade(theme, 'light')
  const defaultRadius =
    String(theme.defaultRadius) in theme.radius
      ? theme.radius[String(theme.defaultRadius)]
      : rem(theme.defaultRadius)

  const result: ConvertCSSVariablesInput = {
    variables: {
      '--mantine-z-index-app': '100',
      '--mantine-z-index-modal': '200',
      '--mantine-z-index-popover': '300',
      '--mantine-z-index-overlay': '400',
      '--mantine-z-index-max': '9999',
      '--mantine-scale': theme.scale.toString(),
      '--mantine-cursor-type': theme.cursorType,
      '--mantine-webkit-font-smoothing': theme.fontSmoothing ? 'antialiased' : 'unset',
      '--mantine-moz-font-smoothing': theme.fontSmoothing ? 'grayscale' : 'unset',
      '--mantine-color-white': theme.white,
      '--mantine-color-black': theme.black,
      '--mantine-line-height': theme.lineHeights.md,
      '--mantine-font-family': theme.fontFamily,
      '--mantine-font-family-monospace': theme.fontFamilyMonospace,
      '--mantine-font-family-headings': theme.headings.fontFamily,
      '--mantine-heading-font-weight': theme.headings.fontWeight,
      '--mantine-heading-text-wrap': theme.headings.textWrap,
      '--mantine-radius-default': defaultRadius,
      '--mantine-primary-color-filled': `var(--mantine-color-${theme.primaryColor}-filled)`,
      '--mantine-primary-color-filled-hover': `var(--mantine-color-${theme.primaryColor}-filled-hover)`,
      '--mantine-primary-color-light': `var(--mantine-color-${theme.primaryColor}-light)`,
      '--mantine-primary-color-light-hover': `var(--mantine-color-${theme.primaryColor}-light-hover)`,
      '--mantine-primary-color-light-color': `var(--mantine-color-${theme.primaryColor}-light-color)`,
    },
    light: {
      '--mantine-color-scheme': 'light',
      '--mantine-primary-color-contrast': getPrimaryContrastColor(theme, 'light'),
      '--mantine-color-bright': 'var(--mantine-color-black)',
      '--mantine-color-text': theme.black,
      '--mantine-color-body': theme.white,
      '--mantine-color-error': 'var(--mantine-color-red-6)',
      '--mantine-color-placeholder': 'var(--mantine-color-gray-5)',
      '--mantine-color-anchor': `var(--mantine-color-${theme.primaryColor}-${lightPrimaryShade})`,
      '--mantine-color-default': 'var(--mantine-color-white)',
      '--mantine-color-default-hover': 'var(--mantine-color-gray-0)',
      '--mantine-color-default-color': 'var(--mantine-color-black)',
      '--mantine-color-default-border': 'var(--mantine-color-gray-4)',
      '--mantine-color-dimmed': 'var(--mantine-color-gray-6)',
      '--mantine-color-disabled': 'var(--mantine-color-gray-2)',
      '--mantine-color-disabled-color': 'var(--mantine-color-gray-5)',
      '--mantine-color-disabled-border': 'var(--mantine-color-gray-3)',
    },
    dark: {
      '--mantine-color-scheme': 'dark',
      '--mantine-primary-color-contrast': getPrimaryContrastColor(theme, 'dark'),
      '--mantine-color-bright': 'var(--mantine-color-white)',
      '--mantine-color-text': 'var(--mantine-color-dark-0)',
      '--mantine-color-body': 'var(--mantine-color-dark-7)',
      '--mantine-color-error': 'var(--mantine-color-red-8)',
      '--mantine-color-placeholder': 'var(--mantine-color-dark-3)',
      '--mantine-color-anchor': `var(--mantine-color-${theme.primaryColor}-4)`,
      '--mantine-color-default': 'var(--mantine-color-dark-6)',
      '--mantine-color-default-hover': 'var(--mantine-color-dark-5)',
      '--mantine-color-default-color': 'var(--mantine-color-white)',
      '--mantine-color-default-border': 'var(--mantine-color-dark-4)',
      '--mantine-color-dimmed': 'var(--mantine-color-dark-2)',
      '--mantine-color-disabled': 'var(--mantine-color-dark-6)',
      '--mantine-color-disabled-color': 'var(--mantine-color-dark-3)',
      '--mantine-color-disabled-border': 'var(--mantine-color-dark-4)',
    },
  }

  assignSizeVariables(result.variables, theme.breakpoints, 'breakpoint')
  assignSizeVariables(result.variables, theme.spacing, 'spacing')
  assignSizeVariables(result.variables, theme.fontSizes, 'font-size')
  assignSizeVariables(result.variables, theme.lineHeights, 'line-height')
  assignSizeVariables(result.variables, theme.shadows, 'shadow')
  assignSizeVariables(result.variables, theme.radius, 'radius')
  assignSizeVariables(result.variables, theme.fontWeights, 'font-weight')

  theme.colors[theme.primaryColor].forEach((_, index) => {
    result.variables[`--mantine-primary-color-${index}`] =
      `var(--mantine-color-${theme.primaryColor}-${index})`
  })

  keys(theme.colors).forEach((color) => {
    const value = theme.colors[color]

    if (isVirtualColor(value)) {
      Object.assign(
        result.light!,
        getCSSColorVariables({
          theme,
          color: value.light,
          colorScheme: 'light',
          name: value.name,
        }),
      )
      Object.assign(
        result.dark!,
        getCSSColorVariables({
          theme,
          color: value.dark,
          colorScheme: 'dark',
          name: value.name,
        }),
      )
      return
    }

    value.forEach((shade, index) => {
      result.variables[`--mantine-color-${color}-${index}`] = shade
    })

    Object.assign(
      result.light!,
      getCSSColorVariables({ theme, color, colorScheme: 'light', withColorValues: false }),
    )
    Object.assign(
      result.dark!,
      getCSSColorVariables({ theme, color, colorScheme: 'dark', withColorValues: false }),
    )
  })

  keys(theme.headings.sizes).forEach((heading) => {
    const value = theme.headings.sizes[heading as keyof typeof theme.headings.sizes]
    result.variables[`--mantine-${heading}-font-size`] = value.fontSize
    result.variables[`--mantine-${heading}-line-height`] = value.lineHeight
    result.variables[`--mantine-${heading}-font-weight`] =
      value.fontWeight || theme.headings.fontWeight
  })

  return result
}

export function getMergedVariables({
  theme,
  generator,
}: {
  theme: MantineTheme
  generator?: CSSVariablesResolver
}): ConvertCSSVariablesInput {
  const defaultVariables = defaultCssVariablesResolver(theme)

  if (!generator) {
    return defaultVariables
  }

  const generatedVariables = generator(theme)

  return {
    variables: deepMerge(defaultVariables.variables, generatedVariables.variables || {}),
    light: deepMerge(defaultVariables.light || {}, generatedVariables.light || {}),
    dark: deepMerge(defaultVariables.dark || {}, generatedVariables.dark || {}),
  }
}

export function cssVariablesObjectToString(variables: Record<string, string | undefined>) {
  return keys(variables)
    .filter((variable) => variables[variable] !== undefined)
    .map((variable) => `${variable}: ${variables[variable]};`)
    .join('\n')
}

export function convertCssVariables(input: ConvertCSSVariablesInput, selector = ':root') {
  const blocks = [`${selector}{${cssVariablesObjectToString(input.variables)}}`]

  if (input.light) {
    blocks.push(
      `${selector}[data-mantine-color-scheme="light"]{${cssVariablesObjectToString(input.light)}}`,
    )
  }

  if (input.dark) {
    blocks.push(
      `${selector}[data-mantine-color-scheme="dark"]{${cssVariablesObjectToString(input.dark)}}`,
    )
  }

  return blocks.join('\n')
}
