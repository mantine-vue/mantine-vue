import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  MantineSize,
  MantineVariant,
  StylesApiProps,
} from '../../core'

export type ThemeIconStylesNames = 'root'

export type ThemeIconVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'transparent'
  | 'white'
  | 'default'
  | 'gradient'

export type ThemeIconCssVariables = {
  root: '--ti-size' | '--ti-radius' | '--ti-bg' | '--ti-color' | '--ti-bd'
}

export interface ThemeIconSlots {
  /** Icon displayed inside the component. */
  default?: () => VNodeChild
}

/** Props declared by `ThemeIcon` itself. See `ThemeIconProps` for the full public type. */
export interface ThemeIconOwnProps extends StylesApiProps<ThemeIconProps> {
  /**
   * Controls width and height of the component. Numbers are converted to rem.
   * @default 'md'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Key of `theme.radius` or any valid CSS value to set border-radius.
   * Numbers are converted to rem.
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /**
   * Gradient data used when `variant="gradient"`.
   * @default theme.defaultGradient
   */
  gradient?: MantineGradient

  /**
   * If set, adjusts text color based on background color for `filled` variant.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Controls visual representation of the component.
   * @default 'filled'
   */
  variant?: MantineVariant<ThemeIconVariant>
}

export interface ThemeIconProps
  extends Omit<BoxProps, keyof ThemeIconOwnProps>, ThemeIconOwnProps {}
