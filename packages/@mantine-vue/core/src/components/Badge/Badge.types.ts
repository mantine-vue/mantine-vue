import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineNode,
  MantineRadius,
  MantineSize,
  MantineVariant,
  SectionSlots,
  StylesApiProps,
} from '../../core'

export type BadgeStylesNames = 'root' | 'section' | 'label'

export type BadgeVariant =
  | 'filled'
  | 'light'
  | 'outline'
  | 'dot'
  | 'transparent'
  | 'white'
  | 'default'
  | 'gradient'

export type BadgeCssVariables = {
  root:
    | '--badge-height'
    | '--badge-padding-x'
    | '--badge-fz'
    | '--badge-radius'
    | '--badge-bg'
    | '--badge-color'
    | '--badge-bd'
    | '--badge-dot-color'
}

export interface BadgeSlots extends SectionSlots {
  /** Main badge content. */
  default?: () => VNodeChild
}

/**
 * Props declared by `Badge` itself. `BadgeProps` is the public type – it also
 * carries every `BoxProps` style prop, which `Badge` forwards to `Box` through
 * fallthrough attributes rather than declaring at runtime.
 */
export interface BadgeOwnProps extends StylesApiProps<BadgeProps> {
  /**
   * Root element or component rendered by `Badge`.
   * @default 'div'
   */
  component?: string

  /**
   * Controls `font-size`, `height` and horizontal `padding`.
   * @default 'md'
   */
  size?: MantineSize | (string & {})

  /**
   * If set, badge `min-width` becomes equal to its `height` and horizontal padding is removed.
   * @default false
   */
  circle?: boolean

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`.
   * @default 'xl'
   */
  radius?: MantineRadius

  /**
   * Key of `theme.colors` or any valid CSS color.
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Gradient configuration used when `variant="gradient"`.
   * @default theme.defaultGradient
   */
  gradient?: MantineGradient

  /**
   * Content displayed on the left side of the badge label.
   * Can also be set with the `leftSection` slot – the slot takes precedence over the prop.
   */
  leftSection?: MantineNode

  /**
   * Content displayed on the right side of the badge label.
   * Can also be set with the `rightSection` slot – the slot takes precedence over the prop.
   */
  rightSection?: MantineNode

  /**
   * Determines whether Badge should take 100% of its parent width.
   * @default false
   */
  fullWidth?: boolean

  /**
   * If set, adjusts text color based on background color for `filled` variant.
   * Inherits `theme.autoContrast` when not set.
   */
  autoContrast?: boolean

  /**
   * Controls visual representation of the badge.
   * @default 'filled'
   */
  variant?: MantineVariant<BadgeVariant>
}

export interface BadgeProps extends Omit<BoxProps, keyof BadgeOwnProps>, BadgeOwnProps {}
