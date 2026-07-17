import dayjs from 'dayjs'
import { DateStringValue, DayOfWeek, MonthPositionedEventData } from '../../../types'
import { getStartOfWeek } from '../../../utils'

interface GetWeeksInRangeInput {
  rangeStart: dayjs.Dayjs
  rangeEnd: dayjs.Dayjs
  firstDayOfWeek: DayOfWeek
}

interface GetWeeksInRangeOutput {
  weeks: DateStringValue[][]
  groupedByDay: Record<string, MonthPositionedEventData[]>
}

export function getWeeksInRange({
  rangeStart,
  rangeEnd,
  firstDayOfWeek,
}: GetWeeksInRangeInput): GetWeeksInRangeOutput {
  const weeks: DateStringValue[][] = []
  const groupedByDay: Record<string, MonthPositionedEventData[]> = {}

  const startOfFirstWeekStr = getStartOfWeek({
    date: rangeStart.format('YYYY-MM-DD'),
    firstDayOfWeek,
  })

  let currentDate = dayjs(startOfFirstWeekStr)

  while (currentDate.isBefore(rangeEnd) || currentDate.isSame(rangeEnd, 'day')) {
    const week: DateStringValue[] = []
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.format('YYYY-MM-DD 00:00:00')
      week.push(dateStr)
      if (!groupedByDay[dateStr]) {
        groupedByDay[dateStr] = []
      }
      currentDate = currentDate.add(1, 'day')
    }
    weeks.push(week)
  }

  return { weeks, groupedByDay }
}
