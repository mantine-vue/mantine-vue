import dayjs from 'dayjs'
import {
  defineComponent,
  h,
  ref,
  type ComponentPublicInstance,
  type CSSProperties,
  type PropType,
  type SlotsType,
  type VNodeChild,
} from 'vue'
import { Box, ScrollArea, UnstyledButton } from '@mantine-vue/core'
import type { WeekViewProps } from '../../component-props'
import { useEventResize } from '../../hooks/use-event-resize'
import { getLabel } from '../../labels'
import type { DateLabelFormat, DateStringValue, DateTimeStringValue, DayOfWeek } from '../../types'
import {
  formatDate,
  getBusinessHoursMod,
  getDayTimeIntervals,
  getWeekDays,
  getWeekNumber,
} from '../../utils'
import { CurrentTimeIndicator } from '../CurrentTimeIndicator/CurrentTimeIndicator'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import {
  eventNode,
  getDropEvent,
  getExpandedEvents,
  getTimeSlotDropTarget,
  moveEventTo,
  moveEventToAllDay,
  resolveScheduleRadius,
  timeViewProps,
  type EventSlots,
} from '../shared'
import { getWeekLabel } from './get-week-label/get-week-label'
import { getWeekViewEvents } from './get-week-view-events/get-week-view-events'
import classes from './WeekView.module.css'

export interface WeekViewSlots extends EventSlots {
  /** Scoped alternative to the `renderWeekLabel` prop */
  weekLabel?: (props: { weekStart: DateStringValue; weekEnd: DateStringValue }) => VNodeChild
}

