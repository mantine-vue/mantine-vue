import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { getCurrentTimePosition } from './get-current-time-position'

describe('@mantine-vue/schedule/get-current-time-position daylight saving time', () => {
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

  it('uses wall clock time for the current time indicator', () => {
    expect(
      getCurrentTimePosition({
        now: '2026-03-08 12:00:00',
        startTime: '00:00:00',
        endTime: '24:00:00',
      }),
    ).toBe(50)
  })
})
