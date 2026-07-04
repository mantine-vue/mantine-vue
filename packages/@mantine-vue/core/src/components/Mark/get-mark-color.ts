import { parseThemeColor, type MantineTheme } from '../../core'

export function getMarkColor({
  color,
  theme,
  defaultShade,
}: {
  color: string | undefined
  theme: MantineTheme
  defaultShade: number
}) {
  const parsed = parseThemeColor({ color, theme, colorScheme: 'light' })

  if (!parsed.isThemeColor) {
    return color
  }

  if (parsed.shade === undefined) {
    return `var(--mantine-color-${parsed.color}-${defaultShade})`
  }

  return parsed.value
}
