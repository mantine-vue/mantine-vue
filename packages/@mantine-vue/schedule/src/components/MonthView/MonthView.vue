<script lang="ts">
import { createVarsResolver } from '@mantine-vue/core'
import { resolveScheduleRadius } from '../shared'
import type { MonthViewOwnProps } from './MonthView.types'

const defaultProps = {
  mode: 'default',
  withHeader: true,
  recurrenceExpansionLimit: 2000,
  firstDayOfWeek: 1,
  weekdayFormat: 'ddd',
  weekendDays: [0, 6],
  withWeekDays: true,
  consistentWeeks: true,
  highlightToday: true,
  withOutsideDays: true,
  maxEventsPerDay: 2,
} satisfies Partial<MonthViewOwnProps>

/** Vertical offset of the first event row, past the day label, in px. */
const EVENTS_TOP_OFFSET = 28

/** Vertical step between stacked event rows, in px. */
const EVENT_ROW_HEIGHT = 22

/** Group name of the month grid for slot drag selection – a month has a single grid. */
const MONTH_SLOT_GROUP = 'month'

const COLUMNS = 7

/** `maxEventsPerDay` is clamped so the CSS grid keeps a workable row height. */
function clampMaxEvents(value: number) {
  return Math.min(10, Math.max(1, value))
}

const varsResolver = createVarsResolver<any>((_theme, { radius, maxEventsPerDay }) => ({
  monthView: {
    '--month-view-radius': resolveScheduleRadius(radius),
    '--month-view-max-events': String(
      clampMaxEvents(maxEventsPerDay ?? defaultProps.maxEventsPerDay),
    ),
  },
}))

export {
  defaultProps,
  varsResolver,
  clampMaxEvents,
  EVENTS_TOP_OFFSET,
  EVENT_ROW_HEIGHT,
  MONTH_SLOT_GROUP,
  COLUMNS,
}
</script>

<script setup lang="ts">
import dayjs from 'dayjs'
import { computed, ref, shallowRef, useAttrs, useSlots } from 'vue'
import { Box, ScrollArea, UnstyledButton, useProps, useStyles } from '@mantine-vue/core'
import type {
  DateStringValue,
  DateTimeStringValue,
  DayOfWeek,
  ScheduleEventData,
} from '../../types'
import {
  calculateMonthDropDate,
  formatDate,
  getMonthDays,
  getWeekNumber,
  getWeekdaysNames,
  toDateString,
} from '../../utils'
import { handleGridKeydown } from '../keyboard-navigation'
import { MoreEvents } from '../MoreEvents'
import { ScheduleBackgroundEvent } from '../ScheduleBackgroundEvent'
import { ScheduleEvent } from '../ScheduleEvent'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import { provideScheduleDragState } from '../DragContext'
import {
  getDropEvent,
  getExpandedEvents,
  moveEventTo,
  rafThrottle,
  resolveEventRenderers,
  scheduleViewportProps,
  useStaticStyles,
} from '../shared'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { getMonthViewEvents } from './get-month-view-events/get-month-view-events'
import { getRenderableMonthEventSegments } from './get-renderable-month-event-segments'
import type { MonthViewEmits, MonthViewSlots } from './MonthView.types'
import classes from './MonthView.module.css'

defineOptions({
  name: 'MonthView',
  inheritAttrs: false,
})

const rawProps = withDefaults(defineProps<MonthViewOwnProps>(), {
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
  firstDayOfWeek: undefined,
  weekdayFormat: undefined,
  weekendDays: undefined,
  withWeekDays: undefined,
  consistentWeeks: undefined,
  highlightToday: undefined,
  withOutsideDays: undefined,
  maxEventsPerDay: undefined,
  getDayProps: undefined,
  getWeekNumberProps: undefined,
  canDragEvent: undefined,
  monthYearSelectProps: undefined,
  moreEventsProps: undefined,
  scrollAreaProps: undefined,
  classNames: undefined,
  styles: undefined,
  vars: undefined,
})

defineSlots<MonthViewSlots>()

const emit = defineEmits<MonthViewEmits>()

const slots = useSlots()
const attrs = useAttrs()

const props = useProps('MonthView', defaultProps, rawProps)

const getStyles = useStyles({
  name: 'MonthView',
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
  rootSelector: 'monthView',
})

/**
 * Cached per selector: the grid renders one cell per day of the month, and rebuilding the same
 * class list for each of them is what makes a drag re-render expensive.
 */
const staticStyles = useStaticStyles(getStyles)

const stylesApi = computed(() => ({
  classNames: props.classNames as any,
  styles: props.styles as any,
  unstyled: props.unstyled,
}))

