<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { cssSize, resolveScheduleRadius } from '../shared'
import type { WeekViewOwnProps } from './WeekView.types'

const defaultProps = {
  mode: 'default',
  withHeader: true,
  recurrenceExpansionLimit: 2000,
  startTime: '00:00:00',
  endTime: '23:59:59',
  intervalMinutes: 60,
  slotLabelFormat: 'HH:mm',
  slotLabelInterval: 60,
  withCurrentTimeIndicator: true,
  withCurrentTimeBubble: true,
  slotHeight: 64,
  firstDayOfWeek: 1,
  weekdayFormat: 'ddd',
  dayFormat: 'D',
  withWeekNumber: true,
  withAllDaySlots: true,
  allDaySlotHeight: 44,
  weekendDays: [0, 6],
  withWeekendDays: true,
  weekLabelFormat: 'MMM D',
} satisfies Partial<WeekViewOwnProps>

/** Vertical step between stacked all-day event rows, in px. */
const ALL_DAY_ROW_HEIGHT = 22

const varsResolver = createVarsResolver<any>(
  (_theme, { radius, slotHeight, allDaySlotHeight, allDaySlotsHeight }) => ({
    weekView: {
      '--week-view-radius': resolveScheduleRadius(radius),
      '--week-view-slot-height': cssSize(slotHeight),
      '--week-view-all-day-slots-height': cssSize(allDaySlotsHeight ?? allDaySlotHeight),
      '--week-view-business-hours-bg': undefined,
      '--week-view-non-business-hours-bg': undefined,
    },
  }),
)

export { defaultProps, varsResolver, ALL_DAY_ROW_HEIGHT }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, ref, shallowRef, useAttrs, useSlots } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useEventResize } from '../../hooks/use-event-resize'
import { getLabel } from '../../labels'
import type {
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
} from '../../types'
import {
  formatDate,
  addMinutesToTime,
  clampIntervalMinutes,
  getBusinessHoursState,
  getDayTimeIntervals,
  getSlotLabelDate,
  getSlotLabelGroups,
  getWeekDays,
  getWeekNumber,
  isEventPlacementAllowed,
} from '../../utils'
import { CurrentTimeIndicator } from '../CurrentTimeIndicator'
import { ScheduleBackgroundEvent } from '../ScheduleBackgroundEvent'
import { ScheduleEvent } from '../ScheduleEvent'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import { provideScheduleDragState } from '../DragContext'
import {
  getDropEvent,
  getExpandedEvents,
  moveEventTo,
  moveEventToAllDay,
  resolveEventRenderers,
  scheduleViewportProps,
  scrollSlotIntoView,
  useStaticStyles,
} from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { useSlotDropTarget } from '../use-slot-drop-target'
import { getWeekLabel } from './get-week-label/get-week-label'
import { getWeekViewEvents } from './get-week-view-events/get-week-view-events'
import type { WeekViewEmits, WeekViewSlots } from './WeekView.types'
import classes from './WeekView.module.css'

