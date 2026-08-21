import type { BoxProps, Factory } from '@mantine-vue/core'
import type { StylesApiProps } from '@mantine-vue/core/styles-api'
import type { ScheduleLabelsOverride } from '../../../labels'
import type { ScheduleViewLevel } from '../../../types'

export type ViewSelectStylesNames = 'viewSelect'

/** Props declared by `ViewSelect` itself. See `ViewSelectProps` for the full public type. */
export interface ViewSelectOwnProps extends StylesApiProps<ViewSelectFactory> {
  /**
   * View levels offered by the select, in display order.
   * @default ['day', 'week', 'month', 'year']
   */
  views?: readonly ScheduleViewLevel[]

  /** Currently selected view level, bound with `v-model`. */
  modelValue?: ScheduleViewLevel

  /**
   * Currently selected view level.
   * @deprecated Use `v-model` or `modelValue` instead.
   */
  value?: ScheduleViewLevel

  /** Key of `theme.radius` or any valid CSS value to set `border-radius`. */
  radius?: string | number

  /** Label overrides, merged over the ones provided by the surrounding `ScheduleHeader`. */
  labels?: ScheduleLabelsOverride
}

export interface ViewSelectProps
  extends Omit<BoxProps, keyof ViewSelectOwnProps>, ViewSelectOwnProps {}

export interface ViewSelectEmits {
  /** Emitted when another view level is selected, bound with `v-model`. */
  'update:modelValue': [value: ScheduleViewLevel]

  /** Emitted when another view level is selected. */
  change: [value: ScheduleViewLevel]
}

export type ViewSelectFactory = Factory<{
  props: Omit<ViewSelectProps, 'rootRef'>
  emits: ViewSelectEmits
  ref: HTMLDivElement
  element: 'div'
  stylesNames: ViewSelectStylesNames
}>