const eventRenderers = computed(() => resolveEventRenderers(props, slots))

const monthGrid = ref<HTMLElement | null>(null)

const dropTarget = shallowRef<DateStringValue | null>(null)

const isStatic = computed(() => props.mode === 'static')

const month = computed(() => dayjs(props.date).startOf('month'))

const maxEventsPerDay = computed(() => clampMaxEvents(props.maxEventsPerDay!))

const weeks = computed(() =>
  getMonthDays({
    month: month.value,
    firstDayOfWeek: props.firstDayOfWeek,
    consistentWeeks: props.consistentWeeks,
  }),
)

const flatDays = computed(() => weeks.value.flat().map((date) => toDateString(date)))

const firstFocusableDayIndex = computed(() =>
  weeks.value
    .flat()
    .findIndex((date) => props.withOutsideDays || dayjs(date).isSame(month.value, 'month')),
)

const expandedEvents = computed(() =>
  getExpandedEvents(
    props.events,
    weeks.value[0][0],
    dayjs(weeks.value.at(-1)!.at(-1)!).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    props.recurrenceExpansionLimit!,
  ),
)

const grouped = computed(() =>
  getMonthViewEvents({
    date: month.value,
    events: expandedEvents.value,
    firstDayOfWeek: props.firstDayOfWeek,
    withOutsideDays: props.withOutsideDays,
    consistentWeeks: props.consistentWeeks,
  }),
)

const weekdays = computed(() =>
  getWeekdaysNames({
    locale: props.locale || 'en',
    format: props.weekdayFormat!,
    firstDayOfWeek: props.firstDayOfWeek,
  }),
)

const withSlotSelect = computed(() => Boolean(props.withDragSlotSelect) && !isStatic.value)

const withDragHandlers = computed(
  () =>
    !isStatic.value &&
    (Boolean(props.withEventsDragAndDrop) || Boolean(props.withExternalEventDrop)),
)

const weekSegments = computed(() =>
  weeks.value.map((week, weekIndex) =>
    getRenderableMonthEventSegments({
      events: grouped.value.groupedByWeek[String(weekIndex)] || [],
      groupedByDay: grouped.value.groupedByDay,
      maxEventsPerDay: maxEventsPerDay.value,
      week,
    }),
  ),
)

const slotDragSelect = useSlotDragSelect({
  enabled: () => withSlotSelect.value,
  onDragEnd: (startIndex, endIndex) => {
    const startDay = flatDays.value[startIndex]
    const endDay = flatDays.value[endIndex]

    if (startDay && endDay) {
      emit(
        'slotDragEnd',
        dayjs(startDay).startOf('day').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
        dayjs(endDay).endOf('day').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
      )
    }
  },
})

const dragState = provideScheduleDragState({
  dragOverTarget: () => (dropTarget.value ? { date: dropTarget.value } : null),
  isSlotDragging: () => slotDragSelect.isDragging(),
  onDragEnd: () => {
    highlightDay.cancel()
    setDropTarget(null)
    emit('eventDragEnd')
  },
})

const changeDate = (value: DateStringValue) => emit('dateChange', value)

const clickEvent = (event: ScheduleEventData, nativeEvent: MouseEvent) =>
  emit('eventClick', event, nativeEvent)

const dragStart = (event: ScheduleEventData) => {
  dragState.startEventDrag(event)
  emit('eventDragStart', event)
}

const dragEnd = () => dragState.endEventDrag()

const headerControl = computed(() => ({
  monthYearSelect: {
    locale: props.locale,
    monthValue: month.value.month(),
    yearValue: month.value.year(),
    onMonthChange: (value: number) => changeDate(toDateString(month.value.month(value))),
    onYearChange: (value: number) => changeDate(toDateString(month.value.year(value))),
    ...props.monthYearSelectProps,
  },
}))

const dayProps = (date: string) => props.getDayProps?.(toDateString(date)) ?? {}
const weekNumberProps = (weekStart: string | Date) =>
  props.getWeekNumberProps?.(toDateString(weekStart)) ?? {}

const isOutside = (date: string | Date) => !dayjs(date).isSame(month.value, 'month')

/** Outside days are rendered as empty placeholders when `withOutsideDays` is off. */
const isHiddenDay = (date: string | Date) => isOutside(date) && !props.withOutsideDays

const dayEvents = (date: string | Date) =>
  grouped.value.groupedByDay[dayjs(date).format('YYYY-MM-DD 00:00:00')] || []

const hiddenEventsCount = (date: string | Date) =>
  Math.max(0, dayEvents(date).length - maxEventsPerDay.value)

