import dayjs from 'dayjs'
import { defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { Box, NativeSelect } from '@mantine-vue/core'
import { getLabel, type ScheduleLabelsOverride } from '../../labels'
import type { DateStringValue, ScheduleViewLevel } from '../../types'
import type {
  MonthYearSelectProps,
  NativeButtonProps,
  ViewSelectProps,
} from '../../component-props'
import { toDateString } from '../../utils'
import { ScheduleHeader } from './ScheduleHeader'
import classes from './ScheduleHeader.module.css'

export interface ScheduleHeaderBaseProps {
  view: ScheduleViewLevel
  navigationHandlers: {
    previous: () => DateStringValue
    next: () => DateStringValue
    today: () => DateStringValue
  }
  control: { title?: VNodeChild; miw?: string | number; monthYearSelect?: MonthYearSelectProps }
  labels?: ScheduleLabelsOverride
  onDateChange?: (date: DateStringValue) => void
  onViewChange?: (view: ScheduleViewLevel) => void
  previousControlProps?: NativeButtonProps
  nextControlProps?: NativeButtonProps
  todayControlProps?: NativeButtonProps
  viewSelectProps?: Partial<ViewSelectProps>
}

export const ScheduleHeaderBase = defineComponent({
  name: 'ScheduleHeaderBase',
  props: {
    view: { type: String as PropType<ScheduleViewLevel>, required: true },
    navigationHandlers: {
      type: Object as PropType<ScheduleHeaderBaseProps['navigationHandlers']>,
      required: true,
    },
    control: { type: Object as PropType<ScheduleHeaderBaseProps['control']>, required: true },
    labels: Object as PropType<ScheduleLabelsOverride>,
    onDateChange: Function as PropType<(date: DateStringValue) => void>,
    onViewChange: Function as PropType<(view: ScheduleViewLevel) => void>,
    previousControlProps: Object as PropType<NativeButtonProps>,
    nextControlProps: Object as PropType<NativeButtonProps>,
    todayControlProps: Object as PropType<NativeButtonProps>,
    viewSelectProps: Object as PropType<Partial<ViewSelectProps>>,
  },
  setup(props) {
    return () => {
      const views = props.viewSelectProps?.views || ['day', 'week', 'month', 'year']
      return h(ScheduleHeader, { labels: props.labels }, () => [
        h(Box, { class: classes.navigationGroup }, () => [
          h(ScheduleHeader.Previous, {
            ...props.previousControlProps,
            onClick: () => props.onDateChange?.(props.navigationHandlers.previous()),
          }),
          props.control.monthYearSelect
            ? h(ScheduleHeader.MonthYearSelect, {
                ...props.control.monthYearSelect,
                labels: props.labels,
              })
            : h(ScheduleHeader.Control, { interactive: false }, () => props.control.title),
          h(ScheduleHeader.Next, {
            ...props.nextControlProps,
            onClick: () => props.onDateChange?.(props.navigationHandlers.next()),
          }),
        ]),
        h(Box, { class: classes.todayControl }, () => [
          h(ScheduleHeader.Today, {
            ...props.todayControlProps,
            onClick: () => props.onDateChange?.(props.navigationHandlers.today()),
          }),
        ]),
        h(NativeSelect, {
          class: classes.compactViewSelect,
          value: props.view,
          size: 'sm',
          data: views.map((view) => ({ value: view, label: getLabel(view, props.labels) })),
          'aria-label': getLabel('viewSelectLabel', props.labels),
          onChange: (event: Event) =>
            props.onViewChange?.(
              (event.currentTarget as HTMLSelectElement).value as ScheduleViewLevel,
            ),
        }),
        h(Box, { class: classes.viewSelect, style: { marginInlineStart: 'auto' } }, () => [
          h(ScheduleHeader.ViewSelect, {
            ...props.viewSelectProps,
            value: props.view,
            labels: props.labels,
            onChange: props.onViewChange,
          }),
        ]),
      ])
    }
  },
})

export function createHeaderNavigation(
  date: Date | string,
  unit: 'day' | 'week' | 'month' | 'year',
) {
  return {
    previous: () => toDateString(dayjs(date).subtract(1, unit)),
    next: () => toDateString(dayjs(date).add(1, unit)),
    today: () => toDateString(dayjs()),
  }
}
