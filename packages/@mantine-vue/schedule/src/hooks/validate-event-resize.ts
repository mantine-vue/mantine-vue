import type {
  DateTimeStringValue,
  PreventEventOverlap,
  ScheduleCanResizeEventToData,
  ScheduleEventData,
  ScheduleEventPlacementRejectedData,
} from '../types'
import { isEventPlacementAllowed } from '../utils'
export interface EventResizeValidationOptions {
  events?: ScheduleEventData[]
  preventEventOverlap?: PreventEventOverlap
  canResizeEventTo?: (data: ScheduleCanResizeEventToData) => boolean
  onEventPlacementRejected?: (data: ScheduleEventPlacementRejectedData) => void
}
export function validateEventResize({
  event,
  start,
  end,
  edge,
  events = [],
  preventEventOverlap,
  canResizeEventTo,
  resourceId,
}: EventResizeValidationOptions & {
  event: ScheduleEventData
  start: DateTimeStringValue
  end: DateTimeStringValue
  edge: 'start' | 'end'
  resourceId?: string | number
}) {
  const { allowed, conflicts } = isEventPlacementAllowed({
    event,
    start,
    end,
    events,
    preventEventOverlap,
    resourceId,
  })
  if (!allowed) return { valid: false, conflicts, reason: 'overlap' as const }
  if (canResizeEventTo?.({ event, start, end, edge }) === false)
    return { valid: false, conflicts: [], reason: 'rejected' as const }
  return { valid: true, conflicts: [], reason: null }
}
