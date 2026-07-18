import dayjs from 'dayjs'
import type { ScheduleEventData, ScheduleResourceData } from '../../../types'
import { expandRecurringEvents, isMultidayEvent } from '../../../utils'
import {
  getResourcesDayViewEvents,
  type ResourcesDayViewEventsResult,
} from '../../ResourcesDayView/get-resources-day-view-events/get-resources-day-view-events'
import { calculateEventDays } from '../../WeekView/get-week-view-events/calculate-event-days'
import { getEventEndDate } from '../../WeekView/get-week-view-events/get-event-end-date'

export interface ResourcesWeekViewAllDayBar {
  event: ScheduleEventData
  startDayIndex: number
  endDayIndex: number
  row: number
}

export interface ResourcesWeekViewEventsResult {
  byDay: Record<string, ResourcesDayViewEventsResult>
  allDayBars: Record<string | number, ResourcesWeekViewAllDayBar[]>
}

function assignAllDayRows(bars: ResourcesWeekViewAllDayBar[]): void {
  const rowEnds: number[] = []
  ;[...bars]
    .sort((a, b) => a.startDayIndex - b.startDayIndex || a.endDayIndex - b.endDayIndex)
    .forEach((bar) => {
      let row = 0
      while (row < rowEnds.length && rowEnds[row] >= bar.startDayIndex) row += 1
      rowEnds[row] = bar.endDayIndex
      bar.row = row
    })
}

export function getResourcesWeekViewEvents({
  events,
  resources,
  weekdays,
  startTime,
  endTime,
  intervalMinutes,
  expansionLimit,
}: {
  events: ScheduleEventData[] | undefined
  resources: ScheduleResourceData[]
  weekdays: string[]
  startTime?: string
  endTime?: string
  intervalMinutes?: number
  expansionLimit?: number
}): ResourcesWeekViewEventsResult {
  const expanded = expandRecurringEvents({
    events,
    rangeStart: dayjs(weekdays[0]).startOf('day').toDate(),
    rangeEnd: dayjs(weekdays.at(-1)).endOf('day').toDate(),
    expansionLimit,
  })
  const seen = new Set<string | number>()
  expanded?.forEach((event) => {
    if (seen.has(event.id)) {
      throw new Error(
        `[@mantine/schedule] ResourcesWeekView: Duplicated event ids found: ${event.id}`,
      )
    }
    seen.add(event.id)
  })

  const byDay: Record<string, ResourcesDayViewEventsResult> = {}
  const assigned = new Set<string | number>()
  const spanning = (event: ScheduleEventData) =>
    event.display !== 'background' && isMultidayEvent(event)
  weekdays.forEach((day) => {
    const dayEvents = expanded?.filter((event) => {
      if (assigned.has(event.id) || spanning(event)) return false
      const start = dayjs(event.start)
      const dayStart = dayjs(day).startOf('day')
      if (start.isSame(dayStart, 'day')) {
        assigned.add(event.id)
        return true
      }
      return (
        event.display === 'background' &&
        start.isBefore(dayjs(day).endOf('day')) &&
        dayjs(event.end).isAfter(dayStart)
      )
    })
    byDay[day] = getResourcesDayViewEvents({
      events: dayEvents,
      resources,
      date: day,
      startTime,
      endTime,
      intervalMinutes,
    })
  })

  const allDayBars: Record<string | number, ResourcesWeekViewAllDayBar[]> = {}
  resources.forEach((resource) => (allDayBars[resource.id] = []))
  weekdays.forEach((day, dayIndex) => {
    resources.forEach((resource) => {
      byDay[day].allDayEvents[resource.id]?.forEach((event) =>
        allDayBars[resource.id].push({
          event,
          startDayIndex: dayIndex,
          endDayIndex: dayIndex,
          row: 0,
        }),
      )
    })
  })
  expanded?.forEach((event) => {
    if (!spanning(event) || event.resourceId === undefined || !(event.resourceId in allDayBars))
      return
    const days = calculateEventDays({
      event,
      weekDays: weekdays,
      actualEndDate: getEventEndDate(event),
    })
    if (!days.length) return
    allDayBars[event.resourceId].push({
      event,
      startDayIndex: weekdays.indexOf(days[0]),
      endDayIndex: weekdays.indexOf(days.at(-1)!),
      row: 0,
    })
  })
  resources.forEach((resource) => assignAllDayRows(allDayBars[resource.id]))
  return { byDay, allDayBars }
}
