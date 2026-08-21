<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { cssSize, resolveScheduleRadius } from '../shared'

const defaultProps = {
  mode: 'default',
  withHeader: true,
  recurrenceExpansionLimit: 2000,
  startTime: '00:00:00',
  endTime: '23:59:59',
  intervalMinutes: 15,
  slotLabelFormat: 'HH:mm',
  withCurrentTimeBubble: true,
  slotHeight: 64,
  headerFormat: 'MMMM D, YYYY',
  withAllDaySlot: true,
  allDaySlotHeight: 44,
  maxAllDayEvents: 3,
} as const

const varsResolver = createVarsResolver<any>(
  (_theme, { radius, slotHeight, allDaySlotHeight }) => ({
    dayView: {
      '--day-view-radius': resolveScheduleRadius(radius),
      '--day-view-slot-height': cssSize(slotHeight),
      '--day-view-all-day-slot-height': cssSize(allDaySlotHeight),
    },
  }),
)

export { defaultProps, varsResolver }
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, nextTick, onMounted, ref, useAttrs, useSlots } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import { useEventResize } from '../../hooks/use-event-resize'
import { getLabel } from '../../labels'
import type { DateTimeStringValue, DayOfWeek, ScheduleEventData } from '../../types'
import {
  formatDate,
  getBusinessHoursMod,
  getDayTimeIntervals,
  getVisibleEvents,
  toDateString,
} from '../../utils'
import { CurrentTimeIndicator } from '../CurrentTimeIndicator'
import { MoreEvents } from '../MoreEvents'
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
import { getDayViewEvents } from './get-day-view-events/get-day-view-events'
import type { DayViewEmits, DayViewOwnProps, DayViewSlots } from './DayView.types'
import classes from './DayView.module.css'

defineOptions({
  name: 'DayView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<DayViewOwnProps>(), {
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
  startTime: undefined,
  endTime: undefined,
  intervalMinutes: undefined,
  slotLabelFormat: undefined,
  withCurrentTimeIndicator: undefined,
  withCurrentTimeBubble: undefined,
  getCurrentTime: undefined,
  slotHeight: undefined,
  businessHours: undefined,
  canDragEvent: undefined,
  startScrollTime: undefined,
  canResizeEvent: undefined,
  headerFormat: undefined,
  withAllDaySlot: undefined,
  allDaySlotHeight: undefined,
  maxAllDayEvents: undefined,
  moreEventsProps: undefined,
  scrollAreaProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<DayViewSlots>()

const emit = defineEmits<DayViewEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('DayView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'DayView',
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
  rootSelector: 'dayView',
})

/**
 * Cached per selector: the slot list re-renders on every step of a drag, and rebuilding the
 * same class list once per slot is what makes that re-render expensive.
 */
const staticStyles = useStaticStyles(getStyles)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const eventRenderers = computed(() => resolveEventRenderers(props, slots))

const timeSlotsContainer = ref<HTMLElement | null>(null)

const slotDropTarget = useSlotDropTarget()

const date = computed(() => toDateString(props.date))
const datePart = computed(() => dayjs(date.value).format('YYYY-MM-DD'))
const now = computed(() => dayjs(props.getCurrentTime?.() ?? dayjs()))

const isStatic = computed(() => props.mode === 'static')

const showCurrentTimeIndicator = computed(
  () => props.withCurrentTimeIndicator ?? dayjs(date.value).isSame(now.value, 'day'),
)

const expandedEvents = computed(() =>
  getExpandedEvents(
    props.events,
    dayjs(date.value).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    dayjs(date.value).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    props.recurrenceExpansionLimit!,
  ),
)

const dayEvents = computed(() =>
  getDayViewEvents({
    events: expandedEvents.value,
    date: date.value,
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
  }),
)

const intervals = computed(() =>
  getDayTimeIntervals({
    startTime: props.startTime!,
    endTime: props.endTime!,
    intervalMinutes: props.intervalMinutes!,
  }),
)

const hourStartIntervals = computed(() => intervals.value.filter((slot) => slot.isHourStart))

const allDayCounts = computed(() =>
  getVisibleEvents({
    maxEvents: props.maxAllDayEvents!,
    totalEvents: dayEvents.value.allDayEvents.length,
  }),
)

const visibleAllDayEvents = computed(() =>
  dayEvents.value.allDayEvents.slice(0, allDayCounts.value.visibleEventsCount),
)

const withSlotSelect = computed(() => Boolean(props.withDragSlotSelect) && !isStatic.value)

const withDragHandlers = computed(
  () =>
    !isStatic.value &&
    (Boolean(props.withEventsDragAndDrop) || Boolean(props.withExternalEventDrop)),
)

const eventResize = useEventResize({
  enabled: () => Boolean(props.withEventResize),
  mode: () => props.mode!,
  startTime: () => props.startTime!,
  endTime: () => props.endTime!,
  intervalMinutes: () => props.intervalMinutes!,
  onEventResize: (data) => emit('eventResize', data),
  canResizeEvent: () => props.canResizeEvent,
})

const slotDragSelect = useSlotDragSelect({
  enabled: () => withSlotSelect.value,
  onDragEnd: (startIndex, endIndex) => {
    const startSlot = intervals.value[startIndex]
    const endSlot = intervals.value[endIndex]

    if (startSlot && endSlot) {
      emit(
        'slotDragEnd',
        `${datePart.value} ${startSlot.startTime}` as DateTimeStringValue,
        `${datePart.value} ${endSlot.endTime}` as DateTimeStringValue,
      )
    }
  },
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
    emit('eventDragEnd')
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

  const target = timeSlotsContainer.value?.querySelector<HTMLElement>(
    `[data-time-slot-index="${targetIndex}"]`,
  )

  scrollSlotIntoView(target)
})

const clickEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) =>
  emit('eventClick', event, nativeEvent)

