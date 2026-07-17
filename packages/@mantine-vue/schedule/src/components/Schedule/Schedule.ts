import dayjs from 'dayjs'
import { defineComponent, h, ref, watch, type PropType, type SlotsType, type VNodeChild } from 'vue'
import { Box } from '@mantine-vue/core'
import type {
  DayViewProps,
  MobileMonthViewProps,
  MonthViewProps,
  RenderEventBody,
  ScheduleProps,
  WeekViewProps,
  YearViewProps,
} from '../../component-props'
import type {
  DateStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleViewLevel,
} from '../../types'
import { toDateString } from '../../utils'
import { DayView } from '../DayView/DayView'
import { MobileMonthView } from '../MobileMonthView/MobileMonthView'
import { MonthView } from '../MonthView/MonthView'
import { WeekView } from '../WeekView/WeekView'
import { YearView } from '../YearView/YearView'
import classes from './Schedule.module.css'

export interface ScheduleSlots {
  /** Scoped alternative to the `renderEventBody` prop */
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  /** Scoped alternative to the `renderEvent` prop */
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
  /** Scoped alternative to WeekView's `renderWeekLabel` prop */
  weekLabel?: (props: { weekStart: DateStringValue; weekEnd: DateStringValue }) => VNodeChild
  /** Scoped alternative to MobileMonthView's `renderHeader` prop */
  header?: (props: {
    mode: ScheduleMode
    date: Date | DateStringValue
    defaultHeader: VNodeChild
  }) => VNodeChild
}