defineOptions({
  name: 'WeekView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<WeekViewOwnProps>(), {
  events: undefined,
  locale: undefined,
  radius: undefined,
  labels: undefined,
  mode: undefined,
  withHeader: undefined,
  previousControlProps: undefined,
  nextControlProps: undefined,
  todayControlProps: undefined,
  viewSelectProps: undefined,
  renderEventBody: undefined,
  renderEvent: undefined,
  recurrenceExpansionLimit: undefined,
  withInteractiveBackgroundEvents: undefined,
  startTime: undefined,
  endTime: undefined,
  intervalMinutes: undefined,
  eventDragInterval: undefined,
  eventResizeInterval: undefined,
  slotLabelFormat: undefined,
  slotLabelInterval: undefined,
  withCurrentTimeIndicator: undefined,
  withCurrentTimeBubble: undefined,
  getCurrentTime: undefined,
  slotHeight: undefined,
  businessHours: undefined,
  canDragEvent: undefined,
  startScrollTime: undefined,
  canResizeEvent: undefined,
  eventOverlapMode: 'columns',
  eventOverlapRaiseDelay: 600,
  firstDayOfWeek: undefined,
  weekdayFormat: undefined,
  dayFormat: undefined,
  withWeekNumber: undefined,
  withWeekNumbers: undefined,
  withAllDaySlots: undefined,
  withAllDaySlot: undefined,
  allDaySlotHeight: undefined,
  allDaySlotsHeight: undefined,
  weekendDays: undefined,
  withWeekendDays: undefined,
  weekLabelFormat: undefined,
  renderWeekLabel: undefined,
  scrollAreaProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<WeekViewSlots>()

const emit = defineEmits<WeekViewEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('WeekView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'WeekView',
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
  varsResolver,
  rootSelector: 'weekView',
})

/**
 * Cached per selector: a week renders one slot per day and interval, and rebuilding the same
 * class list for each of them is what makes a drag re-render expensive.
 */
const staticStyles = useStaticStyles(getStyles)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const eventRenderers = computed(() => resolveEventRenderers(props, slots))

const weekRoot = ref<HTMLElement | null>(null)
const setWeekRoot = (node: Element | null) => {
  weekRoot.value = node instanceof HTMLElement ? node : null
}

const daySlotsContainers = new Map<string, HTMLElement>()

const slotDropTarget = useSlotDropTarget()
const dropDataTransfer = shallowRef<DataTransfer | null>(null)

const isStatic = computed(() => props.mode === 'static')

/** The plural names are the deprecated aliases; the canonical prop wins when both are set. */
const withWeekNumber = computed(() => props.withWeekNumbers ?? props.withWeekNumber)
const withAllDaySlots = computed(() => props.withAllDaySlot ?? props.withAllDaySlots)

const days = computed(() =>
  getWeekDays({
    week: props.date,
    firstDayOfWeek: props.firstDayOfWeek,
    withWeekendDays: props.withWeekendDays,
    weekendDays: props.weekendDays,
  }),
)

const now = computed(() => dayjs(props.getCurrentTime?.() ?? dayjs()))

const currentWeekdayIndex = computed(() => {
  if (!props.withCurrentTimeIndicator) {
    return -1
  }

  return props.forceCurrentTimeIndicator
    ? days.value.findIndex((date) => dayjs(date).day() === now.value.day())
    : days.value.findIndex((date) => dayjs(date).isSame(now.value, 'day'))
})

const expandedEvents = computed(() =>
  getExpandedEvents(
    props.events,
    dayjs(days.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(days.value.at(-1)).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    props.recurrenceExpansionLimit!,
  ),
)

const grouped = computed(() =>
  getWeekViewEvents({
    date: props.date,
    events: expandedEvents.value,
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
    firstDayOfWeek: props.firstDayOfWeek,
    weekendDays: props.weekendDays,
    withWeekendDays: props.withWeekendDays,
    eventOverlapMode: props.eventOverlapMode,
  }),
)

const intervals = computed(() =>
  getDayTimeIntervals({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
    labelIntervalMinutes: props.slotLabelInterval,
  }),
)

const withSlotSelect = computed(() => Boolean(props.withDragSlotSelect) && !isStatic.value)

const withDragHandlers = computed(
  () =>
    !isStatic.value &&
    (Boolean(props.withEventsDragAndDrop) || Boolean(props.withExternalEventDrop)),
)

const weekLabel = computed(() =>
  getWeekLabel({
    weekdays: days.value,
    locale: props.locale || 'en',
    weekLabelFormat: props.weekLabelFormat!,
    renderWeekLabel: slots.weekLabel
      ? (payload) => slots.weekLabel!(payload)
      : props.renderWeekLabel,
  }),
)

const rootVars = computed(() => ({
  '--number-of-days': String(days.value.length),
  '--indicator-offset-index':
    currentWeekdayIndex.value === -1 ? undefined : String(currentWeekdayIndex.value + 1),
  '--event-raise-delay': `${props.eventOverlapRaiseDelay}ms`,
}))

/**
 * Everything the template needs per day column.
 *
 * `days` holds `YYYY-MM-DD 00:00:00` strings, so the grid used to re-derive the day key, the
 * weekend flag and both labels for each of the hundreds of slots it renders. Doing it once per
 * day instead is what keeps a drag re-render cheap.
 */
const dayColumns = computed(() =>
  days.value.map((date) => {
    const day = dayjs(date)

    return {
      date,
      key: day.format('YYYY-MM-DD') as DateStringValue,
      isWeekend: props.weekendDays!.includes(day.day() as DayOfWeek),
      isToday: day.isSame(now.value, 'day'),
      weekdayLabel: formatDate({
        date,
        locale: props.locale || 'en',
        format: props.weekdayFormat!,
      }),
      dayLabel: formatDate({ date, locale: props.locale || 'en', format: props.dayFormat! }),
    }
  }),
)

const slotLabelGroups = computed(() =>
  getSlotLabelGroups(intervals.value).map((group) => ({
    ...group,
    label: group.isLabelStart
      ? formatDate({
          date: getSlotLabelDate(props.date, group.startTime),
          locale: props.locale || 'en',
          format: props.slotLabelFormat!,
        })
      : null,
    businessHours: getBusinessHoursState({
      time: group.startTime,
      endTime: group.endTime,
      businessHours: props.businessHours || ['09:00:00', '17:00:00'],
      highlightBusinessHours: props.highlightBusinessHours,
    }),
    size: String((group.slotsCount * clampIntervalMinutes(props.intervalMinutes!)) / 60),
  })),
)

const businessHoursStates = computed(() =>
  days.value.map((date) =>
    intervals.value.map((slot) =>
      getBusinessHoursState({
        time: slot.startTime,
        endTime: addMinutesToTime(slot.startTime, clampIntervalMinutes(props.intervalMinutes!)),
        businessHours: props.businessHours || ['09:00:00', '17:00:00'],
        highlightBusinessHours: props.highlightBusinessHours,
        dayOfWeek: dayjs(date).day() as DayOfWeek,
      }),
    ),
  ),
)

const eventResize = useEventResize({
  enabled: () => Boolean(props.withEventResize),
  mode: () => props.mode!,
  startTime: () => props.startTime!,
  endTime: () => props.endTime!,
  intervalMinutes: () => props.intervalMinutes!,
  resizeIntervalMinutes: () => props.eventResizeInterval,
  onEventResize: (data) => emit('eventResize', data),
  canResizeEvent: () => props.canResizeEvent,
  events: () => expandedEvents.value,
  preventEventOverlap: () => props.preventEventOverlap,
  canResizeEventTo: () => props.canResizeEventTo,
  onEventPlacementRejected: (data) => emit('eventPlacementRejected', data),
  withBackgroundEvents: () => Boolean(props.withInteractiveBackgroundEvents),
})

const slotDragSelect = useSlotDragSelect({
  enabled: () => withSlotSelect.value,
  onDragEnd: (startIndex, endIndex, group) => {
    const slotDate = dayjs(group).format('YYYY-MM-DD')
    const startSlot = intervals.value[startIndex]
    const endSlot = intervals.value[endIndex]

    if (startSlot && endSlot) {
      emit(
        'slotDragEnd',
        `${slotDate} ${startSlot.startTime}` as DateTimeStringValue,
        `${slotDate} ${endSlot.endTime}` as DateTimeStringValue,
      )
    }
  },
})

onMounted(async () => {
  if (!props.startScrollTime) {
    return
  }

  await nextTick()

  const targetIndex = intervals.value.findIndex(
    (interval) => interval.startTime >= props.startScrollTime!,
  )

  if (targetIndex < 0) {
    return
  }

  const target = weekRoot.value?.querySelector<HTMLElement>(
    `[data-week-day-index="0"][data-time-slot-index="${targetIndex}"]`,
  )

  scrollSlotIntoView(target)
})

const dragState = provideScheduleDragState({
  dragOverTarget: () => {
    const target = slotDropTarget.dropTarget.value
    return target
      ? {
          date: target.date,
          slotIndex: target.slotIndex,
          time: intervals.value[target.slotIndex]?.startTime,
        }
      : null
  },
  isSlotDragging: () => slotDragSelect.isDragging(),
  onDragEnd: () => {
    slotDropTarget.reset()
    dropDataTransfer.value = null
    emit('eventDragEnd')
  },
})

const dropValid = computed(() => {
  const target = slotDropTarget.dropTarget.value
  const interval = target && intervals.value[target.slotIndex]
  if (!target || !interval) return true

  const start = `${target.date} ${interval.startTime}` as DateTimeStringValue
  const event = dragState.draggedEvent.value
  if (event) {
    const next = moveEventTo(event, start)
    const validation = isEventPlacementAllowed({
      event,
      start: next.newStart,
      end: next.newEnd,
      events: expandedEvents.value,
      preventEventOverlap: props.preventEventOverlap,
    })
    return (
      validation.allowed &&
      props.canDropEvent?.({ event, start: next.newStart, end: next.newEnd }) !== false
    )
  }

  return dropDataTransfer.value
    ? props.canDropExternalEvent?.({ dataTransfer: dropDataTransfer.value, start }) !== false
    : true
})

const clickEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) =>
  emit('eventClick', event, nativeEvent)

const dragStart = (event: ScheduleEventData) => {
  dragState.startEventDrag(event)
  emit('eventDragStart', event)
}

const dragEnd = () => dragState.endEventDrag()

const setDaySlotsContainer = (date: string) => (element: unknown) => {
  if (element instanceof HTMLElement) {
    daySlotsContainers.set(date, element)
  } else {
    daySlotsContainers.delete(date)
  }
}

const focusWeekControl = (nativeEvent: KeyboardEvent, selector: string) => {
  const control = weekRoot.value?.querySelector<HTMLButtonElement>(selector)

  if (!control || control.disabled) {
    return
  }

  nativeEvent.preventDefault()
  control.focus()
}

const handleDayLabelKeydown = (nativeEvent: KeyboardEvent, dayIndex: number) => {
  const next =
    nativeEvent.key === 'ArrowRight'
      ? dayIndex + 1
      : nativeEvent.key === 'ArrowLeft'
        ? dayIndex - 1
        : -1

  if (next >= 0 && next < days.value.length) {
    focusWeekControl(nativeEvent, `[data-weekday-index="${next}"]`)
  }
}

const handleAllDaySlotKeydown = (nativeEvent: KeyboardEvent, dayIndex: number) => {
  if (nativeEvent.key === 'ArrowDown') {
    focusWeekControl(nativeEvent, `[data-week-day-index="${dayIndex}"][data-time-slot-index="0"]`)
    return
  }

  const next =
    nativeEvent.key === 'ArrowRight'
      ? dayIndex + 1
      : nativeEvent.key === 'ArrowLeft'
        ? dayIndex - 1
        : -1

  if (next >= 0 && next < days.value.length) {
    focusWeekControl(nativeEvent, `[data-all-day-index="${next}"]`)
  }
}

const handleTimeSlotKeydown = (nativeEvent: KeyboardEvent, dayIndex: number, slotIndex: number) => {
  if (nativeEvent.key === 'ArrowUp' && slotIndex === 0 && withAllDaySlots.value) {
    focusWeekControl(nativeEvent, `[data-all-day-index="${dayIndex}"]`)
    return
  }

  const nextDay =
    nativeEvent.key === 'ArrowRight'
      ? dayIndex + 1
      : nativeEvent.key === 'ArrowLeft'
        ? dayIndex - 1
        : dayIndex
  const nextSlot =
    nativeEvent.key === 'ArrowDown'
      ? slotIndex + 1
      : nativeEvent.key === 'ArrowUp'
        ? slotIndex - 1
        : slotIndex

  if (
    nextDay >= 0 &&
    nextDay < days.value.length &&
    nextSlot >= 0 &&
    nextSlot < intervals.value.length &&
    (nextDay !== dayIndex || nextSlot !== slotIndex)
  ) {
    focusWeekControl(
      nativeEvent,
      `[data-week-day-index="${nextDay}"][data-time-slot-index="${nextSlot}"]`,
    )
  }
}

const clickDayLabel = (date: string) => {
  emit('viewChange', 'day')
  emit('dateChange', date as DateStringValue)
}

const clickTimeSlot = (date: string, slotIndex: number, nativeEvent: MouseEvent) => {
  const datePart = dayjs(date).format('YYYY-MM-DD')
  const slot = intervals.value[slotIndex]

  emit('timeSlotClick', {
    slotStart: `${datePart} ${slot.startTime}` as DateTimeStringValue,
    slotEnd: `${datePart} ${slot.endTime}` as DateTimeStringValue,
    nativeEvent,
  })
}

const emitDrop = (nativeEvent: DragEvent, target: DateTimeStringValue) => {
  nativeEvent.preventDefault()
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (event) {
    const next = moveEventTo(event, target)
    const validation = isEventPlacementAllowed({
      event,
      start: next.newStart,
      end: next.newEnd,
      events: expandedEvents.value,
      preventEventOverlap: props.preventEventOverlap,
    })
    const accepted =
      validation.allowed &&
      props.canDropEvent?.({ event, start: next.newStart, end: next.newEnd }) !== false
    if (accepted) emit('eventDrop', next)
    else
      emit('eventPlacementRejected', {
        action: 'drop',
        event,
        start: next.newStart,
        end: next.newEnd,
        conflicts: validation.conflicts,
        reason: validation.allowed ? 'rejected' : 'overlap',
      })
  } else if (nativeEvent.dataTransfer) {
    if (
      props.canDropExternalEvent?.({ dataTransfer: nativeEvent.dataTransfer, start: target }) !==
      false
    )
      emit('externalEventDrop', nativeEvent.dataTransfer, target)
    else
      emit('eventPlacementRejected', {
        action: 'external-drop',
        dataTransfer: nativeEvent.dataTransfer,
        start: target,
        conflicts: [],
        reason: 'rejected',
      })
  }
}

const emitAllDayDrop = (nativeEvent: DragEvent, date: string) => {
  nativeEvent.preventDefault()
  const dayKey = dayjs(date).format('YYYY-MM-DD')
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (event) {
    const next = moveEventToAllDay(event, dayKey)
    const validation = isEventPlacementAllowed({
      event,
      start: next.newStart,
      end: next.newEnd,
      events: expandedEvents.value,
      preventEventOverlap: props.preventEventOverlap,
    })
    const accepted =
      validation.allowed &&
      props.canDropEvent?.({ event, start: next.newStart, end: next.newEnd }) !== false
    if (accepted) emit('eventDrop', next)
    else
      emit('eventPlacementRejected', {
        action: 'drop',
        event,
        start: next.newStart,
        end: next.newEnd,
        conflicts: validation.conflicts,
        reason: validation.allowed ? 'rejected' : 'overlap',
      })
  } else if (nativeEvent.dataTransfer) {
    const target = `${dayKey} 00:00:00` as DateTimeStringValue
    if (
      props.canDropExternalEvent?.({ dataTransfer: nativeEvent.dataTransfer, start: target }) !==
      false
    )
      emit('externalEventDrop', nativeEvent.dataTransfer, target)
    else
      emit('eventPlacementRejected', {
        action: 'external-drop',
        dataTransfer: nativeEvent.dataTransfer,
        start: target,
        conflicts: [],
        reason: 'rejected',
      })
  }
}

const dropInput = (date: string) => ({
  container: daySlotsContainers.get(date),
  date: dayjs(date).format('YYYY-MM-DD') as DateStringValue,
  intervals: intervals.value,
  intervalMinutes: props.intervalMinutes,
  dragIntervalMinutes: props.eventDragInterval,
  startTime: props.startTime,
  endTime: props.endTime,
})

const handleDayDragOver = (nativeEvent: DragEvent, date: string) => {
  dropDataTransfer.value = nativeEvent.dataTransfer
  slotDropTarget.dragOver(nativeEvent, dropInput(date))
}

const handleDayDragLeave = (nativeEvent: DragEvent, date: string) =>
  slotDropTarget.dragLeave(nativeEvent, daySlotsContainers.get(date))

const handleDayDrop = (nativeEvent: DragEvent, date: string) => {
  const target = slotDropTarget.drop(nativeEvent, dropInput(date))
  dropDataTransfer.value = null

  if (target) {
    emitDrop(nativeEvent, target.target)
  }
}

const allDayEventStyle = (position: { offset: number; width: number; row: number }) => ({
  position: 'absolute' as const,
  insetInlineStart: `${position.offset}%`,
  width: `${position.width}%`,
  top: `${position.row * ALL_DAY_ROW_HEIGHT}px`,
})

const backgroundEventStyle = (event: ScheduleEventData & { position: any }, date: string) => {
  const resizePosition = eventResize.getResizePosition(event.id, dayjs(date).format('YYYY-MM-DD'))
  const top = resizePosition?.top ?? event.position.top
  const height = resizePosition?.height ?? event.position.height
  return {
    top: `${top}%`,
    bottom: `${100 - top - height}%`,
    minHeight: '1px',
    width: '100%',
  }
}

const regularEventStyle = (event: ScheduleEventData & { position: any }) => {
  const resizePosition = eventResize.getResizePosition(event.id)
  const top = resizePosition?.top ?? event.position.top
  const height = resizePosition?.height ?? event.position.height

  return {
    position: 'absolute' as const,
    top: `${top}%`,
    bottom: `${100 - top - height}%`,
    minHeight: '1px',
    width: `${event.position.width}%`,
    insetInlineStart: `${event.position.offset}%`,
    '--event-z-index': event.position.column + 3,
    '--event-z-index-raised': event.position.overlaps + 3,
  }
}

const startEventResize = (
  event: ScheduleEventData & { position: any },
  date: string,
  edge: 'top' | 'bottom',
  pointerEvent: PointerEvent,
) => {
  const container = daySlotsContainers.get(date)

  if (!container) {
    return
  }

  eventResize.handleResizeStart({
    event,
    edge,
    container,
    originalTop: event.position.top,
    originalHeight: event.position.height,
    eventDate: dayjs(date).format('YYYY-MM-DD'),
    pointerEvent,
  })
}

/** A click that ends a resize gesture must not be reported as an event click. */
const clickResizableEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) => {
  if (!eventResize.wasResizing()) {
    clickEvent(event, nativeEvent)
  }
}

