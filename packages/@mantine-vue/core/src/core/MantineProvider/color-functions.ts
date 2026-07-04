import { rem } from '@mantine-vue/utils'
import type {
  MantineColorScheme,
  MantineColorShade,
  MantineColorsTuple,
  MantineGradient,
  MantineTheme,
  VariantColorsResolver,
} from './theme.types'

export function getPrimaryShade(
  theme: MantineTheme,
  colorScheme: MantineColorScheme,
): MantineColorShade {
  if (typeof theme.primaryShade === 'number') {
    return theme.primaryShade
  }

  return colorScheme === 'dark' ? theme.primaryShade.dark : theme.primaryShade.light
}

export interface RGBA {
  r: number
  g: number
  b: number
  a: number
}

function isHexColor(hex: string): boolean {
  const HEX_REGEXP = /^#?([0-9A-F]{3}){1,2}([0-9A-F]{2})?$/i
  return HEX_REGEXP.test(hex)
}

function hexToRgba(color: string): RGBA {
  let hexString = color.replace('#', '')

  if (hexString.length === 3) {
    const shorthandHex = hexString.split('')
    hexString = [
      shorthandHex[0],
      shorthandHex[0],
      shorthandHex[1],
      shorthandHex[1],
      shorthandHex[2],
      shorthandHex[2],
    ].join('')
  }

  if (hexString.length === 8) {
    const alpha = Number.parseInt(hexString.slice(6, 8), 16) / 255
    return {
      r: Number.parseInt(hexString.slice(0, 2), 16),
      g: Number.parseInt(hexString.slice(2, 4), 16),
      b: Number.parseInt(hexString.slice(4, 6), 16),
      a: alpha,
    }
  }

  const parsed = Number.parseInt(hexString, 16)
  const r = (parsed >> 16) & 255
  const g = (parsed >> 8) & 255
  const b = parsed & 255

  return { r, g, b, a: 1 }
}

function rgbStringToRgba(color: string): RGBA {
  const [r, g, b, a] = color
    .replace(/[^0-9,./]/g, '')
    .split(/[/,]/)
    .map(Number)

  return { r, g, b, a: a === undefined ? 1 : a }
}

function hslStringToRgba(hslaString: string): RGBA {
  const hslaRegex =
    /^hsla?\(\s*(\d+)\s*,\s*(\d+%)\s*,\s*(\d+%)\s*(,\s*(0?\.\d+|\d+(\.\d+)?))?\s*\)$/i

  const matches = hslaString.match(hslaRegex)
  if (!matches) {
    return { r: 0, g: 0, b: 0, a: 1 }
  }

  const h = Number.parseInt(matches[1], 10)
  const s = Number.parseInt(matches[2], 10) / 100
  const l = Number.parseInt(matches[3], 10) / 100
  const a = matches[5] ? Number.parseFloat(matches[5]) : undefined

  const chroma = (1 - Math.abs(2 * l - 1)) * s
  const huePrime = h / 60
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1))
  const m = l - chroma / 2

  let r: number
  let g: number
  let b: number

  if (huePrime >= 0 && huePrime < 1) {
    r = chroma
    g = x
    b = 0
  } else if (huePrime >= 1 && huePrime < 2) {
    r = x
    g = chroma
    b = 0
  } else if (huePrime >= 2 && huePrime < 3) {
    r = 0
    g = chroma
    b = x
  } else if (huePrime >= 3 && huePrime < 4) {
    r = 0
    g = x
    b = chroma
  } else if (huePrime >= 4 && huePrime < 5) {
    r = x
    g = 0
    b = chroma
  } else {
    r = chroma
    g = 0
    b = x
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
    a: a || 1,
  }
}

export function toRgba(color: string): RGBA {
  if (isHexColor(color)) {
    return hexToRgba(color)
  }

  if (color.startsWith('rgb')) {
    return rgbStringToRgba(color)
  }

  if (color.startsWith('hsl')) {
    return hslStringToRgba(color)
  }

  return { r: 0, g: 0, b: 0, a: 1 }
}

