import type { VNodeChild } from 'vue'
import type { BoxProps, StylesApiProps, Factory } from '../../../core'

/** Props declared by `ActionIconGroup` itself. See `ActionIconGroupProps` for the full public type. */
export interface ActionIconGroupOwnProps extends StylesApiProps<ActionIconGroupFactory> {
  /**
   * Group orientation
   *
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'

  /**
   * `border-width` of the child components.
   *
   * @default 1
   */
  borderWidth?: string | number
}

export interface ActionIconGroupProps
  extends Omit<BoxProps, keyof ActionIconGroupOwnProps>, ActionIconGroupOwnProps {}

export interface ActionIconGroupSlots {
  /** Grouped action icons. */
  default?: () => VNodeChild
}

export type ActionIconGroupStylesNames = 'group'

export type ActionIconGroupCssVariables = {
  group: '--ai-border-width'
}

export type ActionIconGroupFactory = Factory<{
  props: ActionIconGroupProps
  ref: HTMLDivElement
  slots: ActionIconGroupSlots
  element: 'div'
  stylesNames: ActionIconGroupStylesNames
  vars: ActionIconGroupCssVariables
}>
