import { describe, expect, it } from 'vitest'
import type { ScheduleEventData } from '../../types'
import { calculateDropTime } from './calculate-drop-time'

const event: ScheduleEventData = {
  id: 1,
  title: 'Event',
  start: '2024-01-15 09:00:00',
  end: '2024-01-15 10:00:00',
  color: 'blue',
  payload: {},
}

const format = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

describe('@mantine-vue/schedule/calculateDropTime', () => {
  it('snaps to the slot start when no offset is provided', () => {
    const { start, end } = calculateDropTime({
      draggedEvent: event,
      targetDate: '2024-01-15',
      targetSlotTime: '11:00:00',
      intervalMinutes: 30,
    })

    expect(format(start)).toBe('2024-01-15 11:00')
    expect(format(end)).toBe('2024-01-15 12:00')
  })

  it('snaps to an interval finer than the displayed grid', () => {
    const { start, end } = calculateDropTime({
      draggedEvent: event,
      targetDate: '2024-01-15',
      targetSlotTime: '09:00:00',
      intervalMinutes: 30,
      dragIntervalMinutes: 15,
      slotOffset: 30,
      slotSize: 60,
    })

    expect(format(start)).toBe('2024-01-15 09:15')
    expect(format(end)).toBe('2024-01-15 10:15')
  })

  it('keeps a clamped boundary on the drag grid', () => {
    const { start } = calculateDropTime({
      draggedEvent: event,
      targetDate: '2024-01-15',
      targetSlotTime: '23:30:00',
      intervalMinutes: 30,
      dragIntervalMinutes: 15,
      slotOffset: 60,
      slotSize: 60,
      startTime: '00:00:00',
      endTime: '23:59:59',
    })

    expect(format(start)).toBe('2024-01-15 23:45')
  })

  it('uses the range start when no drag-grid point is inside the range', () => {
    const { start } = calculateDropTime({
      draggedEvent: event,
      targetDate: '2024-01-15',
      targetSlotTime: '09:30:00',
      dragIntervalMinutes: 60,
      startTime: '09:30:00',
      endTime: '10:00:00',
    })

    expect(format(start)).toBe('2024-01-15 09:30')
  })
})