const handleDayKeydown = (nativeEvent: KeyboardEvent, gridIndex: number) => {
  handleGridKeydown({
    event: nativeEvent,
    index: gridIndex,
    columns: COLUMNS,
    total: weeks.value.length * COLUMNS,
    getControl: (index) =>
      monthGrid.value?.querySelector<HTMLButtonElement>(
        `[data-grid-index="${index}"]:not([data-hidden])`,
      ) ?? null,
  })
}

const setDropTarget = (next: DateStringValue | null) => {
  if (dropTarget.value !== next) {
    dropTarget.value = next
  }
}

/**
 * Coalesced to one animation frame: `dragover` fires several times per frame, and every change
 * of the highlight re-renders the whole month grid.
 */
const highlightDay = rafThrottle((date: DateStringValue) => setDropTarget(date))

const handleDragOver = (nativeEvent: DragEvent, date: string | Date) => {
  // `preventDefault` and `dropEffect` stay synchronous: the browser reads them as the handler
  // returns, so they cannot be deferred to the next frame.
  nativeEvent.preventDefault()

  if (nativeEvent.dataTransfer) {
    nativeEvent.dataTransfer.dropEffect = nativeEvent.dataTransfer.types.includes(
      'application/json',
    )
      ? 'move'
      : 'copy'
  }

  highlightDay(toDateString(date))
}

const handleDragLeave = (nativeEvent: DragEvent) => {
  if (
    !(nativeEvent.relatedTarget instanceof Node) ||
    !monthGrid.value?.contains(nativeEvent.relatedTarget)
  ) {
    highlightDay.cancel()
    setDropTarget(null)
  }
}

const handleDrop = (nativeEvent: DragEvent, date: string | Date) => {
  nativeEvent.preventDefault()
  // Drop the pending frame first, so a stale highlight cannot land after the drop.
  highlightDay.cancel()
  setDropTarget(null)
  const event = getDropEvent(expandedEvents.value, nativeEvent.dataTransfer)

  if (event) {
    const { start } = calculateMonthDropDate({
      draggedEvent: event,
      targetDay: toDateString(date),
    })
    emit('eventDrop', moveEventTo(event, start))
  } else if (nativeEvent.dataTransfer) {
    emit('externalEventDrop', nativeEvent.dataTransfer, toDateString(date))
  }
}

const segmentStyle = (position: { startOffset: number; width: number; row: number }) => ({
  position: 'absolute' as const,
  insetInlineStart: `${position.startOffset}%`,
  width: `${position.width}%`,
  top: `${EVENTS_TOP_OFFSET + position.row * EVENT_ROW_HEIGHT}px`,
})

const backgroundSegmentStyle = (position: { startOffset: number; width: number }) => ({
  insetInlineStart: `calc(${position.startOffset}% + 2px)`,
  width: `calc(${position.width}% - 3px)`,
})

const isDraggableEvent = (event: ScheduleEventData) =>
  !isStatic.value && props.withEventsDragAndDrop === true && (props.canDragEvent?.(event) ?? true)
</script>

