import { describe, expect, it } from 'vitest'
import { rgba } from './color-functions'

describe('@mantine-vue/core/color-functions', () => {
  it('preserves zero alpha of hsla colors', () => {
    expect(rgba('hsla(0, 100%, 50%, 0)', 0)).toBe('rgba(255, 0, 0, 0)')
  })
})
