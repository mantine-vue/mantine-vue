import type { VNodeChild } from 'vue'
import type {
  BoxProps,
  MantineColor,
  MantineGradient,
  MantineRadius,
  StylesApiProps,
  Factory,
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
export interface ButtonGroupSectionOwnProps extends StylesApiProps<ButtonGroupSectionFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

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

export type ButtonGroupSectionFactory = Factory<{
  props: Omit<ButtonGroupSectionProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ButtonGroupSectionSlots
  element: 'div'
  stylesNames: ButtonGroupSectionStylesNames
  vars: ButtonGroupSectionCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
