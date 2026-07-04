import { deepMerge } from '@mantine-vue/utils'
import type { MantineTheme, MantineThemeOverride } from './theme.types'

export const INVALID_PRIMARY_COLOR_ERROR =
  '[@mantine-vue/core] MantineProvider: Invalid theme.primaryColor, it accepts only key of theme.colors'

export const INVALID_PRIMARY_SHADE_ERROR =
  '[@mantine-vue/core] MantineProvider: Invalid theme.primaryShade, it accepts only 0-9 integers or an object { light: 0-9, dark: 0-9 }'

function isValidPrimaryShade(shade: number) {
  return shade >= 0 && shade <= 9 && parseInt(shade.toString(), 10) === shade
}

export function validateMantineTheme(theme: MantineTheme): asserts theme is MantineTheme {
  if (!(theme.primaryColor in theme.colors)) {
    throw new Error(INVALID_PRIMARY_COLOR_ERROR)
  }

  if (typeof theme.primaryShade === 'object') {
    if (
      !isValidPrimaryShade(theme.primaryShade.dark) ||
      !isValidPrimaryShade(theme.primaryShade.light)
    ) {
      throw new Error(INVALID_PRIMARY_SHADE_ERROR)
    }
  }

  if (typeof theme.primaryShade === 'number' && !isValidPrimaryShade(theme.primaryShade)) {
    throw new Error(INVALID_PRIMARY_SHADE_ERROR)
  }
}

export function mergeMantineTheme(
  currentTheme: MantineTheme,
  themeOverride?: MantineThemeOverride,
) {
  if (!themeOverride) {
    validateMantineTheme(currentTheme)
    return currentTheme
  }

  const result = deepMerge(currentTheme, themeOverride as any)

  if (themeOverride.fontFamily && !themeOverride.headings?.fontFamily) {
    result.headings = { ...result.headings, fontFamily: themeOverride.fontFamily }
  }

  validateMantineTheme(result)
  return result
}
