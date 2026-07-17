import dayjs from 'dayjs'
import { defineComponent, h, ref, type CSSProperties, type PropType, type SlotsType } from 'vue'
import { Box, ScrollArea, UnstyledButton } from '@mantine-vue/core'
import type { DayViewProps, MoreEventsProps } from '../../component-props'
import { useEventResize } from '../../hooks/use-event-resize'
import type { DateLabelFormat, DateTimeStringValue } from '../../types'
import {
  formatDate,
  getBusinessHoursMod,
  getDayTimeIntervals,
  getVisibleEvents,
  toDateString,
} from '../../utils'
import { CurrentTimeIndicator } from '../CurrentTimeIndicator/CurrentTimeIndicator'
import { MoreEvents } from '../MoreEvents/MoreEvents'
import { useSlotDragSelect } from '../use-slot-drag-select'
import { ScheduleHeaderBase, createHeaderNavigation } from '../ScheduleHeader/ScheduleHeaderBase'
import {
  eventNode,
  forwardEventSlots,
  getDropEvent,
  getExpandedEvents,
  getTimeSlotDropTarget,
  moveEventTo,
  moveEventToAllDay,
  resolveScheduleRadius,
  timeViewProps,
  type EventSlots,
} from '../shared'
import { getDayViewEvents } from './get-day-view-events/get-day-view-events'
import classes from './DayView.module.css'

