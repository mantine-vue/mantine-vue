import { describe, expect, it } from 'vitest'
import {
  assignTime,
  clampDate,
  compareTime,
  getDefaultClampedDate,
  getEndOfWeek,
  getStartOfWeek,
  getTimeRange,
  isSameDate,
  timeToSeconds,
  toDateString,
} from '../index'

describe('@mantine-vue/dates utilities', () => {
  it('normalizes dates to date strings', () => {
    expect(toDateString(new Date('2024-02-03T10:00:00'))).toBe('2024-02-03')
    expect(toDateString(null)).toBe(null)
  })

  it('clamps dates to min and max dates', () => {
    expect(clampDate('2024-01-01', '2024-02-01', '2024-03-01')).toBe('2024-02-01')
    expect(clampDate('2024-04-01', '2024-02-01', '2024-03-01')).toBe('2024-03-01')
    expect(getDefaultClampedDate({ defaultDate: '2024-02-15' })).toBe('2024-02-15')
  })

  it('matches Mantine week calculations', () => {
    expect(getStartOfWeek('2024-05-15', 1)).toBe('2024-05-13')
    expect(getEndOfWeek('2024-05-15', 1)).toBe('2024-05-19')
  })

  it('assigns time and compares time values', () => {
    const assigned = assignTime('2024-01-01', '2024-01-02T12:30:10')
    expect([assigned.getFullYear(), assigned.getMonth(), assigned.getDate()]).toEqual([2024, 0, 1])
    expect([assigned.getHours(), assigned.getMinutes(), assigned.getSeconds()]).toEqual([
      12, 30, 10,
    ])
    expect(timeToSeconds('01:02:03')).toBe(3723)
    expect(compareTime('12:00', '11:30')).toBeGreaterThan(0)
    expect(getTimeRange('10:00', '11:00', 1800)).toEqual(['10:00', '10:30', '11:00'])
  })

  it('compares dates by day', () => {
    expect(isSameDate('2024-01-01', '2024-01-01T20:00:00')).toBe(true)
  })
})
