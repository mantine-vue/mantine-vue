import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ScheduleLabelsOverride } from '../../../labels'

export type HeaderControlStylesNames = 'headerControl'

export type HeaderControlCssVariables = {
  headerControl: '--control-radius'
}

export interface HeaderControlSlots {
  /** Control content. */
  default?: () => VNodeChild
}

/** Props declared by `HeaderControl` itself. See `HeaderControlProps` for the full public type. */
export interface HeaderControlOwnProps extends StylesApiProps<HeaderControlFactory> {
  /**
   * If set, the control is rendered in its active state.
   * @default false
   */
  active?: boolean

  /**
   * If set, horizontal padding is removed so the control renders as a square.
   * @default false
   */
  square?: boolean

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /**
   * If set to `false`, the control is not clickable and is removed from the tab order.
   * @default true
   */
  interactive?: boolean

  /** Label overrides, merged over the ones provided by the surrounding `ScheduleHeader`. */
  labels?: ScheduleLabelsOverride
}

export interface HeaderControlProps
  extends Omit<BoxProps, keyof HeaderControlOwnProps>, HeaderControlOwnProps {}

export type HeaderControlFactory = Factory<{
  props: Omit<HeaderControlProps, 'rootRef'>
  slots: HeaderControlSlots
  ref: HTMLButtonElement
  element: 'button'
  stylesNames: HeaderControlStylesNames
  vars: HeaderControlCssVariables
}>
