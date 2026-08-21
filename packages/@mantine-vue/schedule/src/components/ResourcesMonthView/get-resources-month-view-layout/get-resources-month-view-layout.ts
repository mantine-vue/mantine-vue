import dayjs from 'dayjs'
import type { DateStringValue, ScheduleEventData } from '../../../types'

/** One day cell of a resource row: the events that fit, and how many did not. */
export interface ResourcesMonthViewCellLayout {
  /** Events that fit into the cell, with the row they occupy. */
  visible: Array<{ event: ScheduleEventData; row: number }>

  /** Number of events that did not fit. */
  hiddenCount: number
}

/** A multi-day event bar spanning a run of consecutive day columns on one row. */
export interface ResourcesMonthViewSegment {
  event: ScheduleEventData

  /** Index of the first day column the bar covers. */
  start: number

  /** Index of the last day column the bar covers. */
  end: number

  /** Row the bar occupies inside the cells it covers. */
  row: number

  /** Which ends of the bar continue outside the displayed month. */
  hanging: 'start' | 'end' | 'both' | 'none'

  /** Whether any covered cell also hides events, which shortens the bar. */
  hidden: boolean
}

export interface ResourcesMonthViewRowLayout {
  /** Events of the resource per day column, sorted the way they are laid out. */
  eventsByDay: ScheduleEventData[][]

  /** Layout of every day cell of the row. */
  layouts: ResourcesMonthViewCellLayout[]

  /** Multi-day bars of the row. */
  segments: ResourcesMonthViewSegment[]
}

export interface GetResourcesMonthViewLayoutInput {
  /** Day columns of the month, `YYYY-MM-DD`. */
  days: DateStringValue[]

  /** Events already expanded for the displayed month. */
  events: ScheduleEventData[] | undefined

  /** Resource the row belongs to. */
  resourceId: string | number

  /** Number of event rows a cell can show before the rest collapse into a "more" control. */
  maxRows: number
}

/** An event is multi-day when it ends on a later calendar day than it starts. */
export function isMultiDayEvent(event: ScheduleEventData) {
  return dayjs(event.end).startOf('day').isAfter(dayjs(event.start).startOf('day'))
}

/** Longer events come first, then earlier ones, so bars stack predictably. */
export function compareMonthEvents(a: ScheduleEventData, b: ScheduleEventData) {
  const aSpan = dayjs(a.end).startOf('day').diff(dayjs(a.start).startOf('day'), 'day')
  const bSpan = dayjs(b.end).startOf('day').diff(dayjs(b.start).startOf('day'), 'day')
  return aSpan === bSpan ? dayjs(a.start).valueOf() - dayjs(b.start).valueOf() : bSpan - aSpan
}

/**
 * Lays out one resource row of the month grid.
 *
 * Each event keeps the row it was given on the previous day whenever that row is still free,
 * so a multi-day event forms an unbroken bar instead of stepping between rows.
 */
export function getResourcesMonthViewLayout({
  days,
  events,
  resourceId,
  maxRows,
}: GetResourcesMonthViewLayoutInput): ResourcesMonthViewRowLayout {
  const monthStart = dayjs(days[0]).startOf('day')
  const monthEnd = dayjs(days.at(-1)).add(1, 'day').startOf('day')

  const eventsByDay = days.map((day) =>
    (events || [])
      .filter(
        (event) =>
          event.resourceId === resourceId &&
          dayjs(event.start).isBefore(dayjs(day).endOf('day')) &&
          dayjs(event.end).isAfter(dayjs(day).startOf('day')),
      )
      .sort(compareMonthEvents),
  )

  const layouts: ResourcesMonthViewCellLayout[] = []
  const lastRow = new Map<string | number, number>()
  const rowByEvent = new Map<string | number, Map<number, number>>()

  eventsByDay.forEach((eventList, dayIndex) => {
    const used = new Set<number>()
    const visible: ResourcesMonthViewCellLayout['visible'] = []
    let hiddenCount = 0

    eventList.forEach((event) => {
      let row = lastRow.get(event.id)

      if (row === undefined || row >= maxRows || used.has(row)) {
        row = Array.from({ length: maxRows }, (_, index) => index).find((index) => !used.has(index))
      }

      if (row === undefined) {
        hiddenCount += 1
        return
      }

      used.add(row)
      visible.push({ event, row })
      lastRow.set(event.id, row)

      if (!rowByEvent.has(event.id)) {
        rowByEvent.set(event.id, new Map())
      }

      rowByEvent.get(event.id)!.set(dayIndex, row)
    })

    layouts.push({ visible, hiddenCount })
  })

  const segments: ResourcesMonthViewSegment[] = []
  const multiDayEvents = [
    ...new Map(
      eventsByDay
        .flat()
        .filter(isMultiDayEvent)
        .map((event) => [event.id, event]),
    ).values(),
  ]

  multiDayEvents.forEach((event) => {
    const rowsForEvent = rowByEvent.get(event.id)
    let run: { start: number; end: number; row: number } | null = null

    const flush = () => {
      if (!run) {
        return
      }

      const before = dayjs(event.start).isBefore(monthStart)
      const after = dayjs(event.end).isAfter(monthEnd)

      segments.push({
        event,
        ...run,
        hanging: before && after ? 'both' : before ? 'start' : after ? 'end' : 'none',
        hidden: Array.from(
          { length: run.end - run.start + 1 },
          (_, index) => layouts[run!.start + index].hiddenCount > 0,
        ).some(Boolean),
      })

      run = null
    }

    days.forEach((_day, index) => {
      const row = rowsForEvent?.get(index)

      if (row === undefined) {
        flush()
      } else if (run && run.row === row && run.end === index - 1) {
        run.end = index
      } else {
        flush()
        run = { start: index, end: index, row }
      }
    })

    flush()
  })

  return { eventsByDay, layouts, segments }
}
