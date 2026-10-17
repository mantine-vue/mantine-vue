import type { MantineThemeOverride } from '@mantine-vue/core'
import { generateColors } from '@mantine-vue/colors-generator'
import {
  getFontPreset,
  getThemePreset,
  type Density,
  type FontPreset,
  type RadiusKey,
  type ThemePreset,
} from './presets'

export interface AppearanceSettings {
  /** Theme preset id; `null` uses the restaurant's branding default. */
  themePreset: string | null
  /** Custom brand color (hex) overriding the preset. */
  brandColor: string | null
  accentColor: string | null
  /** Font preset id; `null` uses the theme preset's font. */
  font: string | null
  radius: RadiusKey | null
  density: Density
}

export interface ResolvedAppearance {
  preset: ThemePreset
  font: FontPreset
  brand: string
  accent: string
  radius: RadiusKey
  density: Density
}

const BASE_SPACING = { xs: 0.625, sm: 0.75, md: 1, lg: 1.25, xl: 2 }
const DENSITY_SCALE: Record<Density, number> = { compact: 0.75, comfortable: 1, spacious: 1.3 }
const HEX_COLOR = /^#(?:[0-9a-f]{3}){1,2}$/i

export function resolveAppearance(
  settings: AppearanceSettings,
  restaurantThemePreset?: string,
): ResolvedAppearance {
  const preset = getThemePreset(settings.themePreset ?? restaurantThemePreset)
  return {
    preset,
    font: getFontPreset(settings.font ?? preset.font),
    brand:
      settings.brandColor && HEX_COLOR.test(settings.brandColor)
        ? settings.brandColor
        : preset.brand,
    accent:
      settings.accentColor && HEX_COLOR.test(settings.accentColor)
        ? settings.accentColor
        : preset.accent,
    radius: settings.radius ?? preset.radius,
    density: settings.density,
  }
}

const quote = (family: string) => (/\s/.test(family) ? `'${family}'` : family)
export const fontStack = (families: string[]) => families.map(quote).join(', ')

const paletteCache = new Map<string, ReturnType<typeof generateColors>>()
function palette(color: string) {
  let colors = paletteCache.get(color)
  if (!colors) {
    colors = generateColors(color)
    paletteCache.set(color, colors)
  }
  return colors
}

/** Converts resolved appearance into a Mantine theme override. */
export function buildMantineTheme(appearance: ResolvedAppearance): MantineThemeOverride {
  const scale = DENSITY_SCALE[appearance.density]
  const spacing = Object.fromEntries(
    Object.entries(BASE_SPACING).map(([key, value]) => [
      key,
      `calc(${(value * scale).toFixed(4)}rem * var(--mantine-scale))`,
    ]),
  )

  return {
    primaryColor: 'brand',
    primaryShade: { light: 6, dark: 5 },
    autoContrast: true,
    colors: {
      brand: palette(appearance.brand),
      accent: palette(appearance.accent),
    } as MantineThemeOverride['colors'],
    defaultRadius: appearance.radius,
    fontFamily: fontStack(appearance.font.body),
    headings: {
      fontFamily: fontStack(appearance.font.heading),
      fontWeight: appearance.font.headingWeight,
    },
    spacing,
    cursorType: 'pointer',
    focusRing: 'auto',
    respectReducedMotion: true,
    other: { density: appearance.density },
  }
}

/** Google Fonts stylesheet URL for a font preset, or `null` for system fonts. */
export function getGoogleFontsUrl(font: FontPreset): string | null {
  if (font.googleFonts.length === 0) {
    return null
  }
  const families = font.googleFonts.map((family) => `family=${family.replace(/ /g, '+')}`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}
