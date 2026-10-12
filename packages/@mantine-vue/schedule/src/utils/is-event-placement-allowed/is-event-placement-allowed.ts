import dayjs from 'dayjs'
import type { DateTimeStringValue, PreventEventOverlap, ScheduleEventData } from '../../types'
import { isEventsOverlap } from '../is-events-overlap/is-events-overlap'

export interface IsEventPlacementAllowedInput {
  event: ScheduleEventData
  start: DateTimeStringValue
  end: DateTimeStringValue
  events: ScheduleEventData[]
  preventEventOverlap?: PreventEventOverlap
  resourceId?: string | number
}

function isSameEvent(event: ScheduleEventData, other: ScheduleEventData) {
  if (event.id === other.id) return true
  const eventSeriesId = event.recurringEventId ?? event.recurringInstance?.recurringEventId
  const otherSeriesId = other.recurringEventId ?? other.recurringInstance?.recurringEventId
  const eventOccurrenceId = event.recurrenceId ?? event.recurringInstance?.recurrenceId
  const otherOccurrenceId = other.recurrenceId ?? other.recurringInstance?.recurrenceId
  return (
    eventSeriesId !== undefined &&
    eventSeriesId === otherSeriesId &&
    eventOccurrenceId !== undefined &&
    eventOccurrenceId === otherOccurrenceId
  )
}
const isMidnight = (value: dayjs.Dayjs) =>
  value.hour() === 0 && value.minute() === 0 && value.second() === 0
function spansWholeDays(event: ScheduleEventData) {
  const start = dayjs(event.start)
  const end = dayjs(event.end)
  return (
    isMidnight(start) &&
    (isMidnight(end) || (end.hour() === 23 && end.minute() === 59 && end.second() === 59))
  )
}
export function isEventPlacementAllowed({
  event,
  start,
  end,
  events,
  preventEventOverlap,
  resourceId,
}: IsEventPlacementAllowedInput) {
  if (!preventEventOverlap) return { allowed: true, conflicts: [] as ScheduleEventData[] }
  const candidate = {
    ...event,
    start,
    end,
    ...(resourceId !== undefined ? { resourceId } : {}),
  } as ScheduleEventData
  const allDay = spansWholeDays(candidate)
  const conflicts = events.filter((other) => {
    if (other.display === 'background' || isSameEvent(event, other)) return false
    if (resourceId !== undefined && other.resourceId !== resourceId) return false
    if (spansWholeDays(other) !== allDay || !isEventsOverlap(other, candidate)) return false
    return typeof preventEventOverlap === 'function' ? preventEventOverlap(other, candidate) : true
  })
  return { allowed: conflicts.length === 0, conflicts }
}
