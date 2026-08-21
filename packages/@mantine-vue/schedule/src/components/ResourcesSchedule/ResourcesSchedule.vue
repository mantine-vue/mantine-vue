<script lang="ts">
import type { ResourcesScheduleOwnProps } from './ResourcesSchedule.types'

const defaultProps = {
  defaultView: 'day',
  mode: 'default',
  recurrenceExpansionLimit: 2000,
} satisfies Partial<ResourcesScheduleOwnProps>

export { defaultProps }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, useAttrs, useSlots } from 'vue'
import { Box, useProps, useStyles } from '@mantine-vue/core'
import { useUncontrolled } from '@mantine-vue/hooks'
import type { DateStringValue, ScheduleViewLevel } from '../../types'
import { toDateString } from '../../utils'
import { ResourcesDayView } from '../ResourcesDayView'
import { ResourcesMonthView } from '../ResourcesMonthView'
import { ResourcesWeekView } from '../ResourcesWeekView'
import { resolveEventRenderers } from '../shared'
import type {
  ResourcesScheduleEmits,
  ResourcesScheduleSlots,
  ResourcesScheduleViewLevel,
} from './ResourcesSchedule.types'
import classes from './ResourcesSchedule.module.css'

defineOptions({
  name: 'ResourcesSchedule',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<ResourcesScheduleOwnProps>(), {
  date: undefined,
  defaultDate: undefined,
  onDateChange: undefined,
  view: undefined,
  defaultView: undefined,
  onViewChange: undefined,
  events: undefined,
  locale: undefined,
  radius: undefined,
  labels: undefined,
  renderEventBody: undefined,
  renderResourceLabel: undefined,
  onEventDrop: undefined,
  canDragEvent: undefined,
  onEventDragStart: undefined,
  onEventDragEnd: undefined,
  onTimeSlotClick: undefined,
  onDayClick: undefined,
  onEventClick: undefined,
  onSlotDragEnd: undefined,
  mode: undefined,
  onExternalEventDrop: undefined,
  onEventResize: undefined,
  canResizeEvent: undefined,
  recurrenceExpansionLimit: undefined,
  dayViewProps: undefined,
  weekViewProps: undefined,
  monthViewProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<ResourcesScheduleSlots>()

const emit = defineEmits<ResourcesScheduleEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('ResourcesSchedule', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'ResourcesSchedule',
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

const [currentView, setCurrentView] = useUncontrolled<ResourcesScheduleViewLevel>({
  value: () => props.view,
  defaultValue: props.defaultView,
  finalValue: 'day',
  onChange: (value) => {
    emit('update:view', value)
    emit('viewChange', value)
  },
})

/** The views offer a year level that this component does not support, so it is ignored. */
const changeView = (view: ScheduleViewLevel) => {
  if (view === 'day' || view === 'week' || view === 'month') {
    setCurrentView(view)
  }
}

const isStatic = computed(() => props.mode === 'static')

const eventRenderers = computed(() =>
  resolveEventRenderers({ renderEventBody: props.renderEventBody }, slots),
)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const sharedProps = computed(() => ({
  resources: props.resources,
  date: currentDate.value,
  events: props.events,
  locale: props.locale,
  radius: props.radius,
  labels: props.labels,
  mode: props.mode,
  renderResourceLabel: props.renderResourceLabel,
  withEventsDragAndDrop: isStatic.value ? false : props.withEventsDragAndDrop,
  canDragEvent: props.canDragEvent,
  withDragSlotSelect: props.withDragSlotSelect,
  recurrenceExpansionLimit: props.recurrenceExpansionLimit,
  onDateChange: setCurrentDate,
  onViewChange: changeView,
  onEventDrop: (data: any) => emit('eventDrop', data),
  onEventDragStart: (event: any) => emit('eventDragStart', event),
  onEventDragEnd: () => emit('eventDragEnd'),
  onEventClick: (event: any, nativeEvent: MouseEvent) => emit('eventClick', event, nativeEvent),
  onSlotDragEnd: (data: any) => emit('slotDragEnd', data),
  onExternalEventDrop: (data: any) => emit('externalEventDrop', data),
  ...eventRenderers.value,
  ...stylesApi.value,
}))

const timeViewProps = computed(() => ({
  onTimeSlotClick: (data: any) => emit('timeSlotClick', data),
  withEventResize: isStatic.value ? false : props.withEventResize,
  canResizeEvent: props.canResizeEvent,
  onEventResize: (data: any) => emit('eventResize', data),
}))

const activeView = computed(() => {
  switch (currentView.value) {
    case 'week':
      return ResourcesWeekView
    case 'month':
      return ResourcesMonthView
    default:
      return ResourcesDayView
  }
})

const activeViewProps = computed(() => {
  switch (currentView.value) {
    case 'week':
      return { ...sharedProps.value, ...timeViewProps.value, ...props.weekViewProps }
    case 'month':
      return {
        ...sharedProps.value,
        onDayClick: (data: any) => emit('dayClick', data),
        ...props.monthViewProps,
      }
    default:
      return { ...sharedProps.value, ...timeViewProps.value, ...props.dayViewProps }
  }
})
</script>

<template>
  <Box v-bind="{ ...attrs, ...getStyles('root') }">
    <component :is="activeView" v-bind="activeViewProps">
      <template v-if="slots.corner" #corner="payload">
        <slot name="corner" v-bind="payload" />
      </template>
      <template v-if="slots.resourceLabel" #resourceLabel="payload">
        <slot name="resourceLabel" v-bind="payload" />
      </template>
      <template v-if="slots.groupLabel" #groupLabel="payload">
        <slot name="groupLabel" v-bind="payload" />
      </template>
    </component>
  </Box>
</template>
