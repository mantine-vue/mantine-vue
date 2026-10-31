import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getDayPosition } from './get-day-position'

describe('@mantine-vue/schedule/get-day-position daylight saving time', () => {
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

  it('uses wall clock time for event positions on the spring forward day', () => {
    const position = getDayPosition({
      event: {
        id: 1,
        title: 'Event',
        start: '2026-03-08 12:00:00',
        end: '2026-03-08 13:00:00',
        color: 'blue',
      },
      startTime: '00:00:00',
      endTime: '24:00:00',
    })

    expect(position.top).toBe(50)
  })
})
