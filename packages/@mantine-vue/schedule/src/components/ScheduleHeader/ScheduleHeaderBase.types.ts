import type { VNodeChild } from 'vue'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ForwardedProps, NativeButtonProps } from '../../component-props'
import type { ScheduleLabelsOverride } from '../../labels'
import type { DateStringValue, ScheduleViewLevel } from '../../types'
import type {
  MonthYearSelectEmits,
  MonthYearSelectProps,
} from './MonthYearSelect/MonthYearSelect.types'
import type { ViewSelectEmits, ViewSelectProps } from './ViewSelect/ViewSelect.types'

/** Date the navigation controls move to, computed by the view that owns the header. */
export interface ScheduleHeaderNavigationHandlers {
  previous: () => DateStringValue
  next: () => DateStringValue
  today: () => DateStringValue
}

/** What sits between the previous and next controls: either a plain title or a month/year select. */
export interface ScheduleHeaderControl {
  /** Static title. Ignored when `monthYearSelect` is set. */
  title?: VNodeChild

  /** Minimum width of the title control. */
  miw?: string | number

  /** Renders a `MonthYearSelect` instead of a static title. */
  monthYearSelect?: ForwardedProps<MonthYearSelectProps, MonthYearSelectEmits>
}

export interface ScheduleHeaderBaseEmits {
  /** Emitted when a navigation control picks a new date. */
  dateChange: [date: DateStringValue]

  /** Emitted when the view select picks a new view level. */
  viewChange: [view: ScheduleViewLevel]
}

export interface ScheduleHeaderBaseSlots {
  /** Replaces the static title between the navigation controls. */
  title?: () => VNodeChild
}

/**
 * Internal building block shared by every view header. Not part of the public API –
 * views expose the pieces of it they support through their own props.
 */
export interface ScheduleHeaderBaseProps extends StylesApiProps<any> {
  /** View level the select marks as active. */
  view: ScheduleViewLevel

  /** Dates the previous, next and today controls navigate to. */
  navigationHandlers: ScheduleHeaderNavigationHandlers

  /** Content rendered between the previous and next controls. */
  control: ScheduleHeaderControl

  /** Label overrides shared with the controls. */
  labels?: ScheduleLabelsOverride

  /** Props passed to the previous control. */
  previousControlProps?: NativeButtonProps

  /** Props passed to the next control. */
  nextControlProps?: NativeButtonProps

  /** Props passed to the today control. */
  todayControlProps?: NativeButtonProps

  /** Props passed to the view select. */
  viewSelectProps?: ForwardedProps<ViewSelectProps, ViewSelectEmits>
}