export function rgba(color: string, alpha: number) {
  if (typeof color !== 'string' || alpha > 1 || alpha < 0) {
    return 'rgba(0, 0, 0, 1)'
  }

  if (color.startsWith('var(')) {
    const mixPercentage = (1 - alpha) * 100
    return `color-mix(in srgb, ${color}, transparent ${mixPercentage}%)`
  }

  if (color.startsWith('oklch')) {
    if (color.includes('/')) {
      return color.replace(/\/\s*[\d.]+\s*\)/, `/ ${alpha})`)
    }
    return color.replace(')', ` / ${alpha})`)
  }

  const { r, g, b } = toRgba(color)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const alpha = rgba

export function darken(color: string, alphaValue: number) {
  if (color.startsWith('var(')) {
    return `color-mix(in srgb, ${color}, black ${alphaValue * 100}%)`
  }

  const { r, g, b, a } = toRgba(color)
  const f = 1 - alphaValue
  const dark = (input: number) => Math.round(input * f)

  return `rgba(${dark(r)}, ${dark(g)}, ${dark(b)}, ${a})`
}

export function lighten(color: string, alphaValue: number) {
  if (color.startsWith('var(')) {
    return `color-mix(in srgb, ${color}, white ${alphaValue * 100}%)`
  }

  const { r, g, b, a } = toRgba(color)
  const light = (input: number) => Math.round(input + (255 - input) * alphaValue)

  return `rgba(${light(r)}, ${light(g)}, ${light(b)}, ${a})`
}

function gammaCorrect(c: number) {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function getLightnessFromOklch(oklchColor: string) {
  const match = oklchColor.match(/oklch\((.*?)%\s/)
  return match ? Number.parseFloat(match[1]) : null
}

export function luminance(color: string): number {
  if (color.startsWith('oklch(')) {
    return (getLightnessFromOklch(color) || 0) / 100
  }

  const { r, g, b } = toRgba(color)

  const sR = r / 255
  const sG = g / 255
  const sB = b / 255

  const rLinear = gammaCorrect(sR)
  const gLinear = gammaCorrect(sG)
  const bLinear = gammaCorrect(sB)

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

export function isLightColor(color: string, luminanceThreshold = 0.179) {
  if (color.startsWith('var(')) {
    return false
  }

  return luminance(color) > luminanceThreshold
}

export function colorsTuple(input: string | string[]): MantineColorsTuple {
  if (Array.isArray(input)) {
    return input as unknown as MantineColorsTuple
  }

  return Array(10).fill(input) as unknown as MantineColorsTuple
}

interface VirtualColorInput {
  dark: string
  light: string
  name: string
}

export type VirtualColor = MantineColorsTuple & {
  'mantine-virtual-color': true
  name: string
  dark: string
  light: string
}

export function virtualColor(input: VirtualColorInput): MantineColorsTuple {
  const result = colorsTuple(
    Array.from({ length: 10 }).map((_, i) => `var(--mantine-color-${input.name}-${i})`),
  )

  Object.defineProperty(result, 'mantine-virtual-color', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: true,
  })
  Object.defineProperty(result, 'dark', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: input.dark,
  })
  Object.defineProperty(result, 'light', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: input.light,
  })
  Object.defineProperty(result, 'name', {
    enumerable: false,
    writable: false,
    configurable: false,
    value: input.name,
  })

  return result
}

export function isVirtualColor(value: unknown): value is VirtualColor {
  return !!value && typeof value === 'object' && 'mantine-virtual-color' in value
}

export interface ParseThemeColorResult {
  color: string
  value: string
  shade: MantineColorShade | undefined
  variable: string | undefined
  isThemeColor: boolean
  isLight: boolean
}

