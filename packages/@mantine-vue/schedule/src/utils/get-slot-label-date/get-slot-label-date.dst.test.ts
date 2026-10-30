import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getSlotLabelDate } from './get-slot-label-date'

describe('@mantine-vue/schedule/get-slot-label-date daylight saving time', () => {
  const previousTimezone = process.env.TZ

  beforeAll(() => {
    process.env.TZ = 'America/New_York'
  })

  afterAll(() => {
    if (previousTimezone === undefined) {
      delete process.env.TZ
    } else {
      process.env.TZ = previousTimezone
    }
  })

  it('keeps the requested label time on the skipped hour', () => {
    const date = getSlotLabelDate('2026-03-08', '02:00:00')
    expect(date.format('HH:mm')).toBe('02:00')
  })
})