export const DayView = defineComponent({
  name: 'DayView',
  inheritAttrs: false,
  slots: Object as SlotsType<EventSlots>,
  props: {
    ...timeViewProps,
    intervalMinutes: { type: Number, default: 15 },
    headerFormat: {
      type: [String, Function] as PropType<DateLabelFormat>,
      default: 'MMMM D, YYYY',
    },
    withAllDaySlot: { type: Boolean, default: true },
    allDaySlotHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 44 },
    maxAllDayEvents: { type: Number, default: 3 },
    moreEventsProps: Object as PropType<Partial<MoreEventsProps>>,
  },
  setup(props, { attrs, slots }) {
    const timeSlotsContainer = ref<HTMLElement | null>(null)
    const dropTargetSlotIndex = ref<number | null>(null)
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
    const dayGroupRef = ref('')
    const slotDragSelect = useSlotDragSelect({
      enabled: () => props.withDragSlotSelect && props.mode !== 'static',
      onDragEnd: () =>
        props.onSlotDragEnd
          ? (startIndex, endIndex) => {
              const startSlot = slotTimes.value[startIndex]
              const endSlot = slotTimes.value[endIndex]
              if (startSlot && endSlot) {
                props.onSlotDragEnd?.(
                  `${dayGroupRef.value} ${startSlot.startTime}` as DateTimeStringValue,
                  `${dayGroupRef.value} ${endSlot.endTime}` as DateTimeStringValue,
                )
              }
            }
          : undefined,
    })

    return () => {
      const date = toDateString(props.date!)
      const datePart = dayjs(date).format('YYYY-MM-DD')
      const now = dayjs(props.getCurrentTime?.() ?? dayjs())
      const showCurrentTimeIndicator =
        props.withCurrentTimeIndicator ?? dayjs(date).isSame(now, 'day')
      const expanded = getExpandedEvents(
        props.events,
        dayjs(date).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(date).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        props.recurrenceExpansionLimit,
      )
      const { allDayEvents, regularEvents, backgroundTimedEvents, backgroundAllDayEvents } =
        getDayViewEvents({
          events: expanded,
          date,
          startTime: props.startTime,
          endTime: props.endTime,
          intervalMinutes: props.intervalMinutes,
        })
      const intervals = getDayTimeIntervals({
        startTime: props.startTime,
        endTime: props.endTime,
        intervalMinutes: props.intervalMinutes,
      })
      dayGroupRef.value = datePart
      slotTimes.value = intervals.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }))
      const withSlotSelect = props.withDragSlotSelect && props.mode !== 'static'
      const withDragHandlers =
        props.mode !== 'static' &&
        (props.withEventsDragAndDrop || Boolean(props.onExternalEventDrop))
      const { visibleEventsCount, hiddenEventsCount } = getVisibleEvents({
        maxEvents: props.maxAllDayEvents,
        totalEvents: allDayEvents.length,
      })
      const emitDrop = (nativeEvent: DragEvent, target: string) => {
        nativeEvent.preventDefault()
        const event = getDropEvent(expanded, nativeEvent.dataTransfer)
        if (event) props.onEventDrop?.(moveEventTo(event, target))
        else if (nativeEvent.dataTransfer)
          props.onExternalEventDrop?.(nativeEvent.dataTransfer, target)
      }
      const emitAllDayDrop = (nativeEvent: DragEvent) => {
        nativeEvent.preventDefault()
        const event = getDropEvent(expanded, nativeEvent.dataTransfer)
        if (event) props.onEventDrop?.(moveEventToAllDay(event, datePart))
        else if (nativeEvent.dataTransfer)
          props.onExternalEventDrop?.(nativeEvent.dataTransfer, `${datePart} 00:00:00`)
      }
      const rootStyle = {
        '--day-view-radius': resolveScheduleRadius(props.radius),
        '--day-view-slot-height':
          typeof props.slotHeight === 'number' ? `${props.slotHeight}px` : props.slotHeight,
        '--day-view-all-day-slot-height':
          typeof props.allDaySlotHeight === 'number'
            ? `${props.allDaySlotHeight}px`
            : props.allDaySlotHeight,
      } as CSSProperties
      return h(
        Box,
        {
          ...attrs,
          class: [classes.dayView, attrs.class],
          style: [rootStyle, attrs.style],
          mod: { static: props.mode === 'static', 'slot-dragging': slotDragSelect.isDragging() },
        },
        () => [
          props.withHeader
            ? h(ScheduleHeaderBase, {
                view: 'day',
                labels: props.labels,
                onDateChange: props.onDateChange,
                onViewChange: props.onViewChange,
                navigationHandlers: createHeaderNavigation(date, 'day'),
                previousControlProps: props.previousControlProps,
                nextControlProps: props.nextControlProps,
                todayControlProps: props.todayControlProps,
                viewSelectProps: props.viewSelectProps,
                control: {
                  title: formatDate({
                    date,
                    locale: props.locale || 'en',
                    format: props.headerFormat,
                  }),
                },
              })
            : null,
          h(ScrollArea.Autosize, { class: classes.dayViewScrollArea, scrollbarSize: 4 }, () => [
            h(Box, { class: classes.dayViewInner }, () => [
              h('div', { class: classes.dayViewSlotLabels }, [
                props.withAllDaySlot
                  ? h(Box, { class: classes.dayViewSlotLabel, mod: { 'all-day': true } }, () =>
                      getLabelSafe('allDay', props.labels),
                    )
                  : null,
                ...intervals
                  .filter((slot) => slot.isHourStart)
                  .map((slot) =>
                    h(Box, { class: classes.dayViewSlotLabel }, () =>
                      formatDate({
                        date: `${datePart} ${slot.startTime}`,
                        locale: props.locale || 'en',
                        format: props.slotLabelFormat,
                      }),
                    ),
                  ),
              ]),
              h('div', { class: classes.dayViewSlots }, [
                props.withAllDaySlot
                  ? h('div', { class: classes.dayViewAllDay }, [
                      ...backgroundAllDayEvents.map((event) =>
                        h('div', { class: classes.dayViewBackgroundEvent, key: event.id }),
                      ),
                      h('div', { class: classes.dayViewAllDayEvents }, [
                        ...allDayEvents
                          .slice(0, visibleEventsCount)
                          .map((event) =>
                            eventNode(event, props, { key: event.id, nowrap: true }, slots),
                          ),
                        hiddenEventsCount > 0
                          ? h(
                              MoreEvents,
                              {
                                events: allDayEvents,
                                moreEventsCount: hiddenEventsCount,
                                labels: props.labels,
                                mode: props.mode,
                                renderEvent: props.renderEvent,
                                renderEventBody: props.renderEventBody,
                                onEventClick: props.onEventClick,
                                ...props.moreEventsProps,
                              },
                              forwardEventSlots(slots),
                            )
                          : null,
                      ]),
                      h(UnstyledButton, {
                        class: classes.dayViewSlot,
                        mod: { 'all-day': true, static: props.mode === 'static' },
                        tabindex: props.mode === 'static' ? -1 : 0,
                        'aria-label': `${getLabelSafe('timeSlot', props.labels)} ${getLabelSafe('allDay', props.labels)}`,
                        onClick:
                          props.mode === 'static'
                            ? undefined
                            : (event: MouseEvent) => props.onAllDaySlotClick?.(date, event),
                        onDragover: (event: DragEvent) => event.preventDefault(),
                        onDrop: (event: DragEvent) => emitAllDayDrop(event),
                      }),
                    ])
                  : null,
                h(
                  'div',
                  {
                    ref: timeSlotsContainer,
                    class: classes.dayViewTimeSlots,
                    onDragover: withDragHandlers
                      ? (event: DragEvent) => {
                          event.preventDefault()
                          if (!timeSlotsContainer.value) return
                          const target = getTimeSlotDropTarget({
                            nativeEvent: event,
                            container: timeSlotsContainer.value,
                            intervals,
                            date: datePart,
                          })
                          dropTargetSlotIndex.value = target?.slotIndex ?? null
                          if (event.dataTransfer) {
                            event.dataTransfer.dropEffect = event.dataTransfer.types.includes(
                              'application/json',
                            )
                              ? 'move'
                              : 'copy'
                          }
                        }
                      : undefined,
                    onDragleave: withDragHandlers
                      ? (event: DragEvent) => {
                          if (
                            !(event.relatedTarget instanceof Node) ||
                            !timeSlotsContainer.value?.contains(event.relatedTarget)
                          ) {
                            dropTargetSlotIndex.value = null
                          }
                        }
                      : undefined,
                    onDrop: withDragHandlers
                      ? (event: DragEvent) => {
                          if (!timeSlotsContainer.value) return
                          const target = getTimeSlotDropTarget({
                            nativeEvent: event,
                            container: timeSlotsContainer.value,
                            intervals,
                            date: datePart,
                          })
                          dropTargetSlotIndex.value = null
                          if (target) emitDrop(event, target.target)
                        }
                      : undefined,
                  },
                  [
                    ...backgroundTimedEvents.map((event) =>
                      h('div', {
                        key: event.id,
                        class: classes.dayViewBackgroundEvent,
                        style: {
                          top: `${event.position.top}%`,
                          height: `${event.position.height}%`,
                        },
                      }),
                    ),
                    ...regularEvents.map((event) => {
                      const resizePosition = eventResize.getResizePosition(event.id)
                      const isResizable = eventResize.isResizableEvent(event)
                      return eventNode(
                        event,
                        props,
                        {
                          key: event.id,
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
                          onResizeStart: (edge: 'top' | 'bottom', pointerEvent: PointerEvent) => {
                            if (!timeSlotsContainer.value) return
                            eventResize.handleResizeStart({
                              event,
                              edge,
                              container: timeSlotsContainer.value,
                              originalTop: event.position.top,
                              originalHeight: event.position.height,
                              eventDate: datePart,
                              pointerEvent,
                            })
                          },
                        },
                        slots,
                      )
                    }),
                    showCurrentTimeIndicator
                      ? h(CurrentTimeIndicator, {
                          startOffset: 'calc(var(--day-view-slot-labels-width) * -1)',
                          endOffset: '0rem',
                          topOffset: '0rem',
                          timeBubbleStartOffset:
                            'calc(var(--day-view-slot-labels-width) * -1 + 30px)',
                          currentTimeFormat: props.slotLabelFormat,
                          startTime: props.startTime,
                          endTime: props.endTime,
                          intervalMinutes: props.intervalMinutes,
                          withTimeBubble: props.withCurrentTimeBubble,
                          withThumb: !props.withCurrentTimeBubble,
                          getCurrentTime: props.getCurrentTime,
                          locale: props.locale,
                        })
                      : null,
                    ...intervals.map((slot, index) => {
                      const start = dayjs(`${datePart} ${slot.startTime}`)
                      const end = start.add(props.intervalMinutes, 'minute')
                      const mod = props.highlightBusinessHours
                        ? getBusinessHoursMod({
                            time: start.format('HH:mm:ss'),
                            businessHours: props.businessHours || ['09:00:00', '17:00:00'],
                            highlightBusinessHours: true,
                            dayOfWeek: start.day() as import('../../types').DayOfWeek,
                          })
                        : { 'business-hours': false, 'non-business-hours': false }
                      return h(UnstyledButton, {
                        class: classes.dayViewSlot,
                        'data-time-slot-index': index,
                        'data-drag-slot-index': withSlotSelect ? index : undefined,
                        'data-drag-slot-group': withSlotSelect ? datePart : undefined,
                        style: { '--slot-size': String(props.intervalMinutes / 60) },
                        mod: {
                          first: index === 0,
                          'hour-start': slot.isHourStart,
                          static: props.mode === 'static',
                          'drop-target': dropTargetSlotIndex.value === index,
                          'drag-selected': slotDragSelect.isSlotSelected(index, datePart),
                          'business-hours': mod['business-hours'],
                          'non-business-hours': mod['non-business-hours'],
                        },
                        tabindex: props.mode === 'static' ? -1 : index === 0 ? 0 : -1,
                        onKeydown:
                          props.mode === 'static'
                            ? undefined
                            : (event: KeyboardEvent) => {
                                const nextIndex =
                                  event.key === 'ArrowDown'
                                    ? index + 1
                                    : event.key === 'ArrowUp'
                                      ? index - 1
                                      : -1
                                if (nextIndex < 0 || nextIndex >= intervals.length) return
                                event.preventDefault()
                                timeSlotsContainer.value
                                  ?.querySelector<HTMLButtonElement>(
                                    `[data-time-slot-index="${nextIndex}"]`,
                                  )
                                  ?.focus()
                              },
                        'aria-label': `${getLabelSafe('timeSlot', props.labels)} ${slot.startTime} - ${slot.endTime}`,
                        onClick: (nativeEvent: MouseEvent) =>
                          props.onTimeSlotClick?.({
                            slotStart: start.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
                            slotEnd: end.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
                            nativeEvent,
                          }),
                        onPointerdown: withSlotSelect
                          ? (nativeEvent: PointerEvent) =>
                              slotDragSelect.handleSlotPointerDown(nativeEvent, index, datePart)
                          : undefined,
                        onDragover: (event: DragEvent) => event.preventDefault(),
                      })
                    }),
                  ],
                ),
              ]),
            ]),
          ]),
        ],
      )
    }
  },
})

function getLabelSafe(key: 'allDay' | 'timeSlot', labels: DayViewProps['labels']) {
  const defaults = { allDay: 'All day', timeSlot: 'Time slot' }
  return labels?.[key] || defaults[key]
}

export type { DayViewProps }
export type DayViewStylesNames =
  | 'dayView'
  | 'dayViewInner'
  | 'dayViewScrollArea'
  | 'dayViewAllDay'
  | 'dayViewAllDayEvents'
  | 'dayViewSlot'
  | 'dayViewSlots'
  | 'dayViewTimeSlots'
  | 'dayViewSlotLabel'
  | 'dayViewSlotLabels'
  | 'dayViewBackgroundEvent'
