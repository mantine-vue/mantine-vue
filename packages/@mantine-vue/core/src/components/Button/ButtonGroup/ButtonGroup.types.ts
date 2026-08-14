import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

/** Props declared by `ButtonGroup` itself. See `ButtonGroupProps` for the full public type. */
export interface ButtonGroupOwnProps extends StylesApiProps<ButtonGroupFactory> {
  /** Receives the root DOM node. */
  rootRef?: VueRefTarget<Element>

  /**
   * Orientation of the group
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * `border-width` of the child `Button` components. Numbers are converted to rem.
   *
   * @default 1
   */
  borderWidth?: string | number
}

export interface ButtonGroupProps
  extends Omit<BoxProps, keyof ButtonGroupOwnProps>, ButtonGroupOwnProps {}

export interface ButtonGroupSlots {
  /** Grouped buttons. */
  default?: () => VNodeChild
}

export type ButtonGroupStylesNames = 'group'

export type ButtonGroupCssVariables = {
  group: '--button-border-width'
}

export type ButtonGroupFactory = Factory<{
  props: Omit<ButtonGroupProps, 'rootRef'>
  ref: HTMLDivElement
  slots: ButtonGroupSlots
  element: 'div'
  stylesNames: ButtonGroupStylesNames
  vars: ButtonGroupCssVariables
}>
import type { VueRefTarget } from '@mantine-vue/hooks'
