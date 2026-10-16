import { describe, expect, it } from 'vitest'
import { clampResizeSize, getCollapseState } from './clamp-resize-size'

describe('@mantine-vue/core/AppShell resize utilities', () => {
  it('clamps size to configured and viewport bounds', () => {
    expect(clampResizeSize({ size: 50, min: 100, max: 400, viewportMax: 300 })).toBe(100)
    expect(clampResizeSize({ size: 500, min: 100, max: 400, viewportMax: 300 })).toBe(300)
    expect(clampResizeSize({ size: 240, min: 100, max: 400, viewportMax: 300 })).toBe(240)
  })

  it('does not let minimum size exceed the available viewport', () => {
    expect(clampResizeSize({ size: 500, min: 300, max: undefined, viewportMax: 180 })).toBe(180)
  })

  it('reports collapse only below the configured threshold', () => {
    expect(getCollapseState(99, 100)).toBe(true)
    expect(getCollapseState(100, 100)).toBe(false)
    expect(getCollapseState(0, undefined)).toBe(false)
  })
})
