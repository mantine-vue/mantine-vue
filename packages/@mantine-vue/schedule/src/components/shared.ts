import dayjs from 'dayjs'
import { h, type CSSProperties, type PropType, type VNodeChild } from 'vue'
import type {
  BaseViewProps,
  EventDropData,
  NativeButtonProps,
  RenderEvent,
  RenderEventBody,
  TimeSlotClickData,
} from '../component-props'
import type {
  AnyDateValue,
  DateLabelFormat,
  DateStringValue,
  DateTimeStringValue,
  ScheduleEventData,
  ScheduleMode,
  ScheduleViewLevel,
} from '../types'
import type { BusinessHoursValue } from '../utils'
import { expandRecurringEvents, formatDate, toDateString } from '../utils'
import { ScheduleEvent } from './ScheduleEvent/ScheduleEvent'

export const baseViewProps = {
  date: { type: [String, Date] as PropType<Date | DateStringValue>, required: true },
  onDateChange: Function as PropType<(date: DateStringValue) => void>,
  events: Array as PropType<ScheduleEventData[]>,
  locale: String,
  radius: [String, Number] as PropType<string | number>,
  labels: Object,
  mode: { type: String as PropType<ScheduleMode>, default: 'default' },
  withHeader: { type: Boolean, default: true },
  onViewChange: Function as PropType<(view: ScheduleViewLevel) => void>,
  previousControlProps: Object as PropType<NativeButtonProps>,
  nextControlProps: Object as PropType<NativeButtonProps>,
  todayControlProps: Object as PropType<NativeButtonProps>,
  viewSelectProps: Object,
  renderEventBody: Function as PropType<RenderEventBody>,
  renderEvent: Function as PropType<RenderEvent>,
  onEventClick: Function as PropType<(event: ScheduleEventData, nativeEvent: MouseEvent) => void>,
  recurrenceExpansionLimit: { type: Number, default: 2000 },
}

export const timeViewProps = {
  ...baseViewProps,
  startTime: { type: String, default: '00:00:00' },
  endTime: { type: String, default: '23:59:59' },
  intervalMinutes: { type: Number, default: 60 },
  slotLabelFormat: { type: [String, Function] as PropType<DateLabelFormat>, default: 'HH:mm' },
  withCurrentTimeIndicator: { type: Boolean, default: undefined },
  withCurrentTimeBubble: { type: Boolean, default: true },
  getCurrentTime: Function as PropType<() => AnyDateValue>,
  slotHeight: { type: [String, Number] as PropType<CSSProperties['height']>, default: 64 },
  highlightBusinessHours: Boolean,
  businessHours: [Array, Object] as PropType<BusinessHoursValue>,
  withEventsDragAndDrop: Boolean,
  onEventDrop: Function as PropType<(data: EventDropData) => void>,
  canDragEvent: Function as PropType<(event: ScheduleEventData) => boolean>,
  onEventDragStart: Function as PropType<(event: ScheduleEventData) => void>,
  onEventDragEnd: Function as PropType<() => void>,
  onTimeSlotClick: Function as PropType<(data: TimeSlotClickData) => void>,
  onAllDaySlotClick: Function as PropType<(date: DateStringValue, nativeEvent: MouseEvent) => void>,
  withDragSlotSelect: Boolean,
  onSlotDragEnd: Function,
  startScrollTime: String,
  onExternalEventDrop: Function,
  withEventResize: Boolean,
  onEventResize: Function as PropType<(data: EventDropData) => void>,
  canResizeEvent: Function as PropType<(event: ScheduleEventData) => boolean>,
}

export function resolveScheduleRadius(radius: string | number | undefined): string | undefined {
  if (radius === undefined) return undefined
  if (typeof radius === 'number') return `${radius}px`
  return ['xs', 'sm', 'md', 'lg', 'xl'].includes(radius)
    ? `var(--mantine-radius-${radius})`
    : radius
}

export function getExpandedEvents(
  events: ScheduleEventData[] | undefined,
  rangeStart: Date | string,
  rangeEnd: Date | string,
  expansionLimit: number,
) {
  return expandRecurringEvents({ events, rangeStart, rangeEnd, expansionLimit })
}

export function formatLabel(
  date: Date | string,
  locale: string | undefined,
  format: DateLabelFormat,
) {
  return formatDate({ date, locale: locale || 'en', format })
}

/** Scoped slots that mirror the `renderEvent` / `renderEventBody` props. */
export interface EventSlots {
  eventBody?: (props: { event: ScheduleEventData }) => VNodeChild
  event?: (props: Record<string, unknown> & { event: ScheduleEventData }) => VNodeChild
}

