import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  StylesApiProps,
} from '../../../core'
import type { ButtonSize, ButtonVariant } from '../Button'

export type ButtonGroupSectionStylesNames = 'groupSection'
export type ButtonGroupSectionCssVariables = {
  groupSection:
    | '--section-radius'
    | '--section-bg'
    | '--section-color'
    | '--section-bd'
    | '--section-height'
    | '--section-padding-x'
    | '--section-fz'
}

/** Props declared by `ButtonGroupSection` itself. See `ButtonGroupSectionProps` for the full public type. */
export interface ButtonGroupSectionOwnProps extends StylesApiProps<ButtonGroupSectionProps> {
  /** Controls section `height`, `font-size` and horizontal `padding`. @default 'sm' */
  size?: ButtonSize

  /** Key of `theme.colors` or any valid CSS color. @default theme.primaryColor */
  color?: MantineColor

  /** Key of `theme.radius` or any valid CSS value. @default theme.defaultRadius */
  radius?: MantineRadius

  /** Gradient configuration used with `variant="gradient"`. @default theme.defaultGradient */
  gradient?: MantineGradient

  /** If set, adjusts text color based on the background color for the `filled` variant. */
  autoContrast?: boolean

  /** Visual variant. @default 'filled' */
  variant?: ButtonVariant
}

export interface ButtonGroupSectionProps
  extends Omit<BoxProps, keyof ButtonGroupSectionOwnProps>, ButtonGroupSectionOwnProps {}

export interface ButtonGroupSectionSlots {
  /** Section content. */
  default?: () => VNodeChild
}