export const Schedule = defineComponent({
  name: 'Schedule',
  inheritAttrs: false,
  slots: Object as SlotsType<ScheduleSlots>,
  props: {
    date: [String, Date] as PropType<Date | DateStringValue>,
    defaultDate: [String, Date] as PropType<Date | DateStringValue>,
    onDateChange: Function as PropType<(date: DateStringValue) => void>,
    view: String as PropType<ScheduleViewLevel>,
    defaultView: { type: String as PropType<ScheduleViewLevel>, default: 'week' },
    onViewChange: Function as PropType<(view: ScheduleViewLevel) => void>,
    events: Array as PropType<ScheduleEventData[]>,
    locale: String,
    radius: [String, Number] as PropType<string | number>,
    labels: Object,
    renderEventBody: Function as PropType<RenderEventBody>,
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<ScheduleProps['onEventDrop']>,
    canDragEvent: Function as PropType<ScheduleProps['canDragEvent']>,
    onEventDragStart: Function as PropType<ScheduleProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<ScheduleProps['onEventDragEnd']>,
    onTimeSlotClick: Function as PropType<ScheduleProps['onTimeSlotClick']>,
    onAllDaySlotClick: Function as PropType<ScheduleProps['onAllDaySlotClick']>,
    onEventClick: Function as PropType<ScheduleProps['onEventClick']>,
    onDayClick: Function as PropType<ScheduleProps['onDayClick']>,
    onMonthClick: Function as PropType<ScheduleProps['onMonthClick']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<ScheduleProps['onSlotDragEnd']>,
    mode: { type: String as PropType<ScheduleMode>, default: 'default' },
    onExternalEventDrop: Function as PropType<ScheduleProps['onExternalEventDrop']>,
    withEventResize: Boolean,
    onEventResize: Function as PropType<ScheduleProps['onEventResize']>,
    canResizeEvent: Function as PropType<ScheduleProps['canResizeEvent']>,
    recurrenceExpansionLimit: { type: Number, default: 2000 },
    layout: { type: String as PropType<'default' | 'responsive'>, default: 'default' },
    dayViewProps: Object as PropType<Partial<DayViewProps>>,
    weekViewProps: Object as PropType<Partial<WeekViewProps>>,
    monthViewProps: Object as PropType<Partial<MonthViewProps>>,
    yearViewProps: Object as PropType<Partial<YearViewProps>>,
    mobileMonthViewProps: Object as PropType<Partial<MobileMonthViewProps>>,
  },
  setup(props, { attrs, slots }) {
    const currentDate = ref(toDateString(props.date || props.defaultDate || dayjs()))
    const currentView = ref<ScheduleViewLevel>(props.view || props.defaultView)
    watch(
      () => props.date,
      (value) => {
        if (value !== undefined) currentDate.value = toDateString(value)
      },
    )
    watch(
      () => props.view,
      (value) => {
        if (value !== undefined) currentView.value = value
      },
    )
    const changeDate = (date: DateStringValue) => {
      if (props.date === undefined) currentDate.value = date
      props.onDateChange?.(date)
    }
    const changeView = (view: ScheduleViewLevel) => {
      if (props.view === undefined) currentView.value = view
      props.onViewChange?.(view)
    }
    return () => {
      const shared = {
        date: currentDate.value,
        onDateChange: changeDate,
        onViewChange: changeView,
        events: props.events,
        locale: props.locale,
        radius: props.radius,
        labels: props.labels,
        renderEventBody: props.renderEventBody,
        withEventsDragAndDrop: props.withEventsDragAndDrop,
        onEventDrop: props.onEventDrop,
        canDragEvent: props.canDragEvent,
        onEventDragStart: props.onEventDragStart,
        onEventDragEnd: props.onEventDragEnd,
        onTimeSlotClick: props.onTimeSlotClick,
        onAllDaySlotClick: props.onAllDaySlotClick,
        onEventClick: props.onEventClick,
        onDayClick: props.onDayClick,
        onMonthClick: props.onMonthClick,
        withDragSlotSelect: props.withDragSlotSelect,
        onSlotDragEnd: props.onSlotDragEnd,
        mode: props.mode,
        onExternalEventDrop: props.onExternalEventDrop,
        withEventResize: props.withEventResize,
        onEventResize: props.onEventResize,
        canResizeEvent: props.canResizeEvent,
        recurrenceExpansionLimit: props.recurrenceExpansionLimit,
      }
      const components = {
        day: [DayView, props.dayViewProps],
        week: [WeekView, props.weekViewProps],
        month: [MonthView, props.monthViewProps],
        year: [YearView, props.yearViewProps],
      } as const
      const viewSlots: Record<string, unknown> = {}
      if (slots.eventBody) viewSlots.eventBody = slots.eventBody
      if (slots.event) viewSlots.event = slots.event
      if (slots.weekLabel) viewSlots.weekLabel = slots.weekLabel
      if (slots.header) viewSlots.header = slots.header
      const forwardedSlots = Object.keys(viewSlots).length ? viewSlots : undefined

      const [component, viewProps] = components[currentView.value]
      const desktop = h(component, { ...shared, ...viewProps }, forwardedSlots)

      if (props.layout !== 'responsive') {
        return h(Box, { ...attrs, class: [classes.root, attrs.class], style: attrs.style }, () => [
          desktop,
        ])
      }

      const mobile =
        currentView.value === 'year'
          ? h(YearView, { ...shared, ...props.yearViewProps }, forwardedSlots)
          : h(
              MobileMonthView,
              {
                ...shared,
                ...props.mobileMonthViewProps,
                onYearClick: () => changeView('year'),
                onDayClick: (date: DateStringValue, event: MouseEvent) => {
                  props.onDayClick?.(date, event)
                  props.mobileMonthViewProps?.onDayClick?.(date, event)
                },
              },
              forwardedSlots,
            )

      return h(
        Box,
        {
          ...attrs,
          mod: { layout: props.layout },
          class: [classes.root, attrs.class],
          style: attrs.style,
        },
        () => [
          h(Box, { class: classes.desktopView }, () => [desktop]),
          h(Box, { class: classes.mobileView }, () => [mobile]),
        ],
      )
    }
  },
})

export type { ScheduleProps }
export type ScheduleLayout = 'default' | 'responsive'
export type ScheduleStylesNames =
  | 'root'
  | 'desktopView'
  | 'mobileView'
  | import('../DayView/DayView').DayViewStylesNames
  | import('../WeekView/WeekView').WeekViewStylesNames
  | import('../MonthView/MonthView').MonthViewStylesNames
  | import('../YearView/YearView').YearViewStylesNames
  | import('../MobileMonthView/MobileMonthView').MobileMonthViewStylesNames