export const WeekView = defineComponent({
  name: 'WeekView',
  inheritAttrs: false,
  slots: Object as SlotsType<WeekViewSlots>,
  props: {
    ...timeViewProps,
    withCurrentTimeIndicator: { type: Boolean, default: true },
    forceCurrentTimeIndicator: Boolean,
    firstDayOfWeek: { type: Number as PropType<DayOfWeek>, default: 1 },
    weekdayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'ddd' },
    dayFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'D' },
    withWeekNumber: { type: Boolean, default: true },
    withAllDaySlots: { type: Boolean, default: true },
    withWeekNumbers: { type: Boolean, default: undefined },
    withAllDaySlot: { type: Boolean, default: undefined },
    allDaySlotsHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 44 },
    maxAllDayEvents: { type: Number, default: 3 },
    weekendDays: { type: Array as PropType<DayOfWeek[]>, default: () => [0, 6] },
    withWeekendDays: { type: Boolean, default: true },
    weekLabelFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'MMM D' },
    renderWeekLabel: Function as PropType<WeekViewProps['renderWeekLabel']>,
  },
  setup(props, { attrs, slots }) {
    const daySlotsContainers = new Map<string, HTMLElement>()
    const dropTarget = ref<{ date: string; slotIndex: number } | null>(null)
    const eventResize = useEventResize({
      enabled: () => props.withEventResize,
      mode: () => props.mode,
      startTime: () => props.startTime,
      endTime: () => props.endTime,
      intervalMinutes: () => props.intervalMinutes,
      onEventResize: () => props.onEventResize,
      canResizeEvent: () => props.canResizeEvent,
    })
    const slotTimes = ref<{ startTime: string; endTime: string }[]>([])
    const slotDragSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () =>
        props.onSlotDragEnd
          ? (startIndex, endIndex, group) => {
              const slotDate = dayjs(group).format('YYYY-MM-DD')
              const startSlot = slotTimes.value[startIndex]
              const endSlot = slotTimes.value[endIndex]
              if (startSlot && endSlot) {
                props.onSlotDragEnd?.(
                  `${slotDate} ${startSlot.startTime}` as DateTimeStringValue,
                  `${slotDate} ${endSlot.endTime}` as DateTimeStringValue,
                )
              }
            }
          : undefined,
    })
    return () => {
      const withWeekNumber = props.withWeekNumbers ?? props.withWeekNumber
      const withAllDaySlots = props.withAllDaySlot ?? props.withAllDaySlots
      const days = getWeekDays({
        week: props.date!,
        firstDayOfWeek: props.firstDayOfWeek,
        withWeekendDays: props.withWeekendDays,
        weekendDays: props.weekendDays,
      })
      const now = dayjs(props.getCurrentTime?.() ?? dayjs())
      const currentWeekdayIndex = props.withCurrentTimeIndicator
        ? props.forceCurrentTimeIndicator
          ? days.findIndex((date) => dayjs(date).day() === now.day())
          : days.findIndex((date) => dayjs(date).isSame(now, 'day'))
        : -1
      const expanded = getExpandedEvents(
        props.events,
        dayjs(days[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(days.at(-1)).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        props.recurrenceExpansionLimit,
      )
      const grouped = getWeekViewEvents({
        date: props.date!,
        events: expanded,
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
        firstDayOfWeek: props.firstDayOfWeek,
        weekendDays: props.weekendDays,
        withWeekendDays: props.withWeekendDays,
      })
      const intervals = getDayTimeIntervals({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      })
      slotTimes.value = intervals.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))
      const withSlotSelect = props.withDragSlotSelect && props.mode !== 'static'
      const getWeekRoot = (event: KeyboardEvent) =>
        (event.currentTarget as HTMLElement).closest<HTMLElement>(`.${classes.weekViewRoot}`)
      const focusWeekControl = (event: KeyboardEvent, selector: string) => {
        const control = getWeekRoot(event)?.querySelector<HTMLButtonElement>(selector)
        if (!control || control.disabled) return
        event.preventDefault()
        control.focus()
      }
      const withDragHandlers =
        props.mode !== 'static' &&
        (props.withEventsDragAndDrop || Boolean(props.onExternalEventDrop))
      const emitDrop = (nativeEvent: DragEvent, target: string) => {
        nativeEvent.preventDefault()
        const event = getDropEvent(expanded, nativeEvent.dataTransfer)
        if (event) props.onEventDrop?.(moveEventTo(event, target))
        else if (nativeEvent.dataTransfer)
          props.onExternalEventDrop?.(nativeEvent.dataTransfer, target)
      }
      const emitAllDayDrop = (nativeEvent: DragEvent, date: string) => {
        nativeEvent.preventDefault()
        const dayKey = dayjs(date).format('YYYY-MM-DD')
        const event = getDropEvent(expanded, nativeEvent.dataTransfer)
        if (event) props.onEventDrop?.(moveEventToAllDay(event, dayKey))
        else if (nativeEvent.dataTransfer)
          props.onExternalEventDrop?.(nativeEvent.dataTransfer, `${dayKey} 00:00:00`)
      }
      const rootStyle = {
        '--week-view-radius': resolveScheduleRadius(props.radius),
        '--week-view-slot-height':
          typeof props.slotHeight === 'number' ? `${props.slotHeight}px` : props.slotHeight,
        '--week-view-all-day-slots-height':
          typeof props.allDaySlotsHeight === 'number'
            ? `${props.allDaySlotsHeight}px`
            : props.allDaySlotsHeight,
      } as CSSProperties
      return h(
        Box,
        {
          ...attrs,
          class: [classes.weekView, attrs.class],
          style: [rootStyle, attrs.style],
          mod: { static: props.mode === 'static', 'slot-dragging': slotDragSelect.isDragging() },
        },
        () => [
          props.withHeader
            ? h(ScheduleHeaderBase, {
                view: 'week',
                labels: props.labels,
                onDateChange: props.onDateChange,
                onViewChange: props.onViewChange,
                navigationHandlers: createHeaderNavigation(props.date!, 'week'),
                previousControlProps: props.previousControlProps,
                nextControlProps: props.nextControlProps,
                todayControlProps: props.todayControlProps,
                viewSelectProps: props.viewSelectProps,
                control: {
                  title: getWeekLabel({
                    weekdays: days,
                    locale: props.locale || 'en',
                    weekLabelFormat: props.weekLabelFormat,
                    renderWeekLabel:
                      props.renderWeekLabel ??
                      (slots.weekLabel ? (params) => slots.weekLabel!(params) : undefined),
                  }),
                },
              })
            : null,
          h(
            Box,
            {
              class: classes.weekViewRoot,
              style: {
                '--number-of-days': String(days.length),
                '--indicator-offset-index':
                  currentWeekdayIndex === -1 ? undefined : String(currentWeekdayIndex + 1),
              },
              mod: { 'with-weekends': props.withWeekendDays },
            },
            () => [
              h(
                ScrollArea.Autosize,
                { class: classes.weekViewScrollArea, scrollbarSize: 4 },
                () => [
                  h('div', { class: classes.weekViewHeader }, [
                    h('div', { class: classes.weekViewCorner }, [
                      withWeekNumber
                        ? h(
                            'div',
                            { class: classes.weekViewWeekLabel },
                            props.labels?.week || 'Week',
                          )
                        : null,
                      withWeekNumber
                        ? h(
                            'div',
                            { class: classes.weekViewWeekNumber },
                            String(getWeekNumber(days)),
                          )
                        : null,
                    ]),
                    ...days.map((date, dayIndex) =>
                      h(
                        UnstyledButton,
                        {
                          type: 'button',
                          class: classes.weekViewDayLabel,
                          'data-weekday-index': dayIndex,
                          'data-weekend':
                            props.weekendDays.includes(dayjs(date).day() as DayOfWeek) || undefined,
                          'aria-label': `${getLabel('weekday', props.labels)} ${dayjs(date).format('YYYY-MM-DD')}`,
                          tabindex: props.mode === 'static' ? -1 : dayIndex === 0 ? 0 : -1,
                          onKeydown:
                            props.mode === 'static'
                              ? undefined
                              : (event: KeyboardEvent) => {
                                  const next =
                                    event.key === 'ArrowRight'
                                      ? dayIndex + 1
                                      : event.key === 'ArrowLeft'
                                        ? dayIndex - 1
                                        : -1
                                  if (next >= 0 && next < days.length) {
                                    focusWeekControl(event, `[data-weekday-index="${next}"]`)
                                  }
                                },
                          onClick:
                            props.mode === 'static'
                              ? undefined
                              : () => {
                                  props.onViewChange?.('day')
                                  props.onDateChange?.(date)
                                },
                        },
                        () => [
                          h(
                            'span',
                            { class: classes.weekViewDayWeekday },
                            formatDate({
                              date,
                              locale: props.locale || 'en',
                              format: props.weekdayFormat,
                            }),
                          ),
                          h(
                            'span',
                            {
                              class: classes.weekViewDayNumber,
                              'data-today': dayjs(date).isSame(now, 'day') || undefined,
                            },
                            formatDate({
                              date,
                              locale: props.locale || 'en',
                              format: props.dayFormat,
                            }),
                          ),
                        ],
                      ),
                    ),
                  ]),
                  withAllDaySlots
                    ? h('div', { class: classes.weekViewAllDaySlots }, [
                        h(
                          'div',
                          { class: classes.weekViewAllDaySlotsLabel },
                          props.labels?.allDay || 'All day',
                        ),
                        h('div', { class: classes.weekViewAllDaySlotsList }, [
                          h(
                            'div',
                            { class: classes.weekViewAllDaySlotsEvents },
                            grouped.allDayEvents.map((event) =>
                              eventNode(
                                event,
                                props,
                                {
                                  key: event.id,
                                  nowrap: true,
                                  hanging: event.position.hanging,
                                  style: {
                                    position: 'absolute',
                                    insetInlineStart: `${event.position.offset}%`,
                                    width: `${event.position.width}%`,
                                    top: `${event.position.row * 22}px`,
                                  },
                                },
                                slots,
                              ),
                            ),
                          ),
                          ...days.map((date, dayIndex) =>
                            h(UnstyledButton, {
                              type: 'button',
                              class: classes.weekViewDaySlot,
                              disabled: props.mode === 'static',
                              'data-all-day-index': dayIndex,
                              'aria-label': `${getLabel('allDay', props.labels)} ${dayjs(date).format('YYYY-MM-DD')}`,
                              tabindex: props.mode === 'static' ? -1 : dayIndex === 0 ? 0 : -1,
                              onKeydown:
                                props.mode === 'static'
                                  ? undefined
                                  : (event: KeyboardEvent) => {
                                      if (event.key === 'ArrowDown') {
                                        focusWeekControl(
                                          event,
                                          `[data-week-day-index="${dayIndex}"][data-time-slot-index="0"]`,
                                        )
                                        return
                                      }
                                      const next =
                                        event.key === 'ArrowRight'
                                          ? dayIndex + 1
                                          : event.key === 'ArrowLeft'
                                            ? dayIndex - 1
                                            : -1
                                      if (next >= 0 && next < days.length) {
                                        focusWeekControl(event, `[data-all-day-index="${next}"]`)
                                      }
                                    },
                              onClick: (event: MouseEvent) =>
                                props.onAllDaySlotClick?.(date, event),
                              onDragover: (event: DragEvent) => event.preventDefault(),
                              onDrop: (event: DragEvent) => emitAllDayDrop(event, date),
                            }),
                          ),
                        ]),
                      ])
                    : null,
                  h(Box, { class: classes.weekViewInner }, () => [
                    h(
                      'div',
                      { class: classes.weekViewSlotLabels },
                      intervals.map((slot) =>
                        h(
                          'div',
                          { class: classes.weekViewSlotLabel },
                          formatDate({
                            date: `${dayjs(days[0]).format('YYYY-MM-DD')} ${slot.startTime}`,
                            locale: props.locale || 'en',
                            format: props.slotLabelFormat,
                          }),
                        ),
                      ),
                    ),
                    props.withCurrentTimeIndicator && currentWeekdayIndex !== -1
                      ? h(CurrentTimeIndicator, {
                          startOffset:
                            'calc(100% - (100% / var(--number-of-days)) * (var(--number-of-days) - var(--indicator-offset-index) + 1) + ((var(--number-of-days) - var(--indicator-offset-index) + 1) * var(--indicator-labels-offset)))',
                          endOffset:
                            'calc((100% / var(--number-of-days)) * (var(--number-of-days) - var(--indicator-offset-index)) - (var(--number-of-days) - var(--indicator-offset-index)) * var(--indicator-labels-offset))',
                          timeBubbleStartOffset:
                            'calc(var(--week-view-slots-label-width) - var(--time-bubble-width))',
                          currentTimeFormat: props.slotLabelFormat,
                          withTimeBubble: props.withCurrentTimeBubble,
                          withThumb: props.withCurrentTimeBubble ? currentWeekdayIndex !== 0 : true,
                          locale: props.locale,
                          startTime: props.startTime,
                          endTime: props.endTime,
                          intervalMinutes: props.intervalMinutes,
                          getCurrentTime: props.getCurrentTime,
                        })
                      : null,
                    ...days.map((date, dayIndex) =>
                      h('div', { class: classes.weekViewDay }, [
                        h(
                          'div',
                          {
                            class: classes.weekViewDaySlots,
                            ref: (element: Element | ComponentPublicInstance | null) => {
                              if (element instanceof HTMLElement) {
                                daySlotsContainers.set(date, element)
                              } else {
                                daySlotsContainers.delete(date)
                              }
                            },
                            onDragover: withDragHandlers
                              ? (event: DragEvent) => {
                                  event.preventDefault()
                                  const container = daySlotsContainers.get(date)
                                  if (!container) return
                                  const target = getTimeSlotDropTarget({
                                    nativeEvent: event,
                                    container,
                                    intervals,
                                    date: dayjs(date).format('YYYY-MM-DD'),
                                  })
                                  dropTarget.value = target
                                    ? { date, slotIndex: target.slotIndex }
                                    : null
                                  if (event.dataTransfer) {
                                    event.dataTransfer.dropEffect =
                                      event.dataTransfer.types.includes('application/json')
                                        ? 'move'
                                        : 'copy'
                                  }
                                }
                              : undefined,
                            onDragleave: withDragHandlers
                              ? (event: DragEvent) => {
                                  const container = daySlotsContainers.get(date)
                                  if (
                                    !(event.relatedTarget instanceof Node) ||
                                    !container?.contains(event.relatedTarget)
                                  ) {
                                    dropTarget.value = null
                                  }
                                }
                              : undefined,
                            onDrop: withDragHandlers
                              ? (event: DragEvent) => {
                                  const container = daySlotsContainers.get(date)
                                  if (!container) return
                                  const target = getTimeSlotDropTarget({
                                    nativeEvent: event,
                                    container,
                                    intervals,
                                    date: dayjs(date).format('YYYY-MM-DD'),
                                  })
                                  dropTarget.value = null
                                  if (target) emitDrop(event, target.target)
                                }
                              : undefined,
                          },
                          [
                            ...intervals.map((slot, slotIndex) => {
                              const datePart = dayjs(date).format('YYYY-MM-DD')
                              const start = dayjs(`${datePart} ${slot.startTime}`)
                              const end = dayjs(`${datePart} ${slot.endTime}`)
                              const mod = getBusinessHoursMod({
                                time: slot.startTime,
                                businessHours: props.businessHours || ['09:00:00', '17:00:00'],
                                highlightBusinessHours: props.highlightBusinessHours,
                                dayOfWeek: start.day() as DayOfWeek,
                              })
                              return h(UnstyledButton, {
                                type: 'button',
                                class: classes.weekViewDaySlot,
                                'data-week-day-index': dayIndex,
                                'data-time-slot-index': slotIndex,
                                'data-drag-slot-index': withSlotSelect ? slotIndex : undefined,
                                'data-drag-slot-group': withSlotSelect ? datePart : undefined,
                                'data-drop-target':
                                  (dropTarget.value?.date === date &&
                                    dropTarget.value.slotIndex === slotIndex) ||
                                  undefined,
                                'data-drag-selected':
                                  slotDragSelect.isSlotSelected(slotIndex, datePart) || undefined,
                                disabled: props.mode === 'static',
                                'aria-label': `${getLabel('timeSlot', props.labels)} ${datePart} ${slot.startTime} - ${slot.endTime}`,
                                tabindex:
                                  props.mode === 'static'
                                    ? -1
                                    : dayIndex === 0 && slotIndex === 0
                                      ? 0
                                      : -1,
                                onKeydown:
                                  props.mode === 'static'
                                    ? undefined
                                    : (event: KeyboardEvent) => {
                                        if (
                                          event.key === 'ArrowUp' &&
                                          slotIndex === 0 &&
                                          withAllDaySlots
                                        ) {
                                          focusWeekControl(
                                            event,
                                            `[data-all-day-index="${dayIndex}"]`,
                                          )
                                          return
                                        }
                                        const nextDay =
                                          event.key === 'ArrowRight'
                                            ? dayIndex + 1
                                            : event.key === 'ArrowLeft'
                                              ? dayIndex - 1
                                              : dayIndex
                                        const nextSlot =
                                          event.key === 'ArrowDown'
                                            ? slotIndex + 1
                                            : event.key === 'ArrowUp'
                                              ? slotIndex - 1
                                              : slotIndex
                                        if (
                                          nextDay >= 0 &&
                                          nextDay < days.length &&
                                          nextSlot >= 0 &&
                                          nextSlot < intervals.length &&
                                          (nextDay !== dayIndex || nextSlot !== slotIndex)
                                        ) {
                                          focusWeekControl(
                                            event,
                                            `[data-week-day-index="${nextDay}"][data-time-slot-index="${nextSlot}"]`,
                                          )
                                        }
                                      },
                                'data-business-hours': mod['business-hours'] || undefined,
                                'data-non-business-hours': mod['non-business-hours'] || undefined,
                                onClick: (nativeEvent: MouseEvent) =>
                                  props.onTimeSlotClick?.({
                                    slotStart: start.format(
                                      'YYYY-MM-DD HH:mm:ss',
                                    ) as DateTimeStringValue,
                                    slotEnd: end.format(
                                      'YYYY-MM-DD HH:mm:ss',
                                    ) as DateTimeStringValue,
                                    nativeEvent,
                                  }),
                                onPointerdown: withSlotSelect
                                  ? (nativeEvent: PointerEvent) =>
                                      slotDragSelect.handleSlotPointerDown(
                                        nativeEvent,
                                        slotIndex,
                                        datePart,
                                      )
                                  : undefined,
                                onDragover: (event: DragEvent) => event.preventDefault(),
                              })
                            }),
                            ...(grouped.backgroundEvents[date] || []).map((event) =>
                              h('div', {
                                class: classes.weekViewBackgroundEvent,
                                style: {
                                  top: `${event.position.top}%`,
                                  height: `${event.position.height}%`,
                                  width: '100%',
                                },
                              }),
                            ),
                            ...(grouped.regularEvents[date] || []).map((event) => {
                              const resizePosition = eventResize.getResizePosition(event.id)
                              const isResizable = eventResize.isResizableEvent(event)
                              return eventNode(
                                event,
                                props,
                                {
                                  key: `${event.id}-${date}`,
                                  autoSize: true,
                                  style: {
                                    position: 'absolute',
                                    top: `${resizePosition?.top ?? event.position.top}%`,
                                    height: `${resizePosition?.height ?? event.position.height}%`,
                                    width: `${event.position.width}%`,
                                    insetInlineStart: `${event.position.offset}%`,
                                  },
                                  withResize: isResizable,
                                  isResizing: resizePosition !== null,
                                  onClick: props.onEventClick
                                    ? (nativeEvent: MouseEvent) => {
                                        if (!eventResize.wasResizing()) {
                                          props.onEventClick?.(event, nativeEvent)
                                        }
                                      }
                                    : undefined,
                                  onResizeStart: (
                                    edge: 'top' | 'bottom',
                                    pointerEvent: PointerEvent,
                                  ) => {
                                    const container = daySlotsContainers.get(date)
                                    if (!container) return
                                    eventResize.handleResizeStart({
                                      event,
                                      edge,
                                      container,
                                      originalTop: event.position.top,
                                      originalHeight: event.position.height,
                                      eventDate: dayjs(date).format('YYYY-MM-DD'),
                                      pointerEvent,
                                    })
                                  },
                                },
                                slots,
                              )
                            }),
                          ],
                        ),
                      ]),
                    ),
                  ]),
                ],
              ),
            ],
          ),
        ],
      )
    }
  },
})

export type { WeekViewProps }
export type WeekViewStylesNames =
  | 'weekView'
  | 'weekViewRoot'
  | 'weekViewHeader'
  | 'weekViewInner'
  | 'weekViewAllDaySlotsEvents'
  | 'weekViewAllDaySlots'
  | 'weekViewAllDaySlotsList'
  | 'weekViewAllDaySlot'
  | 'weekViewAllDaySlotsLabel'
  | 'weekViewScrollArea'
  | 'weekViewCorner'
  | 'weekViewSlotLabels'
  | 'weekViewSlotLabel'
  | 'weekViewDayLabel'
  | 'weekViewDayWeekday'
  | 'weekViewDay'
  | 'weekViewDayNumber'
  | 'weekViewDaySlot'
  | 'weekViewDaySlots'
  | 'weekViewWeekLabel'
  | 'weekViewWeekNumber'
  | 'weekViewBackgroundEvent'
