import dayjs from 'dayjs'
import type {
  AnyDateValue,
  DayPositionedEventData,
  ScheduleEventData,
  ScheduleResourceData,
} from '../../../types'
import { getDayPosition, isAllDayEvent, isEventInTimeRange, validateEvent } from '../../../utils'
import { getDayPositionedEvents } from '../../DayView/get-day-view-events/get-day-positioned-events'

export interface ResourcesDayViewEventsResult {
  regularEvents: Record<string | number, DayPositionedEventData[]>
  allDayEvents: Record<string | number, DayPositionedEventData[]>
  backgroundTimedEvents: Record<string | number, DayPositionedEventData[]>
  backgroundAllDayEvents: Record<string | number, DayPositionedEventData[]>
}

export function getResourcesDayViewEvents({
  events,
  resources,
  date,
  startTime,
  endTime,
  intervalMinutes,
}: {
  events: ScheduleEventData[] | undefined
  resources: ScheduleResourceData[]
  date: AnyDateValue
  startTime?: string
  endTime?: string
  intervalMinutes?: number
}): ResourcesDayViewEventsResult {
  const result: ResourcesDayViewEventsResult = {
    regularEvents: {},
    allDayEvents: {},
    backgroundTimedEvents: {},
    backgroundAllDayEvents: {},
  }
  resources.forEach((resource) => {
    result.regularEvents[resource.id] = []
    result.allDayEvents[resource.id] = []
    result.backgroundTimedEvents[resource.id] = []
    result.backgroundAllDayEvents[resource.id] = []
  })
  if (!events) return result

  const dayStart = dayjs(date).startOf('day')
  const dayEnd = dayjs(date).endOf('day')
  const regular = new Map<string | number, ScheduleEventData[]>(
    resources.map((resource) => [resource.id, []]),
  )
  const background = new Map<string | number, ScheduleEventData[]>(
    resources.map((resource) => [resource.id, []]),
  )
  const seen = new Set<string | number>()

  events.forEach((event) => {
    if (event.resourceId === undefined || !regular.has(event.resourceId)) return
    const eventStart = dayjs(event.start)
    const eventEnd = dayjs(event.end)
    const startsOnDay = eventStart.isSame(dayStart, 'day')
    if (!startsOnDay && !(eventStart.isBefore(dayEnd) && eventEnd.isAfter(dayStart))) return
    if (startsOnDay && !isEventInTimeRange({ event, startTime, endTime })) return
    if (seen.has(event.id)) {
      throw new Error(
        `[@mantine/schedule] ResourcesDayView: Duplicated event ids found: ${event.id}`,
      )
    }
    seen.add(event.id)
    const validated = validateEvent(event)
    if (event.display === 'background') {
      background.get(event.resourceId)!.push(validated)
      return
    }
    const clipped = startsOnDay
      ? validated
      : {
          ...validated,
          start: (eventStart.isBefore(dayStart) ? dayStart : eventStart).format(
            'YYYY-MM-DD HH:mm:ss',
          ),
          end: (eventEnd.isAfter(dayEnd) ? dayEnd : eventEnd).format('YYYY-MM-DD HH:mm:ss'),
        }
    if (isEventInTimeRange({ event: clipped, startTime, endTime })) {
      regular.get(event.resourceId)!.push(clipped)
    }
  })

  resources.forEach((resource) => {
    getDayPositionedEvents({
      events: regular.get(resource.id)!,
      startTime,
      endTime,
      date,
      intervalMinutes,
    }).forEach((event) => {
      const target = event.position.allDay ? result.allDayEvents : result.regularEvents
      target[resource.id].push(event)
    })

    background.get(resource.id)!.forEach((event) => {
      const clippedStart = dayjs(event.start).isBefore(dayStart) ? dayStart : dayjs(event.start)
      const clippedEnd = dayjs(event.end).isAfter(dayEnd) ? dayEnd : dayjs(event.end)
      const clipped = {
        ...event,
        start: clippedStart.format('YYYY-MM-DD HH:mm:ss'),
        end: clippedEnd.format('YYYY-MM-DD HH:mm:ss'),
      }
      const allDay = isAllDayEvent({ event: clipped, date })
      const position = allDay
        ? { top: 0, height: 100 }
        : getDayPosition({ event: clipped, startTime, endTime, intervalMinutes })
      if (!allDay && position.height <= 0) return
      const target = allDay ? result.backgroundAllDayEvents : result.backgroundTimedEvents
      target[resource.id].push({
        ...event,
        position: {
          ...position,
          allDay,
          width: 100,
          offset: 0,
          column: 0,
          overlaps: 1,
        },
      })
    })
  })
  return result
}
