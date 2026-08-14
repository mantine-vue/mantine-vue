import type { Component, VNodeChild } from 'vue'
import type {
  BoxMod,
  BoxProps,
  MantineColor,
  MantineRadius,
  MantineSize,
  StylesApiProps,
  Factory,
} from '../../../core'

export type RadioIndicatorVariant = 'filled' | 'outline'

/** Props declared by `RadioIndicator` itself. See `RadioIndicatorProps` for the full public type. */
export interface RadioIndicatorOwnProps extends StylesApiProps<RadioIndicatorFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Key of theme.colors or any valid CSS color to set indicator background color in checked state
   *
   * @default theme.primaryColor
   */
  color?: MantineColor

  /**
   * Controls size of the component
   *
   * @default 'sm'
   */
  size?: MantineSize | (string & {}) | number

  /**
   * Key of `theme.radius` or any valid CSS value to set `border-radius`
   *
   * @default theme.defaultRadius
   */
  radius?: MantineRadius

  /** Key of theme.colors or any valid CSS color to set icon color. When not set, icon color is determined automatically based on theme.autoContrast setting */
  iconColor?: string

  /** If set, adjusts text color based on background color for `filled` variant */
  autoContrast?: boolean

  /** A component that replaces the default radio icon (centered dot) */
  icon?: Component

  /** Checked state */
  checked?: boolean

  /**
   * Disabled state
   *
   * @default false
   */
  disabled?: boolean

  /**
   * Controls visual representation of the component. Rendered as the `data-variant` attribute and passed to the Styles API.
   *
   * @default 'filled'
   */
  variant?: RadioIndicatorVariant

  /** Element modifiers transformed into `data-` attributes, for example, `{ 'data-size': 'xl' }`, falsy values are removed */
  mod?: BoxMod
}

export interface RadioIndicatorSlots {
  /** Custom checked-state icon. */
  icon?: (props: { class?: any; style?: any }) => VNodeChild
}

export interface RadioIndicatorProps
  extends Omit<BoxProps, keyof RadioIndicatorOwnProps>, RadioIndicatorOwnProps {}

export type RadioIndicatorStylesNames = 'icon' | 'indicator'

export type RadioIndicatorCssVariables = {
  indicator: '--radio-size' | '--radio-radius' | '--radio-color' | '--radio-icon-size'
}

export type RadioIndicatorFactory = Factory<{
  props: Omit<RadioIndicatorProps, 'rootRef'>
  ref: HTMLDivElement
  slots: RadioIndicatorSlots
  element: 'div'
  stylesNames: RadioIndicatorStylesNames
  vars: RadioIndicatorCssVariables
  variant: RadioIndicatorVariant
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