/**
 * Build the slots object forwarded to a child component, omitting undefined entries.
 * Returns a `Record<string, unknown>` (possibly empty) so it satisfies Vue's `RawSlots`
 * type when passed as the third argument to `h()`.
 */
export function forwardEventSlots(slots: EventSlots | undefined): Record<string, unknown> {
  const forwarded: Record<string, unknown> = {}
  if (slots?.eventBody) forwarded.eventBody = slots.eventBody
  if (slots?.event) forwarded.event = slots.event
  return forwarded
}

export function eventNode(
  event: ScheduleEventData,
  props: Pick<BaseViewProps, 'mode' | 'renderEvent' | 'renderEventBody' | 'onEventClick'> & {
    withEventsDragAndDrop?: boolean
    canDragEvent?: (event: ScheduleEventData) => boolean
    onEventDragStart?: (event: ScheduleEventData) => void
    onEventDragEnd?: () => void
  },
  extra: Record<string, unknown> = {},
  slots?: EventSlots,
): VNodeChild {
  const draggable =
    props.mode !== 'static' &&
    props.withEventsDragAndDrop === true &&
    (props.canDragEvent?.(event) ?? true)
  return h(
    ScheduleEvent,
    {
      event,
      mode: props.mode ?? 'default',
      renderEvent: props.renderEvent,
      renderEventBody: props.renderEventBody,
      draggable,
      onEventDragStart: props.onEventDragStart,
      onEventDragEnd: props.onEventDragEnd,
      onClick: (nativeEvent: MouseEvent) => props.onEventClick?.(event, nativeEvent),
      ...extra,
    },
    forwardEventSlots(slots),
  )
}

export function getDropEvent(
  events: ScheduleEventData[] | undefined,
  transfer: DataTransfer | null,
) {
  const raw = transfer?.getData('application/json')
  if (!raw) return undefined

  try {
    const data: unknown = JSON.parse(raw)
    if (typeof data !== 'object' || data === null || !('eventId' in data)) return undefined
    const eventId = (data as { eventId: unknown }).eventId
    if (typeof eventId !== 'string' && typeof eventId !== 'number') return undefined
    return events?.find((event) => String(event.id) === String(eventId))
  } catch {
    return undefined
  }
}

export function getTimeSlotDropTarget({
  nativeEvent,
  container,
  intervals,
  date,
}: {
  nativeEvent: DragEvent
  container: HTMLElement
  intervals: Array<{ startTime: string }>
  date: string
}): { slotIndex: number; target: DateTimeStringValue } | undefined {
  const eventTarget = nativeEvent.target instanceof Element ? nativeEvent.target : null
  const targetSlot = eventTarget?.closest<HTMLElement>('[data-time-slot-index]')
  let slotIndex =
    targetSlot && container.contains(targetSlot)
      ? Number(targetSlot.dataset.timeSlotIndex)
      : Number.NaN

  if (!Number.isInteger(slotIndex)) {
    const slots = container.querySelectorAll<HTMLElement>('[data-time-slot-index]')
    slotIndex = Array.from(slots).findIndex((slot) => {
      const rect = slot.getBoundingClientRect()
      return nativeEvent.clientY >= rect.top && nativeEvent.clientY <= rect.bottom
    })
  }

  const interval = intervals[slotIndex]
  return interval
    ? {
        slotIndex,
        target: `${date} ${interval.startTime}` as DateTimeStringValue,
      }
    : undefined
}

export function moveEventTo(event: ScheduleEventData, newStart: dayjs.ConfigType) {
  const start = dayjs(event.start)
  const duration = dayjs(event.end).diff(start, 'second')
  const nextStart = dayjs(newStart)
  return {
    eventId: event.id,
    newStart: nextStart.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    newEnd: nextStart.add(duration, 'second').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    event,
  }
}

export function moveEventToAllDay(event: ScheduleEventData, date: dayjs.ConfigType) {
  const dayStart = dayjs(date).startOf('day')
  const spanDays = Math.max(
    1,
    dayjs(event.end).startOf('day').diff(dayjs(event.start).startOf('day'), 'day'),
  )
  return {
    eventId: event.id,
    newStart: dayStart.format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    newEnd: dayStart.add(spanDays, 'day').format('YYYY-MM-DD HH:mm:ss') as DateTimeStringValue,
    event,
  }
}

export function todayString() {
  return toDateString(dayjs())
}
