import type { CSSProperties } from 'vue'

export type PartialDeep<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
    ? { [K in keyof T]?: PartialDeep<T[K]> }
    : T

export type MantineColorScheme = 'light' | 'dark' | 'auto'
export type MantineColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type MantineSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- public declaration-merging hook
export interface MantineThemeSizesOverride {}

type CustomThemeSize<Section extends string> =
  MantineThemeSizesOverride extends Record<Section, Record<infer CustomSize, string>>
    ? CustomSize
    : MantineSize

export type MantineRadius = CustomThemeSize<'radius'> | (string & {}) | number
export type MantineSpacing = CustomThemeSize<'spacing'> | (string & {}) | number
export type MantineColorsTuple = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  ...string[],
]

export interface MantinePrimaryShade {
  light: MantineColorShade
  dark: MantineColorShade
}

export interface MantineGradient {
  from: string
  to: string
  deg?: number
}

export type DefaultMantineColor =
  | 'dark'
  | 'gray'
  | 'red'
  | 'pink'
  | 'grape'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'orange'
  | 'teal'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- public declaration-merging hook
export interface MantineThemeColorsOverride {}

type ThemeColorName = MantineThemeColorsOverride extends {
  colors: Record<infer CustomColor, MantineColorsTuple>
}
  ? CustomColor
  : DefaultMantineColor

export type MantineThemeColors = Record<ThemeColorName | (string & {}), MantineColorsTuple>
export type MantineColor =
  | ThemeColorName
  | `${ThemeColorName & string}.${MantineColorShade}`
  | 'white'
  | 'black'
  | 'dimmed'
  | 'bright'
  | (string & {})
export type MantineThemeOther = Record<string, any>
export type MantineStylesRecord = Record<string, CSSProperties>

export interface VariantColorResolverInput {
  color?: string
  theme: MantineTheme
  variant: string
  gradient?: MantineGradient
  autoContrast?: boolean
}

export interface VariantColorsResolverResult {
  background: string
  hover: string
  hoverColor?: string
  color: string
  border: string
}

export type VariantColorsResolver = (
  input: VariantColorResolverInput,
) => VariantColorsResolverResult

export interface MantineThemeComponent {
  classNames?: any
  styles?: any
  vars?: any
  defaultProps?: any
}

export interface MantineTheme {
  focusRing: 'auto' | 'always' | 'never'
  scale: number
  fontSmoothing: boolean
  white: string
  black: string
  colors: MantineThemeColors
  primaryShade: MantineColorShade | MantinePrimaryShade
  primaryColor: string
  variantColorResolver: VariantColorsResolver
  autoContrast: boolean
  luminanceThreshold: number
  fontFamily: string
  fontFamilyMonospace: string
  headings: {
    fontFamily: string
    fontWeight: string
    textWrap: 'wrap' | 'nowrap' | 'balance' | 'pretty' | 'stable'
    sizes: Record<
      'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
      { fontSize: string; lineHeight: string; fontWeight?: string }
    >
  }
  radius: Record<string, string>
  defaultRadius: MantineRadius
  spacing: Record<string, string>
  fontSizes: Record<string, string>
  lineHeights: Record<string, string>
  fontWeights: Record<string, string>
  breakpoints: Record<string, string>
  shadows: Record<string, string>
  respectReducedMotion: boolean
  cursorType: 'default' | 'pointer'
  defaultGradient: MantineGradient
  activeClassName: string
  focusClassName: string
  components: Record<string, MantineThemeComponent>
  other: MantineThemeOther
}

export type MantineThemeOverride = PartialDeep<MantineTheme>