const isDraggableEvent = (event: ScheduleEventData) =>
  !isStatic.value && props.withEventsDragAndDrop === true && (props.canDragEvent?.(event) ?? true)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('weekView') }"
    :mod="[{ static: isStatic, 'slot-dragging': slotDragSelect.isDragging() }, (attrs as any).mod]"
  >
    <ScheduleHeaderBase
      v-if="props.withHeader"
      view="week"
      :labels="props.labels"
      :navigation-handlers="createHeaderNavigation(props.date, 'week')"
      :control="{ title: weekLabel }"
      :previous-control-props="props.previousControlProps"
      :next-control-props="props.nextControlProps"
      :today-control-props="props.todayControlProps"
      :view-select-props="props.viewSelectProps"
      v-bind="stylesApi"
      @date-change="emit('dateChange', $event)"
      @view-change="emit('viewChange', $event)"
    />

    <Box
      :root-ref="setWeekRoot"
      v-bind="getStyles('weekViewRoot', { style: rootVars })"
      :mod="{ 'with-weekends': props.withWeekendDays }"
      :data-event-interaction="eventResize.isResizing.value || undefined"
    >
      <ScrollArea.Autosize
        :scrollbar-size="4"
        v-bind="{ ...props.scrollAreaProps, ...getStyles('weekViewScrollArea') }"
        :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
      >
        <div v-bind="getStyles('weekViewHeader')">
          <div v-bind="getStyles('weekViewCorner')">
            <template v-if="withWeekNumber">
              <div v-bind="getStyles('weekViewWeekLabel')">
                {{ getLabel('week', props.labels) }}
              </div>
              <div v-bind="getStyles('weekViewWeekNumber')">{{ getWeekNumber(days) }}</div>
            </template>
          </div>

          <UnstyledButton
            v-for="(column, dayIndex) in dayColumns"
            :key="column.date"
            type="button"
            v-bind="staticStyles('weekViewDayLabel')"
            :data-weekday-index="dayIndex"
            :data-weekend="column.isWeekend || undefined"
            :aria-label="`${getLabel('weekday', props.labels)} ${column.key}`"
            :tabindex="isStatic ? -1 : dayIndex === 0 ? 0 : -1"
            @keydown="isStatic ? undefined : handleDayLabelKeydown($event, dayIndex)"
            @click="isStatic ? undefined : clickDayLabel(column.date)"
          >
            <span v-bind="staticStyles('weekViewDayWeekday')">{{ column.weekdayLabel }}</span>
            <span
              v-bind="staticStyles('weekViewDayNumber')"
              :data-today="column.isToday || undefined"
            >
              {{ column.dayLabel }}
            </span>
          </UnstyledButton>
        </div>

        <div v-if="withAllDaySlots" v-bind="getStyles('weekViewAllDaySlots')">
          <div v-bind="getStyles('weekViewAllDaySlotsLabel')">
            {{ getLabel('allDay', props.labels) }}
          </div>

          <div v-bind="getStyles('weekViewAllDaySlotsList')">
            <div v-bind="getStyles('weekViewAllDaySlotsEvents')">
              <ScheduleEvent
                v-for="event in grouped.allDayEvents"
                :key="event.id"
                :event="event"
                nowrap
                :hanging="event.position.hanging"
                :mode="props.mode"
                :style="allDayEventStyle(event.position)"
                :draggable="isDraggableEvent(event)"
                v-bind="{ ...eventRenderers, ...stylesApi }"
                @event-drag-start="dragStart"
                @event-drag-end="dragEnd"
                @click="clickEvent(event, $event)"
              />
            </div>

            <UnstyledButton
              v-for="(column, dayIndex) in dayColumns"
              :key="column.date"
              type="button"
              v-bind="staticStyles('weekViewDaySlot')"
              :disabled="isStatic"
              :data-all-day-index="dayIndex"
              :aria-label="`${getLabel('allDay', props.labels)} ${column.key}`"
              :tabindex="isStatic ? -1 : dayIndex === 0 ? 0 : -1"
              @keydown="isStatic ? undefined : handleAllDaySlotKeydown($event, dayIndex)"
              @click="emit('allDaySlotClick', column.date, $event)"
              @dragover.prevent
              @drop="emitAllDayDrop($event, column.date)"
            />
          </div>
        </div>

        <Box v-bind="getStyles('weekViewInner')">
          <div v-bind="getStyles('weekViewSlotLabels')">
            <Box
              v-for="group in slotLabelGroups"
              :key="group.startTime"
              v-bind="staticStyles('weekViewSlotLabel')"
              :mod="{
                'hour-start': group.isHourStart,
                'sub-hour': !group.isHourStart,
                ...group.businessHours.mod,
              }"
              :style="{ ...group.businessHours.vars, '--slot-label-size': group.size }"
            >
              {{ group.label }}
            </Box>
          </div>

          <CurrentTimeIndicator
            v-if="props.withCurrentTimeIndicator && currentWeekdayIndex !== -1"
            start-offset="calc(100% - (100% / var(--number-of-days)) * (var(--number-of-days) - var(--indicator-offset-index) + 1) + ((var(--number-of-days) - var(--indicator-offset-index) + 1) * var(--indicator-labels-offset)))"
            end-offset="calc((100% / var(--number-of-days)) * (var(--number-of-days) - var(--indicator-offset-index)) - (var(--number-of-days) - var(--indicator-offset-index)) * var(--indicator-labels-offset))"
            time-bubble-start-offset="calc(var(--week-view-slots-label-width) - var(--time-bubble-width))"
            :current-time-format="props.slotLabelFormat"
            :with-time-bubble="props.withCurrentTimeBubble"
            :with-thumb="props.withCurrentTimeBubble ? currentWeekdayIndex !== 0 : true"
            :locale="props.locale"
            :start-time="props.startTime"
            :end-time="props.endTime"
            :interval-minutes="props.intervalMinutes"
            :get-current-time="props.getCurrentTime"
            v-bind="stylesApi"
          />

          <div
            v-for="(column, dayIndex) in dayColumns"
            :key="column.date"
            v-bind="staticStyles('weekViewDay')"
          >
            <div
              :ref="setDaySlotsContainer(column.date)"
              v-bind="staticStyles('weekViewDaySlots')"
              @dragover="withDragHandlers ? handleDayDragOver($event, column.date) : undefined"
              @dragleave="withDragHandlers ? handleDayDragLeave($event, column.date) : undefined"
              @drop="withDragHandlers ? handleDayDrop($event, column.date) : undefined"
            >
              <UnstyledButton
                v-for="(slot, slotIndex) in intervals"
                :key="slot.startTime"
                type="button"
                v-bind="staticStyles('weekViewDaySlot')"
                :data-week-day-index="dayIndex"
                :data-time-slot-index="slotIndex"
                :data-drag-slot-index="withSlotSelect ? slotIndex : undefined"
                :data-drag-slot-group="withSlotSelect ? column.key : undefined"
                :data-drop-target="slotDropTarget.isTarget(column.key, slotIndex) || undefined"
                :data-invalid="
                  slotDropTarget.isTarget(column.key, slotIndex) && !dropValid ? true : undefined
                "
                :data-drag-selected="
                  slotDragSelect.isSlotSelected(slotIndex, column.key) || undefined
                "
                :data-business-hours="
                  businessHoursStates[dayIndex][slotIndex].mod['business-hours'] || undefined
                "
                :data-non-business-hours="
                  businessHoursStates[dayIndex][slotIndex].mod['non-business-hours'] || undefined
                "
                :data-partial-business-hours="
                  businessHoursStates[dayIndex][slotIndex].mod['partial-business-hours'] ||
                  undefined
                "
                :style="businessHoursStates[dayIndex][slotIndex].vars"
                :disabled="isStatic"
                :aria-label="`${getLabel('timeSlot', props.labels)} ${column.key} ${slot.startTime} - ${slot.endTime}`"
                :tabindex="isStatic ? -1 : dayIndex === 0 && slotIndex === 0 ? 0 : -1"
                @keydown="isStatic ? undefined : handleTimeSlotKeydown($event, dayIndex, slotIndex)"
                @click="clickTimeSlot(column.date, slotIndex, $event)"
                @pointerdown="
                  withSlotSelect
                    ? slotDragSelect.handleSlotPointerDown($event, slotIndex, column.key)
                    : undefined
                "
                @dragover.prevent
              />

              <ScheduleBackgroundEvent
                v-for="event in grouped.backgroundEvents[column.date] || []"
                :key="`background-${event.id}`"
                :event="event"
                :interactive="Boolean(props.withInteractiveBackgroundEvents) && !isStatic"
                v-bind="{ ...eventRenderers, ...staticStyles('weekViewBackgroundEvent') }"
                :style="backgroundEventStyle(event, column.date)"
                :with-resize="eventResize.isResizableEvent(event) && !event.position.allDay"
                :is-resizing="eventResize.getResizePosition(event.id, column.date) !== null"
                :resize-handle-props="staticStyles('weekViewBackgroundEventResizeHandle')"
                @event-click="clickResizableEvent"
                @resize-start="
                  (edge, pointerEvent) =>
                    startEventResize(event, column.date, edge as any, pointerEvent)
                "
              />

              <ScheduleEvent
                v-for="event in grouped.regularEvents[column.date] || []"
                :key="`${event.id}-${column.date}`"
                :event="event"
                auto-size
                :mode="props.mode"
                :mod="{
                  cascade: props.eventOverlapMode === 'cascade',
                  invalid:
                    eventResize.getResizePosition(event.id) !== null &&
                    !eventResize.resizeValid.value,
                }"
                :style="regularEventStyle(event)"
                :draggable="isDraggableEvent(event)"
                :with-resize="eventResize.isResizableEvent(event)"
                :is-resizing="eventResize.getResizePosition(event.id) !== null"
                v-bind="{ ...eventRenderers, ...stylesApi }"
                @event-drag-start="dragStart"
                @event-drag-end="dragEnd"
                @click="clickResizableEvent(event, $event)"
                @resize-start="
                  (edge, pointerEvent) => startEventResize(event, column.date, edge, pointerEvent)
                "
              />
            </div>
          </div>
        </Box>
      </ScrollArea.Autosize>
    </Box>
  </Box>
</template>
