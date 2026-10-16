import { describe, expect, it, vi } from 'vitest'
import { testUtils } from '../../test-utils'
import { isEventPlacementAllowed } from './is-event-placement-allowed'

describe('@mantine-vue/schedule isEventPlacementAllowed', () => {
  it('rejects overlaps and ignores the event being moved', () => {
    const event = testUtils.createEvent({ id: 1 })
    const conflict = testUtils.createEvent({ id: 2, start: '2025-01-15 11:00:00' })
    const result = isEventPlacementAllowed({
      event,
      start: '2025-01-15 10:30:00',
      end: '2025-01-15 12:30:00',
      events: [event, conflict],
      preventEventOverlap: true,
    })

    expect(result.allowed).toBe(false)
    expect(result.conflicts).toEqual([conflict])
  })

  it('scopes conflicts by resource and delegates to a custom predicate', () => {
    const predicate = vi.fn(() => false)
    const event = testUtils.createEvent({ id: 1, resourceId: 'a' })
    const otherResource = testUtils.createEvent({ id: 2, resourceId: 'b' })
    const sameResource = testUtils.createEvent({ id: 3, resourceId: 'a' })
    const result = isEventPlacementAllowed({
      event,
      start: '2025-01-15 10:30:00',
      end: '2025-01-15 12:30:00',
      events: [otherResource, sameResource],
      resourceId: 'a',
      preventEventOverlap: predicate,
    })

    expect(result.allowed).toBe(true)
    expect(predicate).toHaveBeenCalledOnce()
    expect(predicate).toHaveBeenCalledWith(
      sameResource,
      expect.objectContaining({ resourceId: 'a' }),
    )
  })
})
