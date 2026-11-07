import { describe, expect, it } from 'vitest'
import { rgba, toRgba } from './color-functions'

describe('@mantine-vue/core/color-functions', () => {
  it('preserves zero alpha of hsla colors', () => {
    expect(rgba('hsla(0, 100%, 50%, 0)', 0)).toBe('rgba(255, 0, 0, 0)')
  })

  it('parses four-digit hex colors', () => {
    expect(toRgba('#abcd')).toEqual({ r: 170, g: 187, b: 204, a: 221 / 255 })
  })
})
