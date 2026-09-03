<script lang="ts">
import type { ScheduleOwnProps } from './Schedule.types'

const defaultProps = {
  defaultView: 'week',
  mode: 'default',
  recurrenceExpansionLimit: 2000,
  layout: 'default',
} satisfies Partial<ScheduleOwnProps>

export { defaultProps }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs, useSlots } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import type { DateStringValue, ScheduleViewLevel } from '../../types'
import { toDateString } from '../../utils'
import { DayView } from '../DayView'
import { MobileMonthView } from '../MobileMonthView'
import { MonthView } from '../MonthView'
import { resolveEventRenderers } from '../shared'
import { WeekView } from '../WeekView'
import { YearView } from '../YearView'
import type { ScheduleEmits, ScheduleSlots } from './Schedule.types'
import classes from './Schedule.module.css'

defineOptions({
  name: 'Schedule',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ScheduleOwnProps>(), {
  date: undefined,
  defaultDate: undefined,
  view: undefined,
  defaultView: undefined,
  events: undefined,
  locale: undefined,
  radius: undefined,
  labels: undefined,
  renderEventBody: undefined,
  canDragEvent: undefined,
  mode: undefined,
  canResizeEvent: undefined,
  withInteractiveBackgroundEvents: undefined,
  recurrenceExpansionLimit: undefined,
  layout: undefined,
  dayViewProps: undefined,
  weekViewProps: undefined,
  monthViewProps: undefined,
  yearViewProps: undefined,
  mobileMonthViewProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ScheduleSlots>()

const emit = defineEmits<ScheduleEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('Schedule', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'Schedule',
  props,
  classes,
  get className() {
    return attrs.class
  },
  get style() {
    return attrs.style as any
  },
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
  vars: props.vars as any,
})

const [currentDate, setCurrentDate] = useUncontrolled<DateStringValue>({
  value: () => (props.date === undefined ? undefined : toDateString(props.date)),
  defaultValue: toDateString(props.defaultDate ?? dayjs()),
  onChange: (value) => {
    emit('update:date', value)
    emit('dateChange', value)
  },
})

const [currentView, setCurrentView] = useUncontrolled<ScheduleViewLevel>({
  value: () => props.view,
  defaultValue: props.defaultView,
  finalValue: 'week',
  onChange: (value) => {
    emit('update:view', value)
    emit('viewChange', value)
  },
})

const eventRenderers = computed(() =>
  resolveEventRenderers({ renderEventBody: props.renderEventBody }, slots),
)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const sharedProps = computed(() => ({
  date: currentDate.value,
  events: props.events,
  locale: props.locale,
  radius: props.radius,
  labels: props.labels,
  mode: props.mode,
  withEventsDragAndDrop: props.withEventsDragAndDrop,
  canDragEvent: props.canDragEvent,
  withDragSlotSelect: props.withDragSlotSelect,
  withExternalEventDrop: props.withExternalEventDrop,
  withEventResize: props.withEventResize,
  canResizeEvent: props.canResizeEvent,
  withInteractiveBackgroundEvents:
    props.mode === 'static' ? false : props.withInteractiveBackgroundEvents,
  recurrenceExpansionLimit: props.recurrenceExpansionLimit,
  ...eventRenderers.value,
  ...stylesApi.value,
}))

/**
 * Listeners re-emitted from the active view. They are `on*` keys rather than template `@`
 * bindings because a single object has to be spread onto whichever view is rendered — which is
 * exactly what the compiler produces for a template listener anyway.
 */
const sharedListeners = {
  onDateChange: (date: DateStringValue) => setCurrentDate(date),
  onViewChange: (view: ScheduleViewLevel) => setCurrentView(view),
  onEventDrop: (data: any) => emit('eventDrop', data),
  onEventDragStart: (event: any) => emit('eventDragStart', event),
  onEventDragEnd: () => emit('eventDragEnd'),
  onTimeSlotClick: (data: any) => emit('timeSlotClick', data),
  onAllDaySlotClick: (date: any, nativeEvent: MouseEvent) =>
    emit('allDaySlotClick', date, nativeEvent),
  onEventClick: (event: any, nativeEvent: MouseEvent) => emit('eventClick', event, nativeEvent),
  onDayClick: (date: any, nativeEvent: MouseEvent) => emit('dayClick', date, nativeEvent),
  onMonthClick: (month: any) => emit('monthClick', month),
  onSlotDragEnd: (rangeStart: any, rangeEnd: any) => emit('slotDragEnd', rangeStart, rangeEnd),
  onExternalEventDrop: (dataTransfer: DataTransfer, dateTime: any) =>
    emit('externalEventDrop', dataTransfer, dateTime),
  onEventResize: (data: any) => emit('eventResize', data),
}

const views = {
  day: DayView,
  week: WeekView,
  month: MonthView,
  year: YearView,
} as const

const activeView = computed(() => views[currentView.value])

const activeViewProps = computed(() => {
  const perView = {
    day: props.dayViewProps,
    week: {
      ...(slots.weekLabel ? { renderWeekLabel: (payload: any) => slots.weekLabel!(payload) } : {}),
      ...props.weekViewProps,
    },
    month: props.monthViewProps,
    year: props.yearViewProps,
  }

  return { ...sharedProps.value, ...sharedListeners, ...perView[currentView.value] }
})

/**
 * The responsive layout shows the year view unchanged on narrow screens, because
 * `MobileMonthView` has no year equivalent.
 */
const mobileView = computed(() => (currentView.value === 'year' ? YearView : MobileMonthView))

const mobileViewProps = computed(() => {
  if (currentView.value === 'year') {
    return { ...sharedProps.value, ...sharedListeners, ...props.yearViewProps }
  }

  const viewProps = props.mobileMonthViewProps

  return {
    ...sharedProps.value,
    ...sharedListeners,
    ...(slots.header ? { renderHeader: (payload: any) => slots.header!(payload) } : {}),
    ...viewProps,
    onYearClick: () => setCurrentView('year'),
    // Both the schedule-level and the view-level listener run, matching the desktop view.
    onDayClick: (date: DateStringValue, nativeEvent: MouseEvent) => {
      emit('dayClick', date, nativeEvent)
      viewProps?.onDayClick?.(date, nativeEvent)
    },
  }
})
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('root') }"
    :mod="[{ layout: props.layout }, (attrs as any).mod]"
  >
    <template v-if="props.layout !== 'responsive'">
      <component :is="activeView" v-bind="activeViewProps" />
    </template>

    <template v-else>
      <Box v-bind="getStyles('desktopView')">
        <component :is="activeView" v-bind="activeViewProps" />
      </Box>
      <Box v-bind="getStyles('mobileView')">
        <component :is="mobileView" v-bind="mobileViewProps" />
      </Box>
    </template>
  </Box>
</template>