export function parseThemeColor({
  color,
  theme,
  colorScheme,
}: {
  color: unknown
  theme: MantineTheme
  colorScheme?: MantineColorScheme
}): ParseThemeColorResult {
  if (typeof color !== 'string') {
    throw new Error(
      `[@mantine-vue/core] Failed to parse color. Expected color to be a string, instead got ${typeof color}`,
    )
  }

  if (color === 'bright') {
    const value = colorScheme === 'dark' ? theme.white : theme.black
    return {
      color,
      value,
      shade: undefined,
      isThemeColor: false,
      isLight: isLightColor(value, theme.luminanceThreshold),
      variable: '--mantine-color-bright',
    }
  }

  if (color === 'dimmed') {
    const value = colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[7]
    return {
      color,
      value,
      shade: undefined,
      isThemeColor: false,
      isLight: isLightColor(
        colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
        theme.luminanceThreshold,
      ),
      variable: '--mantine-color-dimmed',
    }
  }

  if (color === 'white' || color === 'black') {
    const value = color === 'white' ? theme.white : theme.black
    return {
      color,
      value,
      shade: undefined,
      isThemeColor: false,
      isLight: isLightColor(value, theme.luminanceThreshold),
      variable: `--mantine-color-${color}`,
    }
  }

  const [_color, shade] = color.split('.')
  const colorShade = shade ? (Number(shade) as MantineColorShade) : undefined
  const isThemeColor = _color in theme.colors

  if (isThemeColor) {
    const colorValue =
      colorShade !== undefined
        ? theme.colors[_color][colorShade]
        : theme.colors[_color][getPrimaryShade(theme, colorScheme || 'light')]

    return {
      color: _color,
      value: colorValue,
      shade: colorShade,
      isThemeColor,
      isLight: isLightColor(colorValue, theme.luminanceThreshold),
      variable: shade
        ? `--mantine-color-${_color}-${colorShade}`
        : `--mantine-color-${_color}-filled`,
    }
  }

  return {
    color,
    value: color,
    isThemeColor,
    isLight: isLightColor(color, theme.luminanceThreshold),
    shade: colorShade,
    variable: undefined,
  }
}

export function getThemeColor(
  color: string | undefined | null,
  theme: MantineTheme,
  colorScheme: MantineColorScheme = 'light',
) {
  const parsed = parseThemeColor({ color: color || theme.primaryColor, theme, colorScheme })
  return parsed.variable ? `var(${parsed.variable})` : (color as string)
}

export function getGradient(gradient: MantineGradient | undefined, theme: MantineTheme) {
  const merged = {
    from: gradient?.from || theme.defaultGradient.from,
    to: gradient?.to || theme.defaultGradient.to,
    deg: gradient?.deg ?? theme.defaultGradient.deg ?? 0,
  }

  const fromColor = getThemeColor(merged.from, theme)
  const toColor = getThemeColor(merged.to, theme)

  return `linear-gradient(${merged.deg}deg, ${fromColor} 0%, ${toColor} 100%)`
}

export function getAutoContrastValue(autoContrast: boolean | undefined, theme: MantineTheme) {
  return typeof autoContrast === 'boolean' ? autoContrast : theme.autoContrast
}

export function getContrastColor({
  color,
  theme,
  autoContrast,
}: {
  color?: string | null
  theme: MantineTheme
  autoContrast?: boolean | null
}) {
  const _autoContrast = typeof autoContrast === 'boolean' ? autoContrast : theme.autoContrast

  if (!_autoContrast) {
    return 'var(--mantine-color-white)'
  }

  const parsed = parseThemeColor({ color: color || theme.primaryColor, theme })
  return parsed.isLight ? 'var(--mantine-color-black)' : 'var(--mantine-color-white)'
}

export function getPrimaryContrastColor(theme: MantineTheme, colorScheme: 'light' | 'dark') {
  return getContrastColor({
    color: theme.colors[theme.primaryColor][getPrimaryShade(theme, colorScheme)],
    theme,
    autoContrast: null,
  })
}

