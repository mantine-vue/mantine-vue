import dayjs from 'dayjs'
import { defineComponent, h, ref, type PropType, type SlotsType } from 'vue'
import { Box, ScrollArea, UnstyledButton } from '@mantine-vue/core'
import type { DateLabelFormat, DayOfWeek } from '../../types'
import type { MonthViewProps } from '../../component-props'
import {
  calculateMonthDropDate,
  formatDate,
  getMonthDays,
  getWeekNumber,
  getWeekdaysNames,
  toDateString,
} from '../../utils'
import { MoreEvents } from '../MoreEvents/MoreEvents'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { handleGridKeydown } from '../keyboard-navigation'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import {
  baseViewProps,
  eventNode,
  forwardEventSlots,
  getDropEvent,
  getExpandedEvents,
  moveEventTo,
  resolveScheduleRadius,
  type EventSlots,
} from '../shared'
import { getMonthViewEvents } from './get-month-view-events/get-month-view-events'
import { getRenderableMonthEventSegments } from './get-renderable-month-event-segments'
import classes from './MonthView.module.css'

export const MonthView = defineComponent({
  name: 'MonthView',
  inheritAttrs: false,
  slots: Object as SlotsType<EventSlots>,
  props: {
    ...baseViewProps,
    firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: 1 },
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'ddd' },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    withWeekNumbers: Boolean,
    withWeekDays: { type: Boolean, default: true },
    consistentWeeks: { type: Boolean, default: true },
    highlightToday: { type: Boolean, default: true },
    withOutsideDays: { type: Boolean, default: true },
    maxEventsPerDay: { type: Number, default: 2 },
    getDayProps: Function as PropType<MonthViewProps['getDayProps']>,
    getWeekNumberProps: Function as PropType<MonthViewProps['getWeekNumberProps']>,
    onDayClick: Function as PropType<MonthViewProps['onDayClick']>,
    onWeekNumberClick: Function as PropType<MonthViewProps['onWeekNumberClick']>,
    withEventsDragAndDrop: Boolean,
    onEventDrop: Function as PropType<MonthViewProps['onEventDrop']>,
    canDragEvent: Function as PropType<MonthViewProps['canDragEvent']>,
    onEventDragStart: Function as PropType<MonthViewProps['onEventDragStart']>,
    onEventDragEnd: Function as PropType<MonthViewProps['onEventDragEnd']>,
    onExternalEventDrop: Function as PropType<MonthViewProps['onExternalEventDrop']>,
    withDragSlotSelect: Boolean,
    onSlotDragEnd: Function as PropType<MonthViewProps['onSlotDragEnd']>,
  },
  setup(props, { attrs, slots }) {
    const monthGrid = ref<HTMLElement | null>(null)
    const dropTarget = ref<string | null>(null)
    const monthGroup = 'month'
    const flatDays = ref<string[]>([])
    const slotDragSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () =>
        props.onSlotDragEnd
          ? (startIndex, endIndex) => {
              const startDay = flatDays.value[startIndex]
              const endDay = flatDays.value[endIndex]
              if (startDay && endDay) {
                props.onSlotDragEnd?.(
                  dayjs(startDay).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
                  dayjs(endDay).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
                )
              }
            }
          : undefined,
    })
    return () => {
      const month = dayjs(props.date).startOf('month')
      const maxEventsPerDay = Math.min(10, Math.max(1, props.maxEventsPerDay))
      const weeks = getMonthDays({
        month,
        firstDayOfWeek: props.firstDayOfWeek,
        consistentWeeks: props.consistentWeeks,
      })
      flatDays.value = weeks.flat().map((date) => toDateString(date))
      const firstFocusableDayIndex = weeks
        .flat()
        .findIndex((date) => props.withOutsideDays || dayjs(date).isSame(month, 'month'))
      const withSlotSelect = props.withDragSlotSelect && props.mode !== 'static'
      const rangeStart = weeks[0][0]
      const rangeEnd = weeks.at(-1)!.at(-1)!
      const expanded = getExpandedEvents(
        props.events,
        rangeStart,
        dayjs(rangeEnd).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        props.recurrenceExpansionLimit,
      )
      const grouped = getMonthViewEvents({
        date: month,
        events: expanded,
        firstDayOfWeek: props.firstDayOfWeek,
        withOutsideDays: props.withOutsideDays,
        consistentWeeks: props.consistentWeeks,
      })
      const weekdays = getWeekdaysNames({
        locale: props.locale || 'en',
        format: props.weekdayFormat,
        firstDayOfWeek: props.firstDayOfWeek,
      })
      const withDragHandlers =
        props.mode !== 'static' &&
        (props.withEventsDragAndDrop || Boolean(props.onExternalEventDrop))
      const dragOver = (nativeEvent: DragEvent, date: string) => {
        nativeEvent.preventDefault()
        dropTarget.value = toDateString(date)
        if (nativeEvent.dataTransfer) {
          nativeEvent.dataTransfer.dropEffect = nativeEvent.dataTransfer.types.includes(
            'application/json',
          )
            ? 'move'
            : 'copy'
        }
      }
      const dragLeave = (nativeEvent: DragEvent) => {
        if (
          !(nativeEvent.relatedTarget instanceof Node) ||
          !monthGrid.value?.contains(nativeEvent.relatedTarget)
        ) {
          dropTarget.value = null
        }
      }
      const drop = (nativeEvent: DragEvent, date: string) => {
        nativeEvent.preventDefault()
        dropTarget.value = null
        const event = getDropEvent(expanded, nativeEvent.dataTransfer)
        if (event) {
          const { start } = calculateMonthDropDate({
            draggedEvent: event,
            targetDay: toDateString(date),
          })
          props.onEventDrop?.(moveEventTo(event, start))
        } else if (nativeEvent.dataTransfer)
          props.onExternalEventDrop?.(nativeEvent.dataTransfer, toDateString(date))
      }
      return h(
        Box,
        {
          ...attrs,
          class: [classes.monthView, attrs.class],
          style: [
            {
              '--month-view-radius': resolveScheduleRadius(props.radius),
              '--month-view-max-events': String(maxEventsPerDay),
            },
            attrs.style,
          ],
          mod: {
            'with-week-numbers': props.withWeekNumbers,
            'with-weekdays': props.withWeekDays,
            static: props.mode === 'static',
            'slot-dragging': slotDragSelect.isDragging(),
          },
        },
        () => [
          props.withHeader
            ? h(ScheduleHeaderBase, {
                view: 'month',
                labels: props.labels,
                onDateChange: props.onDateChange,
                onViewChange: props.onViewChange,
                navigationHandlers: createHeaderNavigation(props.date!, 'month'),
                previousControlProps: props.previousControlProps,
                nextControlProps: props.nextControlProps,
                todayControlProps: props.todayControlProps,
                viewSelectProps: props.viewSelectProps,
                control: {
                  monthYearSelect: {
                    locale: props.locale,
                    monthValue: month.month(),
                    yearValue: month.year(),
                    onMonthChange: (value: number) =>
                      props.onDateChange?.(toDateString(month.month(value))),
                    onYearChange: (value: number) =>
                      props.onDateChange?.(toDateString(month.year(value))),
                  },
                },
              })
            : null,
          h(ScrollArea, { class: classes.monthViewScrollArea, scrollbarSize: 4 }, () =>
            h('div', { ref: monthGrid, class: classes.monthViewInner }, [
              props.withWeekDays
                ? h('div', { class: classes.monthViewWeekdays }, [
                    props.withWeekNumbers
                      ? h('div', { class: classes.monthViewWeekdaysCorner })
                      : null,
                    ...weekdays.map((weekday) =>
                      h('div', { class: classes.monthViewWeekday }, [weekday]),
                    ),
                  ])
                : null,
              ...weeks.map((week, weekIndex) => {
                const segments = getRenderableMonthEventSegments({
                  events: grouped.groupedByWeek[String(weekIndex)] || [],
                  groupedByDay: grouped.groupedByDay,
                  maxEventsPerDay,
                  week,
                })
                return h('div', { class: classes.monthViewWeek }, [
                  props.withWeekNumbers
                    ? h(
                        UnstyledButton,
                        {
                          type: 'button',
                          class: classes.monthViewWeekNumber,
                          ...props.getWeekNumberProps?.(toDateString(week[0])),
                          onClick: (event: MouseEvent) =>
                            props.onWeekNumberClick?.(toDateString(week[0]), event),
                        },
                        () => String(getWeekNumber(week)),
                      )
                    : null,
                  ...week.map((date, dayIndex) => {
                    const dateKey = dayjs(date).format('YYYY-MM-DD 00:00:00')
                    const dayProps = props.getDayProps?.(toDateString(date)) || {}
                    const events = grouped.groupedByDay[dateKey] || []
                    const hiddenCount = Math.max(0, events.length - maxEventsPerDay)
                    const outside = !dayjs(date).isSame(month, 'month')
                    const gridIndex = weekIndex * 7 + dayIndex
                    return h(
                      'div',
                      {
                        class: classes.monthViewDay,
                        'data-outside': outside || undefined,
                        'data-weekend':
                          props.weekendDays.includes(dayjs(date).day() as DayOfWeek) || undefined,
                        'data-static': props.mode === 'static' || undefined,
                        'data-drop-target': dropTarget.value === toDateString(date) || undefined,
                        'data-drag-selected':
                          slotDragSelect.isSlotSelected(gridIndex, monthGroup) || undefined,
                        'data-drag-slot-index': withSlotSelect ? gridIndex : undefined,
                        'data-drag-slot-group': withSlotSelect ? monthGroup : undefined,
                        onPointerdown: withSlotSelect
                          ? (event: PointerEvent) =>
                              slotDragSelect.handleSlotPointerDown(event, gridIndex, monthGroup)
                          : undefined,
                        onDragover: withDragHandlers
                          ? (event: DragEvent) => dragOver(event, date)
                          : (event: DragEvent) => event.preventDefault(),
                        onDragleave: withDragHandlers ? dragLeave : undefined,
                        onDrop: (event: DragEvent) => drop(event, date),
                      },
                      [
                        h(
                          UnstyledButton,
                          {
                            type: 'button',
                            ...dayProps,
                            class: [classes.monthViewDayLabel, dayProps.class],
                            disabled: props.mode === 'static',
                            'data-grid-index': gridIndex,
                            'data-outside': outside || undefined,
                            'data-hidden': (outside && !props.withOutsideDays) || undefined,
                            'aria-label': formatDate({
                              date,
                              locale: props.locale || 'en',
                              format: 'MMMM D, YYYY',
                            }),
                            'data-today':
                              (props.highlightToday && dayjs(date).isSame(dayjs(), 'day')) ||
                              undefined,
                            onClick: (event: MouseEvent) =>
                              props.onDayClick?.(toDateString(date), event),
                            tabindex:
                              props.mode === 'static'
                                ? -1
                                : gridIndex === firstFocusableDayIndex
                                  ? 0
                                  : -1,
                            onKeydown:
                              props.mode === 'static'
                                ? undefined
                                : (event: KeyboardEvent) => {
                                    handleGridKeydown({
                                      event,
                                      index: gridIndex,
                                      columns: 7,
                                      total: weeks.length * 7,
                                      getControl: (index) =>
                                        monthGrid.value?.querySelector<HTMLButtonElement>(
                                          `[data-grid-index="${index}"]:not([data-hidden])`,
                                        ) ?? null,
                                    })
                                    dayProps.onKeydown?.(event)
                                  },
                          },
                          () =>
                            outside && !props.withOutsideDays ? '' : String(dayjs(date).date()),
                        ),
                        hiddenCount > 0
                          ? h(
                              MoreEvents,
                              {
                                events,
                                moreEventsCount: hiddenCount,
                                labels: props.labels,
                                renderEvent: props.renderEvent,
                                renderEventBody: props.renderEventBody,
                                onEventClick: props.onEventClick,
                                mode: props.mode,
                              },
                              forwardEventSlots(slots),
                            )
                          : null,
                      ],
                    )
                  }),
                  h(
                    'div',
                    { class: classes.monthViewEvents },
                    segments.map((segment) =>
                      eventNode(
                        segment.event,
                        props,
                        {
                          key: segment.key,
                          nowrap: true,
                          hanging: segment.position.hanging,
                          'data-clip-start': segment.clipStart || undefined,
                          'data-clip-end': segment.clipEnd || undefined,
                          style: {
                            position: 'absolute',
                            insetInlineStart: `${segment.position.startOffset}%`,
                            width: `${segment.position.width}%`,
                            top: `${28 + segment.position.row * 22}px`,
                          },
                        },
                        slots,
                      ),
                    ),
                  ),
                ])
              }),
            ]),
          ),
        ],
      )
    }
  },
})

export type { MonthViewProps }
export type MonthViewStylesNames =
  | 'monthView'
  | 'monthViewWeekdays'
  | 'monthViewWeek'
  | 'monthViewWeekNumber'
  | 'monthViewWeekday'
  | 'monthViewWeekdaysCorner'
  | 'monthViewDay'
  | 'monthViewDayLabel'
  | 'monthViewBackgroundEvent'
  | 'monthViewEvents'