const dragStart = (event: ScheduleEventData) => {
  dragState.startEventDrag(event)
  emit('eventDragStart', event)
}

const dragEnd = () => dragState.endEventDrag()

const emitDrop = (nativeEvent: DragEvent, target: DateTimeStringValue) => {
  nativeEvent.preventDefault()
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (event) {
    emit('eventDrop', moveEventTo(event, target))
  } else if (nativeEvent.dataTransfer) {
    emit('externalEventDrop', nativeEvent.dataTransfer, target)
  }
}

const emitAllDayDrop = (nativeEvent: DragEvent) => {
  nativeEvent.preventDefault()
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (event) {
    emit('eventDrop', moveEventToAllDay(event, datePart.value))
  } else if (nativeEvent.dataTransfer) {
    emit(
      'externalEventDrop',
      nativeEvent.dataTransfer,
      `${datePart.value} 00:00:00` as DateTimeStringValue,
    )
  }
}

const clickAllDaySlot = (nativeEvent: MouseEvent) =>
  emit('allDaySlotClick', date.value, nativeEvent)

const clickTimeSlot = (slotIndex: number, nativeEvent: MouseEvent) => {
  const slot = intervals.value[slotIndex]
  const start = dayjs(`${datePart.value} ${slot.startTime}`)
  emit('timeSlotClick', {
    slotStart: start.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    slotEnd: start
      .add(props.intervalMinutes!, 'minute')
      .format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    nativeEvent,
  })
}

const dropInput = () => ({
  container: timeSlotsContainer.value,
  date: datePart.value,
  intervals: intervals.value,
})

const handleGridDragOver = (nativeEvent: DragEvent) =>
  slotDropTarget.dragOver(nativeEvent, dropInput())

const handleGridDragLeave = (nativeEvent: DragEvent) =>
  slotDropTarget.dragLeave(nativeEvent, timeSlotsContainer.value)

const handleGridDrop = (nativeEvent: DragEvent) => {
  const target = slotDropTarget.drop(nativeEvent, dropInput())

  if (target) {
    emitDrop(nativeEvent, target.target)
  }
}

const handleSlotKeydown = (nativeEvent: KeyboardEvent, index: number) => {
  const nextIndex =
    nativeEvent.key === 'ArrowDown' ? index + 1 : nativeEvent.key === 'ArrowUp' ? index - 1 : -1

  if (nextIndex < 0 || nextIndex >= intervals.value.length) {
    return
  }

  nativeEvent.preventDefault()
  timeSlotsContainer.value
    ?.querySelector<HTMLButtonElement>(`[data-time-slot-index="${nextIndex}"]`)
    ?.focus()
}

