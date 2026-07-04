import { describe, expect, it } from 'vitest'
import { getChevronRotation } from '../get-chevron-rotation'
import {
  clamp,
  getNextIndicatorIndex,
  getPreviousIndicatorIndex,
} from '../get-indicator-navigation'

describe('@mantine-vue/carousel utils', () => {
  describe('getChevronRotation', () => {
    it('returns 90deg for previous control in horizontal ltr', () => {
      expect(
        getChevronRotation({ dir: 'ltr', orientation: 'horizontal', direction: 'previous' }),
      ).toBe(90)
    })

    it('returns -90deg for previous control in horizontal rtl', () => {
      expect(
        getChevronRotation({ dir: 'rtl', orientation: 'horizontal', direction: 'previous' }),
      ).toBe(-90)
    })

    it('returns -180deg for previous control in vertical orientation regardless of dir', () => {
      expect(
        getChevronRotation({ dir: 'ltr', orientation: 'vertical', direction: 'previous' }),
      ).toBe(-180)
      expect(
        getChevronRotation({ dir: 'rtl', orientation: 'vertical', direction: 'previous' }),
      ).toBe(-180)
    })

    it('returns -90deg for next control in horizontal ltr', () => {
      expect(getChevronRotation({ dir: 'ltr', orientation: 'horizontal', direction: 'next' })).toBe(
        -90,
      )
    })

    it('returns 90deg for next control in horizontal rtl', () => {
      expect(getChevronRotation({ dir: 'rtl', orientation: 'horizontal', direction: 'next' })).toBe(
        90,
      )
    })

    it('returns 0deg for next control in vertical orientation regardless of dir', () => {
      expect(getChevronRotation({ dir: 'ltr', orientation: 'vertical', direction: 'next' })).toBe(0)
      expect(getChevronRotation({ dir: 'rtl', orientation: 'vertical', direction: 'next' })).toBe(0)
    })
  })

  describe('getNextIndicatorIndex', () => {
    it('advances to the next index', () => {
      expect(getNextIndicatorIndex(0, 5)).toBe(1)
      expect(getNextIndicatorIndex(3, 5)).toBe(4)
    })

    it('wraps around to 0 at the last index', () => {
      expect(getNextIndicatorIndex(4, 5)).toBe(0)
    })
  })

  describe('getPreviousIndicatorIndex', () => {
    it('goes to the previous index', () => {
      expect(getPreviousIndicatorIndex(4, 5)).toBe(3)
      expect(getPreviousIndicatorIndex(1, 5)).toBe(0)
    })

    it('wraps around to the last index at 0', () => {
      expect(getPreviousIndicatorIndex(0, 5)).toBe(4)
    })
  })

  describe('clamp', () => {
    it('returns the value when within bounds', () => {
      expect(clamp(3, 0, 5)).toBe(3)
    })

    it('clamps to min when below range', () => {
      expect(clamp(-2, 0, 5)).toBe(0)
    })

    it('clamps to max when above range', () => {
      expect(clamp(10, 0, 5)).toBe(5)
    })

    it('clamps correctly when max < min (empty carousel, total - 1 = -1)', () => {
      expect(clamp(0, 0, -1)).toBe(-1)
    })
  })
})
