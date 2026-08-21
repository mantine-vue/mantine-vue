import type { VNodeChild } from 'vue'
import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ScheduleLabelsOverride } from '../../labels'
import type { HeaderControlStylesNames } from './HeaderControl/HeaderControl.types'
import type { MonthYearSelectStylesNames } from './MonthYearSelect/MonthYearSelect.types'
import type { ViewSelectStylesNames } from './ViewSelect/ViewSelect.types'

export type ScheduleHeaderStylesNames =
  | 'header'
  | 'navigationGroup'
  | 'todayControl'
  | 'viewSelect'
  | 'compactViewSelect'

/** Every selector reachable through `ScheduleHeader` and the controls it renders. */
export type CombinedScheduleHeaderStylesNames =
  | ScheduleHeaderStylesNames
  | HeaderControlStylesNames
  | ViewSelectStylesNames
  | MonthYearSelectStylesNames

export interface ScheduleHeaderSlots {
  /** Header content, usually `ScheduleHeader.Previous`, `.Today`, `.ViewSelect` and friends. */
  default?: () => VNodeChild
}

/** Props declared by `ScheduleHeader` itself. See `ScheduleHeaderProps` for the full public type. */
export interface ScheduleHeaderOwnProps extends StylesApiProps<ScheduleHeaderFactory> {
  /** Label overrides shared with every compound component rendered inside the header. */
  labels?: ScheduleLabelsOverride
}

export interface ScheduleHeaderProps
  extends Omit<BoxProps, keyof ScheduleHeaderOwnProps>, ScheduleHeaderOwnProps {}

export type ScheduleHeaderFactory = Factory<{
  props: Omit<ScheduleHeaderProps, 'rootRef'>
  slots: ScheduleHeaderSlots
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ScheduleHeaderStylesNames
}>
