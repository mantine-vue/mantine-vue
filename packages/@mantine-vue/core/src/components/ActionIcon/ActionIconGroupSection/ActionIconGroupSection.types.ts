import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  MantineSize,
  StylesApiProps,
} from '../../../core'
import type { ActionIconVariant } from '../ActionIcon'

export type ActionIconGroupSectionStylesNames = 'groupSection'
export type ActionIconGroupSectionCssVariables = {
  groupSection:
    | '--section-radius'
    | '--section-bg'
    | '--section-color'
    | '--section-bd'
    | '--section-height'
    | '--section-padding-x'
    | '--section-fz'
}

/** Props declared by `ActionIconGroupSection` itself. See `ActionIconGroupSectionProps` for the full public type. */
export interface ActionIconGroupSectionOwnProps extends StylesApiProps<ActionIconGroupSectionProps> {
  /** Controls section `height`, `font-size` and horizontal `padding`. @default 'sm' */
  size?: MantineSize | (string & {}) | number

  /** Key of `theme.colors` or any valid CSS color. @default theme.primaryColor */
  color?: MantineColor

  /** Key of `theme.radius` or any valid CSS value. @default theme.defaultRadius */
  radius?: MantineRadius

  /** Gradient values used with `variant="gradient"`. @default theme.defaultGradient */
  gradient?: MantineGradient

  /** If set, adjusts text color based on the background color for the `filled` variant. */
  autoContrast?: boolean

  /** Visual variant. @default 'filled' */
  variant?: ActionIconVariant
}

export interface ActionIconGroupSectionProps
  extends Omit<BoxProps, keyof ActionIconGroupSectionOwnProps>, ActionIconGroupSectionOwnProps {}

export interface ActionIconGroupSectionSlots {
  /** Section content. */
  default?: () => VNodeChild
}