const businessHoursMods = computed(() =>
  intervals.value.map((slot) =>
    props.highlightBusinessHours
      ? getBusinessHoursMod({
          time: slot.startTime,
          businessHours: props.businessHours || ['09:00:00', '17:00:00'],
          highlightBusinessHours: true,
          dayOfWeek: dayjs(`${datePart.value} ${slot.startTime}`).day() as DayOfWeek,
        })
      : { 'business-hours': false, 'non-business-hours': false },
  ),
)

const backgroundEventStyle = (position: { top: number; height: number }) => ({
  top: `${position.top}%`,
  bottom: `${100 - position.top - position.height}%`,
  minHeight: '1px',
})

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
  }
}

const startEventResize = (
  event: ScheduleEventData & { position: any },
  edge: 'top' | 'bottom',
  pointerEvent: PointerEvent,
) => {
  if (!timeSlotsContainer.value) {
    return
  }

  eventResize.handleResizeStart({
    event,
    edge,
    container: timeSlotsContainer.value,
    originalTop: event.position.top,
    originalHeight: event.position.height,
    eventDate: datePart.value,
    pointerEvent,
  })
}

/** A click that ends a resize gesture must not be reported as an event click. */
const clickResizableEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) => {
  if (!eventResize.wasResizing()) {
    clickEvent(event, nativeEvent)
  }
}
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('dayView') }"
    :mod="[{ static: isStatic, 'slot-dragging': slotDragSelect.isDragging() }, (attrs as any).mod]"
  >
    <ScheduleHeaderBase
      v-if="props.withHeader"
      view="day"
      :labels="props.labels"
      :navigation-handlers="createHeaderNavigation(date, 'day')"
      :control="{
        title: formatDate({ date, locale: props.locale || 'en', format: props.headerFormat! }),
      }"
      :previous-control-props="props.previousControlProps"
      :next-control-props="props.nextControlProps"
      :today-control-props="props.todayControlProps"
      :view-select-props="props.viewSelectProps"
      v-bind="stylesApi"
      @date-change="emit('dateChange', $event)"
      @view-change="emit('viewChange', $event)"
    />

    <ScrollArea.Autosize
      :scrollbar-size="4"
      v-bind="{ ...props.scrollAreaProps, ...getStyles('dayViewScrollArea') }"
      :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
    >
      <Box v-bind="getStyles('dayViewInner')">
        <div v-bind="getStyles('dayViewSlotLabels')">
          <Box
            v-if="props.withAllDaySlot"
            v-bind="getStyles('dayViewSlotLabel')"
            :mod="{ 'all-day': true }"
          >
            {{ getLabel('allDay', props.labels) }}
          </Box>
          <Box
            v-for="slot in hourStartIntervals"
            :key="slot.startTime"
            v-bind="staticStyles('dayViewSlotLabel')"
          >
            {{
              formatDate({
                date: `${datePart} ${slot.startTime}`,
                locale: props.locale || 'en',
                format: props.slotLabelFormat!,
              })
            }}
          </Box>
        </div>

        <div v-bind="getStyles('dayViewSlots')">
          <div v-if="props.withAllDaySlot" v-bind="getStyles('dayViewAllDay')">
            <div
              v-for="event in dayEvents.backgroundAllDayEvents"
              :key="event.id"
              v-bind="staticStyles('dayViewBackgroundEvent')"
            />

            <div v-bind="getStyles('dayViewAllDayEvents')">
              <ScheduleEvent
                v-for="event in visibleAllDayEvents"
                :key="event.id"
                :event="event"
                nowrap
                :mode="props.mode"
                :draggable="
                  !isStatic &&
                  props.withEventsDragAndDrop === true &&
                  (props.canDragEvent?.(event) ?? true)
                "
                v-bind="{ ...eventRenderers, ...stylesApi }"
                @event-drag-start="dragStart"
                @event-drag-end="dragEnd"
                @click="clickEvent(event, $event)"
              />

              <MoreEvents
                v-if="allDayCounts.hiddenEventsCount > 0"
                :events="dayEvents.allDayEvents"
                :more-events-count="allDayCounts.hiddenEventsCount"
                :labels="props.labels"
                :mode="props.mode"
                v-bind="{ ...eventRenderers, ...stylesApi, ...props.moreEventsProps }"
                @event-click="clickEvent"
              />
            </div>

            <UnstyledButton
              v-bind="getStyles('dayViewSlot')"
              :mod="{ 'all-day': true, static: isStatic }"
              :tabindex="isStatic ? -1 : 0"
              :aria-label="`${getLabel('timeSlot', props.labels)} ${getLabel('allDay', props.labels)}`"
              @click="isStatic ? undefined : clickAllDaySlot($event)"
              @dragover.prevent
              @drop="emitAllDayDrop"
            />
          </div>

          <div
            ref="timeSlotsContainer"
            v-bind="getStyles('dayViewTimeSlots')"
            @dragover="withDragHandlers ? handleGridDragOver($event) : undefined"
            @dragleave="withDragHandlers ? handleGridDragLeave($event) : undefined"
            @drop="withDragHandlers ? handleGridDrop($event) : undefined"
          >
            <div
              v-for="event in dayEvents.backgroundTimedEvents"
              :key="event.id"
              v-bind="staticStyles('dayViewBackgroundEvent')"
              :style="backgroundEventStyle(event.position)"
            />

            <ScheduleEvent
              v-for="event in dayEvents.regularEvents"
              :key="event.id"
              :event="event"
              auto-size
              :mode="props.mode"
              :style="regularEventStyle(event)"
              :draggable="
                !isStatic &&
                props.withEventsDragAndDrop === true &&
                (props.canDragEvent?.(event) ?? true)
              "
              :with-resize="eventResize.isResizableEvent(event)"
              :is-resizing="eventResize.getResizePosition(event.id) !== null"
              v-bind="{ ...eventRenderers, ...stylesApi }"
              @event-drag-start="dragStart"
              @event-drag-end="dragEnd"
              @click="clickResizableEvent(event, $event)"
              @resize-start="(edge, pointerEvent) => startEventResize(event, edge, pointerEvent)"
            />

            <CurrentTimeIndicator
              v-if="showCurrentTimeIndicator"
              start-offset="calc(var(--day-view-slot-labels-width) * -1)"
              end-offset="0rem"
              top-offset="0rem"
              time-bubble-start-offset="calc(var(--day-view-slot-labels-width) * -1 + 30px)"
              :current-time-format="props.slotLabelFormat"
              :start-time="props.startTime"
              :end-time="props.endTime"
              :interval-minutes="props.intervalMinutes"
              :with-time-bubble="props.withCurrentTimeBubble"
              :with-thumb="!props.withCurrentTimeBubble"
              :get-current-time="props.getCurrentTime"
              :locale="props.locale"
              v-bind="stylesApi"
            />

            <UnstyledButton
              v-for="(slot, index) in intervals"
              :key="slot.startTime"
              v-bind="staticStyles('dayViewSlot')"
              :data-time-slot-index="index"
              :data-drag-slot-index="withSlotSelect ? index : undefined"
              :data-drag-slot-group="withSlotSelect ? datePart : undefined"
              :style="{ '--slot-size': String(props.intervalMinutes! / 60) }"
              :mod="{
                first: index === 0,
                'hour-start': slot.isHourStart,
                static: isStatic,
                'drop-target': slotDropTarget.isTarget(datePart, index),
                'drag-selected': slotDragSelect.isSlotSelected(index, datePart),
                'business-hours': businessHoursMods[index]['business-hours'],
                'non-business-hours': businessHoursMods[index]['non-business-hours'],
              }"
              :tabindex="isStatic ? -1 : index === 0 ? 0 : -1"
              :aria-label="`${getLabel('timeSlot', props.labels)} ${slot.startTime} - ${slot.endTime}`"
              @keydown="isStatic ? undefined : handleSlotKeydown($event, index)"
              @click="clickTimeSlot(index, $event)"
              @pointerdown="
                withSlotSelect
                  ? slotDragSelect.handleSlotPointerDown($event, index, datePart)
                  : undefined
              "
              @dragover.prevent
            />
          </div>
        </div>
      </Box>
    </ScrollArea.Autosize>
  </Box>
</template>
