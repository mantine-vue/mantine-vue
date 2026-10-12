import { describe, expect, it } from 'vitest'
import { reserveRow } from './reserve-row'

describe('@mantine-vue/schedule reserveRow', () => {
  it('reserves the first free row across every spanned day', () => {
    const nextRowByDay = [0, 1, 3, 2, 0, 0, 0]

    expect(reserveRow({ nextRowByDay, startDayIndex: 1, daysSpanned: 3 })).toBe(3)
    expect(nextRowByDay).toEqual([0, 4, 4, 4, 0, 0, 0])
  })

  it('keeps reservations outside of the event span unchanged', () => {
    const nextRowByDay = [2, 0, 0, 1]

    reserveRow({ nextRowByDay, startDayIndex: 1, daysSpanned: 2 })
    expect(nextRowByDay).toEqual([2, 1, 1, 1])
  })
})