<template>
  <Box
    v-bind="{ ...attrs, ...getStyles('monthView') }"
    :mod="[
      {
        'with-week-numbers': props.withWeekNumbers,
        'with-weekdays': props.withWeekDays,
        static: isStatic,
        'slot-dragging': slotDragSelect.isDragging(),
      },
      (attrs as any).mod,
    ]"
  >
    <ScheduleHeaderBase
      v-if="props.withHeader"
      view="month"
      :labels="props.labels"
      :navigation-handlers="createHeaderNavigation(props.date, 'month')"
      :control="headerControl"
      :previous-control-props="props.previousControlProps"
      :next-control-props="props.nextControlProps"
      :today-control-props="props.todayControlProps"
      :view-select-props="props.viewSelectProps"
      v-bind="stylesApi"
      @date-change="changeDate"
      @view-change="emit('viewChange', $event)"
    />

    <ScrollArea
      :scrollbar-size="4"
      v-bind="{ ...props.scrollAreaProps, ...getStyles('monthViewScrollArea') }"
      :viewport-props="{ ...scheduleViewportProps, ...props.scrollAreaProps?.viewportProps }"
    >
      <div ref="monthGrid" v-bind="getStyles('monthViewInner')">
        <div v-if="props.withWeekDays" v-bind="getStyles('monthViewWeekdays')">
          <div v-if="props.withWeekNumbers" v-bind="getStyles('monthViewWeekdaysCorner')" />
          <div
            v-for="(weekday, index) in weekdays"
            :key="index"
            v-bind="staticStyles('monthViewWeekday')"
          >
            {{ weekday }}
          </div>
        </div>

        <div
          v-for="(week, weekIndex) in weeks"
          :key="`week-${weekIndex}`"
          v-bind="staticStyles('monthViewWeek')"
        >
          <UnstyledButton
            v-if="props.withWeekNumbers"
            type="button"
            v-bind="{
              ...weekNumberProps(week[0]),
              ...getStyles('monthViewWeekNumber', { className: weekNumberProps(week[0]).class }),
            }"
            @click="emit('weekNumberClick', toDateString(week[0]), $event)"
          >
            {{ getWeekNumber(week) }}
          </UnstyledButton>

          <div
            v-for="(date, dayIndex) in week"
            :key="toDateString(date)"
            v-bind="staticStyles('monthViewDay')"
            :data-outside="isOutside(date) || undefined"
            :data-weekend="props.weekendDays!.includes(dayjs(date).day() as DayOfWeek) || undefined"
            :data-static="isStatic || undefined"
            :data-drop-target="dropTarget === toDateString(date) || undefined"
            :data-drag-selected="
              slotDragSelect.isSlotSelected(weekIndex * COLUMNS + dayIndex, MONTH_SLOT_GROUP) ||
              undefined
            "
            :data-drag-slot-index="withSlotSelect ? weekIndex * COLUMNS + dayIndex : undefined"
            :data-drag-slot-group="withSlotSelect ? MONTH_SLOT_GROUP : undefined"
            @pointerdown="
              withSlotSelect
                ? slotDragSelect.handleSlotPointerDown(
                    $event,
                    weekIndex * COLUMNS + dayIndex,
                    MONTH_SLOT_GROUP,
                  )
                : undefined
            "
            @dragover="withDragHandlers ? handleDragOver($event, date) : $event.preventDefault()"
            @dragleave="withDragHandlers ? handleDragLeave($event) : undefined"
            @drop="handleDrop($event, date)"
          >
            <UnstyledButton
              type="button"
              v-bind="{
                ...dayProps(date as string),
                ...getStyles('monthViewDayLabel', { className: dayProps(date as string).class }),
              }"
              :disabled="isStatic"
              :data-grid-index="weekIndex * COLUMNS + dayIndex"
              :data-outside="isOutside(date) || undefined"
              :data-hidden="isHiddenDay(date) || undefined"
              :aria-label="
                formatDate({ date, locale: props.locale || 'en', format: 'MMMM D, YYYY' })
              "
              :data-today="
                (props.highlightToday && dayjs(date).isSame(dayjs(), 'day')) || undefined
              "
              :tabindex="
                isStatic ? -1 : weekIndex * COLUMNS + dayIndex === firstFocusableDayIndex ? 0 : -1
              "
              @click="emit('dayClick', toDateString(date), $event)"
              @keydown="
                isStatic ? undefined : handleDayKeydown($event, weekIndex * COLUMNS + dayIndex)
              "
            >
              {{ isHiddenDay(date) ? '' : dayjs(date).date() }}
            </UnstyledButton>

            <MoreEvents
              v-if="hiddenEventsCount(date) > 0"
              :events="dayEvents(date)"
              :more-events-count="hiddenEventsCount(date)"
              :labels="props.labels"
              :mode="props.mode"
              v-bind="{ ...eventRenderers, ...stylesApi, ...props.moreEventsProps }"
              @event-click="clickEvent"
            />
          </div>

          <div v-bind="getStyles('monthViewEvents')">
            <ScheduleBackgroundEvent
              v-for="event in grouped.backgroundByWeek[String(weekIndex)] || []"
              :key="`background-${event.id}-${weekIndex}`"
              :event="event"
              :interactive="Boolean(props.withInteractiveBackgroundEvents) && !isStatic"
              v-bind="{ ...eventRenderers, ...staticStyles('monthViewBackgroundEvent') }"
              :style="backgroundSegmentStyle(event.position)"
              @event-click="clickEvent"
            />

            <ScheduleEvent
              v-for="segment in weekSegments[weekIndex]"
              :key="segment.key"
              :event="segment.event"
              nowrap
              :hanging="segment.position.hanging"
              :mode="props.mode"
              :data-clip-start="segment.clipStart || undefined"
              :data-clip-end="segment.clipEnd || undefined"
              :style="segmentStyle(segment.position)"
              :draggable="isDraggableEvent(segment.event)"
              v-bind="{ ...eventRenderers, ...stylesApi }"
              @event-drag-start="dragStart"
              @event-drag-end="dragEnd"
              @click="clickEvent(segment.event, $event)"
            />
          </div>
        </div>
      </div>
    </ScrollArea>
  </Box>
</template>