export const defaultVariantColorsResolver: VariantColorsResolver = ({
  color,
  theme,
  variant,
  gradient,
  autoContrast,
}) => {
  const parsed = parseThemeColor({ color, theme })
  const _autoContrast = typeof autoContrast === 'boolean' ? autoContrast : theme.autoContrast

  if (variant === 'none') {
    return { background: 'transparent', hover: 'transparent', color: 'inherit', border: 'none' }
  }

  if (variant === 'filled') {
    const textColor = _autoContrast
      ? parsed.isLight
        ? 'var(--mantine-color-black)'
        : 'var(--mantine-color-white)'
      : 'var(--mantine-color-white)'

    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: `var(--mantine-color-${color}-filled)`,
          hover: `var(--mantine-color-${color}-filled-hover)`,
          color: textColor,
          border: `${rem(1)} solid transparent`,
        }
      }

      return {
        background: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
        hover: `var(--mantine-color-${parsed.color}-${parsed.shade === 9 ? 8 : parsed.shade + 1})`,
        color: textColor,
        border: `${rem(1)} solid transparent`,
      }
    }

    return {
      background: color!,
      hover: darken(color!, 0.1),
      color: textColor,
      border: `${rem(1)} solid transparent`,
    }
  }

  if (variant === 'light') {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: `var(--mantine-color-${color}-light)`,
          hover: `var(--mantine-color-${color}-light-hover)`,
          color: `var(--mantine-color-${color}-light-color)`,
          border: `${rem(1)} solid transparent`,
        }
      }

      const parsedColor = theme.colors[parsed.color][parsed.shade]

      return {
        background: parsedColor,
        hover: darken(parsedColor, 0.1),
        color: `var(--mantine-color-${parsed.color}-light-color)`,
        border: `${rem(1)} solid transparent`,
      }
    }

    return {
      background: rgba(color!, 0.1),
      hover: rgba(color!, 0.12),
      color: color!,
      border: `${rem(1)} solid transparent`,
    }
  }

  if (variant === 'outline') {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: 'transparent',
          hover: `var(--mantine-color-${color}-outline-hover)`,
          color: `var(--mantine-color-${color}-outline)`,
          border: `${rem(1)} solid var(--mantine-color-${color}-outline)`,
        }
      }

      return {
        background: 'transparent',
        hover: rgba(theme.colors[parsed.color][parsed.shade], 0.05),
        color: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
        border: `${rem(1)} solid var(--mantine-color-${parsed.color}-${parsed.shade})`,
      }
    }

    return {
      background: 'transparent',
      hover: rgba(color!, 0.05),
      color: color!,
      border: `${rem(1)} solid ${color}`,
    }
  }

  if (variant === 'subtle') {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: 'transparent',
          hover: `var(--mantine-color-${color}-light-hover)`,
          color: `var(--mantine-color-${color}-light-color)`,
          border: `${rem(1)} solid transparent`,
        }
      }

      const parsedColor = theme.colors[parsed.color][parsed.shade]

      return {
        background: 'transparent',
        hover: rgba(parsedColor, 0.12),
        color: `var(--mantine-color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
        border: `${rem(1)} solid transparent`,
      }
    }

    return {
      background: 'transparent',
      hover: rgba(color!, 0.12),
      color: color!,
      border: `${rem(1)} solid transparent`,
    }
  }

  if (variant === 'transparent') {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: 'transparent',
          hover: 'transparent',
          color: `var(--mantine-color-${color}-light-color)`,
          border: `${rem(1)} solid transparent`,
        }
      }

      return {
        background: 'transparent',
        hover: 'transparent',
        color: `var(--mantine-color-${parsed.color}-${Math.min(parsed.shade, 6)})`,
        border: `${rem(1)} solid transparent`,
      }
    }

    return {
      background: 'transparent',
      hover: 'transparent',
      color: color!,
      border: `${rem(1)} solid transparent`,
    }
  }

  if (variant === 'white') {
    if (parsed.isThemeColor) {
      if (parsed.shade === undefined) {
        return {
          background: 'var(--mantine-color-white)',
          hover: darken(theme.white, 0.01),
          color: `var(--mantine-color-${color}-filled)`,
          border: `${rem(1)} solid transparent`,
        }
      }

      return {
        background: 'var(--mantine-color-white)',
        hover: darken(theme.white, 0.01),
        color: `var(--mantine-color-${parsed.color}-${parsed.shade})`,
        border: `${rem(1)} solid transparent`,
      }
    }

    return {
      background: 'var(--mantine-color-white)',
      hover: darken(theme.white, 0.01),
      color: color!,
      border: `${rem(1)} solid transparent`,
    }
  }

  if (variant === 'gradient') {
    return {
      background: getGradient(gradient, theme),
      hover: getGradient(gradient, theme),
      color: 'var(--mantine-color-white)',
      border: 'none',
    }
  }

  if (variant === 'default') {
    return {
      background: 'var(--mantine-color-default)',
      hover: 'var(--mantine-color-default-hover)',
      color: 'var(--mantine-color-default-color)',
      border: `${rem(1)} solid var(--mantine-color-default-border)`,
    }
  }

  return {} as ReturnType<VariantColorsResolver>
}
